// lib/models/user-model.ts
import { RowDataPacket } from "mysql2";

import {
  executeInsert,
  executeQuery,
  executeUpdate,
  getOne,
} from "@/lib/helpers/db-helpers";
import { User } from "@/lib/types";

interface UserRow extends RowDataPacket {
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

interface UserStatsRow extends RowDataPacket {
  total: number;
  active_users: number;
  admin_users: number;
  verified_users: number;
}

const mapUserRow = (row: UserRow): User => ({
  ...row,
  email_verified: Boolean(row.email_verified),
  is_active: Boolean(row.is_active),
});

export const generateUserId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `usr_${timestamp}_${random}`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function isEmailExists(
  email: string,
  excludeId?: string
): Promise<boolean> {
  const result = await executeQuery<RowDataPacket & { count: number }>(
    `SELECT COUNT(*) as count FROM users WHERE email = ?${
      excludeId ? " AND id != ?" : ""
    }`,
    excludeId ? [email, excludeId] : [email]
  );

  return (result[0]?.count ?? 0) > 0;
}

export async function getUserById(id: string): Promise<User | null> {
  const row = await getOne<UserRow>("SELECT * FROM users WHERE id = ?", [id]);
  return row ? mapUserRow(row) : null;
}

export async function getUsersWithStats(): Promise<{
  users: User[];
  stats: {
    total: number;
    activeUsers: number;
    adminUsers: number;
    verifiedUsers: number;
  };
}> {
  const userRows = await executeQuery<UserRow>(
    `
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
    `,
    []
  );

  const users = userRows.map(mapUserRow);

  const statsResult = await executeQuery<UserStatsRow>(
    `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users,
        SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users
      FROM users
    `,
    []
  );

  const stats = statsResult[0] ?? {
    total: 0,
    active_users: 0,
    admin_users: 0,
    verified_users: 0,
  };

  return {
    users,
    stats: {
      total: stats.total,
      activeUsers: stats.active_users,
      adminUsers: stats.admin_users,
      verifiedUsers: stats.verified_users,
    },
  };
}

export interface UserCreateInput {
  email: string;
  name: string;
  role?: "admin" | "user";
  is_active?: boolean;
  email_verified?: boolean;
  image?: string | null;
  id?: string;
}

export async function createUser(data: UserCreateInput): Promise<string> {
  const userId = data.id ?? generateUserId();
  const userRole = data.role ?? "user";
  const isActive = data.is_active ?? true;
  const emailVerified = data.email_verified ?? false;

  await executeInsert(
    `
      INSERT INTO users (
        id,
        email,
        name,
        role,
        is_active,
        email_verified,
        image,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    [
      userId,
      data.email,
      data.name,
      userRole,
      isActive ? 1 : 0,
      emailVerified ? 1 : 0,
      data.image ?? null,
    ]
  );

  return userId;
}

export interface UserUpdateInput {
  id: string;
  name: string;
  role?: "admin" | "user";
  is_active?: boolean;
  email_verified?: boolean;
  image?: string | null;
}

export async function updateUser(data: UserUpdateInput): Promise<number> {
  return executeUpdate(
    `
      UPDATE users
      SET
        name = ?,
        role = ?,
        is_active = ?,
        email_verified = ?,
        image = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
    [
      data.name,
      data.role ?? "user",
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.email_verified !== undefined ? (data.email_verified ? 1 : 0) : 0,
      data.image ?? null,
      data.id,
    ]
  );
}

export async function deleteUserById(id: string): Promise<number> {
  return executeUpdate(`DELETE FROM users WHERE id = ?`, [id]);
}

export async function getAdminCount(): Promise<number> {
  const result = await executeQuery<RowDataPacket & { count: number }>(
    "SELECT COUNT(*) as count FROM users WHERE role = 'admin'",
    []
  );

  return result[0]?.count ?? 0;
}
