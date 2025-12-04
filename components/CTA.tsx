"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMotionPref } from "../hooks/useMotionPref";
import { Button } from "@/components/ui/button";
import { Send, UserPlus } from "lucide-react";
import { useMagnetic } from "../hooks/useMagnetic";
import { shouldReduceMotion } from "../lib/animations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CTA() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const pref = useMotionPref();
  const reduceMotion = pref === "reduce" || shouldReduceMotion();
  const enrollButtonRef = useMagnetic<HTMLDivElement>({ strength: 0.2, disabled: reduceMotion });
  const submitButtonRef = useMagnetic<HTMLDivElement>({ strength: 0.15, disabled: reduceMotion });
  
  // Check if we should show the form from URL parameter
  useEffect(() => {
    if (searchParams?.get("showEnrollForm") === "true") {
      setOpen(true);
      // Clean up URL
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    
    // Client-side email validation for better UX
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      setSubmitStatus("error");
      setErrorMessage("Email is required");
      setIsSubmitting(false);
      return;
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    const emailParts = trimmedEmail.split("@");
    
    if (emailParts.length !== 2) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    const [localPart, domain] = emailParts;
    
    // Validate local part
    if (!localPart || localPart.length === 0 || localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    // Validate domain
    if (!domain || domain.length === 0) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    const domainParts = domain.split(".");
    if (domainParts.length < 2) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address with a domain");
      setIsSubmitting(false);
      return;
    }
    
    // Check for double TLDs (e.g., .com.com, .gmail.com.com)
    const tld = domainParts[domainParts.length - 1];
    const secondLast = domainParts[domainParts.length - 2];
    
    // Check if the last two parts are the same (e.g., com.com)
    if (tld === secondLast) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    // Check for patterns like gmail.com.com (where domain has duplicate TLD)
    if (domainParts.length > 2) {
      // Check if any two consecutive parts are the same
      for (let i = 0; i < domainParts.length - 1; i++) {
        if (domainParts[i] === domainParts[i + 1]) {
          setSubmitStatus("error");
          setErrorMessage("Please enter a valid email address");
          setIsSubmitting(false);
          return;
        }
      }
    }
    
    // TLD must be at least 2 characters and only letters
    if (!/^[a-zA-Z]{2,}$/.test(tld)) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    // Final regex check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    const payload = {
      name: formData.get("name"),
      email: trimmedEmail,
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
      <motion.div ref={enrollButtonRef}>
        <Button
          type="button"
          onClick={() => {
            // Always redirect to login page - it will handle showing the form if Clerk isn't configured
            router.push("/login");
          }}
          className={cn(
            "rounded-full bg-accent px-5 py-2.5 text-label font-sans font-semibold uppercase tracking-[0.1em] text-background shadow-glow transition hover:bg-accent-soft focus-visible:ring-accent-soft/80",
            "h-auto min-h-[44px]"
          )}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Enroll my child
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "max-w-md rounded-2xl border border-white/12 bg-surface/90 p-4 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl max-h-[90vh] overflow-y-auto",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            pref === "reduce" && "data-[state=open]:animate-none data-[state=closed]:animate-none"
          )}
        >
          <DialogHeader>
            <p className="font-sans text-label uppercase tracking-[0.1em] text-accent-soft/70 mb-rhythm-2">
              Common Queries Answered
            </p>
            <DialogTitle
              id="cta-modal-title"
              className={cn(
                "mt-rhythm-2 font-display text-xl font-bold tracking-[-0.01em] text-foreground text-left"
              )}
            >
              How do I enroll my child?
            </DialogTitle>
          </DialogHeader>

          <form ref={formRef} className="space-y-rhythm-3" onSubmit={handleSubmit}>
            {/* Success Message */}
            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg bg-green-500/20 border border-green-500/40 px-4 py-3 text-body font-sans text-green-400"
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
                  className="rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-3 text-body font-sans text-red-400"
                >
                  ✗ {errorMessage || "Failed to submit enrollment. Please try again."}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <Label
                htmlFor="name"
                className={cn(
                  "block text-label font-sans font-medium uppercase tracking-[0.1em] text-foreground/60 mb-rhythm-1"
                )}
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={isSubmitting}
                autoComplete="name"
                className={cn(
                  "w-full rounded-lg border border-white/14 bg-background/40 px-3 py-3 text-body font-sans text-foreground ring-accent-soft/40 placeholder:text-foreground/40 focus:border-accent-soft focus:ring-2 touch-manipulation",
                  "h-auto"
                )}
                style={{ fontSize: "clamp(0.9375rem, 0.5vw + 0.75rem, 1.125rem)", lineHeight: "1.55" }}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className={cn(
                  "block text-label font-sans font-medium uppercase tracking-[0.1em] text-foreground/60 mb-rhythm-1"
                )}
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                autoComplete="email"
                inputMode="email"
                pattern="[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*"
                className={cn(
                  "w-full rounded-lg border border-white/14 bg-background/40 px-3 py-3 text-body font-sans text-foreground ring-accent-soft/40 placeholder:text-foreground/40 focus:border-accent-soft focus:ring-2 touch-manipulation",
                  "h-auto"
                )}
                style={{ fontSize: "clamp(0.9375rem, 0.5vw + 0.75rem, 1.125rem)", lineHeight: "1.55" }}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="context"
                className={cn(
                  "block text-label font-sans font-medium uppercase tracking-[0.1em] text-foreground/60 mb-rhythm-1"
                )}
              >
                Context
              </Label>
              <Textarea
                id="context"
                name="context"
                rows={4}
                disabled={isSubmitting}
                className={cn(
                  "w-full resize-none rounded-lg border border-white/14 bg-background/40 px-3 py-3 text-body font-sans text-foreground ring-accent-soft/40 placeholder:text-foreground/40 focus:border-accent-soft focus:ring-2 touch-manipulation",
                  "min-h-[auto]"
                )}
                style={{ fontSize: "clamp(0.9375rem, 0.5vw + 0.75rem, 1.125rem)", lineHeight: "1.55" }}
                placeholder="Share where you're at and what you're building."
              />
            </div>

            <div className="flex items-center justify-between gap-rhythm-2 pt-rhythm-1">
              <p className="text-label font-sans text-foreground/50">
                Your information will be securely stored and we'll contact you soon.
              </p>
              <motion.div ref={submitButtonRef}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "rounded-full bg-foreground px-5 py-2.5 text-label font-sans font-semibold uppercase tracking-[0.1em] text-background hover:bg-foreground/90 focus-visible:ring-accent-soft/80 touch-manipulation min-h-[44px]",
                    "h-auto"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
