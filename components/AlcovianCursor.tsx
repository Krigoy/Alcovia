"use client";

import { useEffect, useRef, useState } from "react";
import { isLowMotionEnv, isTouchDevice } from "../lib/micro";

type CursorState = "default" | "hover" | "pressed";

export function AlcovianCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<CursorState>("default");
  const [showWings, setShowWings] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [glow, setGlow] = useState(0);

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

    // Initialize cursor position - don't use center, wait for first mouse position
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isInitialized = false;

    // Hide cursor until we have a valid position
    if (cursor) {
      cursor.style.opacity = "0";
    }

    const handleMove = (event: MouseEvent | PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      // Initialize position on first move
      if (!isInitialized) {
        currentX = targetX;
        currentY = targetY;
        isInitialized = true;
        // Show cursor once we have position
        if (cursor) {
          cursor.style.opacity = "1";
        }
      } else {
        // Immediately update current position to prevent any lag
        currentX = targetX;
        currentY = targetY;
      }
    };

    // Handle click events to maintain cursor position
    const handleClick = (event: MouseEvent) => {
      // Update position on click to prevent cursor from resetting
      targetX = event.clientX;
      targetY = event.clientY;
      // Immediately update current position to prevent lag
      currentX = targetX;
      currentY = targetY;
      // Ensure cursor is visible
      if (cursor) {
        cursor.style.opacity = "1";
      }
    };

    // Check if hero section is in view using Intersection Observer
    const checkHeroVisibility = () => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Hero is in view if any part of it is visible
        const isHeroVisible = rect.top < viewportHeight && rect.bottom > 0;
        setShowWings(isHeroVisible);
      } else {
        setShowWings(false);
      }
    };

    // Use Intersection Observer for better performance
    const heroSection = document.getElementById("hero-section");
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
          rootMargin: "0px",
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

    // Cursor state management with distinct states
    const updateCursorState = (newState: CursorState, target?: HTMLElement) => {
      setState(newState);

      // State-specific effects
      switch (newState) {
        case "hover":
          setRotation(5);
          setGlow(1);
          break;
        case "pressed":
          setRotation(-3);
          setGlow(0.6);
          break;
        default:
          setRotation(0);
          setGlow(0);
      }
    };

    // Enhanced interaction detection with distinct states
    const handlePointerEnter = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!cursor) return;

      // Hide cursor inside inputs
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("input") ||
        target.closest("textarea")
      ) {
        cursor.style.opacity = "0";
        return;
      }

      cursor.style.opacity = "1";

      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]')
      ) {
        updateCursorState("hover", target);
      } else if (
        target.closest(".offering-card") ||
        target.closest("[tabindex]")
      ) {
        updateCursorState("hover", target);
      } else {
        updateCursorState("default");
      }
    };

    const handlePointerLeave = () => {
      updateCursorState("default");
    };

    const handlePointerDown = (event: PointerEvent) => {
      // Update position immediately on pointer down to prevent cursor from resetting
      targetX = event.clientX;
      targetY = event.clientY;
      currentX = targetX;
      currentY = targetY;
      // Ensure cursor is visible and initialized
      if (cursor) {
        cursor.style.opacity = "1";
      }
      isInitialized = true;
      updateCursorState("pressed");
    };

    const handlePointerUp = () => {
      updateCursorState("default");
    };

    // Smooth lerp-based physics (no bouncing, just smooth following)
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // State-based scale values
    const getScale = (cursorState: CursorState): number => {
      switch (cursorState) {
        case "hover":
          return 1.6;
        case "pressed":
          return 1.4;
        default:
          return 1;
      }
    };

    let rafId: number | null = null;
    let currentRotation = 0;
    let currentGlow = 0;
    let currentScale = 1;

    const raf = () => {
      // Don't render cursor until we have a valid initialized position
      if (!isInitialized || !cursor) {
        rafId = requestAnimationFrame(raf);
        return;
      }

      // Optimized lerp factor for smoother, more responsive movement
      const lerpFactor = 0.3;

      // Smooth position interpolation - but if target changed significantly, snap faster
      const deltaX = Math.abs(targetX - currentX);
      const deltaY = Math.abs(targetY - currentY);
      const effectiveLerp = deltaX > 50 || deltaY > 50 ? 0.6 : lerpFactor; // Faster snap for large movements

      currentX = lerp(currentX, targetX, effectiveLerp);
      currentY = lerp(currentY, targetY, effectiveLerp);

      // Smooth scale interpolation based on state
      const targetScale = getScale(state);
      currentScale = lerp(currentScale, targetScale, 0.25);

      // Smooth rotation interpolation
      currentRotation = lerp(currentRotation, rotation, 0.2);

      // Smooth glow interpolation
      currentGlow = lerp(currentGlow, glow, 0.2);

      // Offset by half the SVG size (24px) to center the cursor on the mouse position
      const offsetX = currentX - 24;
      const offsetY = currentY - 24;

      // Use translate3d for GPU acceleration, avoid layout paint
      // Only transform and opacity, no layout properties
      cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${currentScale}) rotate(${currentRotation}deg)`;
      cursor.style.filter = `drop-shadow(0 0 ${
        8 + currentGlow * 12
      }px rgba(255, 75, 92, ${0.4 + currentGlow * 0.4}))`;

      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Use pointermove for better compatibility
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.documentElement.addEventListener(
      "pointerenter",
      handlePointerEnter
    );
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave
    );
    document.documentElement.addEventListener(
      "pointerdown",
      handlePointerDown,
      { passive: true }
    );
    document.documentElement.addEventListener("pointerup", handlePointerUp);

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
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.removeEventListener(
        "pointerenter",
        handlePointerEnter
      );
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
      document.documentElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      document.documentElement.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, [state, rotation, glow]);

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
      {/* Optimized Alcovian SVG - retina-ready, sharp rendering */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          shapeRendering: "geometricPrecision",
          imageRendering: "crisp-edges",
        }}
        aria-hidden="true"
      >
        {/* Simplified Alcovian figure - optimized paths */}
        <circle cx="24" cy="24" r="8" fill="#ff4b5c" opacity="0.3" />
        <path
          d="M16 20 L24 16 L32 20 M20 24 L24 28 L28 24"
          stroke="#ff4b5c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Wings - only visible in hero section */}
        <path
          d="M12 24 Q8 20 8 16 Q8 12 12 16"
          stroke="#ff9aa5"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity={showWings ? 1 : 0}
          style={{
            transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "12px 24px",
          }}
        />
        <path
          d="M36 24 Q40 20 40 16 Q40 12 36 16"
          stroke="#ff9aa5"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity={showWings ? 1 : 0}
          style={{
            transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "36px 24px",
          }}
        />
      </svg>
    </div>
  );
}
