# Meta Pixel implementation — September 10, 2026

Pixel ID: `2007025476584382`. Implementation commit: `81c4c6a`.

- Separate Marketing choice in Cookie Settings. Legacy analytics preferences do not grant marketing permission.
- Script only loads on HTTPS production hostnames after marketing consent; preview, local, admin/API and Global Privacy Control exclude it.
- Explicit PageView on initial eligible view and pathname changes. Automatic event configuration disabled. No advanced-matching form data is supplied.
- Lead only after confirmed stored community application, rental waitlist or partnership inquiry. Event parameters contain only the inquiry category, not form values.
- Consent withdrawal revokes tracking; pending script completion rechecks permission before initializing or sending events.
- The supplied unconditional noscript beacon is intentionally omitted so JavaScript-disabled visits cannot bypass consent.
- Privacy/cookie pages updated. Meta still receives normal browser/network/page identifiers described there; disabling future capture does not remove previously collected provider data.

Verification: 78 unit tests pass. Production build passes. Desktop 1440px and mobile 390px browser checks verify no preconsent load, one postconsent initialization, expected Lead payload after a mocked waitlist response, consent withdrawal and no horizontal overflow or page errors. Meta provider script and form API were mocked; these tests created no real leads, email or Meta conversion events. Evidence in ignored `output/analytics-audit/meta-*` files.

Plausible remains unchanged pending the owner's decision to retire or reactivate it. At current scale, Cloudflare and PostHog cover the principal aggregate performance and behavior requirements. The prior replay/reporting findings remain open. No Conversions API, ad campaign or subscription purchase is included.
