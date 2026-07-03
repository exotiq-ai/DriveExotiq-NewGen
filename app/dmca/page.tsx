import type { Metadata } from 'next';
import LegalLayout from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'DMCA and Copyright Policy | Exotiq Inc.',
  description:
    'Digital Millennium Copyright Act notice and takedown procedures.',
};

export default function DmcaPage() {
  return (
    <LegalLayout
      entity="Exotiq Inc. — a Delaware C-Corporation"
      title="DMCA and Copyright Policy"
      subtitle="Digital Millennium Copyright Act Notice and Takedown Procedures"
    >
      <p>
        Exotiq Inc. respects intellectual property rights and expects all users
        to do the same. This policy describes our DMCA procedures per 17 U.S.C.
        Section 512.
      </p>

      <h2>Article I: Designated Agent</h2>
      <p>
        <strong>Name:</strong> [DMCA Designated Agent]
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:dmca@exotiq.ai">dmca@exotiq.ai</a>
      </p>
      <p>
        <strong>Address:</strong> Exotiq Inc., 1001 S Main St #6709, Kalispell,
        MT 59901
      </p>

      <h2>Article II: Filing a Takedown Notice</h2>
      <p>
        Your notification must include: (a) your signature; (b) identification
        of the copyrighted work; (c) identification and location of the
        infringing material; (d) your contact information; (e) a good faith
        belief statement; and (f) a statement under penalty of perjury that the
        information is accurate.
      </p>
      <p>
        Send notices to{' '}
        <a href="mailto:dmca@exotiq.ai">dmca@exotiq.ai</a>.
      </p>

      <h2>Article III: Response to Valid Notices</h2>
      <p>
        Exotiq will: remove or disable the material; notify the user; inform
        them of counter-notification rights. Processing within five (5) business
        days.
      </p>

      <h2>Article IV: Counter-Notification</h2>
      <p>
        If you believe removal was in error, submit a counter-notification
        including: your signature; identification of removed material; a good
        faith statement; your contact information; and consent to jurisdiction.
        Content restored in 10–14 business days absent a court order.
      </p>

      <h2>Article V: Repeat Infringer Policy</h2>
      <p>
        First strike: written warning. Second strike: 30-day content upload
        suspension. Third strike: permanent account termination.
      </p>

      <h2>Article VI: Misrepresentation</h2>
      <p>
        Knowingly filing a false DMCA notice or counter-notification may result
        in liability for damages, including costs and attorney&rsquo;s fees,
        under 17 U.S.C. &sect; 512(f).
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:dmca@exotiq.ai">dmca@exotiq.ai</a>
      </p>
      <p>
        <strong>Address:</strong> Exotiq Inc., 1001 S Main St #6709, Kalispell,
        MT 59901
      </p>
    </LegalLayout>
  );
}
