"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get key from environment (available on client in Next.js)
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only render ClerkProvider if publishable key is available
  if (!publishableKey) {
    // Return children without ClerkProvider if keys aren't configured
    return <>{children}</>;
  }
  
  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}

