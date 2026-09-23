CREATE TABLE IF NOT EXISTS webhook_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider VARCHAR(30) NOT NULL,
  event_id VARCHAR(190) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload_json JSON NOT NULL,
  signature_valid TINYINT(1) NOT NULL DEFAULT 0,
  process_status VARCHAR(20) NOT NULL DEFAULT 'received',
  error_message TEXT NULL,
  duplicate_count INT UNSIGNED NOT NULL DEFAULT 0,
  received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_webhook_events_provider_event (provider, event_id),
  KEY idx_webhook_events_provider_status (provider, process_status),
  KEY idx_webhook_events_received_at (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(30) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  email VARCHAR(190) NOT NULL,
  provider VARCHAR(30) NOT NULL,
  provider_order_id VARCHAR(190) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'paid',
  subtotal_cents INT UNSIGNED NOT NULL DEFAULT 0,
  tax_cents INT UNSIGNED NOT NULL DEFAULT 0,
  total_cents INT UNSIGNED NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  country VARCHAR(2) NULL,
  raw_payload_json JSON NOT NULL,
  refunded_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_orders_order_number (order_number),
  UNIQUE KEY uk_orders_provider_order (provider, provider_order_id),
  KEY idx_orders_user_id (user_id),
  KEY idx_orders_email (email),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_slug VARCHAR(190) NOT NULL,
  provider_product_id VARCHAR(190) NULL,
  provider_variant_id VARCHAR(190) NULL,
  variant VARCHAR(190) NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price_cents INT UNSIGNED NOT NULL DEFAULT 0,
  license_key VARCHAR(190) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_items_order_id (order_id),
  KEY idx_order_items_product_id (product_id),
  KEY idx_order_items_product_slug (product_slug),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS download_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  token_hash CHAR(64) NOT NULL,
  token_preview VARCHAR(12) NOT NULL,
  order_item_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  email VARCHAR(190) NOT NULL,
  expires_at DATETIME NOT NULL,
  max_downloads INT UNSIGNED NOT NULL DEFAULT 10,
  download_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_download_tokens_token_hash (token_hash),
  KEY idx_download_tokens_order_item_id (order_item_id),
  KEY idx_download_tokens_user_id (user_id),
  KEY idx_download_tokens_email (email),
  CONSTRAINT fk_download_tokens_order_item FOREIGN KEY (order_item_id)
    REFERENCES order_items (id) ON DELETE CASCADE,
  CONSTRAINT fk_download_tokens_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS entitlements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  email VARCHAR(190) NOT NULL,
  source VARCHAR(30) NOT NULL,
  source_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_slug VARCHAR(190) NOT NULL,
  provider VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  expires_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_entitlements_source (source, source_id),
  KEY idx_entitlements_user_id (user_id),
  KEY idx_entitlements_email (email),
  KEY idx_entitlements_product_slug (product_slug),
  KEY idx_entitlements_status (status),
  CONSTRAINT fk_entitlements_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_entitlements_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
