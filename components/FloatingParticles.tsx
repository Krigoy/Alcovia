"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";

type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
};

export function FloatingParticles() {
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce";
  // Random positions are generated after mount so the server and client markup match.
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  if (reduceMotion || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

