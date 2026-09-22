import mysql from "mysql2/promise";

import {
  generateToken,
  hashToken,
  hashPassword,
  isExpired,
  tokenExpiry,
  verifyPassword,
} from "./crypto.js";

const SESSION_HOURS = 30 * 24; // 30 days
const VERIFICATION_HOURS = 24;

function rowToUser(row) {
  return {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name ?? ""),
    role: String(row.role ?? "customer"),
    emailVerified: row.email_verified_at != null,
  };
}

function connectionOptions() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  return {
    uri: process.env.DATABASE_URL,
    connectTimeout: 5000,
  };
}

export async function withConnection(work) {
  const connection = await mysql.createConnection(connectionOptions());
  try {
    return await work(connection);
  } finally {
    await connection.end();
  }
}

export async function createUser({ email, name, password, role = "customer" }) {
  const passwordHash = await hashPassword(password);
  return withConnection(async (connection) => {
    try {
      const [result] = await connection.execute(
        `INSERT INTO users (email, name, password_hash, role)
         VALUES (?, ?, ?, ?)`,
        [email.toLowerCase(), name, passwordHash, role],
      );
      const insertId = Number(result.insertId);
      const [rows] = await connection.execute(
        "SELECT id, email, name, role, email_verified_at FROM users WHERE id = ?",
        [insertId],
      );
      return rowToUser(rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Duplicate entry")) {
        throw new AuthError("email_taken", "An account with this email already exists");
      }
      throw error;
    }
  });
}

export async function findUserByEmail(email) {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      "SELECT id, email, name, role, email_verified_at FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()],
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  });
}

export async function findUserById(id) {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      "SELECT id, email, name, role, email_verified_at FROM users WHERE id = ? LIMIT 1",
      [id],
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  });
}

export async function verifyCredentials(email, password) {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      "SELECT id, email, name, role, email_verified_at, password_hash FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()],
    );
    const row = rows[0];
    if (!row) return null;

    const valid = await verifyPassword(password, String(row.password_hash));
    if (!valid) return null;

    return rowToUser(row);
  });
}

export async function createSession(user) {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = tokenExpiry(SESSION_HOURS);

  await withConnection(async (connection) => {
    await connection.execute(
      `INSERT INTO sessions (user_id, token_hash, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, tokenHash, expiresAt],
    );
  });

  return { id: 0, user, token, expiresAt };
}

export async function getSession(token) {
  if (!token) return null;
  const tokenHash = hashToken(token);

  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT s.id, s.expires_at, s.revoked_at,
              u.id AS user_id, u.email, u.name, u.role, u.email_verified_at
         FROM sessions s
         JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ?
        LIMIT 1`,
      [tokenHash],
    );
    const row = rows[0];
    if (!row) return null;
    if (row.revoked_at != null) return null;
    if (isExpired(new Date(String(row.expires_at)))) return null;

    return {
      id: Number(row.id),
      user: {
        id: Number(row.user_id),
        email: String(row.email),
        name: String(row.name),
        role: String(row.role),
        emailVerified: row.email_verified_at != null,
      },
      token,
      expiresAt: new Date(String(row.expires_at)),
    };
  });
}

export async function revokeSession(token) {
  if (!token) return;
  const tokenHash = hashToken(token);

  await withConnection(async (connection) => {
    await connection.execute(
      "UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ?",
      [tokenHash],
    );
  });
}

export async function createVerificationToken(
  user,
  purpose = "email_verification",
  expiresInHours = VERIFICATION_HOURS,
) {
  const token = generateToken();
  const tokenHash = hashToken(token);

  await withConnection(async (connection) => {
    await connection.execute(
      `UPDATE verification_tokens
          SET consumed_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND purpose = ? AND consumed_at IS NULL`,
      [user.id, purpose],
    );
    await connection.execute(
      `INSERT INTO verification_tokens (user_id, token_hash, purpose, expires_at)
       VALUES (?, ?, ?, ?)`,
      [user.id, tokenHash, purpose, tokenExpiry(expiresInHours)],
    );
  });

  return token;
}

export async function consumeVerificationToken(token, purpose = "email_verification") {
  const tokenHash = hashToken(token);

  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT t.id, t.expires_at, t.consumed_at,
              u.id AS user_id, u.email, u.name, u.role, u.email_verified_at
         FROM verification_tokens t
         JOIN users u ON u.id = t.user_id
        WHERE t.token_hash = ? AND t.purpose = ?
        LIMIT 1`,
      [tokenHash, purpose],
    );
    const row = rows[0];
    if (!row) return null;
    if (row.consumed_at != null) return null;
    if (isExpired(new Date(String(row.expires_at)))) return null;

    await connection.execute(
      "UPDATE verification_tokens SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [row.id],
    );
    await connection.execute(
      "UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE id = ?",
      [row.user_id],
    );

    return rowToUser({
      id: row.user_id,
      email: row.email,
      name: row.name,
      role: row.role,
      email_verified_at: new Date(),
    });
  });
}

export async function resetPasswordWithToken(token, passwordHash) {
  if (!token) return null;
  const tokenHash = hashToken(token);

  return withConnection(async (connection) => {
    await connection.beginTransaction();
    try {
      const [rows] = await connection.execute(
        `SELECT t.id, t.expires_at, t.consumed_at,
                u.id AS user_id, u.email, u.name, u.role, u.email_verified_at
           FROM verification_tokens t
           JOIN users u ON u.id = t.user_id
          WHERE t.token_hash = ? AND t.purpose = 'password_reset'
          LIMIT 1
          FOR UPDATE`,
        [tokenHash],
      );
      const row = rows[0];
      if (
        !row ||
        row.consumed_at != null ||
        isExpired(new Date(String(row.expires_at)))
      ) {
        await connection.rollback();
        return null;
      }

      await connection.execute(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [passwordHash, row.user_id],
      );
      await connection.execute(
        "UPDATE verification_tokens SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?",
        [row.id],
      );
      await connection.execute(
        `UPDATE sessions
            SET revoked_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND revoked_at IS NULL`,
        [row.user_id],
      );
      await connection.commit();

      return rowToUser({
        id: row.user_id,
        email: row.email,
        name: row.name,
        role: row.role,
        email_verified_at: row.email_verified_at,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  });
}

export async function incrementRateLimit({
  scope,
  identifierHash,
  windowStart,
  windowSeconds,
}) {
  return withConnection(async (connection) => {
    await connection.execute(
      `INSERT INTO auth_rate_limits
        (scope, identifier_hash, window_start, attempts, expires_at)
       VALUES (?, ?, ?, 1, FROM_UNIXTIME(?))
       ON DUPLICATE KEY UPDATE
         attempts = attempts + 1,
         expires_at = VALUES(expires_at)`,
      [scope, identifierHash, windowStart, windowStart + windowSeconds],
    );
    const [rows] = await connection.execute(
      `SELECT attempts
         FROM auth_rate_limits
        WHERE scope = ? AND identifier_hash = ? AND window_start = ?`,
      [scope, identifierHash, windowStart],
    );
    return Number(rows[0].attempts);
  });
}

export async function getAdminOverview() {
  return withConnection(async (connection) => {
    const [[users]] = await connection.query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) AS verified,
         SUM(CASE WHEN email_verified_at IS NULL THEN 1 ELSE 0 END) AS unverified,
         SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins
       FROM users`,
    );
    const [[sessions]] = await connection.query(
      `SELECT COUNT(*) AS active
       FROM sessions
       WHERE revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP`,
    );

    return {
      users: {
        total: Number(users.total ?? 0),
        verified: Number(users.verified ?? 0),
        unverified: Number(users.unverified ?? 0),
        admins: Number(users.admins ?? 0),
      },
      sessions: { active: Number(sessions.active ?? 0) },
    };
  });
}

export async function writeAuditLog({ userId, action, detail, ipAddress }) {
  await withConnection(async (connection) => {
    await connection.execute(
      `INSERT INTO audit_logs (user_id, action, detail, ip_address)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        action,
        detail ? JSON.stringify(detail) : null,
        ipAddress ?? null,
      ],
    );
  });
}

export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
