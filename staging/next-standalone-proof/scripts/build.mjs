// Staging standalone build wrapper — mirrors scripts/build.mjs.
// `next build` removes .next/ repeatedly; the safe-delete shim times out on
// this volume, so the child gets CODEBUDDY_SAFE_DELETE_ENABLED=0.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rawRemoveIfExists } from "../../../scripts/raw-remove.mjs";

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(projectDirectory);

const nextBin = path.join(
  projectDirectory,
  "..",
  "..",
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

console.log(`[staging-build] cwd=${projectDirectory}`);
console.log(`[staging-build] nextBin=${nextBin}`);
rawRemoveIfExists(path.join(projectDirectory, ".next"));
console.log("[staging-build] running next build (standalone) ...");

try {
  execFileSync(process.execPath, [nextBin, "build"], {
    stdio: "inherit",
    env: { ...process.env, CODEBUDDY_SAFE_DELETE_ENABLED: "0" },
  });
  console.log("[staging-build] done");
  process.exit(0);
} catch (error) {
  console.error("[staging-build] FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
}
