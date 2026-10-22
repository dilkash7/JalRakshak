import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { reportRepo } from "@/lib/db";

export async function GET() {
  try {
    await requireAuth();

    const { items: allReports, total } = await reportRepo.find({}, { limit: 1000 });

    const statusCounts: Record<string, number> = {
      submitted: 0,
      under_review: 0,
      investigating: 0,
      repair_scheduled: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    };

    const categoryCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    let totalWaterSaved = 0;

    for (const r of allReports) {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      const city = r.location?.city || "Unknown";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
      totalWaterSaved += r.estimatedWaterSavedLitres || 0;
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalReports: total,
        statusCounts,
        categoryCounts,
        cityCounts,
        totalWaterSaved,
      },
    });
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
