// ─── Unit Tests: getHabitSlug ─────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { getHabitSlug } from '../../src/lib/slug'

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water')
    expect(getHabitSlug('Read Books')).toBe('read-books')
    expect(getHabitSlug('Morning Run')).toBe('morning-run')
  })

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Drink   Water  ')).toBe('drink-water')
    expect(getHabitSlug('  Read   Books  ')).toBe('read-books')
    expect(getHabitSlug('wake   up   early')).toBe('wake-up-early')
  })

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Wake Up @ 6am!')).toBe('wake-up-6am')
    expect(getHabitSlug('Drink 2L of Water!!!')).toBe('drink-2l-of-water')
    expect(getHabitSlug('Read (books) & journals')).toBe('read-books-journals')
  })
})
