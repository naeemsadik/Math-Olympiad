<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\NoticeResource;
use App\Models\Notice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Notice::query();
        if ($audience = $request->query('audience')) {
            $query->where('audience', $audience);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%"));
        }
        $notices = $query->orderByDesc('pinned')->orderByDesc('published_at')->paginate(25);

        return response()->json([
            'data' => NoticeResource::collection($notices->items()),
            'meta' => [
                'current_page' => $notices->currentPage(),
                'last_page' => $notices->lastPage(),
                'total' => $notices->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateNotice($request);
        $data['author_id'] = $request->user()->id;
        $notice = Notice::create($data);
        return response()->json(['data' => new NoticeResource($notice)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $notice = Notice::findOrFail($id);
        $data = $this->validateNotice($request, $notice->id);
        $notice->fill($data)->save();
        return response()->json(['data' => new NoticeResource($notice)]);
    }

    public function destroy(int $id): JsonResponse
    {
        Notice::findOrFail($id)->delete();
        return response()->json(['message' => 'Notice deleted.']);
    }

    public function togglePin(int $id): JsonResponse
    {
        $notice = Notice::findOrFail($id);
        $notice->pinned = ! $notice->pinned;
        $notice->save();
        return response()->json(['data' => new NoticeResource($notice)]);
    }

    protected function validateNotice(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:200',
            'body' => 'required|string',
            'tier' => ['required', Rule::in(['All', 'Beginner', 'Intermediate', 'Advanced'])],
            'audience' => ['required', Rule::in(['all', 'students', 'faculty'])],
            'priority' => ['nullable', Rule::in(['low', 'normal', 'high', 'urgent'])],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'pinned' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
        ]);
    }
}
