<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommunityPostResource;
use App\Models\CommunityLike;
use App\Models\CommunityPost;
use App\Models\CommunityReply;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommunityController extends Controller
{
    public function postIndex(Request $request): JsonResponse
    {
        $query = CommunityPost::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%"));
        }
        $posts = $query->orderByDesc('pinned')->orderByDesc('id')->paginate(25);

        return response()->json([
            'data' => $posts->getCollection()->map(fn ($p) => $this->serializePost($p))->values(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function postUpdate(Request $request, int $id): JsonResponse
    {
        $post = CommunityPost::findOrFail($id);
        $data = $request->validate([
            'status' => ['sometimes', Rule::in(['visible', 'hidden', 'flagged', 'removed'])],
            'pinned' => 'sometimes|boolean',
            'category' => ['nullable', Rule::in(['general', 'strategy', 'question', 'announcement'])],
        ]);
        $post->fill($data)->save();
        return response()->json(['data' => $this->serializePost($post)]);
    }

    public function postDestroy(int $id): JsonResponse
    {
        CommunityPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Post deleted.']);
    }

    public function togglePin(int $id): JsonResponse
    {
        $post = CommunityPost::findOrFail($id);
        $post->pinned = ! $post->pinned;
        $post->save();
        return response()->json(['data' => $this->serializePost($post)]);
    }

    public function replyIndex(Request $request, int $postId): JsonResponse
    {
        $post = CommunityPost::findOrFail($postId);
        $replies = CommunityReply::where('post_id', $post->id)
            ->orderBy('created_at')
            ->paginate(50);
        return response()->json([
            'data' => $replies->getCollection()->map(fn ($r) => $this->serializeReply($r))->values(),
            'meta' => [
                'current_page' => $replies->currentPage(),
                'last_page' => $replies->lastPage(),
                'total' => $replies->total(),
            ],
        ]);
    }

    public function replyDestroy(int $postId, int $replyId): JsonResponse
    {
        CommunityReply::where('post_id', $postId)->findOrFail($replyId)->delete();
        return response()->json(['message' => 'Reply deleted.']);
    }

    protected function serializePost(CommunityPost $p): array
    {
        $author = User::find($p->user_id);
        $replyCount = CommunityReply::where('post_id', $p->id)->count();
        $likeCount = CommunityLike::where('post_id', $p->id)->count();
        return [
            'id' => (string) $p->id,
            'author' => $author ? [
                'id' => (string) $author->id,
                'name' => $author->name,
                'email' => $author->email,
            ] : null,
            'category' => $p->category,
            'title' => $p->title,
            'body' => $p->body,
            'pinned' => (bool) $p->pinned,
            'status' => $p->status,
            'replies' => $replyCount,
            'likes' => $likeCount,
            'createdAt' => $p->created_at?->toIso8601String(),
        ];
    }

    protected function serializeReply(CommunityReply $r): array
    {
        $author = User::find($r->user_id);
        return [
            'id' => (string) $r->id,
            'postId' => (string) $r->post_id,
            'author' => $author ? [
                'id' => (string) $author->id,
                'name' => $author->name,
            ] : null,
            'body' => $r->body,
            'createdAt' => $r->created_at?->toIso8601String(),
        ];
    }
}
