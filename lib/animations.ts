/**
 * Animation System - Motion Variants and Easing Presets
 * 
 * Provides reusable animation variants for consistent motion hierarchy:
 * - Primary: Hero entrance and major section scene changes
 * - Secondary: Staggered section/content reveals
 * - Tertiary: Micro-interactions for buttons/cards/cursor
 */

import { Variants } from "framer-motion";

// Easing Presets
export const easings = {
  cinematic: [0.16, 1, 0.3, 1], // Smooth, premium feel
  smooth: [0.4, 0, 0.2, 1], // Material Design inspired
  snap: [0.7, 0, 0.3, 1], // Quick snap
  premium: [0.25, 0.46, 0.45, 0.94], // Ultra-smooth premium
  elastic: [0.68, -0.55, 0.265, 1.55], // Elastic bounce
  dramatic: [0.77, 0, 0.175, 1], // Dramatic entrance
} as const;

export const heroEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.4,
      ease: easings.cinematic,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: easings.smooth,
    },
  },
};

// Enhanced scroll reveals with 3D transforms
export const scrollReveal3D: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: -15,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: easings.cinematic,
    },
  },
};

// Enhanced card hover with 3D perspective
export const card3D: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    y: 0,
  },
  hover: {
    rotateX: -5,
    rotateY: 5,
    scale: 1.05,
    y: -12,
    transition: {
      duration: 0.4,
      ease: easings.cinematic,
    },
  },
};

// Mobile-friendly card hover with minimal tilt
export const card3DMobile: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    y: 0,
  },
  hover: {
    rotateX: -1,
    rotateY: 1,
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Tertiary Motion Variants - Micro-interactions
export const buttonHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: easings.snap,
    },
  },
};

export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    rotateY: 0,
  },
  hover: {
    scale: 1.03,
    y: -8,
    rotateY: 2,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

// Premium line-by-line reveal for manifesto - horizontal clipPath reveal (left to right)
// Faster but smooth animation
export const lineReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -15,
    clipPath: "inset(0 100% 0 0)", // Hidden from left, reveal from left to right
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    x: 0,
    clipPath: "inset(0 0% 0 0)", // Fully revealed
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.cinematic,
    },
  },
};

// Mobile-optimized line reveal - faster and simpler for better performance
export const lineRevealMobile: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
    clipPath: "inset(0 100% 0 0)",
  },
  visible: {
    opacity: 1,
    x: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

// Masked slide transition
export const maskedSlide: Variants = {
  initial: {
    opacity: 0,
    clipPath: "inset(0 100% 0 0)",
    x: 20,
  },
  animate: {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    clipPath: "inset(0 0% 0 100%)",
    x: -20,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
};

// Premium toggle animation with smooth fade, scale, and directional slide
export const premiumToggle: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.96,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
};

// Mobile-specific toggle animation - slower and smoother for better UX
export const premiumToggleMobile: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7, // Slower for mobile - more visible and smooth
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08, // Slower stagger for mobile
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.96,
    transition: {
      duration: 0.6, // Slower exit for mobile
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
};

// Premium manifesto animation - cinematic line-by-line reveal with scale and fade
export const premiumManifesto: Variants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.92,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// Fanned card variants - stacked cards that spread on hover
export const fannedCard: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.15,
    y: -16,
    zIndex: 50, // Use zIndex instead of z for proper stacking
    boxShadow: "0 30px 100px rgba(0,0,0,0.95)",
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

// Utility function to check for reduced motion preference
export const shouldReduceMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Utility to get motion-safe variants
export const getMotionVariants = <T extends Variants>(
  variants: T,
  reduceMotion: boolean
): T => {
  if (reduceMotion) {
    // Return variants with minimal motion - override transitions only
    return {
      ...variants,
      hidden: variants.hidden ? { ...variants.hidden, transition: { duration: 0.01 } } : variants.hidden,
      visible: variants.visible ? { ...variants.visible, transition: { duration: 0.01 } } : variants.visible,
      rest: variants.rest ? { ...variants.rest, transition: { duration: 0.01 } } : variants.rest,
      hover: variants.hover ? { ...variants.hover, transition: { duration: 0.01 } } : variants.hover,
      tap: variants.tap ? { ...variants.tap, transition: { duration: 0.01 } } : variants.tap,
      initial: variants.initial ? { ...variants.initial, transition: { duration: 0.01 } } : variants.initial,
      animate: variants.animate ? { ...variants.animate, transition: { duration: 0.01 } } : variants.animate,
      exit: variants.exit ? { ...variants.exit, transition: { duration: 0.01 } } : variants.exit,
    } as T;
  }
  return variants;
};

// Word-by-word reveal animation
export const wordReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: "blur(10px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.8,
      ease: easings.cinematic,
    },
  }),
};

// Character-by-character reveal (for dramatic effect)
export const charReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.8,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: easings.premium,
    },
  }),
};

// Cinematic section transition
export const sectionTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.95,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: easings.dramatic,
      staggerChildren: 0.1,
    },
  },
};

// Floating animation for background elements
export const floating: Variants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Scale and fade entrance
export const scaleFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easings.premium,
    },
  },
};

// Glitch effect for premium text
export const glitchText: Variants = {
  rest: {
    textShadow: "0 0 0 rgba(255, 75, 92, 0)",
  },
  hover: {
    textShadow: [
      "2px 0 0 rgba(255, 75, 92, 0.5)",
      "-2px 0 0 rgba(255, 75, 92, 0.5)",
      "0 0 0 rgba(255, 75, 92, 0)",
    ],
    transition: {
      duration: 0.3,
      repeat: 2,
    },
  },
};

