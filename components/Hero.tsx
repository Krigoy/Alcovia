"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { isTouchDevice } from "../lib/micro";
import {
  heroEntrance,
  buttonHover,
  wordReveal,
  sectionTransition,
  getMotionVariants,
  shouldReduceMotion,
} from "../lib/animations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMagnetic } from "../hooks/useMagnetic";
import { ArrowRight, Mail } from "lucide-react";

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
      setIsMobile(
        typeof window !== "undefined" &&
          (window.innerWidth < 768 || isTouchDevice())
      );
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

  // Optimized camera-tracked scroll animations with enhanced parallax
  // Background layer - slowest movement (furthest from camera)
  const backgroundParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, 80]
  );
  const backgroundRotation = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, 2]
  );
  
  // Midground layer - medium movement
  const midgroundParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, 150]
  );
  const midgroundRotation = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, -1.5]
  );
  
  // Foreground layer - fastest movement
  const foregroundParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, 200]
  );
  
  // Camera zoom for depth effect
  const parallaxScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [1, 1] : [1, 1.15]
  );
  const parallaxOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  
  // Text content parallax - moves opposite direction for depth
  const textParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, -50]
  );
  const textScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1] // Disabled for performance
  );

  // Optimized spring physics for better performance
  const smoothBackground = useSpring(backgroundParallax, { stiffness: 150, damping: 50, mass: 0.5 });
  const smoothMidground = useSpring(midgroundParallax, { stiffness: 150, damping: 50, mass: 0.5 });
  const smoothForeground = useSpring(foregroundParallax, { stiffness: 150, damping: 50, mass: 0.5 });
  const smoothScale = useSpring(parallaxScale, { stiffness: 150, damping: 50, mass: 0.5 });
  const smoothTextParallax = textParallax;
  const smoothTextScale = textScale;
  const smoothBgRotation = backgroundRotation;
  const smoothMidRotation = midgroundRotation;

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
  
  // Magnetic effects for buttons
  const contactButtonRef = useMagnetic<HTMLDivElement>({ strength: 0.2, disabled: reduceMotion || isMobile });
  const learnMoreButtonRef = useMagnetic<HTMLDivElement>({ strength: 0.15, disabled: reduceMotion || isMobile });

  return (
    <section
      data-hero-section
      id="hero-section"
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10 px-4 text-center sm:gap-12 overflow-hidden"
    >
      {/* Camera-tracked multi-layer parallax background */}
      {/* Background layer - slowest parallax (furthest from camera) */}
      <motion.div
        ref={parallaxRef}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          y: smoothBackground,
          scale: smoothScale,
          rotateZ: smoothBgRotation,
          opacity: parallaxOpacity,
          transformStyle: "preserve-3d",
          willChange: reduceMotion ? "auto" : "transform",
        }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url(/masti.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.85) contrast(1.1)",
          }}
        />
      </motion.div>
      
      {/* Sophisticated gradient overlay layer - animated fade in */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Dark gradient from top to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background/85" />
        {/* Radial gradient from center for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/40 to-background/90" />
        {/* Subtle accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
      </motion.div>
      
      {/* Midground layer - medium parallax with rotation */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-8 overflow-hidden"
        style={{
          y: smoothMidground,
          rotateZ: smoothMidRotation,
          opacity: parallaxOpacity,
          transformStyle: "preserve-3d",
          willChange: reduceMotion ? "auto" : "transform",
        }}
      >
        {/* Additional subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/40" />
      </motion.div>
      
      {/* Foreground layer - fastest parallax (subtle overlay effects) */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-7 overflow-hidden"
        style={{
          y: smoothForeground,
          opacity: parallaxOpacity,
          willChange: reduceMotion ? "auto" : "transform",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-accent-soft/3" />
      </motion.div>

      {/* Content layer with camera-tracked parallax and frosted glass effect */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-rhythm-3 sm:gap-rhythm-4 md:gap-rhythm-5 px-4 w-full max-w-6xl"
        style={{
          y: smoothTextParallax,
          scale: smoothTextScale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Headline container - subtle backdrop for readability */}
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Very subtle backdrop - almost invisible */}
          <div className="absolute inset-0 -mx-8 -my-4 bg-background/5 backdrop-blur-[8px] sm:backdrop-blur-[10px]" />
          <div className="relative px-8 py-4 sm:px-12 sm:py-6">
            <motion.h1
              className="font-display text-white"
              style={{
                fontSize: "clamp(2.75rem, 7.5vw + 1rem, 6rem)",
                lineHeight: "1.12",
                letterSpacing: "-0.04em",
                fontWeight: 800,
                fontFeatureSettings: '"kern" 1, "liga" 1',
                textRendering: "optimizeLegibility",
              }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.4 },
                },
              }}
            >
              {/* First line: "Dare to become" - impactful */}
              <motion.div
                className="mb-3 sm:mb-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {["Dare", "to", "become"].map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block text-white"
                    style={{
                      textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      fontFeatureSettings: '"kern" 1, "liga" 1',
                    }}
                    variants={getMotionVariants(wordReveal, reduceMotion)}
                    custom={i}
                  >
                    {word}
                    {i < 2 && "\u00A0"}
                  </motion.span>
                ))}
              </motion.div>
              
              {/* Second line: "everything you were born to be." - accent color */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {["everything", "you", "were", "born", "to", "be."].map((word, i) => (
                  <motion.span
                    key={`line2-${i}`}
                    className="inline-block text-accent"
                    style={{
                      letterSpacing: "-0.03em",
                      fontWeight: 800,
                      textShadow: "0 2px 6px rgba(255,75,92,0.4)",
                      fontFeatureSettings: '"kern" 1, "liga" 1',
                    }}
                    variants={getMotionVariants(wordReveal, reduceMotion)}
                    custom={i + 3}
                  >
                    {word}
                    {i < 5 && "\u00A0"}
                  </motion.span>
                ))}
              </motion.div>
            </motion.h1>
          </div>
        </motion.div>

        {/* Description text with enhanced styling */}
        <motion.p
          className="max-w-2xl font-sans text-white/90 mt-8 sm:mt-10 px-4 sm:px-6 relative z-10"
          style={{
            fontSize: "clamp(1.0625rem, 1.25vw + 0.5rem, 1.1875rem)",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
            fontWeight: 400,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ 
            duration: 1.1, 
            delay: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          Alcovia is a premier community for ambitious teenagers (ages 11–16) 
          seeking extraordinary growth. We provide world-class mentorship, 
          cutting-edge workshops, and personalized career guidance that 
          empowers young minds to excel beyond traditional boundaries.
        </motion.p>

        {/* CTA Buttons with enhanced styling */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-rhythm-3 sm:gap-rhythm-4 mt-rhythm-6 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1, 
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.1,
          }}
        >
          <motion.div
            ref={contactButtonRef}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleContactUs}
              className={cn(
                "rounded-full bg-accent px-6 py-3.5 text-label font-sans font-semibold uppercase tracking-[0.1em] text-background shadow-[0_8px_32px_rgba(255,75,92,0.5),0_4px_16px_rgba(255,75,92,0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_12px_40px_rgba(255,75,92,0.6),0_6px_20px_rgba(255,75,92,0.4)] focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px]",
                "h-auto backdrop-blur-sm"
              )}
            aria-label="Contact Alcovia"
          >
            Contact Us
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            ref={learnMoreButtonRef}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleLearnMore}
              variant="ghost"
              className={cn(
                "text-label font-sans font-medium uppercase tracking-[0.1em] text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px] px-4 py-3.5",
                "h-auto hover:bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 rounded-full"
              )}
              style={{
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            aria-label="Learn more about Alcovia"
          >
            Learn more
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
