"use client";

import { Linkedin, Instagram } from "lucide-react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { fannedCard, getMotionVariants, shouldReduceMotion } from "../lib/animations";

const socialCards = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/alcovia-life/",
    icon: <Linkedin className="w-6 h-6" />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/alcovia.life/",
    icon: <Instagram className="w-6 h-6" />,
  },
];

export function SocialsFooter() {
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();
  const fannedCardVariants = getMotionVariants(fannedCard, reduceMotion);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleCardHover = (index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredCard(index);
    const card = cardRefs.current[index];
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const spotlight = card.querySelector('.social-card-spotlight') as HTMLElement;
      if (spotlight) {
        spotlight.style.setProperty('--spotlight-x', `${(x / rect.width) * 100}%`);
        spotlight.style.setProperty('--spotlight-y', `${(y / rect.height) * 100}%`);
      }
    }
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <footer className="border-t border-surface-subtle/70 bg-background/80 px-4 py-rhythm-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="mb-rhythm-6 text-center">
          <h2 className="font-display text-section-heading font-black tracking-[-0.015em] text-foreground">
            What's Up on Socials
          </h2>
        </div>

        {/* Overlapping fanned cards layout with spotlight effect */}
        <nav
          className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8"
          aria-label="Alcovia social links"
        >
          {socialCards.map((card, index) => (
          <motion.a
              key={card.name}
              ref={(el) => {
                if (el) {
                  cardRefs.current[index] = el;
                }
              }}
              href={card.href}
            target="_blank"
            rel="noopener noreferrer"
              className="group relative flex h-48 w-36 sm:h-64 sm:w-48 md:h-80 md:w-60 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated/50 backdrop-blur-lg shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/40 hover:shadow-[0_20px_40px_rgba(255,75,92,0.2),0_10px_20px_rgba(0,0,0,0.4)] hover:z-10"
              initial={{ rotate: index === 0 ? -8 : 8, y: 0, scale: 1, zIndex: index === 0 ? 10 : 20 }}
              variants={fannedCardVariants}
            whileHover={
                reduceMotion
                ? undefined
                : {
                      y: -8,
                      rotateY: index === 0 ? -3 : 3,
                      rotateX: -5,
                      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    }
              }
              whileTap={
                reduceMotion
                ? undefined
                : {
                      y: -4,
                      rotateY: index === 0 ? -1 : 1,
                      rotateX: -2,
                      transition: { duration: 0.1 },
                  }
            }
              onMouseMove={(e) => handleCardHover(index, e)}
              onMouseLeave={handleCardLeave}
              aria-label={`Visit Alcovia on ${card.name}`}
              tabIndex={0}
              style={{
                transformStyle: 'preserve-3d',
              }}
          >
              {/* Spotlight effect with theme accent color */}
              <div 
                className="social-card-spotlight absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(
                    circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
                    rgba(255, 75, 92, 0.25) 0%,
                    rgba(255, 75, 92, 0.1) 40%,
                    transparent 70%
                  )`,
                }}
              />
              
              {/* Card content */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-6">
                <div className="text-foreground/90 transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:scale-[1.2] group-hover:rotate-[5deg]">
                  {card.icon}
                </div>
                <span className="text-label font-sans font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-opacity duration-300">
                  {card.name}
                </span>
              </div>
          </motion.a>
          ))}
        </nav>

        {/* Footer text */}
        <div className="mx-auto mt-rhythm-6 flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-rhythm-2 text-label font-sans text-foreground/40 px-4">
        <span>&copy; {new Date().getFullYear()} Alcovia. All rights reserved.</span>
        <span>Made for builders.</span>
        </div>
      </div>
    </footer>
  );
}
