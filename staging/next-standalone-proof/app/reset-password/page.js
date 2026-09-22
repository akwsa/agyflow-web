import { ResetPasswordForm } from "@/app/components/AuthForms.js";

export const metadata = { title: "Choose a new password | Agyflow" };

export default function ResetPasswordPage({ searchParams }) {
  return (
    <main className="auth-shell">
      <a className="brand-link" href="/">Agyflow</a>
      <p className="eyebrow">PASSWORD RECOVERY</p>
      <h1>Choose a new password</h1>
      <p className="tagline">The link can be used once and expires one hour after it is issued.</p>
      <ResetPasswordForm token={String(searchParams?.token ?? "")} />
    </main>
  );
}
