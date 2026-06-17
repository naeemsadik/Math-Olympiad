<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key', 'title', 'subtitle', 'data',
        'sort_order', 'published',
    ];

    protected $casts = [
        'data' => 'array',
        'published' => 'boolean',
    ];
}
