import {
  processLemonSqueezyPayload,
  processWebhookDelivery,
} from "@/lib/payments/webhook-db.js";
import { guardWebhookRequest } from "@/lib/payments/webhook-rate-limit.js";
import { verifyLemonSqueezySignature } from "@/lib/payments/webhook-utils.js";

export const dynamic = "force-dynamic";

function lemonSqueezyEventId(payload) {
  const eventName = payload?.meta?.event_name ?? "unknown";
  const objectId = payload?.data?.id ?? payload?.meta?.webhook_id ?? "unknown";
  return `${eventName}:${objectId}`;
}

export async function POST(request) {
  const blocked = await guardWebhookRequest(request, { scope: "webhook:lemonsqueezy" });
  if (blocked) return blocked;

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { status: "error", error: "Lemon Squeezy webhook secret is not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ status: "error", error: "Invalid JSON body" }, { status: 400 });
  }

  const signature = request.headers.get("x-signature") ?? "";
  const signatureValid = verifyLemonSqueezySignature(rawBody, signature, secret);
  const event = {
    provider: "lemonsqueezy",
    eventId: lemonSqueezyEventId(payload),
    eventType: String(payload?.meta?.event_name ?? "unknown"),
    payload,
    signatureValid,
    invalidReason: signature ? "Invalid signature" : "Missing signature",
  };

  try {
    const result = await processWebhookDelivery(event, (connection) =>
      processLemonSqueezyPayload(connection, payload),
    );

    if (result.status === "invalid") {
      return Response.json({ status: "error", error: result.invalidReason ?? "Invalid signature" }, { status: 401 });
    }

    return Response.json({
      status: "ok",
      received: true,
      duplicate: result.duplicate,
      eventStatus: result.status,
    });
  } catch (error) {
    console.error("lemonsqueezy webhook failed", error);
    return Response.json({ status: "error", error: "Webhook processing failed" }, { status: 500 });
  }
}
