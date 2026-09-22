import { AuthInputError } from "./registration.js";

export function requireUser(user) {
  if (!user) {
    throw new AuthInputError("unauthorized", "Sign in required");
  }
  return user;
}

export function requireRole(user, role) {
  requireUser(user);
  if (user.role !== role) {
    throw new AuthInputError("forbidden", `${role} access required`);
  }
  return user;
}
