import { redirect } from "next/navigation";

import { RegisterForm } from "@/app/components/AuthForms.js";
import { getSessionUser } from "@/lib/auth/session.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create account | Agyflow" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/account");

  return (
    <main className="auth-shell">
      <a className="brand-link" href="/">Agyflow</a>
      <p className="eyebrow">NEW ACCOUNT</p>
      <h1>Create your account</h1>
      <p className="tagline">Register once to access account and product services on staging.</p>
      <RegisterForm />
    </main>
  );
}
