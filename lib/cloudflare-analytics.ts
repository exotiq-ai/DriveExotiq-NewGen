type CloudflareAnalyticsSettings = {
  production: boolean;
  preview: boolean;
  token?: string;
};

/**
 * The lazy bootstrap checks the browser location when it actually executes,
 * rather than scheduling a third-party script before the route is known.
 * Cloudflare's documented spa:false option limits this to document loads:
 * https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/
 */
export function cloudflareAnalyticsBootstrap({
  production,
  preview,
  token,
}: CloudflareAnalyticsSettings): string | null {
  if (!production || preview || !token || !/^[a-f0-9]{32}$/i.test(token)) return null;

  const beacon = JSON.stringify({ token, spa: false });
  return `(() => {
    const location = window.location;
    if (location.protocol !== "https:" ||
        !["driveexotiq.com", "www.driveexotiq.com"].includes(location.hostname)) return;
    let path;
    try { path = decodeURIComponent(location.pathname).toLowerCase(); }
    catch { return; }
    if (/^\\/(admin|api)(\\/|$)/.test(path)) return;
    if (document.getElementById("cloudflare-web-analytics-beacon")) return;
    const script = document.createElement("script");
    script.id = "cloudflare-web-analytics-beacon";
    script.type = "module";
    script.async = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute("data-cf-beacon", ${JSON.stringify(beacon)});
    document.head.appendChild(script);
  })();`;
}
