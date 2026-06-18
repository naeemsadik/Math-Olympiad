<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;

class Lesson extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'module_id', 'title', 'content', 'key_points',
        'example_problem', 'example_solution', 'resources',
        'estimated_minutes', 'order',
    ];

    protected $casts = [
        'key_points' => 'array',
        'resources' => 'array',
    ];

    protected $logAttributes = ['title', 'module_id'];
    protected $logOnlyDirty = true;
    protected $logName = 'lesson';

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }
}
