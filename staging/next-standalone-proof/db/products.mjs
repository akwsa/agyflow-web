const STATUS_LIVE = "live";

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  const parsed = JSON.parse(value);
  return Array.isArray(parsed) ? parsed : [];
}

function parseJsonOrNull(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  return JSON.parse(value);
}

function toBoolean(value) {
  return Number(value) === 1;
}

function rowToProduct(row) {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    tagline: row.tagline,
    category: row.category,
    priceCents: row.price_cents,
    compareAtCents: row.compare_at_cents,
    commercialPriceCents: row.commercial_price_cents,
    currency: row.currency,
    badge: row.badge,
    featured: toBoolean(row.featured),
    status: row.status,
    sortOrder: row.sort_order,
    format: parseJsonArray(row.formats),
    languages: parseJsonArray(row.languages),
    audience: row.audience,
    stats: parseJsonArray(row.stats),
    description: parseJsonArray(row.description),
    features: parseJsonArray(row.features),
    cover: row.cover,
    thumb: row.thumb,
    coverTheme: row.cover_theme,
    checkoutUrl: row.checkout_url,
    includesProducts: parseJsonOrNull(row.includes_products),
  };
}

const PRODUCT_COLUMNS = `
  p.slug, p.name, p.short_name, p.category, p.status, p.featured, p.sort_order,
  p.price_cents, p.compare_at_cents, p.commercial_price_cents, p.currency, p.badge,
  p.formats, p.languages, p.audience, p.description, p.features, p.stats,
  p.cover, p.thumb, p.cover_theme, p.checkout_url, p.includes_products,
  t.tagline`;

export async function listProducts(connection, { status = STATUS_LIVE, locale = "en" } = {}) {
  const [rows] = await connection.execute(
    `SELECT ${PRODUCT_COLUMNS}
     FROM products p
     LEFT JOIN product_translations t
       ON t.product_id = p.id AND t.locale = ?
     WHERE p.status = ?
     ORDER BY p.sort_order ASC, p.id ASC`,
    [locale, status],
  );

  return rows.map(rowToProduct);
}

export async function getProductBySlug(connection, slug, { locale = "en" } = {}) {
  const [rows] = await connection.execute(
    `SELECT ${PRODUCT_COLUMNS}
     FROM products p
     LEFT JOIN product_translations t
       ON t.product_id = p.id AND t.locale = ?
     WHERE p.slug = ?
     LIMIT 1`,
    [locale, slug],
  );

  const row = rows[0];
  return row ? rowToProduct(row) : null;
}
