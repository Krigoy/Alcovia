/**
 * Magnetic Hover Effect Hook
 * Creates a magnetic attraction effect that follows the mouse cursor
 */

import { useEffect, useRef, RefObject } from "react";

interface UseMagneticOptions {
  strength?: number;
  disabled?: boolean;
}

export const useMagnetic = <T extends HTMLElement = HTMLDivElement>({ strength = 0.3, disabled = false }: UseMagneticOptions = {}): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (disabled || !ref.current) return;

    const element = ref.current;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (e.clientX - centerX) * strength;
        const y = (e.clientY - centerY) * strength;

        element.style.transform = `translate(${x}px, ${y}px)`;
        element.style.transition = "transform 0.1s ease-out";
      });
    };

    const handleMouseLeave = () => {
      if (!element) return;
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        element.style.transform = "translate(0, 0)";
        element.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      });
    };

    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.style.transform = "";
      element.style.transition = "";
    };
  }, [strength, disabled]);

  return ref;
};

