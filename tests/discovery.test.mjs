import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { register } from "node:module";
import { test } from "node:test";

register("./preview-loader.mjs", import.meta.url);
delete process.env.NEXT_PUBLIC_SITE_MODE;

test("every production crawler group excludes private application paths", async () => {
  const { default: robots } = await import("../app/robots.ts");
  const result = robots();
  assert.equal(result.sitemap, "https://driveexotiq.com/sitemap.xml");
  assert.ok(Array.isArray(result.rules));
  for (const rule of result.rules) {
    assert.deepEqual(rule.disallow, ["/admin", "/api/"]);
  }
  const agents = result.rules.flatMap(({ userAgent }) => userAgent);
  assert.ok(agents.includes("OAI-SearchBot"));
  assert.ok(!agents.includes("GPTBot"));
  assert.ok(!agents.includes("CCBot"));
});

test("llms text uses canonical absolute links and describes live forms truthfully", async () => {
  const { buildLlmsText } = await import("../lib/llms.ts");
  const text = buildLlmsText(false);
  assert.match(text, /https:\/\/driveexotiq\.com\/drives/);
  assert.match(text, /Live forms save/);
  assert.doesNotMatch(text, /\]\(\//);
  assert.doesNotMatch(text, /independent design preview/i);
});

test("llms text identifies preview forms as validation-only", async () => {
  const { buildLlmsText } = await import("../lib/llms.ts");
  const text = buildLlmsText(true);
  assert.match(text, /preview/i);
  assert.match(text, /do not save information or send messages/i);
  assert.equal(existsSync(new URL("../public/llms.txt", import.meta.url)), false);
});

test("unindexed preview with live forms describes persistence accurately", async () => {
  const { buildLlmsText } = await import("../lib/llms.ts");
  const text = buildLlmsText(true, false);
  assert.match(text, /unindexed design preview/);
  assert.match(text, /Live forms save/);
  assert.doesNotMatch(text, /do not save information/);
});
