/**
 * JalRakshak Pure In-Memory Routing Engine
 * Pure calculation logic with zero server-side, Node.js, or database dependencies.
 * Safe for use in browser bundles, service workers, and client components.
 */

export interface AssignedStaffInfo {
  userId: string;
  name: string;
  assignedAt: Date;
  staffId?: string;
  taluk?: string;
  district?: string;
  state?: string;
}

export interface ReportLocationInput {
  state?: string;
  district?: string;
  taluk?: string;
  city?: string;
}

export function findBestOfficerFromLists(
  location: ReportLocationInput,
  users: Array<{ _id: string; name: string; role: string; status: string; state?: string; district?: string; taluk?: string; staffId?: string }>,
  reports: Array<{ assignedTo?: { userId: string }; status: string }>
): AssignedStaffInfo | null {
  const targetState = location.state?.trim().toLowerCase();
  const targetDistrict = location.district?.trim().toLowerCase();
  const targetTaluk = location.taluk?.trim().toLowerCase();

  if (!targetTaluk) {
    return null;
  }

  // 1. Filter eligible active staff matching exact state, district, taluk
  const eligible = users.filter((u) => {
    if (u.role !== "staff" || u.status === "suspended") return false;
    const uState = (u.state || "").trim().toLowerCase();
    const uDistrict = (u.district || "").trim().toLowerCase();
    const uTaluk = (u.taluk || "").trim().toLowerCase();

    // If staff has state defined, must match targetState
    if (targetState && uState && uState !== targetState) return false;
    // If staff has district defined, must match targetDistrict
    if (targetDistrict && uDistrict && uDistrict !== targetDistrict) return false;
    // Exact taluk match is required
    return uTaluk === targetTaluk;
  });

  if (eligible.length === 0) {
    return null;
  }

  if (eligible.length === 1) {
    const match = eligible[0];
    return {
      userId: match._id,
      name: match.name,
      assignedAt: new Date(),
      staffId: match.staffId,
      taluk: match.taluk,
      district: match.district,
      state: match.state,
    };
  }

  // 2. Multiple eligible officers: select the one with fewest open reports
  const openStatus = ["submitted", "under_review", "investigating", "repair_scheduled", "in_progress"];
  const candidatesWithWorkload = eligible.map((staff) => {
    const openCount = reports.filter(
      (r) =>
        r.assignedTo?.userId === staff._id &&
        openStatus.includes(r.status)
    ).length;
    return { staff, openCount };
  });

  candidatesWithWorkload.sort((a, b) => a.openCount - b.openCount);

  const chosen = candidatesWithWorkload[0].staff;
  return {
    userId: chosen._id,
    name: chosen.name,
    assignedAt: new Date(),
    staffId: chosen.staffId,
    taluk: chosen.taluk,
    district: chosen.district,
    state: chosen.state,
  };
}

export function findBestOfficerForReport(
  location: ReportLocationInput,
  users: any[],
  reports: any[]
): { officer: AssignedStaffInfo | null } {
  const officer = findBestOfficerFromLists(location, users, reports);
  return { officer };
}
