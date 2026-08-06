"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, PasswordField, Checkbox, Spinner, ErrorIcon } from "@/components/auth/FormFields";
import { AuthLogo, AuthWordmark } from "@/components/auth/AuthLogo";
import { useAuth } from "@/lib/auth/AuthProvider";

type Status = "idle" | "loading" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    const result = await signIn({ email: email.trim(), password, rememberMe: remember });

    if (result.error) {
      setStatus("error");
      setFormError(result.error);
      return;
    }

    if (result.role !== "super_admin") {
      await signOut();
      setStatus("error");
      setFormError("This console is for OASIS and Swivel Technologies staff only.");
      return;
    }

    router.push("/portal/dashboard");
  }

  return (
    <div className="auth-shell" id="main-content">
      <div className="auth-bg-blob-3" aria-hidden="true" />

      <div className="auth-outer">
        <aside className="auth-panel">
          <div className="auth-panel-logo">
            <AuthLogo srcOverride="/images/logo1.png" href="/" />
          </div>
          <div className="auth-panel-copy">
            <h2>Platform console.</h2>
            <p>
              Sign in to manage schools, subscriptions, platform health and support &#8212; for OASIS &amp; Swivel
              Technologies staff only.
            </p>
            <div className="auth-panel-stats">
              <div>
                <strong>10+</strong>
                <span>schools onboarded</span>
              </div>
              <div>
                <strong>95%</strong>
                <span>platform uptime</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>monitoring &amp; support</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="auth-form-col">
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ marginBottom: 20 }}>
              <AuthWordmark href="/" />
            </div>

            <div className="auth-card">
              <h1>Staff sign in</h1>
              <p className="auth-subtitle">This console is for OASIS and Swivel Technologies staff.</p>

              {status === "error" && formError && (
                <div className="auth-alert auth-alert-error" role="alert">
                  <ErrorIcon />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  success={EMAIL_RE.test(email)}
                  required
                />
                <PasswordField
                  label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />

                <div className="auth-checkbox-row">
                  <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
                  <span style={{ color: "#a19d95", fontSize: 14 }}>Internal use only</span>
                </div>

                <button type="submit" className="auth-btn auth-btn-primary" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Spinner /> Signing in&hellip;
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p className="auth-footer-text">
                Need access? <a href="mailto:support@oasis.co.ug" className="auth-link">Contact your team lead</a>
              </p>

              <div className="auth-footer-links">
                <Link href="/privacy-notice-cookie-statement/">Privacy</Link>
                <Link href="/legal-statement/">Terms</Link>
                <Link href="/">OASIS.co.ug</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
