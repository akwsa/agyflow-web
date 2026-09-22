function required(env, name) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function smtpConfigFromEnv(env = process.env) {
  const host = required(env, "SMTP_HOST");
  const portValue = required(env, "SMTP_PORT");
  const user = required(env, "SMTP_USER");
  const pass = required(env, "SMTP_PASSWORD");
  const from = required(env, "SMTP_FROM");
  const baseUrl = required(env, "APP_BASE_URL").replace(/\/$/, "");
  const port = Number(portValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port");
  }
  if (!URL.canParse(baseUrl)) {
    throw new Error("APP_BASE_URL must be a valid URL");
  }

  return {
    transport: {
      host,
      port,
      secure: env.SMTP_SECURE?.trim().toLowerCase() === "true",
      auth: { user, pass },
    },
    from,
    baseUrl,
  };
}
