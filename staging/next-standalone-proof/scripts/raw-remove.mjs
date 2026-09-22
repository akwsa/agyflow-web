import fs from "node:fs";
import path from "node:path";

const binding = process.binding("fs");
const RETRYABLE = new Set(["EBUSY", "EPERM", "ENOTEMPTY", "EMFILE", "EACCES"]);
const MAX_ATTEMPTS = 5;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function withRetry(operation, label) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return operation();
    } catch (error) {
      if (!error || !RETRYABLE.has(error.code)) throw error;
      lastError = error;
      if (attempt < MAX_ATTEMPTS) sleep(attempt * 100);
    }
  }
  throw new Error(`[raw-remove] could not remove ${label}: ${lastError?.code}`);
}

function rawRemoveTree(directory) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) rawRemoveTree(fullPath);
    else withRetry(() => binding.unlink(fullPath), fullPath);
  }
  withRetry(() => binding.rmdir(directory), directory);
  return true;
}

export function rawRemoveIfExists(directory) {
  if (!fs.existsSync(directory)) return false;
  return rawRemoveTree(directory);
}
