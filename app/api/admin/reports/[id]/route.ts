import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { reportRepo } from "@/lib/db";
import { UpdateReportStatusSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    const { id } = params;

    const report = await reportRepo.findByReportId(id);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to retrieve report" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id } = params;

    const body = await req.json();

    const existingReport = await reportRepo.findByReportId(id);
    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Role permission enforcement
    if (session.role === "staff") {
      const reportTaluk = (existingReport.location?.taluk || "").toLowerCase();
      const staffTaluk = (session.taluk || "").toLowerCase();
      const isDirectlyAssigned = existingReport.assignedTo?.userId === session.id;

      if (!isDirectlyAssigned && reportTaluk !== staffTaluk) {
        return NextResponse.json(
          { error: "Access denied: This report is outside your assigned taluk jurisdiction." },
          { status: 403 }
        );
      }
    }

    // Support internal note addition
    if (body.newNote && typeof body.newNote === "string") {
      const updated = await reportRepo.update(id, {
        newInternalNote: {
          author: session.name,
          authorEmail: session.email,
          note: body.newNote.trim(),
        },
      });
      return NextResponse.json({ success: true, report: updated });
    }

    // Support status update
    const parsed = UpdateReportStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Prevent staff from reassigning reports across jurisdictions
    let assignedTo = parsed.data.assignedTo;
    if (session.role === "staff" && assignedTo) {
      assignedTo = undefined; // Staff cannot reassign jurisdiction
    }

    const updatePayload: any = {
      ...parsed.data,
      assignedTo,
      updatedBy: session.name,
      statusNote: parsed.data.note,
    };

    const updated = await reportRepo.update(id, updatePayload);

    if (!updated) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (err.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("[API/admin/reports/[id]] Error:", err);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}
