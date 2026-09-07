# TLS runbook — driveexotiq.com

## How traffic actually flows

```
visitor ──TLS──> Cloudflare edge ──TLS──> Netlify (75.2.60.5) ──> driveexotiq-newgen
          cert A                   cert B
```

Two certificates, two legs. They fail independently and they are monitored
separately by `scripts/check-tls.mjs`.

- **Cert A (public)** — Cloudflare Universal SSL, issued by Google Trust
  Services. Auto-renews with no DNS dependency. This is what visitors validate.
- **Cert B (origin)** — Netlify's Let's Encrypt cert. Only Cloudflare ever sees
  it. While Cloudflare SSL mode is **Full**, it is not verified, so a mismatch
  here is invisible to visitors. Under **Full (strict)** it is verified, and a
  mismatch returns 526 to everyone.

Authoritative DNS is **Cloudflare** (`dakota.ns` / `jade.ns.cloudflare.com`).
Apex and `www` are **Proxied** (orange cloud). `media` is Cloudflare/R2, `mail`
is Resend.

## The 2026-09-07 outage

**Symptom:** Safari showed "This website may be impersonating driveexotiq.com."
Every visitor on every route. No click-through for anyone who had visited
before, because HSTS (`max-age=31536000`) makes a bad certificate a hard failure.

**Cause:** split-brain DNS. Netlify held its own DNS zone for the domain while
Cloudflare held the actual nameserver delegation. Because Netlify believed it
hosted DNS, it requested a **wildcard** (`*.driveexotiq.com`). Wildcards can
only be validated over DNS-01, which needs a TXT record at
`_acme-challenge.driveexotiq.com` — written into a Netlify zone that no resolver
ever consults. Every renewal from 2026-08-08 failed with NXDOMAIN, and on
2026-09-07 the certificate lapsed. Netlify's edge then fell back to its default
`*.netlify.app` certificate, which is valid but does not match the hostname.

**Why nobody knew:** the project's notification email was unset.

**Fix, in the order it was applied:**

1. Set apex + `www` to **Proxied** in Cloudflare. Cloudflare already held a
   valid certificate that was simply never being presented, so this restored
   trusted TLS in about a minute without touching Netlify at all.
2. Delete the Netlify **DNS zone** — the zone itself, under
   *Domains → the zone → Danger zone → Delete DNS zone*. Deleting the records
   inside it is **not** the same thing and changes nothing: the empty zone shell
   still makes Netlify claim "Netlify DNS" and keep requesting a wildcard.
3. Renew the certificate. With external DNS, Netlify drops the wildcard and
   validates over HTTP-01, which needs no DNS record.

## Gotchas that cost time

- **Records ≠ zone.** See step 2. This is the single most confusing part.
- **The SSL panel lies while stale.** It keeps displaying the *previous*
  certificate's domains and its last error until a new cert actually issues.
  Read the wire, not the dashboard: `node scripts/check-tls.mjs`.
- **Two rate limits, different systems.** `Acme::Client::Error::RateLimited`
  is Let's Encrypt (5 failed authorizations per hostname per hour, resets
  hourly). "There are too many certificate creation with this site recently"
  is Netlify's own per-site throttle. Neither has a button; both decay.
  Clicking Renew repeatedly extends the first one.
- **Expiry monitoring alone is insufficient.** The certs served during the
  outage had six months of validity left. Check hostname coverage too.

## Before switching Cloudflare to Full (strict)

Run `node scripts/check-tls.mjs` and confirm the **Netlify origin** line reads
`OK`. If it still presents `*.netlify.app`, switching to strict returns 526 for
every visitor. This is the one change in this runbook that can cause an outage
by itself.

## Open items

- `www` CNAME still targets `driveexotiq.netlify.app` — the *old* Netlify
  project, not `driveexotiq-newgen`. It resolves today only because Netlify
  routes on the Host header across a shared edge; it breaks silently if that
  old project is ever deleted or renamed.
- `rent.driveexotiq.com` does not resolve (its old record was a CNAME pointing
  at itself). Check ad creative and printed material before reviving it.
