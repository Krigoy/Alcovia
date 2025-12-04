"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { lineReveal, getMotionVariants } from "../lib/animations";

export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pref = useMotionPref();
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  // Transform-based overlay animation using Framer Motion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" ? [0.5, 0.5] : [0.5, 0.85]
  );
  const overlayScale = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" ? [1, 1] : [1, 1.15]
  );
  const overlayRotation = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" ? [0, 0] : [0, 10]
  );

  return (
    <section
      id="manifesto-section"
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-4 sm:gap-10 px-4 py-12 sm:py-24 sm:px-10 lg:px-16"
    >
      {/* Signature overlay with blend mode - prominent brand element */}
      <motion.div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center mix-blend-overlay"
        aria-hidden="true"
        style={{
          opacity: overlayOpacity,
          scale: overlayScale,
          rotate: overlayRotation,
        }}
      >
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-accent-soft/70 w-full h-full max-w-[350px] max-h-[350px] sm:max-w-[500px] sm:max-h-[500px] md:max-w-[650px] md:max-h-[650px] opacity-50 sm:opacity-80"
        >
          {/* More prominent signature pattern */}
          <path
            d="M300 60 Q420 180 540 300 Q420 420 300 540 Q180 420 60 300 Q180 180 300 60 Z"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M300 120 Q360 180 420 300 Q360 420 300 480 Q240 420 180 300 Q240 180 300 120 Z"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.7"
          />
          <circle
            cx="300"
            cy="300"
            r="90"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            opacity="0.5"
          />
          {/* Additional decorative elements */}
          <path
            d="M150 200 Q200 250 250 300 Q200 350 150 400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M450 200 Q400 250 350 300 Q400 350 450 400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      <motion.div
        className="relative z-20 w-full max-w-6xl px-3 sm:px-4"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate={
          isInView && pref !== "reduce"
            ? "visible"
            : pref === "reduce"
            ? "visible"
            : "hidden"
        }
      >
        <h2
          className="font-display font-black text-foreground break-words overflow-wrap-anywhere [text-shadow:0_2px_8px_rgba(0,0,0,0.3)]"
          style={{
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            lineHeight: "1.05",
            letterSpacing: "-0.05em",
            textAlign: "justify",
            textJustify: "inter-word",
            hyphens: "auto",
          }}
        >
          {[
            { text: "UNPRECEDENTED", accent: true },
            { text: " LEARNINGS,", accent: false },
            { text: " FAILING REGULARLY,", accent: false },
            { text: " BUILDING WITH", accent: false },
            { text: " FRIENDS,", accent: true },
            { text: " WHILE BEING ON A JOURNEY OF", accent: false },
            { text: " SELF DISCOVERY.", accent: true },
            { text: " GET ON A", accent: false },
            { text: " LEGACY BUILDING", accent: true },
            { text: " JOURNEY TODAY,", accent: false },
            { text: " TO", accent: false },
            { text: " BUILD", accent: true },
            { text: " THE", accent: false },
            { text: " FUTURE", accent: true },
            { text: " OF TOMORROW.", accent: false },
          ].map((line, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={getMotionVariants(lineReveal, pref === "reduce")}
            >
              <span className={line.accent ? "text-accent" : "text-foreground"}>
                {line.text}
              </span>
            </motion.span>
          ))}
        </h2>
      </motion.div>
    </section>
  );
}
