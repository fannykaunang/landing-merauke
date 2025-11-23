// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// ============================================
// TYPES
// ============================================
interface User {
  id: string;
  email: string;
  name: string | null;
  email_verified: number;
  image: string | null;
  created_at: string;
  updated_at: string;
  is_active: number;
  role: "admin" | "user";
  last_login: string | null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate unique user ID
function generateUserId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `usr_${timestamp}_${random}`;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// GET - Fetch all users
// ============================================
export async function GET() {
  try {
    const users = await query<User[]>(`
      SELECT 
        id,
        email,
        name,
        email_verified,
        image,
        created_at,
        updated_at,
        is_active,
        role,
        last_login
      FROM users
      ORDER BY created_at DESC
    `);

    // Convert boolean fields from tinyint to boolean
    const formattedUsers = users.map((user) => ({
      ...user,
      email_verified: Boolean(user.email_verified),
      is_active: Boolean(user.is_active),
    }));

    // Get statistics
    const statsResult = await query<
      [
        {
          total: number;
          active_users: number;
          admin_users: number;
          verified_users: number;
        }
      ]
    >(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users,
        SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users
      FROM users
    `);

    const stats = statsResult[0] || {
      total: 0,
      active_users: 0,
      admin_users: 0,
      verified_users: 0,
    };

    return NextResponse.json({
      success: true,
      data: formattedUsers,
      stats: {
        total: stats.total,
        activeUsers: stats.active_users,
        adminUsers: stats.admin_users,
        verifiedUsers: stats.verified_users,
      },
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
    const { name, email, role, is_active, email_verified } = body;

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
    const existing = await query<User[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Generate unique user ID
    const userId = generateUserId();

    // Set default values
    const userRole = role || "user";
    const userIsActive = is_active !== undefined ? is_active : true;
    const userEmailVerified =
      email_verified !== undefined ? email_verified : false;

    // Insert new user
    await query(
      `
      INSERT INTO users (
        id, 
        email, 
        name, 
        role, 
        is_active, 
        email_verified,
        created_at, 
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
      [
        userId,
        email,
        name,
        userRole,
        userIsActive ? 1 : 0,
        userEmailVerified ? 1 : 0,
      ]
    );

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
    const { id, name, role, is_active, email_verified } = body;

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
    const existing = await query<User[]>("SELECT id FROM users WHERE id = ?", [
      id,
    ]);

    if (existing.length === 0) {
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
    await query(
      `
      UPDATE users 
      SET 
        name = ?,
        role = ?,
        is_active = ?,
        email_verified = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
      [
        name,
        role || "user",
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        email_verified !== undefined ? (email_verified ? 1 : 0) : 0,
        id,
      ]
    );

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
    const existing = await query<User[]>(
      "SELECT id, email FROM users WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
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
    const adminCount = await query<[{ count: number }]>(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );

    if (existing[0] && adminCount[0]?.count === 1) {
      const userToDelete = await query<User[]>(
        "SELECT role FROM users WHERE id = ?",
        [id]
      );
      if (userToDelete[0]?.role === "admin") {
        return NextResponse.json(
          {
            success: false,
            error: "Tidak dapat menghapus admin terakhir",
          },
          { status: 400 }
        );
      }
    }

    // Delete user
    await query("DELETE FROM users WHERE id = ?", [id]);

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
