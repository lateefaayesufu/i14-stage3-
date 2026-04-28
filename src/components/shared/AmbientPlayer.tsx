"use client";

import { useEffect, useRef, useState } from "react";

export default function AmbientPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/moonlight.mp3");
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    // Start playing on first user interaction anywhere on the page
    function startOnFirstInteraction() {
      if (!audioRef.current) return;
      audioRef.current.play().catch(() => {});
      setStarted(true);
      document.removeEventListener("click", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
      document.removeEventListener("touchstart", startOnFirstInteraction);
    }

    document.addEventListener("click", startOnFirstInteraction);
    document.addEventListener("keydown", startOnFirstInteraction);
    document.addEventListener("touchstart", startOnFirstInteraction);

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
      document.removeEventListener("touchstart", startOnFirstInteraction);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  }

  return (
    <button
      onClick={toggle}
      title={muted ? "Play ambient music" : "Mute music"}
      aria-label={muted ? "Play ambient music" : "Mute music"}
      style={{
        background: "transparent",
        border: `0.5px solid ${muted ? "rgba(140,185,100,0.15)" : "rgba(140,185,100,0.4)"}`,
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 15,
        color: muted ? "rgba(140,185,100,0.25)" : "var(--garden-green)",
        transition: "all 0.3s",
        backdropFilter: "blur(4px)",
        flexShrink: 0,
      }}
    >
      {muted ? "♪" : "♬"}
    </button>
  );
}
