"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Component that uses Clerk hooks
// ClerkProvider is in the layout, so hooks should work
function SignOutButtonInner() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [showButton, setShowButton] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [hasAppearedOnce, setHasAppearedOnce] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
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
        const scrolled = window.scrollY > window.innerHeight * 0.8;
        setHasScrolledPastHero(scrolled);
        return;
      }

      const heroRect = heroRef.current.getBoundingClientRect();
      // Use a threshold to prevent flickering - consider past hero when bottom is above -50px
      const scrolledPast = heroRect.bottom < -50;
      setHasScrolledPastHero(scrolledPast);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded, user]);

  // Show button after scrolling past hero - keep it visible once shown
  useEffect(() => {
    if (hasScrolledPastHero && isLoaded && user) {
      if (!hasAppearedOnce) {
        // First time appearing - show with animation
        const timer = setTimeout(() => {
          setShowButton(true);
          setHasAppearedOnce(true);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        // Already appeared once - keep visible immediately
        setShowButton(true);
      }
    } else if (!hasAppearedOnce) {
      // Only hide if it hasn't appeared yet
      setShowButton(false);
    }
    // If hasAppearedOnce is true, keep button visible even if scrolled back
  }, [hasScrolledPastHero, isLoaded, user, hasAppearedOnce]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setHasAppearedOnce(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {showButton && (
        <motion.div
          key="signout-button"
          initial={hasAnimated ? false : { opacity: 0, y: 100, scale: 0.2 }}
          animate={{ 
            opacity: 1, 
            y: hasAnimated ? 0 : [100, -30, 12, -18, 6, -10, 0],
            scale: hasAnimated ? 1 : [0.2, 1.2, 0.9, 1.08, 0.97, 1.03, 1],
            transition: hasAnimated ? {
              duration: 0.3,
              ease: "easeOut"
            } : {
              duration: 2,
              ease: [0.25, 1.75, 0.5, 1],
              times: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1],
              onComplete: () => setHasAnimated(true),
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

// Wrapper that only renders when Clerk is configured
function SignOutButtonWrapper() {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if Clerk is configured
    const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    if (hasClerkKey) {
      // Small delay to ensure ClerkProvider is ready
      setTimeout(() => {
        setShouldRender(true);
      }, 200);
    }
  }, []);

  if (!mounted || !shouldRender) {
    return null;
  }

  return <SignOutButtonInner />;
}

// Export with dynamic to prevent SSR issues
export const SignOutButton = dynamic(() => Promise.resolve(SignOutButtonWrapper), {
  ssr: false,
});
