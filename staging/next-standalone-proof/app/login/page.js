import { redirect } from "next/navigation";

import { LoginForm } from "@/app/components/AuthForms.js";
import { getSessionUser } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in | Agyflow" };

export default async function LoginPage({ searchParams }) {
  const user = await getSessionUser();
  if (user) redirect("/account");

  return (
    <main className="auth-shell">
      <a className="brand-link" href="/">Agyflow</a>
      <p className="eyebrow">ACCOUNT ACCESS</p>
      <h1>Sign in</h1>
      <p className="tagline">Use the email and password connected to your Agyflow account.</p>
      {searchParams?.reset === "1" ? (
        <p className="feedback feedback-success" role="status">Your password was updated. Sign in with the new password.</p>
      ) : null}
      <LoginForm nextPath={searchParams?.next} />
    </main>
  );
}
