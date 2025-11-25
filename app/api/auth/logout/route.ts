// app/api/auth/logout/route.ts
// ✅ FIXED: Use 'session_id' consistently

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import {
  clearSessionCookie,
  clearCsrfTokenCookie,
} from "@/lib/helpers/cookie-helpers";

export async function POST(request: NextRequest) {
  console.log("🚪 Logout request started");

  // ✅ Read 'session_id' cookie (not 'session')
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  console.log("📝 Session ID from cookie:", sessionId ? "EXISTS" : "MISSING");

  if (sessionId) {
    try {
      // Delete session from database
      await query("DELETE FROM sessions WHERE id = ?", [sessionId]);
      console.log(
        "✅ Session deleted from database:",
        sessionId.substring(0, 20) + "..."
      );
    } catch (error) {
      console.error("❌ Error deleting session:", error);
      // Continue anyway to clear cookies
    }
  }

  // Clear cookies
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  clearSessionCookie(response); // Will clear 'session_id'
  clearCsrfTokenCookie(response);

  console.log("✅ Logout completed, cookies cleared");

  return response;
}
