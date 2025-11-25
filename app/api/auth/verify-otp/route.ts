// app/api/auth/verify-otp/route.ts
// ✅ FINAL CORRECT VERSION - Sets session_id cookie properly

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  getUserByEmail,
  verifyOTP,
  createSession,
  checkRateLimit,
  recordLoginAttempt,
  updateUserLastLogin,
  validateEmail,
  sanitizeEmail,
  verifyCSRFToken,
} from "@/lib/auth";
import { sendLoginNotificationEmail } from "@/lib/email";
import { setSessionCookie } from "@/lib/helpers/cookie-helpers";

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    console.log("=== VERIFY OTP REQUEST ===");
    console.log("IP Address:", ipAddress);
    console.log("User Agent:", userAgent);

    // Parse request body
    const body = await request.json();
    const { email, otp, csrf_token } = body;

    console.log("Request data:", {
      email: email,
      otp_length: otp?.length,
      csrf_token_length: csrf_token?.length,
    });

    // Validate CSRF token
    if (!csrf_token || !(await verifyCSRFToken(csrf_token))) {
      console.error("❌ CSRF validation failed");
      return NextResponse.json(
        { success: false, error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    console.log("✅ CSRF validation passed");

    // Validate inputs
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: "Kode OTP harus 6 digit angka" },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Check rate limit
    const rateLimit = await checkRateLimit(ipAddress, sanitizedEmail);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(
            (rateLimit.retryAfter || 0) / 60
          )} menit.`,
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Get user
    const user = await getUserByEmail(sanitizedEmail);
    if (!user) {
      await recordLoginAttempt(sanitizedEmail, ipAddress, userAgent, false);
      return NextResponse.json(
        { success: false, error: "Email atau kode OTP tidak valid" },
        { status: 401 }
      );
    }

    // Verify OTP
    console.log("🔍 Verifying OTP...");
    const isValidOTP = await verifyOTP(sanitizedEmail, otp, "login");

    if (!isValidOTP) {
      console.error("❌ OTP verification failed");
      await recordLoginAttempt(sanitizedEmail, ipAddress, userAgent, false);
      return NextResponse.json(
        {
          success: false,
          error: "Kode OTP tidak valid atau sudah kadaluarsa",
          remainingAttempts: rateLimit.remainingAttempts - 1,
        },
        { status: 401 }
      );
    }

    console.log("✅ OTP verified successfully");

    // Create session
    const sessionId = await createSession(user.id, ipAddress, userAgent);
    console.log("✅ Session created:", sessionId.substring(0, 20) + "...");

    // Update user last login
    await updateUserLastLogin(user.id);

    // Record successful login
    await recordLoginAttempt(sanitizedEmail, ipAddress, userAgent, true);

    // Send login notification email (async, don't wait)
    sendLoginNotificationEmail(sanitizedEmail, ipAddress, userAgent).catch(
      (err) => console.error("Failed to send login notification:", err)
    );

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil!",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });

    // ============================================
    // 🔥 CRITICAL: Set session cookie properly!
    // ============================================
    // Use helper function untuk consistency
    // maxAge: 24 hours = 60 * 60 * 24 seconds
    setSessionCookie(response, sessionId, 60 * 60 * 24);

    console.log("✅ Session cookie set");
    console.log("Cookie config:", {
      name: "session_id", // ← CRITICAL: Must be 'session_id' not 'session'
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // ← CRITICAL: Must be 'lax' not 'strict'
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    console.log("✅ Login successful for:", sanitizedEmail);

    return response;
  } catch (error) {
    console.error("❌ Error in verify-otp:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
