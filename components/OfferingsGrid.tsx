"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { staggerContainer, staggerItem, cardHover, card3D, card3DMobile, scrollReveal3D, sectionTransition, wordReveal, getMotionVariants, shouldReduceMotion } from "../lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMagnetic } from "../hooks/useMagnetic";
import { Sparkles, Users, BookOpen, GraduationCap, Heart, Brain, Target } from "lucide-react";

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
  // Detect mobile synchronously on first render
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Use mobile-friendly settings for intersection observer
  const isInView = useInView(sectionRef, { 
    once: true, 
    amount: 0.05, // Lower threshold for better mobile detection
    margin: "-100px" // More lenient margin for earlier trigger (works for both mobile and desktop)
  });
  
  // Camera-tracked scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  // Optimized section-level parallax (reduced for performance)
  const sectionParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || isMobile ? [0, 0] : [0, -30]
  );
  
  // Disabled rotation for performance
  const sectionRotation = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 0] // Disabled for performance
  );
  
  // Use direct transform instead of spring for better performance
  const smoothSectionParallax = sectionParallax;
  
  const containerVariants = getMotionVariants(staggerContainer, reduceMotion);
  const itemVariants = getMotionVariants(staggerItem, reduceMotion);
  // Use mobile-friendly hover variant on mobile devices
  const hoverVariants = getMotionVariants(isMobile ? card3DMobile : card3D, reduceMotion);

  // Update mobile state on resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track when animation has completed
  useEffect(() => {
    if (isInView && !hasAnimated) {
      // On mobile, add a small delay to ensure smooth animation
      if (isMobile) {
        setTimeout(() => {
          setHasAnimated(true);
        }, 100);
      } else {
        setHasAnimated(true);
      }
    }
  }, [isInView, hasAnimated, isMobile]);
  
  // On mobile, ensure animation triggers even if section is already in view
  useEffect(() => {
    if (isMobile && !hasAnimated) {
      const timer = setTimeout(() => {
        // Check if section is in viewport
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            setHasAnimated(true);
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasAnimated]);

  return (
    <motion.section
      ref={sectionRef}
      id="offerings"
      className="mx-auto flex max-w-7xl flex-col gap-rhythm-6 px-4 py-rhythm-6 sm:px-10 lg:px-16 scroll-section"
      style={{
        y: smoothSectionParallax,
        rotateZ: sectionRotation,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.header
        className="flex flex-col gap-rhythm-3 text-center mb-rhythm-4 offering-header"
        variants={getMotionVariants(sectionTransition, reduceMotion)}
        initial="hidden"
        animate={isInView || hasAnimated ? "visible" : "hidden"}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.p 
          className="font-sans text-label uppercase tracking-[0.1em] text-accent-soft/90 mb-rhythm-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.1 },
            },
          }}
        >
          Our Offerings
        </motion.p>
        <motion.h2 
          className="font-display text-section-heading font-black tracking-[-0.015em]"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {["Meet", "Future", "Builders"].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={getMotionVariants(wordReveal, reduceMotion)}
              custom={i}
            >
              {word}
              {i < 2 && "\u00A0"}
            </motion.span>
          ))}
        </motion.h2>
      </motion.header>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ perspective: "1000px" }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView || hasAnimated || reduceMotion ? "visible" : "hidden"}
      >
        {OFFERINGS.map((offering, index) => (
          <OfferingCard
            key={offering.id}
            offering={offering}
            index={index}
            itemVariants={itemVariants}
            hoverVariants={hoverVariants}
            reduceMotion={reduceMotion}
            isMobile={isMobile}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}

// Separate component to use hooks properly
function OfferingCard({
  offering,
  index,
  itemVariants,
  hoverVariants,
  reduceMotion,
  isMobile,
}: {
  offering: Offering;
  index: number;
  itemVariants: any;
  hoverVariants: any;
  reduceMotion: boolean;
  isMobile: boolean;
}) {
  const cardRef = useMagnetic<HTMLDivElement>({ strength: 0.15, disabled: reduceMotion || isMobile });
  
  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={itemVariants}
      whileHover={reduceMotion ? undefined : hoverVariants.hover}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/70 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow duration-500 ease-out hover:shadow-[0_25px_100px_rgba(255,75,92,0.3),0_20px_80px_rgba(0,0,0,0.9)] hover:border-accent/30",
          "cursor-pointer"
        )}
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
                loading={index < 3 ? undefined : "lazy"}
                quality={75}
                priority={index < 3}
              />
          {/* Lifestyle overlay effect - enhanced */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-soft/10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
          {/* Accent glow on hover */}
          <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 blur-xl" />
            </div>
        
        <CardContent className="relative z-20 flex flex-1 flex-col gap-rhythm-2 px-6 py-6 transition-all duration-500 ease-out group-hover:translate-y-[-6px]">
                <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-foreground transition-all duration-500 group-hover:text-accent mb-2">
                {offering.title}
              </h3>
          <p className="text-body font-sans text-foreground/85 transition-all duration-500 group-hover:text-foreground/95" style={{ lineHeight: "1.55" }}>
                {offering.summary}
              </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
