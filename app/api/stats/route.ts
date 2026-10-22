import { NextResponse } from "next/server";
import { reportRepo } from "@/lib/db";

export async function GET() {
  try {
    const stats = await reportRepo.getStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    console.error("[API/stats] Error retrieving statistics:", err);
    return NextResponse.json(
      { error: "Failed to retrieve statistics." },
      { status: 500 }
    );
  }
}
