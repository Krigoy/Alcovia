"use client";

import { ClerkProvider } from "@clerk/nextjs";

// NEXT_PUBLIC_* values are inlined at build time, so the server and the browser
// agree on whether the key exists. Rendering the provider straight away avoids
// unmounting and remounting the whole app after hydration.
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!publishableKey) {
    // Clerk isn't configured: render the site without authentication.
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
