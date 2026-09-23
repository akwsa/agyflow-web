import {
  gumroadEventType,
  processGumroadPayload,
  processWebhookDelivery,
} from "@/lib/payments/webhook-db.js";
import { verifyGumroadSignature } from "@/lib/payments/webhook-utils.js";

export const dynamic = "force-dynamic";

async function parseGumroadPayload(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function gumroadEventId(payload, eventType) {
  const saleId = payload.sale_id ?? payload.id ?? payload.order_number ?? "unknown";
  return `${eventType}:${saleId}`;
}

export async function POST(request) {
  const secret = process.env.GUMROAD_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { status: "error", error: "Gumroad webhook secret is not configured" },
      { status: 500 },
    );
  }

  let payload;
  try {
    payload = await parseGumroadPayload(request);
  } catch {
    return Response.json({ status: "error", error: "Invalid webhook body" }, { status: 400 });
  }

  const eventType = gumroadEventType(payload);
  const signatureValid = verifyGumroadSignature(String(payload.secret ?? ""), secret);
  const event = {
    provider: "gumroad",
    eventId: gumroadEventId(payload, eventType),
    eventType,
    payload,
    signatureValid,
    invalidReason: payload.secret ? "Invalid signature" : "Missing secret",
  };

  try {
    const result = await processWebhookDelivery(event, (connection) =>
      processGumroadPayload(connection, payload),
    );

    if (result.status === "invalid") {
      return Response.json({ status: "error", error: "Invalid signature" }, { status: 401 });
    }

    return Response.json({
      status: "ok",
      received: true,
      duplicate: result.duplicate,
      eventStatus: result.status,
    });
  } catch (error) {
    console.error("gumroad webhook failed", error);
    return Response.json({ status: "error", error: "Webhook processing failed" }, { status: 500 });
  }
}
