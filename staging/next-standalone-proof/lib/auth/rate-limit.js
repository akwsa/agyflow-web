import { createHash } from "node:crypto";

export function createRateLimiter({ increment }) {
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
      const epochSeconds = Math.floor(now / 1000);
      const windowStart =
        Math.floor(epochSeconds / windowSeconds) * windowSeconds;
      const identifierHash = createHash("sha256")
        .update(String(identifier))
        .digest("hex");
      const attempts = await increment({
        scope,
        identifierHash,
        windowStart,
        windowSeconds,
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
