import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { userRepo } from "./db";

const JWT_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "jalrakshak-dev-super-secure-jwt-secret-key-32chars";
const COOKIE_NAME = "jalrakshak_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  staffId?: string;
  state?: string;
  district?: string;
  taluk?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function createSessionToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      staffId: user.staffId,
      state: user.state,
      district: user.district,
      taluk: user.taluk,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id || !decoded.role) return null;
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      staffId: decoded.staffId,
      state: decoded.state,
      district: decoded.district,
      taluk: decoded.taluk,
    };
  } catch {
    return null;
  }
}

/**
 * Server-side session verification from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Server-side RBAC guard
 */
export async function requireAuth(requiredRole?: "admin" | "staff"): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }

  if (requiredRole === "admin" && session.role !== "admin") {
    throw new Error("FORBIDDEN: Administrative privileges required");
  }

  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
