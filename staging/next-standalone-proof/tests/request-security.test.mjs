import assert from "node:assert/strict";
import test from "node:test";

import {
  assertSameOrigin,
  clientIdentifier,
} from "../lib/auth/request-security.js";

test("same-origin guard accepts the configured application origin", () => {
  const request = new Request("https://staging.agyflow.com/api/auth/login", {
    method: "POST",
    headers: { origin: "https://staging.agyflow.com" },
  });

  assert.doesNotThrow(() =>
    assertSameOrigin(request, "https://staging.agyflow.com"),
  );
});

test("same-origin guard rejects missing and cross-site origins", () => {
  const missing = new Request("https://staging.agyflow.com/api/auth/login", {
    method: "POST",
  });
  const crossSite = new Request("https://staging.agyflow.com/api/auth/login", {
    method: "POST",
    headers: { origin: "https://attacker.example" },
  });

  assert.throws(
    () => assertSameOrigin(missing, "https://staging.agyflow.com"),
    (error) => error.code === "invalid_origin",
  );
  assert.throws(
    () => assertSameOrigin(crossSite, "https://staging.agyflow.com"),
    (error) => error.code === "invalid_origin",
  );
});

test("client identifier prefers the first forwarded IP and never includes the full chain", () => {
  const request = new Request("https://staging.agyflow.com/api/auth/login", {
    headers: {
      "x-forwarded-for": "203.0.113.10, 10.0.0.2",
      "user-agent": "test-agent",
    },
  });

  assert.equal(clientIdentifier(request), "203.0.113.10");
});
