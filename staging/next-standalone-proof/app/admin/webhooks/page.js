import { withConnection } from "@/lib/auth/db.js";
import { listWebhookEvents } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin webhooks | Agyflow" };

export default async function AdminWebhooksPage() {
  const events = await withConnection((connection) => listWebhookEvents(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">WEBHOOKS</p>
        <h2>Webhook inspector</h2>
        <p className="tagline">Recent Lemon Squeezy and Gumroad deliveries with idempotency status.</p>
      </div>
      {events.length === 0 ? (
        <p className="empty-state">No webhook events exist yet. Signed purchase events will appear here after delivery.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Event</th><th>Provider</th><th>Status</th><th>Signature</th><th>Duplicates</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.eventType}</strong><span>{event.eventId}</span></td>
                  <td>{event.provider}</td>
                  <td>{event.processStatus}</td>
                  <td>{event.signatureValid ? "Valid" : "Invalid"}</td>
                  <td>{event.duplicateCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
