// Read-only deployed-site check: follow the image URLs actually emitted in HTML.
// A local Next server cannot catch missing Netlify image-routing rules.
import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "https://driveexotiq.com");
const decode = (value) => value.replaceAll("&amp;", "&");
const images = new Map();
const failures = [];

async function get(url, accept = "text/html") {
  return fetch(url, {
    headers: { accept },
    signal: AbortSignal.timeout(30000),
  });
}

const sitemap = await get(new URL("/sitemap.xml", base));
assert.equal(sitemap.status, 200, "Sitemap must load");
const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(decode(match[1])).pathname);
assert.ok(paths.length > 0, "Use a production-mode deployment with a populated sitemap");

for (const path of paths) {
  const response = await get(new URL(path, base));
  assert.equal(response.status, 200, `Page ${path}`);
  const html = await response.text();
  for (const [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    if (/type="video\//i.test(tag)) continue;
    for (const [, attribute, value] of tag.matchAll(/\b(src|srcset)="([^"]+)"/gi)) {
      if (value.startsWith("data:")) continue;
      const sources = attribute.toLowerCase() === "srcset"
        ? decode(value).split(",").map((entry) => entry.trim().split(/\s+/)[0])
        : [decode(value)];
      for (const source of sources) {
        if (!source || source.startsWith("data:")) continue;
        const url = new URL(source, base);
        const pages = images.get(url.href) || new Set();
        pages.add(path);
        images.set(url.href, pages);
      }
    }
  }
}
assert.ok(images.size > 0, "Public pages must contain image URLs");

const pending = [...images.entries()];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (pending.length) {
    const [url, pages] = pending.shift();
    try {
      const response = await get(url, "image/avif,image/webp,image/*,*/*;q=0.8");
      assert.equal(response.status, 200, `HTTP ${response.status}`);
      assert.match(response.headers.get("content-type") || "", /^image\//);
      assert.ok((await response.arrayBuffer()).byteLength > 0, "Empty image");
    } catch (error) {
      failures.push({ url, pages: [...pages], error: error.message });
    }
  }
}));

for (const failure of failures) console.error(JSON.stringify(failure));
console.log(`${images.size - failures.length}/${images.size} image URLs passed across ${paths.length} pages at ${base.origin}`);
if (failures.length) process.exitCode = 1;
