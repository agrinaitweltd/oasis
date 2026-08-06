const APP_SCHEME = "oasisapp";

/**
 * Attempts to hand off to the OASIS mobile app via its custom URL scheme.
 * If no app is registered for the scheme, browsers no-op (or show their own
 * "open in app?" prompt) rather than navigating away, so the caller's page
 * is a safe fallback with no extra handling required.
 */
export function openInApp(path = "welcome") {
  if (typeof window === "undefined") return;
  window.location.href = `${APP_SCHEME}://${path}`;
}
