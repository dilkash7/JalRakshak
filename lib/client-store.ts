/**
 * JalRakshak Unified Client Store
 * Provides central, browser-local data storage via localStorage and IndexedDB.
 * Completely replaces external database / server requirements for competition prototype & Vercel deployment.
 */

import { generateReportId } from "@/lib/id";
import { findBestOfficerForReport } from "@/lib/routing-engine";
import { CreateReportInput, UpdateReportStatusInput, CreateStaffInput } from "@/lib/validation";
import { clearAllPhotos } from "@/lib/photo-store";

export interface StoredReport {
  _id: string;
  reportId: string;
  category: string;
  description: string;
  location: {
    address: string;
    landmark?: string;
    city: string;
    state?: string;
    district?: string;
    taluk?: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  severity: "low" | "medium" | "high" | "critical";
  status:
    | "submitted"
    | "under_review"
    | "investigating"
    | "repair_scheduled"
    | "in_progress"
    | "resolved"
    | "rejected";
  reporter?: {
    name?: string;
    email?: string;
    phone?: string;
    notifyByEmail?: boolean;
  };
  photos: Array<{
    publicId: string;
    url: string;
    secureUrl: string;
  }>;
  resolutionPhotos?: Array<{
    publicId: string;
    url: string;
    secureUrl: string;
  }>;
  assignedTo?: {
    userId: string;
    name: string;
    assignedAt: string;
  };
  publicResolutionSummary?: string;
  resolvedAt?: string;
  internalNotes: Array<{
    author: string;
    authorEmail?: string;
    note: string;
    createdAt: string;
  }>;
  statusHistory: Array<{
    from: string;
    to: string;
    at: string;
    by: string;
    note?: string;
    isPublic?: boolean;
  }>;
  idempotencyKey?: string;
  estimatedWaterSavedLitres?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "staff";
  staffId?: string;
  state?: string;
  district?: string;
  taluk?: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface SystemStats {
  totalReports: number;
  inProgress: number;
  resolved: number;
  litresSaved: number;
  avgResolutionDays: number;
}

const STORAGE_KEY = "jalrakshak_prototype_store_v1";
const STORE_EVENT = "jalrakshak_store_changed";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyStoreChange(): void {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  }
}

// -------------------------------------------------------------
// Baseline Demonstration Seeds
// -------------------------------------------------------------
function getInitialSeeds(): { reports: StoredReport[]; users: StoredUser[] } {
  const now = new Date();
  const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
  const yesterday = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString();

  const users: StoredUser[] = [
    {
      _id: "dev-admin-1",
      name: "Administrator",
      email: "admin@jalrakshak.org",
      password: "JalRakshak@2026Admin!",
      role: "admin",
      staffId: "ADM-001",
      state: "Karnataka",
      district: "Dakshina Kannada",
      status: "active",
      createdAt: fiveDaysAgo,
      updatedAt: fiveDaysAgo,
    },
    {
      _id: "dev-staff-puttur-1",
      name: "Ramesh Bhat",
      email: "staff.puttur@jalrakshak.org",
      password: "JalRakshak@2026Staff!",
      role: "staff",
      staffId: "STF-PUTTUR-01",
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Puttur",
      status: "active",
      createdAt: fiveDaysAgo,
      updatedAt: fiveDaysAgo,
    },
    {
      _id: "dev-staff-mng-1",
      name: "Sunil Kumar",
      email: "staff.mangaluru@jalrakshak.org",
      password: "JalRakshak@2026Staff!",
      role: "staff",
      staffId: "STF-MNG-01",
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Mangaluru",
      status: "active",
      createdAt: fiveDaysAgo,
      updatedAt: fiveDaysAgo,
    },
  ];

  const reports: StoredReport[] = [
    {
      _id: "rep-seed-1",
      reportId: "JR-9K4M2X7P8W",
      category: "pipe_burst",
      description:
        "Underground main distribution pipe burst near junction, causing substantial clean water overflow onto sidewalk.",
      location: {
        address: "Main Market Road, Near Mahalingeshwara Temple",
        landmark: "Opposite Town Hall",
        city: "Puttur",
        state: "Karnataka",
        district: "Dakshina Kannada",
        taluk: "Puttur",
        postalCode: "574201",
        coordinates: { lat: 12.7663, lng: 75.2045 },
      },
      severity: "high",
      status: "in_progress",
      reporter: {
        name: "Devappa Gowda",
        email: "devappa@example.com",
        phone: "+91 98451 23456",
        notifyByEmail: true,
      },
      photos: [
        {
          publicId: "seed-photo-1",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
          secureUrl:
            "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
        },
      ],
      assignedTo: {
        userId: "dev-staff-puttur-1",
        name: "Ramesh Bhat (Puttur Taluk Officer)",
        assignedAt: twoHoursAgo,
      },
      internalNotes: [
        {
          author: "Ramesh Bhat",
          note: "Dispatch team mobilized. Water supply temporarily throttled on line B-4.",
          createdAt: twoHoursAgo,
        },
      ],
      statusHistory: [
        { from: "none", to: "submitted", at: yesterday, by: "citizen", isPublic: true },
        {
          from: "submitted",
          to: "in_progress",
          at: twoHoursAgo,
          by: "dev-staff-puttur-1",
          note: "Taluk repair team dispatched with 110mm clamp fitting.",
          isPublic: true,
        },
      ],
      estimatedWaterSavedLitres: 4500,
      createdAt: yesterday,
      updatedAt: twoHoursAgo,
    },
    {
      _id: "rep-seed-2",
      reportId: "JR-3N8P5Q2L9K",
      category: "street_leakage",
      description: "Constant pavement leak observed near commercial complex driveway for 3 consecutive days.",
      location: {
        address: "K.S. Rao Road, Hampankatta",
        landmark: "Near City Centre Mall",
        city: "Mangaluru",
        state: "Karnataka",
        district: "Dakshina Kannada",
        taluk: "Mangaluru",
        postalCode: "575001",
        coordinates: { lat: 12.8703, lng: 74.8427 },
      },
      severity: "medium",
      status: "resolved",
      reporter: {
        name: "Pooja Hegde",
        email: "pooja.h@example.com",
        notifyByEmail: true,
      },
      photos: [
        {
          publicId: "seed-photo-2",
          url: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
          secureUrl:
            "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
        },
      ],
      resolutionPhotos: [
        {
          publicId: "seed-proof-2",
          url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          secureUrl:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        },
      ],
      publicResolutionSummary:
        "Sub-surface gasket replaced and pipeline pressure tested. Asphalt patch completed.",
      resolvedAt: yesterday,
      assignedTo: {
        userId: "dev-staff-mng-1",
        name: "Sunil Kumar (Mangaluru Taluk Officer)",
        assignedAt: threeDaysAgo,
      },
      internalNotes: [
        {
          author: "Sunil Kumar",
          note: "Repack complete. Inspected by zonal supervisor.",
          createdAt: yesterday,
        },
      ],
      statusHistory: [
        { from: "none", to: "submitted", at: threeDaysAgo, by: "system", isPublic: true },
        { from: "submitted", to: "in_progress", at: twoHoursAgo, by: "dev-staff-mng-1", isPublic: true },
        {
          from: "in_progress",
          to: "resolved",
          at: yesterday,
          by: "dev-staff-mng-1",
          note: "Seal replaced and verified.",
          isPublic: true,
        },
      ],
      estimatedWaterSavedLitres: 8300,
      createdAt: threeDaysAgo,
      updatedAt: yesterday,
    },
    {
      _id: "rep-seed-3",
      reportId: "JR-7L2B9X4W1M",
      category: "meter_damage",
      description: "Residential water meter cracked at the flange with rapid droplet loss.",
      location: {
        address: "Darbe Circle, Bolwar Road",
        landmark: "Near Bolwar Post Office",
        city: "Puttur",
        state: "Karnataka",
        district: "Dakshina Kannada",
        taluk: "Puttur",
        postalCode: "574202",
      },
      severity: "low",
      status: "submitted",
      photos: [],
      assignedTo: {
        userId: "dev-staff-puttur-1",
        name: "Ramesh Bhat (Puttur Taluk Officer)",
        assignedAt: now.toISOString(),
      },
      internalNotes: [],
      statusHistory: [
        { from: "none", to: "submitted", at: now.toISOString(), by: "citizen", isPublic: true },
        {
          from: "submitted",
          to: "submitted",
          at: now.toISOString(),
          by: "system",
          note: "Auto-routed to taluk field officer: Ramesh Bhat (Puttur)",
          isPublic: true,
        },
      ],
      estimatedWaterSavedLitres: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: "rep-seed-4",
      reportId: "JR-4T6R1K8Y5P",
      category: "valve_leak",
      description:
        "High pressure sluice valve leaking on the main rural feeder line. Requires specialized technician.",
      location: {
        address: "Ujire Main Road",
        landmark: "Near SDM College Junction",
        city: "Belthangady",
        state: "Karnataka",
        district: "Dakshina Kannada",
        taluk: "Belthangady",
        postalCode: "574214",
      },
      severity: "medium",
      status: "submitted",
      photos: [],
      // Unassigned by default to demonstrate the Admin Unassigned Queue!
      internalNotes: [],
      statusHistory: [
        {
          from: "none",
          to: "submitted",
          at: fiveDaysAgo,
          by: "system",
          note: "Awaiting taluk officer assignment (Unassigned Queue)",
          isPublic: true,
        },
      ],
      estimatedWaterSavedLitres: 0,
      createdAt: fiveDaysAgo,
      updatedAt: fiveDaysAgo,
    },
  ];

  return { reports, users };
}

// -------------------------------------------------------------
// Core Storage Access
// -------------------------------------------------------------
function readStore(): { reports: StoredReport[]; users: StoredUser[] } {
  if (!isBrowser()) {
    return getInitialSeeds();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeeds();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.reports) || !Array.isArray(parsed.users)) {
      const initial = getInitialSeeds();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    return parsed;
  } catch (err) {
    console.warn("[ClientStore] Could not read localStorage, resetting to seeds:", err);
    const initial = getInitialSeeds();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // Ignore
    }
    return initial;
  }
}

function writeStore(data: { reports: StoredReport[]; users: StoredUser[] }): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    notifyStoreChange();
  } catch (err) {
    console.error("[ClientStore] Failed to write store to localStorage:", err);
  }
}

// -------------------------------------------------------------
// Public Client Store API
// -------------------------------------------------------------
export const clientStore = {
  /**
   * Subscribe to store mutations across windows and components
   */
  subscribe(listener: () => void): () => void {
    if (!isBrowser()) return () => {};

    const handleCustomEvent = () => listener();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) listener();
    };

    window.addEventListener(STORE_EVENT, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(STORE_EVENT, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  },

  /**
   * Get all reports with optional filtering
   */
  getReports(filter?: {
    status?: string;
    category?: string;
    taluk?: string;
    city?: string;
    search?: string;
    unassignedOnly?: boolean;
    assignedToUserId?: string;
  }): { reports: StoredReport[]; total: number; unassignedCount: number } {
    const store = readStore();
    let list = [...store.reports];

    const unassignedCount = list.filter((r) => !r.assignedTo?.userId).length;

    if (filter?.unassignedOnly) {
      list = list.filter((r) => !r.assignedTo?.userId);
    }

    if (filter?.assignedToUserId) {
      list = list.filter((r) => r.assignedTo?.userId === filter.assignedToUserId);
    }

    if (filter?.status && filter.status !== "all") {
      list = list.filter((r) => r.status === filter.status);
    }

    if (filter?.category && filter.category !== "all") {
      list = list.filter((r) => r.category === filter.category);
    }

    if (filter?.taluk && filter.taluk !== "all") {
      const q = filter.taluk.toLowerCase();
      list = list.filter(
        (r) =>
          r.location.taluk?.toLowerCase() === q ||
          r.location.city?.toLowerCase() === q ||
          r.location.address?.toLowerCase().includes(q)
      );
    }

    if (filter?.city && filter.city.trim()) {
      const c = filter.city.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.location.city.toLowerCase().includes(c) ||
          r.location.district?.toLowerCase().includes(c) ||
          r.location.taluk?.toLowerCase().includes(c)
      );
    }

    if (filter?.search && filter.search.trim()) {
      const s = filter.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.reportId.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s) ||
          r.location.address.toLowerCase().includes(s) ||
          r.location.city.toLowerCase().includes(s) ||
          r.assignedTo?.name.toLowerCase().includes(s)
      );
    }

    // Sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      reports: list,
      total: list.length,
      unassignedCount,
    };
  },

  /**
   * Look up report by unique 10-char Report ID
   */
  getReportById(reportId: string): StoredReport | null {
    const store = readStore();
    const cleanId = reportId.trim().toUpperCase();
    return store.reports.find((r) => r.reportId === cleanId) || null;
  },

  /**
   * Submit citizen report: generates ID, saves in localStorage, and auto-routes by taluk
   */
  submitReport(input: CreateReportInput): { reportId: string; assignedTo?: any; status: string } {
    const store = readStore();
    const reportId = generateReportId();
    const nowIso = new Date().toISOString();

    // Check existing idempotency key
    if (input.idempotencyKey) {
      const existing = store.reports.find((r) => r.idempotencyKey === input.idempotencyKey);
      if (existing) {
        return {
          reportId: existing.reportId,
          assignedTo: existing.assignedTo,
          status: existing.status,
        };
      }
    }

    // Automatic Field-Officer Routing Engine
    const activeStaff = store.users.filter((u) => u.role === "staff" && u.status === "active");
    const routingResult = findBestOfficerForReport(
      input.location,
      activeStaff as any,
      store.reports as any
    );

    let assignedToObj: StoredReport["assignedTo"] = undefined;
    const statusHistory: StoredReport["statusHistory"] = [
      {
        from: "none",
        to: "submitted",
        at: nowIso,
        by: "citizen",
        isPublic: true,
      },
    ];

    if (routingResult.officer) {
      assignedToObj = {
        userId: routingResult.officer.userId,
        name: routingResult.officer.name,
        assignedAt: nowIso,
      };

      statusHistory.push({
        from: "submitted",
        to: "submitted",
        at: nowIso,
        by: "routing_engine",
        note: `Auto-routed to taluk field officer: ${routingResult.officer.name} (${routingResult.officer.taluk || input.location.taluk})`,
        isPublic: true,
      });
    } else {
      statusHistory.push({
        from: "submitted",
        to: "submitted",
        at: nowIso,
        by: "routing_engine",
        note: "Awaiting taluk officer assignment (Unassigned Queue)",
        isPublic: true,
      });
    }

    const newReport: StoredReport = {
      _id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      reportId,
      category: input.category,
      description: input.description,
      location: {
        address: input.location.address,
        landmark: input.location.landmark,
        city: input.location.city,
        state: input.location.state,
        district: input.location.district,
        taluk: input.location.taluk,
        postalCode: input.location.postalCode,
        coordinates: input.location.coordinates,
      },
      severity: input.severity || "medium",
      status: "submitted",
      reporter: input.reporter,
      photos: input.photos || [],
      assignedTo: assignedToObj,
      internalNotes: [],
      statusHistory,
      idempotencyKey: input.idempotencyKey,
      estimatedWaterSavedLitres: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    store.reports.unshift(newReport);
    writeStore(store);

    return {
      reportId,
      assignedTo: assignedToObj,
      status: "submitted",
    };
  },

  /**
   * Update status, public resolution summary, resolution photos, or litres saved
   */
  updateReportStatus(
    reportId: string,
    update: UpdateReportStatusInput,
    actorName = "Staff Officer"
  ): StoredReport {
    const store = readStore();
    const cleanId = reportId.trim().toUpperCase();
    const reportIndex = store.reports.findIndex((r) => r.reportId === cleanId);

    if (reportIndex === -1) {
      throw new Error(`Report #${reportId} not found`);
    }

    const report = store.reports[reportIndex];
    const prevStatus = report.status;
    const nowIso = new Date().toISOString();

    if (update.status && update.status !== prevStatus) {
      report.status = update.status as StoredReport["status"];
      report.statusHistory.push({
        from: prevStatus,
        to: update.status,
        at: nowIso,
        by: actorName,
        note: update.note || (update.status === "resolved" ? "Leak repaired and certified." : undefined),
        isPublic: true,
      });
    }

    if (update.publicResolutionSummary !== undefined) {
      report.publicResolutionSummary = update.publicResolutionSummary;
    }

    if (update.resolutionPhotos) {
      report.resolutionPhotos = update.resolutionPhotos;
    }

    if (update.estimatedWaterSavedLitres !== undefined) {
      report.estimatedWaterSavedLitres = update.estimatedWaterSavedLitres;
    }

    if (update.status === "resolved") {
      report.resolvedAt = update.resolvedAt
        ? new Date(update.resolvedAt).toISOString()
        : nowIso;
      if (!report.estimatedWaterSavedLitres || report.estimatedWaterSavedLitres <= 0) {
        // Estimate 3500 - 8500 litres saved
        report.estimatedWaterSavedLitres = Math.floor(3500 + Math.random() * 5000);
      }
    }

    if (update.assignedTo) {
      report.assignedTo = {
        userId: update.assignedTo.userId,
        name: update.assignedTo.name,
        assignedAt: nowIso,
      };
    }

    report.updatedAt = nowIso;
    store.reports[reportIndex] = report;
    writeStore(store);

    return report;
  },

  /**
   * Assign or reassign report to an officer manually by administrator
   */
  assignReport(reportId: string, officerId: string, adminName = "Administrator"): StoredReport {
    const store = readStore();
    const cleanId = reportId.trim().toUpperCase();
    const reportIndex = store.reports.findIndex((r) => r.reportId === cleanId);

    if (reportIndex === -1) {
      throw new Error(`Report #${reportId} not found`);
    }

    const officer = store.users.find((u) => u._id === officerId || u.staffId === officerId);
    if (!officer) {
      throw new Error(`Field Officer #${officerId} not found`);
    }

    const report = store.reports[reportIndex];
    const nowIso = new Date().toISOString();

    report.assignedTo = {
      userId: officer._id,
      name: `${officer.name} (${officer.taluk || "Field Officer"})`,
      assignedAt: nowIso,
    };

    report.statusHistory.push({
      from: report.status,
      to: report.status,
      at: nowIso,
      by: adminName,
      note: `Manually assigned to officer: ${officer.name} (${officer.taluk || officer.district})`,
      isPublic: true,
    });

    report.updatedAt = nowIso;
    store.reports[reportIndex] = report;
    writeStore(store);

    return report;
  },

  /**
   * Add internal staff note to a report
   */
  addInternalNote(reportId: string, note: string, authorName = "Staff Officer"): StoredReport {
    const store = readStore();
    const cleanId = reportId.trim().toUpperCase();
    const reportIndex = store.reports.findIndex((r) => r.reportId === cleanId);

    if (reportIndex === -1) {
      throw new Error(`Report #${reportId} not found`);
    }

    const report = store.reports[reportIndex];
    report.internalNotes.push({
      author: authorName,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    });

    report.updatedAt = new Date().toISOString();
    store.reports[reportIndex] = report;
    writeStore(store);

    return report;
  },

  /**
   * Get all registered demonstration users
   */
  getStaff(): StoredUser[] {
    const store = readStore();
    return store.users.filter((u) => u.role === "staff");
  },

  /**
   * Get all users (including Administrator)
   */
  getAllUsers(): StoredUser[] {
    const store = readStore();
    return store.users;
  },

  /**
   * Register a new field officer
   */
  registerStaff(input: CreateStaffInput): StoredUser {
    const store = readStore();
    const cleanEmail = input.email.toLowerCase().trim();

    if (store.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("A staff member or officer with this email already exists");
    }

    if (store.users.some((u) => u.staffId === input.staffId)) {
      throw new Error(`Staff Badge ID ${input.staffId} is already in use`);
    }

    const nowIso = new Date().toISOString();
    const newOfficer: StoredUser = {
      _id: `dev-staff-${Date.now()}`,
      name: input.name.trim(),
      email: cleanEmail,
      password: input.password || "JalRakshak@2026Staff!",
      role: "staff",
      staffId: input.staffId.trim().toUpperCase(),
      state: input.state,
      district: input.district,
      taluk: input.taluk,
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    store.users.push(newOfficer);
    writeStore(store);

    return newOfficer;
  },

  /**
   * Toggle staff status between active and suspended
   */
  toggleStaffStatus(userId: string): StoredUser {
    const store = readStore();
    const staff = store.users.find((u) => u._id === userId || u.staffId === userId);

    if (!staff) {
      throw new Error(`Staff member #${userId} not found`);
    }

    staff.status = staff.status === "active" ? "suspended" : "active";
    staff.updatedAt = new Date().toISOString();

    writeStore(store);
    return staff;
  },

  /**
   * Calculate public aggregate statistics for homepage and badges
   */
  getPublicStats(): SystemStats {
    const store = readStore();
    const totalReports = store.reports.length;
    const inProgress = store.reports.filter((r) =>
      ["in_progress", "investigating", "repair_scheduled"].includes(r.status)
    ).length;
    const resolved = store.reports.filter((r) => r.status === "resolved").length;
    const litresSaved = store.reports.reduce(
      (sum, r) => sum + (r.estimatedWaterSavedLitres || 0),
      0
    );

    return {
      totalReports: totalReports + 120, // baseline demonstration offset
      inProgress: inProgress + 40,
      resolved: resolved + 60,
      litresSaved: litresSaved > 0 ? litresSaved + 12000 : 12600,
      avgResolutionDays: 0.5,
    };
  },

  /**
   * Reset demonstration data back to pristine initial state
   */
  async resetDemoData(): Promise<void> {
    if (!isBrowser()) return;

    try {
      // 1. Clear IndexedDB photo blobs
      await clearAllPhotos();

      // 2. Clear localStorage and write initial seeds
      const initial = getInitialSeeds();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

      // 3. Notify all listeners
      notifyStoreChange();
    } catch (err) {
      console.error("[ClientStore] Error during resetDemoData:", err);
    }
  },
};
