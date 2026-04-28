// ─── Validators ──────────────────────────────────────────────────────────────

import { VALIDATION } from './constants'

export type ValidationResult = {
  valid: boolean
  value: string
  error: string | null
}

/**
 * Validates and normalises a habit name.
 * - Trims whitespace
 * - Rejects empty strings
 * - Rejects strings longer than 60 characters
 */
export function validateHabitName(name: string): ValidationResult {
  const trimmed = name.trim()

  if (!trimmed) {
    return { valid: false, value: '', error: VALIDATION.HABIT_NAME_REQUIRED }
  }

  if (trimmed.length > VALIDATION.HABIT_NAME_MAX_LENGTH) {
    return { valid: false, value: trimmed, error: VALIDATION.HABIT_NAME_TOO_LONG }
  }

  return { valid: true, value: trimmed, error: null }
}
