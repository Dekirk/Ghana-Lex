import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GhanaLex AI — AI-Powered Legal Research & Case Management",
  description:
    "GhanaLex AI is a proposed legal-research and case-management platform for the Ghanaian legal fraternity — lawyers, litigants, law firms and judges — with a public AI search engine, secure client portal, case tracking, reminders and billing.",
  keywords: [
    "GhanaLex AI",
    "Ghana legal research",
    "case management Ghana",
    "AI legal assistant",
    "Ghana Bar Association",
    "legal tech Africa",
  ],
  authors: [{ name: "GhanaLex AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "GhanaLex AI",
    description: "AI-powered legal research & case management for Ghana.",
    siteName: "GhanaLex AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
