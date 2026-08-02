"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { megaMenu } from "@/lib/nav-data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="wp-block-template-part">
      <div
        className="wp-block-group alignwide has-base-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{ paddingTop: 20, paddingBottom: 20 }}
      >
        <div className="wp-block-group alignwide is-content-justification-space-between is-layout-flex wp-block-group-is-layout-flex">
          <div className="wp-block-group menu-container is-layout-flex wp-block-group-is-layout-flex">
            <div className="wp-block-site-logo">
              <Link href="/" className="custom-logo-link" rel="home" aria-current="page">
                <Image
                  width={125}
                  height={48}
                  src="/wp-content/uploads/2024/10/arbor-education-logo.svg"
                  className="custom-logo"
                  alt="Arbor"
                  priority
                />
              </Link>
            </div>

            <div id="mega-menu-wrap-max_mega_menu_1" className="mega-menu-wrap">
              <div className="mega-menu-toggle">
                <button
                  aria-expanded={mobileOpen}
                  aria-label="Toggle Menu"
                  className={`mega-toggle-animated mega-toggle-animated-slider${mobileOpen ? " active" : ""}`}
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  <span className="mega-toggle-animated-box">
                    <span className="mega-toggle-animated-inner"></span>
                  </span>
                </button>
              </div>

              <ul
                id="mega-menu-max_mega_menu_1"
                className={`mega-menu max-mega-menu mega-menu-horizontal${mobileOpen ? " mega-menu-open" : ""}`}
              >
                {megaMenu.map((section) => (
                  <li
                    key={section.label}
                    className={`mega-menu-item mega-menu-item-type-custom mega-menu-item-has-children mega-menu-megamenu${
                      openMenu === section.label ? " mega-toggle-on" : ""
                    }`}
                    onMouseEnter={() => setOpenMenu(section.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <a
                      className="mega-menu-link"
                      href="#"
                      aria-expanded={openMenu === section.label}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenMenu((v) => (v === section.label ? null : section.label));
                      }}
                    >
                      {section.label}
                      <span className="mega-indicator" aria-hidden="true"></span>
                    </a>
                    <ul
                      className="mega-sub-menu"
                      role="presentation"
                      style={{ display: openMenu === section.label ? "block" : undefined }}
                    >
                      {section.links.map((link) => (
                        <li className="mega-menu-item" key={link.href}>
                          {link.external ? (
                            <a
                              className="mega-menu-link"
                              href={link.href}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link className="mega-menu-link" href={link.href}>
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="wp-block-group header-buttons is-content-justification-left is-layout-flex wp-block-group-is-layout-flex">
            <nav className="items-justified-right wp-block-navigation is-horizontal is-content-justification-right is-layout-flex wp-block-navigation-is-layout-flex" aria-label="Navigation Buttons">
              <div className="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
                <div className="wp-block-button">
                  <Link className="wp-block-button__link wp-element-button" href="/contact/">
                    Book a demo
                  </Link>
                </div>
                <div className="wp-block-button is-style-outline is-style-outline--1">
                  <a
                    className="wp-block-button__link wp-element-button"
                    href="https://login.arbor.sc/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
