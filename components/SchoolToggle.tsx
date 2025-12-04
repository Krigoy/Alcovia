"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isTouchDevice } from "../lib/micro";
import { premiumToggle, premiumToggleMobile, scrollReveal3D, sectionTransition, wordReveal, getMotionVariants, shouldReduceMotion } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

type Mode = "school" | "outside";

export function SchoolToggle() {
  const [mode, setMode] = useState<Mode>("school");
  const [isMobile, setIsMobile] = useState(false);
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        typeof window !== "undefined" &&
          (window.innerWidth < 768 || isTouchDevice())
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Use mobile-specific variant on mobile (slower), regular variant on desktop
  // Only use reduced motion if user explicitly prefers it
  const toggleVariants = getMotionVariants(
    isMobile ? premiumToggleMobile : premiumToggle,
    reduceMotion
  );

  const handleChange = (next: Mode) => {
    setMode(next);
  };

  // Camera-tracked scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  // Optimized section-level parallax (reduced for performance)
  const sectionParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, -25]
  );
  
  // Disabled rotation for performance
  const sectionRotation = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 0] // Disabled for performance
  );
  
  // Use direct transform instead of spring for better performance
  const smoothSectionParallax = sectionParallax;

  useEffect(() => {
    if (!sectionRef.current || pref === "reduce" || isMobile) return;

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
  }, [pref, isMobile]);

  const headerVariants = getMotionVariants(sectionTransition, reduceMotion);
  const isHeaderInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={sectionRef}
      id="school-toggle-section"
      className="mx-auto flex max-w-4xl flex-col gap-rhythm-5 px-4 py-rhythm-6 sm:px-10 lg:px-16"
      style={{
        y: smoothSectionParallax,
        rotateZ: sectionRotation,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.header
        className="flex flex-col gap-rhythm-3 text-center mb-rhythm-5"
        variants={headerVariants}
        initial="hidden"
        animate={isHeaderInView ? "visible" : "hidden"}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.h2 
          className="font-display text-section-heading font-black tracking-[-0.015em]"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {["At", "School", "vs", "Outside", "of", "School"].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={getMotionVariants(wordReveal, reduceMotion)}
              custom={i}
            >
              {word}
              {i < 5 && "\u00A0"}
            </motion.span>
          ))}
        </motion.h2>
      </motion.header>

      <div className="mx-auto inline-flex items-center justify-center gap-1 rounded-full border border-white/20 bg-surface/90 p-1 sm:p-1.5 text-label font-sans font-medium uppercase tracking-[0.1em] shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-sm w-full max-w-sm sm:max-w-none">
        <button
          type="button"
          onClick={() => handleChange("school")}
          className="relative z-10 flex items-center justify-center rounded-full px-3 sm:px-6 py-2 sm:py-2.5 min-h-[44px] text-sm sm:text-base touch-manipulation transition-colors active:scale-95 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-pressed={mode === "school"}
          aria-label="At School"
        >
          {mode === "school" && (
            <motion.span
              layoutId="school-toggle-pill"
              className="absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_4px_20px_rgba(255,75,92,0.4)]"
              transition={{ 
                type: "spring",
                stiffness: isMobile ? 350 : 400,
                damping: isMobile ? 25 : 25,
                mass: isMobile ? 0.7 : 0.6
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
          className="relative z-10 flex items-center justify-center rounded-full px-3 sm:px-6 py-2 sm:py-2.5 min-h-[44px] text-sm sm:text-base touch-manipulation transition-colors active:scale-95 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-pressed={mode === "outside"}
          aria-label="Outside of School"
        >
          {mode === "outside" && (
            <motion.span
              layoutId="school-toggle-pill"
              className="absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_4px_20px_rgba(255,75,92,0.4)]"
              transition={{ 
                type: "spring",
                stiffness: isMobile ? 350 : 400,
                damping: isMobile ? 25 : 25,
                mass: isMobile ? 0.7 : 0.6
              }}
            />
          )}
          <span className={`relative z-10 flex items-center justify-center ${mode === "outside" ? "text-background font-semibold" : "text-foreground/70"}`}>
            Outside of School
          </span>
        </button>
      </div>

      <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-surface/70 pt-6 sm:pt-rhythm-5 px-4 sm:px-8 pb-6 sm:pb-8">
        <AnimatePresence mode="wait">
          {mode === "school" ? (
            <motion.div
              key="school"
              variants={toggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-rhythm-3"
            >
              <motion.h3 
                className="font-display text-xl font-bold tracking-[-0.01em] text-foreground"
                variants={toggleVariants}
              >
                How Alcovia helps students ace school.
              </motion.h3>
              <motion.p 
                className="text-body font-sans text-foreground/90" 
                style={{ lineHeight: "1.55" }}
                variants={toggleVariants}
              >
                Alcovia provides comprehensive academic support through
                personalized mentorship, strategic study plans, and regular
                assessments. Our approach combines proven learning methodologies
                with individualized attention to help students excel
                academically while building essential skills for long-term
                success.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="outside"
              variants={toggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-rhythm-3"
            >
              <motion.h3 
                className="font-display text-xl font-bold tracking-[-0.01em] text-foreground"
                variants={toggleVariants}
              >
                How Alcovia fulfills its mission of building differentiation
                for each Alcovian.
              </motion.h3>
              <motion.p 
                className="text-body font-sans text-foreground/90" 
                style={{ lineHeight: "1.55" }}
                variants={toggleVariants}
              >
                Beyond academics, Alcovia focuses on holistic development
                through real-world experiences, industry exposure, and leadership
                opportunities. We help each student discover their unique
                strengths, build resilience, and develop the confidence to stand
                out in an increasingly competitive world.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
