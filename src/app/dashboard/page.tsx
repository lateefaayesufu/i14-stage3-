"use client";

// ─── /dashboard ──────────────────────────────────────────────────────────────
// The main garden. Protected — requires active session.
// Upgraded: SVG progress ring replaces plain "N/N done" text.

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import type { Habit } from "@/types/habit";
import type { Session } from "@/types/auth";
import { getSession } from "@/lib/storage";
import { getHabitsForUser } from "@/lib/storage";
import { logOut } from "@/lib/auth";

// ── Day/week helpers ──────────────────────────────────────────────────────────
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr: string): {
  day: string;
  date: string;
  week: string;
} {
  const d = new Date(dateStr + "T00:00:00");
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7,
  );
  return {
    day: DAY_NAMES[d.getDay()].toLowerCase(),
    date: `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`,
    week: `week ${weekNum}`,
  };
}

// ── Progress Ring ─────────────────────────────────────────────────────────────
// A small SVG arc that fills as you complete habits.
function ProgressRing({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const size = 36;
  const stroke = 1.5;
  const radius = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : completed / total;
  const offset = circ - pct * circ;
  const allDone = total > 0 && completed === total;

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {/* Fill */}
        {total > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={allDone ? "#e8c84a" : "var(--garden-green)"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="progress-ring-circle"
            style={{
              filter: allDone
                ? "drop-shadow(0 0 4px rgba(232,200,74,0.6))"
                : pct > 0.5
                  ? "drop-shadow(0 0 3px rgba(140,185,100,0.3))"
                  : "none",
            }}
          />
        )}
      </svg>

      {/* Centre label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 7,
            color: allDone ? "#e8c84a" : "rgba(255,255,255,0.35)",
            letterSpacing: "0px",
            lineHeight: 1,
            transition: "color 0.4s",
          }}
        >
          {total === 0 ? "—" : `${completed}/${total}`}
        </span>
      </div>
    </div>
  );
}

// ── Dashboard inner ───────────────────────────────────────────────────────────
function DashboardInner() {
  const router = useRouter();
  const session = getSession() as Session;
  const today = getToday();
  const { day, date, week } = formatDisplayDate(today);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Safety check: redirect if no session
  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  const loadHabits = useCallback(() => {
    if (session?.userId) {
      setHabits(getHabitsForUser(session.userId));
    }
  }, [session?.userId]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  function handleLogout() {
    logOut();
    router.replace("/login");
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleFormSave() {
    setShowForm(false);
    setEditingHabit(null);
    loadHabits();
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingHabit(null);
  }

  const completedCount = habits.filter((h) =>
    h.completions.includes(today),
  ).length;
  const allDone = habits.length > 0 && completedCount === habits.length;

  return (
    <div
      data-testid="dashboard-page"
      style={{
        minHeight: "100dvh",
        background: "var(--garden-bg)",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
        padding: "0 0 100px",
        position: "relative",
      }}
    >
      {/* Background kanji */}
      <span
        aria-hidden
        className="font-serif"
        style={{
          position: "fixed",
          bottom: 20,
          right: 16,
          fontSize: 160,
          color: "rgba(255,255,255,0.018)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        習
      </span>

      {/* ── Header ── */}
      <header
        style={{
          padding: "20px 24px 16px",
          borderBottom: "0.5px solid var(--garden-line)",
          position: "sticky",
          top: 0,
          background: "var(--garden-bg)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 8,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(140,185,100,0.4)",
            }}
          >
            Habit Tracker
          </span>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            aria-label="Log out"
            className="font-mono"
            style={{
              background: "transparent",
              border: "none",
              fontSize: 9,
              color: "rgba(255,255,255,0.2)",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
            }
          >
            exit ↗
          </button>
        </div>

        {/* Title row + progress ring */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h1
            className="font-serif"
            style={{
              fontSize: 36,
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--garden-text)",
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            Today's
            <br />
            Garden
          </h1>

          {/* Progress ring — only shown when there are habits */}
          {habits.length > 0 && (
            <div style={{ paddingBottom: 6 }}>
              <ProgressRing completed={completedCount} total={habits.length} />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 9,
              color: "rgba(140,185,100,0.45)",
              letterSpacing: "1px",
            }}
          >
            {day} · {date} · {week}
          </p>

          {/* "all tended" label when fully done */}
          {allDone && (
            <p
              className="font-mono animate-fade-in"
              style={{
                fontSize: 9,
                color: "#e8c84a",
                letterSpacing: "1px",
                opacity: 0,
              }}
            >
              all tended ✦
            </p>
          )}
        </div>
      </header>

      {/* ── Habit list ── */}
      <main
        style={{ flex: 1, padding: "0 24px", position: "relative", zIndex: 1 }}
      >
        <div style={{ marginTop: 8 }}>
          <p
            className="font-mono"
            style={{
              fontSize: 8,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
              padding: "12px 0 4px",
            }}
          >
            your practices
          </p>

          <HabitList
            habits={habits}
            today={today}
            onUpdate={loadHabits}
            onEdit={handleEdit}
          />
        </div>
      </main>

      {/* ── Add habit button ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          padding: "12px 24px 24px",
          background:
            "linear-gradient(to top, var(--garden-bg) 70%, transparent)",
          zIndex: 20,
        }}
      >
        <button
          data-testid="create-habit-button"
          onClick={() => {
            setEditingHabit(null);
            setShowForm(true);
          }}
          aria-label="Create a new habit"
          style={{
            width: "100%",
            background: "rgba(140,185,100,0.07)",
            border: "0.5px solid rgba(140,185,100,0.2)",
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(140,185,100,0.12)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(140,185,100,0.07)")
          }
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "1px solid rgba(140,185,100,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "rgba(140,185,100,0.55)",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            +
          </span>
          <span
            className="font-serif"
            style={{
              fontSize: 15,
              fontStyle: "italic",
              color: "rgba(140,185,100,0.55)",
            }}
          >
            begin a new practice
          </span>
        </button>
      </div>

      {/* ── Habit form modal ── */}
      {showForm && (
        <HabitForm
          editingHabit={editingHabit}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

// ── Page export — wrapped in auth guard ───────────────────────────────────────
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}
