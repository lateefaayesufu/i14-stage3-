// ─── Storage Layer ───────────────────────────────────────────────────────────
// All localStorage reads/writes live here. Typed, guarded, never throws.

import type { User, Session } from '@/types/auth'
import type { Habit } from '@/types/habit'
import { STORAGE_KEYS } from './constants'

const isBrowser = typeof window !== 'undefined'

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage quota exceeded — silent fail
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return read<User[]>(STORAGE_KEYS.USERS, [])
}

export function saveUsers(users: User[]): void {
  write(STORAGE_KEYS.USERS, users)
}

// ─── Session ─────────────────────────────────────────────────────────────────

export function getSession(): Session | null {
  return read<Session | null>(STORAGE_KEYS.SESSION, null)
}

export function saveSession(session: Session | null): void {
  write(STORAGE_KEYS.SESSION, session)
}

export function clearSession(): void {
  write(STORAGE_KEYS.SESSION, null)
}

// ─── Habits ──────────────────────────────────────────────────────────────────

export function getHabits(): Habit[] {
  return read<Habit[]>(STORAGE_KEYS.HABITS, [])
}

export function saveHabits(habits: Habit[]): void {
  write(STORAGE_KEYS.HABITS, habits)
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId)
}
