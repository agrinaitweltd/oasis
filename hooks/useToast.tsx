"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; title: string; description?: string };

type ToastContextValue = {
  toast: (kind: ToastKind, title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, kind, title, description }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-fade-up pointer-events-auto flex items-start gap-3 rounded-2xl border border-black/5 bg-white/95 p-4 shadow-[0_20px_50px_-12px_rgba(16,14,40,0.25)] backdrop-blur"
          >
            <span className="mt-0.5 flex-shrink-0">
              {t.kind === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.kind === "error" && <XCircle className="h-5 w-5 text-rose-500" />}
              {t.kind === "info" && <Info className="h-5 w-5 text-oasis-500" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
