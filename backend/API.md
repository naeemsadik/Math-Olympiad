# UIU CMOR Backend API

Laravel 11 + Sanctum Bearer token authentication. All endpoints are prefixed
with `/api/v1`. The MySQL database is `math_olympiad` (see `.env`).

## Quick start

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Default admin (after seeding): `admin@uiu.ac.bd` / `UIUAdmin2024`.

## Authentication

| Method | Endpoint                | Auth | Notes                                |
| ------ | ----------------------- | ---- | ------------------------------------ |
| POST   | `/auth/register`        | -    | 5 req/min throttle                   |
| POST   | `/auth/login`           | -    | 5 req/min throttle                   |
| POST   | `/auth/logout`          | ✔    | Revokes current token                |
| GET    | `/auth/me`              | ✔    | Returns current user                 |
| PATCH  | `/auth/me`              | ✔    | Update profile                       |

## Public reads

| Method | Endpoint                  | Notes                                  |
| ------ | ------------------------- | -------------------------------------- |
| GET    | `/home/bundles`           | Aggregated home page payload           |
| GET    | `/events`                 | Olympiad events list                   |
| GET    | `/albums`                 | Albums list                            |
| GET    | `/hall-of-fame`           | Hall of fame entries                   |
| GET    | `/leaderboard`            | Period / tier / limit query params     |
| GET    | `/notices`                | Public notices                         |
| GET    | `/certificates/verify`    | Public certificate verification        |
| GET    | `/live-exams`             | Live exam schedule                     |
| GET    | `/pages/{slug}`           | CMS page by slug                       |
| GET    | `/settings`               | Site settings (object of typed values) |
| GET    | `/topics`                 | Topic catalog (30 topics)              |
| GET    | `/topics/{slug}`          | Topic detail with modules + lessons    |

## Student (auth required)

| Method | Endpoint                              | Notes                            |
| ------ | ------------------------------------- | -------------------------------- |
| GET    | `/student/dashboard`                  | Aggregated dashboard payload     |
| POST   | `/lessons/{id}/complete`              | Mark lesson complete             |
| GET    | `/tests`                              | Test catalog (placement-aware)   |
| GET    | `/tests/{id}`                         | Test detail                      |
| GET    | `/attempts`                           | User's recent attempts           |
| GET    | `/attempts/{attemptId}/result`        | Attempt result detail            |
| POST   | `/tests/{id}/attempts/start`          | Start attempt (placement.done)   |
| PATCH  | `/attempts/{attemptId}/answer`        | Record answer (placement.done)   |
| PATCH  | `/attempts/{attemptId}/advance`       | Move to next question            |
| POST   | `/attempts/{attemptId}/submit`        | Submit attempt                   |
| POST   | `/diagnostic/start`                   | Start placement diagnostic       |
| GET    | `/diagnostic/{attemptId}/questions`   | Get diagnostic questions         |
| POST   | `/diagnostic/{attemptId}/submit`      | Submit & grade diagnostic        |
| GET    | `/puzzles/today`                      | Today's daily puzzle             |
| GET    | `/puzzles/{id}/submissions/me`        | My puzzle submission history     |
| POST   | `/puzzles/{id}/submissions`           | Submit answer (3 req/hr throttle) |
| GET    | `/community/posts`                    | List community posts             |
| POST   | `/community/posts`                    | Create post                      |
| POST   | `/community/posts/{id}/like`          | Toggle like                      |
| GET    | `/community/posts/{id}/replies`       | List replies                     |
| POST   | `/community/posts/{id}/replies`       | Reply to post                    |
| POST   | `/event-registrations`                | Register for event               |

## Admin (auth + role:admin)

| Method | Endpoint                                                 | Notes                              |
| ------ | -------------------------------------------------------- | ---------------------------------- |
| GET    | `/admin/dashboard/stats`                                 | Platform KPIs                      |
| GET    | `/admin/users`                                           | List users (search/tier/role)      |
| POST   | `/admin/users`                                           | Create user (assigns role)         |
| GET    | `/admin/users/{id}`                                      | User + recent attempts             |
| PATCH  | `/admin/users/{id}`                                      | Update user (incl. password)       |
| DELETE | `/admin/users/{id}`                                      | Delete user                        |
| POST   | `/admin/users/{id}/reset-diagnostic`                     | Wipe diagnostic state              |
| GET    | `/admin/topics`                                          | List with module counts            |
| POST   | `/admin/topics`                                          | Create topic                       |
| PATCH  | `/admin/topics/{id}`                                     | Update topic                       |
| DELETE | `/admin/topics/{id}`                                     | Delete topic                       |
| GET    | `/admin/topics/{id}/modules`                             | List modules                       |
| POST   | `/admin/topics/{id}/modules`                             | Create module                      |
| GET    | `/admin/questions`                                        | List questions                     |
| POST   | `/admin/questions`                                        | Create question (with options)     |
| PATCH  | `/admin/questions/{id}`                                   | Update question                    |
| DELETE | `/admin/questions/{id}`                                   | Delete question                    |
| GET    | `/admin/tests`                                            | List tests                         |
| POST   | `/admin/tests`                                            | Create test (with diagnostic)      |
| PATCH  | `/admin/tests/{id}`                                       | Update test                        |
| DELETE | `/admin/tests/{id}`                                       | Delete test                        |
| GET    | `/admin/notices`                                          | List notices (filter by status)    |
| POST   | `/admin/notices`                                          | Create notice                      |
| PATCH  | `/admin/notices/{id}`                                     | Update notice                      |
| DELETE | `/admin/notices/{id}`                                     | Delete notice                      |
| POST   | `/admin/notices/{id}/toggle-pin`                          | Pin/unpin                          |
| GET    | `/admin/events/olympiad`                                  | List olympiad events               |
| POST   | `/admin/events/olympiad`                                  | Create olympiad event              |
| PATCH  | `/admin/events/olympiad/{id}`                             | Update olympiad event              |
| DELETE | `/admin/events/olympiad/{id}`                             | Delete olympiad event              |
| GET    | `/admin/events/internal-sessions`                         | List internal sessions             |
| POST   | `/admin/events/internal-sessions`                         | Create internal session            |
| PATCH  | `/admin/events/internal-sessions/{id}`                    | Update internal session            |
| DELETE | `/admin/events/internal-sessions/{id}`                    | Delete internal session            |
| GET    | `/admin/events/live-exams`                                | List live exams                    |
| POST   | `/admin/events/live-exams`                                | Create live exam                   |
| PATCH  | `/admin/events/live-exams/{id}`                           | Update live exam                   |
| DELETE | `/admin/events/live-exams/{id}`                           | Delete live exam                   |
| GET    | `/admin/registration-events`                              | List registration events           |
| POST   | `/admin/registration-events`                              | Create event                       |
| PATCH  | `/admin/registration-events/{id}`                         | Update event                       |
| DELETE | `/admin/registration-events/{id}`                         | Delete event                       |
| GET    | `/admin/registration-events/{id}/registrations`           | List registrations                 |
| PATCH  | `/admin/registration-events/{eventId}/registrations/{r}`  | Update registration                 |
| DELETE | `/admin/registration-events/{eventId}/registrations/{r}`  | Delete registration                 |
| GET    | `/admin/registration-events/{id}/registrations/export`    | CSV export                         |
| GET    | `/admin/certificates`                                     | List certificates                  |
| POST   | `/admin/certificates`                                     | Issue certificate (auto ID)        |
| PATCH  | `/admin/certificates/{id}`                                | Update certificate                 |
| DELETE | `/admin/certificates/{id}`                                | Delete certificate                 |
| POST   | `/admin/certificates/{id}/revoke`                         | Revoke (requires reason)           |
| POST   | `/admin/certificates/{id}/restore`                        | Restore revoked                    |
| GET    | `/admin/certificates/export`                              | CSV export                         |
| GET    | `/admin/puzzles`                                          | List puzzles                       |
| POST   | `/admin/puzzles`                                          | Create puzzle                      |
| PATCH  | `/admin/puzzles/{id}`                                     | Update puzzle                      |
| DELETE | `/admin/puzzles/{id}`                                     | Delete puzzle                      |
| GET    | `/admin/puzzle-submissions`                               | Review queue                       |
| PATCH  | `/admin/puzzle-submissions/{id}`                          | Review submission                  |
| GET    | `/admin/community/posts`                                  | Moderate posts                     |
| PATCH  | `/admin/community/posts/{id}`                             | Update post (status, pinned)       |
| DELETE | `/admin/community/posts/{id}`                             | Delete post                        |
| POST   | `/admin/community/posts/{id}/toggle-pin`                  | Pin/unpin post                     |
| GET    | `/admin/community/posts/{id}/replies`                     | List replies                       |
| DELETE | `/admin/community/posts/{postId}/replies/{replyId}`       | Delete reply                       |
| GET    | `/admin/hall-of-fame`                                     | List entries                       |
| POST   | `/admin/hall-of-fame`                                     | Create entry                       |
| PATCH  | `/admin/hall-of-fame/{id}`                                | Update entry                       |
| DELETE | `/admin/hall-of-fame/{id}`                                | Delete entry                       |
| GET    | `/admin/albums`                                           | List albums (with photo counts)    |
| POST   | `/admin/albums`                                           | Create album                       |
| GET    | `/admin/albums/{id}`                                      | Album + photos                     |
| PATCH  | `/admin/albums/{id}`                                      | Update album                       |
| DELETE | `/admin/albums/{id}`                                      | Delete album + photos               |
| POST   | `/admin/albums/{id}/photos`                               | Upload photo                       |
| DELETE | `/admin/albums/{id}/photos/{photoId}`                     | Delete photo                       |
| GET    | `/admin/pages`                                            | List CMS pages                     |
| POST   | `/admin/pages`                                            | Create page (+ widgets)            |
| GET    | `/admin/pages/{id}`                                       | Page + widgets                     |
| PATCH  | `/admin/pages/{id}`                                       | Update page (+ widgets)            |
| DELETE | `/admin/pages/{id}`                                       | Delete page + widgets               |
| GET    | `/admin/home-sections`                                    | List home sections                 |
| POST   | `/admin/home-sections`                                    | Create home section                |
| PATCH  | `/admin/home-sections/{id}`                               | Update section                     |
| POST   | `/admin/home-sections/reorder`                            | Reorder sections                   |
| GET    | `/admin/settings`                                         | Grouped settings (object)          |
| GET    | `/admin/settings/{key}`                                   | Single setting                     |
| PATCH  | `/admin/settings/{key}`                                   | Upsert setting                     |
| DELETE | `/admin/settings/{key}`                                   | Delete setting                     |

## Scheduled jobs (via `routes/console.php`)

| Command                         | Cadence       | Purpose                            |
| ------------------------------- | ------------- | ---------------------------------- |
| `olympiad:expire-attempts`      | every 5 min   | Auto-submit expired attempts       |
| `olympiad:sync-live-exams`      | every minute  | Transition live-exam state         |
| `olympiad:leaderboard-snapshot` | hourly        | Report top users                   |

Add to your cron: `* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1`

## Tests

```bash
php artisan test
```

22 tests, 79 assertions, all passing.
