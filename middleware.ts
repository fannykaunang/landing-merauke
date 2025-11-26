// middleware.ts (di root project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Protect all /api/backend/* routes (except auth)
  if (
    pathname.startsWith("/api/backend") &&
    !pathname.startsWith("/api/backend/auth")
  ) {
    const sessionId = request.cookies.get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", authenticated: false },
        { status: 401 }
      );
    }

    // Session validation akan dilakukan di masing-masing route
    // Middleware hanya check cookie existence
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/backend/:path*",
    "/backend/:path*", // Protect frontend backend pages too
  ],
};
