-- =====================================================
-- TABEL TAMBAHAN UNTUK SISTEM LOGIN
-- Jalankan SQL ini di database 'landing'
-- =====================================================

-- Tabel untuk menyimpan OTP codes
CREATE TABLE IF NOT EXISTS `otp_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `type` enum('login','register','reset_password') DEFAULT 'login',
  `expires_at` timestamp NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  INDEX `idx_email_code` (`email`, `code`),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabel untuk rate limiting login attempts
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text,
  `success` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  INDEX `idx_ip_created` (`ip_address`, `created_at`),
  INDEX `idx_email_created` (`email`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabel untuk CSRF tokens
CREATE TABLE IF NOT EXISTS `csrf_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_unique` (`token`),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Update tabel sessions (tambah kolom jika belum ada)
ALTER TABLE `sessions` 
ADD COLUMN IF NOT EXISTS `is_active` tinyint(1) DEFAULT '1',
ADD COLUMN IF NOT EXISTS `last_activity` timestamp NULL DEFAULT (now());

-- Update tabel users (tambah kolom untuk status)
ALTER TABLE `users`
ADD COLUMN IF NOT EXISTS `is_active` tinyint(1) DEFAULT '1',
ADD COLUMN IF NOT EXISTS `role` enum('admin','user') DEFAULT 'user',
ADD COLUMN IF NOT EXISTS `last_login` timestamp NULL DEFAULT NULL;

-- Insert sample admin user (email: admin@merauke.go.id)
INSERT INTO `users` (`id`, `email`, `name`, `email_verified`, `is_active`, `role`, `created_at`) VALUES
('usr_admin_001', 'admin@merauke.go.id', 'Administrator', 1, 1, 'admin', NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Cleanup job: Hapus OTP expired (jalankan secara berkala)
-- DELETE FROM otp_codes WHERE expires_at < NOW();
-- DELETE FROM csrf_tokens WHERE expires_at < NOW();
-- DELETE FROM login_attempts WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
