import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JalRakshak — Smart Water Conservation & Leak Reporting System",
  description:
    "Community-driven platform by Team Elevate to report water leakages, track civic resolutions in real-time, and preserve freshwater resources.",
  keywords: [
    "JalRakshak",
    "Water Conservation",
    "Leak Reporting",
    "Smart Water",
    "Team Elevate",
    "Civic Water",
  ],
  authors: [{ name: "Team Elevate" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#F9FAF9] text-forest-850 antialiased selection:bg-forest-900 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
