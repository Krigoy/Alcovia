"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pref = useMotionPref();
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!sectionRef.current || !overlayRef.current) return;
    
    // Check if mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    
    // On mobile, ensure text is visible immediately
    if (isMobile) {
      const textElements = sectionRef.current.querySelectorAll(".manifesto-line");
      textElements.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "translateY(0)";
      });
    }

    if (pref === "reduce") {
      // Ensure text is visible even with reduced motion
      const textElements = sectionRef.current.querySelectorAll(".manifesto-line");
      textElements.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "translateY(0)";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial overlay visibility
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: isMobile ? 0.2 : 0.4 });
      }

      // Animate signature overlay reveal on scroll - more visible (skip on mobile)
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          end: "center center",
          scrub: 0.8,
          animation: gsap.to(overlayRef.current, {
            opacity: 0.8,
            scale: 1.1,
            rotation: 8,
            ease: "power2.out",
          }),
        });
      }

      // Stagger text reveal - automatically reversible with scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: isMobile ? 0.3 : 0.6, // Faster on mobile
        },
      });

      tl.fromTo(
        ".manifesto-line",
        { opacity: isMobile ? 0.5 : 0, y: isMobile ? 16 : 32 },
        { opacity: 1, y: 0, stagger: isMobile ? 0.05 : 0.08, duration: isMobile ? 0.5 : 0.7, ease: "power3.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [pref]);

  return (
    <section
      id="manifesto-section"
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-4 sm:gap-10 px-4 py-12 sm:py-24 sm:px-10 lg:px-16"
    >
      {/* Signature overlay with blend mode - more visible and prominent */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center mix-blend-overlay"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-accent-soft/70 w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[500px] sm:max-h-[500px] md:max-w-[600px] md:max-h-[600px] opacity-30 sm:opacity-100"
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
      </div>

      <motion.div
        initial={pref === "reduce" ? false : { opacity: 0, y: 24 }}
        animate={
          isInView && pref !== "reduce" ? { opacity: 1, y: 0 } : pref !== "reduce" ? { opacity: 0, y: 24 } : undefined
        }
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-5xl text-center px-3 sm:px-4"
        style={{ 
          // Ensure text is visible on mobile immediately
          opacity: typeof window !== "undefined" && window.innerWidth < 768 ? 1 : undefined 
        }}
      >
        <h2 className="manifesto-line font-display text-[clamp(2.75rem, 8vw, 4rem)] sm:text-[clamp(3.5rem, 8.5vw, 5rem)] md:text-[clamp(3.5rem, 7vw, 5rem)] lg:text-display-4 font-bold leading-[1.2] sm:leading-[1.05] md:leading-[0.95] tracking-[-0.005em] sm:tracking-[-0.01em] md:tracking-[-0.02em] text-white break-words overflow-wrap-anywhere">
          <span className="block mb-0.5 sm:mb-0">
            <span className="text-accent">UNPRECEDENTED</span>{" "}
            <span className="text-white">LEARNINGS,</span>
          </span>
          <span className="block mb-0.5 sm:mb-0">
            <span className="text-white">FAILING REGULARLY,</span>{" "}
            <span className="text-white">BUILDING WITH</span>{" "}
            <span className="text-accent">FRIENDS,</span>
          </span>
          <span className="block mb-0.5 sm:mb-0">
            <span className="text-white">WHILE BEING ON A JOURNEY OF</span>{" "}
            <span className="text-accent">SELF DISCOVERY.</span>
          </span>
          <span className="block mt-2 sm:mt-4 mb-0.5 sm:mb-0">
            <span className="text-white">GET ON A</span>{" "}
            <span className="text-accent">LEGACY BUILDING</span>{" "}
            <span className="text-white">JOURNEY TODAY,</span>
          </span>
          <span className="block">
            <span className="text-white">TO</span>{" "}
            <span className="text-accent">BUILD</span>{" "}
            <span className="text-white">THE</span>{" "}
            <span className="text-accent">FUTURE</span>{" "}
            <span className="text-white">OF TOMORROW.</span>
          </span>
        </h2>
      </motion.div>
    </section>
  );
}
