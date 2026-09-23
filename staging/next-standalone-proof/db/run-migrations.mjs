import mysql from "mysql2/promise";

import { applyMigrations, listMigrationFiles } from "./migrate.mjs";

function parseArgs(argv) {
  const args = { dryRun: false };
  for (const arg of argv) {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg.startsWith("--database-url=")) args.databaseUrl = arg.slice("--database-url=".length);
    else if (arg.startsWith("--target=")) args.target = arg.slice("--target=".length);
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const target = args.target || process.env.DEPLOY_TARGET || "staging";
const migrationFiles = await listMigrationFiles();

if (migrationFiles.length !== 6) {
  throw new Error(`Expected migrations 001-006, found ${migrationFiles.length}: ${migrationFiles.join(", ")}`);
}

if (args.dryRun) {
  console.log(JSON.stringify({
    status: "dry-run",
    target,
    migrations: migrationFiles,
  }, null, 2));
  process.exit(0);
}

const databaseUrl = args.databaseUrl || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL or --database-url is required");
}

const confirmation = process.env.AGYFLOW_CONFIRM_MIGRATIONS;
if (!["staging", "production"].includes(target) || confirmation !== target) {
  throw new Error(
    `Refusing to run ${target} migrations without AGYFLOW_CONFIRM_MIGRATIONS=${target}`,
  );
}

const connection = await mysql.createConnection(databaseUrl);
try {
  const migrations = await applyMigrations(connection);
  const [[counts]] = await connection.query(`
    SELECT COUNT(*) AS migration_count
      FROM schema_migrations
     WHERE name BETWEEN '001_products.sql' AND '006_protected_downloads.sql'
  `);

  if (Number(counts.migration_count) !== migrationFiles.length) {
    throw new Error(`Migration verification failed: expected ${migrationFiles.length}, got ${counts.migration_count}`);
  }

  console.log(JSON.stringify({
    status: "ok",
    target,
    expected: migrationFiles,
    applied: migrations.applied,
    skipped: migrations.skipped,
    verified: { migrations: Number(counts.migration_count) },
  }, null, 2));
} finally {
  await connection.end();
}
