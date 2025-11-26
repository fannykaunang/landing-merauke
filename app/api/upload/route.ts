// app/api/upload/route.ts

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { validateAdminSession } from "@/lib/session-validator";

export async function POST(request: Request) {
  try {
    // ✅ Validate admin session
    const { isValid, user, error } = await validateAdminSession();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: error || "Unauthorized - Admin access required",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    console.log("✅ Admin uploading file:", user?.email);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Hanya file gambar yang diperbolehkan" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${sanitizedName}`;
    const uploadDir = path.join(process.cwd(), "public", "images");

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      path: `images/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
