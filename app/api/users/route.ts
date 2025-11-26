// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  deleteUserById,
  getAdminCount,
  getUserById,
  getUsersWithStats,
  isEmailExists,
  isValidEmail,
  updateUser,
} from "@/lib/models/user-model";
import { validateAdminSession } from "@/lib/session-validator";

// ============================================
// GET - Fetch all users (PROTECTED - Admin only)
// ============================================
export async function GET() {
  try {
    // ✅ Validate admin session
    const { isValid, user, error } = await validateAdminSession();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: error || "Unauthorized",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    console.log("✅ Admin access granted:", user?.email);

    const { users, stats } = await getUsersWithStats();

    return NextResponse.json({
      success: true,
      data: users,
      stats,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data pengguna",
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new user (PROTECTED - Admin only)
// ============================================
export async function POST(request: NextRequest) {
  try {
    // ✅ Validate admin session
    const { isValid, user, error } = await validateAdminSession();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: error || "Unauthorized",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    console.log("✅ Admin creating user:", user?.email);

    const body = await request.json();
    const { name, email, role, is_active, email_verified, image } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email wajib diisi" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const emailExists = await isEmailExists(email);

    if (emailExists) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Generate unique user ID
    const userId = await createUser({
      email,
      name,
      role,
      is_active,
      email_verified,
      image,
    });

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil ditambahkan",
      data: { id: userId },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan pengguna" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update user (PROTECTED - Admin only)
// ============================================
export async function PUT(request: NextRequest) {
  try {
    // ✅ Validate admin session
    const { isValid, user, error } = await validateAdminSession();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: error || "Unauthorized",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    console.log("✅ Admin updating user:", user?.email);

    const body = await request.json();
    const { id, name, role, is_active, email_verified, image } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID pengguna wajib diisi" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await getUserById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Validate role
    if (role && !["admin", "user"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Role tidak valid" },
        { status: 400 }
      );
    }

    // Update user
    await updateUser({
      id,
      name,
      role,
      is_active,
      email_verified,
      image,
    });

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengguna" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete user (PROTECTED - Admin only)
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    // ✅ Validate admin session
    const { isValid, user, error } = await validateAdminSession();

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: error || "Unauthorized",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    console.log("✅ Admin deleting user:", user?.email);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID pengguna wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await getUserById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // ✅ Prevent deleting yourself
    if (user && existing.id === user.id) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus akun Anda sendiri" },
        { status: 400 }
      );
    }

    // Check if this is the last admin
    const adminCount = await getAdminCount();

    if (existing.role === "admin" && adminCount === 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Tidak dapat menghapus admin terakhir",
        },
        { status: 400 }
      );
    }

    // Delete user
    await deleteUserById(id);

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pengguna" },
      { status: 500 }
    );
  }
}
