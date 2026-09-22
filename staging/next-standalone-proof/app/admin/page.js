import { redirect } from "next/navigation";

import { getAdminOverview } from "@/lib/auth/db.js";
import { AuthInputError, requireAdmin } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin overview | Agyflow" };

export default async function AdminPage() {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthInputError) {
      redirect(error.code === "unauthorized" ? "/login?next=/admin" : "/account?forbidden=1");
    }
    throw error;
  }

  const overview = await getAdminOverview();

  return (
    <main className="admin-shell">
      <a className="brand-link" href="/account">Agyflow account</a>
      <p className="eyebrow">ADMIN OVERVIEW</p>
      <h1>Account health</h1>
      <p className="tagline">Live MySQL counts visible only to signed-in administrators.</p>
      <dl className="admin-metrics">
        <div><dt>Total users</dt><dd>{overview.users.total}</dd></div>
        <div><dt>Verified users</dt><dd>{overview.users.verified}</dd></div>
        <div><dt>Unverified users</dt><dd>{overview.users.unverified}</dd></div>
        <div><dt>Administrators</dt><dd>{overview.users.admins}</dd></div>
        <div><dt>Active sessions</dt><dd>{overview.sessions.active}</dd></div>
      </dl>
      <p className="meta">Signed in as {admin.email}</p>
      <nav><a href="/account">Back to account</a></nav>
    </main>
  );
}
