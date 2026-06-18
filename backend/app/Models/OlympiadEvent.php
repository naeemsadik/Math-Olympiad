<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class OlympiadEvent extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'title', 'type', 'date', 'time', 'location',
        'venue', 'city', 'country', 'description',
        'start_date', 'end_date', 'registration_deadline', 'registration_url',
        'is_internal', 'official_link', 'registration_link',
        'status', 'level', 'is_featured', 'image_path', 'tags',
    ];

    protected $casts = [
        'date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'registration_deadline' => 'date',
        'time' => 'string',
        'is_internal' => 'boolean',
        'is_featured' => 'boolean',
        'tags' => 'array',
    ];

    protected $logAttributes = ['title', 'type', 'status', 'date'];
    protected $logOnlyDirty = true;
    protected $logName = 'olympiad_event';
}