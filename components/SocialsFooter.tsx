"use client";

import { motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";

export function SocialsFooter() {
  const pref = useMotionPref();

  return (
    <footer className="border-t border-surface-subtle/70 bg-background/80 px-4 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-display-2 sm:text-display-1 font-bold tracking-tight text-foreground">
            What's Up on Socials
          </h2>
        </div>

        {/* Overlapping fanned cards layout - Lando Norris style */}
        <nav
          className="flex items-center justify-center -space-x-8 sm:-space-x-12 md:-space-x-16"
          aria-label="Alcovia social links"
        >
          <motion.a
            href="https://www.linkedin.com/company/alcovia-life/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-48 w-36 sm:h-64 sm:w-48 md:h-80 md:w-60 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation overflow-hidden"
            initial={{ rotate: -8, y: 0 }}
            whileHover={
              pref === "reduce"
                ? undefined
                : {
                    scale: 1.1,
                    y: -12,
                    zIndex: 30,
                    rotate: -4,
                    boxShadow: "0 30px 100px rgba(0,0,0,0.95)"
                  }
            }
            whileTap={pref === "reduce" ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Visit Alcovia on LinkedIn"
            tabIndex={0}
          >
            <div className="flex flex-col items-center justify-center gap-3 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/90"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">LinkedIn</span>
            </div>
          </motion.a>

          <motion.a
            href="https://www.instagram.com/alcovia.life/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-48 w-36 sm:h-64 sm:w-48 md:h-80 md:w-60 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation overflow-hidden"
            initial={{ rotate: 8, y: 0 }}
            whileHover={
              pref === "reduce"
                ? undefined
                : {
                    scale: 1.1,
                    y: -12,
                    zIndex: 30,
                    rotate: 4,
                    boxShadow: "0 30px 100px rgba(0,0,0,0.95)"
                  }
            }
            whileTap={pref === "reduce" ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Visit Alcovia on Instagram"
            tabIndex={0}
          >
            <div className="flex flex-col items-center justify-center gap-3 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/90"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Instagram</span>
            </div>
          </motion.a>
        </nav>

        {/* Footer text */}
        <div className="mx-auto mt-16 flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground/40 px-4">
          <span>&copy; {new Date().getFullYear()} Alcovia. All rights reserved.</span>
          <span>Made for builders.</span>
        </div>
      </div>
    </footer>
  );
}
