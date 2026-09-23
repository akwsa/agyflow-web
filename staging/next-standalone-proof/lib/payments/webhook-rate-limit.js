import { clientIdentifier } from "../auth/request-security.js";
import { createRateLimiter, rateLimitHeaders } from "../rate-limit.js";

const webhookLimiter = createRateLimiter();

export async function guardWebhookRequest(request, {
  scope = "webhook",
  limit = 100,
  windowSeconds = 60,
  limiter = webhookLimiter,
} = {}) {
  const result = await limiter.consume({
    scope,
    identifier: clientIdentifier(request),
    limit,
    windowSeconds,
  });

  if (result.allowed) return null;

  return Response.json(
    {
      status: "error",
      code: "rate_limited",
      error: "Too many webhook requests. Please try again later.",
    },
    {
      status: 429,
      headers: {
        ...rateLimitHeaders(result),
        "X-RateLimit-Remaining": "0",
      },
    },
  );
}
