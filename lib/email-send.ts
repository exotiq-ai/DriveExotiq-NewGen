import 'server-only';
import { Resend } from 'resend';
import {
  applicationConfirmationEmail,
  adminNotificationEmail,
  adminSponsorEmail,
  adminWaitlistEmail,
  approvalEmail,
  rejectionEmail,
  sponsorConfirmationEmail,
  waitlistConfirmationEmail,
  ApplicationData,
  SponsorData,
  WaitlistData,
} from '@/lib/email-templates';
import { INTEREST_LABEL, Interest } from '@/lib/interest';
import { SPONSOR_TIER_LABEL, SponsorTier } from '@/lib/sponsor';

/**
 * Server-only email sending. Imported directly by the API routes so there is no
 * public /api/send-email endpoint to abuse. Never throws — email failures are
 * logged and swallowed so they can't break a form submission or status update.
 *
 * Sending identity (2026-07-07): FROM uses the Resend-verified brand subdomain
 * mail.driveexotiq.com; replies route to the real inbox via Reply-To. Both are
 * env-overridable without a deploy... of code, at least (env changes still
 * need a redeploy to take effect on Netlify).
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@exotiq.ai';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Drive Exotiq <hello@mail.driveexotiq.com>';
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'hello@exotiq.ai';

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/** Strip CR/LF and clamp — user text that lands in an email subject line. */
function subjectSafe(value: string, max = 80): string {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max);
}

async function send(to: string, subject: string, html: string, label: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipping ${label}`);
    return;
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject,
      html,
    });
    if (error) console.error(`Resend error (${label}):`, error);
  } catch (error) {
    console.error(`Error sending ${label}:`, error);
  }
}

/** Fired on every /apply submit: applicant confirmation + admin triage notice. */
export async function sendNewApplicationEmails(application: ApplicationData): Promise<void> {
  await send(
    application.email,
    'You’re on the list. Drive Exotiq.',
    applicationConfirmationEmail(application),
    'applicant confirmation'
  );
  const interestLabel = INTEREST_LABEL[application.interest as Interest] || 'Get on the list';
  await send(
    ADMIN_EMAIL,
    `New · ${interestLabel}: ${subjectSafe(application.full_name, 48)} · ${subjectSafe(application.city_of_interest, 32)}`,
    adminNotificationEmail(application),
    'admin application notice'
  );
}

/** Fired on every exotiq.rent waitlist signup: subscriber confirmation + admin notice. */
export async function sendWaitlistEmails(entry: WaitlistData): Promise<void> {
  await send(
    entry.email,
    'You’re on the waitlist. exotiq.rent is coming.',
    waitlistConfirmationEmail(entry),
    'waitlist confirmation'
  );
  await send(
    ADMIN_EMAIL,
    `Waitlist: ${subjectSafe(entry.email, 48)}${entry.city ? ` · ${subjectSafe(entry.city, 24)}` : ''}`,
    adminWaitlistEmail(entry),
    'admin waitlist notice'
  );
}

/** Fired on every sponsor inquiry: inquirer confirmation + admin notice. */
export async function sendSponsorEmails(inquiry: SponsorData): Promise<void> {
  const tierLabel = SPONSOR_TIER_LABEL[inquiry.interest as SponsorTier] || 'Still deciding';
  await send(
    inquiry.email,
    'Got your note. Drive Exotiq.',
    sponsorConfirmationEmail(inquiry, tierLabel),
    'sponsor confirmation'
  );
  await send(
    ADMIN_EMAIL,
    `Sponsor · ${tierLabel}: ${subjectSafe(inquiry.name, 40)}${inquiry.company ? ` · ${subjectSafe(inquiry.company, 32)}` : ''}`,
    adminSponsorEmail(inquiry, tierLabel),
    'admin sponsor notice'
  );
}

/** Fired when an admin flips an application to approved/rejected. */
export async function sendStatusUpdateEmails(application: ApplicationData): Promise<void> {
  if (application.status === 'approved') {
    await send(application.email, 'You’re in. Drive Exotiq.', approvalEmail(application), 'approval email');
  } else if (application.status === 'rejected') {
    await send(
      application.email,
      'Update on your Drive Exotiq application',
      rejectionEmail(application),
      'rejection email'
    );
  }
}
