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

// ============================================
// GET - Fetch all users
// ============================================
export async function GET() {
  try {
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
// POST - Create new user
// ============================================
export async function POST(request: NextRequest) {
  try {
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
// PUT - Update user
// ============================================
export async function PUT(request: NextRequest) {
  try {
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
// DELETE - Delete user
// ============================================
export async function DELETE(request: NextRequest) {
  try {
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

    // Optional: Prevent deleting yourself (uncomment if you have session management)
    // const session = await getServerSession(authOptions);
    // if (session?.user?.email === existing[0].email) {
    //   return NextResponse.json(
    //     { success: false, error: "Tidak dapat menghapus akun Anda sendiri" },
    //     { status: 400 }
    //   );
    // }

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
