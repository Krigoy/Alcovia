"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";

type Mode = "school" | "outside";

export function SchoolToggle() {
  const [mode, setMode] = useState<Mode>("school");
  const pref = useMotionPref();

  const handleChange = (next: Mode) => {
    setMode(next);
  };

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-20 sm:px-10 lg:px-16">
      <header className="flex flex-col gap-4 text-center">
        <h2 className="font-display text-display-2 tracking-tight font-bold">
          At School vs Outside of School
        </h2>
      </header>

      <div className="mx-auto inline-flex items-center justify-center gap-1 rounded-full border border-white/20 bg-surface/90 p-1.5 text-xs font-medium uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-sm">
        <button
          type="button"
          onClick={() => handleChange("school")}
          className="relative z-10 flex items-center justify-center rounded-full px-4 sm:px-6 py-2.5 sm:py-2.5 min-h-[44px] touch-manipulation transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-pressed={mode === "school"}
          aria-label="At School"
        >
          {mode === "school" && (
            <motion.span
              layoutId="school-toggle-pill"
              className="absolute inset-0 -z-10 rounded-full bg-accent"
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            />
          )}
          <span className={`relative z-10 flex items-center justify-center ${mode === "school" ? "text-background font-semibold" : "text-foreground/70"}`}>
            At School
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleChange("outside")}
          className="relative z-10 flex items-center justify-center rounded-full px-4 sm:px-6 py-2.5 sm:py-2.5 min-h-[44px] touch-manipulation transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-pressed={mode === "outside"}
          aria-label="Outside of School"
        >
          {mode === "outside" && (
            <motion.span
              layoutId="school-toggle-pill"
              className="absolute inset-0 -z-10 rounded-full bg-accent"
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            />
          )}
          <span className={`relative z-10 flex items-center justify-center ${mode === "outside" ? "text-background font-semibold" : "text-foreground/70"}`}>
            Outside of School
          </span>
        </button>
      </div>

      <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-surface/70 pt-10 px-8 pb-8 text-sm text-foreground/85">
        <AnimatePresence mode="wait">
          {mode === "school" ? (
            <motion.div
              key="school"
              initial={
                pref === "reduce"
                  ? false
                  : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
              }
              animate={
                pref === "reduce"
                  ? undefined
                  : { opacity: 1, clipPath: "inset(0 0% 0 0)" }
              }
              exit={
                pref === "reduce"
                  ? undefined
                  : { opacity: 0, clipPath: "inset(0 0% 0 100%)" }
              }
              transition={{
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1]
              }}
              className="space-y-4"
            >
              <h3 className="font-display text-lg tracking-[0.08em] text-foreground">
                How Alcovia helps students ace school.
              </h3>
              <p className="leading-relaxed">
                Alcovia provides comprehensive academic support through
                personalized mentorship, strategic study plans, and regular
                assessments. Our approach combines proven learning methodologies
                with individualized attention to help students excel
                academically while building essential skills for long-term
                success.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="outside"
              initial={
                pref === "reduce"
                  ? false
                  : { opacity: 0, clipPath: "inset(0 0% 0 100%)" }
              }
              animate={
                pref === "reduce"
                  ? undefined
                  : { opacity: 1, clipPath: "inset(0 0% 0 0)" }
              }
              exit={
                pref === "reduce"
                  ? undefined
                  : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
              }
              transition={{
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1]
              }}
              className="space-y-4"
            >
              <h3 className="font-display text-lg tracking-[0.08em] text-foreground">
                How Alcovia fulfills its mission of building differentiation
                for each Alcovian.
              </h3>
              <p className="leading-relaxed">
                Beyond academics, Alcovia focuses on holistic development
                through real-world experiences, industry exposure, and leadership
                opportunities. We help each student discover their unique
                strengths, build resilience, and develop the confidence to stand
                out in an increasingly competitive world.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
