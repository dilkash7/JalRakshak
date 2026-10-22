import { NextRequest, NextResponse } from "next/server";
import { reportRepo } from "@/lib/db";
import { toPublicReport } from "@/lib/serializer";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = await rateLimit(`lookup_${ip}`, 60, 60);

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many lookup requests. Please slow down." },
        { status: 429 }
      );
    }

    const { id } = params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid report identifier." },
        { status: 400 }
      );
    }

    const raw = await reportRepo.findByReportId(id);

    if (!raw) {
      return NextResponse.json(
        { error: "No report found with this Report ID." },
        { status: 404 }
      );
    }

    const report = toPublicReport(raw);
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("[API/reports/[id]] Error fetching report:", err);
    return NextResponse.json(
      { error: "An error occurred while looking up the report." },
      { status: 500 }
    );
  }
}
