import React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Droplet } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full bg-[#F9FAF9] min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-forest-50 border border-[#DCE4DF] flex items-center justify-center mx-auto text-forest-900 shadow-sm">
          <Droplet className="w-8 h-8 text-forest-850" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-sage-500">
            Error 404
          </span>
          <h1 className="text-3xl font-bold text-forest-850 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-sage-600 leading-relaxed">
            The page or report you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/track"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F7F5] border border-[#CBD7D0] text-forest-850 text-xs font-semibold px-6 py-3 rounded-full transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Track a Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
