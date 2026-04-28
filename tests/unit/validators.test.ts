// ─── Unit Tests: validateHabitName ───────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { validateHabitName } from '../../src/lib/validators'

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    const result = validateHabitName('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Habit name is required')

    const whitespaceResult = validateHabitName('   ')
    expect(whitespaceResult.valid).toBe(false)
    expect(whitespaceResult.error).toBe('Habit name is required')
  })

  it('returns an error when habit name exceeds 60 characters', () => {
    const longName = 'a'.repeat(61)
    const result = validateHabitName(longName)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Habit name must be 60 characters or fewer')
  })

  it('returns a trimmed value when habit name is valid', () => {
    const result = validateHabitName('  Drink Water  ')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('Drink Water')
    expect(result.error).toBeNull()

    const exact60 = 'a'.repeat(60)
    const borderResult = validateHabitName(exact60)
    expect(borderResult.valid).toBe(true)
    expect(borderResult.value).toBe(exact60)
  })
})
