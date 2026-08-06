"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, PasswordField, Checkbox, Spinner, SuccessIcon, ErrorIcon } from "@/components/auth/FormFields";
import { AuthLogo, AuthWordmark } from "@/components/auth/AuthLogo";
import { loadApplication, saveApplication } from "@/lib/onboarding-storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { redirectPathForRole } from "@/lib/auth/roles";

type Status = "idle" | "loading" | "success" | "error";
type Mode = "login" | "signup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthPage({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [direction, setDirection] = useState<"forward" | "backward">(mode === "signup" ? "forward" : "backward");

  function switchMode(next: Mode) {
    if (next === mode) return;
    setDirection(next === "signup" ? "forward" : "backward");
    router.push(next === "signup" ? "/signup" : "/login");
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
            {mode === "login" ? (
              <>
                <h2>One platform. Every school.</h2>
                <p>
                  Sign in to manage admissions, attendance, fees, timetables and more &#8212; all in one place, built
                  for schools across Uganda.
                </p>
              </>
            ) : (
              <>
                <h2>Start your OASIS journey.</h2>
                <p>
                  Tell us a little about your school and we&#8217;ll take you straight into the guided registration
                  &#8212; no paperwork, no waiting on hold.
                </p>
              </>
            )}
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
              <AuthWordmark />
            </div>

            <div className="auth-mode-toggle" role="tablist" aria-label="Sign in or create an account">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={`auth-mode-btn${mode === "login" ? " is-active" : ""}`}
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`auth-mode-btn${mode === "signup" ? " is-active" : ""}`}
                onClick={() => switchMode("signup")}
              >
                Sign up
              </button>
            </div>

            <div className="auth-flip-stage">
              <div key={mode} className={`auth-card auth-flip-face ${direction === "forward" ? "enter-from-right" : "enter-from-left"}`}>
                {mode === "login" ? <LoginForm /> : <SignupForm onDone={() => switchMode("login")} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  function validate() {
    const next: { email?: string; password?: string } = {};
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

    setStatus("success");
    router.push(redirectPathForRole(result.role));
  }

  if (status === "success") return <SuccessState email={email} />;

  return (
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

      <p className="auth-footer-text">
        Need help? <a href="mailto:support@oasis.co.ug" className="auth-link">Contact support</a>
      </p>

      <div className="auth-footer-links">
        <Link href="/privacy-notice-cookie-statement/">Privacy</Link>
        <Link href="/legal-statement/">Terms</Link>
        <Link href="/">OASIS.co.ug</Link>
      </div>
    </>
  );
}

function SignupForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ schoolName?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function validate() {
    const next: { schoolName?: string; email?: string } = {};
    if (!schoolName.trim()) next.schoolName = "Enter your school's name.";
    if (!email.trim()) next.email = "Enter a work email address.";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    const app = loadApplication();
    saveApplication({
      ...app,
      data: {
        ...app.data,
        organisation: { ...app.data.organisation, schoolName: schoolName.trim(), schoolEmail: email.trim() },
      },
    });
    await new Promise((r) => setTimeout(r, 500));
    router.push("/register");
  }

  return (
    <>
      <h1>Create your school account</h1>
      <p className="auth-subtitle">
        Start with the basics &#8212; you&#8217;ll complete the full registration in the next step.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="School name"
          autoComplete="organization"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          error={errors.schoolName}
          success={schoolName.trim().length > 1}
          required
        />
        <TextField
          label="Work email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          success={EMAIL_RE.test(email)}
          required
        />

        <button type="submit" className="auth-btn auth-btn-primary" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Spinner /> Getting started&hellip;
            </>
          ) : (
            "Continue to registration"
          )}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <button type="button" className="auth-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }} onClick={onDone}>
          Sign in
        </button>
      </p>

      <div className="auth-footer-links">
        <Link href="/privacy-notice-cookie-statement/">Privacy</Link>
        <Link href="/legal-statement/">Terms</Link>
        <Link href="/">OASIS.co.ug</Link>
      </div>
    </>
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
      <p className="auth-subtitle">Welcome back, {email}. Taking you to your dashboard&hellip;</p>
      <Link href="/" className="auth-btn auth-btn-secondary" style={{ textDecoration: "none", marginTop: 8 }}>
        Return to homepage
      </Link>
    </div>
  );
}
