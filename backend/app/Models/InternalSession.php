<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class InternalSession extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'title', 'subtitle', 'date', 'time', 'type', 'type_color',
        'topic', 'speaker', 'scheduled_at', 'duration_minutes',
        'meeting_url', 'capacity', 'registered_count', 'status', 'description',
    ];

    protected $casts = [
        'date' => 'date',
        'scheduled_at' => 'datetime',
    ];

    protected $logAttributes = ['title', 'type', 'date', 'status'];
    protected $logOnlyDirty = true;
    protected $logName = 'internal_session';
}