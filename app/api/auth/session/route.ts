// app/api/auth/session/route.ts
// ✅ ALTERNATIVE FIX: Explicit array typing (simpler approach)

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  console.log("🔍 Session check started");
  console.log("📍 Request URL:", request.url);

  // ✅ Read 'session_id' cookie (not 'session')
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  console.log("📝 Session ID from cookie:", sessionId ? "EXISTS" : "MISSING");

  if (!sessionId) {
    console.log("❌ No session_id cookie found");
    console.log(
      "📝 Available cookies:",
      cookieStore
        .getAll()
        .map((c) => c.name)
        .join(", ")
    );
    return NextResponse.json(
      { success: false, error: "Unauthorized", authenticated: false },
      { status: 401 }
    );
  }

  console.log("🔑 Session ID:", sessionId.substring(0, 20) + "...");

  try {
    // ✅ SIMPLE FIX: Cast result as array explicitly
    const sessions = (await query(
      "SELECT * FROM sessions WHERE id = ? AND expires_at > NOW()",
      [sessionId]
    )) as Session[];

    if (!sessions || sessions.length === 0) {
      console.log("❌ Session not found in database or expired");
      return NextResponse.json(
        { success: false, error: "Unauthorized", authenticated: false },
        { status: 401 }
      );
    }

    const session = sessions[0];
    console.log("✅ Session found:", {
      id: session.id.substring(0, 20) + "...",
      user_id: session.user_id,
      expires_at: session.expires_at,
    });

    // Get user data
    const users = (await query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [session.user_id]
    )) as User[];

    if (!users || users.length === 0) {
      console.log("❌ User not found for session");
      return NextResponse.json(
        { success: false, error: "User not found", authenticated: false },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log(
      "✅ Session valid for user:",
      user.username,
      "(ID:",
      user.id + ")"
    );

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      session: {
        id: session.id,
        expires_at: session.expires_at,
      },
    });
  } catch (error) {
    console.error("❌ Session check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        authenticated: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
