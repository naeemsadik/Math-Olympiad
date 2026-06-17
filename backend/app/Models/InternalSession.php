<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class InternalSession extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = ['title', 'subtitle', 'date', 'time', 'type', 'type_color'];

    protected $casts = [
        'date' => 'date',
    ];

    protected $logAttributes = ['title', 'type', 'date'];
    protected $logOnlyDirty = true;
    protected $logName = 'internal_session';
}
