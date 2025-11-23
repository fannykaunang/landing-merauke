// lib/models/website-model.ts
import { RowDataPacket } from "mysql2";

import {
  executeInsert,
  executeQuery,
  executeUpdate,
  getOne,
} from "@/lib/helpers/db-helpers";
import { Website } from "@/lib/types";

interface WebsiteStatsRow extends RowDataPacket {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

interface WebsiteCountRow extends RowDataPacket {
  total: number;
}

interface WebsiteQueryOptions {
  search?: string;
  category?: string;
  featured?: string | null;
  isActive?: string | null;
  page?: number;
  limit?: number;
}

interface WebsiteQueryResult {
  websites: Website[];
  total: number;
  stats: {
    total: number;
    active: number;
    inactive: number;
    featured: number;
  };
}

const getWhereClause = (
  filters: Pick<
    WebsiteQueryOptions,
    "search" | "category" | "featured" | "isActive"
  >
): { clause: string; params: (string | number)[] } => {
  const whereConditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.search) {
    whereConditions.push(
      "(w.title LIKE ? OR w.description LIKE ? OR w.tags LIKE ?)"
    );
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters.category && filters.category !== "all") {
    whereConditions.push("c.slug = ?");
    params.push(filters.category);
  }

  if (filters.featured === "true") {
    whereConditions.push("w.featured = 1");
  } else if (filters.featured === "false") {
    whereConditions.push("w.featured = 0");
  }

  if (filters.isActive && filters.isActive !== "all") {
    whereConditions.push("w.is_active = ?");
    params.push(parseInt(filters.isActive));
  }

  return {
    clause:
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "",
    params,
  };
};

export async function getWebsites(
  options: WebsiteQueryOptions = {}
): Promise<WebsiteQueryResult> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 50;
  const offset = (page - 1) * limit;
  const { clause, params } = getWhereClause(options);

  const countResult = await executeQuery<WebsiteCountRow>(
    `
      SELECT COUNT(*) as total
      FROM websites w
      LEFT JOIN categories c ON w.category_id = c.id
      ${clause}
    `,
    params
  );
  const total = countResult[0]?.total ?? 0;

  const statsResult = await executeQuery<WebsiteStatsRow>(
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

  const stats =
    statsResult[0] ??
    ({ total: 0, active: 0, inactive: 0, featured: 0 } as WebsiteStatsRow);

  const websites = await executeQuery<Website & RowDataPacket>(
    `
      SELECT
        w.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon
      FROM websites w
      LEFT JOIN categories c ON w.category_id = c.id
      ${clause}
      ORDER BY w.featured DESC, w.created_at DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset]
  );

  return {
    websites,
    total,
    stats: {
      total: stats.total,
      active: stats.active,
      inactive: stats.inactive,
      featured: stats.featured,
    },
  };
}

export interface WebsiteCreateInput {
  title: string;
  description?: string | null;
  url: string;
  image_url?: string | null;
  category_id?: number | null;
  tags?: string | null;
  featured?: boolean;
  is_active?: boolean;
  created_by?: string | null;
}

export async function createWebsite(data: WebsiteCreateInput): Promise<number> {
  return executeInsert(
    `
      INSERT INTO websites
        (title, description, url, image_url, category_id, tags, featured, is_active, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    [
      data.title,
      data.description ?? null,
      data.url,
      data.image_url ?? null,
      data.category_id ?? null,
      data.tags ?? null,
      data.featured ? 1 : 0,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.created_by ?? null,
    ]
  );
}

export interface WebsiteUpdateInput {
  id: number;
  title?: string;
  description?: string | null;
  url?: string;
  image_url?: string | null;
  category_id?: number | null;
  tags?: string | null;
  featured?: boolean;
  is_active?: boolean;
}

export async function getWebsiteById(id: number): Promise<Website | null> {
  return getOne<Website & RowDataPacket>(
    `SELECT * FROM websites WHERE id = ?`,
    [id]
  );
}

export async function updateWebsite(data: WebsiteUpdateInput): Promise<number> {
  return executeUpdate(
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
      data.title ?? null,
      data.description ?? null,
      data.url ?? null,
      data.image_url ?? null,
      data.category_id ?? null,
      data.tags ?? null,
      data.featured ? 1 : 0,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 0,
      data.id,
    ]
  );
}

export async function deleteWebsiteById(id: number): Promise<number> {
  return executeUpdate(`DELETE FROM websites WHERE id = ?`, [id]);
}
