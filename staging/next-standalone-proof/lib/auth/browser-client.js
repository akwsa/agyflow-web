export class AuthApiError extends Error {
  constructor(message, { code = "request_failed", status = 500 } = {}) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.status = status;
  }
}

export function safeReturnPath(value, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  try {
    const base = "https://agyflow.local";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export async function postJson(path, payload, fetchImpl = fetch) {
  const response = await fetchImpl(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AuthApiError(data.error || "Request failed", {
      code: data.code,
      status: response.status,
    });
  }
  return data;
}
