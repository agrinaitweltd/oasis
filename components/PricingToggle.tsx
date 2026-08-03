"use client";

import { useState } from "react";
import Link from "next/link";

type Period = "monthly" | "termly" | "yearly";

const periods: { key: Period; label: string; badge?: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "termly", label: "Termly" },
  { key: "yearly", label: "Yearly", badge: "Best value" },
];

type Plan = {
  name: string;
  range: string;
  prices: Record<Period, number>;
  highlight?: boolean;
  features: string[];
};

const baseFeatures = [
  "Student Information System",
  "Admissions & Attendance",
  "Finance & School Fees",
  "Parent, Student & Teacher Portals",
  "Timetable & Examinations",
  "SMS & Email Communication",
];

const plans: Plan[] = [
  {
    name: "Starter",
    range: "50–250 students",
    prices: { monthly: 3000, termly: 2500, yearly: 2000 },
    features: baseFeatures,
  },
  {
    name: "Growth",
    range: "250–1,000 students",
    prices: { monthly: 1850, termly: 1500, yearly: 1150 },
    highlight: true,
    features: [...baseFeatures, "Multi-Campus Dashboard", "School Analytics"],
  },
  {
    name: "Scale",
    range: "1,000–2,500 students",
    prices: { monthly: 1000, termly: 700, yearly: 500 },
    features: [...baseFeatures, "Multi-Campus Dashboard", "School Analytics", "Priority Support"],
  },
];

function formatUgx(amount: number) {
  return "UGX " + amount.toLocaleString("en-UG");
}

export default function PricingToggle() {
  const [period, setPeriod] = useState<Period>("termly");

  return (
    <div className="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style={{ marginTop: 48, marginBottom: 48 }}>
      <div
        className="wp-block-buttons is-content-justification-center is-layout-flex wp-block-buttons-is-layout-flex"
        role="tablist"
        aria-label="Billing period"
        style={{
          marginBottom: 56,
          gap: 4,
          background: "var(--wp--preset--color--accent-5)",
          padding: 6,
          borderRadius: 999,
          display: "flex",
          justifyContent: "center",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {periods.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={period === p.key}
            onClick={() => setPeriod(p.key)}
            className="wp-element-button"
            style={{
              position: "relative",
              border: "none",
              cursor: "pointer",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 15,
              fontFamily: "inherit",
              fontWeight: 600,
              backgroundColor: period === p.key ? "#888CF8" : "transparent",
              color: period === p.key ? "#fff" : "#16140C",
              transition: "background-color 200ms ease, color 200ms ease, transform 150ms ease",
              transform: period === p.key ? "scale(1.04)" : "scale(1)",
            }}
          >
            {p.label}
            {p.badge && (
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  right: -8,
                  fontSize: 10,
                  fontWeight: 700,
                  background: "#F39222",
                  color: "#16140C",
                  padding: "2px 7px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                {p.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        className="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex"
        style={{ gap: 24, alignItems: "stretch" }}
      >
        {plans.map((plan, i) => {
          const yearlySavingsPct = Math.round((1 - plan.prices.yearly / plan.prices.monthly) * 100);
          return (
            <div
              key={plan.name}
              className="wp-block-column has-base-2-background-color has-background has-global-padding is-layout-constrained wp-block-column-is-layout-constrained fade-in-up"
              style={{
                position: "relative",
                borderRadius: 16,
                padding: 32,
                paddingTop: plan.highlight ? 40 : 32,
                boxShadow: plan.highlight ? "0 20px 40px rgba(136,140,248,0.24)" : "var(--wp--preset--shadow--deep)",
                border: plan.highlight ? "2px solid #888CF8" : "1px solid rgba(22,20,12,0.08)",
                display: "flex",
                flexDirection: "column",
                animationDelay: `${i * 80}ms`,
              }}
            >
              {plan.highlight && (
                <span
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#888CF8",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 16px",
                    borderRadius: 999,
                    letterSpacing: 0.3,
                    whiteSpace: "nowrap",
                    animation: "badgePulse 2.4s ease-in-out infinite",
                  }}
                >
                  Most popular
                </span>
              )}
              <h3 className="wp-block-heading" style={{ marginBottom: 4 }}>
                {plan.name}
              </h3>
              <p className="wp-block-paragraph has-small-font-size" style={{ color: "var(--wp--preset--color--contrast-2)", marginBottom: 20 }}>
                {plan.range}
              </p>

              <div style={{ minHeight: 76 }}>
                <p
                  key={period}
                  className="has-grenette-pro-font-family wp-block-paragraph fade-in-up"
                  style={{ fontSize: "clamp(28px, 2rem + 1vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 0, animationDuration: "250ms" }}
                >
                  {formatUgx(plan.prices[period])}
                </p>
                <p className="wp-block-paragraph has-small-font-size" style={{ marginBottom: 0, color: "var(--wp--preset--color--contrast-2)" }}>
                  per student, billed {period}
                </p>
                {period === "yearly" && (
                  <p className="wp-block-paragraph has-small-font-size" style={{ color: "#888CF8", fontWeight: 600, marginTop: 4, marginBottom: 0 }}>
                    Save {yearlySavingsPct}% vs. monthly
                  </p>
                )}
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", flexGrow: 1 }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: "#888CF8", fontWeight: 700, lineHeight: "20px" }}>&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex" style={{ marginTop: "auto" }}>
                <div className="wp-block-button" style={{ width: "100%" }}>
                  <Link
                    className={`wp-block-button__link wp-element-button${plan.highlight ? "" : " is-style-outline is-style-outline--1"}`}
                    href="/contact/"
                    style={{ display: "block", textAlign: "center", width: "100%" }}
                  >
                    Book a demo
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 56 }}>
        <p className="wp-block-paragraph">Custom pricing available for schools with more than 2,500 students.</p>
        <p className="wp-block-paragraph">
          <Link href="/contact/">Contact us for enterprise deployments.</Link>
        </p>
      </div>
    </div>
  );
}
