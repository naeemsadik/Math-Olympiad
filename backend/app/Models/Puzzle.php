<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;

class Puzzle extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = [
        'date', 'title', 'content', 'difficulty', 'tier', 'topic',
        'expected_answer', 'auto_match_normalized', 'streak_count',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    protected $logAttributes = ['title', 'date', 'tier'];
    protected $logOnlyDirty = true;
    protected $logName = 'puzzle';

    public function submissions(): HasMany
    {
        return $this->hasMany(PuzzleSubmission::class);
    }
}
