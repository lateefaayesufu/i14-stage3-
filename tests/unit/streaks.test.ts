// ─── Unit Tests: calculateCurrentStreak ──────────────────────────────────────

import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "../../src/lib/streaks";

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe("calculateCurrentStreak", () => {
  const TODAY = "2026-04-25";
  const YESTERDAY = "2026-04-24";
  const TWO_AGO = "2026-04-23";
  const THREE_AGO = "2026-04-22";

  it("returns 0 when completions is empty", () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0);
  });

  it("returns 0 when today is not completed", () => {
    expect(calculateCurrentStreak([YESTERDAY], TODAY)).toBe(0);
    expect(calculateCurrentStreak([TWO_AGO, THREE_AGO], TODAY)).toBe(0);
  });

  it("returns the correct streak for consecutive completed days", () => {
    expect(calculateCurrentStreak([TODAY], TODAY)).toBe(1);
    expect(calculateCurrentStreak([TODAY, YESTERDAY], TODAY)).toBe(2);
    expect(calculateCurrentStreak([TODAY, YESTERDAY, TWO_AGO], TODAY)).toBe(3);
    expect(
      calculateCurrentStreak([TODAY, YESTERDAY, TWO_AGO, THREE_AGO], TODAY),
    ).toBe(4);
  });

  it("ignores duplicate completion dates", () => {
    expect(calculateCurrentStreak([TODAY, TODAY, TODAY], TODAY)).toBe(1);
    expect(
      calculateCurrentStreak([TODAY, YESTERDAY, YESTERDAY, TODAY], TODAY),
    ).toBe(2);
  });

  it("breaks the streak when a calendar day is missing", () => {
    // today + two days ago but NOT yesterday → streak is 1 (only today counts)
    expect(calculateCurrentStreak([TODAY, TWO_AGO], TODAY)).toBe(1);
    // today + three ago but gap at yesterday and two ago → streak is 1
    expect(calculateCurrentStreak([TODAY, THREE_AGO], TODAY)).toBe(1);
  });
});
