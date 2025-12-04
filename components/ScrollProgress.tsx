"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { shouldReduceMotion } from "../lib/animations";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

