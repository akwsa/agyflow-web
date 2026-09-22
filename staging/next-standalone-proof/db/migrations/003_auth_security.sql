CREATE TABLE IF NOT EXISTS auth_rate_limits (
  scope VARCHAR(50) NOT NULL,
  identifier_hash CHAR(64) NOT NULL,
  window_start BIGINT UNSIGNED NOT NULL,
  attempts INT UNSIGNED NOT NULL DEFAULT 1,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (scope, identifier_hash, window_start),
  KEY idx_auth_rate_limits_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
