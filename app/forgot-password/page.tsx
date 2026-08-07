"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, PasswordField, Spinner, SuccessIcon, ErrorIcon } from "@/components/auth/FormFields";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { useAuth } from "@/lib/auth/AuthProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "request" | "reset" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { sendPasswordResetOtp, resetPasswordWithOtp } = useAuth();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  async function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setStatus("loading");
    const result = await sendPasswordResetOtp(email.trim());
    setStatus("idle");
    // Always move to the code-entry step regardless of whether the address
    // exists - never reveal account existence to an unauthenticated caller.
    if (result.error) {
      setError(result.error);
      return;
    }
    setStep("reset");
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || code.trim().length !== 6) {
      setError("Enter the 6-digit code we emailed you.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (confirm !== password) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setStatus("loading");
    const result = await resetPasswordWithOtp({ email: email.trim(), code: code.trim(), newPassword: password });
    setStatus("idle");
    if (result.error) {
      setError(result.error);
      return;
    }
    setStep("success");
    setTimeout(() => router.push("/login"), 1800);
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
            <p>No problem. Enter the email address on your account and we&#8217;ll send you a 6-digit code.</p>
          </div>
        </aside>

        <div className="auth-form-col">
          <div className="auth-card">
            <Link href="/login" className="auth-back-link">
              &larr; Back to sign in
            </Link>

            {step === "success" ? (
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
                <h1>Password updated</h1>
                <p className="auth-subtitle">Taking you to sign in&hellip;</p>
              </div>
            ) : step === "request" ? (
              <>
                <h1>Reset your password</h1>
                <p className="auth-subtitle">Enter your email address and we&#8217;ll send you a 6-digit code.</p>

                {error && (
                  <div className="auth-alert auth-alert-error" role="alert">
                    <ErrorIcon />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRequestCode} noValidate>
                  <TextField
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@school.ug"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="auth-btn auth-btn-primary" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Spinner /> Sending&hellip;
                      </>
                    ) : (
                      "Send code"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1>Enter your code</h1>
                <p className="auth-subtitle">
                  If an account exists for {email}, we&#8217;ve sent a 6-digit code. It expires in 10 minutes.
                </p>

                {error && (
                  <div className="auth-alert auth-alert-error" role="alert">
                    <ErrorIcon />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} noValidate>
                  <TextField
                    label="6-digit code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                  <PasswordField
                    label="New password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    hint="At least 6 characters."
                    required
                  />
                  <PasswordField
                    label="Confirm new password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                  <button type="submit" className="auth-btn auth-btn-primary" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Spinner /> Updating&hellip;
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </form>

                <p className="auth-footer-text">
                  <button
                    type="button"
                    className="auth-link"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                    onClick={handleRequestCode}
                  >
                    Resend code
                  </button>
                </p>
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
