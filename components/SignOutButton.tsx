"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignOutButton() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showButton, setShowButton] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [hasAppearedOnce, setHasAppearedOnce] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  // Find hero section
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const findHero = () => {
      const hero = document.querySelector("section[data-hero-section]") as HTMLElement;
      if (hero) {
        heroRef.current = hero;
      }
    };
    findHero();
    
    // Try again after a short delay in case hero hasn't rendered yet
    const timeout = setTimeout(findHero, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Check scroll position
  useEffect(() => {
    if (typeof window === "undefined" || !isLoaded || !user) {
      setShowButton(false);
      return;
    }

    const handleScroll = () => {
      if (!heroRef.current) {
        // Fallback: check if scrolled more than viewport height
        const scrolled = window.scrollY > window.innerHeight * 0.8;
        setHasScrolledPastHero(scrolled);
        return;
      }

      const heroRect = heroRef.current.getBoundingClientRect();
      // Check if hero section is completely above the viewport
      const scrolledPast = heroRect.bottom < 0;
      setHasScrolledPastHero(scrolledPast);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded, user]);

  // Show button after scrolling past hero - but keep it visible once shown
  useEffect(() => {
    if (hasScrolledPastHero && isLoaded && user) {
      // Small delay before showing
      const timer = setTimeout(() => {
        setShowButton(true);
        setHasAppearedOnce(true);
      }, 300);
      return () => clearTimeout(timer);
    } else if (!hasAppearedOnce && !hasScrolledPastHero) {
      // Only hide if it hasn't appeared yet and user scrolls back
      setShowButton(false);
    }
    // If hasAppearedOnce is true, keep button visible even when scrolling back
  }, [hasScrolledPastHero, isLoaded, user, hasAppearedOnce]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setHasAppearedOnce(false); // Reset on sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.2 }}
          animate={{ 
            opacity: 1, 
            y: [100, -30, 12, -18, 6, -10, 0],
            scale: [0.2, 1.2, 0.9, 1.08, 0.97, 1.03, 1],
            transition: {
              duration: 2,
              ease: [0.25, 1.75, 0.5, 1], // More pronounced bounce
              times: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1],
            }
          }}
          exit={{ 
            opacity: 0, 
            y: 100, 
            scale: 0.5,
            transition: { duration: 0.3 }
          }}
          className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
        >
          <Button
            onClick={handleSignOut}
            className={cn(
              "group rounded-full bg-accent/90 hover:bg-accent px-3 py-2 sm:px-4 sm:py-2.5",
              "text-xs font-sans font-semibold uppercase tracking-[0.1em] text-background",
              "shadow-[0_8px_32px_rgba(255,75,92,0.4)] hover:shadow-[0_12px_40px_rgba(255,75,92,0.6)]",
              "transition-all duration-300 backdrop-blur-sm",
              "flex items-center gap-1.5 sm:gap-2",
              "min-h-[36px] touch-manipulation"
            )}
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            <span className="text-[10px] sm:text-xs">Logout</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
