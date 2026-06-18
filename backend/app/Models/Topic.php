<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;

class Topic extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'slug', 'name', 'description', 'tier', 'level',
        'color', 'image_path', 'lesson_count', 'problem_count',
    ];

    protected $logAttributes = ['name', 'slug', 'tier', 'level'];
    protected $logOnlyDirty = true;
    protected $logName = 'topic';

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    public function liveExams(): HasMany
    {
        return $this->hasMany(LiveExam::class);
    }
}
