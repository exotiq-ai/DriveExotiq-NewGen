import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Website Terms of Service",
  description:
    "Terms for the Drive Exotiq website, applications, waitlist and partnership inquiries.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Website Terms of Service"
      subtitle="Use of the Drive Exotiq Website"
      lastUpdated="September 8, 2026"
    >
      <p>
        These Terms govern your use of the Drive Exotiq website at
        driveexotiq.com, operated by Exotiq Inc., doing business as Drive Exotiq
        (&ldquo;Drive Exotiq,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;).
      </p>

      <h2>Article I: Current Website Services</h2>
      <p>
        The current website provides community and event information, stories,
        applications for invitations, marketplace waitlist registration and
        partnership inquiries. The exotiq.rent marketplace is upcoming. This
        website does not currently provide rental bookings, payment checkout,
        renter accounts or the Rari concierge service.
      </p>

      <h2>Article II: Applications and Inquiries</h2>
      <p>
        Submitting an application, joining the waitlist or sending an inquiry
        records your interest. It is not a confirmed event invitation, vehicle
        reservation or rental agreement. Confirmed drive details are shared
        directly with invited participants.
      </p>

      <h2>Article III: Bookings and Payments</h2>
      <p>
        No rental payment or marketplace service fee is collected through the
        current public website. Rental eligibility, pricing, operator terms and
        cancellation policies are not part of the current application or
        waitlist process.
      </p>

      <h2>Article IV: Disclaimers</h2>
      <p className="uppercase text-sm">
        THE WEBSITE IS PROVIDED &ldquo;AS IS.&rdquo; DRIVE EXOTIQ DISCLAIMS
        ALL WARRANTIES INCLUDING MERCHANTABILITY AND FITNESS FOR PURPOSE. DRIVE
        EXOTIQ DOES NOT WARRANT VEHICLE ACCURACY, CONDITION, SAFETY, OR
        AVAILABILITY.
      </p>

      <h2>Article V: Limitation of Liability</h2>
      <p className="uppercase text-sm">
        DRIVE EXOTIQ&rsquo;S LIABILITY SHALL NOT EXCEED THE RENTER SERVICE FEES
        PAID IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS
        GREATER. NO LIABILITY FOR INDIRECT, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </p>

      <h2>Article VI: Dispute Resolution</h2>
      <p>
        Disputes with Drive Exotiq: informal resolution (30 days), then binding
        AAA arbitration in Delaware.
      </p>
      <p className="uppercase text-sm">
        CLASS ACTION WAIVER: CLAIMS MAY ONLY BE BROUGHT IN INDIVIDUAL CAPACITY.
      </p>

      <h2>Article VII: SMS/Text Messaging</h2>
      <p>
        The application form offers separate transactional and marketing SMS
        consent choices. See our full <a href="/sms">SMS/Text Messaging Policy</a>{" "}
        for consent details, opt-out instructions, and your rights. SMS consent
        is not required to submit an application.
      </p>

      <h2>Article VIII: General Provisions</h2>
      <p>
        Governed by Delaware law. Amendments with 30 days notice. You may not
        assign these Terms. This agreement, with the Privacy Policy and Cookie
        Policy, constitutes the entire agreement.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>General:</strong>{" "}
        <a href="mailto:support@driveexotiq.com">support@driveexotiq.com</a>
      </p>
      <p>
        <strong>Legal:</strong>{" "}
        <a href="mailto:legal@driveexotiq.com">legal@driveexotiq.com</a>
      </p>
      <p>
        <strong>Address:</strong> Exotiq Inc., 1001 S Main St #6709, Kalispell,
        MT 59901
      </p>
    </LegalLayout>
  );
}
