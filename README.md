# Habit Tracker — Grow Daily

A mobile-first Habit Tracker Progressive Web App built for Stage 3 of the Frontend Wizards program. Built strictly from the Technical Requirements Document.

---

## Project Overview

Habit Tracker is a local-first PWA that allows users to sign up, log in, create and manage daily habits, track streaks, and install the app on their device. All data is persisted in localStorage — no backend, no remote database.

The visual design follows a dark garden aesthetic: Cormorant Garamond serif typography, DM Mono for metadata, and a muted green palette inspired by Japanese wabi-sabi principles.

---

## Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/lateefaayesufu/i14-stage3-
cd habit-tracker

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (one-time)
npx playwright install chromium
```

---

## Run Instructions

```bash
# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

For production:

```bash
npm run build
npm run start
```

---

## Test Instructions

```bash
# Unit tests with coverage report
npm run test:unit

# Integration and component tests
npm run test:integration

# End-to-end tests (auto-starts dev server)
npm run test:e2e

# Run all tests
npm test
```

Coverage report is generated in the `coverage/` directory after `test:unit`.
Minimum threshold: 80% line coverage across `src/lib/`.

---

## Local Persistence Structure

All data is stored in localStorage under three keys:

### habit-tracker-users

Stores a JSON array of registered users.

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

### habit-tracker-session

Stores the active session or null when logged out.

```json
{ "userId": "abc123", "email": "user@example.com" }
```

### habit-tracker-habits

Stores a JSON array of all habits across all users.

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

Each habit belongs to a user via `userId`. Completions are unique YYYY-MM-DD strings. Streaks are calculated client-side from the completions array on every render.

---

## PWA Support

PWA support is implemented as follows:

- `public/manifest.json` includes name, short_name, start_url, display, background_color, theme_color, and icons for 192x192 and 512x512.
- `public/sw.js` is a cache-first service worker that caches the app shell on install and serves it offline after the first visit.
- `src/components/shared/ServiceWorkerRegistrar.tsx` handles client-side registration of the service worker and is mounted in the root layout.
- Icons are located at `public/icons/icon-192.png` and `public/icons/icon-512.png`.

After the first load, the app shell renders offline without a hard crash.

---

## Trade-offs and Limitations

- Passwords are stored in plaintext in localStorage. This is intentional per the spec which requires local, deterministic authentication with no backend.
- All data is device-local. Clearing localStorage or switching browsers resets the app completely.
- Only daily frequency is supported. The spec limits Stage 3 to daily habits only.
- No push notifications. PWA support covers install and offline shell only.
- The service worker caches aggressively. During development, a hard refresh (Ctrl+Shift+R) may be needed after rebuilds to clear stale chunk references.

---

## Test File Map

| File                                    | What it verifies                                                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tests/unit/slug.test.ts`               | `getHabitSlug` — lowercase conversion, hyphenation, space collapsing, special character removal                                                                                |
| `tests/unit/validators.test.ts`         | `validateHabitName` — empty input, exceeding 60 characters, trimming, exact error messages                                                                                     |
| `tests/unit/streaks.test.ts`            | `calculateCurrentStreak` — empty completions, today not completed, consecutive days, duplicate dates, broken streaks                                                           |
| `tests/unit/habits.test.ts`             | `toggleHabitCompletion` — adding a date, removing a date, immutability, no duplicate completions                                                                               |
| `tests/integration/auth-flow.test.tsx`  | Signup form submission, duplicate email rejection, login form submission, invalid credentials rejection                                                                        |
| `tests/integration/habit-form.test.tsx` | Habit name validation, habit creation, editing with field preservation, delete confirmation, completion toggle and streak update                                               |
| `tests/e2e/app.spec.ts`                 | Full user journeys: splash screen, unauthenticated redirect, dashboard protection, signup, login, habit creation, habit completion, session persistence, logout, offline shell |

---

## Implementation Map

This project was built strictly from the Stage 3 Technical Requirements Document. The mapping is as follows:

- Routes: `/`, `/login`, `/signup`, `/dashboard` match the route contract exactly.
- Storage keys: `habit-tracker-users`, `habit-tracker-session`, `habit-tracker-habits` match the persistence contract exactly.
- Type exports: `User`, `Session`, `Habit` match the type contract exactly.
- Utility functions: `getHabitSlug`, `validateHabitName`, `calculateCurrentStreak`, `toggleHabitCompletion` match the function contract exactly including signatures and error messages.
- All data-testid values match the UI contract exactly.
- All test describe block names and test titles match the spec exactly.
- All package scripts match the required script names exactly.

---

Minimum 80% line coverage required for `src/lib/` utilities.

Habit Tracker — grow daily.
