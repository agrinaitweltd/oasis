"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { megaMenu } from "@/lib/nav-data";

const LOGO_DEFAULT = "/images/logo.png";
const LOGO_SCROLLED = "/images/logo1.png";
const LOGO_FALLBACK = "/images/oasis-logo.svg";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState<{ default: boolean; scrolled: boolean }>({ default: false, scrolled: false });
  const navRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const wantsScrolledLogo = scrolled;
  let logoSrc = wantsScrolledLogo ? LOGO_SCROLLED : LOGO_DEFAULT;
  if (wantsScrolledLogo && logoError.scrolled) logoSrc = logoError.default ? LOGO_FALLBACK : LOGO_DEFAULT;
  if (!wantsScrolledLogo && logoError.default) logoSrc = LOGO_FALLBACK;

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
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function closeDrawer() {
    setMobileOpen(false);
    setMobileExpanded(null);
  }

  return (
    <header className="wp-block-template-part">
      <div
        className="wp-block-group alignwide has-base-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          boxShadow: scrolled ? "0 4px 20px rgba(22,20,12,0.08)" : "0 0 0 rgba(22,20,12,0)",
          transition: "box-shadow 300ms ease",
        }}
      >
        <div className="wp-block-group alignwide is-content-justification-space-between is-layout-flex wp-block-group-is-layout-flex">
          <div className="wp-block-group menu-container is-layout-flex wp-block-group-is-layout-flex">
            <div className="wp-block-site-logo" style={{ width: 140, height: 48, flexShrink: 0, overflow: "hidden" }}>
              <Link
                href="/"
                className="custom-logo-link"
                rel="home"
                aria-current="page"
                style={{ display: "block", width: 140, height: 48 }}
              >
                <Image
                  key={logoSrc}
                  width={140}
                  height={48}
                  src={logoSrc}
                  className="custom-logo"
                  alt="OASIS"
                  priority
                  unoptimized
                  style={{
                    width: 140,
                    height: 48,
                    maxWidth: 140,
                    maxHeight: 48,
                    objectFit: "contain",
                    objectPosition: "left center",
                    transition: "opacity 200ms ease",
                  }}
                  onError={() => {
                    if (wantsScrolledLogo) setLogoError((v) => ({ ...v, scrolled: true }));
                    else setLogoError((v) => ({ ...v, default: true }));
                  }}
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
                  <Link className="wp-block-button__link wp-element-button" href="/portal/login">
                    Sign In
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      <div
        className="mobile-drawer-backdrop"
        onClick={closeDrawer}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 10000,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Mobile slide-out drawer */}
      <nav
        className="mobile-drawer"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 256,
          height: "100vh",
          background: "var(--wp--preset--color--base, #fffcf8)",
          zIndex: 10001,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease",
          boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.2)" : "none",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          <Link href="/" onClick={closeDrawer} style={{ display: "block", width: 120, height: 41 }}>
            <Image
              width={120}
              height={41}
              src={logoSrc}
              alt="OASIS"
              unoptimized
              style={{ width: 120, height: 41, maxHeight: 41, objectFit: "contain", objectPosition: "left center" }}
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 28,
              lineHeight: 1,
              padding: 8,
              color: "#16140C",
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ flexGrow: 1, padding: "8px 12px" }}>
          {megaMenu.map((section, sectionIndex) => {
            const isExpanded = mobileExpanded === section.label;
            return (
              <div
                key={section.label}
                style={{
                  borderBottom: "1px solid rgba(22,20,12,0.08)",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity 320ms ease ${mobileOpen ? sectionIndex * 60 : 0}ms, transform 320ms ease ${mobileOpen ? sectionIndex * 60 : 0}ms`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setMobileExpanded((v) => (v === section.label ? null : section.label))}
                  aria-expanded={isExpanded}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 8px",
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    color: "#16140C",
                    textAlign: "left",
                  }}
                >
                  {section.label}
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      transition: "transform 220ms ease",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    &#9660;
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isExpanded ? 600 : 0,
                    overflow: "hidden",
                    transition: "max-height 300ms ease",
                  }}
                >
                  <ul style={{ listStyle: "none", margin: 0, padding: "0 8px 12px" }}>
                    {section.links.map((link) =>
                      link.external ? (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={closeDrawer}
                            style={{ display: "block", padding: "8px 8px", color: "#16140C", fontSize: 15 }}
                          >
                            {link.label}
                          </a>
                        </li>
                      ) : (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={closeDrawer}
                            style={{ display: "block", padding: "8px 8px", color: "#16140C", fontSize: 15 }}
                          >
                            {link.label}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            className="wp-block-button__link wp-element-button"
            href="/contact/"
            onClick={closeDrawer}
            style={{ display: "block", textAlign: "center" }}
          >
            Book a demo
          </Link>
          <Link
            className="wp-block-button__link wp-element-button is-style-outline is-style-outline--1"
            href="/portal/login"
            onClick={closeDrawer}
            style={{ display: "block", textAlign: "center" }}
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}
