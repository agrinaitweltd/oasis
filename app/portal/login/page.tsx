"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, PasswordField, Checkbox, Spinner, ErrorIcon } from "@/components/auth/FormFields";
import { AuthLogo, AuthWordmark } from "@/components/auth/AuthLogo";
import { AuthSchoolSelector } from "@/components/auth/AuthSchoolSelector";
import { useMockAuth } from "@/hooks/useMockAuth";
import type { School } from "@/types/portal";

type Status = "idle" | "loading" | "error";

export default function PortalLoginPage() {
  const router = useRouter();
  const { signIn } = useMockAuth();

  const [school, setSchool] = useState<School | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<{ school?: string; username?: string; password?: string }>({});

  function validate() {
    const next: typeof errors = {};
    if (!school) next.school = "Please select your school to continue.";
    if (!username.trim()) next.username = "Enter your username.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 700));

    const result = signIn(username.trim(), password, school!.id);
    if (result.error) {
      setStatus("error");
      setFormError(result.error);
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
            <h2>One platform. Every school.</h2>
            <p>
              Sign in to manage admissions, attendance, fees, timetables and more &#8212; all in one place, built
              for schools across Uganda.
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
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ marginBottom: 20 }}>
              <AuthWordmark href="/" />
            </div>

            <div className="auth-card">
              <h1>Welcome back</h1>
              <p className="auth-subtitle">Sign in to your OASIS account to continue.</p>

              {status === "error" && formError && (
                <div className="auth-alert auth-alert-error" role="alert">
                  <ErrorIcon />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <AuthSchoolSelector value={school} onChange={setSchool} error={errors.school} />

                <TextField
                  label="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
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
                    "Sign In"
                  )}
                </button>
              </form>

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
      </div>
    </div>
  );
}
