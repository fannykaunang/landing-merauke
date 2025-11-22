import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { invalidateSession } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      // Invalidate session in database
      await invalidateSession(sessionId);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // Clear session cookie
    response.cookies.set("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    // Clear CSRF cookie
    response.cookies.set("csrf_token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in logout:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
