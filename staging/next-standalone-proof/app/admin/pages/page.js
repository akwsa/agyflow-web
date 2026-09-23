import { withConnection } from "@/lib/auth/db.js";
import { listCmsPages } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin CMS pages | Agyflow" };

export default async function AdminCmsPagesPage() {
  const pages = await withConnection((connection) => listCmsPages(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">CMS</p>
        <h2>Legal pages</h2>
        <p className="tagline">Privacy, terms, and refund content in EN, DE, and FR.</p>
      </div>
      {pages.length === 0 ? (
        <p className="empty-state">No CMS pages exist yet. Save privacy, terms, or refund content through the admin pages API.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Page</th><th>Locale</th><th>Status</th><th>Updated</th><th>Published</th></tr></thead>
            <tbody>
              {pages.map((page) => (
                <tr key={`${page.slug}-${page.locale}`}>
                  <td><strong>{page.title}</strong><span>{page.slug}</span></td>
                  <td>{page.locale}</td>
                  <td>{page.status}</td>
                  <td>{page.updatedAt || "Not updated"}</td>
                  <td>{page.publishedAt || "Draft"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
