import { withConnection } from "@/lib/auth/db.js";
import { listAdminUsers } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin users | Agyflow" };

export default async function AdminUsersPage() {
  const users = await withConnection((connection) => listAdminUsers(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">USERS</p>
        <h2>User management</h2>
        <p className="tagline">Account roles, verification state, and order totals.</p>
      </div>
      {users.length === 0 ? (
        <p className="empty-state">No users exist yet. New customer and admin accounts will appear here.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Role</th><th>Email</th><th>Orders</th><th>Total spend</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name || user.email}</strong><span>#{user.id}</span></td>
                  <td>{user.role}</td>
                  <td>{user.emailVerified ? "Verified" : "Unverified"}</td>
                  <td>{user.orderCount}</td>
                  <td>${(user.totalSpendCents / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
