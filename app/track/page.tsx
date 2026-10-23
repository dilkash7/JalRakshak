"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Waves,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PublicReport, toPublicReport } from "@/lib/serializer";
import { clientStore } from "@/lib/client-store";

export default function TrackPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // Community feed state
  const [reports, setReports] = useState<PublicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search by Report ID
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();

    if (!clean) {
      setSearchError("Please enter a Report ID.");
      return;
    }

    if (!clean.startsWith("JR-") || clean.length < 8) {
      setSearchError("Valid Report IDs begin with 'JR-' (e.g. JR-7K9M3X8P2W).");
      return;
    }

    setSearchError(null);
    router.push(`/track/${clean}`);
  };

  // Fetch Community Reports Feed from Central Browser Store
  const fetchFeed = () => {
    setLoading(true);
    try {
      const { reports: allMatching, total } = clientStore.getReports({
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        city: cityFilter.trim() || undefined,
      });

      const limit = 9;
      const calculatedPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const pageReports = allMatching.slice(startIndex, startIndex + limit);

      // Serialize to PublicReport format to strip sensitive private contact data
      const serialized = pageReports.map((r) => toPublicReport(r as any));

      setReports(serialized);
      setTotalPages(calculatedPages);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch community reports from local store:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const unsubscribe = clientStore.subscribe(fetchFeed);
    return () => unsubscribe();
  }, [page, selectedStatus, selectedCategory]);

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFeed();
  };

  const statusTabs = [
    { id: "all", label: "All Reports" },
    { id: "submitted", label: "Submitted" },
    { id: "in_progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
  ];

  return (
    <div className="w-full bg-[#F9FAF9] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Primary Search Box */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-500 block">
            Public Tracking Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-850 tracking-tight leading-tight">
            Track Water Leak Resolutions
          </h1>
          <p className="text-sm sm:text-base text-sage-600 font-normal">
            Enter your unguessable Report ID to inspect real-time civic dispatch status, or explore recent community leak reports across neighborhoods.
          </p>

          {/* Primary ID Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="pt-4 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-sage-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  setSearchError(null);
                }}
                placeholder="Enter Report ID (e.g. JR-9K4M2X7P8W)"
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#C5D2CB] bg-white text-forest-850 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm font-mono uppercase"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto flex-shrink-0" withArrow>
              Lookup
            </Button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-600 font-medium">{searchError}</p>
          )}

          {/* Privacy Invariant Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-50 border border-forest-100 text-xs text-forest-900 mt-2">
            <Shield className="w-3.5 h-3.5 text-forest-800" />
            <span>Strict Privacy: Only general areas and public civic updates are shown.</span>
          </div>
        </div>

        {/* Community Reports Feed Section */}
        <div className="pt-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E8ECE9]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-forest-850">
                Recent Community Reports
              </h2>
              <p className="text-xs sm:text-sm text-sage-600">
                Showing {reports.length} of {totalCount} transparent civic reports
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedStatus(tab.id);
                    setPage(1);
                  }}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                    selectedStatus === tab.id
                      ? "bg-forest-900 text-white"
                      : "bg-white text-forest-850 border border-[#DCE4DF] hover:bg-forest-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & City Search Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-60 bg-white border border-[#DCE4DF] rounded-2xl px-4 py-2.5 text-xs text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
            >
              <option value="all">All Leak Categories</option>
              <option value="pipe_burst">Pipe Burst</option>
              <option value="street_leakage">Street Leakage</option>
              <option value="sewage_overflow">Sewage Overflow</option>
              <option value="meter_damage">Water Meter Damage</option>
              <option value="water_contamination">Contamination</option>
              <option value="valve_leak">Public Hydrant / Valve</option>
              <option value="other">Other</option>
            </select>

            <form onSubmit={handleCitySearch} className="w-full sm:w-auto flex-1 flex gap-2">
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Filter by city (e.g. New Delhi, Bengaluru)..."
                className="w-full bg-white border border-[#DCE4DF] rounded-2xl px-4 py-2.5 text-xs text-forest-850 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <button
                type="submit"
                className="bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold px-4 py-2.5 rounded-2xl border border-forest-200 transition-colors"
              >
                Filter
              </button>
            </form>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-sage-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-forest-900" />
              <p className="text-xs">Loading verified reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-[#E6ECE8] p-8 space-y-3">
              <Waves className="w-10 h-10 text-sage-400 mx-auto" />
              <h3 className="text-base font-bold text-forest-850">No reports found</h3>
              <p className="text-xs text-sage-600 max-w-sm mx-auto">
                No reports matched your selected filter criteria. Try clearing filters or submit a new leak report.
              </p>
              <Button href="/report" size="sm" withArrow className="mt-2">
                Report a Leak
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.reportId}
                  className="bg-white rounded-3xl border border-[#E6ECE8] p-6 shadow-sm hover:shadow-card transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Report ID and Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-100">
                        {report.reportId}
                      </span>
                      <Badge variant={report.status as any} dot>
                        {report.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Category Title */}
                    <div>
                      <h3 className="font-bold text-base text-forest-850 group-hover:text-forest-900 transition-colors capitalize">
                        {report.category.replace("_", " ")}
                      </h3>
                      <p className="text-xs text-sage-600 line-clamp-2 mt-1 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* General Location */}
                    <div className="flex items-center gap-1.5 text-xs text-sage-600 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-800 flex-shrink-0" />
                      <span className="truncate">{report.generalArea}</span>
                    </div>

                    {/* Public Resolution Highlight if Resolved */}
                    {report.publicResolutionSummary && (
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 leading-snug">
                        <span className="font-semibold block mb-0.5">Resolution:</span>
                        {report.publicResolutionSummary}
                      </div>
                    )}
                  </div>

                  {/* Footer: Date & Link */}
                  <div className="pt-4 border-t border-[#F0F4F2] flex items-center justify-between">
                    <span className="text-[11px] text-sage-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/track/${report.reportId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-forest-900 hover:text-forest-700 transition-colors"
                    >
                      <span>View Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-full border border-[#DCE4DF] bg-white text-xs font-semibold text-forest-850 disabled:opacity-40 hover:bg-forest-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-sage-600 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-full border border-[#DCE4DF] bg-white text-xs font-semibold text-forest-850 disabled:opacity-40 hover:bg-forest-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
