import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description:
    "How Drive Exotiq collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Drive Exotiq Collects, Uses, and Protects Your Information"
      lastUpdated="September 10, 2026"
    >
      <p>
        Exotiq Inc., doing business as Drive Exotiq (&ldquo;Drive Exotiq,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), is committed
        to protecting your privacy. This explains how we handle your information
        on driveexotiq.com.
      </p>

      <h2>Article I: Information We Collect</h2>

      <h3>Information You Provide</h3>
      <p>
        Our application, waitlist and partnership inquiry forms collect the
        contact details, city, interests, introduction, company information and
        consent choices you provide. The current public site does not collect
        driver&rsquo;s licenses or payment details and does not offer renter
        accounts or booking checkout.
      </p>

      <h3>Automatic Collection</h3>
      <p>
        Technical information can include IP address, browser/device information
        and pages viewed. We also store your cookie choices in browser local
        storage. When configured, Cloudflare Web Analytics reports aggregate page-load performance and Core
        Web Vitals on the public production domain, without analytics cookies
        or session replay.
      </p>

      <p>
        With analytics consent, PostHog helps us understand page navigation,
        clicks, form completion, heatmaps and masked session replay. Form inputs
        and page text are masked; our analytics events exclude names, email
        addresses, phone numbers and free-text responses. PostHog uses an
        in-memory identifier for this visit. Approved campaign labels help us
        connect referral visits with completed forms; these labels stay in tab
        storage for up to 30 minutes after analytics consent. Change your choice through Cookie
        Settings in the footer.
      </p>

      <p>
        When enabled and you allow analytics, Google Analytics measures page
        visits, form starts and server-confirmed form completions. Google browser
        and session identifiers connect these events; approved campaign categories
        describe referral sources. We do not include form-field contents in these
        Google events. First-party Google analytics cookies are configured for 90
        days. Google advertising signals and personalization are disabled. See our
        Cookie Policy for storage and withdrawal details.
      </p>

      <h3>SMS Consent Data</h3>
      <p>
        Our forms record your phone number and consent choices, and record a
        timestamp and IP address when SMS consent is provided.
      </p>

      <p>
        With separate marketing consent, Meta Pixel receives page views and
        confirmed inquiry events for advertising measurement and potentially
        personalized ads. Meta may collect page URLs, IP address, browser and
        device information and advertising identifiers. We do not include form
        answers, email addresses or phone numbers in Pixel event parameters.
        Marketing is off unless you enable it in Cookie Settings; you can
        withdraw that choice there at any time. We also keep the Pixel off when
        your browser sends Global Privacy Control.
      </p>

      <h2>Article II: How We Use Your Information</h2>
      <p>
        To review applications, manage waitlist interest, respond to partnership
        and support inquiries, and send related confirmations and follow-up.
        SMS consent is optional and recorded separately for transactional and
        marketing messages. We never use your phone number beyond what you
        consented to.
      </p>

      <h2>Article III: How We Share Your Information</h2>

      <h3>Service Providers</h3>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Data Shared</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Meta</td>
            <td>Consented advertising measurement</td>
            <td>Page views, confirmed inquiry categories and browser/advertising identifiers</td>
          </tr>
          <tr>
            <td>Cloudflare Web Analytics</td>
            <td>Cookieless page-load and performance reporting</td>
            <td>Page and browser information, performance timing metrics</td>
          </tr>
          <tr>
            <td>PostHog</td>
            <td>Consented visitor analytics, heatmaps and masked replay</td>
            <td>Interaction events, device information and masked page activity</td>
          </tr>
          <tr>
            <td>Supabase</td>
            <td>Database</td>
            <td>Submitted applications, waitlist entries and inquiries</td>
          </tr>
          <tr>
            <td>Resend</td>
            <td>Email</td>
            <td>Contact details and submission information used in notifications</td>
          </tr>
          <tr>
            <td>GoHighLevel</td>
            <td>SMS delivery, CRM</td>
            <td>Phone number, messages, consent</td>
          </tr>
          <tr>
            <td>Twilio</td>
            <td>SMS infrastructure</td>
            <td>Phone number, messages</td>
          </tr>
        </tbody>
      </table>

      <h3>SMS Consent</h3>
      <p>
        The SMS delivery providers listed above apply to SMS messaging; the
        current website forms record consent choices.
      </p>
      <p>
        We do not sell, rent, or share your SMS consent or phone number for
        third-party marketing. Shared only with GoHighLevel/Twilio for delivery,
        or as required by law.
      </p>
      <p>
        <strong>We do not sell personal data.</strong>
      </p>

      <h2>Article IV: Data Security</h2>
      <p>
        Access controls and encrypted connections help protect submitted
        information. No system is 100% secure.
      </p>

      <h2>Article V: Data Retention</h2>
      <ul>
        <li>SMS consent records: at least 5 years.</li>
      </ul>

      <h2>Article VI: Your Rights</h2>
      <p>
        <strong>All users:</strong> access, correct, delete your data, opt out
        of marketing and SMS. <strong>California (CCPA/CPRA):</strong> right to
        know, delete, opt out of sale (we don&rsquo;t sell), correct, limit
        sensitive data use. <strong>Colorado, Virginia, Connecticut:</strong>{" "}
        similar state-specific rights. Contact{" "}
        <a href="mailto:privacy@driveexotiq.com">privacy@driveexotiq.com</a>.
      </p>

      <h2>Article VII: Children&rsquo;s Privacy</h2>
      <p>Not intended for anyone under 18.</p>

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
