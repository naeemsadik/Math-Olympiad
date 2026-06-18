<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Traits\HasActivityLog;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasActivityLog, HasFactory, HasRoles, InteractsWithMedia, LogsActivity, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'tier',
        'level',
        'xp',
        'streak',
        'last_active_at',
        'institute',
        'university',
        'department',
        'institution_type',
        'class_year',
        'gender',
        'dob',
        'phone',
        'whatsapp',
        'address',
        'about',
        'avatar_path',
        'joined_at',
        'status',
        'placement_done',
        'diagnostic_ability_level',
        'diagnostic_score',
        'diagnostic_completed_at',
        'diagnostic_attempt_id',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'joined_at' => 'datetime',
            'last_active_at' => 'date',
            'dob' => 'date',
            'diagnostic_completed_at' => 'datetime',
            'placement_done' => 'boolean',
            'xp' => 'integer',
            'streak' => 'integer',
        ];
    }

    // ---------- Spatie Activitylog ----------
    protected $logAttributes = [
        'name', 'email', 'role', 'tier', 'level', 'xp', 'streak',
        'institute', 'department', 'institution_type', 'class_year',
        'placement_done', 'diagnostic_ability_level', 'diagnostic_score',
    ];
    protected $logOnlyDirty = true;
    protected $logName = 'user';

    // ---------- Helpers ----------
    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->hasRole('admin');
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    // ---------- Relations ----------
    public function testAttempts(): HasMany
    {
        return $this->hasMany(TestAttempt::class);
    }

    public function diagnosticAttempts(): HasMany
    {
        return $this->hasMany(DiagnosticAttempt::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function puzzleSubmissions(): HasMany
    {
        return $this->hasMany(PuzzleSubmission::class);
    }

    public function communityPosts(): HasMany
    {
        return $this->hasMany(CommunityPost::class, 'author_id');
    }

    public function communityLikes(): HasMany
    {
        return $this->hasMany(CommunityLike::class);
    }

    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function activities()
    {
        return $this->morphMany(Activity::class, 'causable');
    }
}
