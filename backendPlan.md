# Math-Olympiad — Laravel + MySQL Backend Plan

> Comprehensive implementation plan for replacing the current mock/Zustand data layer of the Next.js frontend (`D:\Github\Math-Olympiad`) with a real **Laravel 11 + MySQL** API.

---

## Context

### Why this change
The frontend is fully built but its data layer is entirely client-side:
- 8 Zustand stores (`store/*`) persist data to `localStorage`.
- 10 mock-data fixtures (`lib/mock/*`) seed those stores.
- `lib/api.ts` already declares the expected endpoints but falls back to mocks when `NEXT_PUBLIC_API_URL` is unset.

This works for demos, but blocks real users, multi-device sessions, admin moderation, leaderboard integrity, image uploads, and any analytics. We need a real backend that owns the data, enforces roles, and exposes REST endpoints that match the exact shapes the frontend already expects (derived from `types/index.ts` and the stores).

### Goal
Stand up a Laravel 11 + MySQL backend (Sanctum Bearer tokens) that:
1. Persists every entity currently held in stores / mocks.
2. Exposes a versioned `/api/v1` REST surface that drops into the frontend by changing `NEXT_PUBLIC_API_URL` and replacing mock returns in `lib/api.ts`.
3. Is buildable in clearly ordered phases so the frontend can switch over feature-by-feature.

### User-confirmed decisions
- **Stack:** Laravel 11 + Sanctum (Bearer tokens).
- **CMS scope:** DB-backed for **everything** — including the currently-static `/about`, `/activities`, `/resources` pages and the home-page bundles.
- **Puzzle grading:** Store an admin-defined expected answer AND require admin confirmation. Auto-match is used to pre-mark obviously correct submissions; ambiguous ones go to a review queue.
- **Diagnostic retakes:** Admin-only reset, no self-service retake in v1.

---

## 1. High-Level Architecture

```
┌────────────────────┐   Bearer token    ┌────────────────────────┐
│  Next.js Frontend  │ ────────────────► │  Laravel 11 API        │
│  (App Router, RSC) │  /api/v1/*        │  + Sanctum             │
│  Zustand (UI only) │ ◄──────────────── │  + Spatie Permission   │
└────────────────────┘   JSON resources  │  + Spatie MediaLibrary │
                                          │  + Laravel Excel       │
                                          └──────────┬─────────────┘
                                                     │ Eloquent ORM
                                                     ▼
                                          ┌────────────────────────┐
                                          │  MySQL 8               │
                                          └────────────────────────┘
```

### Recommended Composer packages
| Package | Why |
|---|---|
| `laravel/sanctum` | Bearer token auth for SPA. |
| `spatie/laravel-permission` | `student` / `admin` / `faculty` roles + granular permissions. |
| `spatie/laravel-medialibrary` | Polymorphic image attachments for question media, gallery photos, hall-of-fame portraits. |
| `spatie/laravel-activitylog` | Audit trail for admin actions (CRUD on questions, certificates, etc.). |
| `maatwebsite/excel` | CSV export for certificates, event registrations. |
| `owen-it/laravel-auditing` (alt) | Model-level audit if Activitylog isn't enough. |
| `intervention/image` | Image resizing for question/gallery uploads. |

### Folder / module structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/V1/
│   │   │   ├── Auth/ (RegisterController, LoginController, MeController, LogoutController)
│   │   │   ├── Public/ (HomeController, EventController, AlbumController, HallOfFameController,
│   │   │   │          LeaderboardController, NoticeController, CertificateController,
│   │   │   │          AboutController, ActivityController, ResourceController)
│   │   │   ├── Student/ (DashboardController, ProfileController, TopicController,
│   │   │   │            TestController, AttemptController, DiagnosticController,
│   │   │   │            PuzzleController, LiveExamController, CommunityController,
│   │   │   │            EventRegistrationController)
│   │   │   └── Admin/ (DashboardController, UserController, TopicController,
│   │   │              QuestionController, TestController, EventController,
│   │   │              InternalSessionController, LiveExamController, NoticeController,
│   │   │              CommunityController, CertificateController, RegistrationController,
│   │   │              PuzzleController, ContentController)
│   │   └── Controller.php
│   ├── Middleware/ (EnsureRole, EnsurePlacementDone, EnsureAbilityFor)
│   ├── Requests/ (FormRequest classes for every writable endpoint)
│   └── Resources/ (JSON Resources mirroring `types/index.ts` interfaces 1:1)
├── Models/ (one per table)
├── Services/
│   ├── DiagnosticGrader.php          (ability-level calculation)
│   ├── LeaderboardService.php        (monthly/all-time aggregation)
│   ├── TestAttemptScorer.php         (per-question scoring, topic breakdown)
│   ├── LiveExamScheduler.php         (status transitions)
│   └── ContentRenderer.php           (markdown/kaTeX for lessons & content)
└── Policies/ (one per user-mutating model)
```

### API versioning
- All endpoints mounted under `/api/v1`.
- `routes/api.php` split: `public.php`, `student.php`, `admin.php` then grouped.

---

## 2. Database Schema (MySQL 8, InnoDB, utf8mb4)

All tables use:
- `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY (except where the frontend already uses UUIDs for users — see below).
- `created_at`, `updated_at` timestamps.
- `deleted_at` soft-delete column where data should be recoverable (questions, tests, posts, certificates, events).

> **Naming convention:** snake_case tables, `id` primary key, foreign keys `<table_singular>_id`, indexes on every FK + every column used in a `WHERE` filter.

### 2.1 Users & Auth

#### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `name` | VARCHAR(120) | |
| `email` | VARCHAR(190) | UNIQUE |
| `password` | VARCHAR(255) | bcrypt |
| `role` | ENUM('student','admin','faculty') | default `student` |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | nullable until placement done |
| `level` | VARCHAR(60) | display string, e.g. "Math Enthusiast" |
| `xp` | INT UNSIGNED | default 0 |
| `streak` | INT UNSIGNED | default 0 |
| `last_active_at` | DATE | nullable, for streak math |
| `institute` | VARCHAR(190) | |
| `university` | VARCHAR(190) | nullable |
| `department` | VARCHAR(120) | nullable |
| `institution_type` | ENUM('School','College','University','Graduate') | nullable |
| `class_year` | VARCHAR(60) | nullable; uses the 19-value `classYearOptions` list or "All Classes" |
| `gender` | VARCHAR(30) | nullable |
| `dob` | DATE | nullable |
| `phone` | VARCHAR(30) | nullable |
| `whatsapp` | VARCHAR(30) | nullable |
| `address` | VARCHAR(255) | nullable |
| `about` | TEXT | nullable |
| `avatar_path` | VARCHAR(255) | nullable, MediaLibrary collection `avatar` |
| `joined_at` | TIMESTAMP | default now() |
| `status` | ENUM('active','suspended') | default `active` |
| `placement_done` | BOOLEAN | default 0 |
| `diagnostic_ability_level` | ENUM('Beginner','Advanced','Expert') | nullable |
| `diagnostic_score` | TINYINT UNSIGNED | nullable (0-100) |
| `diagnostic_completed_at` | TIMESTAMP | nullable |
| `diagnostic_attempt_id` | BIGINT UNSIGNED | nullable, FK to `diagnostic_attempts` (set after submit) |
| `email_verified_at` | TIMESTAMP | nullable |
| `remember_token` | VARCHAR(100) | |
| Indexes | `(email) UNIQUE`, `(role,tier)`, `(institution_type,class_year)` |

#### `personal_access_tokens` — provided by Sanctum.

#### `password_reset_tokens` — Laravel default.

### 2.2 Curriculum

#### `topics`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `slug` | VARCHAR(120) | UNIQUE |
| `name` | VARCHAR(160) | |
| `description` | TEXT | |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | |
| `level` | ENUM('Beginner','Intermediate','Advanced','Elite') | |
| `color` | VARCHAR(20) | hex |
| `image_path` | VARCHAR(255) | nullable |
| `lesson_count` | INT UNSIGNED | maintained by observer |
| `problem_count` | INT UNSIGNED | maintained by observer |
| Indexes | `(slug) UNIQUE`, `(tier,level)` |

#### `modules`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `topic_id` | BIGINT UNSIGNED | FK → topics |
| `name` | VARCHAR(160) | |
| `description` | TEXT | |
| `difficulty` | ENUM('Beginner','Intermediate','Advanced','Elite') | |
| `order` | INT UNSIGNED | |
| `lesson_count` | INT UNSIGNED | observer-maintained |
| Indexes | `(topic_id, order)` |

#### `lessons`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `module_id` | BIGINT UNSIGNED | FK → modules |
| `title` | VARCHAR(200) | |
| `content` | LONGTEXT | Markdown + KaTeX |
| `key_points` | JSON | `["string", ...]` |
| `example_problem` | TEXT | nullable |
| `example_solution` | LONGTEXT | nullable |
| `resources` | JSON | `[{title, type: video\|pdf\|article, url}, ...]` |
| `estimated_minutes` | SMALLINT UNSIGNED | |
| `order` | INT UNSIGNED | |
| Indexes | `(module_id, order)` |

#### `lesson_progress`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `user_id` | BIGINT UNSIGNED | FK → users |
| `lesson_id` | BIGINT UNSIGNED | FK → lessons |
| `completed_at` | TIMESTAMP | |
| UNIQUE | `(user_id, lesson_id)` | |

### 2.3 Question Bank

#### `questions`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `content` | TEXT | the human-readable stem |
| `topic_id` | BIGINT UNSIGNED | FK → topics |
| `difficulty` | ENUM('Beginner','Intermediate','Advanced','Elite') | |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | |
| `format` | ENUM('text-to-text','text-to-image','image-to-text','image-to-image') | |
| `prompt_kind` | ENUM('text','image') | matches frontend `QuestionMedia.kind` |
| `prompt_value` | TEXT | text body OR image URL/path |
| `prompt_alt` | VARCHAR(255) | nullable, image alt |
| `ability_level` | ENUM('Beginner','Advanced','Expert') | for diagnostic gating |
| `target_class_year` | VARCHAR(60) | nullable; or "All Classes" |
| `marks` | DECIMAL(5,2) | default 1.00 |
| `time_limit_seconds` | SMALLINT UNSIGNED | default 90 |
| `subtopic_tags` | JSON | `["tag", ...]` |
| `source` | VARCHAR(190) | nullable |
| `explanation` | LONGTEXT | nullable |
| `status` | ENUM('draft','published') | default 'draft' |
| `is_diagnostic_eligible` | BOOLEAN | default 0 |
| Indexes | `(topic_id, status)`, `(tier, ability_level)`, `(target_class_year)`, FULLTEXT `(content, explanation)` |

#### `question_options`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `question_id` | BIGINT UNSIGNED | FK → questions CASCADE |
| `label` | VARCHAR(4) | "A", "B", "C", "D" |
| `media_kind` | ENUM('text','image') | |
| `media_value` | TEXT | |
| `media_alt` | VARCHAR(255) | nullable |
| `is_correct` | BOOLEAN | |
| `order` | TINYINT UNSIGNED | |
| Indexes | `(question_id, order)` |

> The 1:N options table replaces the JSON arrays in `types/index.ts`. The API Resource serializes it back to the frontend's `Question.answerOptions[]` shape.

### 2.4 Tests & Attempts

#### `tests`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `title` | VARCHAR(200) | |
| `description` | TEXT | |
| `duration` | SMALLINT UNSIGNED | minutes |
| `difficulty` | ENUM('Beginner','Intermediate','Advanced','Elite') | |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | |
| `topic_id` | BIGINT UNSIGNED | FK → topics |
| `question_count` | INT UNSIGNED | |
| `is_public` | BOOLEAN | default 1 |
| `source` | VARCHAR(190) | nullable |
| `tags` | JSON | `["tag", ...]` |
| `test_type` | ENUM('practice','diagnostic') | |
| `target_class_year` | VARCHAR(60) | nullable |
| `ability_level` | ENUM('Beginner','Advanced','Expert') | nullable |
| `random_question_count` | INT UNSIGNED | nullable; diagnostic-only |
| `advanced_threshold` | TINYINT UNSIGNED | 0-100; diagnostic-only |
| `expert_threshold` | TINYINT UNSIGNED | 0-100; diagnostic-only |
| Indexes | `(test_type, is_public)`, `(tier, ability_level)` |

#### `test_questions` (pivot)
| Column | Type |
|---|---|
| `test_id` | BIGINT UNSIGNED, FK → tests CASCADE |
| `question_id` | BIGINT UNSIGNED, FK → questions RESTRICT |
| `order` | INT UNSIGNED |
| PK | `(test_id, question_id)` |
| Index | `(test_id, order)` |

> Diagnostic tests may have no rows here; the engine pulls `randomQuestionCount` questions filtered by `ability_level` and `tier`.

#### `test_attempts`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED | PK |
| `user_id` | BIGINT UNSIGNED | FK → users |
| `test_id` | BIGINT UNSIGNED | FK → tests |
| `test_title` | VARCHAR(200) | snapshot |
| `question_ids` | JSON | ordered, snapshot at start |
| `current_index` | INT UNSIGNED | default 0 (live state) |
| `current_question_started_at` | TIMESTAMP | nullable |
| `current_question_deadline` | TIMESTAMP | nullable |
| `answers` | JSON | `{questionId: optionIndex}` |
| `status` | ENUM('in-progress','submitted','expired','abandoned') | default 'in-progress' |
| `score` | DECIMAL(6,2) | nullable until submitted |
| `total_marks` | DECIMAL(6,2) | nullable |
| `accuracy` | DECIMAL(5,2) | nullable, percent |
| `time_spent_seconds` | INT UNSIGNED | nullable |
| `started_at` | TIMESTAMP | |
| `submitted_at` | TIMESTAMP | nullable |
| Indexes | `(user_id, status)`, `(test_id)`, `(user_id, submitted_at)` |

#### `diagnostic_attempts`
Identical columns to `test_attempts` plus:
- `correct_count` INT UNSIGNED nullable
- `ability_level` ENUM('Beginner','Advanced','Expert') nullable
- Soft delete enabled (so admins can audit historical attempts).

#### `attempt_topic_breakdown`
| Column | Type |
|---|---|
| `id` | BIGINT UNSIGNED PK |
| `test_attempt_id` | BIGINT UNSIGNED FK CASCADE |
| `topic_id` | BIGINT UNSIGNED FK |
| `correct` | INT UNSIGNED |
| `total` | INT UNSIGNED |
| `accuracy` | DECIMAL(5,2) |
| UNIQUE | `(test_attempt_id, topic_id)` |

#### `attempt_question_answers`
| Column | Type |
|---|---|
| `id` | BIGINT UNSIGNED PK |
| `test_attempt_id` | BIGINT UNSIGNED FK CASCADE |
| `question_id` | BIGINT UNSIGNED FK |
| `selected_option_id` | BIGINT UNSIGNED nullable |
| `is_correct` | BOOLEAN |
| `time_taken_seconds` | INT UNSIGNED |
| UNIQUE | `(test_attempt_id, question_id)` |

### 2.5 Notices, Events, Live Exams

#### `notices`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `body` | LONGTEXT | |
| `tier` | ENUM('All','Beginner','Intermediate','Advanced') | default 'All' |
| `priority` | ENUM('high','normal','low') | default 'normal' |
| `author_id` | BIGINT UNSIGNED FK → users | |
| `published_at` | TIMESTAMP | |
| Indexes | `(tier, published_at)` |

#### `olympiad_events` (the `Event` interface)
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `type` | ENUM('IMO','BdMO','AMC','INTERNAL') | |
| `date` | DATE | |
| `time` | TIME | nullable |
| `location` | VARCHAR(190) | nullable |
| `description` | TEXT | |
| `is_internal` | BOOLEAN | default 0 |
| `official_link` | VARCHAR(255) | nullable |
| `registration_link` | VARCHAR(255) | nullable |
| Index | `(type, date)` |

#### `internal_sessions`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `subtitle` | VARCHAR(255) | nullable |
| `date` | DATE | |
| `time` | TIME | |
| `type` | VARCHAR(60) | "MOCK SESSION" / "DISCUSSION CLASS" / "CHALLENGE" |
| `type_color` | VARCHAR(30) | CSS variable name |

#### `live_exams`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `description` | TEXT | |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | |
| `scheduled_at` | TIMESTAMP | |
| `duration` | SMALLINT UNSIGNED | minutes |
| `topic_id` | BIGINT UNSIGNED FK | nullable |
| `test_id` | BIGINT UNSIGNED FK | nullable |
| `question_count` | INT UNSIGNED | |
| `status` | ENUM('upcoming','live','ended') | default 'upcoming' |
| Indexes | `(tier, scheduled_at)`, `(status, scheduled_at)` |

#### `registration_events`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `type` | VARCHAR(60) | |
| `type_color` | VARCHAR(30) | |
| `date` | DATE | |
| `location` | VARCHAR(190) | |
| `capacity` | INT UNSIGNED | |
| `status` | ENUM('open','closed','upcoming') | |
| `description` | TEXT | |

#### `event_registrations`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `registration_event_id` | BIGINT UNSIGNED FK | |
| `user_id` | BIGINT UNSIGNED FK | nullable (also allow guest captures) |
| `name` | VARCHAR(160) | |
| `student_id_str` | VARCHAR(60) | "student ID" field on the form |
| `dept` | VARCHAR(120) | |
| `year` | VARCHAR(60) | |
| `email` | VARCHAR(190) | |
| `phone` | VARCHAR(30) | |
| `status` | ENUM('pending','approved','rejected') | default 'pending' |
| `submitted_at` | TIMESTAMP | |
| Indexes | `(registration_event_id, status)`, `(email)` |

### 2.6 Community

#### `community_posts`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `body` | LONGTEXT | |
| `category` | ENUM('Algebra','Combinatorics','Number Theory','Geometry','General') | |
| `author_id` | BIGINT UNSIGNED FK → users | |
| `author_institute` | VARCHAR(190) | snapshot |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | |
| `views` | INT UNSIGNED | default 0 |
| `likes` | INT UNSIGNED | default 0 |
| `pinned` | BOOLEAN | default 0 |
| `tags` | JSON | |
| Indexes | `(tier, category, pinned)`, `(created_at)` |

#### `community_replies`
| Column | Type |
|---|---|
| `id` | BIGINT UNSIGNED PK |
| `post_id` | BIGINT UNSIGNED FK CASCADE |
| `author_id` | BIGINT UNSIGNED FK |
| `body` | LONGTEXT |
| Index | `(post_id, created_at)` |

#### `community_likes` (UNIQUE on user+post for idempotency)
| Column | Type |
|---|---|
| `id` | BIGINT UNSIGNED PK |
| `post_id` | BIGINT UNSIGNED FK CASCADE |
| `user_id` | BIGINT UNSIGNED FK CASCADE |
| UNIQUE | `(post_id, user_id)` |

### 2.7 Puzzles

#### `puzzles`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `date` | DATE | one puzzle per tier per day |
| `title` | VARCHAR(200) | |
| `content` | LONGTEXT | |
| `difficulty` | ENUM('Beginner','Intermediate','Advanced','Elite') | |
| `tier` | ENUM('Beginner','Intermediate','Advanced') | |
| `topic` | VARCHAR(120) | |
| `expected_answer` | TEXT | admin-defined reference answer |
| `auto_match_normalized` | VARCHAR(255) | nullable; lowercase+trim of expected for fast compare |
| `streak_count` | INT UNSIGNED | observer-incremented on isCorrect=true |
| UNIQUE | `(date, tier)` | |
| Index | `(tier, date DESC)` |

#### `puzzle_submissions`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `puzzle_id` | BIGINT UNSIGNED FK CASCADE | |
| `user_id` | BIGINT UNSIGNED FK CASCADE | |
| `answer` | TEXT | |
| `submitted_at` | TIMESTAMP | |
| `auto_correct` | BOOLEAN | nullable; computed at submit time (case-insensitive trimmed equality vs `auto_match_normalized`) |
| `is_correct` | BOOLEAN | nullable; null = pending review |
| `reviewed_by` | BIGINT UNSIGNED FK → users | nullable |
| `reviewed_at` | TIMESTAMP | nullable |
| UNIQUE | `(puzzle_id, user_id)` | one submission per user per puzzle (resubmits allowed but flagged) |
| Index | `(is_correct, reviewed_at)` |

> `auto_correct=true` AND exact match → `is_correct=true` set immediately, no review.
> `auto_correct=false` → `is_correct=null` (pending), admin reviews in `/admin/puzzles` → Submissions tab.
> `auto_correct=true` AND ambiguous (e.g. admin left `expected_answer` blank) → also pending.

### 2.8 Certificates, Hall-of-Fame, Gallery, Albums

#### `certificates`
| Column | Type | Notes |
|---|---|---|
| `id` | VARCHAR(40) PK | human-readable e.g. `UIU-CMOR-2025-001` |
| `user_id` | BIGINT UNSIGNED FK → users | nullable (allow historical/alumni) |
| `student_name` | VARCHAR(160) | snapshot |
| `student_id_str` | VARCHAR(60) | snapshot |
| `dept` | VARCHAR(120) | |
| `institute` | VARCHAR(190) | |
| `achievement` | VARCHAR(200) | |
| `event` | VARCHAR(200) | |
| `event_type` | VARCHAR(60) | |
| `description` | TEXT | |
| `issued_at` | DATE | |
| `tier` | ENUM('gold','silver','bronze') | |
| `issued_by` | BIGINT UNSIGNED FK → users | |
| `signatory_name` | VARCHAR(160) | |
| `signatory_title` | VARCHAR(160) | |
| `status` | ENUM('valid','revoked') | default 'valid' |
| Indexes | `(user_id)`, `(status, issued_at)` |

> ID generation: `UIU-CMOR-{year}-{nnn}` via a sequence table or a query like `MAX(CAST(SUBSTRING_INDEX(id, '-', -1) AS UNSIGNED))`.

#### `hall_of_fame_entries`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `name` | VARCHAR(160) | |
| `year` | SMALLINT UNSIGNED | |
| `achievement` | VARCHAR(200) | |
| `department` | VARCHAR(120) | |
| `details` | TEXT | |
| `tier` | ENUM('gold','silver','bronze') | |
| `image_path` | VARCHAR(255) | nullable |
| `sort_order` | INT UNSIGNED | default 0 |

#### `albums`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `title` | VARCHAR(200) | |
| `date` | DATE | |
| `category` | ENUM('Competition','Training','Workshop','Seminar','Other') | |
| `color` | VARCHAR(20) | |
| `icon` | VARCHAR(60) | lucide icon name |
| `cover_gradient` | VARCHAR(255) | CSS gradient string |
| `description` | TEXT | |
| `sort_order` | INT UNSIGNED | |

#### `album_photos` (MediaLibrary is also an option; keep an explicit table for simple listing)
| Column | Type |
|---|---|
| `id` | BIGINT UNSIGNED PK |
| `album_id` | BIGINT UNSIGNED FK CASCADE |
| `path` | VARCHAR(255) |
| `caption` | VARCHAR(255) nullable |
| `sort_order` | INT UNSIGNED |
| Index | `(album_id, sort_order)` |

### 2.9 CMS Content (about, activities, resources, home bundles)

#### `content_pages`
A single table covering the long-form pages.
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `slug` | VARCHAR(60) UNIQUE | `about`, `activities`, `resources` |
| `title` | VARCHAR(200) | |
| `intro` | TEXT | nullable, above-the-fold blurb |
| `body` | LONGTEXT | Markdown + KaTeX |
| `meta` | JSON | per-page structured data (e.g. milestones timeline, team members) |
| `published_at` | TIMESTAMP | nullable |

> `meta` lets admins edit structured widgets (e.g. milestone timeline on `/about`) without code changes.

#### `content_widgets`
For inline widgets on the about/activities/resources pages.
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `page_slug` | VARCHAR(60) | logical FK to `content_pages.slug` |
| `widget_type` | VARCHAR(60) | `milestone`, `team_member`, `activity_card`, `resource_link`, `stat_block` |
| `position` | INT UNSIGNED | ordering |
| `data` | JSON | widget-specific payload |
| Index | `(page_slug, position)` |

> Each widget row renders one block in the frontend. The frontend's hard-coded widgets (milestones, team cards, etc.) become default seed data that the admin can later edit.

#### `home_sections`
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `section_key` | VARCHAR(60) UNIQUE | `hero`, `initiatives`, `how_it_works`, `upcoming_events`, `leaderboard_preview` |
| `title` | VARCHAR(200) | |
| `subtitle` | TEXT | |
| `data` | JSON | section-specific payload (feature cards, step descriptions, etc.) |
| `sort_order` | INT UNSIGNED | |
| `published` | BOOLEAN | default 1 |

> `GET /api/v1/home/bundles` returns all published sections in one payload, replacing the hard-coded homepage components.

#### `site_settings`
| Column | Type | Notes |
|---|---|---|
| `key` | VARCHAR(60) PK | |
| `value` | LONGTEXT | |
| `type` | ENUM('string','json','boolean','integer') | for typed casting |

> Use this for global things: feature flags, social URLs, contact email, registration open/closed toggle, default leaderboard window, etc.

### 2.10 Audit / logs

#### `activity_log` — Spatie's standard table (don't redefine).

### 2.11 Enum cheat-sheet (kept in sync with `types/index.ts`)
- `UserRole`: student | admin | faculty
- `Tier`: Beginner | Intermediate | Advanced
- `AbilityLevel`: Beginner | Advanced | Expert
- `Difficulty`: Beginner | Intermediate | Advanced | Elite
- `OlympiadType`: BdMO | AMC | IMO | INTERNAL
- `QuestionFormat`: text-to-text | text-to-image | image-to-text | image-to-image
- `QuestionStatus`: draft | published
- `TestType`: practice | diagnostic
- `InstitutionType`: School | College | University | Graduate

---

## 3. JSON Resource shapes (must match frontend `types/index.ts`)

Resources live in `app/Http/Resources/`. Each one mirrors an interface in `types/index.ts`. Examples:

- `UserResource` → `User` interface
- `TopicResource` → `Topic`
- `ModuleResource` → `Module`
- `LessonResource` → `Lesson` (joins `key_points` JSON → `keyPoints[]`)
- `QuestionResource` → `Question` (joins options → `answerOptions[]`, `options[]`)
- `TestResource` → `Test`
- `TestAttemptResource` → `TestAttempt` (joins `attempt_topic_breakdown` → `topicBreakdown[]`)
- `DiagnosticAttemptResource` → `DiagnosticAttempt`
- `PracticeAttemptResource` → `PracticeAttempt`
- `NoticeResource` → `Notice`
- `EventResource` → `Event`
- `LiveExamResource` → `LiveExam`
- `CommunityPostResource` → `CommunityPost`
- `PuzzleResource` → `DailyPuzzle`
- `PuzzleSubmissionResource` → `PuzzleSubmission`
- `CertificateResource` → `Certificate`
- `LeaderboardEntryResource` → `LeaderboardEntry`
- `DashboardStatsResource` → `DashboardStats`

`DashboardStatsResource` aggregates:
- `testsTaken`, `avgScore`, `bestScore`, `totalTime` from `test_attempts`
- `topicMastery[]` from `attempt_topic_breakdown` joined to topics
- `recentActivity[]` from `test_attempts` + `puzzle_submissions` + `community_posts`
- `learningPath[]` from `lesson_progress` joined to modules/topics
- `recommendedNext[]` = next test the user hasn't attempted, filtered by `tier` + `ability_level`

---

## 4. Endpoints (REST under `/api/v1`)

> All writable endpoints accept JSON unless noted (`multipart` for image uploads). Bearer token in `Authorization: Bearer <token>` header. Validation errors return `422` with `{message, errors:{field:[]}}`.

### 4.1 Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | none | student signup (matches `/login` signup tab) |
| POST | `/auth/login` | none | returns `{token, user: UserResource}` |
| POST | `/auth/logout` | sanctum | revokes current token |
| GET | `/auth/me` | sanctum | UserResource |
| PATCH | `/auth/me` | sanctum | FormRequest validates partial fields |
| POST | `/auth/password/email` | none | send reset link |
| POST | `/auth/password/reset` | none | consume token + new password |

Role gating is done by middleware, not by separate routes:
- `auth:sanctum` — any logged-in user
- `role:admin` — must have `role=admin`
- `placement.done` — student must have `placement_done=true` (used to gate `/student/tests` etc. but not `/student/placement`)

### 4.2 Public (no auth)
| Method | Path | Notes |
|---|---|---|
| GET | `/home/bundles` | returns all `home_sections` |
| GET | `/events` | supports `?scope=`, `?type=`, `?search=` |
| GET | `/albums` | `?category=` |
| GET | `/albums/{id}/photos` | |
| GET | `/hall-of-fame` | |
| GET | `/leaderboard` | `?period=monthly|alltime&tier=` |
| GET | `/notices` | `?tier=` |
| GET | `/certificates/verify` | `?type=id|regNo&q=` |
| GET | `/live-exams` | `?tier=`; only returns `upcoming`/`live` |
| GET | `/pages/{slug}` | content pages (`about`, `activities`, `resources`) |
| GET | `/pages/{slug}/widgets` | widgets for a page |
| GET | `/settings` | public site settings |

### 4.3 Student (auth)
| Method | Path | Notes |
|---|---|---|
| GET | `/student/dashboard` | DashboardStatsResource |
| GET | `/topics` | `?tier=` |
| GET | `/topics/{slug}` | returns topic + modules + lessons |
| GET | `/tests` | `?type=practice&tier=&ability=&classYear=` |
| GET | `/tests/{id}` | test + questions (without `correct_option`/`is_correct`) |
| POST | `/tests/{id}/attempts/start` | creates `test_attempt`, returns with question_ids and per-question deadlines |
| PATCH | `/attempts/{id}/answer` | body: `{question_id, option_id}`; idempotent |
| PATCH | `/attempts/{id}/advance` | body: `{current_index, current_question_started_at, current_question_deadline}` |
| POST | `/attempts/{id}/submit` | grades, returns result with `topic_breakdown` |
| GET | `/attempts/{id}/result` | TestAttemptResource |
| GET | `/attempts` | user's own attempts list |
| POST | `/diagnostic/start` | picks N random eligible questions, creates `diagnostic_attempt` |
| POST | `/diagnostic/{id}/submit` | grades, computes ability level, updates user profile |
| GET | `/puzzles/today` | `?tier=` |
| GET | `/puzzles/{id}/submissions/me` | |
| POST | `/puzzles/{id}/submissions` | runs auto-match, returns status `accepted`/`pending_review` |
| GET | `/community/posts` | `?category=&tier=&search=&page=` |
| POST | `/community/posts` | |
| POST | `/community/posts/{id}/like` | idempotent toggle |
| GET | `/community/posts/{id}/replies` | |
| POST | `/community/posts/{id}/replies` | |
| POST | `/event-registrations` | for `registration_events` |
| POST | `/lessons/{id}/complete` | marks `lesson_progress` |

### 4.4 Admin (auth + role:admin)
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/dashboard/stats` | total/active students, avg score, topics count, tier breakdown |
| GET | `/admin/users` | `?search=&tier=&institution_type=&page=` |
| POST | `/admin/users` | create user (admin or student) |
| GET | `/admin/users/{id}` | full user + attempts + topic progress + activity heatmap |
| PATCH | `/admin/users/{id}` | |
| DELETE | `/admin/users/{id}` | soft delete |
| POST | `/admin/users/{id}/reset-diagnostic` | clears diagnostic fields + soft-deletes attempts |
| POST | `/admin/users/{id}/suspend` / `/unsuspend` | |
| CRUD | `/admin/topics` | |
| CRUD | `/admin/modules` | nested under topic: `/admin/topics/{id}/modules` |
| CRUD | `/admin/lessons` | nested under module: `/admin/modules/{id}/lessons` |
| CRUD | `/admin/questions` | supports `multipart` for image upload to `prompt_value` / `option media` |
| POST | `/admin/questions/bulk-import` | CSV → questions |
| CRUD | `/admin/tests` | |
| POST | `/admin/tests/{id}/questions` | attach questions (reorder) |
| DELETE | `/admin/tests/{id}/questions/{qid}` | detach |
| CRUD | `/admin/olympiad-events` | |
| CRUD | `/admin/internal-sessions` | |
| CRUD | `/admin/live-exams` | admin can manually flip `status` |
| POST | `/admin/live-exams/{id}/transition` | `upcoming`→`live`→`ended` |
| CRUD | `/admin/notices` | |
| CRUD | `/admin/registration-events` | |
| GET | `/admin/event-registrations` | `?status=&event=` |
| PATCH | `/admin/event-registrations/{id}` | set status |
| GET | `/admin/event-registrations/export.csv` | |
| CRUD | `/admin/community/posts` | includes pin toggle |
| DELETE | `/admin/community/posts/{id}` | cascades replies |
| CRUD | `/admin/certificates` | auto-generates ID on create |
| POST | `/admin/certificates/{id}/toggle` | revoke/restore |
| GET | `/admin/certificates/export.csv` | |
| CRUD | `/admin/puzzles` | |
| GET | `/admin/puzzle-submissions` | `?puzzle_id=&tier=&is_correct=` |
| PATCH | `/admin/puzzle-submissions/{id}` | set `is_correct`, set `reviewed_by`/`reviewed_at` |
| CRUD | `/admin/hall-of-fame` | |
| CRUD | `/admin/albums` | |
| POST | `/admin/albums/{id}/photos` | `multipart`, multiple images |
| DELETE | `/admin/albums/{id}/photos/{photoId}` | |
| CRUD | `/admin/content/pages` | slug-keyed |
| CRUD | `/admin/content/widgets` | reorders via `position` |
| CRUD | `/admin/home-sections` | |
| CRUD | `/admin/site-settings` | |

---

## 5. Key business logic to implement

### 5.1 Authentication & seed
- `database/seeders/AdminSeeder` creates the admin user matching the frontend's hardcoded `admin@uiu.ac.bd` / `UIUAdmin2024`. (Replace those constants in `authStore.ts` with real API calls; the seed is just to keep dev login working during the migration.)
- `database/seeders/ContentSeeder` seeds `content_pages`, `content_widgets`, `home_sections` from the frontend's current hard-coded content.
- `database/seeders/TopicSeeder` + `ModuleSeeder` + `LessonSeeder` port `lib/mock/topics.ts`.
- `database/seeders/QuestionSeeder` + `TestSeeder` port `lib/mock/tests.ts` and `lib/mock/placement.ts`.
- `database/seeders/MiscSeeder` ports the rest: `events`, `internal_sessions`, `live_exams`, `puzzles`, `notices`, `community_posts`, `users`, `certificates`, `hall_of_fame_entries`, `albums`, `leaderboard` (compute from seed users).

### 5.2 Diagnostic placement flow (port of `/student/placement`)
1. Front-end `POST /api/v1/diagnostic/start` (no body).
2. Backend: pick the published `test` with `test_type='diagnostic'` matching the user's `institution_type` + `class_year`. If none, fall back to the default `diagnostic-default`.
3. Draw `randomQuestionCount` random questions where `is_diagnostic_eligible=true` and (no `target_class_year` or matches user's).
4. Create `diagnostic_attempts` row with `status='in-progress'`.
5. Front-end submits via `POST /diagnostic/{id}/submit` with `{answers:{qid:optionId}}`.
6. Backend:
   - Score each answer against `question_options.is_correct`.
   - `score = round(correctCount/total*100, 0)`.
   - `abilityLevel = determineAbility(score, advancedThreshold=50, expertThreshold=80)` — port this exact function from `lib/diagnostic.ts`.
   - Update the attempt (`status='submitted'`, `submitted_at=now`).
   - Update `users`: `placement_done=true`, `diagnostic_ability_level=`, `diagnostic_score=`, `diagnostic_completed_at=`, `diagnostic_attempt_id=`, and `tier` (derived: Beginner→Beginner, Advanced→Intermediate, Expert→Advanced).
7. Return `{score, abilityLevel, tier, attempt}`.

### 5.3 Test engine (port of `components/test/TestEngine.tsx`)
- `start`: snapshot `question_ids` in shuffled order, set per-question `current_question_deadline = now + question.time_limit_seconds`.
- `answer`: idempotent upsert into `attempt_question_answers` and update `test_attempts.answers` JSON mirror.
- `advance`: update `current_index` + new `current_question_started_at` + new `current_question_deadline`.
- `submit`: grade every question (also accept "no answer" → wrong), write `attempt_topic_breakdown`, compute `score`, `accuracy`, `time_spent_seconds`, set `status='submitted'`, and award XP via `LeaderboardService`/`XpService`.
- If `now > current_question_deadline` on `submit`, mark unanswered questions as wrong and force-submit (`status='expired'`).

### 5.4 XP, streak, level
- `XpService::award(TestAttempt $attempt)`:
  - `xp += round(attempt.score * 0.5 + attempt.accuracy * 2)`.
  - On `streak` increment logic: if `last_active_at == yesterday`, `streak += 1`; if `last_active_at < yesterday - 1 day`, `streak = 1`; else if `last_active_at == today`, no change.
  - `level` recomputed via a static `LevelTable` (seed thresholds: 0, 100, 300, 700, 1500, 3000, 6000 XP → labels "Newcomer", "Math Enthusiast", "Problem Solver", "Olympiad Contender", "BdMO Finalist", "Elite Mathematician").
- `XpService::penalizeForMissedDay` (run daily via scheduler): if `last_active_at < yesterday - 1 day`, reset `streak = 0` but keep `xp` and `level`.

### 5.5 Leaderboard
- `LeaderboardService::get(period, tier, limit=100)`:
  - `monthly` = `WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)` (configurable in `site_settings`).
  - `alltime` = no date filter.
  - `tier` filter applied to `users.tier`.
  - Order by total XP descending, then total score descending.
  - `rank` = window function; `trend` = compare to previous period's rank.
- Cache per (period, tier, day) for 5 min.

### 5.6 Live exam status transitions
- `LiveExamScheduler` artisan command runs every minute:
  - If `status='upcoming'` and `scheduled_at <= now < scheduled_at + duration` → set `status='live'` (broadcast event for frontend refresh).
  - If `status='live'` and `now >= scheduled_at + duration` → set `status='ended'`.
- Admin can manually call `POST /admin/live-exams/{id}/transition` to force a state.

### 5.7 Puzzle submission flow
- `POST /puzzles/{id}/submissions` with `{answer}`:
  - If `puzzle.auto_match_normalized IS NULL` → `auto_correct=null`, `is_correct=null` (pending review).
  - Else compute `submitted_normalized = strtolower(trim(preg_replace('/\s+/', ' ', $answer)))` and compare to `auto_match_normalized`:
    - Equal → `auto_correct=true`, `is_correct=true`, increment `puzzle.streak_count`, mark `reviewed_by=NULL` (auto-approved).
    - Not equal → `auto_correct=false`, `is_correct=null` (pending).
- `GET /admin/puzzle-submissions` lists pending first.
- Admin `PATCH /admin/puzzle-submissions/{id}` sets `is_correct` and `reviewed_by`/`reviewed_at` (audit-logged).

### 5.8 Image uploads
- All uploads go through Spatie MediaLibrary:
  - Question prompt: `addMedia($file)->toMediaCollection('question_prompt')`.
  - Question options: collection `question_options` on the `Question` model.
  - User avatar: collection `avatar` on the `User` model.
  - Album photos: collection `photos` on the `Album` model.
  - Hall of fame: collection `portrait` on `HallOfFameEntry`.
- Store on the `public` disk; generate a thumbnail (300px wide) for gallery + question options.
- Serve via `Storage::url()` (or a signed-URL route if we want private storage).

### 5.9 CSV exports
- `GET /admin/certificates/export.csv` and `/admin/event-registrations/export.csv` use `maatwebsite/excel` `FromQuery` exports.
- `GET /admin/users/export.csv` (bonus) for roster downloads.

### 5.10 Rate limiting
- `auth/login`, `auth/register`: 5/min per IP.
- `puzzles/{id}/submissions`: 3/hour per user.
- `attempts/{id}/answer` and `attempts/{id}/advance`: 60/min per user.

### 5.11 Validation highlights
- `POST /auth/register`: `email` unique, `password` ≥ 8 + confirmed, `institution_type` ∈ enum, `class_year` ∈ 19-value list (or null when `institution_type='Graduate'`).
- `POST /admin/tests` for `test_type='diagnostic'`: `randomQuestionCount > 0`, `advancedThreshold < expertThreshold`, both 0-100.
- `POST /admin/questions`: `correct_option` (option index) must reference an option marked `is_correct=true` in the options payload.

### 5.12 Queues / jobs
- `ScoreTestAttempt` (job) — called from `submit` endpoint, runs synchronously but in a `try` so the API can return fast. Switch to `dispatch` if scoring gets heavy.
- `ComputeLeaderboardSnapshot` (scheduled, daily).
- `ExpireInProgressAttempts` (scheduled, every 5 min) — flips attempts whose last `current_question_deadline` has passed.
- `SyncLiveExamStatus` (scheduled, every minute).

---

## 6. Migrations (execution order)

1. `0001_01_01_000000_create_users_table.php` (Laravel default + our columns) — adds `role`, `tier`, `level`, `xp`, `streak`, `institute`, `institution_type`, `class_year`, `placement_done`, `diagnostic_*`, etc.
2. `0001_01_01_000001_create_cache_table.php`
3. `0001_01_01_000002_create_jobs_table.php`
4. `2025_01_01_000010_create_personal_access_tokens_table.php` (Sanctum publish)
5. `2025_01_01_000011_create_password_reset_tokens_table.php`
6. `2025_01_01_000020_create_permission_tables.php` (Spatie publish)
7. `2025_01_01_000021_create_activity_log_table.php` (Spatie publish)
8. `2025_01_01_000030_create_topics_table.php`
9. `2025_01_01_000031_create_modules_table.php`
10. `2025_01_01_000032_create_lessons_table.php`
11. `2025_01_01_000033_create_lesson_progress_table.php`
12. `2025_01_01_000040_create_questions_table.php`
13. `2025_01_01_000041_create_question_options_table.php`
14. `2025_01_01_000050_create_tests_table.php`
15. `2025_01_01_000051_create_test_questions_table.php`
16. `2025_01_01_000060_create_test_attempts_table.php`
17. `2025_01_01_000061_create_attempt_question_answers_table.php`
18. `2025_01_01_000062_create_attempt_topic_breakdown_table.php`
19. `2025_01_01_000063_create_diagnostic_attempts_table.php`
20. `2025_01_01_000070_create_notices_table.php`
21. `2025_01_01_000080_create_olympiad_events_table.php`
22. `2025_01_01_000081_create_internal_sessions_table.php`
23. `2025_01_01_000082_create_live_exams_table.php`
24. `2025_01_01_000090_create_registration_events_table.php`
25. `2025_01_01_000091_create_event_registrations_table.php`
26. `2025_01_01_000100_create_community_posts_table.php`
27. `2025_01_01_000101_create_community_replies_table.php`
28. `2025_01_01_000102_create_community_likes_table.php`
29. `2025_01_01_000110_create_puzzles_table.php`
30. `2025_01_01_000111_create_puzzle_submissions_table.php`
31. `2025_01_01_000120_create_certificates_table.php`
32. `2025_01_01_000130_create_hall_of_fame_entries_table.php`
33. `2025_01_01_000140_create_albums_table.php`
34. `2025_01_01_000141_create_album_photos_table.php`
35. `2025_01_01_000150_create_content_pages_table.php`
36. `2025_01_01_000151_create_content_widgets_table.php`
37. `2025_01_01_000152_create_home_sections_table.php`
38. `2025_01_01_000153_create_site_settings_table.php`
39. `2025_01_01_000160_create_media_table.php` (Spatie MediaLibrary publish)

---

## 7. Seeders (execution order)

1. `RoleAndPermissionSeeder` — creates `student`, `admin`, `faculty` roles.
2. `AdminSeeder` — creates `admin@uiu.ac.bd` with role `admin`, password `UIUAdmin2024` (logged in README to change in production).
3. `TopicModuleLessonSeeder` — ports `lib/mock/topics.ts` (30 topics + modules + lessons).
4. `QuestionAndTestSeeder` — ports `lib/mock/tests.ts` and `lib/mock/placement.ts`.
5. `MiscContentSeeder` — events, internal sessions, live exams, notices, community posts, puzzles, certificates, hall-of-fame, albums (all ported from `lib/mock/*`).
6. `UserSeeder` — creates the 30 demo users from `lib/mock/users.ts` with passwords `password`.
7. `CmsSeeder` — seeds `content_pages`, `content_widgets`, `home_sections` from the frontend's hard-coded copy.
8. `SiteSettingsSeeder` — seeds default settings (registration_open=true, leaderboard_window=monthly, contact_email, social URLs).

---

## 8. Implementation phases (deliverables + frontend swap points)

### Phase 0 — Bootstrap
- `composer create-project laravel/laravel backend "^11.0"`.
- Configure `.env` (MySQL, Sanctum stateful domains for dev).
- Install: Sanctum, Spatie Permission, Spatie MediaLibrary, Spatie Activitylog, Laravel Excel, Intervention/Image.
- Publish their migrations & configs.
- Run the migration list in §6.
- Deploy seeders in §7.
- **Verify:** `php artisan migrate:fresh --seed` completes, `php artisan serve` works, `GET /api/v1/home/bundles` returns 200.

### Phase 1 — Auth
- Implement Auth Controllers + FormRequests.
- Implement `UserResource`.
- Set up `EnsureRole` middleware.
- **Frontend swap:** In `lib/api.ts` and `store/authStore.ts`, replace the hardcoded admin path with `POST /api/v1/auth/login` and `POST /api/v1/auth/register`. Drop localStorage user; store token only.
- **Verify:** `curl -X POST /api/v1/auth/login` returns a token; `GET /api/v1/auth/me` works with the token; admin can sign in and reach `/admin/dashboard`.

### Phase 2 — Public reads
- Public Controllers: Home, Event, Album, HallOfFame, Leaderboard, Notice, Certificate, Page, Setting.
- Implement corresponding Resources.
- **Frontend swap:** Replace mock returns in `lib/api.ts` for `getHomeBundles`, `getEvents`, `getLeaderboard`, `getNotices`, `getAlbums`, `getHallOfFame`, `getCertificate`, `getAbout`, `getActivities`, `getResources`.
- **Verify:** `/`, `/about`, `/activities`, `/resources`, `/events`, `/gallery`, `/hall-of-fame`, `/leaderboard`, `/verify`, `/notices` all render real DB-backed content.

### Phase 3 — Student core
- Student Controllers: Profile, Topic, Test, Attempt, Diagnostic, Puzzle, LiveExam, Community, EventRegistration.
- Implement `DiagnosticGrader`, `TestAttemptScorer`, `XpService`, `LeaderboardService`, `LiveExamScheduler`.
- **Frontend swap:** Replace mock-backed Zustand calls in:
  - `store/authStore` → `useAuthStore` calls `/auth/me` and `/auth/me` PATCH.
  - `store/practiceAttemptStore` → POST to `/tests/{id}/attempts/start`; PATCH to `/attempts/{id}/answer` and `/attempts/{id}/advance`; POST to `/attempts/{id}/submit`.
  - `store/diagnosticStore` → POST to `/diagnostic/start` and `/diagnostic/{id}/submit`.
  - `store/usersStore` (read-only for the student self-profile).
- **Verify:** A student can register → take placement → see correct ability level → take a practice test → see real results on the result page → submit a daily puzzle → see XP / streak update on dashboard.

### Phase 4 — Admin core
- Admin Controllers: Dashboard, User, Topic, Question, Test, Event (3 sub-types), Notice.
- Form requests with full validation.
- Spatie Activitylog listeners on all mutating controllers.
- **Frontend swap:** Replace `store/usersStore`, `store/questionStore`, `store/testStore`, `store/eventsStore`, `store/noticesStore` with API-backed mutations (keep optimistic UI where needed).
- **Verify:** Admin can create/edit/delete topics, modules, lessons, questions, tests, events, internal sessions, live exams, notices; admin can search/filter/delete users; admin can reset a student's diagnostic.

### Phase 5 — Admin content & remaining features
- Admin Controllers: Community moderation, Certificate CRUD + revoke, Registration event management, Puzzle CRUD, Puzzle submission review, Hall-of-fame & Album CRUD, CMS content editors, Site settings editor.
- Implement CSV exports.
- **Frontend swap:** Replace remaining mock-backed stores: community admin views, certificates admin, event registrations admin, puzzles admin, hall-of-fame admin, gallery admin, content pages admin.
- **Verify:** Admin can issue + revoke a certificate, approve/reject an event registration, mark puzzle submissions, edit `/about` content from a CMS form, change a site setting and see it reflect on the public site.

### Phase 6 — Polish
- Rate limiting (Laravel `throttle` middleware).
- `ExpireInProgressAttempts` scheduler.
- `SyncLiveExamStatus` scheduler + optional broadcasting for live-exam flips.
- API documentation (Scribe or `scribe-php`).
- PHPUnit feature tests for every controller.
- Frontend: remove `lib/mock/*` and `localStorage` persistence in Zustand stores; keep stores only for transient UI state.
- **Verify:** End-to-end smoke: register → placement → practice test → daily puzzle → community post → leaderboard updates; admin can do every CRUD in §4.4.

---

## 9. Frontend integration notes

- **Switching from mock to API:** in `lib/api.ts`, the existing abstraction already short-circuits to mocks when `NEXT_PUBLIC_API_URL` is empty. Set it to `http://localhost:8000/api/v1` and the real fetch branch activates.
- **Token storage:** keep the Sanctum token in `localStorage` (or `httpOnly` cookie if you proxy `/api` through Next.js rewrites). For v1, `localStorage` is fine and matches the existing pattern.
- **Type alignment:** the backend Resources must serialize **identically** to the existing TypeScript interfaces. A few critical mappings:
  - `users.id` is a UUID-ish string in the frontend's `User` interface; backend returns BIGINT → cast to string in `UserResource` to avoid JS precision loss.
  - `Question.options[]` (string[]) and `Question.answerOptions[]` (QuestionOption[]) are both needed by the frontend — `QuestionResource` returns both.
  - `Test.questionIds[]` is returned as part of the test, but per-question `correctOption` and `explanation` must be hidden until the attempt is submitted.
  - `DashboardStats.learningPath[].status` is a free-form string in the frontend; backend will return `'completed' | 'in_progress' | 'locked'`.
  - Date fields: backend returns ISO 8601 strings to match the frontend's expectations.

---

## 10. Verification checklist (end-to-end)

1. `php artisan migrate:fresh --seed` succeeds.
2. `php artisan test` passes (feature tests for each controller).
3. `php artisan serve` + `npm run dev` + set `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` in `Math-Olympiad/.env.local`.
4. **Auth flow:** register a new student at `/login` → token in localStorage → redirected to `/student/registration` → fills form → submits → redirected to `/student/placement`.
5. **Placement:** answers 9 questions → submits → `users.placement_done=true`, ability level & tier set → can now access `/student/tests`.
6. **Tests:** opens a practice test → timer starts per question → answers each → submits → `/student/tests/{id}/result` shows real score, topic breakdown, time spent; XP awarded; `test_attempts` row exists.
7. **Daily puzzle:** submits an answer that matches `expected_answer` → auto-approved; submits a different one → pending review in `/admin/puzzles` Submissions tab → admin marks it correct.
8. **Admin:** admin logs in at `/admin/login` → creates a topic with modules and lessons → creates a question with image upload → creates a test attached to that question → publishes a notice → issues a certificate (auto-generated ID) → verifies it at `/verify`.
9. **Leaderboard:** student takes more tests → `/leaderboard` shows updated ranks and trends.
10. **Live exam:** admin creates a live exam for `now+1min` → status `upcoming`; after 1 min, scheduler flips to `live`; after `duration`, flips to `ended`.
11. **CMS:** admin edits `/about` content via CMS form → `/about` renders the new content (Markdown + KaTeX).
12. **CSV export:** `/admin/certificates/export.csv` downloads a valid file.

---

## 11. Out of scope for v1 (defer to v2)

- Real-time leaderboard updates (use polling on `/leaderboard` in v1).
- Payment integration for `registration_events`.
- Multi-language support (i18n).
- Mobile push notifications for live exams.
- Mobile app API client.
- Bulk import for the question bank from LaTeX files.
