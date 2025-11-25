// lib/cookie-helpers.ts
// ✅ FIXED: Use 'session_id' consistently (not 'session')

import { NextResponse } from "next/server";

/**
 * Set session cookie with consistent settings
 * Cookie name: 'session_id' (to match database and existing implementation)
 */
export function setSessionCookie(
  response: NextResponse,
  sessionId: string,
  maxAge: number
) {
  response.cookies.set("session_id", sessionId, {
    // ✅ Changed from 'session' to 'session_id'
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ Allow cookie on navigation/reload
    path: "/",
    maxAge: maxAge,
  });

  console.log("✅ Session cookie set:", {
    name: "session_id",
    sessionId: sessionId.substring(0, 20) + "...",
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000).toISOString(),
  });

  return response;
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set("session_id", "", {
    // ✅ Changed from 'session' to 'session_id'
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  console.log("🗑️ Session cookie cleared");

  return response;
}

/**
 * Set CSRF token cookie
 */
export function setCsrfTokenCookie(
  response: NextResponse,
  csrfToken: string,
  maxAge: number
) {
  response.cookies.set("csrf_token", csrfToken, {
    httpOnly: false, // Client needs to read this
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge,
  });

  console.log("✅ CSRF token cookie set");

  return response;
}

/**
 * Clear CSRF token cookie
 */
export function clearCsrfTokenCookie(response: NextResponse) {
  response.cookies.set("csrf_token", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  console.log("🗑️ CSRF token cookie cleared");

  return response;
}

/**
 * Get cookie config for consistent settings across the app
 */
export function getCookieConfig(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAge,
  };
}
