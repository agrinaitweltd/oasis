"use client";

import { useState } from "react";
import Link from "next/link";

type Period = "monthly" | "termly" | "yearly";

const periods: { key: Period; label: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "termly", label: "Termly" },
  { key: "yearly", label: "Yearly" },
];

type Plan = {
  name: string;
  range: string;
  prices: Record<Period, number>;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    range: "50–250 students",
    prices: { monthly: 3000, termly: 2500, yearly: 2000 },
  },
  {
    name: "Growth",
    range: "250–1,000 students",
    prices: { monthly: 1850, termly: 1500, yearly: 1150 },
    highlight: true,
  },
  {
    name: "Scale",
    range: "1,000–2,500 students",
    prices: { monthly: 1000, termly: 700, yearly: 500 },
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
        style={{ marginBottom: 48, gap: 8, background: "var(--wp--preset--color--accent-5)", padding: 6, borderRadius: 999, display: "inline-flex", justifyContent: "center", width: "fit-content", marginLeft: "auto", marginRight: "auto" }}
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
              border: "none",
              cursor: "pointer",
              borderRadius: 999,
              padding: "10px 28px",
              fontSize: 16,
              fontFamily: "inherit",
              fontWeight: 500,
              backgroundColor: period === p.key ? "#009D00" : "transparent",
              color: period === p.key ? "#fff" : "#16140C",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex" style={{ gap: 24, alignItems: "stretch" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="wp-block-column has-base-2-background-color has-background has-global-padding is-layout-constrained wp-block-column-is-layout-constrained"
            style={{
              borderRadius: 12,
              padding: 32,
              boxShadow: "var(--wp--preset--shadow--deep)",
              border: plan.highlight ? "2px solid #009D00" : "2px solid transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {plan.highlight && (
              <p
                className="has-small-font-size wp-block-paragraph"
                style={{ color: "#009D00", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}
              >
                Most popular
              </p>
            )}
            <h3 className="wp-block-heading" style={{ marginBottom: 4 }}>{plan.name}</h3>
            <p className="wp-block-paragraph has-small-font-size" style={{ color: "var(--wp--preset--color--contrast-2)", marginBottom: 24 }}>
              {plan.range}
            </p>
            <p
              className="has-grenette-pro-font-family wp-block-paragraph"
              style={{ fontSize: "clamp(28px, 2rem + 1vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 0 }}
            >
              {formatUgx(plan.prices[period])}
            </p>
            <p className="wp-block-paragraph has-small-font-size" style={{ marginBottom: 24 }}>
              per student, billed {period}
            </p>
            <div className="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex" style={{ marginTop: "auto" }}>
              <div className="wp-block-button" style={{ width: "100%" }}>
                <Link className="wp-block-button__link wp-element-button" href="/contact/" style={{ display: "block", textAlign: "center" }}>
                  Book a demo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p className="wp-block-paragraph">Custom pricing available for schools with more than 2,500 students.</p>
        <p className="wp-block-paragraph">
          <Link href="/contact/">Contact us for enterprise deployments.</Link>
        </p>
      </div>
    </div>
  );
}
