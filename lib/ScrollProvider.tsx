"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLowMotionEnv, isTouchDevice } from "./micro";

gsap.registerPlugin(ScrollTrigger);

type ScrollContextValue = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const useScrollProvider = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollProvider must be used within ScrollProvider");
  }
  return ctx;
};

export function ScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouchDevice() || isLowMotionEnv()) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    // Example global ScrollTrigger config for smooth vertical-drive feel.
    ScrollTrigger.defaults({
      markers: false,
      scrub: 0.6
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ containerRef, enabled }}>
      <div
        ref={containerRef}
        className={enabled ? "scroll-smooth" : ""}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}


