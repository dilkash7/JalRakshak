"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, Menu, X, Droplet, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { useSession } from "@/lib/client-auth";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSession();
  const isStaffLoggedIn = Boolean(user);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Report a Leak", href: "/report" },
    { label: "Track Reports", href: "/track" },
    { label: "Save Water", href: "/save-water" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F9FAF9]/95 backdrop-blur-md border-b border-[#E8ECE9]/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Attribution */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm"
            >
              <path
                d="M20 4C20 4 8 18.5 8 26C8 32.6274 13.3726 38 20 38C26.6274 38 32 32.6274 32 26C32 18.5 20 4 20 4Z"
                fill="#0D382B"
              />
              <path
                d="M20 12C20 12 13 21 13 26C13 29.866 16.134 33 20 33C21.5 33 22.8 32.5 24 31.6C21.5 31.2 19.5 29 19.5 26.5C19.5 23.5 21 21 23 18.5L20 12Z"
                fill="#F9FAF9"
                opacity="0.95"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl text-[#0D241B] tracking-tight leading-tight">
              JalRakshak
            </span>
            <span className="text-[11px] font-medium text-[#6B7F75] leading-none">
              By Team Elevate
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors py-1 ${
                  isActive
                    ? "text-[#0D382B] font-semibold"
                    : "text-[#55695F] hover:text-[#0D382B]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-[#0D382B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons: Separate Staff Login & Admin Login */}
        <div className="hidden md:flex items-center gap-2.5">
          {isStaffLoggedIn ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 bg-[#0D382B] hover:bg-[#124838] text-white text-xs sm:text-[13px] font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Operations Console</span>
            </Link>
          ) : (
            <>
              {/* Field Officer Staff Login */}
              <Link
                href="/staff/login"
                className="inline-flex items-center gap-1.5 border border-[#BAC9C0] hover:border-[#0D382B] bg-white hover:bg-[#F3F7F5] text-[#0D241B] text-xs font-semibold px-3.5 py-2 rounded-full transition-all"
              >
                <User className="w-3.5 h-3.5 text-forest-800" />
                <span>Staff Login</span>
              </Link>

              {/* Master Administrator Login */}
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 bg-[#0D382B] hover:bg-[#124838] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm hover:shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-forest-850 hover:bg-forest-50 rounded-xl transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8ECE9] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-forest-50 text-forest-900 font-semibold"
                      : "text-sage-600 hover:bg-canvas-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E8ECE9] flex flex-col gap-2">
            {isStaffLoggedIn ? (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-forest-900 text-white text-sm font-semibold py-3 rounded-full transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Operations Console</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/staff/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border border-[#CBD7D0] bg-white text-forest-900 text-sm font-semibold py-2.5 rounded-full transition-colors"
                >
                  <User className="w-4 h-4 text-forest-800" />
                  <span>Field Officer Login</span>
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-forest-900 text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrator Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
