"use client";

import { useEffect } from "react";

/**
 * Adds a gentle fade+slide-up reveal to common content blocks as they scroll
 * into view, across every marketing page - without needing to touch each
 * page's markup individually. Progressive enhancement: elements are only
 * ever hidden once this effect has actually run and found something to
 * observe, so nothing breaks if JS is slow or disabled.
 *
 * Uses IntersectionObserver as the primary mechanism, with a manual
 * getBoundingClientRect-based scroll/resize check as a redundant fallback -
 * belt and suspenders against any environment where IO doesn't fire
 * reliably (some embedded/automated contexts, older browsers, etc.).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const main = document.querySelector("main");
    if (!main) return;

    const selector = [
      "h1",
      "h2",
      "h3",
      ".wp-block-columns",
      ".wp-block-column > figure",
      ".wp-block-buttons",
      ".wp-block-quote",
      ".status-badge",
    ].join(", ");

    const targets = Array.from(main.querySelectorAll<HTMLElement>(selector)).filter((el) => {
      return !el.closest(".wizard-shell, .auth-shell") && el.offsetHeight > 0;
    });

    if (targets.length === 0) return;

    targets.forEach((el, i) => {
      el.classList.add("scroll-reveal");
      el.style.setProperty("--reveal-delay", `${(i % 4) * 70}ms`);
    });
    document.body.classList.add("js-reveal-active");

    let remaining = new Set(targets);

    function reveal(el: HTMLElement) {
      el.classList.add("is-in-view");
      remaining.delete(el);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));

    // Fallback: manual geometry check, in case IntersectionObserver never
    // fires in this environment (or as a fast first-paint check).
    function manualCheck() {
      if (remaining.size === 0) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (const el of Array.from(remaining)) {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 40 && rect.bottom > 0) {
          reveal(el);
        }
      }
    }

    manualCheck();
    const onScroll = () => manualCheck();
    const onResize = () => manualCheck();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Also re-check shortly after mount, in case fonts/images shift layout.
    const t1 = window.setTimeout(manualCheck, 300);
    const t2 = window.setTimeout(manualCheck, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
