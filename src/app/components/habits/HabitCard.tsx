"use client";

// ─── HabitCard ───────────────────────────────────────────────────────────────
// Displays a single habit with streak dots, completion toggle, edit, delete.
// Upgraded: completion bloom animation, ripple ring, streak milestone badges.

import { useState, useCallback } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";
import { getHabits, saveHabits } from "@/lib/storage";

interface Props {
  habit: Habit;
  today: string;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
}

// ── Milestone config ──────────────────────────────────────────────────────────
const MILESTONES = [
  {
    days: 30,
    label: "30",
    color: "#e8c84a",
    glow: "rgba(232,200,74,0.4)",
    symbol: "✦",
  },
  {
    days: 21,
    label: "21",
    color: "#b8d96e",
    glow: "rgba(184,217,110,0.35)",
    symbol: "❧",
  },
  {
    days: 7,
    label: "7",
    color: "#8cb964",
    glow: "rgba(140,185,100,0.3)",
    symbol: "·",
  },
];

function getMilestone(streak: number) {
  return MILESTONES.find((m) => streak >= m.days) ?? null;
}

export default function HabitCard({ habit, today, onUpdate, onEdit }: Props) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completed = habit.completions.includes(today);
  const milestone = getMilestone(streak);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [blooming, setBlooming] = useState(false);
  const [rippling, setRippling] = useState(false);

  // Build 7-day dot history (oldest → newest = left → right)
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const isToday = dateStr === today;
    const filled = habit.completions.includes(dateStr);
    return { dateStr, isToday, filled };
  });

  const handleToggle = useCallback(() => {
    const wasCompleted = habit.completions.includes(today);

    // Only animate when completing (not un-completing)
    if (!wasCompleted) {
      setBlooming(true);
      setRippling(true);
      setTimeout(() => setBlooming(false), 500);
      setTimeout(() => setRippling(false), 650);
    }

    const all = getHabits();
    const updated = all.map((h) =>
      h.id === habit.id ? toggleHabitCompletion(h, today) : h,
    );
    saveHabits(updated);
    onUpdate();
  }, [habit, today, onUpdate]);

  function handleDelete() {
    const all = getHabits();
    const updated = all.filter((h) => h.id !== habit.id);
    saveHabits(updated);
    onUpdate();
  }

  return (
    <article
      data-testid={`habit-card-${slug}`}
      style={{
        borderBottom: "0.5px solid var(--garden-line)",
        padding: "14px 0",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* ── Completion stamp + ripple wrapper ── */}
      <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
        {/* Ripple ring — expands outward on completion */}
        {rippling && (
          <span
            aria-hidden
            className="animate-ripple"
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: 7,
              border: "1.5px solid rgba(140,185,100,0.55)",
              pointerEvents: "none",
            }}
          />
        )}

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-label={
            completed
              ? `Unmark ${habit.name} as complete`
              : `Mark ${habit.name} as complete`
          }
          aria-pressed={completed}
          className={blooming ? "animate-bloom" : ""}
          style={{
            width: 30,
            height: 30,
            borderRadius: 5,
            border: completed
              ? "1px solid rgba(140,185,100,0.55)"
              : "1px solid rgba(255,255,255,0.12)",
            background: completed ? "rgba(140,185,100,0.12)" : "transparent",
            color: completed ? "var(--garden-green)" : "rgba(255,255,255,0.18)",
            fontSize: completed ? 13 : 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: blooming ? "none" : "all 0.2s",
            fontFamily: "var(--font-cormorant)",
            boxShadow: completed ? "0 0 5px rgba(140,185,100,0.18)" : "none",
          }}
        >
          {completed ? "✦" : "○"}
        </button>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: 17,
                fontWeight: 400,
                color: completed ? "var(--garden-faint)" : "var(--garden-text)",
                textDecoration: completed ? "line-through" : "none",
                textDecorationColor: "rgba(140,185,100,0.3)",
                lineHeight: 1.2,
                marginBottom: 2,
                transition: "color 0.2s",
              }}
            >
              {habit.name}
            </p>
            {habit.description && (
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.3px",
                  marginBottom: 6,
                }}
              >
                {habit.description}
              </p>
            )}
          </div>

          {/* Edit / Delete controls */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              aria-label={`Edit ${habit.name}`}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.2)",
                fontSize: 12,
                cursor: "pointer",
                padding: "2px 4px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
              }
            >
              ✎
            </button>
            <button
              data-testid={`habit-delete-${slug}`}
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${habit.name}`}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.2)",
                fontSize: 12,
                cursor: "pointer",
                padding: "2px 4px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8735a")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
              }
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Streak dots + count + milestone badge ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {dots.map(({ dateStr, isToday, filled }) => (
            <span
              key={dateStr}
              className={`streak-dot${filled && isToday ? " hot" : filled ? " lit" : ""}`}
              aria-hidden
            />
          ))}

          <span
            data-testid={`habit-streak-${slug}`}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: 9,
              color:
                streak > 0 ? "var(--garden-muted)" : "rgba(255,255,255,0.18)",
              marginLeft: 4,
              letterSpacing: "0.5px",
            }}
          >
            {streak} {streak === 1 ? "day" : "days"}
          </span>

          {/* Milestone badge */}
          {milestone && (
            <span
              className="animate-milestone"
              aria-label={`${milestone.label}-day streak milestone`}
              style={{
                marginLeft: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                background: `rgba(${milestone.color
                  .replace("#", "")
                  .match(/.{2}/g)!
                  .map((h) => parseInt(h, 16))
                  .join(",")},0.1)`,
                border: `0.5px solid ${milestone.color}55`,
                borderRadius: 4,
                padding: "1px 5px",
                fontSize: 8,
                fontFamily: "var(--font-dm-mono)",
                letterSpacing: "1px",
                color: milestone.color,
                boxShadow: `0 0 8px ${milestone.glow}`,
              }}
            >
              <span style={{ fontSize: 9 }}>{milestone.symbol}</span>
              {milestone.label}d
            </span>
          )}
        </div>
      </div>

      {/* ── Delete confirmation overlay ── */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div
            className="garden-card"
            style={{ padding: 24, maxWidth: 300, width: "100%" }}
          >
            <p
              className="font-serif"
              style={{
                fontSize: 20,
                fontStyle: "italic",
                color: "var(--garden-text)",
                marginBottom: 8,
              }}
            >
              Release this habit?
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              <em
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                }}
              >
                {habit.name}
              </em>{" "}
              and all its completions will be removed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(false)}
                className="garden-btn-ghost"
                style={{ flex: 1 }}
              >
                keep it
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={handleDelete}
                style={{
                  flex: 1,
                  background: "rgba(232,115,90,0.1)",
                  border: "0.5px solid rgba(232,115,90,0.4)",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: 11,
                  color: "#e8735a",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                }}
              >
                release
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
