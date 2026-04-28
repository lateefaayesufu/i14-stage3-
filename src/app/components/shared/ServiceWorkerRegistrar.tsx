'use client'

// ─── ServiceWorkerRegistrar ───────────────────────────────────────────────────
// Registers the service worker once the app mounts (client-only).

import { useEffect } from 'react'

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[SW] Registered:', reg.scope))
        .catch((err) => console.warn('[SW] Registration failed:', err))
    }
  }, [])

  return null
}
