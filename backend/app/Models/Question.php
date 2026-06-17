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
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Question extends Model implements HasMedia
{
    use HasFactory, HasActivityLog, InteractsWithMedia, LogsActivity, SoftDeletes;

    protected $fillable = [
        'content', 'topic_id', 'difficulty', 'tier', 'format',
        'prompt_kind', 'prompt_value', 'prompt_alt',
        'ability_level', 'target_class_year', 'marks', 'time_limit_seconds',
        'subtopic_tags', 'source', 'explanation', 'status',
        'is_diagnostic_eligible',
    ];

    protected $casts = [
        'subtopic_tags' => 'array',
        'marks' => 'decimal:2',
        'is_diagnostic_eligible' => 'boolean',
    ];

    protected $logAttributes = ['content', 'topic_id', 'difficulty', 'tier', 'status'];
    protected $logOnlyDirty = true;
    protected $logName = 'question';

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class)->orderBy('order');
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class, 'test_questions')
            ->withPivot('order');
    }

    // Helper: returns the correct option (or null)
    public function correctOption(): ?QuestionOption
    {
        return $this->options->where('is_correct', true)->first();
    }
}
