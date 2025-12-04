import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import {
  Space_Grotesk as DisplayFont,
  Inter as SansFont,
} from "next/font/google";
import { ClerkProviderWrapper } from "../components/ClerkProviderWrapper";
import { AppShell } from "../components/AppShell";

const display = DisplayFont({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = SansFont({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Alcovia — High-Performance Learning",
  description:
    "Alcovia is a premium, high-energy learning environment engineered for ambitious minds.",
  metadataBase: new URL("https://alcovia.life"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Alcovia — High-Performance Learning",
    description:
      "An immersive learning experience, inspired by the intensity and craft of elite motorsport.",
    url: "https://alcovia.life",
    siteName: "Alcovia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alcovia — High-Performance Learning",
    description:
      "An immersive learning experience, inspired by the intensity and craft of elite motorsport.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} dark`}>
      <body className="bg-background text-foreground antialiased">
        <ClerkProviderWrapper>
          <AppShell>{children}</AppShell>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
