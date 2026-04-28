import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistrar from "@/app/components/shared/ServiceWorkerRegistrar";
import AmbientPlayer from "@/app/components/shared/AmbientPlayer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habit Tracker — Grow Daily",
  description:
    "A mindful habit tracker. Plant your practices, watch them grow.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Habit Tracker",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1409",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistrar />
        <div style={{ position: "fixed", bottom: 24, right: 20, zIndex: 9999 }}>
          <AmbientPlayer />
        </div>
        {children}
      </body>
    </html>
  );
}
