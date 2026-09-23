import { withConnection } from "@/lib/auth/db.js";
import { listAdminProducts } from "@/lib/admin/data.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin products | Agyflow" };

function price(cents, currency) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function AdminProductsPage() {
  const products = await withConnection((connection) => listAdminProducts(connection));

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <p className="eyebrow">PRODUCTS</p>
        <h2>Product catalog</h2>
        <p className="tagline">Review product status, pricing, and checkout coverage.</p>
      </div>
      {products.length === 0 ? (
        <p className="empty-state">No products exist yet. Create one through the admin products API.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Status</th><th>Price</th><th>Category</th><th>Checkout</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.slug}>
                  <td><strong>{product.name}</strong><span>{product.slug}</span></td>
                  <td>{product.status}</td>
                  <td>{price(product.priceCents, product.currency)}</td>
                  <td>{product.category}</td>
                  <td>{product.checkoutUrl ? "Configured" : "Missing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
