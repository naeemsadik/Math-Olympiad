<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttemptTopicBreakdown extends Model
{
    use HasFactory;

    protected $table = 'attempt_topic_breakdown';
    public $timestamps = false;
    protected $fillable = [
        'test_attempt_id', 'topic_id', 'correct', 'total', 'accuracy',
    ];

    protected $casts = [
        'accuracy' => 'decimal:2',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(TestAttempt::class, 'test_attempt_id');
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
}
