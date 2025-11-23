// lib/models/app-settings-model.ts

import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface AppSettings {
  id: number;

  // Aplikasi Info
  nama_aplikasi: string;
  alias_aplikasi: string;
  deskripsi: string;
  versi: string;
  copyright: string;
  tahun: number;
  logo: string | null;
  favicon: string | null;

  // Kontak
  email: string;
  no_telepon: string;
  whatsapp: string | null;
  alamat: string;
  domain: string;

  // Mode & Status
  mode: "online" | "offline" | "maintenance";
  maintenance_message: string | null;

  // Konfigurasi Teknis
  database_version: string | null;
  max_upload_size: number;
  allowed_extensions: string[] | null;

  // SEO
  meta_keywords: string | null;
  meta_description: string | null;
  og_image: string | null;

  // Sosial Media
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;

  // Email & SMTP
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_from_name: string | null;
  notifikasi_email: string | null;

  // Keamanan
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  enable_2fa: boolean;

  // Organisasi
  instansi_nama: string | null;
  kepala_dinas: string | null;
  nip_kepala_dinas: string | null;
  pimpinan_wilayah: string | null;
  logo_pemda: string | null;

  // Backup & Maintenance
  backup_auto: boolean;
  backup_interval: number;
  last_backup: Date | null;

  // Logging
  log_activity: boolean;
  log_retention_days: number;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  updated_by: number | null;
}

export type AppSettingsUpdate = Partial<
  Omit<AppSettings, "id" | "created_at" | "updated_at">
>;

interface AppSettingsRow extends RowDataPacket, AppSettings {}

/**
 * Get app settings (singleton - always returns 1 row)
 */
export async function getAppSettings(): Promise<AppSettings | null> {
  const [rows] = await pool.execute<AppSettingsRow[]>(
    "SELECT * FROM app_settings LIMIT 1"
  );

  if (rows.length === 0) {
    return null;
  }

  const settings = rows[0];

  // Parse JSON fields
  if (typeof settings.allowed_extensions === "string") {
    settings.allowed_extensions = JSON.parse(settings.allowed_extensions);
  }
  if (typeof settings.working_days === "string") {
    settings.working_days = JSON.parse(settings.working_days);
  }

  return settings;
}

/**
 * Update app settings
 */
export async function updateAppSettings(
  data: AppSettingsUpdate,
  updatedBy: string
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  // Build dynamic UPDATE query
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);

      // Convert arrays to JSON strings
      if (Array.isArray(value)) {
        values.push(JSON.stringify(value));
      } else if (typeof value === "boolean") {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  });

  if (fields.length === 0) {
    return false;
  }

  // Add updated_by
  fields.push("updated_by = ?");
  values.push(updatedBy);

  const query = `UPDATE app_settings SET ${fields.join(", ")} WHERE id = 1`;

  const [result] = await pool.execute<ResultSetHeader>(query, values);

  // Log the change to history
  await logSettingsHistory(updatedBy, data);

  return result.affectedRows > 0;
}

/**
 * Initialize default settings (run once on first setup)
 */
export async function initializeAppSettings(): Promise<void> {
  const existing = await getAppSettings();

  if (existing) {
    return; // Already initialized
  }

  await pool.execute(`
    INSERT INTO app_settings (id, nama_aplikasi, alias_aplikasi, deskripsi, 
    versi, copyright, tahun, logo, favicon, email, no_telepon, whatsapp, 
    alamat, domain, mode, maintenance_message, database_version, max_upload_size, 
    allowed_extensions, meta_keywords, meta_description, og_image, facebook_url, 
    instagram_url, twitter_url, youtube_url, smtp_host, smtp_port, smtp_user, 
    smtp_from_name, notifikasi_email, session_timeout, max_login_attempts, 
    lockout_duration, enable_2fa, instansi_nama, kepala_dinas, nip_kepala_dinas, 
    pimpinan_wilayah, logo_pemda, backup_auto, backup_interval, last_backup, 
    log_activity, log_retention_days, created_at, updated_at, updated_by) 
    VALUES
	(1, 'Portal Website dan Aplikasi Pemerintah Kabupaten Merauke', 
  'merauke.go.id', 'Portal Website dan Aplikasi Pemerintah Kabupaten Merauke', 
  '1.1.0', 'Pemerintah Kabupaten Merauke', '2025', NULL, NULL, 'support@merauke.go.id', '0971-321234', '6285190079454', 'Jl. TMP Trikora No. 78, Kelurahan Maro. Merauke, Papua Selatan', 'localhost:3002', 'online', NULL, NULL, 5, '["jpg", "jpeg", "png"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 120, 3, 15, 0, 'Dinas Kominfo Merauke', 'Thomas Kimko, S.STP, M.AP', NULL, NULL, NULL, 1, 7, NULL, 1, 90, '2025-11-16 06:02:57', '2025-11-23 06:04:07', 'usr_admin_001');
  `);
}

/**
 * Log settings history for audit trail
 */
async function logSettingsHistory(
  userId: string,
  changes: AppSettingsUpdate
): Promise<void> {
  const changeLog = JSON.stringify(changes);

  await pool.execute(
    `INSERT INTO app_settings_history (user_id, changes, changed_at) VALUES (?, ?, NOW())`,
    [userId, changeLog]
  );
}

/**
 * Get settings history
 */
export async function getSettingsHistory(limit: number = 50): Promise<any[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT 
      h.id,
      h.changes,
      h.changed_at,
      u.username,
      u.nama_lengkap
    FROM app_settings_history h
    LEFT JOIN users u ON h.user_id = u.id
    ORDER BY h.changed_at DESC
    LIMIT ?`,
    [limit]
  );

  return rows.map((row) => ({
    ...row,
    changes: JSON.parse(row.changes),
  }));
}

/**
 * Get specific setting value by key
 */
export async function getSettingValue<T = any>(
  key: keyof AppSettings
): Promise<T | null> {
  const settings = await getAppSettings();
  return settings ? (settings[key] as T) : null;
}

/**
 * Update single setting value
 */
export async function updateSettingValue(
  key: keyof AppSettings,
  value: any,
  updatedBy: string
): Promise<boolean> {
  return updateAppSettings({ [key]: value } as AppSettingsUpdate, updatedBy);
}

/**
 * Check if app is in maintenance mode
 */
export async function isMaintenanceMode(): Promise<boolean> {
  const mode = await getSettingValue<string>("mode");
  return mode === "maintenance";
}

/**
 * Set maintenance mode
 */
export async function setMaintenanceMode(
  enabled: boolean,
  message: string | null,
  updatedBy: string
): Promise<boolean> {
  return updateAppSettings(
    {
      mode: enabled ? "maintenance" : "online",
      maintenance_message: message,
    },
    updatedBy
  );
}

/**
 * Update last eAbsen sync time
 */
export async function updateEabsenSyncTime(): Promise<void> {
  await pool.execute(
    "UPDATE app_settings SET eabsen_last_sync = NOW() WHERE id = 1"
  );
}
