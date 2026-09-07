#!/usr/bin/env node
/**
 * TLS watch for the Drive Exotiq hosts.
 *
 * Written after the 2026-09-07 outage, in which the apex certificate expired
 * after four weeks of silent renewal failures and was found by a colleague's
 * screenshot rather than by us.
 *
 * It checks two things, because the outage was really about the second one:
 *
 *   1. EXPIRY   — days remaining, so a lapse is caught weeks out.
 *   2. IDENTITY — whether the served certificate actually covers the hostname.
 *                 On 2026-09-07 the certs on the wire were not expired at all;
 *                 Netlify's edge had fallen back to its own *.netlify.app cert,
 *                 which simply did not match. A pure expiry check would have
 *                 read "valid to Mar 2027" and said nothing was wrong.
 *
 * The apex is served by Cloudflare, which proxies to Netlify. That means two
 * certificates on two legs. The public leg is what visitors see; the origin leg
 * only matters to Cloudflare, and only strictly if SSL mode is Full (strict).
 * The origin is therefore checked but advisory — see ADVISORY below.
 *
 * No dependencies. Node >= 18.
 *   node scripts/check-tls.mjs            # human output
 *   node scripts/check-tls.mjs --json     # machine output
 *
 * Exit 0 = all good (warnings allowed). Exit 1 = something needs attention.
 */

import tls from 'node:tls';

const FAIL_DAYS = 14;
const WARN_DAYS = 21;
const TIMEOUT_MS = 10_000;

const TARGETS = [
  { label: 'apex          (public)', host: 'driveexotiq.com' },
  { label: 'www           (public)', host: 'www.driveexotiq.com' },
  { label: 'media         (CF/R2)', host: 'media.driveexotiq.com' },
  { label: 'mail          (Resend)', host: 'mail.driveexotiq.com' },
  {
    // The Cloudflare -> Netlify leg. Connect straight to Netlify's load
    // balancer with the apex as SNI, bypassing Cloudflare entirely.
    label: 'apex  (Netlify origin)',
    host: 'driveexotiq.com',
    connect: '75.2.60.5',
    advisory: true,
    note: 'advisory while Cloudflare SSL mode is Full (not strict). Must be ' +
          'valid and matching BEFORE switching to Full (strict), or every ' +
          'visitor gets a 526.',
  },
];

/** RFC 6125 name matching, wildcards limited to a single leftmost label. */
function nameMatches(pattern, host) {
  const p = pattern.toLowerCase().trim();
  const h = host.toLowerCase().trim();
  if (p === h) return true;
  if (!p.startsWith('*.')) return false;
  const suffix = p.slice(1); // ".example.com"
  if (!h.endsWith(suffix)) return false;
  // A wildcard covers exactly one label: a.example.com but not a.b.example.com.
  return !h.slice(0, h.length - suffix.length).includes('.');
}

function certNames(cert) {
  const names = new Set();
  const san = cert.subjectaltname || '';
  for (const entry of san.split(',')) {
    const t = entry.trim();
    if (t.startsWith('DNS:')) names.add(t.slice(4));
  }
  if (names.size === 0 && cert.subject?.CN) names.add(cert.subject.CN);
  return [...names];
}

function inspect(target) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: target.connect || target.host,
        port: 443,
        servername: target.host,
        // We are auditing whatever is presented, so we must not abort on a bad
        // chain — a rejected handshake would hide the very thing we look for.
        rejectUnauthorized: false,
        timeout: TIMEOUT_MS,
      },
      () => {
        const cert = socket.getPeerCertificate(false);
        socket.end();
        if (!cert || !cert.valid_to) {
          return resolve({ ...target, status: 'FAIL', reason: 'no certificate presented' });
        }
        const names = certNames(cert);
        const daysLeft = Math.floor((new Date(cert.valid_to) - Date.now()) / 86_400_000);
        const matches = names.some((n) => nameMatches(n, target.host));
        const issuer = cert.issuer?.O || cert.issuer?.CN || 'unknown';

        let status = 'OK';
        let reason = '';
        if (!matches) {
          status = 'FAIL';
          reason = `certificate does not cover ${target.host} (presents: ${names.join(', ')})`;
        } else if (daysLeft < 0) {
          status = 'FAIL';
          reason = `expired ${-daysLeft}d ago`;
        } else if (daysLeft < FAIL_DAYS) {
          status = 'FAIL';
          reason = `expires in ${daysLeft}d`;
        } else if (daysLeft < WARN_DAYS) {
          status = 'WARN';
          reason = `expires in ${daysLeft}d`;
        }
        resolve({ ...target, status, reason, daysLeft, issuer, names, notAfter: cert.valid_to });
      },
    );
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ ...target, status: 'FAIL', reason: `timed out after ${TIMEOUT_MS}ms` });
    });
    socket.on('error', (err) => {
      resolve({ ...target, status: 'FAIL', reason: err.message });
    });
  });
}

const results = await Promise.all(TARGETS.map(inspect));

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
} else {
  const icon = { OK: 'OK  ', WARN: 'WARN', FAIL: 'FAIL' };
  console.log(`TLS watch — ${new Date().toISOString()}\n`);
  for (const r of results) {
    const days = r.daysLeft === undefined ? '   —' : String(r.daysLeft).padStart(4);
    const tail = r.reason ? `  ← ${r.reason}` : '';
    console.log(`  [${icon[r.status]}] ${r.label}  ${days}d  ${r.issuer || ''}${tail}`);
    if (r.status !== 'OK' && r.note) console.log(`           note: ${r.note}`);
  }
}

// Advisory targets report but never fail the run: they are informational until
// the architecture says otherwise (see the origin-leg note above).
const blocking = results.filter((r) => r.status === 'FAIL' && !r.advisory);
if (blocking.length > 0) {
  console.error(`\n${blocking.length} host(s) need attention: ${blocking.map((r) => r.host).join(', ')}`);
  process.exit(1);
}
