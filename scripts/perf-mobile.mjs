// Cross-engine mobile smoothness measurement for the Drive Exotiq film.
// Profiles: iPhone (WebKit = real Safari engine), iPhone-size Chromium
// (Android proxy), iPad (WebKit tablet). Scrolls the full film at a brisk
// human pace via rAF steps, recording frame deltas; reports pacing stats,
// worst frames mapped to scroll position, and console errors.
import { chromium, webkit } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:3100';

const PROFILES = [
  { name: 'iPhone-WebKit', engine: webkit, viewport: { width: 390, height: 844 }, dpr: 3, touch: true },
  { name: 'iPhone-Chromium', engine: chromium, viewport: { width: 390, height: 844 }, dpr: 3, touch: true },
  { name: 'iPad-WebKit', engine: webkit, viewport: { width: 820, height: 1180 }, dpr: 2, touch: true },
];

const collector = () => {
  return new Promise((resolve) => {
    const H = document.documentElement.scrollHeight - innerHeight;
    const deltas = [];
    const marks = [];
    let last = performance.now();
    let y = 0;
    const SPEED = (innerHeight * 2.2) / 60; // ~2.2 viewports/sec at 60fps
    const tick = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      deltas.push(dt);
      if (dt > 33) marks.push({ y: Math.round(y / innerHeight * 100) / 100, dt: Math.round(dt) });
      y += SPEED;
      window.scrollTo(0, y);
      if (y < H) requestAnimationFrame(tick);
      else {
        deltas.shift(); // first delta is warmup
        const sorted = [...deltas].sort((a, b) => a - b);
        const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
        resolve({
          frames: deltas.length,
          mean: Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length * 10) / 10,
          p50: Math.round(q(0.5) * 10) / 10,
          p95: Math.round(q(0.95) * 10) / 10,
          p99: Math.round(q(0.99) * 10) / 10,
          over33: deltas.filter((d) => d > 33).length,
          over60: deltas.filter((d) => d > 60).length,
          worst: marks.sort((a, b) => b.dt - a.dt).slice(0, 8),
        });
      }
    };
    requestAnimationFrame(tick);
  });
};

for (const p of PROFILES) {
  const browser = await p.engine.launch();
  const ctx = await browser.newContext({
    viewport: p.viewport,
    deviceScaleFactor: p.dpr,
    hasTouch: p.touch,
    isMobile: p.engine === chromium ? true : undefined,
    userAgent: p.engine === webkit
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 140)));

  try {
    await page.goto(BASE + '/', { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(3500); // hydration + first videos
    const stats = await page.evaluate(collector);
    console.log(`\n=== ${p.name} (${p.viewport.width}x${p.viewport.height}) ===`);
    console.log(JSON.stringify(stats));
    console.log('console errors:', errors.length ? [...new Set(errors)].slice(0, 5) : 'none');
  } catch (e) {
    console.log(`\n=== ${p.name} FAILED: ${String(e).slice(0, 200)}`);
  }
  await browser.close();
}
