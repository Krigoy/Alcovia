"use client";

import { useEffect, useRef, useState } from "react";

interface Firefly {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  glowRadius: number;
}

interface Lightning {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments: { x: number; y: number }[];
  opacity: number;
  duration: number;
  elapsed: number;
  active: boolean;
}

export function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        typeof window !== "undefined" &&
          (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches)
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reset animation flag when dependencies change
    animationStartedRef.current = false;

    // Use requestAnimationFrame to ensure canvas is ready
    const startAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        requestAnimationFrame(startAnimation);
        return;
      }

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        requestAnimationFrame(startAnimation);
        return;
      }

      // Prevent multiple animations
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;

      // Set canvas size with device pixel ratio for crisp rendering on mobile
      let canvasWidth = window.innerWidth;
      let canvasHeight = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      const resizeCanvas = () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        
        // Set actual size in memory (scaled for device pixel ratio)
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        
        // Scale the canvas back down using CSS
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";
        
        // Scale the drawing context so everything draws at the correct size
        ctx.scale(dpr, dpr);
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Fireflies
      const fireflies: Firefly[] = [];
      const fireflyCount = isMobile ? 8 : 15;

      for (let i = 0; i < fireflyCount; i++) {
        fireflies.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          size: Math.random() * 3 + 1.5,
          opacity: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.3 + 0.1,
          phase: Math.random() * Math.PI * 2,
          glowRadius: Math.random() * 15 + 10,
        });
      }

      // Lightning bolts
      const lightnings: Lightning[] = [];
      const lightningCount = isMobile ? 2 : 4;

      const createLightning = (): Lightning => {
        const startX = Math.random() * canvasWidth * 0.2; // Left portion
        const startY = Math.random() * canvasHeight;
        const endX = startX + Math.random() * canvasWidth * 0.6 + canvasWidth * 0.2;
        const endY = startY + (Math.random() - 0.5) * canvasHeight * 0.3;

        // Create zig-zag segments (horizontal)
        const segments: { x: number; y: number }[] = [];
        const numSegments = 8 + Math.floor(Math.random() * 6);
        const dx = (endX - startX) / numSegments;
        const dy = (endY - startY) / numSegments;

        segments.push({ x: startX, y: startY });
        for (let i = 1; i < numSegments; i++) {
          const zigzag = (Math.random() - 0.5) * 40;
          segments.push({
            x: startX + dx * i,
            y: startY + dy * i + zigzag,
          });
        }
        segments.push({ x: endX, y: endY });

        return {
          startX,
          startY,
          endX,
          endY,
          segments,
          opacity: 0,
          duration: 200 + Math.random() * 300,
          elapsed: 0,
          active: false,
        };
      };

      // Initialize lightnings
      for (let i = 0; i < lightningCount; i++) {
        lightnings.push(createLightning());
      }

      let animationFrameId: number;
      let time = 0;

      // Function to create lightning from click position (spreads both directions)
      const createLightningFromClick = (clickX: number, clickY: number): Lightning => {
        const centerX = clickX;
        const centerY = clickY;
        
        // Reduced length - spread in both directions
        const spreadDistance = canvasWidth * 0.15; // Reduced from 0.5-0.7 to 0.15
        const startX = Math.max(0, centerX - spreadDistance);
        const endX = Math.min(canvasWidth, centerX + spreadDistance);
        const startY = centerY + (Math.random() - 0.5) * 20;
        const endY = centerY + (Math.random() - 0.5) * 20;

        // Create zig-zag segments (horizontal, spreading from center)
        const segments: { x: number; y: number }[] = [];
        const numSegments = 8 + Math.floor(Math.random() * 6);
        const dx = (endX - startX) / numSegments;
        const dy = (endY - startY) / numSegments;

        segments.push({ x: startX, y: startY });
        for (let i = 1; i < numSegments; i++) {
          const zigzag = (Math.random() - 0.5) * 30; // Reduced zigzag
          segments.push({
            x: startX + dx * i,
            y: startY + dy * i + zigzag,
          });
        }
        segments.push({ x: endX, y: endY });

        return {
          startX,
          startY,
          endX,
          endY,
          segments,
          opacity: 0,
          duration: 800 + Math.random() * 400, // Slower: 800-1200ms (was 200-500ms)
          elapsed: 0,
          active: false,
        };
      };

      // Function to trigger lightning on click
      const triggerLightning = (x: number, y: number) => {
        const inactiveLightning = lightnings.find((l) => !l.active);
        if (inactiveLightning) {
          // Create new lightning from click position
          const newLightning = createLightningFromClick(x, y);
          inactiveLightning.startX = newLightning.startX;
          inactiveLightning.startY = newLightning.startY;
          inactiveLightning.endX = newLightning.endX;
          inactiveLightning.endY = newLightning.endY;
          inactiveLightning.segments = newLightning.segments;
          inactiveLightning.active = true;
          inactiveLightning.elapsed = 0;
          inactiveLightning.opacity = 0.9;
        }
      };

      // Add click event listener for lightning
      const handleClick = (e: MouseEvent) => {
        if (e.button === 0) { // Left mouse button
          triggerLightning(e.clientX, e.clientY);
        }
      };

      // Add touch event listener for mobile
      const handleTouch = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          triggerLightning(touch.clientX, touch.clientY);
        }
      };

      window.addEventListener("click", handleClick);
      window.addEventListener("touchstart", handleTouch);

      const animate = () => {
        // Fill with a very dark background
        ctx.fillStyle = "rgba(3, 4, 10, 0.95)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        time += 16; // ~60fps

        // Update and draw fireflies
        fireflies.forEach((firefly) => {
          // Move firefly in a gentle floating pattern
          firefly.phase += firefly.speed * 0.01;
          firefly.x += Math.sin(firefly.phase) * 0.3;
          firefly.y += Math.cos(firefly.phase * 0.7) * 0.3;

          // Wrap around screen edges
          if (firefly.x < 0) firefly.x = canvasWidth;
          if (firefly.x > canvasWidth) firefly.x = 0;
          if (firefly.y < 0) firefly.y = canvasHeight;
          if (firefly.y > canvasHeight) firefly.y = 0;

          // Pulsing opacity (dim and disappear effect)
          const pulse = Math.sin(time * 0.002 + firefly.phase) * 0.3 + 0.7;
          const currentOpacity = firefly.opacity * pulse;

          // Draw glow
          const gradient = ctx.createRadialGradient(
            firefly.x,
            firefly.y,
            0,
            firefly.x,
            firefly.y,
            firefly.glowRadius
          );
          gradient.addColorStop(0, `rgba(255, 75, 92, ${currentOpacity * 0.7})`);
          gradient.addColorStop(0.5, `rgba(255, 75, 92, ${currentOpacity * 0.3})`);
          gradient.addColorStop(1, "rgba(255, 75, 92, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(firefly.x, firefly.y, firefly.glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw firefly core
          ctx.fillStyle = `rgba(255, 75, 92, ${currentOpacity})`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(255, 75, 92, 1)";
          ctx.beginPath();
          ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Update and draw lightning
        lightnings.forEach((lightning) => {
          if (!lightning.active) return;

          lightning.elapsed += 16;
          const progress = lightning.elapsed / lightning.duration;

          // Slower, more gradual animation (sticky fluid effect)
          if (progress < 0.2) {
            // Slow fade in
            lightning.opacity = (progress / 0.2) * 0.9;
          } else if (progress < 0.5) {
            // Hold at bright flash longer
            lightning.opacity = 0.9;
          } else if (progress < 1) {
            // Slow fade out
            lightning.opacity = 0.9 * (1 - (progress - 0.5) / 0.5);
          } else {
            // Reset
            lightning.active = false;
            lightning.opacity = 0;
            // Lightning will be repositioned on next click
          }

          if (lightning.opacity > 0) {
            // Calculate center point (click origin)
            const centerX = (lightning.startX + lightning.endX) / 2;
            const centerY = (lightning.startY + lightning.endY) / 2;

            // Add glow at center point (click origin)
            const centerGradient = ctx.createRadialGradient(
              centerX,
              centerY,
              0,
              centerX,
              centerY,
              30
            );
            centerGradient.addColorStop(0, `rgba(255, 75, 92, ${lightning.opacity * 0.9})`);
            centerGradient.addColorStop(0.5, `rgba(255, 75, 92, ${lightning.opacity * 0.5})`);
            centerGradient.addColorStop(1, "rgba(255, 75, 92, 0)");
            ctx.fillStyle = centerGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
            ctx.fill();

            // Draw lightning with zig-zag path (horizontal, spreading both ways)
            ctx.strokeStyle = `rgba(255, 75, 92, ${lightning.opacity})`;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(255, 75, 92, 1)";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(lightning.segments[0].x, lightning.segments[0].y);
            for (let i = 1; i < lightning.segments.length; i++) {
              ctx.lineTo(lightning.segments[i].x, lightning.segments[i].y);
            }
            ctx.stroke();

            // Add brighter core
            ctx.strokeStyle = `rgba(255, 150, 180, ${lightning.opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Add glow at both endpoints
            const endGradient1 = ctx.createRadialGradient(
              lightning.startX,
              lightning.startY,
              0,
              lightning.startX,
              lightning.startY,
              18
            );
            endGradient1.addColorStop(0, `rgba(255, 75, 92, ${lightning.opacity * 0.6})`);
            endGradient1.addColorStop(1, "rgba(255, 75, 92, 0)");
            ctx.fillStyle = endGradient1;
            ctx.beginPath();
            ctx.arc(lightning.startX, lightning.startY, 18, 0, Math.PI * 2);
            ctx.fill();

            const endGradient2 = ctx.createRadialGradient(
              lightning.endX,
              lightning.endY,
              0,
              lightning.endX,
              lightning.endY,
              18
            );
            endGradient2.addColorStop(0, `rgba(255, 75, 92, ${lightning.opacity * 0.6})`);
            endGradient2.addColorStop(1, "rgba(255, 75, 92, 0)");
            ctx.fillStyle = endGradient2;
            ctx.beginPath();
            ctx.arc(lightning.endX, lightning.endY, 18, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        animationFrameId = requestAnimationFrame(animate);
      };

      // Start animation immediately
      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("touchstart", handleTouch);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    };

    requestAnimationFrame(startAnimation);

    return () => {
      animationStartedRef.current = false;
    };
  }, [isMobile]);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
      <canvas
        ref={canvasRef}
        style={{ 
          background: "transparent",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
