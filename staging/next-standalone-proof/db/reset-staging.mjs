import { readFile } from "node:fs/promises";

import mysql from "mysql2/promise";

import { applyMigrations } from "./migrate.mjs";
import { seedProducts } from "./product-seed.mjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const source = JSON.parse(
  await readFile(new URL("../data/products.json", import.meta.url), "utf8"),
);
const products = source.products ?? source;

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log("Dropping existing staging product tables (staging reset only)");
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  await connection.query("DROP TABLE IF EXISTS product_translations");
  await connection.query("DROP TABLE IF EXISTS products");
  await connection.query("DROP TABLE IF EXISTS schema_migrations");
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");

  const migrations = await applyMigrations(connection);
  await seedProducts(connection, products);

  const [[{ productCount }]] = await connection.execute(
    "SELECT COUNT(*) AS productCount FROM products",
  );
  const [[{ translationCount }]] = await connection.execute(
    "SELECT COUNT(*) AS translationCount FROM product_translations",
  );
  const [[{ migrationCount }]] = await connection.execute(
    "SELECT COUNT(*) AS migrationCount FROM schema_migrations",
  );

  console.log(
    JSON.stringify({
      reset: true,
      migrations,
      products: productCount,
      translations: translationCount,
      schemaMigrations: migrationCount,
      expectedProducts: products.length,
    }),
  );
} finally {
  await connection.end();
}
