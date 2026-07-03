import type { Metadata } from 'next';
import LegalLayout from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy | Drive Exotiq',
  description: 'Use of cookies on driveexotiq.com.',
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Use of Cookies on driveexotiq.com"
    >
      <p>
        This Cookie Policy explains how Drive Exotiq uses cookies on
        driveexotiq.com.
      </p>

      <h2>Article I: Cookies We Use</h2>

      <h3>Strictly Necessary (no consent required)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session authentication</td>
            <td>Login and session security</td>
            <td>Session / 30 days</td>
          </tr>
          <tr>
            <td>CSRF protection</td>
            <td>Security</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>Payment session (Stripe)</td>
            <td>Secure transactions</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>Cookie consent</td>
            <td>Remembers your choices</td>
            <td>12 months</td>
          </tr>
        </tbody>
      </table>

      <h3>Functional (require consent)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Search preferences</td>
            <td>Vehicle search filters, location</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>Recently viewed</td>
            <td>Vehicles you browsed</td>
            <td>Session</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytics (require consent)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Page views</td>
            <td>Improves site structure</td>
            <td>24 months</td>
          </tr>
          <tr>
            <td>Search analytics</td>
            <td>Popular search terms</td>
            <td>24 months</td>
          </tr>
          <tr>
            <td>Performance</td>
            <td>Load times, errors</td>
            <td>24 months</td>
          </tr>
        </tbody>
      </table>

      <h3>Cookies We Do Not Use</h3>
      <p>
        No advertising, cross-site tracking, social media tracking, retargeting,
        or ad network cookies. We do not serve ads.
      </p>

      {/* TODO: Build cookie consent banner — references this section */}
      <h2>Article II: Your Choices</h2>
      <p>
        Cookie consent banner on first visit: accept all, reject non-essential,
        or customize. Change anytime via &ldquo;Cookie Settings&rdquo; in
        footer.
      </p>

      <h2>Article III: State Disclosures</h2>
      <p>
        California: CCPA/CPRA rights apply, we don&rsquo;t sell cookie data.
        Colorado, Virginia, Connecticut: no targeted advertising cookies. EEA/UK:
        non-essential cookies placed only with consent.
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
