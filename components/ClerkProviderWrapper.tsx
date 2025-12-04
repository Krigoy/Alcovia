"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [publishableKey, setPublishableKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    // Get key from environment (available on client in Next.js)
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    setPublishableKey(key);
  }, []);

  // During SSR or before mount, render children without ClerkProvider
  if (!mounted) {
    return <>{children}</>;
  }

  // Only render ClerkProvider if publishable key is available
  if (!publishableKey) {
    // Return children without ClerkProvider if keys aren't configured
    return <>{children}</>;
  }
  
  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}

