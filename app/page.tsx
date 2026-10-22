import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section matching reference */}
      <HeroSection />

      {/* 2. 4-Card Statistics Metric Strip */}
      <StatsStrip />

      {/* 3. How It Works & Mission Card */}
      <HowItWorksSection />
    </div>
  );
}

