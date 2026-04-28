# 🌿 Habit Tracker — Grow Daily

> _A mindful habit tracker PWA. Plant your practices, watch them grow._

Dark garden aesthetic — Cormorant Garamond serif meets DM Mono precision. Built with Next.js App Router, TypeScript, Tailwind CSS, and fully local persistence.

---

## 📦 Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Framework       | Next.js 14 (App Router)                |
| Language        | TypeScript                             |
| Styling         | Tailwind CSS + CSS custom properties   |
| Persistence     | localStorage (fully local, no backend) |
| Unit Tests      | Vitest + @vitest/coverage-v8           |
| Component Tests | React Testing Library                  |
| E2E Tests       | Playwright                             |

---

## 🚀 Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd habit-tracker

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the splash screen will greet you.

---

## 🧪 Running Tests

```bash
# Unit tests only (with coverage report)
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires dev server running)
npm run test:e2e

# All tests
npm test
```

Coverage report is generated at `coverage/` after `test:unit`.  
Minimum threshold: **80% line coverage** across `src/lib/`.

> **E2E note:** Playwright will auto-start the dev server via `webServer` config. If you want to run it manually, start `npm run dev` in a separate terminal first.

---

## 🗂 Folder Structure

```
src/
  app/
    globals.css          # Design system, CSS tokens, animations
    layout.tsx           # Root layout, font loading, PWA metadata
    page.tsx             # / — splash screen + session-aware redirect
    login/page.tsx       # /login — login route
    signup/page.tsx      # /signup — signup route
    dashboard/page.tsx   # /dashboard — protected habit dashboard
  components/
    auth/
      LoginForm.tsx      # Email/password login form
      SignupForm.tsx     # Email/password signup form
    habits/
      HabitCard.tsx      # Individual habit row with streak dots + actions
      HabitForm.tsx      # Create / edit habit modal form
      HabitList.tsx      # Renders all habits or empty state
    shared/
      SplashScreen.tsx         # Full-screen splash with kanji watermark
      ProtectedRoute.tsx       # Session guard → redirects to /login
      ServiceWorkerRegistrar.tsx  # Client-side SW registration
  lib/
    auth.ts              # signUp / logIn / logOut business logic
    constants.ts         # Storage keys, error messages, timing
    habits.ts            # toggleHabitCompletion utility
    slug.ts              # getHabitSlug — name → data-testid slug
    storage.ts           # All localStorage read/write operations
    streaks.ts           # calculateCurrentStreak algorithm
    validators.ts        # validateHabitName with exact error messages
  types/
    auth.ts              # User, Session types
    habit.ts             # Habit type
tests/
  unit/                  # Vitest pure logic tests
  integration/           # React Testing Library component tests
  e2e/                   # Playwright browser tests
public/
  manifest.json          # PWA manifest
  sw.js                  # Service worker (cache-first app shell)
  icons/                 # icon-192.png, icon-512.png
```

---

## 💾 Local Persistence Structure

All data lives in `localStorage`. Three keys:

### `habit-tracker-users`

```json
[
  {
    "id": "abc123",
    "email": "user@example.com",
    "password": "plaintext",
    "createdAt": "2026-04-25T10:00:00.000Z"
  }
]
```

### `habit-tracker-session`

```json
{ "userId": "abc123", "email": "user@example.com" }
```

Set to `null` on logout.

### `habit-tracker-habits`

```json
[
  {
    "id": "xyz789",
    "userId": "abc123",
    "name": "Drink Water",
    "description": "2L daily goal",
    "frequency": "daily",
    "createdAt": "2026-04-25T10:01:00.000Z",
    "completions": ["2026-04-24", "2026-04-25"]
  }
]
```

`completions` holds unique `YYYY-MM-DD` strings. Streaks are calculated client-side from this array on every render.

---

## 🌐 PWA Support

| Feature        | Implementation                                                         |
| -------------- | ---------------------------------------------------------------------- |
| Manifest       | `public/manifest.json` — name, icons, display: standalone, theme color |
| Service Worker | `public/sw.js` — network-first with app shell cache fallback           |
| Registration   | `ServiceWorkerRegistrar.tsx` — client-side, registered in root layout  |
| Icons          | `public/icons/icon-192.png` + `icon-512.png`                           |
| Offline        | App shell loads from cache after first visit. No hard crash offline.   |

---

## 🗺 Test File Map

| File                                    | What it verifies                                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `tests/unit/slug.test.ts`               | `getHabitSlug` — lowercase, hyphenation, space collapsing, special char removal                                  |
| `tests/unit/validators.test.ts`         | `validateHabitName` — empty, too long, trimming, exact error messages                                            |
| `tests/unit/streaks.test.ts`            | `calculateCurrentStreak` — empty, not today, consecutive days, duplicates, gaps                                  |
| `tests/unit/habits.test.ts`             | `toggleHabitCompletion` — add, remove, immutability, no duplicates                                               |
| `tests/integration/auth-flow.test.tsx`  | Signup form, duplicate email error, login form, invalid credentials error                                        |
| `tests/integration/habit-form.test.tsx` | Validation error, create habit, edit + preserve fields, delete confirmation, streak toggle                       |
| `tests/e2e/app.spec.ts`                 | Full user journeys: splash, auth redirect, protection, signup, login, create, complete, persist, logout, offline |

---

## ⚖️ Trade-offs & Limitations

- **Passwords stored in plaintext** — intentional per spec (local-only, no backend, deterministic auth)
- **No remote sync** — all data is device-local; clearing localStorage resets everything
- **Single frequency** — only `daily` habits are supported per Stage 3 spec
- **No real push notifications** — PWA install + offline shell only
- **Service worker caches aggressively** — hard refresh (`Ctrl+Shift+R`) may be needed during development

---

## 🗓 Spec Mapping

Built strictly from the [Stage 3 Technical Requirements Document](https://docs.google.com/document/d/1Gp2_0pZWWnQbLc6zLS1U4wI6kO8DCC07Ea5JFjOYXlI).

Every route, storage key, exported function signature, data-testid, error message, test describe block name, and exact test title matches the spec. No assumptions were made beyond what is specified.

---

_Habit Tracker — grow daily. 習_
