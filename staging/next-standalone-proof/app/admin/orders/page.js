import { withConnection } from "@/lib/auth/db.js";
import { listAdminOrders } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin orders | Agyflow" };

function price(cents, currency) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function AdminOrdersPage() {
  const orders = await withConnection((connection) => listAdminOrders(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">ORDERS</p>
        <h2>Order tracking</h2>
        <p className="tagline">Purchases created by Lemon Squeezy and Gumroad webhooks.</p>
      </div>
      {orders.length === 0 ? (
        <p className="empty-state">No orders have been recorded yet. Webhook purchases will appear here.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Provider</th><th>Status</th><th>Total</th><th>Items</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.orderNumber}</strong><span>{order.providerOrderId}</span></td>
                  <td>{order.email}</td>
                  <td>{order.provider}</td>
                  <td>{order.status}</td>
                  <td>{price(order.totalCents, order.currency)}</td>
                  <td>{order.itemCount} items, {order.tokenCount} tokens</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
