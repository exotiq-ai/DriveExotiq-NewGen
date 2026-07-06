import 'server-only';
import { Resend } from 'resend';
import {
  applicationConfirmationEmail,
  adminNotificationEmail,
  approvalEmail,
  rejectionEmail,
  ApplicationData,
} from '@/lib/email-templates';
import { INTEREST_LABEL, Interest } from '@/lib/interest';

/**
 * Server-only email sending. Imported directly by the API routes so there is no
 * public /api/send-email endpoint to abuse. Never throws — email failures are
 * logged and swallowed so they can't break a form submission or status update.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@exotiq.ai';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Drive Exotiq <hello@exotiq.ai>';

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

/** Fired on every /apply submit: applicant confirmation + admin triage notice. */
export async function sendNewApplicationEmails(application: ApplicationData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping application emails');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: application.email,
      subject: 'We received your Drive Exotiq application.',
      html: applicationConfirmationEmail(application),
    });
  } catch (error) {
    console.error('Error sending applicant confirmation:', error);
  }

  try {
    const interestLabel = INTEREST_LABEL[application.interest as Interest] || 'Get on the list';
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New — ${interestLabel}: ${subjectSafe(application.full_name, 48)} · ${subjectSafe(application.city_of_interest, 32)}`,
      html: adminNotificationEmail(application),
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/** Fired when an admin flips an application to approved/rejected. */
export async function sendStatusUpdateEmails(application: ApplicationData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping status email');
    return;
  }

  try {
    if (application.status === 'approved') {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: application.email,
        subject: 'You’re in — Drive Exotiq.',
        html: approvalEmail(application),
      });
    } else if (application.status === 'rejected') {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: application.email,
        subject: 'Update on your Drive Exotiq application',
        html: rejectionEmail(application),
      });
    }
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
}
