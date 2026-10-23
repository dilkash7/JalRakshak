import { StoredUser, StoredReport, getDevUsers, getDevReports } from "./dev-store";
import { UserModel } from "./models/User";
import { ReportModel } from "./models/Report";
import { isUsingDevFallback, connectToDatabase } from "./db";
import {
  AssignedStaffInfo,
  ReportLocationInput,
  findBestOfficerFromLists,
  findBestOfficerForReport,
} from "./routing-engine";

export {
  type AssignedStaffInfo,
  type ReportLocationInput,
  findBestOfficerFromLists,
  findBestOfficerForReport,
};

/**
 * Deterministically routes a report to an active staff member based on exact jurisdiction:
 * 1. Matches State
 * 2. Matches District
 * 3. Matches Taluk
 * 4. Filters to active staff only
 * 5. If multiple qualify, selects the one with the lowest open report workload
 * 6. If none qualify, returns null (remains in Unassigned Queue)
 */
export async function findEligibleStaffForReport(
  location: ReportLocationInput
): Promise<AssignedStaffInfo | null> {
  const targetState = location.state?.trim().toLowerCase();
  const targetDistrict = location.district?.trim().toLowerCase();
  const targetTaluk = location.taluk?.trim().toLowerCase();

  // If no taluk is provided, cannot auto-route to taluk officer
  if (!targetTaluk) {
    return null;
  }

  if (isUsingDevFallback()) {
    const users = getDevUsers();
    const reports = getDevReports();
    return findBestOfficerFromLists(location, users, reports);
  }

  // Database mode (MongoDB)
  await connectToDatabase();
  const query: any = {
    role: "staff",
    status: "active",
    taluk: new RegExp(`^${targetTaluk}$`, "i"),
  };
  if (targetState) query.state = new RegExp(`^${targetState}$`, "i");
  if (targetDistrict) query.district = new RegExp(`^${targetDistrict}$`, "i");

  const eligible = await UserModel.find(query).lean();
  if (!eligible || eligible.length === 0) {
    return null;
  }

  if (eligible.length === 1) {
    const match: any = eligible[0];
    return {
      userId: String(match._id),
      name: match.name,
      assignedAt: new Date(),
      staffId: match.staffId,
      taluk: match.taluk,
      district: match.district,
      state: match.state,
    };
  }

  // Workload query for multiple candidates
  const openStatus = ["submitted", "under_review", "investigating", "repair_scheduled", "in_progress"];
  const candidateIds = eligible.map((u: any) => String(u._id));

  const counts = await ReportModel.aggregate([
    {
      $match: {
        "assignedTo.userId": { $in: candidateIds },
        status: { $in: openStatus },
      },
    },
    {
      $group: {
        _id: "$assignedTo.userId",
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap: Record<string, number> = {};
  counts.forEach((c) => {
    countMap[c._id] = c.count;
  });

  const sorted = [...eligible].sort((a: any, b: any) => {
    const countA = countMap[String(a._id)] || 0;
    const countB = countMap[String(b._id)] || 0;
    return countA - countB;
  });

  const chosen: any = sorted[0];
  return {
    userId: String(chosen._id),
    name: chosen.name,
    assignedAt: new Date(),
    staffId: chosen.staffId,
    taluk: chosen.taluk,
    district: chosen.district,
    state: chosen.state,
  };
}
