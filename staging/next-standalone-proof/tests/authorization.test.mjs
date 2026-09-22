import assert from "node:assert/strict";
import test from "node:test";

import { requireRole, requireUser } from "../lib/auth/authorization.js";

test("requireRole returns an authenticated admin", () => {
  const admin = { id: 1, role: "admin" };
  assert.equal(requireRole(admin, "admin"), admin);
});

test("requireRole distinguishes unauthenticated and forbidden users", () => {
  assert.throws(
    () => requireRole(null, "admin"),
    (error) => error.code === "unauthorized",
  );
  assert.throws(
    () => requireRole({ id: 2, role: "customer" }, "admin"),
    (error) => error.code === "forbidden",
  );
});

test("requireUser returns a session user and rejects a missing session", () => {
  const user = { id: 3, role: "customer" };
  assert.equal(requireUser(user), user);
  assert.throws(
    () => requireUser(null),
    (error) => error.code === "unauthorized",
  );
});
