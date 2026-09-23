import { withConnection } from "@/lib/auth/db.js";
import { listMediaAssets } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin media | Agyflow" };

function size(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const media = await withConnection((connection) => listMediaAssets(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">MEDIA</p>
        <h2>Media library</h2>
        <p className="tagline">Uploaded asset metadata for product images and downloadable files.</p>
      </div>
      {media.length === 0 ? (
        <p className="empty-state">No media assets exist yet. Uploaded files will appear here after FASE 5 storage is enabled.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>File</th><th>Kind</th><th>MIME</th><th>Size</th><th>Path</th></tr></thead>
            <tbody>
              {media.map((asset) => (
                <tr key={asset.id}>
                  <td><strong>{asset.originalFilename}</strong><span>{asset.storedFilename}</span></td>
                  <td>{asset.kind}</td>
                  <td>{asset.mimeType}</td>
                  <td>{size(asset.sizeBytes)}</td>
                  <td>{asset.publicPath || "Private"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
