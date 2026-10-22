import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { userRepo } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth("admin");
    const { id } = params;
    const body = await req.json();

    if (body.status && (body.status === "active" || body.status === "suspended")) {
      const updated = await userRepo.updateStatus(id, body.status);
      if (!updated) {
        return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, staff: updated });
    }

    return NextResponse.json({ error: "Invalid status update payload" }, { status: 400 });
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (err.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }
    console.error("[API/admin/staff/[id]] Error:", err);
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
  }
}
