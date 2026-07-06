import type { Metadata } from 'next';
import LegalLayout from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
  title: 'Marketplace Terms of Service',
  description: 'Terms governing the Drive Exotiq rental marketplace.',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Marketplace Terms of Service"
      subtitle="Terms Governing the Drive Exotiq Rental Marketplace"
    >
      <p>
        These Marketplace Terms constitute a binding agreement between you
        (&ldquo;Renter&rdquo;) and Exotiq Inc., doing business as Drive Exotiq
        (&ldquo;Drive Exotiq,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;), governing your use of the Drive Exotiq marketplace
        at driveexotiq.com.
      </p>
      <p>
        <strong>Drive Exotiq is not a car rental company.</strong> We are an
        online travel agency (OTA) connecting renters with independent exotic and
        luxury car rental operators (&ldquo;Operators&rdquo;). We do not own,
        operate, maintain, insure, or control any vehicles. All rental
        transactions are between you and the Operator.
      </p>

      <h2>Article I: Definitions</h2>
      <p>
        <strong>&ldquo;Booking&rdquo;</strong> means a confirmed reservation for
        a specific vehicle and date range.
      </p>
      <p>
        <strong>&ldquo;Operator&rdquo;</strong> means an independent rental
        business listing vehicles on the Marketplace.
      </p>
      <p>
        <strong>&ldquo;Rental Agreement&rdquo;</strong> means the contract
        between you and the Operator for a specific rental.
      </p>
      <p>
        <strong>&ldquo;Renter Service Fee&rdquo;</strong> means the 10% fee
        charged to you, added to the Operator&rsquo;s base rate.
      </p>
      <p>
        <strong>&ldquo;Rari&rdquo;</strong> means Drive Exotiq&rsquo;s AI
        concierge assistant.
      </p>

      <h2>Article II: Drive Exotiq&rsquo;s Role</h2>
      <p>
        We provide: a searchable marketplace; booking and payment processing
        (via Stripe); AI-optimized pricing display; Rari concierge service; and
        renter-operator communication. We do not own vehicles, employ operators,
        guarantee vehicle condition, or provide insurance.
      </p>

      <h2>Article III: Renter Eligibility</h2>
      <p>
        Age 21+ required (25+ for some high-performance vehicles). Valid U.S.
        driver&rsquo;s license or IDP required. You must maintain rental vehicle
        insurance coverage. Operators may conduct driving record checks.
      </p>

      <h2>Article IV: Bookings and Payments</h2>
      <h3>Fee Structure</h3>
      <table>
        <thead>
          <tr>
            <th>Fee</th>
            <th>Amount</th>
            <th>Charged To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Renter Service Fee</td>
            <td>10% of base rate</td>
            <td>Renter (you)</td>
          </tr>
          <tr>
            <td>Operator Service Fee</td>
            <td>10% of base rate</td>
            <td>Operator (not visible to you)</td>
          </tr>
          <tr>
            <td>Direct Booking Fee</td>
            <td>0%</td>
            <td>N/A</td>
          </tr>
        </tbody>
      </table>
      <p>
        All fees are disclosed before you confirm. No hidden fees from Drive
        Exotiq. Operator charges (insurance, mileage, late fees, damage) are per
        the Rental Agreement.
      </p>
      <p>
        Payments processed by Stripe. Drive Exotiq does not store credit card or
        banking credentials.
      </p>

      <h2>Article V: Cancellations and Refunds</h2>
      <p>
        Cancellation policies are set by each Operator and displayed before
        booking. Common structures: full refund (72+ hours before pickup), 50%
        refund (24–72 hours), no refund (under 24 hours or no-show). If an
        Operator cancels, you receive a full refund including the Renter Service
        Fee.
      </p>

      <h2>Article VI: Vehicle Pickup, Use, and Return</h2>
      <p>
        You must sign the Operator&rsquo;s Rental Agreement before taking
        possession. Inspect and photograph the vehicle before departing. Comply
        with all use restrictions (no smoking, no racing, geographic limits,
        mileage limits). Return on time and in the agreed condition. Late returns
        may incur charges. Failure to return may be reported as theft.
      </p>

      <h2>Article VII: Damage and Liability</h2>
      <p>
        You are liable to the Operator for all damage during the rental period
        per the Rental Agreement and your insurance coverage. Drive Exotiq
        assumes no liability for property damage, personal injury, vehicle
        condition, insurance coverage, or disputes between you and the Operator.
      </p>

      <h2>Article VIII: Disclaimers</h2>
      <p className="uppercase text-sm">
        THE MARKETPLACE IS PROVIDED &ldquo;AS IS.&rdquo; DRIVE EXOTIQ DISCLAIMS
        ALL WARRANTIES INCLUDING MERCHANTABILITY AND FITNESS FOR PURPOSE. DRIVE
        EXOTIQ DOES NOT WARRANT VEHICLE ACCURACY, CONDITION, SAFETY, OR
        AVAILABILITY.
      </p>

      <h2>Article IX: Limitation of Liability</h2>
      <p className="uppercase text-sm">
        DRIVE EXOTIQ&rsquo;S LIABILITY SHALL NOT EXCEED THE RENTER SERVICE FEES
        PAID IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS
        GREATER. NO LIABILITY FOR INDIRECT, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </p>

      <h2>Article X: Dispute Resolution</h2>
      <p>
        Disputes with Operators: resolve directly, then request mediation via{' '}
        <a href="mailto:support@driveexotiq.com">support@driveexotiq.com</a>.
        Disputes with Drive Exotiq: informal resolution (30 days), then binding
        AAA arbitration in Delaware.
      </p>
      <p className="uppercase text-sm">
        CLASS ACTION WAIVER: CLAIMS MAY ONLY BE BROUGHT IN INDIVIDUAL CAPACITY.
      </p>

      <h2>Article XI: SMS/Text Messaging</h2>
      <p>
        Drive Exotiq operates two separate SMS programs (transactional and
        marketing). See our full{' '}
        <a href="/sms">SMS/Text Messaging Policy</a> for consent details,
        opt-out instructions, and your rights. Consent is never required for
        booking or account creation.
      </p>

      <h2>Article XII: General Provisions</h2>
      <p>
        Governed by Delaware law. Amendments with 30 days notice. You may not
        assign these Terms. This agreement, with the Privacy Policy and Cookie
        Policy, constitutes the entire agreement.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>General:</strong>{' '}
        <a href="mailto:support@driveexotiq.com">support@driveexotiq.com</a>
      </p>
      <p>
        <strong>Legal:</strong>{' '}
        <a href="mailto:legal@driveexotiq.com">legal@driveexotiq.com</a>
      </p>
      <p>
        <strong>Address:</strong> Exotiq Inc., 1001 S Main St #6709, Kalispell,
        MT 59901
      </p>
    </LegalLayout>
  );
}
