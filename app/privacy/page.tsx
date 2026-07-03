import type { Metadata } from 'next';
import LegalLayout from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Drive Exotiq',
  description:
    'How Drive Exotiq collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Drive Exotiq Collects, Uses, and Protects Your Information"
    >
      <p>
        Exotiq Inc., doing business as Drive Exotiq (&ldquo;Drive
        Exotiq,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;), is committed to protecting your privacy. This
        explains how we handle your information on driveexotiq.com.
      </p>

      <h2>Article I: Information We Collect</h2>

      <h3>Information You Provide</h3>
      <p>
        Name, email, phone, date of birth, driver&rsquo;s license information,
        payment information (via Stripe), vehicle preferences, communications,
        and reviews.
      </p>

      <h3>Automatic Collection</h3>
      <p>
        IP address, browser/device info, pages viewed, search queries,
        approximate location, and cookie data.
      </p>

      <h3>SMS Consent Data</h3>
      <p>
        Phone number, consent preferences, timestamp, IP address at consent,
        consent language version, and opt-out history. Retained at least 5 years
        (TCPA).
      </p>

      <h2>Article II: How We Use Your Information</h2>
      <p>
        To: process bookings; connect you with Operators; process payments; send
        confirmations and reminders; provide Rari concierge services; verify
        identity; respond to support requests; and send SMS (only with your
        consent). We never use your phone number beyond what you consented to.
      </p>

      <h2>Article III: How We Share Your Information</h2>

      <h3>With Operators</h3>
      <p>
        When you book, the Operator receives your name, email, phone,
        driver&rsquo;s license info, and booking details. Operator handling is
        per their privacy policy.
      </p>

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
            <td>Stripe</td>
            <td>Payments</td>
            <td>Transaction data</td>
          </tr>
          <tr>
            <td>Supabase</td>
            <td>Database</td>
            <td>Platform data (encrypted)</td>
          </tr>
          <tr>
            <td>ElevenLabs</td>
            <td>AI voice (Rari)</td>
            <td>Text inputs</td>
          </tr>
          <tr>
            <td>Resend</td>
            <td>Email</td>
            <td>Email address</td>
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
        We do not sell, rent, or share your SMS consent or phone number for
        third-party marketing. Shared only with GoHighLevel/Twilio for delivery,
        or as required by law.
      </p>
      <p>
        <strong>We do not sell personal data.</strong>
      </p>

      <h2>Article IV: Data Security</h2>
      <p>
        Encryption at rest and in transit (TLS 1.2+), Stripe PCI DSS compliance,
        access controls, regular assessments. No system is 100% secure.
      </p>

      <h2>Article V: Data Retention</h2>
      <ul>
        <li>Active account data: duration of account.</li>
        <li>Booking/transaction records: 7 years.</li>
        <li>SMS consent records: at least 5 years.</li>
        <li>Rari conversation logs: 30 days.</li>
        <li>
          Account deletion: within 30 days of request (subject to legal holds).
        </li>
      </ul>

      <h2>Article VI: Your Rights</h2>
      <p>
        <strong>All users:</strong> access, correct, delete your data, opt out
        of marketing and SMS.{' '}
        <strong>California (CCPA/CPRA):</strong> right to know, delete, opt out
        of sale (we don&rsquo;t sell), correct, limit sensitive data use.{' '}
        <strong>Colorado, Virginia, Connecticut:</strong> similar state-specific
        rights. Contact{' '}
        <a href="mailto:privacy@driveexotiq.com">privacy@driveexotiq.com</a>.
      </p>

      <h2>Article VII: Children&rsquo;s Privacy</h2>
      <p>
        Not intended for anyone under 18. Renter accounts require age 21+.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:privacy@driveexotiq.com">privacy@driveexotiq.com</a>
      </p>
      <p>
        <strong>Address:</strong> Exotiq Inc., 1001 S Main St #6709, Kalispell,
        MT 59901
      </p>
    </LegalLayout>
  );
}
