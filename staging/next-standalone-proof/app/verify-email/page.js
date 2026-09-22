import { VerifyEmail } from "@/app/components/AuthForms.js";

export const metadata = { title: "Verify email | Agyflow" };

export default function VerifyEmailPage({ searchParams }) {
  return (
    <main className="auth-shell">
      <a className="brand-link" href="/">Agyflow</a>
      <p className="eyebrow">EMAIL VERIFICATION</p>
      <h1>Verify your email</h1>
      <VerifyEmail token={String(searchParams?.token ?? "")} />
    </main>
  );
}
