// app/api/uploads/[...path]/route.ts
// ✅ Serve uploaded files dynamically (no restart needed!)

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // ✅ Await params first
  const params = await context.params;
  try {
    // Get file path from params
    const filePath = params.path.join("/");

    console.log("📁 Serving file:", filePath);

    // Construct full path (adjust based on your upload folder)
    // If uploads are in /uploads folder:
    const fullPath = join(process.cwd(), "public", "images", filePath);

    // Or if uploads are in /public/uploads:
    // const fullPath = join(process.cwd(), "public", "uploads", filePath);

    // Check if file exists
    if (!existsSync(fullPath)) {
      console.error("❌ File not found:", fullPath);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(fullPath);

    // Determine content type based on file extension
    const ext = filePath.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      ico: "image/x-icon",
    };

    const contentType = contentTypeMap[ext || ""] || "application/octet-stream";

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("❌ Error serving file:", error);
    return NextResponse.json({ error: "Error serving file" }, { status: 500 });
  }
}
