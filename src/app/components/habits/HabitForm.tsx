"use client";

// ─── HabitForm ───────────────────────────────────────────────────────────────
// Create or edit a habit. Used as a slide-up modal panel.
// Upgraded: maxLength bug fix (60), character counter, frequency badge.

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import type { Habit } from "@/types/habit";
import type { Session } from "@/types/auth";
import { validateHabitName } from "@/lib/validators";
import { VALIDATION } from "@/lib/constants";
import { getHabits, saveHabits, getSession } from "@/lib/storage";

interface Props {
  editingHabit?: Habit | null;
  onSave: () => void;
  onCancel: () => void;
}

const MAX = VALIDATION.HABIT_NAME_MAX_LENGTH; // 60

export default function HabitForm({ editingHabit, onSave, onCancel }: Props) {
  const [name, setName] = useState(editingHabit?.name ?? "");
  const [description, setDescription] = useState(
    editingHabit?.description ?? "",
  );
  const [frequency] = useState<"daily">("daily");
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description);
    }
  }, [editingHabit]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    setNameError(null);
    const session = getSession() as Session;
    const all = getHabits();

    if (editingHabit) {
      const updated = all.map((h) =>
        h.id === editingHabit.id
          ? {
              ...h,
              name: validation.value,
              description: description.trim(),
              frequency,
            }
          : h,
      );
      saveHabits(updated);
    } else {
      const newHabit: Habit = {
        id: nanoid(),
        userId: session.userId,
        name: validation.value,
        description: description.trim(),
        frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      saveHabits([...all, newHabit]);
    }

    onSave();
  }

  const nameLen = name.length;
  const nearLimit = nameLen >= MAX * 0.8;
  const atLimit = nameLen >= MAX;
  const counterColor = atLimit
    ? "#e8735a"
    : nearLimit
      ? "#e8c84a"
      : "rgba(255,255,255,0.2)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 40,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        data-testid="habit-form"
        className="garden-card animate-slide-up"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "28px 24px 32px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          opacity: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2
            className="font-serif"
            style={{
              fontSize: 24,
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--garden-text)",
            }}
          >
            {editingHabit ? "Tend this habit." : "Plant a new habit."}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close form"
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.2)",
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
            }
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name — with char counter */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <label
                htmlFor="habit-name"
                className="garden-label"
                style={{ marginBottom: 0 }}
              >
                Habit name *
              </label>
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: counterColor,
                  letterSpacing: "0.5px",
                  transition: "color 0.2s",
                }}
              >
                {nameLen}/{MAX}
              </span>
            </div>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              placeholder="e.g. Morning run"
              className="garden-input"
              maxLength={MAX}
              aria-describedby={nameError ? "habit-name-error" : undefined}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <p
                id="habit-name-error"
                role="alert"
                className="animate-fade-in"
                style={{
                  fontSize: 10,
                  color: "#e8735a",
                  marginTop: 6,
                  letterSpacing: "0.3px",
                  opacity: 0,
                }}
              >
                ↳ {nameError}
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="habit-description" className="garden-label">
              Description (optional)
            </label>
            <input
              id="habit-description"
              data-testid="habit-description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Before 8am, at least 30 min"
              className="garden-input"
            />
          </div>

          {/* Frequency — styled badge instead of bare disabled select */}
          <div style={{ marginBottom: 28 }}>
            <label htmlFor="habit-frequency" className="garden-label">
              Frequency
            </label>

            {/* Visually hidden select preserves the required data-testid */}
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              value={frequency}
              disabled
              aria-hidden="true"
              style={{ display: "none" }}
            >
              <option value="daily">daily</option>
            </select>

            {/* Visible badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(140,185,100,0.06)",
                border: "0.5px solid rgba(140,185,100,0.2)",
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--garden-green)",
                  boxShadow: "0 0 5px rgba(140,185,100,0.5)",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: "var(--garden-muted)",
                  letterSpacing: "1.5px",
                }}
              >
                daily
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.18)",
                  letterSpacing: "1px",
                  marginLeft: 4,
                }}
              >
                only option
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onCancel}
              className="garden-btn-ghost"
              style={{ flex: 1 }}
            >
              cancel
            </button>
            <button
              data-testid="habit-save-button"
              type="submit"
              className="garden-btn-primary"
              style={{ flex: 2 }}
            >
              {editingHabit ? "save changes →" : "plant it →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
