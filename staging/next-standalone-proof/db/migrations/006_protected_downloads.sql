ALTER TABLE download_tokens
  ADD COLUMN last_download_at TIMESTAMP NULL AFTER download_count;

CREATE TABLE IF NOT EXISTS product_files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NULL,
  product_slug VARCHAR(190) NOT NULL,
  stored_path VARCHAR(255) NOT NULL,
  download_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL DEFAULT 'application/octet-stream',
  size_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_files_product_id (product_id),
  KEY idx_product_files_product_slug (product_slug),
  KEY idx_product_files_status (status),
  CONSTRAINT fk_product_files_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
