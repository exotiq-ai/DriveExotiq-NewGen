import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/cookies" },
  title: "Cookie Policy",
  description:
    "How Drive Exotiq uses cookies, browser storage and consented analytics, and how to manage your choices.",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Cookies and Browser Storage on driveexotiq.com"
      lastUpdated="September 10, 2026"
    >
      <p>
        This Cookie Policy explains how Drive Exotiq uses cookies and browser storage on
        driveexotiq.com.
      </p>

      <h2>Article I: Cookies We Use</h2>

      <h3>Cookie Choices</h3>
      <p>
        Your choices are saved in your browser&rsquo;s local storage under
        driveexotiq_cookie_consent. This stores your functional, analytics and marketing
        preferences and the time you saved them. It has no automatic expiry;
        clearing your browser&rsquo;s site data removes it.
      </p>
      <p>
        The current site does not offer renter login, vehicle-search preferences,
        recently viewed vehicle storage, or payment checkout. No optional
        functional storage is currently used.
      </p>

      <h3>Analytics (require consent)</h3>
      <p>
        When enabled and you consent, PostHog records page views, interaction
        events, heatmaps and masked session replay. Form inputs and page text
        are masked. Its identifier stays in memory for the current visit; this
        integration does not set a persistent PostHog cookie. Cookie Settings
        lets you stop future PostHog capture.
      </p>
      <table>
        <thead>
          <tr>
            <th>Storage or identifier</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PostHog in-memory identifier</td>
            <td>Connects consented interactions within a visit</td>
            <td>Current page session; cleared on withdrawal</td>
          </tr>
        </tbody>
      </table>

      <h3>Cookieless Aggregate Reporting</h3>
      <p>
        When configured, Cloudflare Web Analytics reports aggregate page-load
        performance and Core Web Vitals on the public production domain. This
        service does not set analytics cookies and runs separately from the
        PostHog consent choice. Cloudflare reporting does not provide session
        replay; automatic tracking of client-side page changes is disabled.
      </p>

      <h3>Marketing (requires separate consent)</h3>
      <p>
        If you enable marketing cookies, Meta Pixel records page views and
        successful applications, waitlist entries and partnership inquiries to
        measure advertising performance and potentially support personalized
        ads on Meta services. Meta may receive page URLs, browser and device
        information, IP address and advertising identifiers, and may set cookies
        such as _fbp and _fbc. We do not send your form-field values as Pixel
        event parameters.
      </p>
      <p>
        Existing analytics choices do not enable marketing. Change this choice
        in Cookie Settings; withdrawing marketing consent stops future Pixel
        events from this integration. It does not delete data already received
        by Meta. You can remove existing cookies through your browser settings.
      </p>

      <h2>Article II: Your Choices</h2>
      <p>
        Cookie consent banner on first visit: accept all, reject non-essential,
        or customize. Change anytime via &ldquo;Cookie Settings&rdquo; in
        footer.
      </p>

      <h2>Article III: State Disclosures</h2>
      <p>
        You can decline analytics and marketing independently in Cookie Settings.
        For privacy rights and contact details, see our Privacy Policy.
        EEA/UK: non-essential cookies placed only with consent.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:privacy@driveexotiq.com">privacy@driveexotiq.com</a>
      </p>
      <p>
        <strong>Address:</strong> Exotiq Inc., 1001 S Main St #6709, Kalispell,
        MT 59901
      </p>
    </LegalLayout>
  );
}
