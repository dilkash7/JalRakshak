import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { userRepo, reportRepo } from "@/lib/db";
import { CreateStaffSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth("admin");

    const staffList = await userRepo.findAll({ role: "staff" });
    const { items: allReports } = await reportRepo.find({}, { limit: 1000 });

    const openStatuses = ["submitted", "under_review", "investigating", "repair_scheduled", "in_progress"];

    // Enhance each staff record with their current open workload count
    const staffWithWorkload = staffList.map((staff) => {
      const openCount = allReports.filter(
        (r) => r.assignedTo?.userId === staff._id && openStatuses.includes(r.status)
      ).length;
      const totalAssigned = allReports.filter(
        (r) => r.assignedTo?.userId === staff._id
      ).length;

      return {
        ...staff,
        openReportsCount: openCount,
        totalAssignedCount: totalAssigned,
      };
    });

    return NextResponse.json({
      success: true,
      staff: staffWithWorkload,
    });
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (err.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }
    console.error("[API/admin/staff] Error:", err);
    return NextResponse.json({ error: "Failed to retrieve staff directory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth("admin");

    const body = await req.json();
    const parsed = CreateStaffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, staffId, state, district, taluk } = parsed.data;

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newStaff = await userRepo.create({
      name,
      email,
      passwordHash,
      role: "staff",
      staffId,
      state,
      district,
      taluk,
    });

    return NextResponse.json(
      {
        success: true,
        staff: newStaff,
        message: `Field officer ${name} successfully assigned to ${taluk} Taluk.`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.message?.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (err.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }
    console.error("[API/admin/staff] Error creating staff:", err);
    return NextResponse.json({ error: "Failed to create staff account" }, { status: 500 });
  }
}
