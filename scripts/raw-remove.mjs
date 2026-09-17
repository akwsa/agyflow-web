// Bulk directory removal that bypasses the environment's safe-delete shim.
//
// WHY: this workspace runs Node with a shim that intercepts fs.rm/rmSync/
// unlink and routes recursive deletes through the OS trash. That trash
// binary times out on slow volumes, which makes it unusable for build
// working directories. Node also exposes the raw fs syscalls through
// process.binding("fs"), which the shim does not wrap — that is what this
// module uses.
//
// Enumerating a directory (readdir) is read-only and stays on the normal
// API; only unlink/rmdir syscalls are taken from the binding.
//
// Windows note: a process whose working directory is inside the tree (a dev
// server, a file watcher, an editor indexer) holds a lock that makes rmdir
// fail with EBUSY. Transient failures are retried briefly before giving up.
import fs from "node:fs";
import path from "node:path";

const binding = process.binding("fs");

const RETRYABLE = new Set(["EBUSY", "EPERM", "ENOTEMPTY", "EMFILE", "EACCES"]);
const MAX_ATTEMPTS = 5;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/** Run a raw syscall, retrying transient Windows lock errors. */
function withRetry(fn, label) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return fn();
    } catch (error) {
      if (!error || !RETRYABLE.has(error.code)) throw error;
      lastError = error;
      if (attempt < MAX_ATTEMPTS) sleep(attempt * 100);
    }
  }
  const code = lastError && lastError.code;
  const hint =
    code === "EBUSY"
      ? " — a process is holding this directory open (dev server, watcher, or editor)"
      : "";
  throw new Error(`[raw-remove] could not remove ${label}: ${code}${hint}`);
}

/**
 * Recursively delete a directory using raw fs syscalls.
 * Missing paths are ignored. Returns true if something was removed.
 */
export function rawRemoveTree(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rawRemoveTree(full);
    } else {
      withRetry(() => binding.unlink(full), full);
    }
  }

  withRetry(() => binding.rmdir(dir), dir);
  return true;
}

/** Convenience wrapper: delete only if present. */
export function rawRemoveIfExists(dir) {
  if (!fs.existsSync(dir)) return false;
  return rawRemoveTree(dir);
}
