import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, Search, Leaf, ArrowRight } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: 1,
      icon: <FileText className="w-5 h-5 text-[#0D382B]" />,
      title: "Report a Leak",
      description: "Share details with location, category and a photo.",
      href: "/report",
    },
    {
      num: 2,
      icon: <Search className="w-5 h-5 text-[#0D382B]" />,
      title: "Track the Status",
      description: "Use your report ID to check real-time updates.",
      href: "/track",
    },
    {
      num: 3,
      icon: <Leaf className="w-5 h-5 text-[#0D382B]" />,
      title: "Help Conserve",
      description: "Support faster resolutions and a water-secure future.",
      href: "/save-water",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#F9FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Heading and 3 Steps */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Header */}
            <div className="mb-8 lg:mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B7F75] block mb-2">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0D241B] tracking-tight leading-[1.12]">
                A simple way <br className="hidden sm:inline" />
                to make a big difference.
              </h2>
            </div>

            {/* 3 Step Process with Connecting Line */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 relative pt-2">
              {/* Connecting line on desktop behind icons */}
              <div className="hidden sm:block absolute top-[26px] left-12 right-12 h-[1px] bg-[#DDE5E0] z-0 pointer-events-none" />

              {steps.map((step) => (
                <div key={step.num} className="relative z-10 flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    {/* Step Number Circle */}
                    <span className="w-6 h-6 rounded-full bg-[#0D382B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                      {step.num}
                    </span>

                    {/* Circular Icon Container matching reference */}
                    <div className="w-12 h-12 rounded-full bg-[#EAF2EC] flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Title & Description */}
                  <div className="pt-1">
                    <h3 className="font-bold text-base text-[#0D241B] leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#55695F] leading-relaxed mt-1 font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mission Card matching reference */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[340px] h-full flex flex-col justify-between p-7 sm:p-9 text-white shadow-lg group">
              {/* Forest-and-river photograph */}
              <Image
                src="/images/mission-forest-river.jpg"
                alt="Winding river through dense lush green forest canopy"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark Green Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061F17]/95 via-[#0D382B]/85 to-[#0D382B]/60" />

              {/* Mission Text (Single Instance) */}
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D2E2D8] flex items-center gap-2">
                  <span className="w-5 h-[1.5px] bg-[#D2E2D8]" />
                  OUR MISSION
                </span>
                <h3 className="text-2xl sm:text-[30px] font-bold text-white tracking-tight leading-tight pt-1">
                  Every Drop <br />
                  Creates Change.
                </h3>
                <p className="text-xs sm:text-[13px] text-[#D8E6DE] max-w-sm leading-relaxed pt-1 font-normal">
                  Cleaner cities, healthier communities and a more sustainable tomorrow.
                </p>
              </div>

              {/* Circular Arrow Button */}
              <div className="relative z-10 pt-6">
                <Link
                  href="/about"
                  className="w-11 h-11 rounded-full bg-white hover:bg-[#F3F7F5] flex items-center justify-center transition-transform hover:scale-105 shadow-md group/btn"
                  aria-label="Learn more about our mission"
                >
                  <ArrowRight className="w-4 h-4 text-[#0D382B] transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
