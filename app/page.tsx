"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "../components/Hero";
import { Manifesto } from "../components/Manifesto";
import { OfferingsGrid } from "../components/OfferingsGrid";
import { SchoolToggle } from "../components/SchoolToggle";
import { SocialsFooter } from "../components/SocialsFooter";
import { useMotionPref } from "../hooks/useMotionPref";
import { wordReveal, getMotionVariants } from "../lib/animations";
import { HomeBackground } from "../components/ui/HomeBackground";
import { SignOutButton } from "../components/SignOutButton";
import { useUser } from "@clerk/nextjs";

gsap.registerPlugin(ScrollTrigger);

const CTA = dynamic(() => import("../components/CTA").then((m) => m.CTA), {
  ssr: false,
});

export default function HomePage() {
  const ctaSectionRef = useRef<HTMLElement | null>(null);
  const pref = useMotionPref();
  const { user, isLoaded: userLoaded } = useUser();

  // Save user to backend after authentication (including Google OAuth)
  useEffect(() => {
    if (!userLoaded || !user) return;

    const saveUserToBackend = async () => {
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Failed to save user to backend:", error);
      }
    };

    saveUserToBackend();
  }, [user, userLoaded]);

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
      {/* Background Animations */}
      <HomeBackground />
      
      <div className="flex flex-col items-center">
        <Hero />
        <Manifesto />
        <OfferingsGrid />
        <SchoolToggle />

        <section ref={ctaSectionRef} id="cta-section" className="mx-auto flex w-full max-w-4xl flex-col items-center gap-rhythm-4 px-4 pb-rhythm-6 pt-rhythm-4 text-center sm:px-10 lg:px-16 scroll-section">
          <motion.p 
            className="font-sans text-label uppercase tracking-[0.1em] text-accent-soft/90 mb-rhythm-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Common Queries Answered
          </motion.p>
          <motion.h2 
            className="font-display text-section-heading font-black tracking-[-0.015em] mb-rhythm-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              staggerChildren: 0.08,
              delayChildren: 0.2,
            }}
          >
            {["What", "exactly", "does", "Alcovia", "offer", "for", "students", "in", "grades", "6–10?"].map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={getMotionVariants(wordReveal, pref === "reduce")}
                custom={i}
              >
                {word}
                {i < 9 && "\u00A0"}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p 
            className="max-w-xl text-body font-sans text-foreground/90 mb-rhythm-5" 
            style={{ lineHeight: "1.65" }}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            Alcovia provides a holistic development platform for students in
            grades 6–10, combining personalized mentorship, AI-enabled
            workshops, real-world simulations, and peer learning. Our programs
            are designed to help students build critical thinking, creativity,
            leadership, and communication skills, preparing them to excel
            academically and thrive in the real world.
          </motion.p>
          <CTA />
        </section>
      </div>

      <SocialsFooter />
      
      {/* Sign Out Button - appears after scrolling past hero */}
      <SignOutButton />
    </main>
  );
}
