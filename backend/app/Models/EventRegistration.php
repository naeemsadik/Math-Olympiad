<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class EventRegistration extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'registration_event_id', 'user_id', 'name', 'student_id_str',
        'dept', 'year', 'email', 'phone', 'status', 'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    protected $logAttributes = ['name', 'email', 'status'];
    protected $logOnlyDirty = true;
    protected $logName = 'event_registration';

    public function registrationEvent(): BelongsTo
    {
        return $this->belongsTo(RegistrationEvent::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
