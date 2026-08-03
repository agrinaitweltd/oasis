import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ - OASIS School Management System Uganda",
  description: "Frequently asked questions about OASIS, Uganda's complete cloud-based school management system. Setup time, parent access, mobile support, data security, training and more.",
};

export default function Page() {
  return (
    <div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
      <div
        className="wp-block-group alignwide has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{ marginTop: 0, marginBottom: 0, paddingTop: 88, paddingBottom: 48 }}
      >
        <h1 className="wp-block-heading has-text-align-center">
          Frequently asked <em>questions</em>
        </h1>
        <p
          className="has-text-align-center wp-block-paragraph"
          style={{ maxWidth: 700, marginLeft: "auto", marginRight: "auto", marginTop: 16 }}
        >
          Everything you need to know about bringing OASIS to your school. Can&#8217;t find what you&#8217;re
          looking for? <a href="/contact/">Get in touch</a> and our team will help.
        </p>
      </div>

      <div style={{ marginBottom: 88 }}>
        <FaqAccordion />
      </div>

      <div
        className="wp-block-group alignwide has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{ textAlign: "center", marginBottom: 88 }}
      >
        <div className="wp-block-buttons is-content-justification-center is-layout-flex wp-block-buttons-is-layout-flex">
          <div className="wp-block-button">
            <a className="wp-block-button__link wp-element-button" href="/contact/">
              Book a demo
            </a>
          </div>
          <div className="wp-block-button is-style-outline is-style-outline--1">
            <a className="wp-block-button__link wp-element-button" href="/pricing/">
              View pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
