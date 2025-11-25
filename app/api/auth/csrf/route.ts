// app/api/auth/csrf/route.ts
// ✅ FIXED: Add maxAge parameter to setCsrfTokenCookie

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { setCsrfTokenCookie } from "@/lib/helpers/cookie-helpers";

export async function GET(request: NextRequest) {
  console.log("🔐 CSRF token request started");

  // Generate CSRF token
  const csrfToken = randomBytes(32).toString("hex");
  console.log("✅ CSRF token generated:", csrfToken.substring(0, 20) + "...");

  // Create response
  const response = NextResponse.json({
    success: true,
    csrfToken,
  });

  // ✅ FIXED: Add maxAge parameter (7 days = 60 * 60 * 24 * 7)
  setCsrfTokenCookie(response, csrfToken, 60 * 60 * 24 * 7);

  console.log("✅ CSRF token cookie set");

  return response;
}
