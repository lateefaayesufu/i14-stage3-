"use client";

// ─── ProtectedRoute ──────────────────────────────────────────────────────────
// Wraps dashboard content. Redirects to /login if no valid session exists.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import SplashScreen from "./SplashScreen";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return <SplashScreen />;
  return <>{children}</>;
}
