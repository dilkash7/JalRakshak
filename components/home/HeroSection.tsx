import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#F9FAF9] pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
      {/* Background Water Photograph Composition on the Right Half */}
      <div
        className="absolute top-0 right-0 w-full md:w-[62%] lg:w-[58%] h-full pointer-events-none select-none z-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.85) 30%, black 50%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.85) 30%, black 50%)",
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-water-droplet.jpg"
            alt="Water droplet falling from leaf into ripples"
            fill
            priority
            className="object-cover object-[76%_28%] sm:object-[78%_30%] lg:object-[78%_32%]"
          />

          {/* Left Edge Soft Gradient Fade */}
          <div className="absolute inset-y-0 left-0 w-32 sm:w-48 lg:w-72 bg-gradient-to-r from-[#F9FAF9] via-[#F9FAF9]/75 to-transparent z-10" />

          {/* Bottom Edge Soft Gradient Fade to blend with Statistics Cards */}
          <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 lg:h-44 bg-gradient-to-t from-[#F9FAF9] via-[#F9FAF9]/80 to-transparent z-10" />

          {/* Top Subtle Fade */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F9FAF9]/60 to-transparent z-10" />

          {/* Mobile Readability Gradient: Soft light wash over top text area on small screens */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAF9]/95 via-[#F9FAF9]/85 to-[#F9FAF9]/40 md:hidden z-10 pointer-events-none" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative Slogan Overlay — Upper Right Region (Appears exactly once) */}
        <div className="absolute top-1 right-4 sm:right-6 lg:right-10 z-20 hidden md:flex flex-col items-start select-none pointer-events-none text-left">
          <div className="w-5 h-[1.5px] bg-[#E2EDE6]/90 mb-2" />
          <span className="text-[11px] font-medium tracking-[0.24em] text-[#E2EDE6] uppercase leading-[1.4]">
            SAVE
          </span>
          <span className="text-[11px] font-medium tracking-[0.24em] text-[#E2EDE6] uppercase leading-[1.4]">
            WATER
          </span>
          <span className="text-[11px] font-medium tracking-[0.24em] text-[#E2EDE6] uppercase leading-[1.4]">
            SAVE
          </span>
          <span className="text-[11px] font-medium tracking-[0.24em] text-[#E2EDE6] uppercase leading-[1.4]">
            LIVES
          </span>
        </div>

        {/* Left Column: Headlines, Description, and Pill Buttons */}
        <div className="max-w-xl lg:max-w-2xl pt-4 sm:pt-6 lg:pt-8 pb-4">
          {/* Eyebrow */}
          <div className="mb-4 sm:mb-6">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-[#6B7F75]">
              CLEANER WATER &nbsp;·&nbsp; SAFER COMMUNITIES
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] tracking-tight leading-[1.08] mb-6">
            <span className="font-bold block text-[#0D241B]">Protect Water</span>
            <span className="font-light block text-[#2A4438]/85 mt-1 sm:mt-2">
              for a Better Tomorrow.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#55695F] max-w-xl leading-relaxed font-normal mb-8 sm:mb-10">
            JalRakshak is a community-driven platform to report water leakages, track
            their status, and create a water-secure future together.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Pill Button */}
            <Link
              href="/report"
              className="group inline-flex items-center gap-3.5 bg-[#0D382B] hover:bg-[#124838] text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <span>Report a Leak</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </span>
            </Link>

            {/* Secondary Outline Pill Button */}
            <Link
              href="/track"
              className="group inline-flex items-center gap-3 border border-[#BAC9C0] hover:border-[#0D382B] bg-white hover:bg-[#F3F7F5] text-[#0D241B] font-medium text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              <span>Track a Report</span>
              <ArrowRight className="w-4 h-4 text-[#0D241B] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
