import crypto from "node:crypto";

export function verifyLemonSqueezySignature(rawBody, signature, secret) {
  if (
    typeof rawBody !== "string" ||
    typeof signature !== "string" ||
    typeof secret !== "string" ||
    signature.length === 0 ||
    secret.length === 0
  ) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const actualBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function verifyGumroadSignature(providedSecret, secret) {
  if (
    typeof providedSecret !== "string" ||
    typeof secret !== "string" ||
    providedSecret.length === 0 ||
    secret.length === 0
  ) {
    return false;
  }

  const actualBuffer = Buffer.from(providedSecret, "utf8");
  const expectedBuffer = Buffer.from(secret, "utf8");

  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  return `AGY-${year}-${random}`;
}

export function generateDownloadToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashDownloadToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function toSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown-product";
}

export function normalizeMoneyToCents(value, provider = "generic") {
  if (value == null || value === "") return 0;

  const raw = String(value).trim().replace(/,/g, "");
  if (!raw) return 0;

  const amount = Number(raw);
  if (!Number.isFinite(amount)) return 0;

  if (provider === "lemonsqueezy") {
    return Number.isInteger(amount) ? amount : Math.round(amount * 100);
  }

  if (provider === "gumroad") {
    if (raw.includes(".")) return Math.round(amount * 100);
    return amount >= 100 ? Math.round(amount) : Math.round(amount * 100);
  }

  return raw.includes(".") ? Math.round(amount * 100) : Math.round(amount);
}
