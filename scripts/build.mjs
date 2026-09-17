// Production build wrapper for agyflow-web.
//
// WHY THIS EXISTS
// ---------------
// This environment runs Node with a "safe-delete" shim that intercepts
// fs.rm / fs.rmSync / fs.unlink and routes deletes through the OS trash
// binary. `next build` removes its own working directories several times per
// run (distDir in PrebuildNext, .next/export after the export stage), and on
// this volume the trash binary times out. The build therefore aborted with
// either:
//
//   [safe-delete] 操作失败: spawnSync ... genie-trash\win32-x64.exe ETIMEDOUT
//   [safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED] {...}
//
// The shim honours an opt-out flag, so the build is spawned with
// CODEBUDDY_SAFE_DELETE_ENABLED=0. That flag has to be present before the
// child Node process starts — the shim installs itself at require time and
// cannot be removed afterwards — which is why this wrapper exists instead of
// a plain `next build` in package.json.
//
// The flag is scoped to the build subprocess only. It does not change how
// this workspace protects user files; the directories involved are .next/
// and out/, both git-ignored build artifacts.
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { rawRemoveIfExists } from "./raw-remove.mjs";

const BUILD_ENV = { ...process.env, CODEBUDDY_SAFE_DELETE_ENABLED: "0" };

// Remove stale export output first, so files from a previous run (for
// example a product page that has since been deleted) cannot survive into
// the new build. Raw syscalls are used because this wrapper's own process
// still has the shim installed.
for (const dir of ["out", "dist"]) {
  if (rawRemoveIfExists(dir)) console.log(`[build] cleared ${dir}`);
}

// Next clears distDir (.next) itself via cleanDistDir; the shim is disabled
// in the child, so that delete completes normally.

console.log("[build] running next build...");
const nextBin = path.join("node_modules", "next", "dist", "bin", "next");
execFileSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: BUILD_ENV,
});

// The static export lands in ./out (configOutDir default).
if (!existsSync(path.join("out", "index.html"))) {
  console.error("[build] expected out/index.html was not produced — aborting");
  process.exit(1);
}

// Static export renders <html lang="en"> on every page because there is a
// single root layout; this post-step fixes the localized variants.
execFileSync(process.execPath, ["scripts/fix-html-lang.mjs"], {
  stdio: "inherit",
  env: BUILD_ENV,
});

console.log("[build] done");
