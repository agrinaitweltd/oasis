"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { TextField, PasswordField, Checkbox, Spinner, SuccessIcon, ErrorIcon } from "@/components/auth/FormFields";
import { AuthLogo } from "@/components/auth/AuthLogo";

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    // No authentication backend exists yet - this simulates the request so the
    // UI/UX (loading, error, success states) is fully in place ahead of it.
    await new Promise((r) => setTimeout(r, 1200));

    if (email.trim().toLowerCase() === "demo@oasis.co.ug" && password === "wrongpassword") {
      setStatus("error");
      setFormError("That email and password don't match. Please try again.");
      return;
    }

    setStatus("success");
  }

  return (
    <div className="auth-shell" id="main-content">
      <aside className="auth-panel">
        <div className="auth-panel-logo">
          <AuthLogo />
        </div>
        <div className="auth-panel-copy">
          <h2>One platform. Every school.</h2>
          <p>
            Sign in to manage admissions, attendance, fees, timetables and more &#8212; all in one place, built for
            schools across Uganda.
          </p>
          <div className="auth-panel-stats">
            <div>
              <strong>10+</strong>
              <span>hours saved weekly</span>
            </div>
            <div>
              <strong>95%</strong>
              <span>faster fee collection</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>parent &amp; teacher access</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="auth-form-col">
        <div className="auth-card">
          <div className="auth-card-logo" style={{ display: "none" }} />

          {status === "success" ? (
            <SuccessState email={email} />
          ) : (
            <>
              <h1>Welcome back</h1>
              <p className="auth-subtitle">Sign in to your OASIS account to continue.</p>

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
                  placeholder="you@school.ug"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />
                <PasswordField
                  label="Password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />

                <div className="auth-checkbox-row">
                  <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
                  <Link href="/forgot-password" className="auth-link">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className="auth-btn auth-btn-primary" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Spinner /> Signing in&hellip;
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="auth-divider">New to OASIS</div>

              <Link href="/register" className="auth-btn auth-btn-secondary" style={{ textDecoration: "none" }}>
                Create a school account
              </Link>
            </>
          )}

          <p className="auth-footer-text">
            Need help? <a href="mailto:support@oasis.co.ug" className="auth-link">Contact support</a>
          </p>

          <div className="auth-footer-links">
            <Link href="/privacy-notice-cookie-statement/">Privacy</Link>
            <Link href="/legal-statement/">Terms</Link>
            <Link href="/">OASIS.co.ug</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessState({ email }: { email: string }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#eaf7ee",
          color: "#1e7b34",
          display: "grid",
          placeContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <SuccessIcon />
      </div>
      <h1>You&#8217;re signed in</h1>
      <p className="auth-subtitle">
        Welcome back, {email}. The OASIS platform dashboard is being built and will be available here soon.
      </p>
      <Link href="/" className="auth-btn auth-btn-secondary" style={{ textDecoration: "none", marginTop: 8 }}>
        Return to homepage
      </Link>
    </div>
  );
}
