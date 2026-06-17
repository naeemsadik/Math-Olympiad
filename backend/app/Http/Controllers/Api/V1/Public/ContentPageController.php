<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContentPageResource;
use App\Models\ContentPage;
use App\Models\ContentWidget;
use Illuminate\Http\JsonResponse;

class ContentPageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = ContentPage::where('slug', $slug)
            ->whereNotNull('published_at')
            ->first();

        if (! $page) {
            return response()->json(['message' => 'Page not found.'], 404);
        }

        $widgets = ContentWidget::where('page_slug', $slug)
            ->orderBy('position')
            ->get()
            ->map(fn ($w) => [
                'type' => $w->widget_type,
                'data' => $w->data,
            ]);

        $resource = (new ContentPageResource($page))->resolve();
        $resource['widgets'] = $widgets;

        return response()->json(['data' => $resource]);
    }
}
