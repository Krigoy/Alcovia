"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLowMotionEnv, isTouchDevice } from "./micro";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouchDevice() || isLowMotionEnv()) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    // Global ScrollTrigger config for smooth scroll animations
    ScrollTrigger.defaults({
      markers: false,
      scrub: 0.6,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={enabled ? "scroll-smooth" : ""}>
      {children}
    </div>
  );
}


