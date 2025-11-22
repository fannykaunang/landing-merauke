// app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Category } from "@/lib/types";

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await query<Category[]>(`
      SELECT 
        c.*,
        COUNT(w.id) as website_count
      FROM categories c
      LEFT JOIN websites w ON c.id = w.category_id AND w.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    // Get statistics
    const statsResult = await query<
      [{ total: number; total_websites: number }]
    >(`
      SELECT 
        COUNT(DISTINCT c.id) as total,
        COUNT(w.id) as total_websites
      FROM categories c
      LEFT JOIN websites w ON c.id = w.category_id AND w.is_active = 1
    `);
    const stats = statsResult[0] || { total: 0, total_websites: 0 };

    return NextResponse.json({
      success: true,
      data: categories,
      stats: {
        total: stats.total,
        totalWebsites: stats.total_websites,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data kategori",
      },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(name);

    // Check if slug already exists
    const existing = await query<Category[]>(
      "SELECT id FROM categories WHERE slug = ?",
      [finalSlug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan, gunakan slug lain" },
        { status: 400 }
      );
    }

    // Insert new category
    const result = await query<{ insertId: number }>(
      `
      INSERT INTO categories (name, slug, description, icon, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
      [name, finalSlug, description || null, icon || null]
    );

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: { id: (result as any).insertId },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan kategori" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, icon } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID kategori wajib diisi" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existing = await query<Category[]>(
      "SELECT id FROM categories WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(name);

    // Check if slug already exists (excluding current category)
    const slugExists = await query<Category[]>(
      "SELECT id FROM categories WHERE slug = ? AND id != ?",
      [finalSlug, id]
    );

    if (slugExists.length > 0) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan, gunakan slug lain" },
        { status: 400 }
      );
    }

    // Update category
    await query(
      `
      UPDATE categories 
      SET 
        name = ?,
        slug = ?,
        description = ?,
        icon = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
      [name, finalSlug, description || null, icon || null, id]
    );

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID kategori wajib diisi" },
        { status: 400 }
      );
    }

    const categoryId = parseInt(id);

    // Check if category exists
    const existing = await query<Category[]>(
      "SELECT id FROM categories WHERE id = ?",
      [categoryId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if category has websites
    const websiteCount = await query<[{ count: number }]>(
      "SELECT COUNT(*) as count FROM websites WHERE category_id = ?",
      [categoryId]
    );

    if (websiteCount[0]?.count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Tidak dapat menghapus kategori karena masih memiliki ${websiteCount[0].count} website terkait`,
        },
        { status: 400 }
      );
    }

    // Delete category
    await query("DELETE FROM categories WHERE id = ?", [categoryId]);

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
