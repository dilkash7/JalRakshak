import { NextRequest, NextResponse } from "next/server";
import { CreateReportSchema } from "@/lib/validation";
import { generateReportId } from "@/lib/id";
import { reportRepo } from "@/lib/db";
import { toPublicReport } from "@/lib/serializer";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = await rateLimit(`submit_report_${ip}`, 10, 60);

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many report submissions. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = CreateReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const reportId = generateReportId();
    const data = {
      ...parsed.data,
      reportId,
      status: "submitted",
    };

    const saved = await reportRepo.create(data);

    return NextResponse.json(
      {
        success: true,
        reportId: saved.reportId,
        message: "Your report has been recorded by JalRakshak. Save your Report ID to track resolution.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API/reports] Error creating report:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while recording the report." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;

    const skip = (page - 1) * limit;

    const { items, total } = await reportRepo.find(
      { status, category, city, search },
      { skip, limit, sort: { createdAt: -1 } }
    );

    // Strictly serialize all items to ensure public privacy
    const reports = items.map((doc) => toPublicReport(doc));

    return NextResponse.json({
      success: true,
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("[API/reports] Error fetching reports:", err);
    return NextResponse.json(
      { error: "Failed to retrieve reports." },
      { status: 500 }
    );
  }
}
