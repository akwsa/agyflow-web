// Manual cleanup of build output. Runs in the current Node process, which
// still has the safe-delete shim installed, so it removes directories via
// raw syscalls (see raw-remove.mjs) rather than fs.rmSync.
import { rawRemoveIfExists } from "./raw-remove.mjs";

for (const dir of [".next", "out", "dist"]) {
  console.log(
    rawRemoveIfExists(dir) ? `[clean] removed ${dir}` : `[clean] ${dir} — not present, skipping`,
  );
}
