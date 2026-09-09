// Static export renders <html lang="en"> for every page (single root layout).
// This post-build step fixes the lang attribute on localized pages and fails
// the build if the expected output files are missing.
import { readFileSync, writeFileSync } from "node:fs";

const fixes = [
  { file: "out/de.html", lang: "de" },
  { file: "out/fr.html", lang: "fr" },
];

for (const { file, lang } of fixes) {
  let html;
  try {
    html = readFileSync(file, "utf8");
  } catch {
    console.error(`[fix-html-lang] MISSING: ${file} — did the build emit localized pages?`);
    process.exit(1);
  }
  if (!html.includes('<html lang="en"')) {
    console.error(`[fix-html-lang] UNEXPECTED: ${file} has no <html lang="en"> marker`);
    process.exit(1);
  }
  writeFileSync(file, html.replace('<html lang="en"', `<html lang="${lang}"`));
  console.log(`[fix-html-lang] ${file} -> lang="${lang}"`);
}
