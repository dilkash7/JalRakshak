import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Check if Cloudinary credentials are fully configured
    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = "jalrakshak/reports";

      // Cloudinary signature parameters must be sorted alphabetically
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

      return NextResponse.json({
        success: true,
        mode: "cloudinary",
        cloudName,
        apiKey,
        timestamp,
        signature,
        folder,
        maxFileSize: 5242880, // 5MB
      });
    }

    // Local zero-config development fallback
    return NextResponse.json({
      success: true,
      mode: "dev_fallback",
      message:
        "Running in local development mode without Cloudinary credentials. Uploads will be handled via local dev preview.",
      maxFileSize: 5242880,
    });
  } catch (err: any) {
    console.error("[API/uploads/sign] Error generating signature:", err);
    return NextResponse.json(
      { error: "Failed to generate upload signature." },
      { status: 500 }
    );
  }
}
