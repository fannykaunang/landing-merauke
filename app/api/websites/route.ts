// app/api/websites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Website } from "@/lib/types";

// GET - Fetch all websites with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured");
    const isActive = searchParams.get("is_active"); // 'all' | '1' | '0'
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    const params: (string | number)[] = [];

    // Search filter
    if (search) {
      whereConditions.push(
        "(w.title LIKE ? OR w.description LIKE ? OR w.tags LIKE ?)"
      );
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category && category !== "all") {
      whereConditions.push("c.slug = ?");
      params.push(category);
    }

    // Featured filter
    if (featured === "true") {
      whereConditions.push("w.featured = 1");
    } else if (featured === "false") {
      whereConditions.push("w.featured = 0");
    }

    // is_active filter
    if (isActive && isActive !== "all") {
      whereConditions.push("w.is_active = ?");
      params.push(parseInt(isActive));
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get total count
    const countResult = await query<[{ total: number }]>(
      `
      SELECT COUNT(*) as total
      FROM websites w
      LEFT JOIN categories c ON w.category_id = c.id
      ${whereClause}
    `,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get statistics
    const statsResult = await query<
      [{ total: number; active: number; inactive: number; featured: number }]
    >(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured
      FROM websites
    `,
      []
    );
    const stats = statsResult[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      featured: 0,
    };

    // Get websites with pagination
    const websites = await query<Website[]>(
      `
      SELECT 
        w.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon
      FROM websites w
      LEFT JOIN categories c ON w.category_id = c.id
      ${whereClause}
      ORDER BY w.featured DESC, w.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `,
      params
    );

    return NextResponse.json({
      success: true,
      data: websites,
      stats: {
        total: stats.total,
        active: stats.active,
        inactive: stats.inactive,
        featured: stats.featured,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data website",
      },
      { status: 500 }
    );
  }
}

// POST - Create new website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      url,
      image_url,
      category_id,
      tags,
      featured,
      is_active,
      created_by,
    } = body;

    // Validation
    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: "Title dan URL wajib diisi" },
        { status: 400 }
      );
    }

    // Insert new website
    const result = await query<{ insertId: number }>(
      `
      INSERT INTO websites 
        (title, description, url, image_url, category_id, tags, featured, is_active, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
      [
        title,
        description || null,
        url,
        image_url || null,
        category_id || null,
        tags || null,
        featured ? 1 : 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        created_by || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Website berhasil ditambahkan",
      data: { id: (result as any).insertId },
    });
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan website" },
      { status: 500 }
    );
  }
}

// PUT - Update website
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      url,
      image_url,
      category_id,
      tags,
      featured,
      is_active,
    } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID website wajib diisi" },
        { status: 400 }
      );
    }

    // Check if website exists
    const existing = await query<Website[]>(
      "SELECT id FROM websites WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Website tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update website
    await query(
      `
      UPDATE websites 
      SET 
        title = ?,
        description = ?,
        url = ?,
        image_url = ?,
        category_id = ?,
        tags = ?,
        featured = ?,
        is_active = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
      [
        title,
        description || null,
        url,
        image_url || null,
        category_id || null,
        tags || null,
        featured ? 1 : 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Website berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating website:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui website" },
      { status: 500 }
    );
  }
}

// DELETE - Delete website
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID website wajib diisi" },
        { status: 400 }
      );
    }

    const websiteId = parseInt(id);

    // Check if website exists
    const existing = await query<Website[]>(
      "SELECT id FROM websites WHERE id = ?",
      [websiteId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Website tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete website
    await query("DELETE FROM websites WHERE id = ?", [websiteId]);

    return NextResponse.json({
      success: true,
      message: "Website berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting website:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus website" },
      { status: 500 }
    );
  }
}
