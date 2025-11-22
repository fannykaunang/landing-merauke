import mysql from "mysql2/promise";

// Pool connection untuk MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3307"),
  user: process.env.DB_USER || "root80",
  password: process.env.DB_PASSWORD || "localhost@fanny87",
  database: process.env.DB_NAME || "landing",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Helper function untuk query
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const [results] = await pool.query(sql, params || []);
  return results as T;
}

// Types untuk database
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Website {
  id: number;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  category_id: number | null;
  tags: string | null;
  featured: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  email_verified: boolean;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}
