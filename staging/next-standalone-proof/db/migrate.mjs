import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const migrationsDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "migrations",
);

function splitStatements(sql) {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

export async function listMigrationFiles() {
  return (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();
}

export async function applyMigrations(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(190) NOT NULL,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const migrationFiles = await listMigrationFiles();

  const applied = [];
  const skipped = [];

  for (const name of migrationFiles) {
    const sql = await readFile(path.join(migrationsDirectory, name), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const [rows] = await connection.query(
      "SELECT checksum FROM schema_migrations WHERE name = ?",
      [name],
    );

    if (rows.length > 0) {
      if (rows[0].checksum !== checksum) {
        throw new Error(`Migration checksum mismatch: ${name}`);
      }
      skipped.push(name);
      continue;
    }

    for (const statement of splitStatements(sql)) {
      await connection.query(statement);
    }
    await connection.query(
      "INSERT INTO schema_migrations (name, checksum) VALUES (?, ?)",
      [name, checksum],
    );
    applied.push(name);
  }

  return { applied, skipped };
}
