// app/api/websites/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createWebsite,
  deleteWebsiteById,
  getWebsiteById,
  getWebsites,
  updateWebsite,
} from "@/lib/models/website-model";

// GET - Fetch all websites with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured");
    const isActive = searchParams.get("is_active"); // 'all' | '1' | '0'

    const pageParam = parseInt(searchParams.get("page") || "1");
    const limitParam = parseInt(searchParams.get("limit") || "50");
    const page = Number.isNaN(pageParam) ? 1 : pageParam;
    const limit = Number.isNaN(limitParam) ? 50 : limitParam;

    const { websites, stats, total } = await getWebsites({
      search,
      category,
      featured,
      isActive,
      page,
      limit,
    });

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
    const insertId = await createWebsite({
      title,
      description,
      url,
      image_url,
      category_id,
      tags,
      featured,
      is_active,
      created_by,
    });

    return NextResponse.json({
      success: true,
      message: "Website berhasil ditambahkan",
      data: { id: insertId },
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
    const existing = await getWebsiteById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Website tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update website
    await updateWebsite({
      id,
      title,
      description,
      url,
      image_url,
      category_id,
      tags,
      featured,
      is_active,
    });

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
    const existing = await getWebsiteById(websiteId);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Website tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete website
    await deleteWebsiteById(websiteId);

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
