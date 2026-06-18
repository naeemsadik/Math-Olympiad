<?php

namespace App\Models;

use App\Models\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;

class Notice extends Model
{
    use HasFactory, HasActivityLog, LogsActivity;

    protected $fillable = ['title', 'body', 'tier', 'priority', 'audience', 'status', 'pinned', 'expires_at', 'author_id', 'published_at'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected $logAttributes = ['title', 'tier', 'priority'];
    protected $logOnlyDirty = true;
    protected $logName = 'notice';

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
