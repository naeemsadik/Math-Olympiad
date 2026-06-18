<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class PuzzleSubmission extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'puzzle_id', 'user_id', 'answer', 'submitted_at',
        'auto_correct', 'is_correct', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'auto_correct' => 'boolean',
        'is_correct' => 'boolean',
    ];

    protected $logAttributes = ['puzzle_id', 'user_id', 'is_correct'];
    protected $logOnlyDirty = true;
    protected $logName = 'puzzle_submission';

    public function puzzle(): BelongsTo
    {
        return $this->belongsTo(Puzzle::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isPending(): bool
    {
        return $this->is_correct === null;
    }
}
