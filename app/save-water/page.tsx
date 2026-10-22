"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Droplets,
  Calculator,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Home,
  Utensils,
  Sun,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SaveWaterPage() {
  // Calculator State
  const [householdSize, setHouseholdSize] = useState(4);
  const [hasAerators, setHasAerators] = useState(false);
  const [hasLowFlowShower, setHasLowFlowShower] = useState(false);
  const [fixedLeakingTaps, setFixedLeakingTaps] = useState(true);
  const [rainwaterHarvesting, setRainwaterHarvesting] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculate annual savings
  let annualSavings = 0;
  if (fixedLeakingTaps) annualSavings += 11000;
  if (hasAerators) annualSavings += householdSize * 4500;
  if (hasLowFlowShower) annualSavings += householdSize * 6200;
  if (rainwaterHarvesting) annualSavings += 18000;

  const faqs = [
    {
      q: "What is JalRakshak's operational role and how does triage work?",
      a: "JalRakshak is an independent community water conservation and monitoring platform developed by Team Elevate. It enables citizens to log pipeline leaks with taluk-level accuracy, auto-routes reports to assigned field officers, and provides transparent public status tracking from submission to repair.",
    },
    {
      q: "Why is a 10-character Report ID used instead of requiring user accounts?",
      a: "Requiring account registration creates friction during urgent civic reporting. JalRakshak generates an unguessable nanoid reference (e.g. JR-7K9M3X8P2W) with over 1.5 quadrillion combinations. This permits frictionless public tracking while preventing sequential enumeration attacks.",
    },
    {
      q: "Is my personal phone number or home address visible to the public?",
      a: "Never. All public responses pass strictly through our toPublicReport() serializer. The public tracker shows only general areas (e.g., landmark, taluk, and city), category, severity, and verified status updates. Your name, email, phone number, exact coordinates, and internal staff notes are never exposed.",
    },
    {
      q: "What should I do if a main burst is causing structural flooding or electrical hazard?",
      a: "Log a 'Critical' severity report on JalRakshak, and immediately contact your local municipal emergency helpline or local power utility to shut off electricity and isolate mains if water threatens electrical infrastructure.",
    },
    {
      q: "How is the 'Litres Saved' metric calculated?",
      a: "Litres saved are estimated using standard hydraulic loss benchmarks (pipe bursts ~500 L/hr, street leaks ~250 L/hr, meter leaks ~50 L/hr) multiplied by the elapsed duration between initial citizen reporting and verified repair resolution.",
    },
  ];

  return (
    <div className="w-full bg-[#F9FAF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-500 block">
            Conservation & Guidance
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-forest-850 tracking-tight leading-tight">
            Protect Freshwater at Home and in Community
          </h1>
          <p className="text-sm sm:text-base text-sage-600 font-normal">
            Practical strategies, silent leak detection guides, and an interactive calculator to quantify your household water preservation impact.
          </p>
        </div>

        {/* 1. Practical Conservation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#E6ECE8] p-7 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-forest-850">Bathroom Conservation</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-sage-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Install 1.5 GPM low-flow aerators on bathroom faucets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Replace flapper valves on running toilets to save 750 litres/day.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Keep showers under 5 minutes to conserve ~45 litres per wash.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6ECE8] p-7 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-forest-850">Kitchen & Cleaning</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-sage-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Run washing machines and dishwashers only on full loads.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Wash fruits and vegetables in a pan instead of under a running tap.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Reuse kitchen rinse water for balcony plants and flower pots.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6ECE8] p-7 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-forest-850">Outdoor & Community</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-sage-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Water gardens before 8 AM or after 6 PM to eliminate evaporation loss.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Use drip irrigation systems rather than surface sprinklers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Report neighborhood main pipe leaks on JalRakshak within 1 hour.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Interactive Water Savings Calculator */}
        <div id="calculator" className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-elevated">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  Interactive Calculator
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-forest-850 tracking-tight mt-1">
                  Quantify Your Household Water Savings
                </h2>
                <p className="text-xs sm:text-sm text-sage-600 mt-1">
                  Toggle your conservation upgrades to compute projected annual freshwater retention.
                </p>
              </div>

              {/* Household Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-forest-850">
                  <span>Household Residents:</span>
                  <span className="text-emerald-800 text-sm">{householdSize} People</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(parseInt(e.target.value, 10))}
                  className="w-full accent-forest-900 cursor-pointer"
                />
              </div>

              {/* Upgrade Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-forest-850">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#DCE4DF] hover:bg-forest-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={fixedLeakingTaps}
                    onChange={(e) => setFixedLeakingTaps(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-900"
                  />
                  <span>Fixed dripping taps & running toilets</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#DCE4DF] hover:bg-forest-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={hasAerators}
                    onChange={(e) => setHasAerators(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-900"
                  />
                  <span>Installed faucet aerators (all sinks)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#DCE4DF] hover:bg-forest-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={hasLowFlowShower}
                    onChange={(e) => setHasLowFlowShower(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-900"
                  />
                  <span>Low-flow eco showerheads</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#DCE4DF] hover:bg-forest-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={rainwaterHarvesting}
                    onChange={(e) => setRainwaterHarvesting(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-900"
                  />
                  <span>Rooftop rainwater harvesting barrel</span>
                </label>
              </div>
            </div>

            {/* Results Card */}
            <div className="w-full lg:w-80 rounded-3xl bg-forest-900 text-white p-7 text-center space-y-4 shadow-elevated flex-shrink-0">
              <span className="text-xs uppercase font-semibold tracking-wider text-forest-100 block">
                Estimated Annual Impact
              </span>
              <div>
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white block">
                  {annualSavings.toLocaleString()}
                </span>
                <span className="text-xs text-forest-200 uppercase tracking-widest mt-1 block">
                  Litres Conserved Yearly
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed pt-2 border-t border-forest-800">
                Equivalent to filling ~{Math.round(annualSavings / 20).toLocaleString()} standard water dispenser cans every year!
              </p>
            </div>
          </div>
        </div>

        {/* 3. 15-Minute Silent Leak Detection Test */}
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
              Diagnostic Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850">
              The 15-Minute Silent Leak Meter Test
            </h2>
            <p className="text-xs sm:text-sm text-sage-600">
              Over 10% of homes have undetected plumbing leaks losing up to 300 litres per day. Follow these steps to diagnose your premises:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {[
              {
                step: "1",
                title: "Turn Off All Water",
                desc: "Ensure washing machines, faucets, and reverse-osmosis purifiers are completely stopped.",
              },
              {
                step: "2",
                title: "Inspect Water Meter",
                desc: "Locate your utility meter and write down the exact digits and needle position.",
              },
              {
                step: "3",
                title: "Wait 15 Minutes",
                desc: "Do not use any toilets, sinks, or showers during this duration.",
              },
              {
                step: "4",
                title: "Recheck the Meter",
                desc: "If the reading dial moved even 1 litre, you have a hidden subterranean or cistern leak.",
              },
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-2xl bg-[#F9FAF9] border border-[#E8ECE9] space-y-2">
                <span className="w-7 h-7 rounded-full bg-forest-900 text-white font-bold text-xs flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="font-bold text-sm text-forest-850">{s.title}</h4>
                <p className="text-xs text-sage-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Frequently Asked Questions Accordion */}
        <div id="faq" className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#E8ECE9]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm sm:text-base font-bold text-forest-850 hover:text-forest-900 transition-colors py-1"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-sage-500 transition-transform duration-200 flex-shrink-0 ml-4 ${
                        isOpen ? "rotate-180 text-forest-900" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-sage-600 leading-relaxed pt-2 pb-1 pr-6 font-normal">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
