import Script from "next/script";
import { cloudflareAnalyticsBootstrap } from "@/lib/cloudflare-analytics";
import { isPreview } from "@/lib/preview";

/** Aggregate cookieless document-load metrics, separate from consented PostHog. */
export default function CloudflareAnalytics() {
  const bootstrap = cloudflareAnalyticsBootstrap({
    production: process.env.NODE_ENV === "production",
    preview: isPreview,
    token: process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN,
  });
  if (!bootstrap) return null;
  return (
    <Script id="cloudflare-web-analytics" strategy="lazyOnload">
      {bootstrap}
    </Script>
  );
}
