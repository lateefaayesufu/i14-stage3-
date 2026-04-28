// ─── Slug Utility ────────────────────────────────────────────────────────────
// Converts a habit name into a stable, URL-safe slug for data-testid values.

/**
 * getHabitSlug("Drink Water") => "drink-water"
 * getHabitSlug("  Read   Books ") => "read-books"
 * getHabitSlug("Wake Up @ 6am!") => "wake-up-6am"
 */
export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}
