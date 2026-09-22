function toCents(value) {
  return value == null ? null : Math.round(value * 100);
}

function jsonArray(value) {
  return JSON.stringify(value ?? []);
}

function jsonString(value) {
  return value == null ? null : JSON.stringify(value);
}

export function normalizeProduct(product, index) {
  return {
    product: {
      slug: product.slug,
      name: product.name,
      short_name: product.shortName ?? product.name,
      category: product.category,
      status: product.status ?? "live",
      featured: product.featured === true,
      sort_order: product.sortOrder ?? index,
      price_cents: toCents(product.price),
      compare_at_cents: toCents(product.compareAt ?? null),
      commercial_price_cents: toCents(product.commercialPrice ?? null),
      currency: product.currency ?? "USD",
      badge: product.badge ?? null,
      formats: jsonArray(product.format),
      languages: jsonArray(product.languages),
      audience: product.audience ?? null,
      description: jsonArray(product.description),
      features: jsonArray(product.features),
      stats: jsonArray(product.stats),
      cover: product.cover ?? null,
      thumb: product.thumb ?? null,
      cover_theme: product.coverTheme ?? null,
      checkout_url: product.checkoutUrl ?? null,
      includes_products: jsonString(product.includesProducts ?? null),
    },
    translation: {
      locale: "en",
      name: product.name,
      tagline: product.tagline ?? null,
      description: jsonArray(product.description),
      features: jsonArray(product.features),
    },
  };
}

export async function seedProducts(connection, products) {
  await connection.beginTransaction();

  try {
    for (const [index, sourceProduct] of products.entries()) {
      const { product, translation } = normalizeProduct(sourceProduct, index);

      await connection.execute(
        `INSERT INTO products (
           slug, name, short_name, category, status, featured, sort_order,
           price_cents, compare_at_cents, commercial_price_cents, currency, badge,
           formats, languages, audience, description, features, stats,
           cover, thumb, cover_theme, checkout_url, includes_products
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           short_name = VALUES(short_name),
           category = VALUES(category),
           status = VALUES(status),
           featured = VALUES(featured),
           sort_order = VALUES(sort_order),
           price_cents = VALUES(price_cents),
           compare_at_cents = VALUES(compare_at_cents),
           commercial_price_cents = VALUES(commercial_price_cents),
           currency = VALUES(currency),
           badge = VALUES(badge),
           formats = VALUES(formats),
           languages = VALUES(languages),
           audience = VALUES(audience),
           description = VALUES(description),
           features = VALUES(features),
           stats = VALUES(stats),
           cover = VALUES(cover),
           thumb = VALUES(thumb),
           cover_theme = VALUES(cover_theme),
           checkout_url = VALUES(checkout_url),
           includes_products = VALUES(includes_products)`,
        [
          product.slug, product.name, product.short_name, product.category,
          product.status, product.featured, product.sort_order,
          product.price_cents, product.compare_at_cents, product.commercial_price_cents,
          product.currency, product.badge,
          product.formats, product.languages, product.audience,
          product.description, product.features, product.stats,
          product.cover, product.thumb, product.cover_theme,
          product.checkout_url, product.includes_products,
        ],
      );

      await connection.execute(
        `INSERT INTO product_translations (
           product_id, locale, name, tagline, description, features
         ) VALUES (
           (SELECT id FROM products WHERE slug = ?), ?, ?, ?, ?, ?
         )
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           tagline = VALUES(tagline),
           description = VALUES(description),
           features = VALUES(features)`,
        [
          product.slug, translation.locale, translation.name,
          translation.tagline, translation.description, translation.features,
        ],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}
