import React from "react";
import Link from "next/link";
import { Droplet, Shield, Award, Users, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About JalRakshak — By Team Elevate",
  description:
    "Learn about Team Elevate's mission to protect urban freshwater resources through real-time leak reporting and civic accountability.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F9FAF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-500 block">
            About Team Elevate
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-forest-850 tracking-tight leading-tight">
            Protecting Urban Water Through Civic Technology
          </h1>
          <p className="text-sm sm:text-base text-sage-600 font-normal">
            JalRakshak was conceived and built by Team Elevate to bridge the critical gap between citizens on the ground and civic repair authorities.
          </p>
        </div>

        {/* The Problem & Our Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-3xl border border-[#E6ECE8] p-8 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                The Urban Challenge
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-forest-850">
                Up to 40% of Treated Water is Lost in Transit
              </h2>
              <p className="text-xs sm:text-sm text-sage-600 leading-relaxed font-normal">
                Municipal distribution pipelines frequently suffer underground joint ruptures, cracked service lines, and unclosed hydrant valves. Because reporting relies on phone helplines with long delays, leaks persist for days, causing millions of litres of potable water loss and road erosion.
              </p>
            </div>
          </div>

          <div className="bg-forest-900 text-white rounded-3xl p-8 shadow-elevated space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest-200">
                The Elevate Solution
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Frictionless Citizen Reporting & Real-Time Tracking
              </h2>
              <p className="text-xs sm:text-sm text-forest-100/90 leading-relaxed font-normal">
                JalRakshak gives every resident the ability to report a leak in 60 seconds with GPS and photographic evidence. Transparent public tracking with unguessable reference codes keeps everyone informed, while protecting citizen privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Team Elevate Core Pillars */}
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-8 sm:p-12 shadow-card space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              Guiding Principles
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-forest-850">
              Built on Transparency & Security
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F9FAF9] border border-[#E8ECE9] space-y-2">
              <Shield className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-sm text-forest-850">Strict Privacy Invariant</h4>
              <p className="text-xs text-sage-600 leading-relaxed">
                All public queries pass through a single allowlist serializer. Reporter phone numbers, names, and internal notes are never exposed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9FAF9] border border-[#E8ECE9] space-y-2">
              <Droplet className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-sm text-forest-850">Jurisdiction Triage</h4>
              <p className="text-xs text-sage-600 leading-relaxed">
                Reports are deterministically mapped by state, district, and taluk to designated field staff, ensuring accountable ownership.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9FAF9] border border-[#E8ECE9] space-y-2">
              <Users className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-sm text-forest-850">Community Transparency</h4>
              <p className="text-xs text-sage-600 leading-relaxed">
                Clean water is a shared civic responsibility. By logging leaks early, citizens protect local freshwater reservoirs for everyone.
              </p>
            </div>
          </div>

          {/* Prototype Disclosure Card & Browser Storage Notice */}
          <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DCE4DF] text-xs text-forest-900 space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] text-forest-800">
              Technology Demonstration & Browser Storage Scope
            </div>
            <p className="text-sage-600 leading-relaxed">
              JalRakshak is an advanced civic prototype created by Team Elevate. It models complete end-to-end citizen reporting, automated taluk jurisdiction matching, and staff triage with zero paid external database dependencies.
            </p>
            <div className="pt-1 text-[11px] text-sage-600 space-y-1">
              <p>• <strong>Browser-Origin Storage:</strong> Records are stored in your browser&apos;s localStorage, and uploaded photographs are stored in high-capacity IndexedDB.</p>
              <p>• <strong>Device Isolation:</strong> Different devices and separate browser profiles maintain independent local stores.</p>
              <p>• <strong>Data Clearing:</strong> Clearing browser cache or site data will erase local demonstration records and custom photos; you can use the in-app &quot;Reset Demo Data&quot; button anytime to restore clean baseline seeds.</p>
              <p>• <strong>Vercel Deployment:</strong> Localhost data does not automatically transfer to your deployed Vercel domain; each deployment origin initializes with standard competition demonstration data.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="text-xl font-bold text-forest-850">Ready to help conserve water?</h3>
          <div className="flex justify-center gap-4">
            <Button href="/report" withArrow>
              Report a Leak
            </Button>
            <Button variant="outline" href="/track">
              Track Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
