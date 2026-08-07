"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const SLIDES = [
  {
    title: "Welcome to OASIS",
    body: "This is your dashboard - everything for your school lives here, and updates the moment anyone (on the app or the website) makes a change.",
  },
  {
    title: "Find your way around",
    body: "Use the sidebar on the left to jump between modules - Students, Attendance, Fees, and everything else you have access to.",
  },
  {
    title: "You're all set",
    body: "That's it - explore at your own pace. You can always reach support from the footer if you get stuck.",
  },
];

export function FirstRunTutorial() {
  const { user, profile, refreshProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (profile && !profile.has_seen_tutorial) setOpen(true);
  }, [profile]);

  async function finish() {
    setOpen(false);
    if (!user) return;
    await createClient().from("profiles").update({ has_seen_tutorial: true }).eq("id", user.id);
    refreshProfile();
  }

  if (!open || typeof document === "undefined") return null;

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="animate-pop relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={finish}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Skip tutorial"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-oasis-500" : "bg-slate-100"}`} />
          ))}
        </div>

        <h2 className="text-lg font-bold text-slate-900">{slide.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{slide.body}</p>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={finish} className="text-sm font-medium text-slate-400 transition hover:text-slate-600">
            Skip
          </button>
          <button
            type="button"
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
            className="rounded-xl bg-oasis-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-oasis-600"
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
