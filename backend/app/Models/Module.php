<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;

class Module extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'topic_id', 'name', 'description', 'difficulty', 'order', 'lesson_count',
    ];

    protected $logAttributes = ['name', 'topic_id', 'difficulty'];
    protected $logOnlyDirty = true;
    protected $logName = 'module';

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }
}
