import { NextRequest, NextResponse } from "next/server";
import { AdminLoginSchema } from "@/lib/validation";
import { userRepo } from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const maxAttempts = process.env.NODE_ENV === "production" ? 5 : 50;
    const limiter = await rateLimit(`login_${ip}`, maxAttempts, 60);

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 1 minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = AdminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid credentials format.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await userRepo.findByEmailOrStaffId(email);

    if (!user) {
      console.warn(`[Auth] No user found with identifier: ${email}`);
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email or Staff Badge ID." },
        { status: 401 }
      );
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        { error: "This staff account has been suspended." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      staffId: user.staffId,
      state: user.state,
      district: user.district,
      taluk: user.taluk,
    };

    const token = createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error("[API/auth/login] Error during login:", err);
    return NextResponse.json(
      { error: "An internal error occurred during authentication." },
      { status: 500 }
    );
  }
}
