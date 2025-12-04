"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Streak {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  opacity: number;
}

interface Light {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  pulseSpeed: number;
}

export function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Sparkles
    const sparkles: Sparkle[] = [];
    const sparkleCount = isMobile ? 15 : 30;

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 3000 + 2000,
        delay: Math.random() * 2000,
      });
    }

    // Streaking lines
    const streaks: Streak[] = [];
    const streakCount = isMobile ? 3 : 6;

    for (let i = 0; i < streakCount; i++) {
      streaks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * 200 + 100,
        speed: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    // Ambient lights
    const lights: Light[] = [];
    const lightCount = isMobile ? 2 : 4;

    for (let i = 0; i < lightCount; i++) {
      lights.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 100,
        intensity: Math.random() * 0.3 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 16; // ~60fps

      // Draw ambient lights
      lights.forEach((light) => {
        const pulse = Math.sin(time * light.pulseSpeed) * 0.1 + 0.9;
        const gradient = ctx.createRadialGradient(
          light.x,
          light.y,
          0,
          light.x,
          light.y,
          light.radius * pulse
        );
        gradient.addColorStop(0, `rgba(255, 75, 92, ${light.intensity * pulse})`);
        gradient.addColorStop(0.5, `rgba(255, 75, 92, ${light.intensity * pulse * 0.5})`);
        gradient.addColorStop(1, "rgba(255, 75, 92, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw streaking lines
      streaks.forEach((streak) => {
        streak.x += Math.cos(streak.angle) * streak.speed;
        streak.y += Math.sin(streak.angle) * streak.speed;

        // Reset if off screen
        if (
          streak.x < -streak.length ||
          streak.x > canvas.width + streak.length ||
          streak.y < -streak.length ||
          streak.y > canvas.height + streak.length
        ) {
          streak.x = Math.random() * canvas.width;
          streak.y = Math.random() * canvas.height;
          streak.angle = Math.random() * Math.PI * 2;
        }

        // Draw blurred streak
        const gradient = ctx.createLinearGradient(
          streak.x,
          streak.y,
          streak.x + Math.cos(streak.angle) * streak.length,
          streak.y + Math.sin(streak.angle) * streak.length
        );
        gradient.addColorStop(0, `rgba(255, 75, 92, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 75, 92, ${streak.opacity})`);
        gradient.addColorStop(1, `rgba(255, 75, 92, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 75, 92, 0.5)";
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(
          streak.x + Math.cos(streak.angle) * streak.length,
          streak.y + Math.sin(streak.angle) * streak.length
        );
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw sparkles
      sparkles.forEach((sparkle) => {
        const elapsed = (time + sparkle.delay) % sparkle.duration;
        const progress = elapsed / sparkle.duration;
        const opacity =
          progress < 0.5
            ? (sparkle.opacity * progress * 2)
            : sparkle.opacity * (1 - (progress - 0.5) * 2);

        ctx.fillStyle = `rgba(255, 75, 92, ${opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 75, 92, 0.8)";
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw cross shape for sparkle
        ctx.strokeStyle = `rgba(255, 75, 92, ${opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sparkle.x - sparkle.size * 2, sparkle.y);
        ctx.lineTo(sparkle.x + sparkle.size * 2, sparkle.y);
        ctx.moveTo(sparkle.x, sparkle.y - sparkle.size * 2);
        ctx.lineTo(sparkle.x, sparkle.y + sparkle.size * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, isMobile]);

  if (!mounted) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
        style={{ background: "transparent" }}
      />
      {/* Additional gradient overlays for depth */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
    </>
  );
}

