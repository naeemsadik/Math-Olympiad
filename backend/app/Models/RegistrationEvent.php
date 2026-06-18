<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;

class RegistrationEvent extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'title', 'type', 'type_color', 'date', 'location',
        'venue', 'start_at', 'end_at', 'registration_deadline',
        'capacity', 'fee', 'currency', 'status', 'description',
        'requires_approval', 'cover_image', 'category',
    ];

    protected $casts = [
        'date' => 'date',
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'registration_deadline' => 'datetime',
        'fee' => 'decimal:2',
        'requires_approval' => 'boolean',
    ];

    protected $logAttributes = ['title', 'type', 'status'];
    protected $logOnlyDirty = true;
    protected $logName = 'registration_event';

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}