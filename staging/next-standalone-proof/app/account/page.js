import { redirect } from "next/navigation";

import { SessionActions } from "@/app/components/AuthForms.js";
import { getSessionUser } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account | Agyflow" };

export default async function AccountPage({ searchParams }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  return (
    <main className="account-shell">
      <a className="brand-link" href="/">Agyflow</a>
      <p className="eyebrow">ACCOUNT</p>
      <h1>{user.name || user.email}</h1>
      {searchParams?.registered === "1" ? (
        <p className={`feedback feedback-${searchParams.verification === "failed" ? "error" : "success"}`} role="status">
          {searchParams.verification === "failed"
            ? "Your account was created, but the verification email could not be sent. Try sending it again below."
            : "Your account was created. Check your inbox for the verification link."}
        </p>
      ) : null}
      {searchParams?.forbidden === "1" ? (
        <p className="feedback feedback-error" role="alert">This account does not have admin access.</p>
      ) : null}
      <dl className="account-details">
        <div><dt>Email</dt><dd>{user.email}</dd></div>
        <div><dt>Email status</dt><dd>{user.emailVerified ? "Verified" : "Not verified"}</dd></div>
        <div><dt>Role</dt><dd>{user.role}</dd></div>
      </dl>
      <nav className="account-nav" aria-label="Account navigation">
        <a href="/products">Browse products</a>
        {user.role === "admin" ? <a href="/admin">Open admin overview</a> : null}
      </nav>
      <SessionActions emailVerified={user.emailVerified} />
    </main>
  );
}
