"use client";

import { useState, type DragEvent } from "react";
import Link from "next/link";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { documentRequirements, type DocumentKey } from "@/lib/onboarding-types";

type UploadedFile = { name: string; sizeKb: number };

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<Partial<Record<DocumentKey, UploadedFile>>>({});
  const [dragOver, setDragOver] = useState<DocumentKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const requiredKeys = documentRequirements.filter((d) => d.required).map((d) => d.key);
  const allRequiredUploaded = requiredKeys.every((k) => files[k]);

  function setFile(key: DocumentKey, file: File) {
    setFiles((prev) => ({ ...prev, [key]: { name: file.name, sizeKb: Math.round(file.size / 1024) } }));
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>, key: DocumentKey) {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(key, file);
  }

  async function handleSubmit() {
    setSubmitting(true);
    // No document-storage backend exists yet - this simulates the upload.
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="auth-shell" id="main-content" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-form-col">
          <div className="auth-card" style={{ maxWidth: 480, textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#eaf7ee",
                color: "#1e7b34",
                display: "grid",
                placeContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h1>Documents submitted</h1>
            <p className="auth-subtitle">
              Thank you. Our onboarding team will verify your documents and be in touch to complete your school&#8217;s
              setup on OASIS.
            </p>
            <Link href="/" className="auth-btn auth-btn-secondary" style={{ textDecoration: "none" }}>
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-shell" id="main-content">
      <div className="wizard-topbar-wrap">
        <div className="wizard-topbar">
          <AuthLogo width={110} height={38} />
          <span className="status-badge approved">Application Approved</span>
        </div>
      </div>

      <div className="wizard-body">
        <div className="wizard-card">
          <div className="wizard-step-panel">
            <div className="wizard-step-header">
              <p className="wizard-step-eyebrow">Final step</p>
              <h1>Upload your registration documents</h1>
              <p>
                Congratulations &#8212; your school has been approved. To finish setting up your OASIS account,
                please upload the documents below. Items marked required must be provided before you can submit.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {documentRequirements.map((doc) => {
                const uploaded = files[doc.key];
                return (
                  <div key={doc.key}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>
                        {doc.label} {doc.required && <span style={{ color: "#e5484d" }}>*</span>}
                      </p>
                      {!doc.required && <span style={{ fontSize: 12, color: "#a19d95" }}>Optional</span>}
                    </div>
                    <p style={{ fontSize: 13, color: "#635f56", margin: "0 0 8px" }}>{doc.description}</p>
                    <label
                      className={`wizard-upload-zone${uploaded ? " has-file" : ""}${dragOver === doc.key ? " is-dragover" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(doc.key);
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop(e, doc.key)}
                    >
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFile(doc.key, file);
                        }}
                      />
                      {uploaded ? (
                        <span style={{ color: "#1e7b34", fontSize: 14, fontWeight: 600 }}>
                          &#10003; {uploaded.name} ({uploaded.sizeKb} KB) &mdash; click to replace
                        </span>
                      ) : (
                        <span style={{ fontSize: 14, color: "#635f56" }}>
                          Drag and drop a file here, or <span style={{ color: "#888cf8", fontWeight: 600 }}>browse</span>
                        </span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="wizard-footer">
        <div className="wizard-footer-inner">
          <span className="auth-hint-text">
            {requiredKeys.filter((k) => files[k]).length} of {requiredKeys.length} required documents uploaded
          </span>
          <button type="button" className="wizard-btn wizard-btn-primary" onClick={handleSubmit} disabled={!allRequiredUploaded || submitting}>
            {submitting ? "Submitting…" : "Submit documents"}
          </button>
        </div>
      </div>
    </div>
  );
}
