// ─── Integration Tests: Habit Form ───────────────────────────────────────────

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import HabitForm from "../../src/app/components/habits/HabitForm.tsx";
import HabitList from "../../src/app/components/habits/HabitList.tsx";
import HabitCard from "../../src/app/components/habits/HabitCard.tsx";
import { STORAGE_KEYS } from "../../src/lib/constants";
import type { Habit } from "../../src/types/habit";

const TODAY = "2026-04-25";

const SESSION = { userId: "user-test-001", email: "tester@garden.com" };

const sampleHabit: Habit = {
  id: "habit-test-001",
  userId: "user-test-001",
  name: "Drink Water",
  description: "2L daily",
  frequency: "daily",
  createdAt: "2026-01-01T00:00:00.000Z",
  completions: [],
};

beforeEach(() => {
  localStorage.clear();
  mockReplace.mockClear();
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(SESSION));
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<HabitForm onSave={onSave} onCancel={onCancel} />);

    // Submit without entering a name
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Habit name is required",
      );
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();

    // Set up habits storage empty
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([]));

    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<HabitForm onSave={onSave} onCancel={onCancel} />);

    await user.type(screen.getByTestId("habit-name-input"), "Morning Run");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Before 8am",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const habits = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.HABITS) ?? "[]",
      );
      expect(habits.length).toBe(1);
      expect(habits[0].name).toBe("Morning Run");
      expect(habits[0].description).toBe("Before 8am");
      expect(habits[0].frequency).toBe("daily");
      expect(habits[0].userId).toBe(SESSION.userId);
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([sampleHabit]));

    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <HabitForm
        editingHabit={sampleHabit}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    // Clear and retype the name
    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const habits = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.HABITS) ?? "[]",
      );
      expect(habits.length).toBe(1);
      const updated = habits[0];
      expect(updated.name).toBe("Drink More Water");
      // Immutable fields must be preserved
      expect(updated.id).toBe(sampleHabit.id);
      expect(updated.userId).toBe(sampleHabit.userId);
      expect(updated.createdAt).toBe(sampleHabit.createdAt);
      expect(updated.completions).toEqual(sampleHabit.completions);
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([sampleHabit]));

    const onUpdate = vi.fn();
    const onEdit = vi.fn();

    render(
      <HabitCard
        habit={sampleHabit}
        today={TODAY}
        onUpdate={onUpdate}
        onEdit={onEdit}
      />,
    );

    // Click delete — confirmation modal should appear
    await user.click(screen.getByTestId("habit-delete-drink-water"));

    // Habit should still be in storage (not deleted yet)
    let habits = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) ?? "[]");
    expect(habits.length).toBe(1);

    // Confirm deletion
    await user.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      habits = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) ?? "[]");
      expect(habits.length).toBe(0);
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([sampleHabit]));

    const onUpdate = vi.fn();
    const onEdit = vi.fn();

    render(
      <HabitCard
        habit={sampleHabit}
        today={TODAY}
        onUpdate={onUpdate}
        onEdit={onEdit}
      />,
    );

    // Initially streak is 0
    const streakEl = screen.getByTestId("habit-streak-drink-water");
    expect(streakEl).toHaveTextContent("0");

    // Toggle complete for today
    await user.click(screen.getByTestId("habit-complete-drink-water"));

    await waitFor(() => {
      const habits = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.HABITS) ?? "[]",
      );
      expect(habits[0].completions).toContain(TODAY);
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
