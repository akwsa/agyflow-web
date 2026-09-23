const PRODUCT_STATUSES = new Set(["draft", "live", "archived", "early-access"]);
const USER_ROLES = new Set(["customer", "admin"]);
const CMS_SLUGS = new Set(["privacy", "terms", "refund"]);
const CMS_LOCALES = new Set(["en", "de", "fr"]);
const CMS_STATUSES = new Set(["draft", "published"]);
const MEDIA_KINDS = new Set(["image", "document", "archive", "other"]);

function parseJson(value, fallback) {
  if (value == null || value === "") return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function json(value, fallback = []) {
  return JSON.stringify(value ?? fallback);
}

function asString(value, field, { required = true } = {}) {
  const normalized = String(value ?? "").trim();
  if (required && !normalized) throw new Error(`${field} is required`);
  return normalized;
}

function asNullableString(value) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function asPositiveInt(value, field, { allowZero = false, nullable = false } = {}) {
  if ((value == null || value === "") && nullable) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || (allowZero ? number < 0 : number <= 0)) {
    throw new Error(`${field} must be ${allowZero ? "a non-negative" : "a positive"} integer`);
  }
  return number;
}

function asArray(value, field) {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  return value;
}

function toDateString(value) {
  return value == null ? null : String(value);
}

function productRow(row) {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    shortName: String(row.short_name ?? ""),
    category: String(row.category),
    status: String(row.status),
    featured: Number(row.featured) === 1,
    sortOrder: Number(row.sort_order ?? 0),
    priceCents: Number(row.price_cents ?? 0),
    compareAtCents: row.compare_at_cents == null ? null : Number(row.compare_at_cents),
    commercialPriceCents: row.commercial_price_cents == null ? null : Number(row.commercial_price_cents),
    currency: String(row.currency ?? "USD"),
    badge: row.badge ?? null,
    formats: parseJson(row.formats, []),
    languages: parseJson(row.languages, []),
    audience: row.audience ?? null,
    description: parseJson(row.description, []),
    features: parseJson(row.features, []),
    stats: parseJson(row.stats, []),
    cover: row.cover ?? null,
    thumb: row.thumb ?? null,
    coverTheme: row.cover_theme ?? null,
    checkoutUrl: row.checkout_url ?? null,
    includesProducts: parseJson(row.includes_products, null),
    tagline: row.tagline ?? "",
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function orderRow(row) {
  return {
    id: Number(row.id),
    orderNumber: String(row.order_number),
    email: String(row.email),
    provider: String(row.provider),
    providerOrderId: String(row.provider_order_id),
    status: String(row.status),
    totalCents: Number(row.total_cents ?? 0),
    currency: String(row.currency ?? "USD"),
    createdAt: toDateString(row.created_at),
    itemCount: Number(row.item_count ?? 0),
    tokenCount: Number(row.token_count ?? 0),
    user: row.user_email
      ? { email: String(row.user_email), name: String(row.user_name ?? "") }
      : null,
  };
}

function userRow(row) {
  return {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name ?? ""),
    role: String(row.role ?? "customer"),
    emailVerified: row.email_verified_at != null,
    createdAt: toDateString(row.created_at),
    orderCount: Number(row.order_count ?? 0),
    totalSpendCents: Number(row.total_spend_cents ?? 0),
  };
}

function cmsPageRow(row) {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    locale: String(row.locale),
    title: String(row.title),
    status: String(row.status),
    bodyMarkdown: row.body_markdown == null ? undefined : String(row.body_markdown),
    updatedAt: toDateString(row.updated_at),
    publishedAt: toDateString(row.published_at),
  };
}

function mediaRow(row) {
  return {
    id: Number(row.id),
    kind: String(row.kind),
    originalFilename: String(row.original_filename),
    storedFilename: String(row.stored_filename),
    mimeType: String(row.mime_type),
    sizeBytes: Number(row.size_bytes ?? 0),
    publicPath: row.public_path ?? null,
    uploadedBy: row.uploaded_by == null ? null : Number(row.uploaded_by),
    createdAt: toDateString(row.created_at),
  };
}

function webhookEventRow(row) {
  return {
    id: Number(row.id),
    provider: String(row.provider),
    eventId: String(row.event_id),
    eventType: String(row.event_type),
    signatureValid: Number(row.signature_valid) === 1,
    processStatus: String(row.process_status),
    duplicateCount: Number(row.duplicate_count ?? 0),
    receivedAt: toDateString(row.received_at),
    processedAt: toDateString(row.processed_at),
    errorMessage: row.error_message ?? null,
  };
}

export function normalizeProductInput(input) {
  const slug = asString(input.slug, "slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("slug must use lowercase letters, numbers, and hyphens");
  }

  const status = asString(input.status ?? "draft", "status");
  if (!PRODUCT_STATUSES.has(status)) throw new Error("status is invalid");

  const description = asArray(input.description ?? [], "description");
  const features = asArray(input.features ?? [], "features");

  return {
    slug,
    name: asString(input.name, "name"),
    short_name: asString(input.shortName ?? input.short_name ?? "", "shortName", { required: false }),
    category: asString(input.category ?? "general", "category"),
    status,
    featured: input.featured ? 1 : 0,
    sort_order: asPositiveInt(input.sortOrder ?? input.sort_order ?? 0, "sortOrder", { allowZero: true }),
    price_cents: asPositiveInt(input.priceCents ?? input.price_cents, "priceCents"),
    compare_at_cents: asPositiveInt(input.compareAtCents ?? input.compare_at_cents, "compareAtCents", { allowZero: true, nullable: true }),
    commercial_price_cents: asPositiveInt(input.commercialPriceCents ?? input.commercial_price_cents, "commercialPriceCents", { allowZero: true, nullable: true }),
    currency: asString(input.currency ?? "USD", "currency").toUpperCase().slice(0, 3),
    badge: asNullableString(input.badge),
    formats: json(asArray(input.formats ?? input.format ?? [], "formats")),
    languages: json(asArray(input.languages ?? [], "languages")),
    audience: asNullableString(input.audience),
    description: json(description),
    features: json(features),
    stats: json(asArray(input.stats ?? [], "stats")),
    cover: asNullableString(input.cover),
    thumb: asNullableString(input.thumb),
    cover_theme: asNullableString(input.coverTheme ?? input.cover_theme),
    checkout_url: asNullableString(input.checkoutUrl ?? input.checkout_url),
    includes_products: input.includesProducts == null && input.includes_products == null
      ? null
      : json(asArray(input.includesProducts ?? input.includes_products, "includesProducts"), null),
    translation: {
      locale: asString(input.locale ?? "en", "locale"),
      name: asNullableString(input.translatedName ?? input.name),
      tagline: asNullableString(input.tagline),
      description: json(description),
      features: json(features),
    },
  };
}

export function normalizeCmsPageInput(input) {
  const slug = asString(input.slug, "slug");
  if (!CMS_SLUGS.has(slug)) throw new Error("CMS slug must be privacy, terms, or refund");

  const locale = asString(input.locale ?? "en", "locale");
  if (!CMS_LOCALES.has(locale)) throw new Error("CMS locale must be en, de, or fr");

  const status = asString(input.status ?? "draft", "status");
  if (!CMS_STATUSES.has(status)) throw new Error("CMS status must be draft or published");

  return {
    slug,
    locale,
    title: asString(input.title, "title"),
    body_markdown: asString(input.bodyMarkdown ?? input.body_markdown, "bodyMarkdown"),
    status,
  };
}

export function normalizeMediaInput(input) {
  const kind = asString(input.kind ?? "other", "kind");
  if (!MEDIA_KINDS.has(kind)) throw new Error("media kind is invalid");
  return {
    kind,
    original_filename: asString(input.originalFilename ?? input.original_filename, "originalFilename"),
    stored_filename: asString(input.storedFilename ?? input.stored_filename, "storedFilename"),
    mime_type: asString(input.mimeType ?? input.mime_type, "mimeType"),
    size_bytes: asPositiveInt(input.sizeBytes ?? input.size_bytes, "sizeBytes", { allowZero: true }),
    public_path: asNullableString(input.publicPath ?? input.public_path),
    uploaded_by: input.uploadedBy ?? input.uploaded_by ?? null,
  };
}

export async function listAdminProducts(connection, { locale = "en", status, q } = {}) {
  const clauses = [];
  const params = [locale];
  if (status) {
    clauses.push("p.status = ?");
    params.push(status);
  }
  if (q) {
    clauses.push("(p.slug LIKE ? OR p.name LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await connection.execute(
    `SELECT p.id, p.slug, p.name, p.short_name, p.category, p.status, p.featured,
            p.sort_order, p.price_cents, p.compare_at_cents, p.commercial_price_cents,
            p.currency, p.badge, p.formats, p.languages, p.audience, p.description,
            p.features, p.stats, p.cover, p.thumb, p.cover_theme, p.checkout_url,
            p.includes_products, p.created_at, p.updated_at, t.tagline
       FROM products p
       LEFT JOIN product_translations t
         ON t.product_id = p.id AND t.locale = ?
       ${where}
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT 200`,
    params,
  );
  return rows.map(productRow);
}

export async function saveAdminProduct(connection, input) {
  const product = normalizeProductInput(input);
  await connection.execute(
    `INSERT INTO products
       (slug, name, short_name, category, status, featured, sort_order, price_cents,
        compare_at_cents, commercial_price_cents, currency, badge, formats, languages,
        audience, description, features, stats, cover, thumb, cover_theme, checkout_url,
        includes_products)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id), name = VALUES(name), short_name = VALUES(short_name),
       category = VALUES(category), status = VALUES(status), featured = VALUES(featured),
       sort_order = VALUES(sort_order), price_cents = VALUES(price_cents),
       compare_at_cents = VALUES(compare_at_cents), commercial_price_cents = VALUES(commercial_price_cents),
       currency = VALUES(currency), badge = VALUES(badge), formats = VALUES(formats),
       languages = VALUES(languages), audience = VALUES(audience), description = VALUES(description),
       features = VALUES(features), stats = VALUES(stats), cover = VALUES(cover), thumb = VALUES(thumb),
       cover_theme = VALUES(cover_theme), checkout_url = VALUES(checkout_url),
       includes_products = VALUES(includes_products)`,
    [
      product.slug, product.name, product.short_name, product.category, product.status,
      product.featured, product.sort_order, product.price_cents, product.compare_at_cents,
      product.commercial_price_cents, product.currency, product.badge, product.formats,
      product.languages, product.audience, product.description, product.features,
      product.stats, product.cover, product.thumb, product.cover_theme, product.checkout_url,
      product.includes_products,
    ],
  );
  const [[row]] = await connection.execute("SELECT LAST_INSERT_ID() AS id");
  const productId = Number(row.id);
  await connection.execute(
    `INSERT INTO product_translations
       (product_id, locale, name, tagline, description, features)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name), tagline = VALUES(tagline), description = VALUES(description),
       features = VALUES(features)`,
    [
      productId,
      product.translation.locale,
      product.translation.name,
      product.translation.tagline,
      product.translation.description,
      product.translation.features,
    ],
  );
  return productId;
}

export async function deleteAdminProduct(connection, slug) {
  const [result] = await connection.execute("DELETE FROM products WHERE slug = ?", [slug]);
  return Number(result.affectedRows ?? 0);
}

export async function listAdminOrders(connection, { status, provider } = {}) {
  const clauses = [];
  const params = [];
  if (status) {
    clauses.push("o.status = ?");
    params.push(status);
  }
  if (provider) {
    clauses.push("o.provider = ?");
    params.push(provider);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await connection.execute(
    `SELECT o.id, o.order_number, o.email, o.provider, o.provider_order_id, o.status,
            o.total_cents, o.currency, o.created_at, u.email AS user_email, u.name AS user_name,
            COUNT(DISTINCT oi.id) AS item_count,
            COUNT(DISTINCT dt.id) AS token_count
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN download_tokens dt ON dt.order_item_id = oi.id
       ${where}
      GROUP BY o.id, u.email, u.name
      ORDER BY o.created_at DESC
      LIMIT 100`,
    params,
  );
  return rows.map(orderRow);
}

export async function listAdminUsers(connection, { role } = {}) {
  const params = [];
  const where = role ? "WHERE u.role = ?" : "";
  if (role) params.push(role);
  const [rows] = await connection.execute(
    `SELECT u.id, u.email, u.name, u.role, u.email_verified_at, u.created_at,
            COUNT(o.id) AS order_count,
            COALESCE(SUM(CASE WHEN o.status = 'paid' THEN o.total_cents ELSE 0 END), 0) AS total_spend_cents
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       ${where}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT 200`,
    params,
  );
  return rows.map(userRow);
}

export async function setAdminUserRole(connection, { userId, role }) {
  if (!USER_ROLES.has(role)) throw new Error("role must be customer or admin");
  const [result] = await connection.execute(
    "UPDATE users SET role = ? WHERE id = ?",
    [role, userId],
  );
  return Number(result.affectedRows ?? 0);
}

export async function listCmsPages(connection, { locale } = {}) {
  const params = [];
  const where = locale ? "WHERE locale = ?" : "";
  if (locale) params.push(locale);
  const [rows] = await connection.execute(
    `SELECT id, slug, locale, title, status, updated_at, published_at
       FROM cms_pages
       ${where}
      ORDER BY FIELD(slug, 'privacy', 'terms', 'refund'), locale ASC`,
    params,
  );
  return rows.map(cmsPageRow);
}

export async function getCmsPage(connection, { slug, locale = "en" }) {
  const [rows] = await connection.execute(
    `SELECT id, slug, locale, title, body_markdown, status, updated_at, published_at
       FROM cms_pages
      WHERE slug = ? AND locale = ?
      LIMIT 1`,
    [slug, locale],
  );
  return rows[0] ? cmsPageRow(rows[0]) : null;
}

export async function saveCmsPage(connection, input) {
  const page = normalizeCmsPageInput(input);
  await connection.execute(
    `INSERT INTO cms_pages (slug, locale, title, body_markdown, status, published_at)
     VALUES (?, ?, ?, ?, ?, CASE WHEN ? = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id), title = VALUES(title), body_markdown = VALUES(body_markdown),
       status = VALUES(status),
       published_at = CASE
         WHEN VALUES(status) = 'published' AND published_at IS NULL THEN CURRENT_TIMESTAMP
         WHEN VALUES(status) = 'draft' THEN NULL
         ELSE published_at
       END`,
    [page.slug, page.locale, page.title, page.body_markdown, page.status, page.status],
  );
  const [[row]] = await connection.execute("SELECT LAST_INSERT_ID() AS id");
  return Number(row.id);
}

export async function listMediaAssets(connection, { kind } = {}) {
  const params = [];
  const where = kind ? "WHERE m.kind = ?" : "";
  if (kind) params.push(kind);
  const [rows] = await connection.execute(
    `SELECT m.id, m.kind, m.original_filename, m.stored_filename, m.mime_type,
            m.size_bytes, m.public_path, m.uploaded_by, m.created_at
       FROM media_assets m
       ${where}
      ORDER BY m.created_at DESC
      LIMIT 200`,
    params,
  );
  return rows.map(mediaRow);
}

export async function createMediaAsset(connection, input) {
  const media = normalizeMediaInput(input);
  const [result] = await connection.execute(
    `INSERT INTO media_assets
       (kind, original_filename, stored_filename, mime_type, size_bytes, public_path, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      media.kind,
      media.original_filename,
      media.stored_filename,
      media.mime_type,
      media.size_bytes,
      media.public_path,
      media.uploaded_by,
    ],
  );
  return Number(result.insertId);
}

export async function listWebhookEvents(connection, { provider, status } = {}) {
  const clauses = [];
  const params = [];
  if (provider) {
    clauses.push("provider = ?");
    params.push(provider);
  }
  if (status) {
    clauses.push("process_status = ?");
    params.push(status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await connection.execute(
    `SELECT id, provider, event_id, event_type, signature_valid, process_status,
            duplicate_count, received_at, processed_at, error_message
       FROM webhook_events
       ${where}
      ORDER BY received_at DESC
      LIMIT 100`,
    params,
  );
  return rows.map(webhookEventRow);
}

export async function getAdminDashboardData(connection) {
  const [[products]] = await connection.query(
    "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'live' THEN 1 ELSE 0 END) AS live FROM products",
  );
  const [[orders]] = await connection.query(
    "SELECT COUNT(*) AS total, COALESCE(SUM(total_cents), 0) AS gross FROM orders WHERE status = 'paid'",
  );
  const [[users]] = await connection.query(
    "SELECT COUNT(*) AS total, SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins FROM users",
  );
  const [[webhooks]] = await connection.query(
    "SELECT COUNT(*) AS total, SUM(CASE WHEN process_status = 'failed' THEN 1 ELSE 0 END) AS failed FROM webhook_events",
  );
  return {
    products: { total: Number(products.total ?? 0), live: Number(products.live ?? 0) },
    orders: { total: Number(orders.total ?? 0), grossCents: Number(orders.gross ?? 0) },
    users: { total: Number(users.total ?? 0), admins: Number(users.admins ?? 0) },
    webhooks: { total: Number(webhooks.total ?? 0), failed: Number(webhooks.failed ?? 0) },
  };
}

export async function withAdminData(withConnection, work) {
  return withConnection(work);
}
