// One-off integrity check for the static export in ./out
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const OUT = "out";
const htmlFiles = [];

(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmlFiles.push(p);
  }
})(OUT);

const broken = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const attrs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const raw of attrs) {
    // only internal targets
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(raw)) continue;
    if (!raw.startsWith("/")) continue;

    const clean = raw.split("#")[0].split("?")[0];
    if (!clean || clean === "/") continue;

    // Targets are URL-encoded in the HTML (e.g. %5Bslug%5D for "[slug]"),
    // so decode before mapping onto the filesystem.
    let decoded;
    try {
      decoded = decodeURIComponent(clean);
    } catch {
      decoded = clean;
    }

    const key = decoded;
    if (checked.has(key)) continue;
    checked.add(key);

    // candidate filesystem paths
    const rel = decoded.replace(/^\//, "");
    const candidates = [
      path.join(OUT, rel),
      path.join(OUT, rel + ".html"),
      path.join(OUT, rel, "index.html"),
    ];

    const ok = candidates.some((c) => existsSync(c) && statSync(c).isFile());
    if (!ok) broken.push({ from: file, target: clean });
  }
}

console.log(`HTML files scanned : ${htmlFiles.length}`);
console.log(`Internal targets   : ${checked.size}`);
console.log(`Broken             : ${broken.length}`);
if (broken.length) {
  console.log("");
  for (const b of broken) console.log(`  MISSING ${b.target}   (dari ${b.from})`);
}
