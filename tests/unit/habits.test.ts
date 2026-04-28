// ─── Unit Tests: toggleHabitCompletion ───────────────────────────────────────

import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";
import type { Habit } from "../../src/types/habit";

const baseHabit: Habit = {
  id: "habit-001",
  userId: "user-001",
  name: "Drink Water",
  description: "2L per day",
  frequency: "daily",
  createdAt: "2026-01-01T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2026-04-25");
    expect(result.completions).toContain("2026-04-25");
    expect(result.completions).toHaveLength(1);
  });

  it("removes a completion date when the date already exists", () => {
    const habit = { ...baseHabit, completions: ["2026-04-25"] };
    const result = toggleHabitCompletion(habit, "2026-04-25");
    expect(result.completions).not.toContain("2026-04-25");
    expect(result.completions).toHaveLength(0);
  });

  it("does not mutate the original habit object", () => {
    const habit = { ...baseHabit, completions: ["2026-04-24"] };
    const originalCompletions = [...habit.completions];
    toggleHabitCompletion(habit, "2026-04-25");
    expect(habit.completions).toEqual(originalCompletions);
  });

  it("does not return duplicate completion dates", () => {
    const habit = { ...baseHabit, completions: ["2026-04-25", "2026-04-25"] };
    const result = toggleHabitCompletion(habit, "2026-04-26");
    const dates = result.completions.filter((d: string) => d === "2026-04-25");
    expect(dates.length).toBeLessThanOrEqual(1);
  });
});
