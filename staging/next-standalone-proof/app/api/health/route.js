import mysql from "mysql2/promise";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let pool;

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = mysql.createPool({
      uri: databaseUrl,
      connectionLimit: 3,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  return pool;
}

export async function GET() {
  try {
    const [rows] = await getPool().query("SELECT 1 AS value");

    return Response.json(
      {
        status: "ok",
        runtime: "nextjs-standalone-cpanel-passenger",
        node: process.version,
        deploymentId: process.env.STAGING_DEPLOYMENT_ID || "environment-variable-missing",
        database: {
          status: "ok",
          query: "SELECT 1",
          result: Number(rows[0].value),
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Staging health database check failed", error);
    return Response.json(
      {
        status: "error",
        runtime: "nextjs-standalone-cpanel-passenger",
        database: { status: "error" },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
