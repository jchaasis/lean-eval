import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EvaluationProvider } from "@/contexts/evaluation-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LeanEval - Validate your startup idea with AI-powered Lean Startup analysis",
  description: "Rapidly validate early-stage startup ideas using Lean Startup principles",
};

/**
 * Root layout component
 * Provides global styles, font configuration, and evaluation context
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <EvaluationProvider>{children}</EvaluationProvider>
      </body>
    </html>
  );
}

