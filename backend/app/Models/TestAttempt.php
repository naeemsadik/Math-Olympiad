<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'test_id', 'test_title', 'question_ids',
        'current_index', 'current_question_started_at', 'current_question_deadline',
        'answers', 'status', 'score', 'total_marks', 'accuracy',
        'time_spent_seconds', 'started_at', 'submitted_at',
    ];

    protected $casts = [
        'question_ids' => 'array',
        'answers' => 'array',
        'current_question_started_at' => 'datetime',
        'current_question_deadline' => 'datetime',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'decimal:2',
        'total_marks' => 'decimal:2',
        'accuracy' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function questionAnswers(): HasMany
    {
        return $this->hasMany(AttemptQuestionAnswer::class);
    }

    public function topicBreakdown(): HasMany
    {
        return $this->hasMany(AttemptTopicBreakdown::class);
    }

    public function isComplete(): bool
    {
        return in_array($this->status, ['submitted', 'expired', 'abandoned'], true);
    }
}
