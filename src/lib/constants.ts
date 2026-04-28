// ─── Storage Keys ───────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USERS: "habit-tracker-users",
  SESSION: "habit-tracker-session",
  HABITS: "habit-tracker-habits",
} as const;

// ─── Auth Messages ──────────────────────────────────────────────────────────
export const AUTH_ERRORS = {
  DUPLICATE_EMAIL: "User already exists",
  INVALID_LOGIN: "Invalid email or password",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
} as const;

// ─── Validation Messages ─────────────────────────────────────────────────────
export const VALIDATION = {
  HABIT_NAME_REQUIRED: "Habit name is required",
  HABIT_NAME_TOO_LONG: "Habit name must be 60 characters or fewer",
  HABIT_NAME_MAX_LENGTH: 60,
} as const;

// ─── Timing ──────────────────────────────────────────────────────────────────
export const SPLASH_DURATION_MS = 1600;
