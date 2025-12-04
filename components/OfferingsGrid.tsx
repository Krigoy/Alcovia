"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { staggerContainer, staggerItem, cardHover, getMotionVariants, shouldReduceMotion } from "../lib/animations";

type Offering = {
  id: string;
  title: string;
  summary: string;
  image: string;
};

// Exact 9 offerings from the brief
const OFFERINGS: Offering[] = [
  {
    id: "career-discovery",
    title: "Career Discovery Workshops",
    summary: "Explore various career paths through hands-on workshops.",
    image: "/Offerings/Workshop.webp"
  },
  {
    id: "podcast-shoots",
    title: "Podcast Shoots with Industry Experts",
    summary: "Engage with industry experts in professional podcast settings.",
    image: "/Offerings/podcast.webp"
  },
  {
    id: "mentorship",
    title: "1:1 Mentorship with Top Professionals",
    summary: "Personalized guidance from top professionals in your field.",
    image: "/Offerings/mentorship.webp"
  },
  {
    id: "academic-score",
    title: "Scientifically Build Academic Score",
    summary: "Data-driven strategies to enhance academic performance.",
    image: "/Offerings/Academic score.webp"
  },
  {
    id: "forge-bonds",
    title: "Forge Bonds with Similarly Driven Teens",
    summary: "Connect with peers who share your ambition and drive.",
    image: "/Offerings/Similarly driven teens.webp"
  },
  {
    id: "weekly-mentorship",
    title: "Weekly Mentorship from Harvard & UCL Professionals",
    summary: "Regular sessions with professionals from top universities.",
    image: "/Offerings/Harvard.png"
  },
  {
    id: "career-counsellor",
    title: "Monthly Career Counsellor Meetings",
    summary: "Expert advice to chart your career path strategically.",
    image: "/Offerings/counselor.webp"
  },
  {
    id: "build-resilience",
    title: "Build Resilience",
    summary: "Develop the mental strength to overcome challenges.",
    image: "/Offerings/Mental resillience.webp"
  },
  {
    id: "build-empathy",
    title: "Build Empathy",
    summary: "Cultivate emotional intelligence and understanding.",
    image: "/Offerings/empathy.webp"
  }
];

export function OfferingsGrid() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2, margin: "-200px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const containerVariants = getMotionVariants(staggerContainer, reduceMotion);
  const itemVariants = getMotionVariants(staggerItem, reduceMotion);
  const hoverVariants = getMotionVariants(cardHover, reduceMotion);

  // Track when animation has completed
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <section
      ref={sectionRef}
      id="offerings"
      className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-10 lg:px-16 scroll-section"
    >
      <motion.header
        className="flex flex-col gap-4 text-center mb-4 offering-header"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-soft/90">
          Our Offerings
        </p>
        <h2 className="font-display text-display-2 tracking-tight font-bold">
          Meet Future Builders
        </h2>
      </motion.header>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ perspective: "1000px" }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView || hasAnimated ? "visible" : reduceMotion ? "visible" : "hidden"}
      >
        {OFFERINGS.map((offering, index) => (
          <motion.article
            key={offering.id}
            custom={index}
            variants={itemVariants}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    scale: 1.03,
                    y: -8,
                    rotateY: 2,
                    transition: {
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }
            }
            className="offering-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/70 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow duration-500 ease-out hover:shadow-[0_25px_100px_rgba(255,75,92,0.3),0_20px_80px_rgba(0,0,0,0.9)] hover:border-accent/30"
            tabIndex={0}
            role="article"
            aria-label={`${offering.title}: ${offering.summary}`}
          >
            {/* Immersive overlay gradient - enhanced */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
            
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-elevated">
              <Image
                src={offering.image}
                alt={`${offering.title} - ${offering.summary}`}
                fill
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-115"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                quality={85}
              />
              {/* Lifestyle overlay effect - enhanced */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-soft/10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
              {/* Accent glow on hover */}
              <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 blur-xl" />
            </div>
            
            <div className="relative z-20 flex flex-1 flex-col gap-3 px-6 py-6 transition-all duration-500 ease-out group-hover:translate-y-[-6px]">
              <h3 className="font-display text-base font-semibold tracking-[0.08em] text-foreground transition-all duration-500 group-hover:text-accent group-hover:tracking-[0.1em]">
                {offering.title}
              </h3>
              <p className="text-xs leading-relaxed text-foreground/80 transition-all duration-500 group-hover:text-foreground/95 group-hover:leading-[1.6]">
                {offering.summary}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
