"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Camera,
  MessageSquare,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  Check,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export default function AdminReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [report, setReport] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mutation form state
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [assignedStaffUserId, setAssignedStaffUserId] = useState("");
  const [assignedStaffName, setAssignedStaffName] = useState("");
  const [publicResolutionSummary, setPublicResolutionSummary] = useState("");
  const [waterSaved, setWaterSaved] = useState<number>(0);
  const [resolutionPhotos, setResolutionPhotos] = useState<Array<{ publicId: string; url: string; secureUrl: string }>>([]);
  const [uploadingProof, setUploadingProof] = useState(false);

  // Available staff list (for Admin assignment)
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);

  // Internal note state
  const [newInternalNote, setNewInternalNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    // Check auth
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthenticated");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
          loadReport();
          if (data.user.role === "admin") {
            loadStaff();
          }
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [id]);

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (data.success && Array.isArray(data.staff)) {
        setAvailableStaff(data.staff);
      }
    } catch (err) {
      console.warn("Could not load staff list:", err);
    }
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${id}`);
      if (!res.ok) throw new Error("Failed to load report");
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
        setNewStatus(data.report.status);
        setAssignedStaffUserId(data.report.assignedTo?.userId || "");
        setAssignedStaffName(data.report.assignedTo?.name || "");
        setPublicResolutionSummary(data.report.publicResolutionSummary || "");
        setWaterSaved(data.report.estimatedWaterSavedLitres || 0);
        setResolutionPhotos(data.report.resolutionPhotos || []);
      }
    } catch (err: any) {
      setError(err.message || "Could not load report");
    } finally {
      setLoading(false);
    }
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingProof(true);
    try {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setResolutionPhotos((prev) => [
          ...prev,
          {
            publicId: `proof-${Date.now()}`,
            url: result,
            secureUrl: result,
          },
        ]);
        setUploadingProof(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingProof(false);
    }
  };

  const removeProofPhoto = (index: number) => {
    setResolutionPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const payload: any = {
        status: newStatus,
        note: statusNote.trim() || undefined,
        publicResolutionSummary: publicResolutionSummary.trim() || undefined,
        estimatedWaterSavedLitres: Number(waterSaved) || 0,
        resolutionPhotos,
      };

      if (currentUser?.role === "admin") {
        if (assignedStaffUserId) {
          const selected = availableStaff.find((s) => s._id === assignedStaffUserId);
          payload.assignedTo = {
            userId: assignedStaffUserId,
            name: selected ? selected.name : assignedStaffName.trim(),
          };
        } else if (assignedStaffName.trim()) {
          payload.assignedTo = {
            userId: `staff-${Date.now()}`,
            name: assignedStaffName.trim(),
          };
        }
      }

      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update report");

      setReport(data.report);
      setStatusNote("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save updates");
    } finally {
      setSaving(false);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNote: newInternalNote.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add internal note");

      setReport(data.report);
      setNewInternalNote("");
    } catch (err: any) {
      setError(err.message || "Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F9FAF9]">
        <Loader2 className="w-8 h-8 animate-spin text-forest-900" />
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-forest-850">Report not found</h2>
        <Button href="/admin">Return to Dashboard</Button>
      </div>
    );
  }

  const getElapsedTurnaround = () => {
    if (!report) return { label: "", subtext: "", isResolved: false };
    const start = new Date(report.createdAt).getTime();
    const end = report.resolvedAt ? new Date(report.resolvedAt).getTime() : Date.now();
    const diffMs = Math.max(0, end - start);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (report.status === "resolved") {
      return {
        label: `Resolved in ${days > 0 ? `${days}d ` : ""}${hours}h`,
        subtext: `Turnaround: ${days} days, ${hours} hours`,
        isResolved: true,
      };
    }
    return {
      label: `Open for ${days > 0 ? `${days}d ` : ""}${hours}h`,
      subtext: `Elapsed: ${days} days, ${hours} hours since report`,
      isResolved: false,
    };
  };

  const turnaround = getElapsedTurnaround();

  return (
    <div className="w-full bg-[#F9FAF9] min-h-screen py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-600 hover:text-forest-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard Queue</span>
          </Link>
          <span className="text-xs text-sage-500 font-mono">Logged in as {currentUser?.name}</span>
        </div>

        {/* Header Summary */}
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              Report Triage
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-forest-900">
                {report.reportId}
              </h1>
              <Badge variant={report.status} dot>
                {report.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge variant={report.severity}>
                {report.severity.toUpperCase()}
              </Badge>
              {/* Turnaround / Elapsed Time Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  turnaround.isResolved
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                    : "bg-amber-50 text-amber-900 border-amber-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{turnaround.label}</span>
              </div>
            </div>
            <p className="text-xs text-sage-600 capitalize">
              {report.category.replace("_", " ")} • Reported on {new Date(report.createdAt).toLocaleString()}
              {report.resolvedAt && ` • Resolved on ${new Date(report.resolvedAt).toLocaleString()}`}
            </p>
          </div>

          <Link
            href={`/track/${report.reportId}`}
            target="_blank"
            className="text-xs font-semibold text-forest-850 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
          >
            <span>Preview Public View</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Report status and dispatch details saved successfully!</span>
          </div>
        )}

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Report Details & Reporter Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Location & Details Card */}
            <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 shadow-card space-y-4">
              <h3 className="font-bold text-base text-forest-850 border-b border-[#E8ECE9] pb-3">
                Incident Location & Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 p-3 rounded-2xl bg-[#F7FAF8] border border-[#E0E8E3]">
                  <span className="text-[11px] text-sage-600 uppercase tracking-wider font-semibold block">
                    Administrative Jurisdiction
                  </span>
                  <span className="font-bold text-forest-900 block mt-0.5 text-xs sm:text-sm">
                    {report.location?.taluk ? `${report.location.taluk} Taluk` : "Unassigned Taluk"},{" "}
                    {report.location?.district || "Dakshina Kannada"},{" "}
                    {report.location?.state || "Karnataka"}
                  </span>
                </div>
                <div>
                  <span className="text-sage-500 uppercase tracking-wider block">Street Address</span>
                  <span className="font-semibold text-forest-850 block mt-0.5">{report.location?.address}</span>
                </div>
                <div>
                  <span className="text-sage-500 uppercase tracking-wider block">Landmark</span>
                  <span className="font-semibold text-forest-850 block mt-0.5">{report.location?.landmark || "—"}</span>
                </div>
                <div>
                  <span className="text-sage-500 uppercase tracking-wider block">City / Locality</span>
                  <span className="font-semibold text-forest-850 block mt-0.5">{report.location?.city}</span>
                </div>
                <div>
                  <span className="text-sage-500 uppercase tracking-wider block">Postal Code</span>
                  <span className="font-semibold text-forest-850 block mt-0.5">{report.location?.postalCode || "—"}</span>
                </div>
                {report.location?.coordinates && (
                  <div className="sm:col-span-2">
                    <span className="text-sage-500 uppercase tracking-wider block">GPS Coordinates</span>
                    <span className="font-mono text-emerald-800 font-semibold block mt-0.5">
                      Lat: {report.location.coordinates.lat}, Lng: {report.location.coordinates.lng}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8ECE9]">
                <span className="text-xs text-sage-500 uppercase tracking-wider block mb-1">
                  Citizen Description
                </span>
                <p className="text-xs text-sage-700 leading-relaxed bg-[#F9FAF9] p-3.5 rounded-2xl border border-[#E8ECE9]">
                  {report.description}
                </p>
              </div>

              {/* Citizen Photos */}
              {report.photos && report.photos.length > 0 && (
                <div className="pt-3 border-t border-[#E8ECE9] space-y-2">
                  <span className="text-xs text-sage-500 uppercase tracking-wider block">
                    Citizen Incident Photographs ({report.photos.length})
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {report.photos.map((p: any, idx: number) => (
                      <a key={idx} href={p.secureUrl || p.url} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden aspect-square border border-[#DCE4DF]">
                        <img src={p.secureUrl || p.url} alt="Leak" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Field Completion Proof Photos */}
              {report.resolutionPhotos && report.resolutionPhotos.length > 0 && (
                <div className="pt-4 border-t border-[#E8ECE9] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Verified Field Completion Proof ({report.resolutionPhotos.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {report.resolutionPhotos.map((p: any, idx: number) => (
                      <a
                        key={idx}
                        href={p.secureUrl || p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl overflow-hidden aspect-square border-2 border-emerald-300 relative group"
                      >
                        <img
                          src={p.secureUrl || p.url}
                          alt="Resolution Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-emerald-900/80 text-white text-[9px] px-1 rounded font-bold">
                          Proof #{idx + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reporter Contact Information (Staff Only) */}
            <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8ECE9] pb-3">
                <h3 className="font-bold text-base text-forest-850">
                  Reporter Contact Information
                </h3>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Staff Only (Protected)
                </span>
              </div>

              {report.reporter?.name || report.reporter?.email || report.reporter?.phone ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-sage-500 uppercase tracking-wider block">Reporter Name</span>
                    <span className="font-semibold text-forest-850 block mt-0.5">
                      {report.reporter.name || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sage-500 uppercase tracking-wider block">Phone Number</span>
                    <span className="font-semibold text-forest-850 block mt-0.5">
                      {report.reporter.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-sage-500 uppercase tracking-wider block">Email Address</span>
                    <span className="font-semibold text-forest-850 block mt-0.5">
                      {report.reporter.email || "Not provided"}
                    </span>
                  </div>
                  <div className="sm:col-span-2 text-sage-500">
                    Notifications: {report.reporter.notifyByEmail ? "Email alerts requested upon resolution" : "None requested"}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-sage-500 italic">
                  This report was submitted anonymously without contact information.
                </p>
              )}
            </div>

            {/* Internal Staff Notes Thread */}
            <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 shadow-card space-y-4">
              <h3 className="font-bold text-base text-forest-850 border-b border-[#E8ECE9] pb-3 flex items-center justify-between">
                <span>Internal Staff Notes</span>
                <span className="text-xs text-sage-500 font-normal">
                  {report.internalNotes?.length || 0} notes
                </span>
              </h3>

              <div className="space-y-3">
                {report.internalNotes && report.internalNotes.length > 0 ? (
                  report.internalNotes.map((note: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#F9FAF9] border border-[#E8ECE9] space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-sage-500">
                        <span className="font-bold text-forest-850">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-forest-900 leading-relaxed">{note.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-sage-500 italic">No internal staff notes yet.</p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddInternalNote} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={newInternalNote}
                  onChange={(e) => setNewInternalNote(e.target.value)}
                  placeholder="Append internal note (not visible to public)..."
                  className="flex-1 rounded-2xl border border-[#DCE4DF] px-4 py-2.5 text-xs text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <button
                  type="submit"
                  disabled={addingNote || !newInternalNote.trim()}
                  className="bg-forest-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl hover:bg-forest-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {addingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Add Note</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Status Mutation & Triage Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 shadow-card space-y-5 sticky top-24">
              <h3 className="font-bold text-base text-forest-850 border-b border-[#E8ECE9] pb-3">
                Triage & Status Mutation
              </h3>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                {/* Status Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5">
                    Update Report Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-2xl border border-[#DCE4DF] bg-white px-3.5 py-2.5 text-xs text-forest-850 font-medium focus:outline-none focus:ring-2 focus:ring-forest-800"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="investigating">Investigating</option>
                    <option value="repair_scheduled">Repair Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Status Change Note */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5">
                    Status Transition Note (Public Log)
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Field crew dispatched with 4-inch clamp..."
                    className="w-full rounded-2xl border border-[#DCE4DF] px-3.5 py-2.5 text-xs text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                {/* Assigned Staff (Admin Reassignment / Staff View) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5 flex items-center justify-between">
                    <span>Assigned Field Officer</span>
                    {currentUser?.role === "admin" && (
                      <span className="text-[10px] text-forest-800 font-bold uppercase bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                        Admin Reassign
                      </span>
                    )}
                  </label>

                  {currentUser?.role === "admin" ? (
                    <select
                      value={assignedStaffUserId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssignedStaffUserId(val);
                        const officer = availableStaff.find((s) => s._id === val);
                        setAssignedStaffName(officer ? officer.name : "");
                      }}
                      className="w-full rounded-2xl border border-[#DCE4DF] bg-white px-3.5 py-2.5 text-xs text-forest-850 font-medium focus:outline-none focus:ring-2 focus:ring-forest-800"
                    >
                      <option value="">— Unassigned (Place in Admin Queue) —</option>
                      {availableStaff.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name} ({staff.taluk} Taluk - {staff.staffId})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#DCE4DF] text-xs font-semibold text-forest-850 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{report.assignedTo?.name || "Unassigned"}</span>
                      <span className="ml-auto text-[10px] text-sage-500 font-normal">Jurisdiction locked</span>
                    </div>
                  )}
                </div>

                {/* Public Resolution Summary */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5">
                    Public Resolution Summary (Visible on Tracker)
                  </label>
                  <textarea
                    rows={3}
                    value={publicResolutionSummary}
                    onChange={(e) => setPublicResolutionSummary(e.target.value)}
                    placeholder="Explain the repair performed for public confirmation..."
                    className="w-full rounded-2xl border border-[#DCE4DF] px-3.5 py-2.5 text-xs text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                {/* Resolution Proof Completion Photos */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600">
                      Completion Photographs (Resolution Proof)
                    </label>
                    <span className="text-[10px] text-sage-500 font-medium">
                      {resolutionPhotos.length} attached
                    </span>
                  </div>

                  {resolutionPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {resolutionPhotos.map((photo, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-emerald-300 group">
                          <img
                            src={photo.secureUrl || photo.url}
                            alt="Resolution Proof"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeProofPhoto(idx)}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-rose-700 text-white rounded-full p-1 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {resolutionPhotos.length < 3 && (
                    <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-[#C5D4CB] hover:border-forest-900 bg-[#FAFBFB] hover:bg-forest-50/40 cursor-pointer transition-all text-xs font-semibold text-forest-900">
                      <Camera className="w-4 h-4 text-forest-800" />
                      <span>{uploadingProof ? "Processing photo..." : "Attach Resolution Photograph"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        disabled={uploadingProof}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-[10px] text-sage-500 mt-1">
                    Uploaded completion photographs become visible on the public citizen tracker as verified proof of repair.
                  </p>
                </div>

                {/* Estimated Water Saved */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5">
                    Estimated Freshwater Conserved (Litres)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={waterSaved}
                    onChange={(e) => setWaterSaved(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-2xl border border-[#DCE4DF] px-3.5 py-2.5 text-xs text-forest-850 font-bold focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <Button type="submit" isLoading={saving} className="w-full" withArrow>
                  Commit Status & Updates
                </Button>
              </form>
            </div>

            {/* Status History Timeline */}
            <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 shadow-card space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-sage-600 border-b border-[#E8ECE9] pb-2">
                Audit Timeline
              </h4>
              <div className="space-y-3">
                {report.statusHistory?.map((h: any, idx: number) => (
                  <div key={idx} className="text-xs text-sage-600 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-forest-850 capitalize">
                        {h.from} → {h.to}
                      </span>
                      <span className="text-[10px] text-sage-400">
                        {new Date(h.at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-sage-500">
                      By: {h.by} {h.note ? `• "${h.note}"` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
