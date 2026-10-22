export interface PublicReport {
  reportId: string;
  category: string;
  description: string;
  generalArea: string;
  city: string;
  state?: string;
  district?: string;
  taluk?: string;
  landmark?: string;
  severity: string;
  status: string;
  publicResolutionSummary?: string;
  statusHistory: Array<{
    from: string;
    to: string;
    at: string;
    note?: string;
  }>;
  photos: Array<{
    url: string;
    secureUrl: string;
  }>;
  resolutionPhotos?: Array<{
    url: string;
    secureUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  elapsedDays?: number;
  estimatedWaterSavedLitres?: number;
}

/**
 * Single allowlisted public serializer.
 * Strips all personal reporter info, exact coordinates, internal notes,
 * staff names/IDs, and raw DB identifiers.
 */
export function toPublicReport(doc: any): PublicReport {
  if (!doc) {
    throw new Error("Cannot serialize null or undefined report document");
  }

  // Handle Mongoose document or plain object
  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;

  const publicHistory = Array.isArray(raw.statusHistory)
    ? raw.statusHistory.map((h: any) => ({
        from: String(h.from || ""),
        to: String(h.to || ""),
        at: h.at ? new Date(h.at).toISOString() : new Date().toISOString(),
        // Only include public notes if specified, omit internal staff notes
        note: h.isPublic ? h.note : undefined,
      }))
    : [];

  // Filter photos to only safe public URLs
  const publicPhotos = Array.isArray(raw.photos)
    ? raw.photos.map((p: any) => ({
        url: String(p.url || p.secureUrl || ""),
        secureUrl: String(p.secureUrl || p.url || ""),
      }))
    : [];

  const publicResolutionPhotos = Array.isArray(raw.resolutionPhotos)
    ? raw.resolutionPhotos.map((p: any) => ({
        url: String(p.url || p.secureUrl || ""),
        secureUrl: String(p.secureUrl || p.url || ""),
      }))
    : [];

  // Calculate elapsed days
  const createdTime = raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now();
  const endTime = raw.resolvedAt ? new Date(raw.resolvedAt).getTime() : Date.now();
  const diffDays = Math.max(0, Math.round((endTime - createdTime) / (1000 * 60 * 60 * 24)));

  return {
    reportId: String(raw.reportId || ""),
    category: String(raw.category || "other"),
    description: String(raw.description || ""),
    generalArea: raw.location?.taluk
      ? `${raw.location.taluk}, ${raw.location.district || raw.location.city || ""}`.trim()
      : raw.location?.landmark
      ? `${raw.location.landmark}, ${raw.location.city || ""}`.trim()
      : String(raw.location?.city || "Unknown Area"),
    city: String(raw.location?.city || ""),
    state: raw.location?.state ? String(raw.location.state) : undefined,
    district: raw.location?.district ? String(raw.location.district) : undefined,
    taluk: raw.location?.taluk ? String(raw.location.taluk) : undefined,
    landmark: raw.location?.landmark ? String(raw.location.landmark) : undefined,
    severity: String(raw.severity || "medium"),
    status: String(raw.status || "submitted"),
    publicResolutionSummary: raw.publicResolutionSummary
      ? String(raw.publicResolutionSummary)
      : undefined,
    statusHistory: publicHistory,
    photos: publicPhotos,
    resolutionPhotos: publicResolutionPhotos.length > 0 ? publicResolutionPhotos : undefined,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString(),
    resolvedAt: raw.resolvedAt ? new Date(raw.resolvedAt).toISOString() : undefined,
    elapsedDays: diffDays,
    estimatedWaterSavedLitres: raw.estimatedWaterSavedLitres || undefined,
  };
}
