"use client";

export default function AdminError({ error, reset }) {
  return (
    <div className="admin-panel" role="alert">
      <p className="eyebrow">ERROR</p>
      <h2>Admin data did not load</h2>
      <p className="tagline">{error?.message || "The admin request failed."}</p>
      <button type="button" onClick={reset}>Retry</button>
    </div>
  );
}
