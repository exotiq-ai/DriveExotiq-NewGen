"use client";

/**
 * Re-opens the cookie consent panel. Dispatches the same event CookieConsent
 * listens for. Lives in the footer legal row so it's reachable from any page.
 */
export default function CookieSettingsButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className={className}
    >
      Cookie Settings
    </button>
  );
}
