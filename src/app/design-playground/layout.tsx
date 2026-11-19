import type { Metadata } from "next";
import "@/components/design-playground/tokens.css";

export const metadata: Metadata = {
  title: "Kosera Design Playground — Warm Tactile Tech",
  description:
    "Interactive design system and component exploration sandbox for Kosera Warm Tactile Tech visual identity.",
};

export default function DesignPlaygroundLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="playground-theme min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--ink-primary)] selection:bg-[var(--accent-tint)] selection:text-[var(--accent-primary)]">
      {children}
    </div>
  );
}
