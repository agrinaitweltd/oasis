"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordField, Spinner, SuccessIcon, ErrorIcon } from "@/components/auth/FormFields";
import { AuthLogo, AuthWordmark } from "@/components/auth/AuthLogo";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  function validate() {
    const next: typeof errors = {};
    if (!password) next.password = "Enter a new password.";
    else if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setStatus("loading");
    const result = await updatePassword(password);
    if (result.error) {
      setStatus("error");
      setFormError(result.error);
      return;
    }
    setStatus("success");
    setTimeout(() => router.push("/portal/login"), 1800);
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
            <h2>Choose a new password.</h2>
            <p>Pick something you haven&rsquo;t used before. You&rsquo;ll be signed in automatically once it&rsquo;s set.</p>
          </div>
        </aside>

        <div className="auth-form-col">
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ marginBottom: 20 }}>
              <AuthWordmark />
            </div>
            <div className="auth-card">
              {status === "success" ? (
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
              ) : (
                <>
                  <h1>Set a new password</h1>
                  <p className="auth-subtitle">Choose a strong password for your OASIS account.</p>

                  {status === "error" && formError && (
                    <div className="auth-alert auth-alert-error" role="alert">
                      <ErrorIcon />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <PasswordField
                      label="New password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={errors.password}
                      hint="At least 8 characters."
                      required
                    />
                    <PasswordField
                      label="Confirm new password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      error={errors.confirm}
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
                    <Link href="/portal/login" className="auth-link">
                      Back to sign in
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
