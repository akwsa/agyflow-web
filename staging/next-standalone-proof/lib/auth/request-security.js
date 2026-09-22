export function assertSameOrigin(request, appBaseUrl) {
  const allowedOrigin = new URL(appBaseUrl).origin;
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin !== allowedOrigin) {
    throw new RequestSecurityError(
      "invalid_origin",
      "Request origin is not allowed",
    );
  }
}

export function clientIdentifier(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",", 1)[0].trim();
    if (first) return first;
  }

  const direct =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip");
  if (direct?.trim()) return direct.trim();

  const userAgent = request.headers.get("user-agent") || "unknown";
  return `unknown:${userAgent.slice(0, 160)}`;
}

export class RequestSecurityError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RequestSecurityError";
    this.code = code;
  }
}
