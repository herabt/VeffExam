import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Topbar } from "@/components/Topbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vefforitun Exam Prep",
  description: "Study guides, glossaries, and interactive practice exams for Web Programming II",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
