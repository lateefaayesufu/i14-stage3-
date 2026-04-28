// ─── Habit Utilities ─────────────────────────────────────────────────────────

import type { Habit } from '@/types/habit'

/**
 * Toggles a completion date on a habit (immutably).
 * - If the date is absent  → add it
 * - If the date is present → remove it
 * - Deduplicates the result
 * - Does NOT mutate the original habit
 */
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const existing = new Set(habit.completions)

  if (existing.has(date)) {
    existing.delete(date)
  } else {
    existing.add(date)
  }

  return {
    ...habit,
    completions: [...existing],
  }
}
