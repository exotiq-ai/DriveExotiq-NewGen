/**
 * Weekly analytics digest — Netlify scheduled function.
 * Every Monday 15:00 UTC (9am Denver), queries the Plausible Stats API (v2)
 * for each site in PLAUSIBLE_SITES and emails a dark, on-brand digest to
 * ADMIN_EMAIL via Resend: visitors/pageviews with week-over-week deltas, top
 * sources, top pages, and goal totals (CTA / Film Depth / Signup).
 *
 * Self-contained on purpose: scheduled functions bundle separately from the
 * Next app, so the email styling is mirrored here rather than imported from
 * lib/email-templates (same palette, same ladder).
 *
 * Env (Netlify): PLAUSIBLE_API_KEY (secret), PLAUSIBLE_SITES (csv, default
 * driveexotiq.com), RESEND_API_KEY, ADMIN_EMAIL, FROM_EMAIL optional.
 */

const INK = '#F3F1EC';
const INK2 = '#ABA8A1';
const INK3 = '#6F6D67';
const GULF = '#6CBDE6';
const CANVAS = '#0B0B0C';
const SURFACE = '#161618';
const LINE = '#28282C';

interface QueryResult {
  results?: { metrics: number[]; dimensions: string[] }[];
}

async function plausible(body: Record<string, unknown>): Promise<QueryResult> {
  const r = await fetch('https://plausible.io/api/v2/query', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    console.error('Plausible query failed', r.status, await r.text().catch(() => ''));
    return {};
  }
  return (await r.json()) as QueryResult;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const pct = (now: number, prev: number) => {
  if (!prev) return now ? 'new' : '±0%';
  const delta = ((now - prev) / prev) * 100;
  return `${delta >= 0 ? '+' : ''}${Math.round(delta)}%`;
};

const rowsTable = (rows: [string, string][]) =>
  rows.length
    ? `<table role="presentation" width="100%" style="width:100%;border-collapse:collapse;margin:0 0 4px 0;">${rows
        .map(
          ([l, v]) => `
      <tr>
        <td style="padding:7px 0;color:${INK2};font-size:13.5px;border-bottom:1px solid ${LINE};">${l}</td>
        <td style="padding:7px 0;color:${INK};font-size:13.5px;text-align:right;border-bottom:1px solid ${LINE};">${v}</td>
      </tr>`
        )
        .join('')}</table>`
    : `<p style="margin:0;color:${INK3};font-size:13px;">Nothing yet.</p>`;

const section = (title: string, inner: string) => `
  <table role="presentation" width="100%" bgcolor="${CANVAS}" style="width:100%;border-collapse:collapse;background-color:${CANVAS};border-left:2px solid ${GULF};border-radius:2px;margin:0 0 18px 0;">
    <tr><td style="padding:16px 18px;">
      <p style="margin:0 0 8px 0;color:${INK};font-size:13.5px;font-weight:600;">${title}</p>
      ${inner}
    </td></tr>
  </table>`;

async function siteDigest(site: string): Promise<string> {
  const today = new Date();
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 1); // through yesterday
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - 6);

  const range: [string, string] = [iso(start), iso(end)];
  const prevRange: [string, string] = [iso(prevStart), iso(prevEnd)];

  const [agg, prevAgg, sources, pages, goals, signupForms] = await Promise.all([
    plausible({ site_id: site, metrics: ['visitors', 'pageviews'], date_range: range }),
    plausible({ site_id: site, metrics: ['visitors', 'pageviews'], date_range: prevRange }),
    plausible({ site_id: site, metrics: ['visitors'], date_range: range, dimensions: ['visit:source'], order_by: [['visitors', 'desc']], pagination: { limit: 5 } }),
    plausible({ site_id: site, metrics: ['visitors'], date_range: range, dimensions: ['event:page'], order_by: [['visitors', 'desc']], pagination: { limit: 5 } }),
    plausible({ site_id: site, metrics: ['events', 'visitors'], date_range: range, dimensions: ['event:name'], order_by: [['events', 'desc']], pagination: { limit: 10 } }),
    plausible({ site_id: site, metrics: ['events'], date_range: range, dimensions: ['event:props:form'], filters: [['is', 'event:name', ['Signup']]] }),
  ]);

  const [v, pv] = agg.results?.[0]?.metrics ?? [0, 0];
  const [pvV, pvPv] = prevAgg.results?.[0]?.metrics ?? [0, 0];

  const custom = (goals.results ?? []).filter((r) => r.dimensions[0] !== 'pageview');
  const signups = (signupForms.results ?? []).map(
    (r) => [`Signup · ${r.dimensions[0]}`, String(r.metrics[0])] as [string, string]
  );

  return `
    <p style="margin:0 0 4px 0;color:${INK3};font-size:12.5px;letter-spacing:0.06em;">${site}</p>
    <h2 style="margin:0 0 16px 0;color:${INK};font-size:22px;font-weight:700;letter-spacing:-0.01em;">
      ${v.toLocaleString()} visitors
      <span style="color:${INK3};font-size:14px;font-weight:400;">&nbsp;${pct(v, pvV)} wow</span>
    </h2>
    ${section('The week', rowsTable([
      ['Visitors', `${v.toLocaleString()} (${pct(v, pvV)})`],
      ['Pageviews', `${pv.toLocaleString()} (${pct(pv, pvPv)})`],
    ]))}
    ${section('Top sources', rowsTable((sources.results ?? []).map((r) => [r.dimensions[0], String(r.metrics[0])])))}
    ${section('Top pages', rowsTable((pages.results ?? []).map((r) => [r.dimensions[0], String(r.metrics[0])])))}
    ${section('Goals', rowsTable([
      ...custom.map((r) => [r.dimensions[0], `${r.metrics[0]} events · ${r.metrics[1]} visitors`] as [string, string]),
      ...signups,
    ]))}
  `;
}

export default async () => {
  const sites = (process.env.PLAUSIBLE_SITES || 'driveexotiq.com').split(',').map((s) => s.trim()).filter(Boolean);
  const to = process.env.ADMIN_EMAIL || 'hello@exotiq.ai';
  const from = process.env.FROM_EMAIL || 'Drive Exotiq <hello@mail.driveexotiq.com>';

  if (!process.env.PLAUSIBLE_API_KEY || !process.env.RESEND_API_KEY) {
    console.warn('analytics-digest: missing PLAUSIBLE_API_KEY or RESEND_API_KEY, skipping');
    return new Response('skipped', { status: 200 });
  }

  const bodies = await Promise.all(sites.map(siteDigest));

  const html = `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Weekly digest</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:${CANVAS};color:${INK2};">
  <table role="presentation" width="100%" bgcolor="${CANVAS}" style="width:100%;border-collapse:collapse;background-color:${CANVAS};">
    <tr><td align="center" style="padding:36px 16px;">
      <table role="presentation" width="600" bgcolor="${SURFACE}" style="max-width:600px;width:100%;border-collapse:collapse;background-color:${SURFACE};border:1px solid ${LINE};border-radius:4px;">
        <tr><td style="padding:26px 32px 6px 32px;">
          <table role="presentation" style="border-collapse:collapse;"><tr>
            <td style="width:28px;"><div style="width:28px;height:2px;background-color:${GULF};font-size:0;">&nbsp;</div></td>
            <td style="padding-left:10px;color:${INK};font-size:15px;font-weight:700;">Drive Exotiq &middot; weekly numbers</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:18px 32px 30px 32px;">${bodies.join('<div style="height:26px;"></div>')}</td></tr>
        <tr><td bgcolor="${CANVAS}" style="padding:20px 32px;background-color:${CANVAS};border-top:1px solid ${LINE};">
          <p style="margin:0;color:${INK3};font-size:12px;">Mondays, 9am Denver. Data: Plausible, last 7 full days vs the 7 before.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: process.env.REPLY_TO_EMAIL || 'hello@exotiq.ai',
      subject: `Weekly numbers: ${sites.join(', ')}`,
      html,
    }),
  });
  if (!r.ok) {
    console.error('digest send failed', r.status, await r.text().catch(() => ''));
    return new Response('send failed', { status: 500 });
  }
  console.log('digest sent to', to, 'for', sites.join(','));
  return new Response('sent', { status: 200 });
};

export const config = {
  // Mondays 15:00 UTC = 9am Denver (MDT). Netlify scheduled function.
  schedule: '0 15 * * 1',
};
