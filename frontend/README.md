# UIU CMOR — Frontend

Next.js 16 (App Router) frontend for the UIU CMOR Math Olympiad platform. Talks to the
Laravel 11 backend at `/api/v1` via Sanctum Bearer-token authentication.

## Quick start

```bash
# 1. Install
npm install

# 2. Configure the backend URL
cp .env.example .env.local       # then edit NEXT_PUBLIC_API_URL if needed

# 3. Run the dev server
npm run dev                      # http://localhost:3000

# 4. (Optional) Run the backend in another terminal
cd ../backend && php artisan serve
```

The frontend works **without** the backend (it falls back to mock data when
`NEXT_PUBLIC_API_URL` is empty or unset). With the backend up, it logs in,
takes diagnostics, and lists topics/tests via real API calls.

## Environment

| Var | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | _(empty)_ | Base URL of the Laravel backend (no trailing slash, no `/api/v1` suffix — the client appends it automatically). |

If `NEXT_PUBLIC_API_URL` is empty, the app renders entirely from mock data in
`lib/mock/`. If it's set, all reads/writes go through `lib/api.ts` to the real
backend.

## How the API client works

All network traffic flows through one module: **`lib/api.ts`**.

- It uses native `fetch` (no axios / SWR / React Query — Zustand stores are the cache).
- Auth tokens come from `useAuthStore.token` (persisted to `localStorage` under `uiu-auth`).
- Responses unwrap Laravel's `{ data: ... }` envelope automatically.
- Errors throw a typed `ApiError` with `status`, `body`, and `errors` fields.

Namespaces (call sites read like `api.auth.login(...)`, `api.tests.list(...)`):

| Namespace | Endpoints |
| --- | --- |
| `api.auth` | register, login, logout, me, updateProfile |
| `api.public` | homeBundles, events, albums, hallOfFame, leaderboard, notices, verifyCertificate, liveExams, page, settings, topics, topicBySlug |
| `api.dashboard` | get (student), completeLesson |
| `api.tests` | list, get, myAttempts, attemptResult, start, answer, advance, submit |
| `api.diagnostic` | start, getQuestions, submit |
| `api.puzzles` | today, mySubmission, submit |
| `api.community` | listPosts, createPost, likePost, listReplies, createReply |
| `api.registrations` | register(eventId) |
| `api.admin.*` | mirrors every `/api/v1/admin/*` route — users, topics, questions, tests, notices, events (olympiad/internal/live), registrationEvents, certificates, puzzles, community, hallOfFame, albums, pages, homeSections, settings, dashboardStats |

## Stores

All client state lives in Zustand stores under `store/`. Each store keeps its
Zustand `persist` key so the UI survives a page refresh.

| Store | Persist key | Hydrated from |
| --- | --- | --- |
| `authStore` | `uiu-auth` | Sanctum Bearer token + `/auth/me` |
| `usersStore` | `uiu-users` | `/admin/users` |
| `testStore` | `uiu-tests` | `/tests` |
| `topicStore` | (none yet) | `/topics` |
| `questionStore` | `uiu-question-bank` | seeded mock (admin `/admin/questions`) |
| `diagnosticStore` | `uiu-diagnostic-attempts` | server-side diagnostic |
| `practiceAttemptStore` | `uiu-practice-attempts` | client-side attempt cache |
| `noticesStore` | `uiu-notices` | `/admin/notices` (admin) / `/notices` (public) |
| `eventsStore` | `uiu-events` | seeded mock |
| `leaderboardStore` | (none yet) | `/leaderboard` |

## Default seeded credentials

After running `php artisan migrate --seed` in `../backend`:

- **Admin**: `admin@uiu.ac.bd` / `UIUAdmin2024`
- **Students**: see `backend/database/seeders/UserSeeder.php`

## Project layout

```
app/
  (public)/      # public marketing pages
  (student)/     # authenticated student pages
  (admin)/       # authenticated admin pages
  login/         # combined sign-in / sign-up
components/      # shared UI primitives
lib/             # api client, mock data, helpers
store/           # Zustand stores (one slice per concern)
types/           # shared TypeScript types
```

## Notes for contributors

- IDs everywhere are typed as `string` to stay compatible with Laravel's BIGINT primary keys.
- Backend `role` values come back as `"Admin"` / `"Student"` / `"Faculty"` (capitalised); the API client normalises them to the frontend's `STUDENT` / `ADMIN` / `FACULTY` enum.
- Bearer tokens are stored in `localStorage` (Zustand `persist`). For production, switch to httpOnly cookies via Sanctum's SPA mode.
