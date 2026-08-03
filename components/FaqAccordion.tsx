"use client";

import { useState } from "react";

const faqs: { q: string; a: string }[] = [
  {
    q: "How long does setup take?",
    a: "Most schools are fully set up and running on OASIS in under two weeks, including importing student records, configuring classes and streams, and training staff.",
  },
  {
    q: "Can parents access OASIS?",
    a: "Yes. Every OASIS plan includes a parent portal where parents can check attendance, fees balances, report cards, homework and school announcements from their phone, tablet or computer.",
  },
  {
    q: "Does OASIS work on mobile?",
    a: "Yes. OASIS is fully cloud-based and works in any modern web browser on phones, tablets and computers, so administrators, teachers and parents can use it wherever they are.",
  },
  {
    q: "Can existing student records be imported?",
    a: "Yes. Our team will help you import your existing student, staff and fees records from spreadsheets or your previous system as part of onboarding, at no extra cost.",
  },
  {
    q: "Is training included?",
    a: "Yes. Every OASIS plan includes onboarding training for your administrators and teaching staff, so your team feels confident using the platform from day one.",
  },
  {
    q: "How secure is the data?",
    a: "OASIS is cloud-based with secure, encrypted backups, so your school's data is protected and never lost. Access is controlled by role, so parents, teachers, staff and administrators only see what's relevant to them.",
  },
  {
    q: "What if my school has multiple campuses?",
    a: "OASIS supports multi-campus schools and school groups out of the box, giving directors a single dashboard to see attendance, fees and performance across every campus.",
  },
  {
    q: "Can I switch billing periods later?",
    a: "Yes. You can move between monthly, termly and yearly billing at any time — just contact our team and we'll adjust your plan.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
      {faqs.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className="wp-block-group has-base-2-background-color has-background is-layout-flow wp-block-group-is-layout-flow"
            style={{ borderRadius: 12, marginBottom: 16, boxShadow: "var(--wp--preset--shadow--deep)", overflow: "hidden" }}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="wp-element-button"
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                fontFamily: "inherit",
              }}
            >
              <span className="wp-block-heading" style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>
                {item.q}
              </span>
              <span aria-hidden="true" style={{ fontSize: 20, flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}>
                +
              </span>
            </button>
            {open && (
              <div style={{ padding: "0 24px 20px" }}>
                <p className="wp-block-paragraph" style={{ margin: 0, color: "var(--wp--preset--color--contrast-2)" }}>
                  {item.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
