"use client";

import { useEffect } from "react";

/**
 * Adds a gentle fade+slide-up reveal to common content blocks as they scroll
 * into view, across every marketing page - without needing to touch each
 * page's markup individually. Also animates stat numbers (10+, 95%, 24/7...)
 * counting up from zero the first time they're revealed.
 *
 * Progressive enhancement: elements are only ever hidden/zeroed once this
 * effect has actually run and found something to observe, so nothing breaks
 * if JS is slow or disabled.
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

    // Stat numbers (10+, 95%, 2 days, 24/7...): count up from zero the first
    // time they're revealed, instead of just appearing.
    const statSelector = ".has-accent-color.has-grenette-pro-font-family, .has-accent-2-color.has-grenette-pro-font-family";
    const statEls = Array.from(main.querySelectorAll<HTMLElement>(statSelector)).filter(
      (el) => !el.closest(".wizard-shell, .auth-shell")
    );
    const statOriginals = new Map<HTMLElement, string>();
    for (const el of statEls) {
      // Guard against React StrictMode's dev-only double effect invocation:
      // without this, the second run would read back the already-zeroed
      // text ("0+") as the "original" value and animate from 0 to 0.
      const existingOriginal = el.dataset.countOriginal;
      if (existingOriginal) {
        statOriginals.set(el, existingOriginal);
        continue;
      }
      const text = el.textContent || "";
      const match = text.match(/\d+/);
      if (!match) continue; // nothing numeric to count (skip safely)
      statOriginals.set(el, text);
      el.dataset.countOriginal = text;
      el.textContent = text.replace(/\d+/, "0");
    }

    function animateCount(el: HTMLElement) {
      const original = statOriginals.get(el);
      if (!original) return;
      const match = original.match(/\d+/);
      if (!match) return;
      const originalText: string = original;
      const target = parseInt(match[0], 10);
      const duration = 1100;
      const start = performance.now();
      // Safety net: if requestAnimationFrame never ticks (throttled/backgrounded
      // tabs, some restricted embeds), make sure the correct final value still
      // lands instead of staying at 0 forever.
      window.setTimeout(() => {
        el.textContent = originalText;
      }, duration + 200);
      function tick(now: number) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(target * eased);
        el.textContent = originalText.replace(/\d+/, String(current));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (targets.length === 0 && statEls.length === 0) return;

    targets.forEach((el, i) => {
      el.classList.add("scroll-reveal");
      el.style.setProperty("--reveal-delay", `${(i % 4) * 70}ms`);
    });
    document.body.classList.add("js-reveal-active");

    const remaining = new Set(targets);
    const remainingStats = new Set(statOriginals.keys());

    function reveal(el: HTMLElement) {
      if (remaining.has(el)) {
        el.classList.add("is-in-view");
        remaining.delete(el);
      }
    }

    function revealStat(el: HTMLElement) {
      if (remainingStats.has(el)) {
        animateCount(el);
        remainingStats.delete(el);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            reveal(el);
            revealStat(el);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    statEls.forEach((el) => observer.observe(el));

    // Fallback: manual geometry check, in case IntersectionObserver never
    // fires in this environment (or as a fast first-paint check).
    function manualCheck() {
      if (remaining.size === 0 && remainingStats.size === 0) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (const el of Array.from(remaining)) {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 40 && rect.bottom > 0) reveal(el);
      }
      for (const el of Array.from(remainingStats)) {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 40 && rect.bottom > 0) revealStat(el);
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
