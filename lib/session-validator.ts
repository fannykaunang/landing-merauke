// lib/auth/session-validator.ts
import { cookies } from "next/headers";
import { query } from "@/lib/db";

interface Session {
  id: string;
  user_id: number;
  expires_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function validateSession(): Promise<{
  isValid: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
      return { isValid: false, error: "No session found" };
    }

    // Check session in database
    const sessions = (await query(
      "SELECT * FROM sessions WHERE id = ? AND expires_at > NOW()",
      [sessionId]
    )) as Session[];

    if (!sessions || sessions.length === 0) {
      return { isValid: false, error: "Session expired or invalid" };
    }

    const session = sessions[0];

    // Get user data
    const users = (await query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [session.user_id]
    )) as User[];

    if (!users || users.length === 0) {
      return { isValid: false, error: "User not found" };
    }

    return { isValid: true, user: users[0] };
  } catch (error) {
    console.error("Session validation error:", error);
    return { isValid: false, error: "Internal server error" };
  }
}

// Helper untuk check apakah user adalah admin
export async function validateAdminSession(): Promise<{
  isValid: boolean;
  user?: User;
  error?: string;
}> {
  const result = await validateSession();

  if (!result.isValid) {
    return result;
  }

  if (result.user?.role !== "admin") {
    return { isValid: false, error: "Insufficient permissions" };
  }

  return result;
}

// ✅ NEW: Helper untuk get current user (optional, tidak wajib login)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
      return null;
    }

    const sessions = (await query(
      "SELECT * FROM sessions WHERE id = ? AND expires_at > NOW()",
      [sessionId]
    )) as Session[];

    if (!sessions || sessions.length === 0) {
      return null;
    }

    const users = (await query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [sessions[0].user_id]
    )) as User[];

    return users[0] || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
