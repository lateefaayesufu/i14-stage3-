import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        garden: {
          bg: "#0a1409",
          surface: "#0f1e0d",
          card: "#121f10",
          border: "rgba(140,185,100,0.12)",
          green: "#8cb964",
          muted: "rgba(140,185,100,0.45)",
          dim: "rgba(140,185,100,0.2)",
          text: "#d6ecc8",
          faint: "rgba(214,236,200,0.5)",
          ghost: "rgba(255,255,255,0.04)",
          line: "rgba(255,255,255,0.06)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "spin-slow-reverse": "spin-slow 24s linear infinite reverse",
        breathe: "breathe 3s ease-in-out infinite",
        bloom: "bloom 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
        ripple: "ripple-ring 0.6s ease-out forwards",
        milestone: "milestone-pulse 2.5s ease-in-out infinite",
        "seed-float": "seed-float 4s ease-in-out infinite",
        "seed-float2": "seed-float 5.5s ease-in-out 0.8s infinite",
        "seed-float3": "seed-float 3.8s ease-in-out 1.6s infinite",
        "kanji-glow": "kanji-glow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.04)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        bloom: {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0px rgba(140,185,100,0)",
          },
          "30%": {
            transform: "scale(1.45)",
            boxShadow: "0 0 18px rgba(140,185,100,0.55)",
          },
          "60%": {
            transform: "scale(0.92)",
            boxShadow: "0 0 8px rgba(140,185,100,0.25)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 5px rgba(140,185,100,0.18)",
          },
        },
        "ripple-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "milestone-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(0.95)" },
        },
        "seed-float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.4",
          },
          "50%": { transform: "translateY(-8px) rotate(8deg)", opacity: "0.7" },
        },
        "kanji-glow": {
          "0%, 100%": {
            textShadow:
              "0 0 12px rgba(140,185,100,0.2), 0 0 30px rgba(140,185,100,0.05)",
          },
          "50%": {
            textShadow:
              "0 0 24px rgba(140,185,100,0.5), 0 0 60px rgba(140,185,100,0.15)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
