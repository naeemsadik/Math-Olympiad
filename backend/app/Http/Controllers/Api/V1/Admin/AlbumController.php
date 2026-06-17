<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\AlbumPhoto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AlbumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Album::query();
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }
        $albums = $query->withCount('photos')->orderByDesc('event_date')->paginate(25);

        return response()->json([
            'data' => $albums->getCollection()->map(fn ($a) => $this->serialize($a))->values(),
            'meta' => [
                'current_page' => $albums->currentPage(),
                'last_page' => $albums->lastPage(),
                'total' => $albums->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateAlbum($request);
        $album = Album::create($data);
        return response()->json(['data' => $this->serialize($album)], 201);
    }

    public function show(int $id): JsonResponse
    {
        $album = Album::with('photos')->findOrFail($id);
        return response()->json(['data' => $this->serialize($album, true)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $album = Album::findOrFail($id);
        $data = $this->validateAlbum($request, $album->id);
        $album->fill($data)->save();
        return response()->json(['data' => $this->serialize($album)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $album = Album::findOrFail($id);
        $album->photos()->delete();
        $album->delete();
        return response()->json(['message' => 'Album deleted.']);
    }

    public function addPhoto(Request $request, int $id): JsonResponse
    {
        $album = Album::findOrFail($id);
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'caption' => 'nullable|string|max:500',
        ]);

        $path = $request->file('image')->store("albums/{$album->id}", 'public');
        $photo = $album->photos()->create([
            'image_path' => Storage::url($path),
            'caption' => $request->input('caption'),
            'order' => $album->photos()->count(),
        ]);
        return response()->json(['data' => $this->serializePhoto($photo)], 201);
    }

    public function removePhoto(int $id, int $photoId): JsonResponse
    {
        $photo = AlbumPhoto::where('album_id', $id)->findOrFail($photoId);
        $photo->delete();
        return response()->json(['message' => 'Photo removed.']);
    }

    protected function validateAlbum(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'cover_image' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:200',
            'is_featured' => 'boolean',
        ]);
    }

    protected function serialize(Album $a, bool $withPhotos = false): array
    {
        $data = [
            'id' => (string) $a->id,
            'title' => $a->title,
            'description' => $a->description,
            'eventDate' => $a->event_date?->toDateString(),
            'coverImage' => $a->cover_image,
            'location' => $a->location,
            'isFeatured' => (bool) $a->is_featured,
            'photoCount' => (int) ($a->photos_count ?? $a->photos()->count()),
        ];
        if ($withPhotos) {
            $data['photos'] = $a->photos->map(fn ($p) => $this->serializePhoto($p))->values();
        }
        return $data;
    }

    protected function serializePhoto(AlbumPhoto $p): array
    {
        return [
            'id' => (string) $p->id,
            'imageUrl' => $p->image_path,
            'caption' => $p->caption,
            'order' => (int) $p->order,
        ];
    }
}
