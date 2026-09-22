import { readFile } from "node:fs/promises";

import mysql from "mysql2/promise";

import { applyMigrations } from "./migrate.mjs";
import { seedProducts } from "./product-seed.mjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const products = JSON.parse(
  await readFile(new URL("../data/products.json", import.meta.url), "utf8"),
);
const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const migrations = await applyMigrations(connection);
  const seeded = await seedProducts(connection, products);
  const [[counts]] = await connection.query(`
    SELECT
      (SELECT COUNT(*) FROM products) AS products,
      (SELECT COUNT(*) FROM product_translations) AS translations,
      (SELECT COUNT(*) FROM schema_migrations) AS migrations
  `);

  console.log(JSON.stringify({
    migrations,
    seeded,
    verified: {
      products: Number(counts.products),
      translations: Number(counts.translations),
      migrations: Number(counts.migrations),
    },
  }, null, 2));
} finally {
  await connection.end();
}
