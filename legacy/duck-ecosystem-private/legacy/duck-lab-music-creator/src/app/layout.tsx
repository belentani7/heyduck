import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🦆 DUCK LAB Music Creator - Professional Cyberpunk DAW Studio",
  description: "Professional Digital Audio Workstation for recording, mixing, mastering, and music production. Built for Beyoncé, Shakira & Anitta. Features Auto-Tune, Virtual Instruments, MIDI Support, and Professional Plugins.",
  keywords: ["DAW", "Music Production", "Recording Studio", "Audio Editor", "Mixing", "Mastering", "Auto-Tune", "Virtual Instruments", "MIDI", "DUCK LAB", "Cyberpunk", "Web Audio API"],
  authors: [{ name: "DUCK LAB Software" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "DUCK LAB Music Creator - Cyberpunk DAW Studio",
    description: "Professional-grade browser-based music production studio with neon cyberpunk aesthetics",
    siteName: "DUCK LAB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DUCK LAB Music Creator",
    description: "Professional DAW Studio - Record, Mix, Master Your Hits",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
