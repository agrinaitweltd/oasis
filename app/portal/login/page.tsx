"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, TriangleAlert } from "lucide-react";
import { SchoolSelector } from "@/components/portal/SchoolSelector";
import { useMockAuth } from "@/hooks/useMockAuth";
import type { School } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

export default function PortalLoginPage() {
  const router = useRouter();
  const { signIn } = useMockAuth();
  const { toast } = useToast();

  const [school, setSchool] = useState<School | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ school?: string; username?: string; password?: string }>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const next: typeof fieldErrors = {};
    if (!school) next.school = "Please select your school to continue.";
    if (!username.trim()) next.username = "Enter your username.";
    if (!password) next.password = "Enter your password.";
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 650));

    const result = signIn(username.trim(), password, school!.id);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast("success", "Welcome back", `Signed in to ${school!.name}`);
    router.push("/portal/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f6fb] px-4 py-10">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-oasis-200/50 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-oasis-300/40 blur-[100px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-oasis-500 text-white shadow-lg shadow-oasis-500/30">
            <Sparkles className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to OASIS</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to manage your school&rsquo;s day-to-day operations.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="animate-fade-up space-y-5 rounded-3xl border border-white bg-white/90 p-7 shadow-[0_30px_80px_-30px_rgba(84,74,178,0.35)] backdrop-blur"
        >
          <div>
            <SchoolSelector value={school} onChange={setSchool} />
            {fieldErrors.school && <p className="mt-1.5 text-xs font-medium text-rose-500">{fieldErrors.school}</p>}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm text-rose-600">
              <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="mb-1.5 block text-[13px] font-semibold text-slate-700">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
            />
            {fieldErrors.username && <p className="mt-1.5 text-xs font-medium text-rose-500">{fieldErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="mt-1.5 text-xs font-medium text-rose-500">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-oasis-500 focus:ring-oasis-300"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => toast("info", "Check with your school administrator", "Password resets are managed by your OASIS administrator for now.")}
              className="font-semibold text-oasis-600 transition hover:text-oasis-700"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-oasis-500 text-sm font-semibold text-white shadow-md shadow-oasis-500/25 transition hover:bg-oasis-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in&hellip;
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OASIS by Swivel Technologies &mdash; a preview environment with sample data.
        </p>
      </div>
    </div>
  );
}
