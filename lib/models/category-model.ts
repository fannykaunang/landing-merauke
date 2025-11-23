// lib/models/category-model.ts
import { RowDataPacket } from "mysql2";

import {
  executeInsert,
  executeQuery,
  executeUpdate,
  getOne,
} from "@/lib/helpers/db-helpers";
import { Category } from "@/lib/types";

interface CategoryStatsRow extends RowDataPacket {
  total: number;
  total_websites: number;
}

interface CategoryCountRow extends RowDataPacket {
  website_count: number;
}

export interface CategoryQueryResult {
  categories: Category[];
  stats: {
    total: number;
    totalWebsites: number;
  };
}

export const generateCategorySlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function isCategorySlugExists(
  slug: string,
  excludeId?: number
): Promise<boolean> {
  const result = await executeQuery<RowDataPacket & { count: number }>(
    `SELECT COUNT(*) as count FROM categories WHERE slug = ?${
      excludeId ? " AND id != ?" : ""
    }`,
    excludeId ? [slug, excludeId] : [slug]
  );
  return (result[0]?.count ?? 0) > 0;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  return getOne<Category & RowDataPacket>(
    `SELECT * FROM categories WHERE id = ?`,
    [id]
  );
}

export async function getCategories(): Promise<CategoryQueryResult> {
  const categories = await executeQuery<Category & RowDataPacket>(
    `
      SELECT
        c.*,
        COUNT(w.id) as website_count
      FROM categories c
      LEFT JOIN websites w ON c.id = w.category_id AND w.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `,
    []
  );

  const statsResult = await executeQuery<CategoryStatsRow>(
    `
      SELECT
        COUNT(DISTINCT c.id) as total,
        COUNT(w.id) as total_websites
      FROM categories c
      LEFT JOIN websites w ON c.id = w.category_id AND w.is_active = 1
    `,
    []
  );

  const stats = statsResult[0] ?? { total: 0, total_websites: 0 };

  return {
    categories,
    stats: {
      total: stats.total,
      totalWebsites: stats.total_websites,
    },
  };
}

export interface CategoryCreateInput {
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
}

export async function createCategory(
  data: CategoryCreateInput
): Promise<number> {
  const finalSlug = data.slug || generateCategorySlug(data.name);

  return executeInsert(
    `
      INSERT INTO categories (name, slug, description, icon, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
    [data.name, finalSlug, data.description ?? null, data.icon ?? null]
  );
}

export interface CategoryUpdateInput {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
}

export async function updateCategory(
  data: CategoryUpdateInput
): Promise<number> {
  const finalSlug = data.slug || generateCategorySlug(data.name);

  return executeUpdate(
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
    [data.name, finalSlug, data.description ?? null, data.icon ?? null, data.id]
  );
}

export async function deleteCategoryById(id: number): Promise<number> {
  return executeUpdate(`DELETE FROM categories WHERE id = ?`, [id]);
}

export async function getCategoryWebsiteCount(
  categoryId: number
): Promise<number> {
  const result = await executeQuery<CategoryCountRow>(
    `SELECT COUNT(*) as website_count FROM websites WHERE category_id = ?`,
    [categoryId]
  );
  return result[0]?.website_count ?? 0;
}
