import React from "react";
import Link from "next/link";
import { Droplet, Heart, Shield, PhoneCall, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11231B] text-[#D8ECE3] pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-forest-800">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-forest-900 flex items-center justify-center border border-forest-700">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4C20 4 8 18.5 8 26C8 32.6274 13.3726 38 20 38C26.6274 38 32 32.6274 32 26C32 18.5 20 4 20 4Z"
                    fill="#42A887"
                  />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">JalRakshak</span>
                <p className="text-xs text-forest-200">By Team Elevate</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-forest-200/80">
              Community-driven platform to report water leakages, track civic resolutions, and
              conserve freshwater resources across municipal neighborhoods.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-forest-200/90">
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Report a Leak
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Report Status
                </Link>
              </li>
              <li>
                <Link href="/save-water" className="hover:text-white transition-colors">
                  Water Conservation Tips
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Team Elevate
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Resources & Privacy
            </h4>
            <ul className="space-y-2.5 text-xs text-forest-200/90">
              <li>
                <Link href="/save-water#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/save-water#calculator" className="hover:text-white transition-colors">
                  Water Savings Calculator
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-forest-100">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Privacy-Safe Public Serializer
                </span>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Staff & Field Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Water Support & Emergency Notice */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Civic Escalation Notice
            </h4>
            <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Urgent Pipeline Break?</span>
              </div>
              <p className="text-[11px] text-forest-200/80 leading-snug">
                For major arterial pipeline ruptures causing flooding or hazard, report here for local field tracking and notify your local ward office immediately.
              </p>
              <p className="text-[11px] font-medium text-emerald-300">
                Civic Ward & Taluk Escalation
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-200/60 gap-4">
          <p>© {new Date().getFullYear()} JalRakshak • Developed by Team Elevate.</p>
          <p className="flex items-center gap-1">
            Built for cleaner water & safer communities.
          </p>
        </div>
      </div>
    </footer>
  );
};
