import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { reportRepo } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const unassignedParam = searchParams.get("unassigned") === "true";
    const requestedTaluk = searchParams.get("taluk") || undefined;

    // Enforce role-based jurisdiction access control:
    // Staff members can ONLY query and access reports within their assigned taluk or assigned directly to them.
    let talukFilter: string | undefined = undefined;
    let assignedToUserIdFilter: string | undefined = undefined;
    let unassignedOnly = false;

    if (session.role === "staff") {
      talukFilter = session.taluk;
    } else {
      // Administrator can view all, or filter by specific taluk or unassigned queue
      talukFilter = requestedTaluk;
      unassignedOnly = unassignedParam;
    }

    const skip = (page - 1) * limit;

    const { items, total } = await reportRepo.find(
      {
        status,
        category,
        city,
        search,
        taluk: talukFilter,
        assignedToUserId: assignedToUserIdFilter,
        unassignedOnly,
      },
      { skip, limit, sort: { createdAt: -1 } }
    );

    // Compute unassigned count for admin dashboard badges
    let unassignedCount = 0;
    if (session.role === "admin") {
      const { total: unassignedTotal } = await reportRepo.find({ unassignedOnly: true });
      unassignedCount = unassignedTotal;
    }

    return NextResponse.json({
      success: true,
      reports: items,
      total,
      unassignedCount,
      page,
      totalPages: Math.ceil(total / limit),
      currentUser: session,
    });
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (err.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("[API/admin/reports] Error:", err);
    return NextResponse.json({ error: "Failed to retrieve reports" }, { status: 500 });
  }
}
