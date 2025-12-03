"use client";

import { useEffect, useRef, useState } from "react";
import { isLowMotionEnv, isTouchDevice } from "../lib/micro";

export function AlcovianCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [showWings, setShowWings] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isTouchDevice() || isLowMotionEnv()) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide native cursor on body and all interactive elements
    document.body.style.cursor = "none";
    
    // Also hide cursor on all interactive elements
    const style = document.createElement("style");
    style.id = "hide-cursor-style";
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    // Check if hero section is in view using Intersection Observer
    const checkHeroVisibility = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Hero is in view if any part of it is visible
        const isHeroVisible = 
          rect.top < viewportHeight && 
          rect.bottom > 0;
        setShowWings(isHeroVisible);
      } else {
        setShowWings(false);
      }
    };

    // Use Intersection Observer for better performance
    const heroSection = document.getElementById('hero-section');
    let observer: IntersectionObserver | null = null;
    
    if (heroSection) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setShowWings(entry.isIntersecting);
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of hero is visible
          rootMargin: '0px'
        }
      );
      observer.observe(heroSection);
    }

    // Also check on scroll for immediate feedback
    const handleScroll = () => {
      checkHeroVisibility();
    };

    // Initial check
    checkHeroVisibility();

    const handleEnter = () => {
      setScale(1.4);
    };

    const handleLeave = () => {
      setScale(1);
    };

    // Smooth lerp-based physics (no bouncing, just smooth following)
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    let rafId: number | null = null;
    const raf = () => {
      // Higher lerp factor for more responsive movement (less delay)
      const lerpFactor = 0.25; // Higher = more responsive, still smooth
      
      // Smooth position interpolation
      currentX = lerp(currentX, targetX, lerpFactor);
      currentY = lerp(currentY, targetY, lerpFactor);

      // Smooth scale interpolation
      const targetScale = scale;
      const currentScale = parseFloat(cursor.style.transform.match(/scale\(([^)]+)\)/)?.[1] || "1");
      const smoothScale = lerp(currentScale, targetScale, 0.25);

      // Offset by half the SVG size (24px) to center the cursor on the mouse position
      const offsetX = currentX - 24;
      const offsetY = currentY - 24;

      // Use translate3d for GPU acceleration, avoid layout paint
      cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${smoothScale})`;

      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.documentElement.addEventListener("pointerover", handleEnter);
    document.documentElement.addEventListener("pointerout", handleLeave);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (observer) {
        observer.disconnect();
      }
      document.body.style.cursor = "";
      const styleElement = document.getElementById("hide-cursor-style");
      if (styleElement) {
        styleElement.remove();
      }
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.removeEventListener("pointerover", handleEnter);
      document.documentElement.removeEventListener("pointerout", handleLeave);
    };
  }, [scale]);

  if (isTouchDevice() || isLowMotionEnv()) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden sm:block"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
    >
      {/* Alcovian SVG - wings only in hero section */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(255,75,92,0.4)]"
      >
        {/* Simplified Alcovian figure */}
        <circle cx="24" cy="24" r="8" fill="#ff4b5c" opacity="0.3" />
        <path
          d="M16 20 L24 16 L32 20 M20 24 L24 28 L28 24"
          stroke="#ff4b5c"
          strokeWidth="2"
          fill="none"
        />
        {/* Wings - only visible in hero section */}
        <path
          d="M12 24 Q8 20 8 16 Q8 12 12 16"
          stroke="#ff9aa5"
          strokeWidth="1.5"
          fill="none"
          opacity={showWings ? 1 : 0}
          style={{ transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <path
          d="M36 24 Q40 20 40 16 Q40 12 36 16"
          stroke="#ff9aa5"
          strokeWidth="1.5"
          fill="none"
          opacity={showWings ? 1 : 0}
          style={{ transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
    </div>
  );
}
