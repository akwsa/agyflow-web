import { ForgotPasswordForm } from "@/app/components/AuthForms.js";

export const metadata = { title: "Reset password | Agyflow" };

export default function ForgotPasswordPage() {
  return (
    <main className="auth-shell">
      <a className="brand-link" href="/">Agyflow</a>
      <p className="eyebrow">PASSWORD RECOVERY</p>
      <h1>Request a reset link</h1>
      <p className="tagline">Enter your account email. If it matches an account, we will send a one-time link.</p>
      <ForgotPasswordForm />
    </main>
  );
}
