// app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  createCategory,
  deleteCategoryById,
  generateCategorySlug,
  getCategoryById,
  getCategories,
  getCategoryWebsiteCount,
  isCategorySlugExists,
  updateCategory,
} from "@/lib/models/category-model";

// GET - Fetch all categories
export async function GET() {
  try {
    const { categories, stats } = await getCategories();

    return NextResponse.json({
      success: true,
      data: categories,
      stats,
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
    const finalSlug = slug || generateCategorySlug(name);

    const slugExists = await isCategorySlugExists(finalSlug);
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan, gunakan slug lain" },
        { status: 400 }
      );
    }

    // Insert new category
    const insertId = await createCategory({
      name,
      slug: finalSlug,
      description,
      icon,
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: { id: insertId },
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
    const existing = await getCategoryById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const finalSlug = slug || generateCategorySlug(name);

    const slugExists = await isCategorySlugExists(finalSlug, id);
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan, gunakan slug lain" },
        { status: 400 }
      );
    }

    // Update category
    await updateCategory({
      id,
      name,
      slug: finalSlug,
      description,
      icon,
    });

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
    const existing = await getCategoryById(categoryId);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if category has websites
    const websiteCount = await getCategoryWebsiteCount(categoryId);

    if (websiteCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Tidak dapat menghapus kategori karena masih memiliki ${websiteCount} website terkait`,
        },
        { status: 400 }
      );
    }

    // Delete category
    await deleteCategoryById(categoryId);

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
