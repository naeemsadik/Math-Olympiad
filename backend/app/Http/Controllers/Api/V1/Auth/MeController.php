<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $map = [
            'name' => 'name',
            'email' => 'email',
            'gender' => 'gender',
            'dob' => 'dob',
            'phone' => 'phone',
            'whatsapp' => 'whatsapp',
            'address' => 'address',
            'institute' => 'institute',
            'university' => 'university',
            'department' => 'department',
            'institutionType' => 'institution_type',
            'classYear' => 'class_year',
            'about' => 'about',
        ];

        $payload = [];
        foreach ($map as $input => $column) {
            if (array_key_exists($input, $data)) {
                $payload[$column] = $data[$input];
            }
        }
        $user->fill($payload)->save();

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }
}
