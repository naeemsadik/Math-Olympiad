<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class LiveExam extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'title', 'description', 'tier', 'scheduled_at', 'duration',
        'topic_id', 'test_id', 'question_count', 'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    protected $logAttributes = ['title', 'status', 'scheduled_at', 'tier'];
    protected $logOnlyDirty = true;
    protected $logName = 'live_exam';

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function getEndsAtAttribute(): \Illuminate\Support\Carbon
    {
        return $this->scheduled_at->copy()->addMinutes($this->duration);
    }

    public function isLiveNow(): bool
    {
        $now = now();
        return $now->betweenIncluded($this->scheduled_at, $this->ends_at);
    }
}
