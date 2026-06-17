<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\DiagnosticAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('institute', 'like', "%{$search}%"));
        }
        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        $users = $query->orderByDesc('id')->paginate(25);

        return response()->json([
            'data' => UserResource::collection($users->items()),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::with([
            'testAttempts' => fn ($q) => $q->latest()->limit(20),
            'diagnosticAttempts' => fn ($q) => $q->latest()->limit(5),
        ])->findOrFail($id);

        return response()->json([
            'data' => array_merge(
                (new UserResource($user))->resolve(),
                [
                    'recentAttempts' => $user->testAttempts->map(fn ($a) => [
                        'id' => (string) $a->id,
                        'testTitle' => $a->test_title,
                        'score' => (float) $a->score,
                        'accuracy' => (float) $a->accuracy,
                        'submittedAt' => $a->submitted_at?->toIso8601String(),
                    ])->values(),
                    'diagnosticAttempts' => $user->diagnosticAttempts->map(fn ($a) => [
                        'id' => (string) $a->id,
                        'score' => $a->score,
                        'abilityLevel' => $a->ability_level,
                        'submittedAt' => $a->submitted_at?->toIso8601String(),
                    ])->values(),
                ]
            ),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['student', 'admin', 'faculty'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'level' => $data['role'] === 'admin' ? 'Admin' : 'Newcomer',
            'joined_at' => now(),
        ]);
        $user->assignRole($data['role']);

        return response()->json(['data' => new UserResource($user)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:120',
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['sometimes', Rule::in(['student', 'admin', 'faculty'])],
            'tier' => ['nullable', Rule::in(['Beginner', 'Intermediate', 'Advanced'])],
            'status' => ['sometimes', Rule::in(['active', 'suspended'])],
            'password' => ['sometimes', 'string', 'min:8'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user->fill($data)->save();

        return response()->json(['data' => new UserResource($user)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted.']);
    }

    public function resetDiagnostic(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        DB::transaction(function () use ($user) {
            $user->update([
                'placement_done' => false,
                'diagnostic_ability_level' => null,
                'diagnostic_score' => null,
                'diagnostic_completed_at' => null,
                'diagnostic_attempt_id' => null,
                'tier' => null,
            ]);
            DiagnosticAttempt::where('user_id', $user->id)->delete();
        });
        return response()->json(['message' => 'Diagnostic reset.', 'data' => new UserResource($user)]);
    }
}
