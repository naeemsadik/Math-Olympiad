<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;

class Test extends Model
{
    use HasFactory, HasActivityLog, LogsActivity, SoftDeletes;

    protected $fillable = [
        'title', 'description', 'duration', 'difficulty', 'tier',
        'topic_id', 'question_count', 'is_public', 'source', 'tags',
        'test_type', 'target_class_year', 'ability_level',
        'random_question_count', 'advanced_threshold', 'expert_threshold',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_public' => 'boolean',
    ];

    protected $logAttributes = ['title', 'test_type', 'tier', 'ability_level', 'is_public'];
    protected $logOnlyDirty = true;
    protected $logName = 'test';

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'test_questions')
            ->withPivot('order')
            ->orderBy('test_questions.order');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(TestAttempt::class);
    }

    public function liveExams(): HasMany
    {
        return $this->hasMany(LiveExam::class);
    }
}
