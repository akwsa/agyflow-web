import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const ITERATIONS = 16384;

function encodeParts(salt, derived) {
  return `${salt.toString("base64")}:${derived.toString("base64")}`;
}

function decodeParts(encoded) {
  const [saltB64, derivedB64] = encoded.split(":");
  if (!saltB64 || !derivedB64) {
    throw new Error("Malformed password hash");
  }
  return {
    salt: Buffer.from(saltB64, "base64"),
    derived: Buffer.from(derivedB64, "base64"),
  };
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, {
    N: ITERATIONS,
    r: 8,
    p: 1,
    maxmem: 128 * 1024 * 1024,
  });
  return encodeParts(salt, derived);
}

export async function verifyPassword(password, encoded) {
  let salt;
  let expected;
  try {
    const parts = decodeParts(encoded);
    salt = parts.salt;
    expected = parts.derived;
  } catch {
    return false;
  }

  const actual = await scrypt(password, salt, KEY_LENGTH, {
    N: ITERATIONS,
    r: 8,
    p: 1,
    maxmem: 128 * 1024 * 1024,
  });

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function generateToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function tokenExpiry(hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  return expires;
}

export function isExpired(expiresAt) {
  const value = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return value.getTime() <= Date.now();
}
