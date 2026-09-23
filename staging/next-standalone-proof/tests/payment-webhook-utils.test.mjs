import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import {
  generateDownloadToken,
  generateOrderNumber,
  verifyGumroadSignature,
  verifyLemonSqueezySignature,
} from "../lib/payments/webhook-utils.js";

test("Lemon Squeezy signature verifies a correct HMAC-SHA256 and rejects a wrong one", () => {
  const secret = "ls-webhook-secret";
  const rawBody = JSON.stringify({ meta: { event_name: "order_created" }, data: { id: "1" } });
  const good = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  assert.equal(verifyLemonSqueezySignature(rawBody, good, secret), true);
  assert.equal(verifyLemonSqueezySignature(rawBody, "deadbeef", secret), false);
  assert.equal(verifyLemonSqueezySignature(rawBody, "", secret), false);
  assert.equal(verifyLemonSqueezySignature(rawBody, good, "wrong-secret"), false);
});

test("Lemon Squeezy signature comparison is length-safe and never throws", () => {
  const secret = "s";
  const body = "{}";
  // Signatures of differing length must return false, not throw.
  assert.equal(verifyLemonSqueezySignature(body, "ab", secret), false);
  assert.equal(verifyLemonSqueezySignature(body, null, secret), false);
  assert.equal(verifyLemonSqueezySignature(body, undefined, secret), false);
});

test("Gumroad signature matches the shared secret in constant time", () => {
  assert.equal(verifyGumroadSignature("shhh", "shhh"), true);
  assert.equal(verifyGumroadSignature("shhh", "nope"), false);
  assert.equal(verifyGumroadSignature("", "shhh"), false);
  assert.equal(verifyGumroadSignature(null, "shhh"), false);
});

test("order number is unique-ish and formatted AGY-YYYY-NNNNNN", () => {
  const n = generateOrderNumber();
  assert.match(n, /^AGY-\d{4}-\d{6}$/);
  assert.notEqual(generateOrderNumber(), generateOrderNumber());
});

test("download token is a 64-char hex string and unique", () => {
  const t = generateDownloadToken();
  assert.match(t, /^[a-f0-9]{64}$/);
  assert.notEqual(generateDownloadToken(), generateDownloadToken());
});
