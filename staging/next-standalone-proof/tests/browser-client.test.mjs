import assert from "node:assert/strict";
import test from "node:test";

import { AuthApiError, postJson, safeReturnPath } from "../lib/auth/browser-client.js";

test("postJson sends JSON with same-origin credentials", async () => {
  let request;
  const result = await postJson(
    "/api/auth/login",
    { email: "customer@example.com", password: "password123" },
    async (url, options) => {
      request = { url, options };
      return new Response(JSON.stringify({ status: "ok", user: { id: 1 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  );

  assert.equal(request.url, "/api/auth/login");
  assert.equal(request.options.credentials, "same-origin");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(request.options.body), {
    email: "customer@example.com",
    password: "password123",
  });
  assert.equal(result.user.id, 1);
});

test("postJson throws a typed error returned by the API", async () => {
  await assert.rejects(
    () =>
      postJson("/api/auth/login", {}, async () =>
        new Response(
          JSON.stringify({
            status: "error",
            code: "invalid_credentials",
            error: "Wrong email or password",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        ),
      ),
    (error) =>
      error instanceof AuthApiError &&
      error.code === "invalid_credentials" &&
      error.status === 401,
  );
});

test("safeReturnPath accepts local paths and rejects external redirects", () => {
  assert.equal(safeReturnPath("/admin"), "/admin");
  assert.equal(safeReturnPath("https://evil.example"), "/account");
  assert.equal(safeReturnPath("//evil.example"), "/account");
  assert.equal(safeReturnPath("/\\evil.example"), "/account");
});
