"use client";

// ─── HabitList ───────────────────────────────────────────────────────────────
// Renders all habits for the current user, or an empty state.
// Upgraded: layered concentric rings, floating seeds, atmospheric empty state.

import type { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface Props {
  habits: Habit[];
  today: string;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitList({ habits, today, onUpdate, onEdit }: Props) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 56,
          paddingBottom: 64,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* ── Concentric rings ── */}
        <div
          style={{
            position: "relative",
            width: 120,
            height: 120,
            marginBottom: 28,
          }}
        >
          {/* Outermost ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "0.5px solid rgba(140,185,100,0.07)",
            }}
          />

          {/* Second ring — breathes */}
          <div
            className="animate-breathe"
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: "50%",
              border: "0.5px solid rgba(140,185,100,0.12)",
              animationDelay: "0.4s",
            }}
          />

          {/* Third ring */}
          <div
            className="animate-breathe"
            style={{
              position: "absolute",
              inset: 28,
              borderRadius: "50%",
              border: "0.5px solid rgba(140,185,100,0.18)",
              animationDelay: "0.8s",
            }}
          />

          {/* Inner filled circle */}
          <div
            style={{
              position: "absolute",
              inset: 42,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(140,185,100,0.07) 0%, transparent 100%)",
              border: "0.5px solid rgba(140,185,100,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 種 = seed */}
            <span
              className="font-serif animate-kanji-glow"
              style={{
                fontSize: 22,
                color: "rgba(140,185,100,0.45)",
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              種
            </span>
          </div>

          {/* Floating seed particles */}
          {[
            { top: "8%", left: "72%", delay: "animate-seed-float", size: 3 },
            { top: "65%", left: "88%", delay: "animate-seed-float2", size: 2 },
            { top: "75%", left: "10%", delay: "animate-seed-float3", size: 3 },
            { top: "15%", left: "18%", delay: "animate-seed-float2", size: 2 },
          ].map((seed, i) => (
            <span
              key={i}
              aria-hidden
              className={seed.delay}
              style={{
                position: "absolute",
                top: seed.top,
                left: seed.left,
                width: seed.size,
                height: seed.size,
                borderRadius: "50%",
                background: "rgba(140,185,100,0.4)",
                boxShadow: "0 0 4px rgba(140,185,100,0.3)",
              }}
            />
          ))}
        </div>

        {/* Copy */}
        <p
          className="font-serif"
          style={{
            fontSize: 24,
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--garden-faint)",
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          The garden is empty.
        </p>

        <p
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.15)",
            marginBottom: 24,
          }}
        >
          plant your first habit below
        </p>

        {/* Divider line with dots */}
        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.3,
          }}
        >
          <div
            style={{
              width: 24,
              height: "0.5px",
              background: "rgba(140,185,100,0.4)",
            }}
          />
          <span
            style={{
              fontSize: 7,
              color: "rgba(140,185,100,0.6)",
              letterSpacing: "4px",
            }}
          >
            · · ·
          </span>
          <div
            style={{
              width: 24,
              height: "0.5px",
              background: "rgba(140,185,100,0.4)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onUpdate={onUpdate}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
