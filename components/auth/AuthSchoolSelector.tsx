"use client";

import { useEffect, useRef, useState } from "react";
import { searchSchools } from "@/lib/mock/schools";
import type { School } from "@/types/portal";

// School selector styled to match the auth design system (auth-input /
// auth-field-float look) rather than the Tailwind portal components, so the
// portal login page is visually identical to the rest of the auth flow.
export function AuthSchoolSelector({
  value,
  onChange,
  error,
}: {
  value: School | null;
  onChange: (school: School) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const results = searchSchools(query);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="auth-field" ref={rootRef} style={{ position: "relative" }}>
      <label>Select your school</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`auth-input${error ? " has-error" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textAlign: "left",
          cursor: "pointer",
          color: value ? "#16140c" : "#a19d95",
          fontFamily: "inherit",
        }}
      >
        <SchoolIcon />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value ? value.name : "Search schools..."}
        </span>
        <ChevronIcon open={open} />
      </button>
      {error && (
        <p className="auth-error-text" role="alert">
          <ErrorGlyph /> {error}
        </p>
      )}

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 40,
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: 14,
            border: "1px solid rgba(22,20,12,0.08)",
            boxShadow: "0 20px 50px -12px rgba(84,74,178,0.28)",
            overflow: "hidden",
            animation: "authFadeUp 180ms ease both",
          }}
        >
          <div style={{ padding: 8, borderBottom: "1px solid rgba(22,20,12,0.06)" }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schools..."
              style={{
                width: "100%",
                height: 40,
                borderRadius: 10,
                border: "none",
                background: "#f6f5f3",
                padding: "0 12px",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto", padding: 6 }}>
            {results.length === 0 && (
              <p style={{ padding: "16px 12px", textAlign: "center", fontSize: 13.5, color: "#a19d95" }}>
                No schools match &ldquo;{query}&rdquo;
              </p>
            )}
            {results.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => {
                  onChange(school);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: value?.id === school.id ? "rgba(136,140,248,0.1)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(136,140,248,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = value?.id === school.id ? "rgba(136,140,248,0.1)" : "transparent")}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(136,140,248,0.14)",
                    color: "#5457c4",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {school.logoInitials}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "#16140c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {school.name}
                  </span>
                  <span style={{ display: "block", fontSize: 11.5, color: "#a19d95" }}>{school.district} District</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SchoolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "#a19d95" }}>
      <path d="M3 21h18M6 21V9l6-4 6 4v12M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, color: "#a19d95", transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ErrorGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
