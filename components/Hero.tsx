"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const pref = useMotionPref();

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    // Check if mobile device
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    // Ensure image is visible
    if (bgRef.current) {
      bgRef.current.style.opacity = "1";
    }

    if (pref === "reduce") {
      if (bgRef.current) {
        gsap.set(bgRef.current, { opacity: 1, scale: 1 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial parallax state
      if (bgRef.current && !isMobile) {
        gsap.set(bgRef.current, { yPercent: 0, scale: 1 });
      }

      // Fade-in animation for image
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.4 },
      });

      tl.fromTo(
        bgRef.current,
        { opacity: 0.3, scale: 1.1 },
        { opacity: 1, scale: 1 }
      );

      tl.fromTo(
        ".hero-heading-line",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, stagger: 0.12 },
        "-=0.8"
      );

      tl.fromTo(
        ".hero-cta",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, stagger: 0.1 },
        "-=0.6"
      );

      // Reduced parallax on mobile for better performance
      // Parallax effect - automatically reversible with scrub
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2, // scrub makes it automatically reversible
          animation: gsap.fromTo(
            bgRef.current,
            { yPercent: 0, scale: 1 }, // Initial state
            { yPercent: 50, scale: 1.15, ease: "none" } // End state
          ),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [pref]);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10 px-4 text-center sm:gap-12"
    >
      {/* Background image with parallax effect - ONLY in hero section */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          willChange: pref === "reduce" ? "auto" : "transform",
          opacity: 1,
          backgroundImage: "url(/final2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/80" />
      </div>

      <motion.div
        initial={pref === "reduce" ? false : { opacity: 0, y: 40, scale: 0.98 }}
        animate={pref === "reduce" ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 px-4"
      >
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-display text-[clamp(2.5rem, 8vw, 4rem)] sm:text-display-4 tracking-[-0.01em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            <span className="hero-heading-line block text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.5)]">
              <span className="hero-word-flash">Dare</span> to{" "}
              <span className="hero-word-flash">become</span>
            </span>
            <span
              className="hero-heading-line block text-accent [text-shadow:0_2px_12px_rgba(255,75,92,0.6),0_0_30px_rgba(255,75,92,0.4)]"
              style={{ letterSpacing: "-0.005em" }}
            >
              <span className="hero-word-flash">everything</span> you were{" "}
              <span className="hero-word-flash">born</span> to be.
            </span>
          </h1>
        </div>

        <p className="hero-heading-line max-w-2xl text-sm text-white sm:text-base leading-relaxed mt-4 sm:mt-6 px-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.6)]">
          Alcovia is a premier community of passion-driven teenagers (11–16
          years) for whom we are providing the right exposure and exploration
          opportunities through professional mentorships, peer learning and
          hyper-personalised career guidance, empowering them to get ahead of
          the curve.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
          <motion.button
            whileHover={
              pref === "reduce"
                ? undefined
                : { y: -2, boxShadow: "0 0 40px rgba(255,75,92,0.55)" }
            }
            whileTap={pref === "reduce" ? undefined : { scale: 0.97, y: 0 }}
            className="hero-cta inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-background shadow-glow transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px]"
            aria-label="Contact Alcovia"
          >
            Contact Us
            <span
              aria-hidden="true"
              className="inline-block h-1 w-6 rounded-full bg-background"
            />
          </motion.button>

          <button
            className="hero-cta text-xs font-medium uppercase tracking-[0.25em] text-foreground/60 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px] px-2"
            aria-label="Learn more about Alcovia"
          >
            Learn more
          </button>
        </div>
      </motion.div>
    </section>
  );
}
