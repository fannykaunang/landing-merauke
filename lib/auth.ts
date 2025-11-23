// lib/auth.ts

import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { User, Session, OTPCode, LoginAttempt, CSRFToken } from "@/lib/types";
import crypto from "crypto";
import { getSettingValue } from "@/lib/models/app-settings-model";

// =====================================================
// CONSTANTS
// =====================================================
const SESSION_COOKIE_NAME = "session_id";
const CSRF_COOKIE_NAME = "csrf_token";
const SESSION_EXPIRY_HOURS = 24;
const OTP_EXPIRY_MINUTES = 5;
const CSRF_EXPIRY_HOURS = 24;
const DEFAULT_MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Generate random string
export function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate session ID
export function generateSessionId(): string {
  return `sess_${generateRandomString(32)}`;
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return generateRandomString(64);
}

// Hash string dengan SHA256
export function hashString(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

// =====================================================
// USER FUNCTIONS
// =====================================================

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await query<User[]>(
    "SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
    [email.toLowerCase()]
  );
  return users[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await query<User[]>(
    "SELECT * FROM users WHERE id = ? AND is_active = 1 LIMIT 1",
    [id]
  );
  return users[0] || null;
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  await query("UPDATE users SET last_login = NOW() WHERE id = ?", [userId]);
}

// =====================================================
// SESSION FUNCTIONS
// =====================================================

export async function createSession(
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(
    Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
  );

  await query(
    `INSERT INTO sessions (id, user_id, expires_at, ip_address, user_agent, is_active, last_activity)
     VALUES (?, ?, ?, ?, ?, 1, NOW())`,
    [sessionId, userId, expiresAt, ipAddress, userAgent]
  );

  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessions = await query<Session[]>(
    `SELECT * FROM sessions 
     WHERE id = ? AND is_active = 1 AND expires_at > NOW() 
     LIMIT 1`,
    [sessionId]
  );
  return sessions[0] || null;
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  await query("UPDATE sessions SET last_activity = NOW() WHERE id = ?", [
    sessionId,
  ]);
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await query("UPDATE sessions SET is_active = 0 WHERE id = ?", [sessionId]);
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await query("UPDATE sessions SET is_active = 0 WHERE user_id = ?", [userId]);
}

export async function getSessionFromCookie(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return null;

  return getSession(sessionId);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSessionFromCookie();
  if (!session) return null;

  const user = await getUserById(session.user_id);
  if (user) {
    await updateSessionActivity(session.id);
  }

  return user;
}

export function setSessionCookie(sessionId: string): void {
  // This should be called from API route with response cookies
}

// =====================================================
// OTP FUNCTIONS
// =====================================================

export async function createOTP(
  email: string,
  type: "login" | "register" | "reset_password" = "login"
): Promise<string> {
  // Invalidate existing OTPs for this email
  await query(
    "UPDATE otp_codes SET is_used = 1 WHERE email = ? AND type = ? AND is_used = 0",
    [email.toLowerCase(), type]
  );

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await query(
    `INSERT INTO otp_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)`,
    [email.toLowerCase(), code, type, expiresAt]
  );

  return code;
}

export async function verifyOTP(
  email: string,
  code: string,
  type: "login" | "register" | "reset_password" = "login"
): Promise<boolean> {
  const otps = await query<OTPCode[]>(
    `SELECT * FROM otp_codes 
     WHERE email = ? AND code = ? AND type = ? AND is_used = 0 AND expires_at > NOW()
     LIMIT 1`,
    [email.toLowerCase(), code, type]
  );

  if (otps.length === 0) return false;

  // Mark OTP as used
  await query("UPDATE otp_codes SET is_used = 1 WHERE id = ?", [otps[0].id]);

  return true;
}

// =====================================================
// CSRF FUNCTIONS
// =====================================================

export async function createCSRFToken(sessionId?: string): Promise<string> {
  const token = generateCSRFToken();
  const expiresAt = new Date(Date.now() + CSRF_EXPIRY_HOURS * 60 * 60 * 1000);

  await query(
    `INSERT INTO csrf_tokens (token, session_id, expires_at) VALUES (?, ?, ?)`,
    [token, sessionId || null, expiresAt]
  );

  return token;
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  const tokens = await query<CSRFToken[]>(
    `SELECT * FROM csrf_tokens WHERE token = ? AND expires_at > NOW() LIMIT 1`,
    [token]
  );

  if (tokens.length === 0) return false;

  // Delete used token (one-time use)
  await query("DELETE FROM csrf_tokens WHERE id = ?", [tokens[0].id]);

  return true;
}

export async function getCSRFTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null;
}

// =====================================================
// RATE LIMITING FUNCTIONS
// =====================================================

export async function recordLoginAttempt(
  email: string | null,
  ipAddress: string,
  userAgent: string,
  success: boolean
): Promise<void> {
  await query(
    `INSERT INTO login_attempts (email, ip_address, user_agent, success) VALUES (?, ?, ?, ?)`,
    [email?.toLowerCase() || null, ipAddress, userAgent, success ? 1 : 0]
  );
}

export async function checkRateLimit(
  ipAddress: string,
  email?: string
): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number;
}> {
  const maxLoginAttempts =
    (await getSettingValue<number>("max_login_attempts")) ??
    DEFAULT_MAX_LOGIN_ATTEMPTS;
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  );

  // Check IP-based rate limit
  const ipAttempts = await query<[{ count: number }]>(
    `SELECT COUNT(*) as count FROM login_attempts 
     WHERE ip_address = ? AND success = 0 AND created_at > ?`,
    [ipAddress, windowStart]
  );

  const ipCount = ipAttempts[0]?.count || 0;

  // Check email-based rate limit if provided
  let emailCount = 0;
  if (email) {
    const emailAttempts = await query<[{ count: number }]>(
      `SELECT COUNT(*) as count FROM login_attempts 
       WHERE email = ? AND success = 0 AND created_at > ?`,
      [email.toLowerCase(), windowStart]
    );
    emailCount = emailAttempts[0]?.count || 0;
  }

  const maxCount = Math.max(ipCount, emailCount);
  const allowed = maxCount < maxLoginAttempts;
  const remainingAttempts = Math.max(0, maxLoginAttempts - maxCount);

  if (!allowed) {
    // Get oldest attempt to calculate retry time
    const oldestAttempt = await query<[{ created_at: string }]>(
      `SELECT created_at FROM login_attempts 
       WHERE (ip_address = ? OR email = ?) AND success = 0 AND created_at > ?
       ORDER BY created_at ASC LIMIT 1`,
      [ipAddress, email?.toLowerCase() || "", windowStart]
    );

    if (oldestAttempt[0]) {
      const oldestTime = new Date(oldestAttempt[0].created_at).getTime();
      const retryAfter = Math.ceil(
        (oldestTime + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 - Date.now()) / 1000
      );
      return {
        allowed,
        remainingAttempts,
        retryAfter: Math.max(0, retryAfter),
      };
    }
  }

  return { allowed, remainingAttempts };
}

// =====================================================
// CLEANUP FUNCTIONS
// =====================================================

export async function cleanupExpiredData(): Promise<void> {
  // Cleanup expired OTPs
  await query("DELETE FROM otp_codes WHERE expires_at < NOW()");

  // Cleanup expired CSRF tokens
  await query("DELETE FROM csrf_tokens WHERE expires_at < NOW()");

  // Cleanup old login attempts (older than 24 hours)
  await query(
    "DELETE FROM login_attempts WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)"
  );

  // Cleanup expired sessions
  await query(
    "UPDATE sessions SET is_active = 0 WHERE expires_at < NOW() AND is_active = 1"
  );
}

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
