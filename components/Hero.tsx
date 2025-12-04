"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { isTouchDevice } from "../lib/micro";
import {
  heroEntrance,
  buttonHover,
  getMotionVariants,
  shouldReduceMotion,
} from "../lib/animations";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && (window.innerWidth < 768 || isTouchDevice()));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Transform-based parallax using Framer Motion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms - only transform and opacity, no layout properties
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, 60]
  );
  const parallaxScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [1, 1] : [1, 1.2]
  );
  const parallaxOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  // Smooth spring for parallax
  const smoothY = useSpring(parallaxY, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(parallaxScale, { stiffness: 100, damping: 30 });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContactUs = () => {
    scrollToSection("cta-section");
  };

  const handleLearnMore = () => {
    scrollToSection("offerings");
  };

  // Get motion-safe variants
  const heroVariants = getMotionVariants(heroEntrance, reduceMotion);
  const buttonVariants = getMotionVariants(buttonHover, reduceMotion);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10 px-4 text-center sm:gap-12 overflow-hidden"
    >
      {/* Parallax background layer - transform-based only */}
      <motion.div
        ref={parallaxRef}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          y: smoothY,
          scale: smoothScale,
          opacity: parallaxOpacity,
          willChange: reduceMotion ? "auto" : "transform",
        }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url(/final2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* Content layer with cinematic entrance */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 px-4"
      >
        <motion.div
          className="space-y-1 sm:space-y-2"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.3 },
            },
          }}
        >
          <motion.h1
            className="font-display tracking-[-0.01em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] sm:text-display-4"
            style={{
              fontSize: "clamp(4.5rem, 12vw, 5rem)",
              lineHeight: "1.1",
            }}
            variants={{
              hidden: { opacity: 0, y: 80, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <motion.span
              className="block text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.5)]"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              Dare to become
            </motion.span>
            <motion.span
              className="block text-accent [text-shadow:0_2px_12px_rgba(255,75,92,0.6),0_0_30px_rgba(255,75,92,0.4)]"
              style={{ letterSpacing: "-0.005em" }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              everything you were born to be.
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          className="max-w-2xl text-sm text-white sm:text-base leading-relaxed mt-4 sm:mt-6 px-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.6)]"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.9, delay: 0.4, ease: [0.4, 0, 0.2, 1] },
            },
          }}
        >
          Alcovia is a premier community of passion-driven teenagers (11–16
          years) for whom we are providing the right exposure and exploration
          opportunities through professional mentorships, peer learning and
          hyper-personalised career guidance, empowering them to get ahead of
          the curve.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.6 },
            },
          }}
        >
          <motion.button
            onClick={handleContactUs}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-background shadow-glow transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px]"
            aria-label="Contact Alcovia"
          >
            Contact Us
            <span
              aria-hidden="true"
              className="inline-block h-1 w-6 rounded-full bg-background"
            />
          </motion.button>

          <motion.button
            onClick={handleLearnMore}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="text-xs font-medium uppercase tracking-[0.25em] text-foreground/60 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px] px-2"
            aria-label="Learn more about Alcovia"
          >
            Learn more
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
