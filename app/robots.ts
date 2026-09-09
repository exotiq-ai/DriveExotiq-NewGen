import { isPreview } from "@/lib/preview";
import type { MetadataRoute } from "next";

const BASE = "https://driveexotiq.com";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };

  // Search and user-requested retrieval agents get the same public-only scope
  // as ordinary search crawlers. Model-training agents are not special-cased.
  const searchRetrievalBots = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
  ];
  const publicOnly = { allow: "/", disallow: ["/admin", "/api/"] };

  return {
    rules: [
      { userAgent: "*", ...publicOnly },
      ...searchRetrievalBots.map((userAgent) => ({
        userAgent,
        ...publicOnly,
      })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
