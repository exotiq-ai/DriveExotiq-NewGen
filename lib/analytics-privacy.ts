/** Analytics accepts categories, never arbitrary form content or URL queries. */
export const analyticsEvents = new Set([
  "CTA", "Signup", "Form Start", "Validation Error", "Submission Failure",
  "Garage Selection", "Page Depth", "Film Depth",
  "Video Play", "Video Progress", "Video Complete", "Video Replay", "Video Failure",
]);

const values: Record<string, Set<string>> = {
  video: new Set(["hero", "road", "pair", "film"]),
  action: new Set(["watch-film", "community", "instagram", "youtube"]),
  form: new Set(["apply", "waitlist", "sponsor", "booking"]),
  status: new Set(["preview", "stored", "server", "network"]),
  category: new Set(["validation", "required", "format", "consent", "server", "network"]),
  interest: new Set(["access", "drives", "title-wrap", "tour", "drive", "partnership", "other"]),
  tier: new Set(["title-wrap", "tour", "drive", "partnership", "not-sure"]),
  car: new Set(["mclaren", "ferrari", "porsche", "audi", "720s", "458", "gt3-rs", "s8", "r8"]),
};

export function analyticsPath(raw: string) {
  const path = raw.split(/[?#]/, 1)[0];
  if (path === "/") return path;
  const root = path.split("/")[1];
  if (!["apply", "sponsor", "marketplace", "tour", "drives", "journal", "blog", "thank-you", "privacy", "terms", "cookies", "contact", "about"].includes(root)) return "/other";
  return `/${root}${path.split("/").filter(Boolean).length > 1 ? "/detail" : ""}`;
}

export function analyticsAdminPath(path: string) {
  return /^\/(admin|api)(\/|$)/i.test(path);
}

export function safeAnalyticsProps(props: Record<string, unknown> = {}) {
  const safe: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === "depth" && typeof value === "number" && [25, 50, 75, 100].includes(value)) safe[key] = value;
    else if (key === "href" && typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) safe.href = analyticsPath(value);
    else if (typeof value === "string" && values[key]?.has(value)) safe[key] = value;
  }
  return safe;
}
