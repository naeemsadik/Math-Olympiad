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
        'title', 'type', 'date', 'time', 'location', 'description',
        'is_internal', 'official_link', 'registration_link',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'string',
        'is_internal' => 'boolean',
    ];

    protected $logAttributes = ['title', 'type', 'date'];
    protected $logOnlyDirty = true;
    protected $logName = 'olympiad_event';
}
