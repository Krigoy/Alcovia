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

// Line-by-line reveal for manifesto
export const lineReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    clipPath: "inset(100% 0 0 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      ease: easings.cinematic,
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
    // Return minimal motion variants
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = {
        ...variants[key],
        transition: { duration: 0.01 },
      };
      return acc;
    }, {} as T);
  }
  return variants;
};

