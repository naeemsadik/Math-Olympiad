<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'name' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'email', 'max:190', Rule::unique('users', 'email')->ignore($userId)],
            'gender' => ['nullable', 'string', 'max:30'],
            'dob' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'institute' => ['nullable', 'string', 'max:190'],
            'university' => ['nullable', 'string', 'max:190'],
            'department' => ['nullable', 'string', 'max:120'],
            'institutionType' => ['nullable', Rule::in(['School', 'College', 'University', 'Graduate'])],
            'classYear' => ['nullable', 'string', 'max:60'],
            'about' => ['nullable', 'string'],
        ];
    }
}
