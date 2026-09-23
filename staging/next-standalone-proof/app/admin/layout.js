import { redirect } from "next/navigation";

import { AuthInputError, requireAdmin } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/orders", "Orders"],
  ["/admin/users", "Users"],
  ["/admin/pages", "CMS pages"],
  ["/admin/media", "Media"],
  ["/admin/webhooks", "Webhooks"],
];

export default async function AdminLayout({ children }) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthInputError) {
      redirect(error.code === "unauthorized" ? "/login?next=/admin" : "/account?forbidden=1");
    }
    throw error;
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div>
          <a className="admin-home" href="/account">Agyflow account</a>
          <p className="eyebrow">ADMIN</p>
          <h1>Operations</h1>
          <p className="meta">Signed in as {admin.email}</p>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      </aside>
      <section className="admin-content">
        {children}
      </section>
    </main>
  );
}
