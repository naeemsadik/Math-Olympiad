<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\HallOfFameResource;
use App\Models\HallOfFameEntry;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HallOfFameController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = HallOfFameEntry::query();
        if ($year = $request->query('year')) {
            $query->where('year', $year);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        $entries = $query->orderByDesc('year')->orderBy('rank')->paginate(25);

        return response()->json([
            'data' => $entries->getCollection()->map(fn ($e) => $this->serialize($e))->values(),
            'meta' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'total' => $entries->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateEntry($request);
        $entry = HallOfFameEntry::create($data);
        return response()->json(['data' => $this->serialize($entry)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $entry = HallOfFameEntry::findOrFail($id);
        $data = $this->validateEntry($request, $entry->id);
        $entry->fill($data)->save();
        return response()->json(['data' => $this->serialize($entry)]);
    }

    public function destroy(int $id): JsonResponse
    {
        HallOfFameEntry::findOrFail($id)->delete();
        return response()->json(['message' => 'Hall of fame entry deleted.']);
    }

    protected function validateEntry(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:160',
            'category' => ['required', Rule::in(['Champion', 'Finalist', 'Honorable Mention', 'Top Performer'])],
            'rank' => 'nullable|integer|min:1',
            'year' => 'required|integer|min:2000|max:2100',
            'event' => 'nullable|string|max:200',
            'bio' => 'nullable|string',
            'image_path' => 'nullable|string|max:255',
            'highlight' => 'nullable|string',
        ]);
    }

    protected function serialize(HallOfFameEntry $e): array
    {
        $user = $e->user_id ? User::find($e->user_id) : null;
        return [
            'id' => (string) $e->id,
            'name' => $e->name,
            'category' => $e->category,
            'rank' => (int) $e->rank,
            'year' => (int) $e->year,
            'event' => $e->event,
            'bio' => $e->bio,
            'imagePath' => $e->image_path,
            'highlight' => $e->highlight,
            'userId' => $e->user_id ? (string) $e->user_id : null,
            'linked' => (bool) $user,
        ];
    }
}
