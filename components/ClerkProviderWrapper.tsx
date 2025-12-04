"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only render ClerkProvider if publishable key is available
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    // Return children without ClerkProvider if keys aren't configured
    return <>{children}</>;
  }
  
  return <ClerkProvider>{children}</ClerkProvider>;
}

