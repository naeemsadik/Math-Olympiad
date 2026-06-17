<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class Certificate extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'user_id', 'student_name', 'student_id_str',
        'dept', 'institute', 'achievement', 'event', 'event_type',
        'description', 'issued_at', 'tier', 'issued_by',
        'signatory_name', 'signatory_title', 'status',
    ];

    protected $casts = [
        'issued_at' => 'date',
    ];

    protected $logAttributes = ['id', 'student_name', 'status'];
    protected $logOnlyDirty = true;
    protected $logName = 'certificate';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }
}
