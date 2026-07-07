/**
 * Email templates for Drive Exotiq.
 * Quiet voice (01-COPY-BRIEF §1). Film palette. All user-supplied fields are
 * HTML-escaped before interpolation.
 */

export interface ApplicationData {
  full_name: string;
  email: string;
  phone: string;
  current_city: string;
  city_of_interest: string;
  interest?: string;
  brief_intro: string;
  invite_code?: string | null;
  created_at?: string;
  status?: string;
}

/** Escape user-supplied text before interpolating into email HTML. */
export function esc(value: unknown): string {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );
}

const INK = '#F3F1EC';
const INK2 = '#ABA8A1';
const GULF = '#6CBDE6';
const CANVAS = '#0B0B0C';
const SURFACE = '#161618';
const LINE = '#28282C';

/** Base wrapper: quiet dark canvas, wordmark + real tagline, gulf hairline. */
function baseEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drive Exotiq</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:${CANVAS};color:${INK2};">
  <table role="presentation" style="width:100%;border-collapse:collapse;background-color:${CANVAS};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background-color:${SURFACE};border:1px solid ${LINE};border-radius:6px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:36px 30px 30px 30px;border-bottom:1px solid ${LINE};">
              <div style="width:36px;height:2px;background-color:${GULF};margin-bottom:18px;"></div>
              <div style="color:${INK};font-size:20px;font-weight:700;letter-spacing:-0.01em;">Drive Exotiq</div>
              <div style="margin-top:8px;color:${INK2};font-size:13px;">Built for the people who actually drive the car.</div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:36px 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:28px 30px;background-color:${CANVAS};border-top:1px solid ${LINE};">
              <p style="margin:0 0 14px 0;color:${INK2};font-size:13px;line-height:1.6;">
                Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace. An Exotiq Inc. brand.
              </p>
              <p style="margin:0;color:${INK2};font-size:12px;">
                <a href="https://www.instagram.com/driveexotiq" style="color:${GULF};text-decoration:none;">@driveexotiq</a>
                &nbsp;·&nbsp;
                <a href="mailto:hello@exotiq.ai" style="color:${GULF};text-decoration:none;">hello@exotiq.ai</a>
              </p>
              <p style="margin:12px 0 0 0;color:${INK2};font-size:12px;opacity:0.7;">
                © 2026 Exotiq Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

const h2 = (text: string) =>
  `<h2 style="margin:0 0 20px 0;color:${INK};font-size:24px;font-weight:600;letter-spacing:-0.01em;">${text}</h2>`;
const p = (text: string) =>
  `<p style="margin:0 0 20px 0;color:${INK2};font-size:16px;line-height:1.6;">${text}</p>`;

/** Application confirmation (to applicant). */
export function applicationConfirmationEmail(application: ApplicationData): string {
  const content = `
    ${h2('You&rsquo;re on the list.')}
    ${p(`Hi ${esc(application.full_name)},`)}
    ${p(
      'We&rsquo;ve got your application. We review every name personally and keep this list small on purpose. One list for the drives, the Denver-to-Miami tour, and what&rsquo;s coming with exotiq.rent.'
    )}
    <div style="background-color:${CANVAS};border-left:2px solid ${GULF};padding:18px 20px;margin:24px 0;border-radius:2px;">
      <p style="margin:0 0 10px 0;color:${INK};font-size:15px;font-weight:600;">What happens next</p>
      <ul style="margin:0;padding-left:18px;color:${INK2};font-size:15px;line-height:1.8;">
        <li>We read every name. This stays small on purpose.</li>
        <li>When a drive fits your city, your invite and the meet point land in your inbox.</li>
        <li>You&rsquo;ll be first to hear when the tour rolls through, and when exotiq.rent opens.</li>
      </ul>
    </div>
    ${p(
      `Questions? Just reply to this email, or reach us at <a href="mailto:hello@exotiq.ai" style="color:${GULF};text-decoration:none;">hello@exotiq.ai</a>.`
    )}
  `;
  return baseEmailTemplate(content);
}

/** Admin notification (to team). */
export function adminNotificationEmail(application: ApplicationData): string {
  const submissionDate = application.created_at
    ? new Date(application.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;color:${INK2};font-size:15px;border-bottom:1px solid ${LINE};">
        <strong style="color:${INK};">${label}</strong>
      </td>
      <td style="padding:10px 0;color:${GULF};font-size:15px;text-align:right;border-bottom:1px solid ${LINE};">
        ${value}
      </td>
    </tr>`;

  const content = `
    ${h2('New application')}
    <div style="background-color:${CANVAS};padding:22px;margin:20px 0;border-radius:2px;border-left:2px solid ${GULF};">
      <table style="width:100%;border-collapse:collapse;">
        ${application.interest ? row('Interest', esc(application.interest)) : ''}
        ${row('Name', esc(application.full_name))}
        ${row('Email', `<a href="mailto:${esc(application.email)}" style="color:${GULF};text-decoration:none;">${esc(application.email)}</a>`)}
        ${row('Phone', `<a href="tel:${esc(application.phone)}" style="color:${GULF};text-decoration:none;">${esc(application.phone)}</a>`)}
        ${row('Current city', esc(application.current_city))}
        ${row('City they&rsquo;d drive in', esc(application.city_of_interest))}
        ${application.invite_code ? row('Invite code', esc(application.invite_code)) : ''}
        <tr>
          <td colspan="2" style="padding:16px 0 8px 0;color:${INK};font-size:15px;"><strong>What they drive</strong></td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 0 10px 0;color:${INK2};font-size:15px;line-height:1.6;font-style:italic;">&ldquo;${esc(application.brief_intro)}&rdquo;</td>
        </tr>
        ${row('Submitted', esc(submissionDate))}
      </table>
    </div>
    <div style="margin:28px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com'}/admin"
         style="display:inline-block;padding:13px 28px;background-color:${GULF};color:${CANVAS};text-decoration:none;border-radius:2px;font-weight:600;font-size:15px;">
        Open the admin dashboard →
      </a>
    </div>
  `;
  return baseEmailTemplate(content);
}

/** Approval (to applicant). */
export function approvalEmail(application: ApplicationData): string {
  const content = `
    ${h2('You&rsquo;re in.')}
    ${p(`Hi ${esc(application.full_name)},`)}
    ${p('Your application is approved. Welcome to Drive Exotiq.')}
    <div style="background-color:${CANVAS};border-left:2px solid ${GULF};padding:18px 20px;margin:24px 0;border-radius:2px;">
      <p style="margin:0 0 10px 0;color:${INK};font-size:15px;font-weight:600;">What&rsquo;s next</p>
      <ul style="margin:0;padding-left:18px;color:${INK2};font-size:15px;line-height:1.8;">
        <li>Watch for the next drive in ${esc(application.city_of_interest)}. Invites go out a few days ahead.</li>
        <li>We&rsquo;ll let you know the moment exotiq.rent opens.</li>
      </ul>
    </div>
    ${p(
      `Questions? Reply any time, or reach us at <a href="mailto:hello@exotiq.ai" style="color:${GULF};text-decoration:none;">hello@exotiq.ai</a>.`
    )}
  `;
  return baseEmailTemplate(content);
}

/** Not this time (to applicant) — graceful. */
export function rejectionEmail(application: ApplicationData): string {
  const content = `
    ${h2('Update on your application')}
    ${p(`Hi ${esc(application.full_name)},`)}
    ${p(
      'Thank you for your interest in Drive Exotiq. We&rsquo;re not able to add you to the list right now. We keep it small on purpose, and space is limited.'
    )}
    ${p(
      `If you&rsquo;d like, we&rsquo;ll keep you posted as things open up in ${esc(application.city_of_interest)}, and when the exotiq.rent marketplace launches.`
    )}
    <div style="margin:28px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com'}/marketplace"
         style="display:inline-block;padding:13px 28px;background-color:${GULF};color:${CANVAS};text-decoration:none;border-radius:2px;font-weight:600;font-size:15px;">
        Join the waitlist →
      </a>
    </div>
    ${p('You&rsquo;re welcome to reach out again down the road. Thanks for understanding.')}
  `;
  return baseEmailTemplate(content);
}
