<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentWidget extends Model
{
    use HasFactory;

    protected $fillable = ['page_slug', 'widget_type', 'position', 'data'];

    protected $casts = [
        'data' => 'array',
    ];
}
