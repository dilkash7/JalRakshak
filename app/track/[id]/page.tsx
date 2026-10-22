"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Droplet,
  PhoneCall,
  Loader2,
  FileText,
  Activity,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PublicReport } from "@/lib/serializer";

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<PublicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Report not found. Please verify the 10-character Report ID."
              : "Failed to load report."
          );
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.report) {
          setReport(data.report);
        } else {
          throw new Error("Could not load report details.");
        }
      })
      .catch((err) => {
        setError(err.message || "An error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[#F9FAF9] text-sage-600 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-forest-900" />
        <p className="text-sm font-medium">Looking up report #{id}...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-forest-850">Report Lookup Failed</h1>
        <p className="text-sm text-sage-600 max-w-md mx-auto">{error}</p>
        <div className="pt-4 flex justify-center gap-3">
          <Button href="/track" variant="outline" withArrow>
            Return to Tracking Search
          </Button>
          <Button href="/report">Submit a New Report</Button>
        </div>
      </div>
    );
  }

  // Calculate Stepper State (1: Submitted, 2: Review, 3: In Progress, 4: Resolved)
  const getStepProgress = (status: string) => {
    switch (status) {
      case "submitted":
        return 1;
      case "under_review":
      case "investigating":
      case "repair_scheduled":
        return 2;
      case "in_progress":
        return 3;
      case "resolved":
        return 4;
      case "rejected":
        return 1;
      default:
        return 1;
    }
  };

  const currentStep = getStepProgress(report.status);

  const steps = [
    { num: 1, label: "Submitted", desc: "Logged in JalRakshak" },
    { num: 2, label: "Triage & Review", desc: "Assigned to civic dispatch" },
    { num: 3, label: "In Progress", desc: "Field repairs underway" },
    { num: 4, label: "Resolved", desc: "Pressure verified & sealed" },
  ];

  return (
    <div className="w-full bg-[#F9FAF9] min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sage-600 hover:text-forest-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Community Reports</span>
          </Link>
        </div>

        {/* Main Status Header Card */}
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8ECE9]">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
                Official Report Reference
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-2xl sm:text-3xl font-bold text-forest-900">
                  {report.reportId}
                </h1>
                <Badge variant={report.status as any} dot>
                  {report.status.replace("_", " ").toUpperCase()}
                </Badge>
                {report.status === "resolved" ? (
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Resolved in {report.elapsedDays || 1} day{(report.elapsedDays || 1) !== 1 ? "s" : ""}</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Open for {report.elapsedDays || 0} day{(report.elapsedDays || 0) !== 1 ? "s" : ""}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-sage-600 space-y-1">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sage-500" />
                <span>Logged on {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sage-500" />
                <span>Updated {new Date(report.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Visual Resolution Stepper */}
          <div className="py-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block mb-6">
              Resolution Progress
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {/* Connecting line on desktop */}
              <div className="hidden sm:block absolute top-4 left-8 right-8 h-1 bg-[#E8ECE9] z-0" />
              <div
                className="hidden sm:block absolute top-4 left-8 h-1 bg-forest-900 z-0 transition-all duration-500"
                style={{ width: `${((Math.min(currentStep, 4) - 1) / 3) * 80}%` }}
              />

              {steps.map((st) => {
                const isCompleted = currentStep >= st.num;
                const isCurrent = currentStep === st.num;

                return (
                  <div key={st.num} className="relative z-10 flex flex-col items-start sm:items-center text-left sm:text-center space-y-2">
                    <span
                      className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-forest-900 text-white shadow-sm ring-4 ring-forest-50"
                          : "bg-white border-2 border-[#DCE4DF] text-sage-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                    </span>
                    <div>
                      <span className={`text-xs font-bold block ${isCurrent ? "text-forest-900" : "text-forest-850"}`}>
                        {st.label}
                      </span>
                      <span className="text-[11px] text-sage-500 block leading-tight mt-0.5">
                        {st.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Public Resolution Highlight Banner (If Resolved) */}
          {report.status === "resolved" && report.publicResolutionSummary && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <span>Verified Public Resolution Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                {report.publicResolutionSummary}
              </p>
              {report.estimatedWaterSavedLitres ? (
                <div className="pt-2 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-emerald-700" />
                  <span>Estimated Freshwater Preserved: {report.estimatedWaterSavedLitres.toLocaleString()} Litres</span>
                </div>
              ) : null}
            </div>
          )}

          {/* Leak Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
                Leak Category
              </span>
              <span className="text-sm font-bold text-forest-850 capitalize">
                {report.category.replace("_", " ")}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
                General Area / Municipality
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-forest-850">
                <MapPin className="w-4 h-4 text-forest-800 flex-shrink-0" />
                <span>{report.generalArea}</span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
                Report Description
              </span>
              <p className="text-xs sm:text-sm text-sage-600 leading-relaxed bg-[#F9FAF9] p-4 rounded-2xl border border-[#E8ECE9]">
                {report.description}
              </p>
            </div>
          </div>

          {/* Attached Photographs (Public View) */}
          {report.photos && report.photos.length > 0 && (
            <div className="pt-4 border-t border-[#E8ECE9] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
                Citizen Incident Photographs ({report.photos.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {report.photos.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.secureUrl || p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl overflow-hidden aspect-square border border-[#DCE4DF] hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={p.secureUrl || p.url}
                      alt={`Report photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Verified Repair Completion Proof Photographs */}
          {report.resolutionPhotos && report.resolutionPhotos.length > 0 && (
            <div className="pt-4 border-t border-[#E8ECE9] space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Official Completion Proof Photographs ({report.resolutionPhotos.length})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {report.resolutionPhotos.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.secureUrl || p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl overflow-hidden aspect-square border-2 border-emerald-400 hover:opacity-90 transition-opacity relative group"
                  >
                    <img
                      src={p.secureUrl || p.url}
                      alt={`Resolution proof photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 right-1.5 bg-emerald-900/90 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Proof #{idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Public Status History Log */}
          {report.statusHistory && report.statusHistory.length > 0 && (
            <div className="pt-4 border-t border-[#E8ECE9] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-500 block">
                Public Activity Timeline
              </span>
              <div className="space-y-3">
                {report.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-sage-600">
                    <div className="w-2 h-2 rounded-full bg-forest-800 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-forest-850 capitalize">
                        Status transitioned to {h.to.replace("_", " ")}
                      </span>
                      <span className="text-sage-400 ml-2">
                        {new Date(h.at).toLocaleDateString()} at {new Date(h.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {h.note && <p className="text-[11px] text-sage-600 mt-0.5">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact & Invariant Footer */}
        <div className="rounded-2xl bg-forest-50 border border-forest-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest-900">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-forest-800 flex-shrink-0" />
            <span>Experiencing severe local flooding or hazard? Contact your local civic ward office or municipal emergency line.</span>
          </div>
          <div className="flex items-center gap-1.5 text-sage-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Privacy Guarded • Personal Data Stripped</span>
          </div>
        </div>
      </div>
    </div>
  );
}
