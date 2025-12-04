"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "../components/Hero";
import { Manifesto } from "../components/Manifesto";
import { OfferingsGrid } from "../components/OfferingsGrid";
import { SchoolToggle } from "../components/SchoolToggle";
import { SocialsFooter } from "../components/SocialsFooter";
import { useMotionPref } from "../hooks/useMotionPref";

gsap.registerPlugin(ScrollTrigger);

const CTA = dynamic(() => import("../components/CTA").then((m) => m.CTA), {
  ssr: false,
});

export default function HomePage() {
  const ctaSectionRef = useRef<HTMLElement | null>(null);
  const pref = useMotionPref();

  useEffect(() => {
    if (!ctaSectionRef.current || pref === "reduce") return;

    const ctx = gsap.context(() => {
      const elements = ctaSectionRef.current?.querySelectorAll("p, h2");
      if (elements) {
        ScrollTrigger.create({
          trigger: ctaSectionRef.current,
          start: "top 80%",
          end: "top 60%",
          scrub: 0.8,
          animation: gsap.fromTo(
            elements,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, stagger: 0.1, ease: "power3.out" }
          ),
        });
      }
    }, ctaSectionRef);

    return () => ctx.revert();
  }, [pref]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="flex flex-col items-center">
        <Hero />
        <Manifesto />
        <OfferingsGrid />
        <SchoolToggle />

        <section ref={ctaSectionRef} id="cta-section" className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 pb-24 pt-12 text-center sm:px-10 lg:px-16 scroll-section">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-accent-soft/90">
            Common Queries Answered
          </p>
          <h2 className="font-display text-display-2 tracking-tight font-bold">
            What exactly does Alcovia offer for students in grades 6–10?
          </h2>
          <p className="max-w-xl text-sm text-foreground/85 leading-relaxed">
            Alcovia provides a holistic development platform for students in
            grades 6–10, combining personalized mentorship, AI-enabled
            workshops, real-world simulations, and peer learning. Our programs
            are designed to help students build critical thinking, creativity,
            leadership, and communication skills, preparing them to excel
            academically and thrive in the real world.
          </p>
          <CTA />
        </section>
      </div>

      <SocialsFooter />
    </main>
  );
}
