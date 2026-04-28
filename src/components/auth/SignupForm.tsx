"use client";

// ─── SignupForm ───────────────────────────────────────────────────────────────
// Upgraded: animated error, loading dots, password strength bar.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(pw: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
  color: string;
} {
  if (pw.length === 0) return { level: 0, label: "", color: "transparent" };
  if (pw.length < 6) return { level: 1, label: "weak", color: "#e8735a" };
  if (pw.length < 10) return { level: 2, label: "okay", color: "#e8c84a" };
  return { level: 3, label: "strong", color: "#8cb964" };
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { level, label, color } = getStrength(password);
  if (level === 0) return null;

  return (
    <div style={{ marginTop: 8 }}>
      {/* Bar segments */}
      <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
        {[1, 2, 3].map((seg) => (
          <div
            key={seg}
            style={{
              flex: 1,
              height: 2,
              borderRadius: 2,
              background: seg <= level ? color : "rgba(255,255,255,0.07)",
              boxShadow: seg <= level ? `0 0 4px ${color}66` : "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
          />
        ))}
      </div>
      {/* Label */}
      <p
        className="font-mono"
        style={{
          fontSize: 9,
          color,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          transition: "color 0.3s",
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ── Animated loading dots ──────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          className="animate-breathe"
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "var(--garden-green)",
            display: "inline-block",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </span>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = signUp(email, password);

    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-slide-up" style={{ opacity: 0 }}>
      {/* Heading */}
      <h1
        className="font-serif"
        style={{
          fontSize: 40,
          fontWeight: 300,
          fontStyle: "italic",
          color: "var(--garden-text)",
          lineHeight: 1.1,
          marginBottom: 6,
        }}
      >
        Begin your
        <br />
        practice.
      </h1>
      <p
        className="font-mono"
        style={{
          fontSize: 9,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "var(--garden-muted)",
          marginBottom: 32,
        }}
      >
        create an account
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="signup-email" className="garden-label">
            Email
          </label>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="you@example.com"
            className="garden-input"
            required
          />
        </div>

        {/* Password + strength bar */}
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="signup-password" className="garden-label">
            Password
          </label>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="choose a password"
            className="garden-input"
            required
          />
          <PasswordStrengthBar password={password} />
        </div>

        {/* Error message — animated */}
        {error && (
          <div
            role="alert"
            className="animate-slide-up"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              background: "rgba(232,115,90,0.06)",
              border: "0.5px solid rgba(232,115,90,0.25)",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 16,
              opacity: 0,
            }}
          >
            <span
              style={{
                color: "#e8735a",
                fontSize: 10,
                marginTop: 1,
                flexShrink: 0,
              }}
            >
              ✕
            </span>
            <p
              style={{
                fontSize: 11,
                color: "#e8735a",
                letterSpacing: "0.3px",
                lineHeight: 1.4,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          data-testid="auth-signup-submit"
          type="submit"
          disabled={loading}
          className="garden-btn-primary"
          style={{
            marginBottom: 20,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <LoadingDots />
              planting seeds
            </span>
          ) : (
            "plant your first seed →"
          )}
        </button>
      </form>

      {/* Divider */}
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          opacity: 0.25,
        }}
      >
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: 8,
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          or
        </span>
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>

      {/* Switch to login */}
      <p
        className="font-mono"
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        already growing?{" "}
        <Link
          href="/login"
          style={{ color: "var(--garden-muted)", textDecoration: "none" }}
        >
          sign in
        </Link>
      </p>
    </div>
  );
}
