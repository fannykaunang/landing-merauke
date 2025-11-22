import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  getUserByEmail,
  createOTP,
  checkRateLimit,
  recordLoginAttempt,
  validateEmail,
  sanitizeEmail,
  verifyCSRFToken,
} from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Parse request body
    const body = await request.json();
    const { email, csrf_token } = body;

    // Validate CSRF token
    if (!csrf_token || !(await verifyCSRFToken(csrf_token))) {
      return NextResponse.json(
        { success: false, error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Validate email format
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
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

    // Check if user exists
    const user = await getUserByEmail(sanitizedEmail);
    if (!user) {
      // Record failed attempt (user not found)
      await recordLoginAttempt(sanitizedEmail, ipAddress, userAgent, false);

      // Don't reveal if user exists or not (security)
      // But we still return success to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: "Jika email terdaftar, kode OTP akan dikirim.",
      });
    }

    // Generate and save OTP
    const otp = await createOTP(sanitizedEmail, "login");

    // Send OTP via email
    const emailSent = await sendOTPEmail(sanitizedEmail, otp, "login");

    if (!emailSent) {
      console.error("Failed to send OTP email to:", sanitizedEmail);
      return NextResponse.json(
        { success: false, error: "Gagal mengirim email OTP. Coba lagi nanti." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kode OTP telah dikirim ke email Anda.",
      data: {
        email: sanitizedEmail,
        expiresIn: 300, // 5 minutes in seconds
      },
    });
  } catch (error) {
    console.error("Error in request-otp:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
