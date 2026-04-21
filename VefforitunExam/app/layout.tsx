import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/AppShell";
import { THEME_PREFLIGHT } from "@/lib/theme";
import "./globals.css";

const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Vefforitun Exam Prep", template: "%s · Vefforitun" },
  description: "Study guides, glossaries, and interactive practice exams for Web Programming II",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme-preflight" strategy="beforeInteractive">
          {THEME_PREFLIGHT}
        </Script>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
