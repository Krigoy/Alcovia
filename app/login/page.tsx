"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { LoginBackground } from "@/components/ui/LoginBackground";

// Use Clerk's SignIn component directly for better integration and Google OAuth support
const ClerkSignIn = dynamic(() => import("@clerk/nextjs").then((mod) => ({ default: mod.SignIn })), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to home if already signed in
  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/?showEnrollForm=true");
    }
  }, [isLoaded, user, router]);

  // Return a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-black tracking-[-0.02em] text-foreground mb-4 sm:text-5xl md:text-6xl">
              Welcome to Alcovia
            </h1>
            <p className="font-sans text-body text-foreground/60 sm:text-lg">
              Sign in to enroll your child
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12" style={{ background: "transparent" }}>
      {/* Animated Background with Fireflies and Lightning */}
      <LoginBackground />
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="font-display text-4xl font-black tracking-[-0.02em] text-foreground mb-4 sm:text-5xl md:text-6xl"
          >
            Welcome to Alcovia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-sans text-body text-foreground/60 sm:text-lg"
          >
            Sign in to enroll your child
          </motion.p>
        </motion.div>

        {/* Login Dialog - Centered */}
        {mounted && isLoaded && !user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center w-full"
          >
            <div className="w-full max-w-md px-4 sm:px-0">
              <ClerkSignIn
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "bg-surface/95 border border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.9)] rounded-2xl backdrop-blur-xl w-full",
                    headerTitle: "font-display font-bold text-foreground text-2xl sm:text-3xl",
                    headerSubtitle: "font-sans text-foreground/60 text-sm sm:text-base",
                    socialButtonsBlockButton:
                      "bg-background/40 border border-white/14 text-foreground hover:bg-background/60 font-sans text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-3.5",
                    formButtonPrimary:
                      "bg-accent hover:bg-accent-soft text-background font-sans font-semibold text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-3.5",
                    formFieldInput:
                      "bg-background/40 border-white/14 text-foreground font-sans text-sm sm:text-base px-4 py-3",
                    formFieldLabel: "font-sans text-foreground/80 text-xs sm:text-sm",
                    footerActionLink: "text-accent hover:text-accent-soft text-sm sm:text-base",
                    identityPreviewText: "font-sans text-foreground text-sm sm:text-base",
                    identityPreviewEditButton: "text-accent hover:text-accent-soft text-sm sm:text-base",
                    formButtonReset: "text-sm sm:text-base",
                    formResendCodeLink: "text-sm sm:text-base",
                    otpCodeFieldInput: "text-sm sm:text-base",
                  },
                }}
                routing="path"
                path="/login"
                signUpUrl="/sign-up"
                afterSignInUrl="/?showEnrollForm=true"
                afterSignUpUrl="/?showEnrollForm=true"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
