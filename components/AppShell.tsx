"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { ScrollProvider } from "../lib/ScrollProvider";
import { AlcovianCursor } from "./AlcovianCursor";
import { ScrollProgress } from "./ScrollProgress";
import { FloatingParticles } from "./FloatingParticles";
import { isTouchDevice } from "../lib/micro";

export function AppShell({ children }: { children: React.ReactNode }) {
  // Disable browser scroll restoration and ensure page starts at top
  // Enhanced for mobile browser compatibility
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Function to scroll to top - works on both desktop and mobile
    const scrollToTop = () => {
      // Method 1: Standard scrollTo (works on most browsers)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      
      // Method 2: Direct assignment (fallback for older mobile browsers)
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      
      // Method 3: Document element scroll (for iOS Safari)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Method 4: Body scroll (additional fallback)
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Scroll immediately
    scrollToTop();

    // For mobile browsers, also scroll after a small delay to handle
    // cases where the page hasn't fully rendered yet
    if (isTouchDevice() || window.innerWidth < 768) {
      // Use requestAnimationFrame for better mobile compatibility
      requestAnimationFrame(() => {
        scrollToTop();
      });
      
      // Additional delay for iOS Safari which can restore scroll after initial render
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }

    // Handle page visibility changes (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scrollToTop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <MotionConfig
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      reducedMotion="user"
    >
      <ScrollProvider>
        <FloatingParticles />
        <ScrollProgress />
        <AlcovianCursor />
        {children}
        <div className="noise-overlay" aria-hidden="true" />
      </ScrollProvider>
    </MotionConfig>
  );
}
