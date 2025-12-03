"use client";

import { MotionConfig } from "framer-motion";
import { ScrollProvider } from "../lib/ScrollProvider";
import { AlcovianCursor } from "./AlcovianCursor";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      reducedMotion="user"
    >
      <ScrollProvider>
        <AlcovianCursor />
        {children}
        <div className="noise-overlay" aria-hidden="true" />
      </ScrollProvider>
    </MotionConfig>
  );
}
