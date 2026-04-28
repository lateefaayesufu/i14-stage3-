"use client";

// ─── SplashScreen ────────────────────────────────────────────────────────────
// The garden awakens. Shown on / while session is being checked.

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "var(--garden-bg)", overflow: "hidden" }}
    >
      {/* ── Atmospheric radial glow behind everything ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(140,185,100,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Rings + Kanji ── */}
      <div
        className="relative flex items-center justify-center mb-8"
        style={{ width: 160, height: 160 }}
      >
        {/* Outermost ring — slow clockwise spin */}
        <div
          className="animate-spin-slow"
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "0.5px solid rgba(140,185,100,0.15)",
            // dashed effect via SVG-like dash pattern via background
          }}
        >
          {/* 4 tick marks on the ring */}
          {[0, 90, 180, 270].map((deg) => (
            <span
              key={deg}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 4,
                height: 1,
                background: "rgba(140,185,100,0.4)",
                transformOrigin: "-76px 0",
                transform: `rotate(${deg}deg) translateY(-50%)`,
              }}
            />
          ))}
        </div>

        {/* Middle ring — slow counter-clockwise spin */}
        <div
          className="animate-spin-slow-reverse"
          aria-hidden
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border: "0.5px dashed rgba(140,185,100,0.1)",
          }}
        />

        {/* Inner static ring */}
        <div
          className="animate-breathe"
          style={{
            position: "absolute",
            inset: 42,
            borderRadius: "50%",
            border: "0.5px solid rgba(140,185,100,0.2)",
            background: "rgba(140,185,100,0.02)",
          }}
        />

        {/* Kanji — centred, glowing */}
        <span
          className="font-serif animate-kanji-glow"
          style={{
            position: "relative",
            fontSize: 38,
            color: "var(--garden-green)",
            fontStyle: "italic",
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          習
        </span>
      </div>

      {/* App name */}
      <h1
        className="font-serif animate-fade-in"
        style={{
          fontSize: 32,
          fontWeight: 300,
          fontStyle: "italic",
          color: "var(--garden-text)",
          letterSpacing: "0.04em",
          marginBottom: 10,
          animationDelay: "0.3s",
          opacity: 0,
        }}
      >
        Habit Tracker
      </h1>

      {/* Tagline */}
      <p
        className="font-mono animate-fade-in"
        style={{
          fontSize: 9,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--garden-muted)",
          animationDelay: "0.55s",
          opacity: 0,
        }}
      >
        grow daily
      </p>

      {/* Background kanji watermark — large, faint */}
      <span
        aria-hidden
        className="font-serif"
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          fontSize: 180,
          color: "rgba(255,255,255,0.012)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        習
      </span>
    </div>
  );
}
