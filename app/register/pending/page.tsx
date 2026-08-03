"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loadApplication } from "@/lib/onboarding-storage";
import type { SchoolApplication } from "@/lib/onboarding-types";

export default function PendingReviewPage() {
  const [app, setApp] = useState<SchoolApplication | null>(null);

  useEffect(() => {
    setApp(loadApplication());
  }, []);

  const statusLabel: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "pending" },
    pending_review: { label: "Pending Review", className: "pending" },
    approved: { label: "Approved", className: "approved" },
    rejected: { label: "Not Approved", className: "rejected" },
    more_info_requested: { label: "More Info Requested", className: "pending" },
    suspended: { label: "Suspended", className: "rejected" },
  };
  const current = app ? statusLabel[app.status] ?? statusLabel.pending_review : statusLabel.pending_review;

  return (
    <div className="auth-shell" id="main-content" style={{ gridTemplateColumns: "1fr" }}>
      <div className="auth-form-col">
        <div className="auth-card" style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ marginBottom: 28 }}>
            <Image
              src="/images/oasis-logo-footer.svg"
              alt="OASIS"
              width={140}
              height={48}
              unoptimized
              style={{ width: 140, height: 48, objectFit: "contain", margin: "0 auto" }}
            />
          </div>

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#fff4e0",
              color: "#b06a00",
              display: "grid",
              placeContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <ClockIcon />
          </div>

          <h1>Thank you for registering your school with OASIS</h1>
          <p className="auth-subtitle">
            Your application has been received and is currently under review by our onboarding team. One of our
            representatives will contact you using the details you provided.
          </p>
          <p className="auth-subtitle">
            After your school has been approved, you will receive an approval email containing a secure link to
            continue the registration process.
          </p>

          <div style={{ margin: "28px 0" }}>
            <span className={`status-badge ${current.className}`}>{current.label}</span>
          </div>

          {app?.data.organisation.schoolName && (
            <div className="wizard-review-section" style={{ textAlign: "left", marginBottom: 24 }}>
              <dl className="wizard-review-grid">
                <div className="wizard-review-item">
                  <dt>School</dt>
                  <dd>{app.data.organisation.schoolName}</dd>
                </div>
                <div className="wizard-review-item">
                  <dt>Reference</dt>
                  <dd>{app.id}</dd>
                </div>
                <div className="wizard-review-item">
                  <dt>Submitted</dt>
                  <dd>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "—"}</dd>
                </div>
                <div className="wizard-review-item">
                  <dt>Contact Email</dt>
                  <dd>{app.data.organisation.schoolEmail}</dd>
                </div>
              </dl>
            </div>
          )}

          <p className="auth-hint-text" style={{ marginBottom: 24 }}>
            The account remains locked until your school has been approved by an OASIS administrator.
          </p>

          <Link href="/" className="auth-btn auth-btn-secondary" style={{ textDecoration: "none" }}>
            Return to homepage
          </Link>

          <p className="auth-footer-text">
            Questions about your application? <a href="mailto:support@oasis.co.ug" className="auth-link">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
