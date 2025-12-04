"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { maskedSlide, getMotionVariants, shouldReduceMotion } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

type Mode = "school" | "outside";

export function SchoolToggle() {
  const [mode, setMode] = useState<Mode>("school");
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  
  const maskedSlideVariants = getMotionVariants(maskedSlide, reduceMotion);

  const handleChange = (next: Mode) => {
    setMode(next);
  };

  useEffect(() => {
    if (!sectionRef.current || pref === "reduce") return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector("header");
      const toggle = sectionRef.current?.querySelector("div > div");
      const content = sectionRef.current?.querySelector("div > div:last-child");

      if (header) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 60%",
          scrub: 0.8,
          animation: gsap.fromTo(
            header,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: "power3.out" }
          ),
        });
      }

      if (toggle) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 55%",
          scrub: 0.8,
          animation: gsap.fromTo(
            toggle,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, ease: "power3.out" }
          ),
        });
      }

      if (content) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 50%",
          scrub: 0.8,
          animation: gsap.fromTo(
            content,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, ease: "power3.out" }
          ),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [pref]);

  return (
    <section ref={sectionRef} className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-20 sm:px-10 lg:px-16">
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
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5
              }}
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
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5
              }}
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
              variants={maskedSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
              variants={maskedSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
