"use client";

// ─── /login ──────────────────────────────────────────────────────────────────
// Upgraded: atmospheric concentric rings orb in background.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getSession } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--garden-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Atmospheric orb — top right ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 280,
          height: 280,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(140,185,100,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Rings */}
        {[0, 24, 48, 72].map((inset, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? "animate-breathe" : ""}
            style={{
              position: "absolute",
              inset,
              borderRadius: "50%",
              border: `0.5px solid rgba(140,185,100,${0.04 + i * 0.03})`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Background kanji: 入 = "enter" ── */}
      <span
        aria-hidden
        className="font-serif"
        style={{
          position: "absolute",
          bottom: -20,
          right: -10,
          fontSize: 200,
          color: "rgba(255,255,255,0.012)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        入
      </span>

      {/* ── Bottom-left seed dots ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 40,
          left: 32,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {[
          { size: 3, x: 0, y: 0, delay: "animate-seed-float" },
          { size: 2, x: 16, y: -8, delay: "animate-seed-float2" },
          { size: 2, x: 8, y: 10, delay: "animate-seed-float3" },
        ].map((dot, i) => (
          <span
            key={i}
            className={dot.delay}
            style={{
              position: "absolute",
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: "rgba(140,185,100,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── Form content ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: 8,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "rgba(140,185,100,0.35)",
            marginBottom: 28,
          }}
        >
          Habit Tracker
        </p>

        <LoginForm />
      </div>
      {/* ── Footer ── */}
      <p
        className="font-mono"
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 8,
          letterSpacing: "2px",
          color: "rgba(140,185,100,0.2)",
          whiteSpace: "nowrap",
          zIndex: 1,
        }}
      >
        習 · grow daily
      </p>
    </main>
  );
}
