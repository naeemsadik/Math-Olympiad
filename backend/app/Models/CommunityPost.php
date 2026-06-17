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

class CommunityPost extends Model
{
    use HasFactory, HasActivityLog, LogsActivity, SoftDeletes;

    protected $fillable = [
        'title', 'body', 'category', 'author_id', 'author_institute',
        'tier', 'views', 'likes', 'pinned', 'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'pinned' => 'boolean',
    ];

    protected $logAttributes = ['title', 'category', 'pinned'];
    protected $logOnlyDirty = true;
    protected $logName = 'community_post';

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(CommunityReply::class, 'post_id');
    }

    public function likers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_likes')
            ->withTimestamps();
    }
}
