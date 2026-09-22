const baseUrl = (process.argv[2] || "https://staging.agyflow.com").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store", ...options });
  const body = await response.text();
  if (!response.ok && !options.allowError) {
    throw new Error(`${path} returned HTTP ${response.status}: ${body.slice(0, 200)}`);
  }
  return { response, body };
}

const root = await request("/");
if (!root.body.includes("AGYFLOW STAGING · TAHAP 2")) {
  throw new Error("Staging root did not contain the Tahap 2 marker");
}
if (!root.body.includes("Products rendered from MySQL")) {
  throw new Error("Staging root did not contain the MySQL product marker");
}

const assetPath = root.body.match(/src="([^"?]*\/_next\/static\/[^"?]+\.js)/)?.[1];
if (!assetPath) {
  throw new Error("No Next.js static JavaScript asset was found in the root page");
}
const asset = await request(assetPath);

const routing = await request("/routing-proof");
if (!routing.body.includes("agyflow-next-routing-ok")) {
  throw new Error("Nested App Router marker was missing");
}

const publicAsset = await request("/proof.txt");
if (publicAsset.body.trim() !== "agyflow-next-static-asset-ok") {
  throw new Error("Public static asset content did not match");
}

const healthResponse = await request("/api/health");
const health = JSON.parse(healthResponse.body);
if (
  health.status !== "ok" ||
  health.runtime !== "nextjs-standalone-cpanel-passenger" ||
  health.deploymentId !== "agyflow-next-standalone-v1" ||
  health.database?.status !== "ok" ||
  health.database?.query !== "SELECT 1" ||
  health.database?.result !== 1
) {
  throw new Error(`Health response failed validation: ${JSON.stringify(health)}`);
}

const productsResponse = await request("/api/products");
const products = JSON.parse(productsResponse.body);
if (products.status !== "ok" || products.count !== 6) {
  throw new Error(`Product API failed validation: ${productsResponse.body.slice(0, 200)}`);
}

const authMe = await request("/api/auth/me", { allowError: true });
let authMeBody = {};
try {
  authMeBody = JSON.parse(authMe.body);
} catch {}
if (authMe.response.status !== 401 || authMeBody.code !== "unauthorized") {
  throw new Error(`Unauthenticated /api/auth/me did not return 401 unauthorized: ${authMe.body}`);
}

console.log(JSON.stringify({
  root: root.response.status,
  appRouter: routing.response.status,
  apiHealth: healthResponse.response.status,
  apiProducts: productsResponse.response.status,
  apiProductsCount: products.count,
  apiAuthMeUnauthenticated: authMe.response.status,
  staticAsset: publicAsset.response.status,
  nextAsset: asset.response.status,
  nextAssetContentType: asset.response.headers.get("content-type"),
  health,
}, null, 2));
