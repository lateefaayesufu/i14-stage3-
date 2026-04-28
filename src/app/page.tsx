"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import SplashScreen from "@/components/shared/SplashScreen";
import { SPLASH_DURATION_MS } from "@/lib/constants";

type Stage = "enter" | "splash" | "done";

export default function HomePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("enter");

  function handleEnter() {
    setStage("splash");
    setTimeout(() => {
      setStage("done");
      const session = getSession();
      router.replace(session ? "/dashboard" : "/login");
    }, SPLASH_DURATION_MS);
  }

  if (stage === "splash" || stage === "done") {
    return <SplashScreen />;
  }

  return (
    <div
      onClick={handleEnter}
      style={{
        minHeight: "100dvh",
        background: "var(--garden-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background kanji watermark */}
      <span
        aria-hidden
        className="font-serif"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          fontSize: 200,
          color: "rgba(255,255,255,0.015)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        習
      </span>

      {/* Breathing ring */}
      <div
        className="animate-breathe"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "0.5px solid rgba(140,185,100,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "0.5px solid rgba(140,185,100,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: 36,
              color: "rgba(140,185,100,0.4)",
              fontStyle: "italic",
            }}
          >
            習
          </span>
        </div>
      </div>

      {/* App name */}
      <h1
        className="font-serif animate-fade-in"
        style={{
          fontSize: 36,
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(214,236,200,0.7)",
          letterSpacing: "0.04em",
          marginBottom: 12,
          opacity: 0,
          animationDelay: "0.2s",
        }}
      >
        Habit Tracker
      </h1>

      {/* Tap prompt */}
      <p
        className="font-mono animate-fade-in animate-breathe"
        style={{
          fontSize: 9,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(140,185,100,0.35)",
          opacity: 0,
          animationDelay: "0.6s",
        }}
      >
        tap to enter the garden
      </p>
    </div>
  );
}
