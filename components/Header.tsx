"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { megaMenu } from "@/lib/nav-data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openNow(label: string) {
    cancelClose();
    setOpenMenu(label);
  }

  function closeWithDelay() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 350);
  }

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
                  width={140}
                  height={48}
                  src="/wp-content/uploads/2024/10/oasis-logo.svg"
                  className="custom-logo"
                  alt="OASIS"
                  priority
                />
              </Link>
            </div>

            <div id="mega-menu-wrap-max_mega_menu_1" className="mega-menu-wrap">
              <div className={`mega-menu-toggle${mobileOpen ? " mega-menu-open" : ""}`}>
                <div className="mega-toggle-blocks-left"></div>
                <div className="mega-toggle-blocks-center"></div>
                <div className="mega-toggle-blocks-right">
                  <div className="mega-toggle-block mega-menu-toggle-animated-block mega-toggle-block-0" id="mega-toggle-block-0">
                    <button
                      aria-controls="mega-menu-max_mega_menu_1"
                      aria-expanded={mobileOpen}
                      aria-haspopup="true"
                      aria-label="Toggle Menu"
                      className="mega-toggle-animated mega-toggle-animated-slider"
                      type="button"
                      onClick={() => setMobileOpen((v) => !v)}
                    >
                      <span className="mega-toggle-animated-box">
                        <span className="mega-toggle-animated-inner"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <ul
                id="mega-menu-max_mega_menu_1"
                ref={navRef}
                className="mega-menu max-mega-menu mega-menu-horizontal"
                data-event="hover_intent"
                data-effect="disabled"
                data-second-click="close"
                data-document-click="collapse"
                data-vertical-behaviour="accordion"
                data-breakpoint="930"
              >
                {megaMenu.map((section) => (
                  <li
                    key={section.label}
                    className={`mega-menu-item mega-menu-item-type-custom mega-menu-item-has-children mega-menu-megamenu${
                      openMenu === section.label ? " mega-toggle-on" : ""
                    }`}
                    style={{ position: "relative" }}
                    onMouseEnter={() => openNow(section.label)}
                    onMouseLeave={closeWithDelay}
                  >
                    <a
                      className="mega-menu-link"
                      href="#"
                      aria-expanded={openMenu === section.label}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenu((v) => (v === section.label ? null : section.label));
                      }}
                    >
                      {section.label}
                      <span className="mega-indicator" aria-hidden="true"></span>
                    </a>
                    <ul
                      className="mega-sub-menu"
                      role="presentation"
                      onMouseEnter={() => cancelClose()}
                      onMouseLeave={closeWithDelay}
                      style={
                        openMenu === section.label
                          ? {
                              display: "block",
                              opacity: 1,
                              visibility: "visible",
                              left: 0,
                              width: 320,
                              maxWidth: "calc(100vw - 48px)",
                              zIndex: 9999,
                              pointerEvents: "auto",
                            }
                          : {
                              display: "none",
                              opacity: 0,
                              visibility: "hidden",
                              left: 0,
                              width: 320,
                              maxWidth: "calc(100vw - 48px)",
                              zIndex: 9999,
                              pointerEvents: "none",
                            }
                      }
                    >
                      <li className="mega-menu-row">
                        <ul className="mega-sub-menu" style={{ "--columns": 12 } as CSSProperties}>
                          <li
                            className="mega-menu-column mega-menu-columns-12-of-12"
                            style={{ "--columns": 12, "--span": 12 } as CSSProperties}
                          >
                            <ul className="mega-sub-menu">
                              <li className="mega-menu-item mega-menu-item-type-widget widget_maxmegamenu_reusable_block">
                                <div
                                  className="wp-block-columns is-not-stacked-on-mobile is-style-default has-base-background-color has-background is-layout-flex wp-block-columns-is-layout-flex"
                                  style={{
                                    paddingTop: 48,
                                    paddingRight: 24,
                                    paddingBottom: 48,
                                    paddingLeft: 24,
                                    boxShadow: "var(--wp--preset--shadow--deep)",
                                  }}
                                >
                                  <div className="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
                                    <div className="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
                                      <nav
                                        className="has-text-color has-contrast-color is-vertical wp-block-navigation is-layout-flex wp-block-navigation-is-layout-flex"
                                        aria-label={`Navigation (${section.label})`}
                                      >
                                        <ul className="wp-block-navigation__container has-text-color has-contrast-color is-vertical wp-block-navigation">
                                          {section.links.map((link) => (
                                            <li className="wp-block-navigation-item wp-block-navigation-link" key={link.href}>
                                              {link.external ? (
                                                <a
                                                  className="wp-block-navigation-item__content"
                                                  href={link.href}
                                                  target="_blank"
                                                  rel="noreferrer noopener"
                                                >
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
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
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
                  <Link className="wp-block-button__link wp-element-button" href="/contact/">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
