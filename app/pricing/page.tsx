import type { Metadata } from "next";
import PricingToggle from "@/components/PricingToggle";

export const metadata: Metadata = {
  title: "Pricing - OASIS School Management System Uganda",
  description: "Simple, transparent per-student pricing for OASIS, Uganda's complete school management system. Choose monthly, termly or yearly billing. Custom pricing available for schools with more than 2,500 students.",
};

export default function Page() {
  return (
    <div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
      <div
        className="wp-block-group alignwide has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{ marginTop: 0, marginBottom: 0, paddingTop: 88, paddingBottom: 24 }}
      >
        <h1 className="wp-block-heading has-text-align-center">
          Simple, transparent <em>per-student</em> pricing
        </h1>
        <p
          className="has-text-align-center wp-block-paragraph"
          style={{ maxWidth: 700, marginLeft: "auto", marginRight: "auto", marginTop: 16 }}
        >
          One platform, priced fairly for schools of every size across Uganda. Pick the billing period that
          works best for your school &#8212; prices update automatically.
        </p>
      </div>

      <PricingToggle />

      <div
        className="wp-block-group alignwide has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{ marginTop: 24, marginBottom: 88 }}
      >
        <div
          className="wp-block-group alignwide is-layout-flow wp-block-group-is-layout-flow"
          style={{
            textAlign: "center",
            backgroundColor: "var(--wp--preset--color--accent-5)",
            borderRadius: 16,
            padding: "48px 24px",
          }}
        >
          <h2 className="wp-block-heading">Every plan includes</h2>
          <p className="wp-block-paragraph" style={{ maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            Student information management, admissions, attendance, staff management, a parent portal, a
            student portal, a teacher portal, timetable management, examinations, report cards, continuous
            assessment, homework management, SMS &amp; email communication, discipline tracking, library
            management, inventory, transport management, hostel management, medical records, documents,
            school analytics, dashboards and secure cloud backups.
          </p>
          <div className="wp-block-buttons is-content-justification-center is-layout-flex wp-block-buttons-is-layout-flex">
            <div className="wp-block-button">
              <a className="wp-block-button__link wp-element-button" href="/contact/">
                Book a demo
              </a>
            </div>
            <div className="wp-block-button is-style-outline is-style-outline--1">
              <a className="wp-block-button__link wp-element-button" href="/faq/">
                Read the FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
