// app/api/auth/csrf/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCSRFToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    // Generate new CSRF token
    const csrfToken = await createCSRFToken(sessionId);

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        csrf_token: csrfToken,
      },
    });

    // Set CSRF cookie (readable by JavaScript for forms)
    response.cookies.set("csrf_token", csrfToken, {
      httpOnly: false, // Must be readable by JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error generating CSRF token:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
