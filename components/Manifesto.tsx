"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { isTouchDevice } from "../lib/micro";
import { lineReveal, lineRevealMobile, wordReveal, sectionTransition, getMotionVariants } from "../lib/animations";

export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pref = useMotionPref();
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

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

  // Camera-tracked scroll animations with depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Overlay opacity with camera tracking
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" ? [0.5, 0.5] : [0.5, 0.85]
  );

  // Optimized camera-tracked parallax (reduced for performance)
  const textParallax = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" || isMobile ? [0, 0] : [0, -25]
  );
  
  // Overlay parallax (reduced movement)
  const overlayParallax = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" || isMobile ? [0, 0] : [0, 40]
  );
  
  // Simplified rotation (disabled for performance)
  const sectionRotation = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 0] // Disabled for performance
  );
  const overlayScale = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" ? [1, 1] : [1, 1.08]
  );
  const overlayRotation = useTransform(
    scrollYProgress,
    [0, 1],
    pref === "reduce" ? [0, 0] : [0, 5]
  );

  return (
    <section
      id="manifesto-section"
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-rhythm-4 sm:gap-rhythm-5 px-4 py-rhythm-6 sm:py-rhythm-7 sm:px-10 lg:px-16"
    >
      {/* Signature overlay with camera-tracked parallax */}
      <motion.div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center mix-blend-overlay"
        aria-hidden="true"
        style={{
          opacity: overlayOpacity,
          scale: overlayScale,
          rotate: overlayRotation,
          y: overlayParallax,
          transformStyle: "preserve-3d",
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
        className="relative z-20 w-full max-w-6xl px-4 sm:px-6 md:px-8 py-12 sm:py-16"
        variants={getMotionVariants(sectionTransition, pref === "reduce")}
        initial="hidden"
        animate={
          isInView && pref !== "reduce"
            ? "visible"
            : pref === "reduce"
            ? "visible"
            : "hidden"
        }
        style={{
          y: textParallax,
          rotateZ: sectionRotation,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.h2
          className="font-display font-black text-foreground max-w-5xl mx-auto"
          style={{
            fontSize: "clamp(2rem, 4vw + 1rem, 3.5rem)",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            fontWeight: 900,
            textAlign: "justify",
            textJustify: "inter-word",
          }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: isMobile ? 0.45 : 0.55, // Faster sequential reveal (0.5s desktop, 0.4s mobile + buffer)
                delayChildren: isMobile ? 0.1 : 0.15,
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
          {[
            "UNPRECEDENTED LEARNINGS,",
            "FAILING REGULARLY,",
            "BUILDING WITH FRIENDS,",
            "WHILE BEING ON A JOURNEY OF SELF DISCOVERY.",
            "GET ON A LEGACY BUILDING JOURNEY TODAY,",
            "TO BUILD THE FUTURE OF TOMORROW.",
          ].map((line, lineIndex) => {
            // Calculate timing for neon light tracing
            const textRevealDuration = isMobile ? 0.4 : 0.5;
            const staggerDelay = isMobile ? 0.45 : 0.55;
            const lineStartDelay = lineIndex * staggerDelay;
            const tracingDuration = textRevealDuration * 1.2; // Slightly longer than reveal
            
            return (
              <motion.div
                key={lineIndex}
                className="relative block mb-4 last:mb-0 overflow-visible manifesto-line-wrapper"
                style={{ 
                  clipPath: pref === "reduce" ? "inset(0 0% 0 0)" : undefined,
                  WebkitClipPath: pref === "reduce" ? "inset(0 0% 0 0)" : undefined,
                  textAlign: "justify",
                  textJustify: "inter-word",
                }}
                variants={getMotionVariants(
                  isMobile ? lineRevealMobile : lineReveal,
                  pref === "reduce"
                )}
                custom={lineIndex}
              >
                {/* Traveling neon light strip that traces the text */}
                <motion.div
                  className="absolute top-0 left-0 pointer-events-none neon-light-strip"
                  initial={{ 
                    x: "-100%",
                    opacity: 0,
                  }}
                  animate={
                    isInView && pref !== "reduce"
                      ? {
                          x: ["-100%", "100%"],
                          opacity: [0, 1, 1, 0],
                        }
                      : { 
                          x: "-100%",
                          opacity: 0,
                        }
                  }
                  transition={{
                    delay: lineStartDelay,
                    duration: tracingDuration,
                    ease: "linear",
                  }}
                  style={{
                    width: "4px",
                    height: "100%",
                    background: `linear-gradient(
                      to right,
                      transparent,
                      rgba(255, 75, 92, 0.8),
                      rgba(255, 75, 92, 1),
                      rgba(255, 75, 92, 0.8),
                      transparent
                    )`,
                    boxShadow: `
                      0 0 10px rgba(255, 75, 92, 1),
                      0 0 20px rgba(255, 75, 92, 0.8),
                      0 0 30px rgba(255, 75, 92, 0.6),
                      0 0 40px rgba(255, 75, 92, 0.4)
                    `,
                    filter: "blur(1px)",
                    zIndex: 5,
                  }}
                />
                
                {/* Glow trail that follows the light */}
                <motion.div
                  className="absolute top-0 left-0 pointer-events-none neon-glow-trail"
                  initial={{ 
                    x: "-100%",
                    opacity: 0,
                    width: "0%",
                  }}
                  animate={
                    isInView && pref !== "reduce"
                      ? {
                          x: ["-100%", "100%"],
                          width: ["0%", "100%", "100%"],
                          opacity: [0, 0.3, 0.2, 0],
                        }
                      : { 
                          x: "-100%",
                          width: "0%",
                          opacity: 0,
                        }
                  }
                  transition={{
                    delay: lineStartDelay,
                    duration: tracingDuration,
                    ease: "linear",
                  }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(
                      to right,
                      transparent,
                      rgba(255, 75, 92, 0.2),
                      transparent
                    )`,
                    filter: "blur(8px)",
                    zIndex: 4,
                  }}
                />
                
                <span className="relative z-10 block text-justify" style={{ textJustify: "inter-word", hyphens: "auto" }}>
                  {line.split(" ").map((word, wordIndex) => {
                            const isAccent = 
                              word.includes("LEARNINGS") ||
                              word.includes("FAILING") ||
                              word.includes("SELF") ||
                              word.includes("DISCOVERY") ||
                              word.includes("LEGACY") ||
                              word.includes("FUTURE") ||
                              word.includes("TOMORROW");
                    
                    return (
                      <span key={wordIndex} className="inline relative">
                        {/* Individual letter tracing effect */}
                        <motion.span
                          className="absolute inset-0 pointer-events-none neon-letter-trace"
                          initial={{ 
                            clipPath: "inset(0 100% 0 0)",
                            opacity: 0,
                          }}
                          animate={
                            isInView && pref !== "reduce"
                              ? {
                                  clipPath: "inset(0 0% 0 0)",
                                  opacity: [0, 0.6, 0.4, 0],
                                }
                              : { 
                                  clipPath: "inset(0 100% 0 0)",
                                  opacity: 0,
                                }
                          }
                          transition={{
                            delay: lineStartDelay + (wordIndex * 0.05),
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                          style={{
                            background: `linear-gradient(
                              to right,
                              transparent,
                              rgba(255, 75, 92, 0.4),
                              transparent
                            )`,
                            filter: "blur(2px)",
                            zIndex: 6,
                          }}
                        />
                        <span
                          className={
                            isAccent
                              ? "text-accent [text-shadow:0_2px_12px_rgba(255,75,92,0.5)] relative z-10"
                              : "text-foreground relative z-10"
                          }
                        >
                          {word}
                        </span>
                        {wordIndex < line.split(" ").length - 1 && " "}
                      </span>
                    );
                  })}
                </span>
              </motion.div>
            );
          })}
        </motion.h2>
      </motion.div>
    </section>
  );
}
