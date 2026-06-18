<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContentPageResource;
use App\Http\Resources\HomeSectionResource;
use App\Models\ContentPage;
use App\Models\ContentWidget;
use App\Models\HomeSection;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ContentController extends Controller
{
    public function pageIndex(Request $request): JsonResponse
    {
        $query = ContentPage::query();
        if ($status = $request->query('status')) {
            $query->where(function ($q) use ($status) {
                if ($status === 'published') {
                    $q->whereNotNull('published_at');
                } elseif ($status === 'draft') {
                    $q->whereNull('published_at');
                }
            });
        }
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }
        $pages = $query->orderByDesc('id')->paginate(25);
        return response()->json([
            'data' => $pages->getCollection()->map(fn ($p) => $this->serializePage($p))->values(),
            'meta' => [
                'current_page' => $pages->currentPage(),
                'last_page' => $pages->lastPage(),
                'total' => $pages->total(),
            ],
        ]);
    }

    public function pageShow(int $id): JsonResponse
    {
        $page = ContentPage::findOrFail($id);
        return response()->json(['data' => $this->serializePage($page, true)]);
    }

    public function pageStore(Request $request): JsonResponse
    {
        $data = $this->validatePage($request);
        $page = DB::transaction(function () use ($data) {
            $page = ContentPage::create($data);
            if (isset($data['widgets'])) {
                $this->syncWidgets($page->slug, $data['widgets']);
            }
            return $page;
        });
        return response()->json(['data' => $this->serializePage($page, true)], 201);
    }

    public function pageUpdate(Request $request, int $id): JsonResponse
    {
        $page = ContentPage::findOrFail($id);
        $data = $this->validatePage($request, $page->id);
        $oldSlug = $page->slug;
        DB::transaction(function () use ($page, $data, $oldSlug) {
            $page->fill($data)->save();
            if (isset($data['widgets'])) {
                ContentWidget::where('page_slug', $oldSlug)->delete();
                $this->syncWidgets($page->slug, $data['widgets']);
            }
        });
        return response()->json(['data' => $this->serializePage($page->fresh(), true)]);
    }

    public function pageDestroy(int $id): JsonResponse
    {
        $page = ContentPage::findOrFail($id);
        ContentWidget::where('page_slug', $page->slug)->delete();
        $page->delete();
        return response()->json(['message' => 'Page deleted.']);
    }

    public function homeSectionIndex(): JsonResponse
    {
        $sections = HomeSection::orderBy('sort_order')->get();
        return response()->json(['data' => $sections->map(fn ($s) => $this->serializeSection($s))->values()]);
    }

    public function homeSectionUpdate(Request $request, int $id): JsonResponse
    {
        $section = HomeSection::findOrFail($id);
        $data = $request->validate([
            'section_key' => ['sometimes', 'string', 'max:60', Rule::unique('home_sections', 'section_key')->ignore($section->id)],
            'title' => 'sometimes|string|max:200',
            'subtitle' => 'nullable|string',
            'data' => 'nullable|array',
            'sort_order' => 'sometimes|integer',
            'published' => 'sometimes|boolean',
        ]);
        $section->fill($data)->save();
        return response()->json(['data' => $this->serializeSection($section)]);
    }

    public function homeSectionStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'section_key' => ['required', 'string', 'max:60', Rule::unique('home_sections', 'section_key')],
            'title' => 'required|string|max:200',
            'subtitle' => 'nullable|string',
            'data' => 'nullable|array',
            'sort_order' => 'nullable|integer',
            'published' => 'sometimes|boolean',
        ]);
        $section = HomeSection::create($data);
        return response()->json(['data' => $this->serializeSection($section)], 201);
    }

    public function homeSectionReorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:home_sections,id',
        ]);
        foreach ($data['order'] as $i => $id) {
            HomeSection::where('id', $id)->update(['sort_order' => $i]);
        }
        return response()->json(['message' => 'Reordered.']);
    }

    public function settingsIndex(): JsonResponse
    {
        $settings = SiteSetting::orderBy('key')->get();
        return response()->json([
            'data' => $settings->mapWithKeys(fn ($s) => [
                $s->key => $this->castSettingValue($s),
            ])->toArray(),
        ]);
    }

    public function settingsShow(string $key): JsonResponse
    {
        $setting = SiteSetting::findOrFail($key);
        return response()->json(['data' => $setting]);
    }

    public function settingsUpdate(Request $request, string $key): JsonResponse
    {
        $data = $request->validate([
            'value' => 'nullable',
            'type' => ['nullable', Rule::in(['string', 'integer', 'boolean', 'json'])],
        ]);
        $stored = match ($data['type'] ?? 'string') {
            'json'    => json_encode($data['value']),
            'boolean' => $data['value'] ? '1' : '0',
            default   => (string) $data['value'],
        };
        $setting = SiteSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $stored, 'type' => $data['type'] ?? 'string']
        );
        return response()->json(['data' => $setting]);
    }

    public function settingsDestroy(string $key): JsonResponse
    {
        SiteSetting::findOrFail($key)->delete();
        return response()->json(['message' => 'Setting deleted.']);
    }

    protected function validatePage(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:60', Rule::unique('content_pages', 'slug')->ignore($ignoreId)],
            'title' => 'required|string|max:200',
            'intro' => 'nullable|string',
            'body' => 'nullable|string',
            'meta' => 'nullable|array',
            'published_at' => 'nullable|date',
            'widgets' => 'nullable|array',
            'widgets.*.widget_type' => ['required_with:widgets', 'string', 'max:60'],
            'widgets.*.data' => 'required_with:widgets|array',
            'widgets.*.position' => 'nullable|integer',
        ]);
    }

    protected function syncWidgets(string $pageSlug, array $widgets): void
    {
        foreach ($widgets as $i => $w) {
            ContentWidget::create([
                'page_slug' => $pageSlug,
                'widget_type' => $w['widget_type'],
                'data' => $w['data'],
                'position' => $w['position'] ?? $i,
            ]);
        }
    }

    protected function serializePage(ContentPage $p, bool $withWidgets = false): array
    {
        $data = [
            'id' => (string) $p->id,
            'slug' => $p->slug,
            'title' => $p->title,
            'intro' => $p->intro,
            'body' => $p->body,
            'meta' => $p->meta,
            'status' => $p->published_at ? 'published' : 'draft',
            'publishedAt' => $p->published_at?->toIso8601String(),
            'createdAt' => $p->created_at?->toIso8601String(),
            'updatedAt' => $p->updated_at?->toIso8601String(),
        ];
        if ($withWidgets) {
            $data['widgets'] = ContentWidget::where('page_slug', $p->slug)
                ->orderBy('position')
                ->get()
                ->map(fn ($w) => [
                    'id' => (string) $w->id,
                    'widgetType' => $w->widget_type,
                    'data' => $w->data,
                    'position' => (int) $w->position,
                ])->values();
        }
        return $data;
    }

    protected function serializeSection(HomeSection $s): array
    {
        return [
            'id' => (string) $s->id,
            'sectionKey' => $s->section_key,
            'title' => $s->title,
            'subtitle' => $s->subtitle,
            'data' => $s->data,
            'sortOrder' => (int) $s->sort_order,
            'published' => (bool) $s->published,
        ];
    }

    protected function castSettingValue(SiteSetting $s): mixed
    {
        return match ($s->type) {
            'json'    => json_decode($s->value, true),
            'boolean' => filter_var($s->value, FILTER_VALIDATE_BOOL),
            'integer' => (int) $s->value,
            default   => $s->value,
        };
    }
}
