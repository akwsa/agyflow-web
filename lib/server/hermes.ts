export type HermesStatus = "success" | "failed" | "pending";

export type HermesRequestInput = {
  intent: string;
  payload?: Record<string, unknown>;
  tenantId?: string;
  userId?: string;
  source?: string;
  requestId?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
};

export type HermesError = {
  code: string;
  message: string;
  retryable: boolean;
};

export type HermesResponse = {
  status: HermesStatus;
  request_id: string;
  trace_id: string;
  correlation_id?: string;
  message: string;
  result?: unknown;
  error?: HermesError | null;
  retry_after_seconds?: number;
};

export type HermesConfig = {
  baseUrl: string;
  routerPath: string;
  statusPath: string;
  timeoutMs: number;
  apiKey: string;
};

export function createRequestId(prefix = "req"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getHermesConfig(): HermesConfig {
  const baseUrl = (process.env.HERMES_BASE_URL ?? "").trim().replace(/\/$/, "");
  const routerPath = (process.env.HERMES_ROUTER_PATH ?? "/api/v1/agent-router/route").trim();
  const statusPath = (process.env.HERMES_STATUS_PATH ?? "/api/v1/agent-router/jobs").trim();
  const timeoutMs = Number(process.env.HERMES_TIMEOUT_MS ?? 15000);

  return {
    baseUrl,
    routerPath,
    statusPath,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 15000,
    apiKey: process.env.HERMES_API_KEY ?? "",
  };
}

export function validateHermesConfig(config: HermesConfig): void {
  if (!config.baseUrl) {
    throw new Error("HERMES_BASE_URL is not configured.");
  }

  if (!/^https:\/\//i.test(config.baseUrl)) {
    throw new Error("HERMES_BASE_URL must use HTTPS.");
  }

  if (!config.routerPath.startsWith("/")) {
    throw new Error("HERMES_ROUTER_PATH must start with '/'.");
  }

  if (!config.statusPath.startsWith("/")) {
    throw new Error("HERMES_STATUS_PATH must start with '/'.");
  }
}

export function buildHermesRequest(input: HermesRequestInput): HermesRequestInput & {
  requestId: string;
  traceId: string;
} {
  const requestId = input.requestId ?? createRequestId();

  return {
    ...input,
    intent: input.intent.trim(),
    tenantId: input.tenantId ?? "default-tenant",
    userId: input.userId ?? "copilot-user",
    source: input.source ?? "copilot",
    payload: input.payload ?? {},
    metadata: input.metadata ?? {},
    requestId,
    traceId: input.traceId ?? `${requestId}-trace`,
  };
}

export function buildIdempotencyKey(request: HermesRequestInput): string {
  const tenantId = request.tenantId ?? "default-tenant";
  const userId = request.userId ?? "copilot-user";
  const source = request.source ?? "copilot";
  const intent = request.intent.trim();

  return `${tenantId}:${userId}:${source}:${intent}:${request.requestId ?? createRequestId()}`;
}

export async function sendToHermes(
  requestInput: HermesRequestInput,
): Promise<HermesResponse> {
  const config = getHermesConfig();
  const request = buildHermesRequest(requestInput);
  const idempotencyKey = buildIdempotencyKey(request);

  try {
    validateHermesConfig(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hermes configuration is invalid.";

    return {
      status: "failed",
      request_id: request.requestId,
      trace_id: request.traceId,
      message: "The Copilot-to-Hermes bridge is not configured correctly.",
      error: {
        code: "HERMES_CONFIG_ERROR",
        message,
        retryable: false,
      },
    };
  }

  if (!request.intent) {
    return {
      status: "failed",
      request_id: request.requestId,
      trace_id: request.traceId,
      message: "The Hermes request must include a non-empty intent.",
      error: {
        code: "INVALID_INTENT",
        message: "intent is required and must not be empty.",
        retryable: false,
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const tenantId = request.tenantId ?? "default-tenant";
    const userId = request.userId ?? "copilot-user";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Copilot-Request-Id": request.requestId,
      "X-Copilot-Trace-Id": request.traceId,
      "X-Copilot-Tenant-Id": tenantId,
      "X-Copilot-User-Id": userId,
      "Idempotency-Key": idempotencyKey,
    };

    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(`${config.baseUrl}${config.routerPath}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...request,
        requestId: request.requestId,
        traceId: request.traceId,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok) {
      const errorPayload =
        payload && typeof payload === "object" && "error" in payload && payload.error && typeof payload.error === "object"
          ? (payload.error as Record<string, unknown>)
          : null;

      return {
        status: "failed",
        request_id: request.requestId,
        trace_id: request.traceId,
        message: typeof payload?.message === "string" ? payload.message : "Hermes rejected the request.",
        error: {
          code: typeof errorPayload?.code === "string" ? errorPayload.code : "HERMES_REQUEST_FAILED",
          message:
            typeof errorPayload?.message === "string"
              ? errorPayload.message
              : `Rejected by Hermes with status ${response.status}`,
          retryable: response.status >= 500,
        },
      };
    }

    const normalizedPayload = payload ?? {};

    return {
      status: (normalizedPayload.status as HermesStatus) ?? "success",
      request_id: (normalizedPayload.request_id as string) ?? request.requestId,
      trace_id: (normalizedPayload.trace_id as string) ?? request.traceId,
      correlation_id: normalizedPayload.correlation_id as string | undefined,
      message:
        (normalizedPayload.message as string) ?? "Hermes processed the Copilot request successfully.",
      result: normalizedPayload.result ?? normalizedPayload.data ?? normalizedPayload,
      error: normalizedPayload.error ? (normalizedPayload.error as HermesError) : null,
      retry_after_seconds:
        typeof normalizedPayload.retry_after_seconds === "number"
          ? normalizedPayload.retry_after_seconds
          : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Hermes transport error.";

    return {
      status: "failed",
      request_id: request.requestId,
      trace_id: request.traceId,
      message: "The Copilot-to-Hermes bridge could not reach Hermes.",
      error: {
        code: "HERMES_TRANSPORT_ERROR",
        message,
        retryable: true,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getHermesStatus(requestId: string): Promise<HermesResponse> {
  const config = getHermesConfig();

  try {
    validateHermesConfig(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hermes configuration is invalid.";

    return {
      status: "failed",
      request_id: requestId,
      trace_id: `${requestId}-trace`,
      message: "The Hermes status endpoint cannot be queried because the bridge is not configured.",
      error: {
        code: "HERMES_STATUS_CONFIG_ERROR",
        message,
        retryable: false,
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers: Record<string, string> = {};

    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(`${config.baseUrl}${config.statusPath}/${encodeURIComponent(requestId)}`, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const errorPayload =
      payload && typeof payload === "object" && "error" in payload && payload.error && typeof payload.error === "object"
        ? (payload.error as Record<string, unknown>)
        : null;

    if (!response.ok) {
      return {
        status: "failed",
        request_id: requestId,
        trace_id: `${requestId}-trace`,
        message: typeof payload?.message === "string" ? payload.message : "Unable to fetch Hermes job status.",
        error: {
          code: typeof errorPayload?.code === "string" ? errorPayload.code : "HERMES_STATUS_FAILED",
          message:
            typeof errorPayload?.message === "string"
              ? errorPayload.message
              : `Hermes returned ${response.status} while fetching status.`,
          retryable: response.status >= 500,
        },
      };
    }

    return {
      status: ((payload?.status as HermesStatus) ?? "pending") as HermesStatus,
      request_id: (payload?.request_id as string) ?? requestId,
      trace_id: (payload?.trace_id as string) ?? `${requestId}-trace`,
      correlation_id: payload?.correlation_id as string | undefined,
      message: (payload?.message as string) ?? "Hermes status retrieved successfully.",
      result: payload?.result ?? payload?.data ?? payload,
      error: payload?.error ? (payload.error as HermesError) : null,
      retry_after_seconds:
        typeof payload?.retry_after_seconds === "number" ? payload.retry_after_seconds : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Hermes status error.";

    return {
      status: "failed",
      request_id: requestId,
      trace_id: `${requestId}-trace`,
      message: "The Copilot-to-Hermes bridge could not reach the status endpoint.",
      error: {
        code: "HERMES_STATUS_TRANSPORT_ERROR",
        message,
        retryable: true,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
