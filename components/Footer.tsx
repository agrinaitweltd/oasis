import Link from "next/link";
import Image from "next/image";
import { footerColumns, NavLink } from "@/lib/nav-data";

function FooterNav({ links, ariaLabel }: { links: NavLink[]; ariaLabel: string }) {
  if (!links.length) return null;
  return (
    <nav
      style={{ fontStyle: "normal", fontWeight: 400 }}
      className="has-small-font-size is-vertical wp-block-navigation is-layout-flex wp-block-navigation-is-layout-flex"
      aria-label={ariaLabel}
    >
      <ul style={{ fontStyle: "normal", fontWeight: 400 }} className="wp-block-navigation__container has-small-font-size is-vertical wp-block-navigation">
        {links.map((link) => (
          <li className="wp-block-navigation-item wp-block-navigation-link footer-nav-item" key={link.href}>
            {link.external ? (
              <a className="wp-block-navigation-item__content" href={link.href} target="_blank" rel="noreferrer noopener">
                <span className="wp-block-navigation-item__label">{link.label}</span>
              </a>
            ) : (
              <Link className="wp-block-navigation-item__content" href={link.href}>
                <span className="wp-block-navigation-item__label">{link.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="wp-block-template-part">
      <div
        className="wp-block-group has-base-2-color has-contrast-background-color has-text-color has-background has-link-color has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{ marginTop: 88, marginBottom: 0, paddingTop: 44, paddingBottom: 44 }}
      >
        <div className="wp-block-columns alignwide is-layout-flex wp-block-columns-is-layout-flex footer-top-columns">
          <div className="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style={{ flexBasis: "20%" }}>
            <div className="wp-block-group is-vertical is-layout-flex wp-block-group-is-layout-flex">
              <figure className="wp-block-image size-large is-resized">
                <Link href="/">
                  <Image
                    width={140}
                    height={48}
                    src="/images/oasis-logo-footer.svg"
                    alt="OASIS"
                    style={{ width: 135 }}
                  />
                </Link>
              </figure>
            </div>
          </div>

          <div className="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style={{ flexBasis: "80%" }}>
            <div
              className="wp-block-group is-layout-flow wp-block-group-is-layout-flow footer-columns-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
                columnGap: 24,
                rowGap: 32,
                alignItems: "start",
              }}
            >
              {footerColumns.map((col) => (
                <div
                  className="wp-block-group is-vertical is-content-justification-stretch is-layout-flex wp-block-group-is-layout-flex"
                  key={col.title}
                >
                  <h2
                    className="wp-block-heading has-medium-font-size has-base-2-color has-text-color has-link-color has-body-font-family"
                    style={{ fontStyle: "normal", fontWeight: 500, letterSpacing: 0 }}
                  >
                    {col.title}
                  </h2>
                  <div className="wp-block-group is-vertical is-layout-flex wp-block-group-is-layout-flex">
                    <FooterNav links={col.primary} ariaLabel={`Navigation (${col.title}) 2`} />
                    <FooterNav links={col.secondary} ariaLabel={`Navigation Footer (${col.title})`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wp-block-group alignwide is-layout-flow wp-block-group-is-layout-flow" style={{ paddingTop: "var(--wp--preset--spacing--30)", paddingBottom: 0 }}>
          <div className="wp-block-group is-content-justification-space-between is-layout-flex wp-block-group-is-layout-flex footer-flex-row" style={{ marginTop: 0, marginBottom: 0, paddingTop: 0 }}>
            <p className="inline-block has-link-color has-grenette-pro-font-family wp-block-paragraph" style={{ fontSize: "clamp(27.894px, 1.743rem + ((1vw - 3.2px) * 2.674), 48px)", letterSpacing: "-0.96px", lineHeight: 1.17 }}>
              Get in touch: <a href="mailto:hello@oasis.ug">hello@oasis.ug</a>
            </p>

            <div className="wp-block-group is-nowrap is-layout-flex wp-block-group-is-layout-flex">
              <figure className="wp-block-image size-large is-resized">
                <a href="https://www.linkedin.com/company/oasis-uganda" target="_blank" rel="noreferrer noopener">
                  <Image width={32} height={33} src="/images/LinkedIn.svg" alt="" style={{ width: 32 }} />
                </a>
              </figure>
              <figure className="wp-block-image size-large is-resized">
                <a href="https://twitter.com/oasis_uganda" target="_blank" rel="noreferrer noopener">
                  <Image width={32} height={33} src="/images/X.svg" alt="" style={{ width: 32 }} />
                </a>
              </figure>
            </div>
          </div>
        </div>

        <div className="wp-block-group alignwide is-layout-flow wp-block-group-is-layout-flow" style={{ paddingTop: "var(--wp--preset--spacing--30)", paddingBottom: 0 }}>
          <div className="wp-block-group is-content-justification-space-between is-nowrap is-layout-flex wp-block-group-is-layout-flex" style={{ paddingTop: "var(--wp--preset--spacing--10)" }}>
            <p className="has-link-color has-small-font-size wp-block-paragraph">
              OASIS by Swivel Technologies, Kampala, Uganda
            </p>
          </div>

          <div className="wp-block-group is-content-justification-space-between is-layout-flex wp-block-group-is-layout-flex" style={{ borderTopWidth: 1, paddingTop: "var(--wp--preset--spacing--10)" }}>
            <div className="wp-block-group is-layout-flex wp-block-group-is-layout-flex">
              <p className="has-link-color has-small-font-size wp-block-paragraph">
                <Link href="/privacy-notice-cookie-statement/">Privacy Notice &amp; Cookie Statement</Link>
              </p>
              <p className="has-link-color has-small-font-size wp-block-paragraph">
                <Link href="/legal-statement/">Legal Statement</Link>
              </p>
            </div>
            <p className="has-link-color has-small-font-size wp-block-paragraph">
              <Link href="/about-us/">OASIS is built by Swivel Technologies</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
