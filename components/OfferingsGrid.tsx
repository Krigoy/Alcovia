"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPref } from "../hooks/useMotionPref";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".offering-card");
      if (!cards || cards.length === 0) return;

      if (pref === "reduce") {
        // Show cards immediately for reduced motion
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Set initial state - more dramatic
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.9, rotationY: 15 });

      // Animate cards with scroll-synced scrub (automatically reversible)
      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card as HTMLElement,
          start: "top 90%",
          end: "top 30%", // Longer scroll range for more noticeable animation
          scrub: 0.6, // Faster scrub for more responsive feel
          animation: gsap.fromTo(
            card as HTMLElement,
            { opacity: 0, y: 60, scale: 0.9, rotationY: 15 }, // Initial state - more dramatic
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              ease: "power3.out",
            }
          ),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [pref]);

  return (
    <section
      ref={sectionRef}
      id="offerings"
      className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-10 lg:px-16"
    >
      <header className="flex flex-col gap-4 text-center mb-4">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-soft/90">
          Our Offerings
        </p>
        <h2 className="font-display text-display-2 tracking-tight font-bold">
          Meet Future Builders
        </h2>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1000px" }}>
        {OFFERINGS.map((offering, index) => (
          <article
            key={offering.id}
            className="offering-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/70 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_80px_rgba(0,0,0,0.9)]"
            tabIndex={0}
            role="article"
            aria-label={`${offering.title}: ${offering.summary}`}
          >
            {/* Immersive overlay gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-elevated">
              <Image
                src={offering.image}
                alt={`${offering.title} - ${offering.summary}`}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {/* Lifestyle overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-soft/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            
            <div className="relative z-20 flex flex-1 flex-col gap-3 px-6 py-6 transition-transform duration-300 group-hover:translate-y-[-4px]">
              <h3 className="font-display text-base font-semibold tracking-[0.08em] text-foreground transition-colors group-hover:text-accent">
                {offering.title}
              </h3>
              <p className="text-xs leading-relaxed text-foreground/80 transition-colors group-hover:text-foreground/95">
                {offering.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
