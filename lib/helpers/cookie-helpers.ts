// lib/cookie-helpers.ts
// Helper functions untuk cookie configuration yang konsisten

import { NextResponse } from "next/server";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Konfigurasi cookie yang aman dan konsisten untuk production
 */
export function getSecureCookieOptions(options?: {
  maxAge?: number;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}): Partial<ResponseCookie> {
  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = options?.maxAge ?? 60 * 60 * 24 * 7; // Default 7 hari
  const httpOnly = options?.httpOnly ?? true;

  // Untuk production dengan HTTPS
  // Jika menggunakan reverse proxy (nginx), pastikan X-Forwarded-Proto di-forward
  const sameSite = options?.sameSite ?? "lax";

  const cookieConfig: Partial<ResponseCookie> = {
    httpOnly,
    secure: isProduction, // true di production
    sameSite,
    maxAge,
    path: "/",
  };

  // Uncomment jika menggunakan subdomain dan perlu share cookie
  // if (process.env.COOKIE_DOMAIN) {
  //   cookieConfig.domain = process.env.COOKIE_DOMAIN; // e.g., ".merauke.go.id"
  // }

  return cookieConfig;
}

/**
 * Set session cookie dengan konfigurasi yang benar
 */
export function setSessionCookie(
  response: NextResponse,
  sessionId: string,
  maxAge?: number
): void {
  const options = getSecureCookieOptions({
    httpOnly: true,
    maxAge,
    sameSite: "lax",
  });

  console.log("Setting session cookie with options:", {
    ...options,
    sessionId: sessionId.substring(0, 10) + "...",
  });

  response.cookies.set("session_id", sessionId, options);
}

/**
 * Set CSRF token cookie (perlu dibaca oleh JavaScript)
 */
export function setCsrfTokenCookie(
  response: NextResponse,
  csrfToken: string
): void {
  const options = getSecureCookieOptions({
    httpOnly: false, // CSRF token perlu dibaca oleh JS
    maxAge: 60 * 60 * 24, // 24 jam
    sameSite: "lax",
  });

  response.cookies.set("csrf_token", csrfToken, options);
}

/**
 * Clear session cookie (untuk logout)
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set("session_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Clear CSRF token cookie
 */
export function clearCsrfTokenCookie(response: NextResponse): void {
  response.cookies.set("csrf_token", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
