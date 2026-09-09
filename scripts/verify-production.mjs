// Read-only metadata checks plus invalid/unauthenticated API checks; never creates a lead.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.E2E_BASE_URL || 'http://127.0.0.1:4318';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Run production verification against the local production build, not live lead endpoints.');
const evidence = [];
async function check(path, options, validate) {
  const response = await fetch(base + path, options);
  const body = await response.text();
  validate(response, body);
  evidence.push({path, method: options?.method || 'GET', status: response.status, passed: true});
  return body;
}
const sitemap = await check('/sitemap.xml', {}, (r, body) => { assert.equal(r.status, 200); assert.match(body, /https:\/\/driveexotiq.com\/apply/); });
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]));
for (const url of urls) {
  assert.equal(url.origin, 'https://driveexotiq.com');
  await check(url.pathname, {}, (r, body) => {
    assert.equal(r.status, 200, url.pathname);
    assert.ok(!r.headers.get('x-robots-tag')?.includes('noindex'), url.pathname);
    assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(body), url.pathname);
    const canonical = body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
    assert.ok(canonical, `canonical ${url.pathname}`);
    assert.equal(new URL(canonical[1]).href, url.href, `canonical ${url.pathname}`);
    assert.match(body, /<title>[^<]+<\/title>/);
    assert.match(body, /name="description" content="[^"]+"/);
    assert.ok(!body.includes('astra-review--driveexotiq-astra.netlify.app'), url.pathname);
    for (const m of body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
  });
}
await check('/robots.txt', {}, (r, body) => { assert.equal(r.status, 200); assert.match(body, /Allow: \//); assert.ok(!/^Disallow: \/$/m.test(body)); assert.match(body, /Disallow: \/admin/); });
await check('/llms.txt', {}, (r, body) => { assert.equal(r.status, 200); assert.match(body,/Live forms save/); assert.ok(!body.includes('unindexed design preview')); });
for (const path of ['/thank-you', '/admin', '/admin/instagram']) {
  await check(path, {}, (r, body) => { assert.equal(r.status,200); assert.match(body,/name="robots" content="[^"]*noindex/); });
}
for (const path of ['/api/admin/applications', '/api/admin/instagram']) {
 for (const method of ['GET','POST','PATCH','DELETE']) {
  // Only methods implemented by each handler are tested.
  if (path.endsWith('applications') && !['GET','PATCH'].includes(method)) continue;
  await check(path, {method, headers:{authorization:'Bearer invalid-qa-token','content-type':'application/json'}, ...(method==='GET'?{}:{body:'{}'})}, (r)=>assert.equal(r.status,401));
 }
}
for (const path of ['/api/applications','/api/waitlist','/api/sponsor-inquiries','/api/booking-leads']) {
 await check(path,{method:'POST',headers:{'content-type':'application/json'},body:'{}'},r=>assert.equal(r.status,400));
}
for (const [path,target] of [['/experience','/'],['/community','/drives'],['/booking','/marketplace'],['/cities','/tour']]) {
 await check(path,{redirect:'manual'},r=>{ assert.ok([307,308].includes(r.status)); assert.equal(new URL(r.headers.get('location'),base).pathname,target); });
}
mkdirSync('output/playwright/launch', { recursive: true });
writeFileSync('output/playwright/launch/production-http.json',JSON.stringify(evidence,null,2));
console.log(`${evidence.length} production checks passed across ${urls.length} indexed pages.`);
