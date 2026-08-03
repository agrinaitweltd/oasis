import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - OASIS School Management System Uganda",
  description: "Get in touch with OASIS. Book a demo, request a brochure, or email us at info@oasis.co.ug. OASIS by Swivel Technologies, Kampala, Uganda.",
};

export default function Page() {
  return (
    <div
      className={"wp-block-group is-layout-flow wp-block-group-is-layout-flow"}
      dangerouslySetInnerHTML={{ __html: `<div class="entry-content wp-block-post-content has-global-padding is-layout-constrained wp-block-post-content-is-layout-constrained">
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:88px">
<h1 class="wp-block-heading has-text-align-center">Get in touch or<br>book a demo</h1>



<p class="has-text-align-center wp-block-paragraph">Make an easy move to OASIS today</p>



<p class="has-text-align-center wp-block-paragraph">Would you like a call with our sales team?</p>



<div class="wp-block-buttons is-content-justification-center is-layout-flex wp-container-core-buttons-is-layout-2d6d62f2 wp-block-buttons-is-layout-flex">
<div class="wp-block-button is-style-outline is-style-outline--3"><a class="wp-block-button__link wp-element-button" href="/contact/">Book a call</a></div>
</div>
</div>



<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="margin-top:48px;margin-bottom:48px;text-align:center">
<p class="has-text-align-center wp-block-paragraph">Or get in touch by email and our team will respond within one business day:</p>
<p class="has-text-align-center wp-block-paragraph" style="font-size:clamp(20px, 1.5rem + 1vw, 32px)"><a href="mailto:info@oasis.co.ug">info@oasis.co.ug</a></p>
</div>



<div class="wp-block-group alignwide has-global-padding is-layout-constrained wp-container-core-group-is-layout-d2da3c89 wp-block-group-is-layout-constrained">
<div class="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-1544a2c5 wp-block-columns-is-layout-flex" style="margin-top:88px;margin-bottom:88px">
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h3 class="wp-block-heading">Location</h3>



<p class="wp-block-paragraph">OASIS by Swivel Technologies,<br>Kampala,<br>Uganda</p>
</div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h3 class="wp-block-heading">Phone</h3>



<p class="wp-block-paragraph" style="font-style:normal;font-weight:600">Sales:</p>



<p class="wp-block-paragraph" style="margin-top:6px"><a href="mailto:info@oasis.co.ug">info@oasis.co.ug</a></p>



<p class="wp-block-paragraph" style="margin-top:12px;font-style:normal;font-weight:600">Support:</p>



<p class="wp-block-paragraph" style="margin-top:6px"><a href="mailto:support@oasis.co.ug">Email our support team</a></p>
</div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h3 class="wp-block-heading">Email</h3>



<p class="wp-block-paragraph"><a href="mailto:info@oasis.co.ug">info@oasis.co.ug</a></p>
</div>



<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<h3 class="wp-block-heading">Social</h3>



<p class="wp-block-paragraph"><a href="https://twitter.com/oasis_uganda" target="_blank" rel="noreferrer noopener">Twitter</a><br><a href="https://www.linkedin.com/company/oasis-uganda" target="_blank" rel="noreferrer noopener">LinkedIn</a><br></p>
</div>
</div>
</div>
</div>` }}
    />
  );
}
