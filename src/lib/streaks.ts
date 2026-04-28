// ─── Streak Calculator ───────────────────────────────────────────────────────

/**
 * Calculates the current consecutive-day streak from an array of completion dates.
 *
 * @param completions - array of YYYY-MM-DD strings (may contain duplicates)
 * @param today       - override today's date (YYYY-MM-DD) — useful for testing
 * @returns           - number of consecutive days ending today, or 0
 *
 * Rules:
 *   - duplicates are removed before calculation
 *   - dates are sorted ascending before logic runs
 *   - if today is not in completions → streak is 0
 *   - if today is completed → count backwards through consecutive calendar days
 */
export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today ?? new Date().toISOString().slice(0, 10)

  // Deduplicate
  const unique = [...new Set(completions)]

  // Sort ascending
  unique.sort()

  // Today must be present for any streak to count
  if (!unique.includes(todayStr)) return 0

  let streak = 0
  let cursor = new Date(todayStr)

  // Walk backwards from today as long as each day exists
  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10)
    if (!unique.includes(dateStr)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
