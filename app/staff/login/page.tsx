"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Lock,
  User,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function StaffLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Staff authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during staff login.");
    } finally {
      setLoading(false);
    }
  };

  const fillOfficerCredentials = (badgeId: string) => {
    setIdentifier(badgeId);
    setPassword("JalRakshak@2026Staff!");
    setError(null);
  };

  return (
    <div className="w-full bg-[#F9FAF9] min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-600 hover:text-forest-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Homepage</span>
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Admin Login</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-9 shadow-card space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white mx-auto flex items-center justify-center shadow-sm">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-forest-850 tracking-tight">
              Taluk Field Officer Portal
            </h1>
            <p className="text-xs text-sage-600">
              Access your assigned taluk leak queue, update dispatch statuses, and log repair proof.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* DEMO FIELD OFFICER CREDENTIALS CALLOUT */}
          <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DCE4DF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-forest-800" />
                <span>Working Demo Field Officer Accounts</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                Ready to Test
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillOfficerCredentials("STF-PUTTUR-01")}
                className="text-left p-2.5 rounded-xl border border-[#DCE4DF] bg-white hover:bg-forest-50/70 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-900">Ramesh Bhat</span>
                  <span className="text-[10px] font-semibold text-forest-700 bg-forest-50 px-1.5 py-0.5 rounded">
                    Fill
                  </span>
                </div>
                <div className="text-[11px] font-mono text-sage-500 mt-0.5">
                  ID: STF-PUTTUR-01
                </div>
                <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>Puttur Taluk</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillOfficerCredentials("STF-MNG-01")}
                className="text-left p-2.5 rounded-xl border border-[#DCE4DF] bg-white hover:bg-forest-50/70 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-900">Sunil Kumar</span>
                  <span className="text-[10px] font-semibold text-forest-700 bg-forest-50 px-1.5 py-0.5 rounded">
                    Fill
                  </span>
                </div>
                <div className="text-[11px] font-mono text-sage-500 mt-0.5">
                  ID: STF-MNG-01
                </div>
                <div className="text-[10px] text-cyan-700 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>Mangaluru Taluk</span>
                </div>
              </button>
            </div>

            <div className="text-[11px] font-mono text-forest-900 bg-white/70 p-2 rounded-xl border border-[#E0E7E2] flex items-center justify-between">
              <span className="text-sage-500 font-sans text-[11px]">Demo Password:</span>
              <span className="font-semibold select-all">JalRakshak@2026Staff!</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Staff Badge ID or Official Email"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. STF-PUTTUR-01 or staff.puttur@jalrakshak.org"
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              icon={<Lock className="w-4 h-4" />}
            />

            <Button type="submit" isLoading={loading} className="w-full mt-2" withArrow>
              Authenticate & Open Staff Dashboard
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-[#E8ECE9]">
            <Link
              href="/admin/login"
              className="text-xs text-forest-800 hover:text-forest-950 font-semibold inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Municipal System Administrator? Enter Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
