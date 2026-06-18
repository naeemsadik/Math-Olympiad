<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentPage extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'title', 'intro', 'body', 'meta', 'published_at'];

    protected $casts = [
        'meta' => 'array',
        'published_at' => 'datetime',
    ];
}
