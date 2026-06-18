<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommunityPostResource;
use App\Models\CommunityLike;
use App\Models\CommunityPost;
use App\Models\CommunityReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommunityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CommunityPost::with('author');

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('body', 'like', "%{$search}%"));
        }

        $posts = $query->orderByDesc('pinned')->orderByDesc('created_at')
            ->withCount('replies')
            ->paginate(20);

        return response()->json([
            'data' => CommunityPostResource::collection($posts->items()),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:200',
            'body' => 'required|string',
            'category' => ['required', Rule::in(['Algebra', 'Combinatorics', 'Number Theory', 'Geometry', 'General'])],
            'tier' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced'])],
            'tags' => 'nullable|array',
        ]);

        $post = CommunityPost::create([
            ...$data,
            'author_id' => $request->user()->id,
            'author_institute' => $request->user()->institute,
        ]);

        return response()->json([
            'data' => (new CommunityPostResource($post->load('author')))->resolve(),
        ], 201);
    }

    public function like(Request $request, int $id): JsonResponse
    {
        $post = CommunityPost::findOrFail($id);
        $existing = CommunityLike::where('post_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $post->decrement('likes');
            return response()->json(['liked' => false, 'count' => (int) $post->fresh()->likes]);
        }

        CommunityLike::create(['post_id' => $id, 'user_id' => $request->user()->id]);
        $post->increment('likes');
        return response()->json(['liked' => true, 'count' => (int) $post->fresh()->likes]);
    }

    public function replies(Request $request, int $id): JsonResponse
    {
        $replies = CommunityReply::where('post_id', $id)
            ->with('author')
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $replies->map(fn ($r) => [
                'id' => (string) $r->id,
                'postId' => (string) $r->post_id,
                'body' => $r->body,
                'author' => $r->author?->name,
                'authorInstitute' => $r->author?->institute,
                'createdAt' => $r->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function storeReply(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['body' => 'required|string']);
        $post = CommunityPost::findOrFail($id);

        $reply = CommunityReply::create([
            'post_id' => $post->id,
            'author_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return response()->json([
            'data' => [
                'id' => (string) $reply->id,
                'postId' => (string) $reply->post_id,
                'body' => $reply->body,
                'author' => $reply->author?->name,
                'createdAt' => $reply->created_at?->toIso8601String(),
            ],
        ], 201);
    }
}
