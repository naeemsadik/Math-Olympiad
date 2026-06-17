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
        'capacity', 'status', 'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    protected $logAttributes = ['title', 'type', 'status'];
    protected $logOnlyDirty = true;
    protected $logName = 'registration_event';

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}
