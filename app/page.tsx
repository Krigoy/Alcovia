"use client";

import dynamic from "next/dynamic";
import { Hero } from "../components/Hero";
import { Manifesto } from "../components/Manifesto";
import { OfferingsGrid } from "../components/OfferingsGrid";
import { SchoolToggle } from "../components/SchoolToggle";
import { SocialsFooter } from "../components/SocialsFooter";

const CTA = dynamic(() => import("../components/CTA").then((m) => m.CTA), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="flex flex-col items-center">
        <Hero />
        <Manifesto />
        <OfferingsGrid />
        <SchoolToggle />

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 pb-24 pt-12 text-center sm:px-10 lg:px-16">
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
