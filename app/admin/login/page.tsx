"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { clientAuth } from "@/lib/client-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = clientAuth.login(email.trim(), password);
      if (!res.success) {
        throw new Error(res.error || "Login failed");
      }

      if (res.user?.role !== "admin") {
        throw new Error("This portal is restricted to Municipal Administrators. Field officers should use Staff Login.");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during admin authentication.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdminCredentials = () => {
    setEmail("admin@jalrakshak.org");
    setPassword("JalRakshak@2026Admin!");
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
            href="/staff/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 transition-colors"
          >
            <span>Staff Portal Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-9 shadow-card space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white mx-auto flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-forest-850 tracking-tight">
              Administrator Login
            </h1>
            <p className="text-xs text-sage-600">
              Direct access for municipal system administrators & triage managers.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* DEMO ADMINISTRATOR CREDENTIALS CALLOUT */}
          <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DCE4DF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-forest-800" />
                <span>Demo Admin Credentials</span>
              </span>
              <button
                type="button"
                onClick={fillDemoAdminCredentials}
                className="text-[11px] font-bold text-forest-900 hover:text-forest-700 bg-white px-2.5 py-1 rounded-full border border-forest-300 hover:bg-forest-50 transition-colors shadow-2xs"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-xs space-y-1 font-mono text-forest-900 bg-white/70 p-2.5 rounded-xl border border-[#E0E7E2]">
              <div className="flex justify-between">
                <span className="text-sage-500 font-sans text-[11px]">Email:</span>
                <span className="font-semibold select-all">admin@jalrakshak.org</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-500 font-sans text-[11px]">Password:</span>
                <span className="font-semibold select-all">JalRakshak@2026Admin!</span>
              </div>
            </div>
            <p className="text-[10px] text-sage-500 leading-normal">
              Pre-configured administrator account for evaluation. Authenticate below to enter the master console.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Administrator Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jalrakshak.org"
              icon={<Mail className="w-4 h-4" />}
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
              Authenticate & Enter Admin Dashboard
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-[#E8ECE9]">
            <Link
              href="/staff/login"
              className="text-xs text-forest-800 hover:text-forest-950 font-semibold inline-flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Are you a Taluk Field Officer? Go to Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
