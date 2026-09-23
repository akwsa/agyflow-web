import { withConnection } from "@/lib/auth/db.js";
import { getAdminDashboardData } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin dashboard | Agyflow" };

function money(cents, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function AdminPage() {
  const overview = await withConnection((connection) => getAdminDashboardData(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">DASHBOARD</p>
        <h2>Store operations</h2>
        <p className="tagline">Live database totals for products, orders, users, and webhook processing.</p>
      </div>
      <dl className="admin-metrics admin-metrics-wide">
        <div><dt>Products</dt><dd>{overview.products.total}</dd><p>{overview.products.live} live</p></div>
        <div><dt>Paid orders</dt><dd>{overview.orders.total}</dd><p>{money(overview.orders.grossCents)} gross</p></div>
        <div><dt>Users</dt><dd>{overview.users.total}</dd><p>{overview.users.admins} admins</p></div>
        <div><dt>Webhook events</dt><dd>{overview.webhooks.total}</dd><p>{overview.webhooks.failed} failed</p></div>
      </dl>
    </div>
  );
}
