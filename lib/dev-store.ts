import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

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
    assignedAt: Date;
  };
  publicResolutionSummary?: string;
  resolvedAt?: Date;
  internalNotes: Array<{
    author: string;
    authorEmail?: string;
    note: string;
    createdAt: Date;
  }>;
  statusHistory: Array<{
    from: string;
    to: string;
    at: Date;
    by: string;
    note?: string;
    isPublic?: boolean;
  }>;
  idempotencyKey?: string;
  estimatedWaterSavedLitres?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "staff";
  staffId?: string;
  state?: string;
  district?: string;
  taluk?: string;
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

const DEV_DATA_FILE = path.join(process.cwd(), ".jalrakshak-dev-data.json");

// Global container to preserve in-memory state during HMR in development
const globalStore = global as unknown as {
  __jalrakshak_reports?: StoredReport[];
  __jalrakshak_users?: StoredUser[];
  __jalrakshak_initialized?: boolean;
};

export function saveDevData(): void {
  try {
    const data = {
      reports: globalStore.__jalrakshak_reports || [],
      users: globalStore.__jalrakshak_users || [],
    };
    fs.writeFileSync(DEV_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[DevStore] Failed to persist data to disk:", err);
  }
}

export function getDevReports(): StoredReport[] {
  if (!globalStore.__jalrakshak_initialized) {
    initDevStore();
  }
  return globalStore.__jalrakshak_reports || [];
}

export function getDevUsers(): StoredUser[] {
  if (!globalStore.__jalrakshak_initialized) {
    initDevStore();
  }
  return globalStore.__jalrakshak_users || [];
}

export function addDevStaff(staff: {
  name: string;
  email: string;
  password?: string;
  staffId: string;
  state: string;
  district: string;
  taluk: string;
}): StoredUser {
  const users = getDevUsers();
  const cleanEmail = staff.email.toLowerCase().trim();
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error("Staff member with this email already exists");
  }
  const newUser: StoredUser = {
    _id: `dev-staff-${Date.now()}`,
    name: staff.name,
    email: cleanEmail,
    passwordHash: bcrypt.hashSync(staff.password || "JalRakshak@2026Staff!", 10),
    role: "staff",
    staffId: staff.staffId,
    state: staff.state,
    district: staff.district,
    taluk: staff.taluk,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.push(newUser);
  saveDevData();
  return newUser;
}

export function toggleDevStaffStatus(idOrEmail: string): StoredUser | null {
  const users = getDevUsers();
  const target = users.find(
    (u) => u._id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()
  );
  if (!target) return null;
  target.status = target.status === "active" ? "suspended" : "active";
  target.updatedAt = new Date();
  saveDevData();
  return target;
}

function initDevStore() {
  if (globalStore.__jalrakshak_initialized) return;

  let loadedReports: StoredReport[] | null = null;
  let loadedUsers: StoredUser[] | null = null;

  // Try loading existing file from disk first
  if (fs.existsSync(DEV_DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DEV_DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.reports)) {
        // Migration: Ensure seeded reports have taluk/district/state
        parsed.reports.forEach((r: StoredReport) => {
          if (!r.location.taluk) {
            if (r.reportId === "JR-9K4M2X7P8W" || r.reportId === "JR-7L2B9X4W1M") {
              r.location.state = "Karnataka";
              r.location.district = "Dakshina Kannada";
              r.location.taluk = "Puttur";
              r.location.city = "Puttur";
            } else if (r.reportId === "JR-3N8P5Q2L9K") {
              r.location.state = "Karnataka";
              r.location.district = "Dakshina Kannada";
              r.location.taluk = "Mangaluru";
              r.location.city = "Mangaluru";
            } else if (r.reportId === "JR-4T6R1K8Y5P") {
              r.location.state = "Karnataka";
              r.location.district = "Dakshina Kannada";
              r.location.taluk = "Belthangady";
              r.location.city = "Belthangady";
            }
          }
        });
        loadedReports = parsed.reports;
      }
      if (Array.isArray(parsed.users)) {
        loadedUsers = parsed.users;
      }
    } catch (err) {
      console.warn("[DevStore] Could not read dev data file, re-seeding:", err);
    }
  }

  // Initialize reports if not loaded
  if (!loadedReports || loadedReports.length === 0) {
    const now = new Date();
    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600 * 1000);
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 3600 * 1000);

    loadedReports = [
      {
        _id: "dev-rep-1",
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
          name: "Aarav Sharma",
          email: "aarav.s@example.com",
          phone: "+91 98765 43210",
          notifyByEmail: true,
        },
        photos: [
          {
            publicId: "demo/pipe-burst-1",
            url: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80",
            secureUrl:
              "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80",
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
            note: "Emergency field team dispatched with replacement 4-inch ductile iron valve.",
            createdAt: twoHoursAgo,
          },
        ],
        statusHistory: [
          { from: "none", to: "submitted", at: yesterday, by: "system", isPublic: true },
          {
            from: "submitted",
            to: "under_review",
            at: new Date(Date.now() - 12 * 3600 * 1000),
            by: "dev-staff-puttur-1",
            note: "Auto-routed to Puttur Taluk Officer",
            isPublic: true,
          },
          {
            from: "under_review",
            to: "in_progress",
            at: twoHoursAgo,
            by: "dev-staff-puttur-1",
            note: "Excavation and valve clamping currently underway.",
            isPublic: true,
          },
        ],
        estimatedWaterSavedLitres: 4200,
        createdAt: yesterday,
        updatedAt: twoHoursAgo,
      },
      {
        _id: "dev-rep-2",
        reportId: "JR-3N8P5Q2L9K",
        category: "street_leakage",
        description:
          "Continuous pressurized water jet spurting from road shoulder joint, pooling across pedestrian lane.",
        location: {
          address: "Hampankatta Junction, KS Rao Road",
          landmark: "Near City Centre Mall",
          city: "Mangaluru",
          state: "Karnataka",
          district: "Dakshina Kannada",
          taluk: "Mangaluru",
          postalCode: "575001",
          coordinates: { lat: 12.8702, lng: 74.8436 },
        },
        severity: "medium",
        status: "resolved",
        publicResolutionSummary:
          "Main pipe seal repacked and tested at standard 4.2 bar pressure. Road surface restored and verified.",
        resolvedAt: yesterday,
        reporter: {
          name: "Pooja Hegde",
          email: "pooja.h@example.com",
          notifyByEmail: true,
        },
        photos: [
          {
            publicId: "demo/leak-2",
            url: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
            secureUrl:
              "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
          },
        ],
        resolutionPhotos: [
          {
            publicId: "demo/resolved-2",
            url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            secureUrl:
              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          },
        ],
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
        _id: "dev-rep-3",
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
          assignedAt: now,
        },
        internalNotes: [],
        statusHistory: [{ from: "none", to: "submitted", at: now, by: "system", isPublic: true }],
        estimatedWaterSavedLitres: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: "dev-rep-4",
        reportId: "JR-4T6R1K8Y5P",
        category: "valve_leak",
        description:
          "Public sluice valve lid missing and spindle leaking steadily into storm drain.",
        location: {
          address: "Ujire Main Road, Near Dharmasthala Cross",
          landmark: "Near Bus Stand",
          city: "Belthangady",
          state: "Karnataka",
          district: "Dakshina Kannada",
          taluk: "Belthangady",
          postalCode: "574214",
        },
        severity: "medium",
        status: "submitted",
        photos: [],
        // Unassigned to demonstrate Admin Unassigned Queue!
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
  }

  // Ensure default administrator and taluk demo staff exist
  if (!loadedUsers) {
    loadedUsers = [];
  }

  const defaultStaffPassword = bcrypt.hashSync("JalRakshak@2026Staff!", 10);

  // 1. Puttur Staff
  const putturEmail = "staff.puttur@jalrakshak.org";
  if (!loadedUsers.some((u) => u.email === putturEmail)) {
    loadedUsers.push({
      _id: "dev-staff-puttur-1",
      name: "Ramesh Bhat",
      email: putturEmail,
      passwordHash: defaultStaffPassword,
      role: "staff",
      staffId: "STF-PUTTUR-01",
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Puttur",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 2. Mangaluru Staff
  const mngEmail = "staff.mangaluru@jalrakshak.org";
  if (!loadedUsers.some((u) => u.email === mngEmail)) {
    loadedUsers.push({
      _id: "dev-staff-mng-1",
      name: "Sunil Kumar",
      email: mngEmail,
      passwordHash: defaultStaffPassword,
      role: "staff",
      staffId: "STF-MNG-01",
      state: "Karnataka",
      district: "Dakshina Kannada",
      taluk: "Mangaluru",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 3. Admin Account
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@jalrakshak.org").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "JalRakshak@2026Admin!";
  const adminName = process.env.ADMIN_NAME || "Administrator";

  const existingAdmin = loadedUsers.find((u) => u.email === adminEmail);
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    loadedUsers.push({
      _id: "dev-admin-1",
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      staffId: "ADM-001",
      state: "Karnataka",
      district: "Dakshina Kannada",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else if (process.env.ADMIN_PASSWORD) {
    // If ADMIN_PASSWORD is explicitly set in env, ensure the hash matches
    if (!bcrypt.compareSync(adminPassword, existingAdmin.passwordHash)) {
      existingAdmin.passwordHash = bcrypt.hashSync(adminPassword, 10);
      existingAdmin.updatedAt = new Date();
    }
  }

  globalStore.__jalrakshak_reports = loadedReports;
  globalStore.__jalrakshak_users = loadedUsers;
  globalStore.__jalrakshak_initialized = true;

  saveDevData();
}
