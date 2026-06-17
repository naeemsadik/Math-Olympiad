<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $classYears = [
            'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
            'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
            'Class 11', 'Class 12',
            '1st Year', '2nd Year', '3rd Year', '4th Year',
            'Masters', 'PhD', 'Post-Doc',
            'All Classes',
        ];

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'institutionType' => ['required', Rule::in(['School', 'College', 'University', 'Graduate'])],
            'classYear' => ['nullable', Rule::in($classYears)],
            'institute' => ['required', 'string', 'max:190'],
            'university' => ['nullable', 'string', 'max:190'],
            'department' => ['nullable', 'string', 'max:120'],
            'dob' => ['nullable', 'date'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'gender' => ['nullable', 'string', 'max:30'],
            'phone' => ['nullable', 'string', 'max:30'],
        ];
    }
}
