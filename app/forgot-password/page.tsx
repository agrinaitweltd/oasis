"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { TextField, Spinner, SuccessIcon } from "@/components/auth/FormFields";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setStatus("loading");
    const result = await requestPasswordReset(email.trim());
    // Always show the "check your email" state regardless of whether the
    // address exists - never reveal account existence to an unauthenticated
    // caller. Supabase itself no-ops silently for unknown addresses.
    if (result.error) {
      setError(result.error);
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="auth-shell" id="main-content">
      <div className="auth-bg-blob-3" aria-hidden="true" />

      <div className="auth-outer">
        <aside className="auth-panel">
          <div className="auth-panel-logo">
            <AuthLogo />
          </div>
          <div className="auth-panel-copy">
            <h2>Forgot your password?</h2>
            <p>No problem. Enter the email address on your account and we&#8217;ll send you a link to reset it.</p>
          </div>
        </aside>

        <div className="auth-form-col">
        <div className="auth-card">
          <Link href="/login" className="auth-back-link">
            &larr; Back to sign in
          </Link>

          {status === "sent" ? (
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
              <h1>Check your email</h1>
              <p className="auth-subtitle">
                If an account exists for {email}, we&#8217;ve sent a link to reset your password.
              </p>
              <Link href="/login" className="auth-btn auth-btn-secondary" style={{ textDecoration: "none" }}>
                Return to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1>Reset your password</h1>
              <p className="auth-subtitle">Enter your email address and we&#8217;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@school.ug"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  required
                />
                <button type="submit" className="auth-btn auth-btn-primary" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Spinner /> Sending&hellip;
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          )}

          <div className="auth-footer-links">
            <Link href="/privacy-notice-cookie-statement/">Privacy</Link>
            <Link href="/legal-statement/">Terms</Link>
            <Link href="/">OASIS.co.ug</Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
