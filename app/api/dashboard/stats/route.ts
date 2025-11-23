// app/api/dashboard/stats/route.ts

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// ============================================
// GET - Fetch Dashboard Statistics
// ============================================
export async function GET() {
  try {
    // Get total websites (active only)
    const websitesResult = await query<[{ total: number }]>(`
      SELECT COUNT(*) as total 
      FROM websites 
      WHERE is_active = 1
    `);
    const totalWebsites = websitesResult[0]?.total || 0;

    // Get total categories
    const categoriesResult = await query<[{ total: number }]>(`
      SELECT COUNT(*) as total 
      FROM categories
    `);
    const totalCategories = categoriesResult[0]?.total || 0;

    // Get total active users
    const usersResult = await query<[{ total: number }]>(`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE is_active = 1
    `);
    const totalUsers = usersResult[0]?.total || 0;

    // Get total verified users
    const verifiedUsersResult = await query<[{ total: number }]>(`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE email_verified = 1
    `);
    const totalVerifiedUsers = verifiedUsersResult[0]?.total || 0;

    // Get total admin users
    const adminUsersResult = await query<[{ total: number }]>(`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE role = 'admin' AND is_active = 1
    `);
    const totalAdminUsers = adminUsersResult[0]?.total || 0;

    // Get websites by category (top 5)
    const websitesByCategory = await query<
      Array<{ category_name: string; count: number }>
    >(`
      SELECT 
        c.name as category_name,
        COUNT(w.id) as count
      FROM categories c
      LEFT JOIN websites w ON c.id = w.category_id AND w.is_active = 1
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT 5
    `);

    // Get recent websites (last 5)
    const recentWebsites = await query<
      Array<{
        id: number;
        name: string;
        url: string;
        created_at: string;
      }>
    >(`
      SELECT 
        id,
        title,
        url,
        created_at
      FROM websites
      WHERE is_active = 1
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalWebsites,
          totalCategories,
          totalUsers,
          totalVerifiedUsers,
          totalAdminUsers,
        },
        websitesByCategory,
        recentWebsites,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil statistik dashboard",
      },
      { status: 500 }
    );
  }
}
