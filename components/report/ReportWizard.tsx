"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  UploadCloud,
  X,
  Navigation,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { getStates, getDistricts, getTaluks, matchAddressToLgd, resolveOfflineLocation } from "@/lib/geo-data";
import { clientStore } from "@/lib/client-store";
import { savePhoto, deletePhoto } from "@/lib/photo-store";

const CATEGORIES = [
  { value: "pipe_burst", label: "Pipe Burst (High Pressure)", desc: "Sudden rupture of main distribution pipeline" },
  { value: "street_leakage", label: "Street / Sidewalk Leakage", desc: "Continuous surface water accumulation or pooling" },
  { value: "sewage_overflow", label: "Sewage / Drainage Overflow", desc: "Foul wastewater mixing or overflowing" },
  { value: "meter_damage", label: "Water Meter Damage / Leak", desc: "Cracked meter flange or leaking joint" },
  { value: "water_contamination", label: "Discolored / Contaminated Water", desc: "Turbidity, unusual odor, or sediment" },
  { value: "valve_leak", label: "Public Hydrant / Sluice Valve", desc: "Open or dripping street valve fixture" },
  { value: "other", label: "Other Water Loss Issue", desc: "Any other visible freshwater leakage" },
];

const SEVERITIES = [
  { value: "low", label: "Low", desc: "Slow droplet leak, minor pooling" },
  { value: "medium", label: "Medium", desc: "Steady trickle or continuous dampness" },
  { value: "high", label: "High", desc: "Substantial flow, gushing water" },
  { value: "critical", label: "Critical", desc: "Flooding, road damage, structural hazard" },
];

export const ReportWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geographic Cascading State
  const [stateName, setStateName] = useState("Karnataka");
  const [districtName, setDistrictName] = useState("Dakshina Kannada");
  const [talukName, setTalukName] = useState("Puttur");

  // Form State
  const [category, setCategory] = useState("pipe_burst");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Puttur");
  const [postalCode, setPostalCode] = useState("574201");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [detectedReview, setDetectedReview] = useState<{
    coords: { lat: number; lng: number };
    state: string;
    district: string;
    taluk: string;
    street?: string;
    landmark?: string;
    confidence: string;
    source: string;
  } | null>(null);

  const availableStates = getStates();
  const availableDistricts = getDistricts(stateName);
  const availableTaluks = getTaluks(stateName, districtName);

  const handleStateChange = (newState: string) => {
    setStateName(newState);
    const districts = getDistricts(newState);
    const nextDistrict = districts[0] || "";
    setDistrictName(nextDistrict);
    const taluks = getTaluks(newState, nextDistrict);
    const nextTaluk = taluks[0] || "";
    setTalukName(nextTaluk);
    setCity(nextTaluk);
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrictName(newDistrict);
    const taluks = getTaluks(stateName, newDistrict);
    const nextTaluk = taluks[0] || "";
    setTalukName(nextTaluk);
    setCity(nextTaluk);
  };

  const handleTalukChange = (newTaluk: string) => {
    setTalukName(newTaluk);
    setCity(newTaluk);
  };

  // Reporter State (Private)
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [notifyByEmail, setNotifyByEmail] = useState(false);

  // Photo uploads
  const [photos, setPhotos] = useState<Array<{ publicId: string; url: string; secureUrl: string }>>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Submission Result
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Geolocation Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage("Geolocation is not supported by your browser. Please select your jurisdiction manually.");
      return;
    }

    setGpsLoading(true);
    setGpsMessage("Requesting device coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setCoords({ lat, lng });

        setGpsMessage("Coordinates captured. Resolving administrative jurisdiction...");

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim with a 4.5s timeout
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { signal: controller.signal, headers: { Accept: "application/json" } }
          );
          clearTimeout(timer);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const matched = matchAddressToLgd({
              state: addr.state,
              county: addr.county,
              state_district: addr.state_district,
              district: addr.district,
              city: addr.city,
              town: addr.town,
              village: addr.village,
              suburb: addr.suburb,
              subdistrict: addr.subdistrict,
            });

            setStateName(matched.state);
            setDistrictName(matched.district);
            setTalukName(matched.taluk);
            setCity(addr.city || addr.town || addr.village || matched.taluk);

            const road = [addr.road, addr.pedestrian, addr.suburb].filter(Boolean).join(", ");
            if (road && !address) {
              setAddress(road);
            }
            if (addr.postcode && !postalCode) {
              setPostalCode(addr.postcode);
            }

            setDetectedReview({
              coords: { lat, lng },
              state: matched.state,
              district: matched.district,
              taluk: matched.taluk,
              street: road || undefined,
              confidence: matched.confidence,
              source: "Nominatim Reverse Geocoding",
            });
            setGpsMessage("Coordinates & approximate jurisdiction detected. Please review below.");
            setGpsLoading(false);
            return;
          }
        } catch {
          // Continue to offline resolver fallback
        }

        // Offline LGD resolver fallback
        const offline = resolveOfflineLocation(lat, lng);
        setStateName(offline.state);
        setDistrictName(offline.district);
        setTalukName(offline.taluk);
        setCity(offline.city);
        if (!address) setAddress(offline.address);
        if (!landmark && offline.landmark) setLandmark(offline.landmark);

        setDetectedReview({
          coords: { lat, lng },
          state: offline.state,
          district: offline.district,
          taluk: offline.taluk,
          street: offline.address,
          landmark: offline.landmark,
          confidence: "approximate",
          source: "Offline LGD Bounding Model",
        });
        setGpsMessage("Coordinates captured; area resolved via local LGD database.");
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsMessage("Location permission denied. Please select your State, District and Taluk manually.");
        } else {
          setGpsMessage("Could not determine precise location. Please select your jurisdiction manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearGps = () => {
    setCoords(null);
    setDetectedReview(null);
    setGpsMessage(null);
  };

  // Photo Upload Handler via Browser IndexedDB Store
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setError("Maximum 5 photographs allowed per report.");
      return;
    }

    setUploadingPhoto(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File exceeds maximum allowed size of 5 MB.");
        }

        const photoId = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const saved = await savePhoto(photoId, file, file.name);

        setPhotos((prev) => [
          ...prev,
          {
            publicId: saved.id,
            url: saved.url,
            secureUrl: saved.secureUrl,
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to store photograph in browser storage. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = async (index: number) => {
    const photo = photos[index];
    if (photo?.publicId) {
      await deletePhoto(photo.publicId);
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit Handler via Central Browser-Local Client Store
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate client-side idempotency key
      const idempotencyKey = crypto.randomUUID();

      const payload = {
        category,
        severity,
        description: description.trim(),
        location: {
          address: address.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim() || talukName,
          state: stateName,
          district: districtName,
          taluk: talukName,
          postalCode: postalCode.trim() || undefined,
          coordinates: coords || undefined,
        },
        reporter: {
          name: reporterName.trim() || undefined,
          email: reporterEmail.trim() || undefined,
          phone: reporterPhone.trim() || undefined,
          notifyByEmail,
        },
        photos,
        idempotencyKey,
      };

      // Save directly to the central browser-local store
      const result = clientStore.submitReport(payload as any);

      setSubmittedReportId(result.reportId);
      setStep(5); // Success step
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving the report.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (submittedReportId) {
      navigator.clipboard.writeText(submittedReportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Step Indicator (Steps 1 to 4) */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <span
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    step === s
                      ? "bg-forest-900 text-white"
                      : step > s
                      ? "bg-emerald-600 text-white"
                      : "bg-[#E6ECE8] text-sage-600"
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-forest-850">
                  {s === 1 && "Category"}
                  {s === 2 && "Location"}
                  {s === 3 && "Photos & Contact"}
                  {s === 4 && "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-[#E8ECE9] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-forest-900 h-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* STEP 1: CATEGORY & SEVERITY */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-sage-500 block mb-1">
              Step 1 of 4
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850 tracking-tight">
              What type of water leak did you spot?
            </h2>
            <p className="text-sm text-sage-600 mt-1">
              Selecting the right category helps civic teams bring the correct repair equipment.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  category === cat.value
                    ? "border-forest-900 bg-forest-50/60 ring-2 ring-forest-900/10"
                    : "border-[#E0E7E2] hover:border-forest-800 hover:bg-[#FAFBFB]"
                }`}
              >
                <div className="font-bold text-sm text-forest-850">{cat.label}</div>
                <div className="text-xs text-sage-600 mt-1">{cat.desc}</div>
              </button>
            ))}
          </div>

          {/* Severity Selector */}
          <div className="pt-4 border-t border-[#E8ECE9]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-3">
              Estimated Severity Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SEVERITIES.map((sev) => (
                <button
                  key={sev.value}
                  type="button"
                  onClick={() => setSeverity(sev.value as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    severity === sev.value
                      ? "border-forest-900 bg-forest-900 text-white font-bold"
                      : "border-[#E0E7E2] hover:border-forest-800 text-forest-850"
                  }`}
                >
                  <div className="text-xs font-semibold">{sev.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      severity === sev.value ? "text-white/80" : "text-sage-500"
                    }`}
                  >
                    {sev.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)} withArrow>
              Continue to Location
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION & DESCRIPTION */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-sage-500 block mb-1">
              Step 2 of 4
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850 tracking-tight">
              Where is the leakage located?
            </h2>
            <p className="text-sm text-sage-600 mt-1">
              Provide exact street details or use GPS detection so response teams can locate the breach quickly.
            </p>
          </div>

          {/* GPS Auto-detect Button */}
          <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-forest-900">
                <Navigation className="w-4 h-4 text-emerald-700" />
                <span>Instant GPS Coordinate Capture (Optional)</span>
              </div>
              <p className="text-xs text-sage-600 mt-0.5">
                {coords
                  ? `Coordinates locked: ${coords.lat}, ${coords.lng}`
                  : "Allow your browser to detect latitude and longitude automatically."}
              </p>
              {gpsMessage && (
                <p className="text-xs text-forest-800 font-medium mt-1">{gpsMessage}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {coords && (
                <button
                  type="button"
                  onClick={handleClearGps}
                  className="text-xs text-sage-600 hover:text-forest-900 underline px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gpsLoading}
                className="inline-flex items-center gap-2 bg-white hover:bg-forest-50 border border-forest-200 text-forest-900 text-xs font-semibold px-4 py-2 rounded-full transition-colors flex-shrink-0 shadow-sm"
              >
                {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-forest-800" /> : <MapPin className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{coords ? "Re-detect Location" : "Use My Location"}</span>
              </button>
            </div>
          </div>

          {/* Detected Location Review Card */}
          {detectedReview && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                        Auto-Detected Administrative Area
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        {detectedReview.confidence === "high" ? "High Confidence" : "Approximate Match"}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-mono">
                      GPS: {detectedReview.coords.lat}, {detectedReview.coords.lng} • Source: {detectedReview.source}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetectedReview(null)}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>

              {/* Detected Hierarchy Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 bg-white/90 rounded-xl border border-emerald-100 text-xs shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sage-500 block">Detected State</span>
                  <span className="font-bold text-forest-900">{detectedReview.state}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-sage-500 block">Detected District</span>
                  <span className="font-bold text-forest-900">{detectedReview.district}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-sage-500 block">Matched Taluk</span>
                  <span className="font-bold text-emerald-800">{detectedReview.taluk} Taluk</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-900 leading-relaxed bg-emerald-100/60 p-3 rounded-xl border border-emerald-200/80 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Location Review & Correction: </strong>
                  GPS and reverse lookup provide approximate municipal boundaries. The selectors below have been pre-filled with the detected jurisdiction. <strong>Please verify your taluk and street address below</strong>, and adjust manually if the result is incomplete.
                </div>
              </div>
            </div>
          )}

          {/* Cascading Jurisdiction Selection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAF8] border border-[#E0E8E3] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
                Administrative Jurisdiction (Auto-Routing)
              </span>
              <span className="text-[11px] text-sage-500 font-medium">
                Routes directly to active taluk field officer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-600 mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <select
                  value={stateName}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded-xl border border-[#D6E0DA] bg-white px-3 py-2 text-xs font-semibold text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
                >
                  {availableStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-600 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={districtName}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full rounded-xl border border-[#D6E0DA] bg-white px-3 py-2 text-xs font-semibold text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-600 mb-1">
                  Taluk / Sub-District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={talukName}
                  onChange={(e) => handleTalukChange(e.target.value)}
                  className="w-full rounded-xl border border-[#D6E0DA] bg-white px-3 py-2 text-xs font-semibold text-forest-850 focus:outline-none focus:ring-2 focus:ring-forest-800"
                >
                  {availableTaluks.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Street Address / Road Name / Locality"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 74 Market Road, Near Town Circle"
              />
            </div>
            <div>
              <Input
                label="Prominent Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Post Office or Temple Gate"
              />
            </div>
            <div>
              <Input
                label="City / Town / Village"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Puttur, Mangaluru, Belthangady"
              />
            </div>
            <div>
              <Input
                label="Postal / PIN Code (Optional)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 574201"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5">
              Description of the Issue <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the severity, duration, whether water is overflowing onto the road or sidewalk, and any risks to traffic or nearby homes..."
              className="w-full rounded-2xl border border-[#D6E0DA] bg-white px-4 py-3 text-sm text-forest-850 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-800 transition-all"
            />
            <p className="text-xs text-sage-500 mt-1">
              Minimum 10 characters ({description.length}/2000)
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8ECE9]">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => {
                if (!address.trim() || !city.trim() || description.trim().length < 10) {
                  setError("Please fill out the street address, city, and a description of at least 10 characters.");
                  return;
                }
                setError(null);
                setStep(3);
              }}
              withArrow
            >
              Continue to Photos
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTOS & OPTIONAL CONTACT */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-sage-500 block mb-1">
              Step 3 of 4
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850 tracking-tight">
              Photographs & Confidential Contact
            </h2>
            <p className="text-sm text-sage-600 mt-1">
              Photos speed up diagnosis. Reporter contact details are optional and strictly private.
            </p>
          </div>

          {/* Photo Uploader */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600">
              Attach Photographs (Optional, up to 5)
            </label>

            {photos.length < 5 && (
              <label className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border-2 border-dashed border-[#C5D4CB] hover:border-forest-900 bg-[#FAFBFB] hover:bg-forest-50/30 cursor-pointer transition-all">
                <UploadCloud className="w-8 h-8 text-forest-800 mb-2" />
                <span className="text-xs sm:text-sm font-semibold text-forest-900">
                  {uploadingPhoto ? "Processing photograph..." : "Click to select or drag & drop photo"}
                </span>
                <span className="text-[11px] text-sage-500 mt-1">
                  JPEG, PNG, WebP up to 5 MB per image
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
            )}

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden aspect-square border border-[#E6ECE8]">
                    <img src={p.secureUrl || p.url} alt={`Upload preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-forest-950/70 hover:bg-forest-950 text-white flex items-center justify-center transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reporter Privacy Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Privacy Invariant</span>
              Your contact details will only be used by authorized municipal coordinators if field clarification is needed. They are <strong>never</strong> exposed in public tracking searches or APIs.
            </div>
          </div>

          {/* Optional Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Your Name (Optional)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Priya Nair"
              />
            </div>
            <div>
              <Input
                label="Phone Number (Optional)"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Email Address for Status Alerts (Optional)"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="e.g. priya@example.com"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notify"
              checked={notifyByEmail}
              onChange={(e) => setNotifyByEmail(e.target.checked)}
              className="w-4 h-4 rounded text-forest-900 focus:ring-forest-800 border-[#C5D2CB]"
            />
            <label htmlFor="notify" className="text-xs text-sage-600 select-none cursor-pointer">
              Send me an automated notification email when this leak is marked as resolved.
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8ECE9]">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} withArrow>
              Review Report
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW BEFORE SUBMIT */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-6 sm:p-10 shadow-card space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-sage-500 block mb-1">
              Step 4 of 4
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850 tracking-tight">
              Review Your Report
            </h2>
            <p className="text-sm text-sage-600 mt-1">
              Please double check the details before logging this into the JalRakshak system.
            </p>
          </div>

          {/* Summary Box */}
          <div className="rounded-2xl border border-[#E6ECE8] bg-[#F9FAF9] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECE9]">
              <div>
                <span className="text-xs text-sage-500 uppercase tracking-wider block">Category</span>
                <span className="text-sm font-bold text-forest-850">
                  {CATEGORIES.find((c) => c.value === category)?.label}
                </span>
              </div>
              <Badge variant={severity as any}>{severity.toUpperCase()} SEVERITY</Badge>
            </div>

            <div>
              <span className="text-xs text-sage-500 uppercase tracking-wider block">Jurisdiction & Location</span>
              <span className="text-sm font-semibold text-forest-850 block">
                {talukName} Taluk, {districtName}, {stateName}
              </span>
              <span className="text-xs text-sage-600 block mt-0.5">
                {address}, {landmark && `${landmark}, `}{city} {postalCode}
              </span>
              {coords && (
                <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
                  GPS: {coords.lat}, {coords.lng}
                </span>
              )}
            </div>

            <div>
              <span className="text-xs text-sage-500 uppercase tracking-wider block">Description</span>
              <p className="text-xs sm:text-sm text-sage-600 leading-relaxed mt-0.5 whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {photos.length > 0 && (
              <div>
                <span className="text-xs text-sage-500 uppercase tracking-wider block mb-1.5">
                  Attached Photos ({photos.length})
                </span>
                <div className="flex gap-2">
                  {photos.map((p, i) => (
                    <img key={i} src={p.secureUrl || p.url} alt="Attached leak" className="w-14 h-14 object-cover rounded-xl border border-[#DDE5E0]" />
                  ))}
                </div>
              </div>
            )}

            {reporterEmail && (
              <div className="pt-2 border-t border-[#E8ECE9]">
                <span className="text-xs text-sage-500 uppercase tracking-wider block">Reporter Contact (Private)</span>
                <span className="text-xs text-forest-850 font-medium">{reporterName ? `${reporterName} • ` : ""}{reporterEmail}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            By submitting, your report will be registered in JalRakshak and assigned a unique reference code. You can use it to track real-time resolution on this portal at any time.
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8ECE9]">
            <Button variant="outline" onClick={() => setStep(3)} disabled={loading}>
              Back
            </Button>
            <Button onClick={handleSubmit} isLoading={loading} withArrow>
              Submit Report
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS STATE WITH COPY ID */}
      {step === 5 && submittedReportId && (
        <div className="bg-white rounded-3xl border border-[#E6ECE8] p-8 sm:p-12 shadow-elevated text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-800">
              Report Successfully Recorded & Auto-Routed
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-850 tracking-tight">
              Thank You for Protecting Our Water
            </h2>
            <p className="text-xs sm:text-sm text-sage-600 max-w-md mx-auto leading-relaxed">
              Your leak report has been securely registered in JalRakshak and routed to the assigned field officer for <strong>{talukName} Taluk, {districtName}</strong>.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#F9FAF9] border border-[#DCE4DF] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
              Your Unguessable Report Reference ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-forest-900 tracking-wider">
                {submittedReportId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2.5 rounded-full hover:bg-forest-50 text-forest-850 transition-colors border border-transparent hover:border-forest-200"
                title="Copy Report ID"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && (
              <span className="text-xs text-emerald-700 font-medium block">
                Copied to clipboard!
              </span>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={`/track/${submittedReportId}`} withArrow>
              Track This Report
            </Button>
            <Button variant="outline" href="/report" onClick={() => window.location.reload()}>
              Submit Another Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
