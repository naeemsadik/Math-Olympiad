<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiagnosticAttempt extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'test_id', 'test_title', 'question_ids', 'answers',
        'correct_count', 'score', 'ability_level', 'status',
        'started_at', 'submitted_at',
    ];

    protected $casts = [
        'question_ids' => 'array',
        'answers' => 'array',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }
}
