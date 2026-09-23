import { createHash } from "node:crypto";

const DEFAULT_MAX_KEYS = 5000;
const buckets = new Map();

function epochSecondsFrom(now) {
  return Math.floor(Number(now) / 1000);
}

function hashIdentifier(identifier) {
  return createHash("sha256").update(String(identifier)).digest("hex");
}

function bucketKey(scope, identifierHash, windowStart) {
  return `${scope}:${identifierHash}:${windowStart}`;
}

function pruneExpired(nowEpochSeconds) {
  for (const [key, entry] of buckets) {
    if (entry.expiresAt <= nowEpochSeconds) buckets.delete(key);
  }
}

function pruneOverflow(maxKeys) {
  while (buckets.size > maxKeys) {
    const oldest = buckets.keys().next().value;
    if (oldest == null) return;
    buckets.delete(oldest);
  }
}

export function incrementInMemoryRateLimit({
  scope,
  identifierHash,
  windowStart,
  windowSeconds,
  now = Date.now(),
  maxKeys = DEFAULT_MAX_KEYS,
}) {
  const nowEpochSeconds = epochSecondsFrom(now);
  pruneExpired(nowEpochSeconds);

  const key = bucketKey(scope, identifierHash, windowStart);
  const existing = buckets.get(key);
  const attempts = existing ? existing.attempts + 1 : 1;
  buckets.set(key, {
    attempts,
    expiresAt: windowStart + windowSeconds,
  });
  pruneOverflow(maxKeys);
  return attempts;
}

export function createRateLimiter({ increment = incrementInMemoryRateLimit, maxKeys = DEFAULT_MAX_KEYS } = {}) {
  if (typeof increment !== "function") {
    throw new Error("Rate limit increment function is required");
  }

  return {
    async consume({
      scope,
      identifier,
      limit,
      windowSeconds,
      now = Date.now(),
    }) {
      if (!scope) throw new Error("Rate limit scope is required");
      if (!identifier) throw new Error("Rate limit identifier is required");
      if (!Number.isFinite(limit) || limit < 1) throw new Error("Rate limit must be positive");
      if (!Number.isFinite(windowSeconds) || windowSeconds < 1) {
        throw new Error("Rate limit window must be positive");
      }

      const epochSeconds = epochSecondsFrom(now);
      const windowStart = Math.floor(epochSeconds / windowSeconds) * windowSeconds;
      const identifierHash = hashIdentifier(identifier);
      const attempts = await increment({
        scope,
        identifierHash,
        windowStart,
        windowSeconds,
        now,
        maxKeys,
      });

      return {
        allowed: attempts <= limit,
        limit,
        remaining: Math.max(0, limit - attempts),
        retryAfter: Math.max(1, windowStart + windowSeconds - epochSeconds),
      };
    },
  };
}

export const inMemoryRateLimiter = createRateLimiter();

export function rateLimitHeaders(result) {
  return {
    "Cache-Control": "no-store",
    "Retry-After": String(result.retryAfter),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
}

export function resetInMemoryRateLimits() {
  buckets.clear();
}

export function inMemoryRateLimitSize() {
  return buckets.size;
}
