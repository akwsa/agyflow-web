"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { postJson, safeReturnPath } from "@/lib/auth/browser-client.js";

function Feedback({ message, kind = "error" }) {
  if (!message) return null;
  return (
    <p className={`feedback feedback-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}

export function LoginForm({ nextPath }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await postJson("/api/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      });
      router.replace(safeReturnPath(nextPath));
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">Email address</label>
      <input id="login-email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <Feedback message={error} />
      <button type="submit" disabled={busy}>
        {busy ? "Signing in..." : "Sign in"}
      </button>
      <div className="form-links">
        <a href="/forgot-password">Forgot password?</a>
        <a href="/register">Create an account</a>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await postJson("/api/auth/register", {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      const delivery = result.verificationEmailSent ? "sent" : "failed";
      router.replace(`/account?registered=1&verification=${delivery}`);
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="register-name">Name</label>
      <input id="register-name" name="name" autoComplete="name" required />
      <label htmlFor="register-email">Email address</label>
      <input id="register-email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="register-password">Password</label>
      <input
        id="register-password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        aria-describedby="password-help"
        required
      />
      <p id="password-help" className="field-help">
        Use at least 8 characters.
      </p>
      <Feedback message={error} />
      <button type="submit" disabled={busy}>
        {busy ? "Creating account..." : "Create account"}
      </button>
      <div className="form-links">
        <a href="/login">Already have an account?</a>
      </div>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await postJson("/api/auth/request-password-reset", {
        email: form.get("email"),
      });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="reset-email">Email address</label>
      <input id="reset-email" name="email" type="email" autoComplete="email" required />
      <Feedback message={error} />
      <Feedback message={message} kind="success" />
      <button type="submit" disabled={busy}>
        {busy ? "Sending..." : "Send reset link"}
      </button>
      <div className="form-links">
        <a href="/login">Back to sign in</a>
      </div>
    </form>
  );
}

export function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [error, setError] = useState(token ? "" : "This reset link is missing its token.");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("password-confirmation") || "");
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await postJson("/api/auth/reset-password", { token, password });
      router.replace("/login?reset=1");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="new-password">New password</label>
      <input
        id="new-password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        disabled={!token}
      />
      <label htmlFor="new-password-confirmation">Confirm new password</label>
      <input
        id="new-password-confirmation"
        name="password-confirmation"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        disabled={!token}
      />
      <Feedback message={error} />
      <button type="submit" disabled={busy || !token}>
        {busy ? "Updating..." : "Update password"}
      </button>
      <div className="form-links">
        <a href="/forgot-password">Request another link</a>
      </div>
    </form>
  );
}

export function VerifyEmail({ token }) {
  const started = useRef(false);
  const [state, setState] = useState({
    status: token ? "loading" : "error",
    message: token ? "Verifying your email address..." : "This verification link is missing its token.",
  });

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    postJson("/api/auth/verify-email", { token })
      .then(() =>
        setState({ status: "success", message: "Your email address is verified." }),
      )
      .catch((error) => setState({ status: "error", message: error.message }));
  }, [token]);

  return (
    <div className="verification-state" aria-live="polite" aria-busy={state.status === "loading"}>
      <Feedback message={state.message} kind={state.status === "error" ? "error" : "success"} />
      {state.status === "success" ? <a href="/account">Continue to your account</a> : null}
      {state.status === "error" ? <a href="/account">Open your account</a> : null}
    </div>
  );
}

export function SessionActions({ emailVerified }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");

  async function resend() {
    setBusyAction("resend");
    setError("");
    setMessage("");
    try {
      const result = await postJson("/api/auth/resend-verification", {});
      setMessage(result.alreadyVerified ? "Your email is already verified." : "Verification email sent.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyAction("");
    }
  }

  async function signOut() {
    setBusyAction("logout");
    setError("");
    try {
      await postJson("/api/auth/logout", {});
      router.replace("/login");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
      setBusyAction("");
    }
  }

  return (
    <div className="session-actions">
      {!emailVerified ? (
        <button type="button" className="secondary-button" onClick={resend} disabled={Boolean(busyAction)}>
          {busyAction === "resend" ? "Sending..." : "Resend verification email"}
        </button>
      ) : null}
      <button type="button" onClick={signOut} disabled={Boolean(busyAction)}>
        {busyAction === "logout" ? "Signing out..." : "Sign out"}
      </button>
      <Feedback message={error} />
      <Feedback message={message} kind="success" />
    </div>
  );
}
