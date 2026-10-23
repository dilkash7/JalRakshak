/**
 * JalRakshak Client Demo Authentication
 * Lightweight, client-side authentication for competition prototype.
 * Eliminates server-side session cookies, JWT secrets, and external auth providers.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { clientStore, StoredUser } from "./client-store";

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

const AUTH_STORAGE_KEY = "jalrakshak_demo_session";
const AUTH_EVENT = "jalrakshak_auth_changed";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyAuthChange(): void {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  }
}

export const clientAuth = {
  /**
   * Log in with Email or Staff Badge ID and Password
   */
  login(
    identifier: string,
    password: string
  ): { success: boolean; user?: SessionUser; error?: string } {
    if (!isBrowser()) {
      return { success: false, error: "Authentication requires a browser environment." };
    }

    const clean = identifier.trim();
    if (!clean || !password) {
      return { success: false, error: "Please enter your Email or Staff Badge ID and password." };
    }

    const cleanLower = clean.toLowerCase();
    const cleanUpper = clean.toUpperCase();

    const allUsers = clientStore.getAllUsers();
    const user = allUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanLower ||
        (u.staffId && u.staffId.toUpperCase() === cleanUpper)
    );

    if (!user) {
      return {
        success: false,
        error: "Invalid credentials. Please verify your email address or Staff Badge ID.",
      };
    }

    if (user.status === "suspended") {
      return {
        success: false,
        error: "This staff account has been suspended by the administrator.",
      };
    }

    // Prototype password matching:
    // Accept user's stored password or standard demo defaults
    const isPasswordValid =
      (user.password && password === user.password) ||
      (user.role === "admin" && (password === "JalRakshak@2026Admin!" || password === "Admin@123")) ||
      (user.role === "staff" && (password === "JalRakshak@2026Staff!" || password === "Staff@123"));

    if (!isPasswordValid) {
      return { success: false, error: "Invalid password. Please check your credentials." };
    }

    const sessionUser: SessionUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      staffId: user.staffId,
      state: user.state,
      district: user.district,
      taluk: user.taluk,
    };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    notifyAuthChange();

    return { success: true, user: sessionUser };
  },

  /**
   * Log out and clear demo session
   */
  logout(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    notifyAuthChange();
  },

  /**
   * Get current authenticated demo user
   */
  getCurrentUser(): SessionUser | null {
    if (!isBrowser()) return null;

    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  },

  /**
   * Check if any user is currently authenticated
   */
  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser());
  },
};

/**
 * React hook for reactive authentication state across all components
 */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(() => {
    setUser(clientAuth.getCurrentUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    if (!isBrowser()) return;

    const handleAuthEvent = () => refresh();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) refresh();
    };

    window.addEventListener(AUTH_EVENT, handleAuthEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [refresh]);

  const logout = useCallback(() => {
    clientAuth.logout();
    setUser(null);
  }, []);

  return { user, loading, logout, refresh };
}
