import { createRateLimiter, rateLimitHeaders } from "../rate-limit.js";
import {
  assertSameOrigin,
  clientIdentifier,
  RequestSecurityError,
} from "./request-security.js";

export function createAuthRequestGuard({ appBaseUrl, limiter }) {
  return async function guard(request, policy) {
    try {
      assertSameOrigin(request, appBaseUrl);
    } catch (error) {
      if (error instanceof RequestSecurityError) {
        return Response.json(
          { status: "error", code: error.code, error: error.message },
          { status: 403, headers: { "Cache-Control": "no-store" } },
        );
      }
      throw error;
    }

    const result = await limiter.consume({
      ...policy,
      identifier: clientIdentifier(request),
    });
    if (!result.allowed) {
      return Response.json(
        {
          status: "error",
          code: "rate_limited",
          error: "Too many requests. Please try again later.",
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

    return null;
  };
}

const limiter = createRateLimiter();

export async function guardAuthRequest(request, policy) {
  const appBaseUrl = process.env.APP_BASE_URL;
  if (!appBaseUrl) {
    console.error("APP_BASE_URL is not configured");
    return Response.json(
      { status: "error", error: "Authentication service is unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return createAuthRequestGuard({ appBaseUrl, limiter })(request, policy);
}
