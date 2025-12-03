"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";

export function CTA() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const pref = useMotionPref();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      context: formData.get("context")
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enrollment");
      }

      setSubmitStatus("success");
      // Reset form using ref
      if (formRef.current) {
        formRef.current.reset();
      }
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit enrollment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background shadow-glow transition hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80"
      >
        Enroll my child
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
            initial={pref === "reduce" ? false : { opacity: 0 }}
            animate={pref === "reduce" ? undefined : { opacity: 1 }}
            exit={pref === "reduce" ? undefined : { opacity: 0 }}
            aria-modal="true"
            role="dialog"
            aria-labelledby="cta-modal-title"
          >
            <motion.div
              initial={pref === "reduce" ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={pref === "reduce" ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={pref === "reduce" ? undefined : { opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-2xl border border-white/12 bg-surface/90 p-4 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-accent-soft/70">
                    Common Queries Answered
                  </p>
                  <h2
                    id="cta-modal-title"
                    className="mt-2 font-display text-lg tracking-tight text-foreground"
                  >
                    How do I enroll my child?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/20 bg-surface-subtle/60 p-1 text-[0.65rem] uppercase tracking-[0.16em] text-foreground/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80"
                  aria-label="Close signup modal"
                >
                  Esc
                </button>
              </div>

              <form ref={formRef} className="space-y-4 text-sm" onSubmit={handleSubmit}>
                {/* Success Message */}
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-lg bg-green-500/20 border border-green-500/40 px-4 py-3 text-sm text-green-400"
                    >
                      ✓ Enrollment submitted successfully! We'll be in touch soon.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-3 text-sm text-red-400"
                    >
                      ✗ {errorMessage || "Failed to submit enrollment. Please try again."}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-foreground/60"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    autoComplete="name"
                    className="w-full rounded-lg border border-white/14 bg-background/40 px-3 py-3 text-base text-foreground outline-none ring-accent-soft/40 placeholder:text-foreground/40 focus:border-accent-soft focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-foreground/60"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                    inputMode="email"
                    className="w-full rounded-lg border border-white/14 bg-background/40 px-3 py-3 text-base text-foreground outline-none ring-accent-soft/40 placeholder:text-foreground/40 focus:border-accent-soft focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="context"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-foreground/60"
                  >
                    Context
                  </label>
                  <textarea
                    id="context"
                    name="context"
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-lg border border-white/14 bg-background/40 px-3 py-3 text-base text-foreground outline-none ring-accent-soft/40 placeholder:text-foreground/40 focus:border-accent-soft focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    placeholder="Share where you're at and what you're building."
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <p className="text-[0.65rem] text-foreground/50">
                    Your information will be securely stored and we'll contact you soon.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/80 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px]"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


