import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");

const read = (relativePath) =>
  readFileSync(path.join(projectDirectory, relativePath), "utf8");

const products = JSON.parse(read("data/products.json"));
const bundle = products.find((product) => product.slug === "agency-compliance-toolkit");
const homePage = read("app/page.tsx");
const catalogPage = read("app/products/page.tsx");
const translations = read("lib/i18n.ts");

assert.equal(bundle?.name, "EU Website Launch Readiness Kit");
assert.equal(bundle?.price, 29);
assert.equal(bundle?.commercialPrice, 59);
assert.deepEqual(bundle?.includesProducts, [
  "gdpr-checklist",
  "cookie-audit",
  "client-onboarding",
]);
assert.equal(
  products.some((product) => product.category === "education"),
  true,
  "education products remain in the source catalog for direct routes",
);
assert.match(translations, /EU Website Launch Readiness Kit/);
assert.match(translations, /Buy the complete kit for \$29/);
assert.doesNotMatch(homePage, /InteractiveAgentFlow|BentoGrid/);
assert.match(catalogPage, /A clearer client handoff before the website goes live/);

for (const relativePath of [
  "next.config.mjs",
  "app/api/health/route.js",
  "app/api/webhooks/gumroad/route.js",
  "app/api/webhooks/lemonsqueezy/route.js",
  "app/login/page.js",
  "app/register/page.js",
  "app/account/page.js",
  "app/admin/products/page.js",
]) {
  assert.equal(existsSync(path.join(projectDirectory, relativePath)), true, relativePath);
}

assert.match(read("next.config.mjs"), /output:\s*["']standalone["']/);

console.log("merged launch readiness checks passed");
