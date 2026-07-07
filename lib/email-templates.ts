/**
 * Email templates for Drive Exotiq.
 * Quiet voice (01-COPY-BRIEF §1). Film palette, film type hierarchy: kicker →
 * headline → serif-italic jewel → body. Every user-supplied field is
 * HTML-escaped before interpolation.
 *
 * Email-client discipline: single-column tables, inline styles, bgcolor
 * attributes for Outlook, hosted hero images from driveexotiq.com (production
 * serves them; alt text carries the story when images are blocked), system
 * font stack + Georgia for the jewel. 600px card on the canvas dark.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com';

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

export interface WaitlistData {
  email: string;
  city?: string | null;
  desired_car?: string | null;
}

export interface SponsorData {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  interest: string;
  budget?: string | null;
  message?: string | null;
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
const INK3 = '#6F6D67';
const GULF = '#6CBDE6';
const CANVAS = '#0B0B0C';
const SURFACE = '#161618';
const LINE = '#28282C';

const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

interface Hero {
  src: string;
  alt: string;
}

/**
 * Base wrapper. Optional cinematic hero (a frame from the film, full-bleed at
 * the top of the card) and a hidden preheader (the preview line email clients
 * show beside the subject).
 */
function baseEmailTemplate(
  content: string,
  opts: { hero?: Hero; preheader?: string } = {}
): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(opts.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : '';
  const hero = opts.hero
    ? `<tr><td style="line-height:0;">
         <img src="${opts.hero.src}" alt="${esc(opts.hero.alt)}" width="600"
              style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
       </td></tr>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Drive Exotiq</title>
</head>
<body style="margin:0;padding:0;font-family:${SANS};background-color:${CANVAS};color:${INK2};">
  ${preheader}
  <table role="presentation" width="100%" bgcolor="${CANVAS}" style="width:100%;border-collapse:collapse;background-color:${CANVAS};">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="600" bgcolor="${SURFACE}" style="max-width:600px;width:100%;border-collapse:collapse;background-color:${SURFACE};border:1px solid ${LINE};border-radius:4px;overflow:hidden;">
          ${hero}
          <!-- Brand row -->
          <tr>
            <td style="padding:26px 32px 0 32px;">
              <table role="presentation" width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="width:36px;padding:0;"><div style="width:28px;height:2px;background-color:${GULF};font-size:0;line-height:0;">&nbsp;</div></td>
                  <td style="padding:0 0 0 10px;color:${INK};font-size:15px;font-weight:700;letter-spacing:-0.01em;">Drive Exotiq</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:26px 32px 36px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="${CANVAS}" style="padding:26px 32px;background-color:${CANVAS};border-top:1px solid ${LINE};">
              <p style="margin:0 0 12px 0;color:${INK3};font-size:12.5px;line-height:1.6;">
                Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace. An Exotiq Inc. brand.
              </p>
              <p style="margin:0;color:${INK3};font-size:12px;">
                <a href="https://www.instagram.com/driveexotiq" style="color:${GULF};text-decoration:none;">@driveexotiq</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:hello@exotiq.ai" style="color:${GULF};text-decoration:none;">hello@exotiq.ai</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE}" style="color:${GULF};text-decoration:none;">driveexotiq.com</a>
              </p>
              <p style="margin:12px 0 0 0;color:${INK3};font-size:11.5px;">
                &copy; 2026 Exotiq Inc. All rights reserved.
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

/* ---------- type hierarchy helpers (the film's ladder) ---------- */

const kicker = (text: string) =>
  `<p style="margin:0 0 10px 0;color:${INK3};font-size:12.5px;letter-spacing:0.06em;">${text}</p>`;
const h1 = (text: string) =>
  `<h1 style="margin:0 0 14px 0;color:${INK};font-size:30px;line-height:1.12;font-weight:700;letter-spacing:-0.02em;">${text}</h1>`;
const jewel = (text: string) =>
  `<p style="margin:0 0 22px 0;color:${INK2};font-family:${SERIF};font-style:italic;font-size:17px;line-height:1.5;">${text}</p>`;
const p = (text: string) =>
  `<p style="margin:0 0 18px 0;color:${INK2};font-size:15.5px;line-height:1.65;">${text}</p>`;
const card = (title: string, inner: string) => `
  <table role="presentation" width="100%" bgcolor="${CANVAS}" style="width:100%;border-collapse:collapse;background-color:${CANVAS};border-left:2px solid ${GULF};border-radius:2px;margin:6px 0 22px 0;">
    <tr><td style="padding:18px 20px;">
      <p style="margin:0 0 10px 0;color:${INK};font-size:14.5px;font-weight:600;">${title}</p>
      ${inner}
    </td></tr>
  </table>`;
const li = (text: string) =>
  `<p style="margin:0 0 8px 0;color:${INK2};font-size:14.5px;line-height:1.6;">&middot;&nbsp;&nbsp;${text}</p>`;
const btn = (label: string, href: string) => `
  <table role="presentation" style="border-collapse:collapse;margin:6px 0 20px 0;">
    <tr><td bgcolor="${GULF}" style="background-color:${GULF};border-radius:2px;">
      <a href="${href}" style="display:inline-block;padding:13px 26px;color:${CANVAS};text-decoration:none;font-weight:600;font-size:15px;">${label}</a>
    </td></tr>
  </table>`;
const replyNote = () =>
  `<p style="margin:0;color:${INK3};font-size:13.5px;line-height:1.6;">Questions? Just reply. A real person reads every email.</p>`;

/* ---------- user-facing confirmations ---------- */

/** Application ("Get on the list") confirmation — to the applicant. */
export function applicationConfirmationEmail(a: ApplicationData): string {
  const firstName = esc(a.full_name.split(' ')[0] || a.full_name);
  const content = `
    ${kicker('The list')}
    ${h1('You&rsquo;re on the list.')}
    ${jewel('Built for the people who actually drive the car.')}
    ${p(`Hi ${firstName}. We&rsquo;ve got your application. We review every name personally and keep this list small on purpose. One list for the drives, the Denver-to-Miami tour, and what&rsquo;s coming with exotiq.rent.`)}
    ${card('What happens next', `
      ${li('We read every name. This stays small on purpose.')}
      ${li('When a drive fits your city, your invite and the meet point land in your inbox.')}
      ${li('You&rsquo;ll be first to hear when the tour rolls through, and when exotiq.rent opens.')}
    `)}
    ${btn('Scroll the film', SITE)}
    ${replyNote()}
  `;
  return baseEmailTemplate(content, {
    hero: {
      src: `${SITE}/images/experience/poster/sb-02b.jpg`,
      alt: 'The garage door open onto a lit corridor, the opening of the Drive Exotiq film',
    },
    preheader: 'We read every name personally. Here is what happens next.',
  });
}

/** exotiq.rent waitlist confirmation — to the subscriber. */
export function waitlistConfirmationEmail(w: WaitlistData): string {
  const noted = w.desired_car
    ? card('Noted', `<p style="margin:0;color:${INK2};font-family:${SERIF};font-style:italic;font-size:15px;line-height:1.6;">&ldquo;${esc(w.desired_car)}&rdquo;</p>
       <p style="margin:8px 0 0 0;color:${INK3};font-size:13.5px;">We&rsquo;ll remember you said that.</p>`)
    : '';
  const content = `
    ${kicker('The marketplace')}
    ${h1('You&rsquo;re on the waitlist.')}
    ${jewel('First keys to the fleet.')}
    ${p('exotiq.rent opens soon: McLaren, Porsche, Ferrari, and the rest of the dream garage. When the first booking windows open, you hear before anyone else.')}
    ${noted}
    ${card('While you wait', `
      ${li(`<a href="${SITE}" style="color:${GULF};text-decoration:none;">Scroll the film</a>: the whole reason we built the site.`)}
      ${li(`<a href="${SITE}/drives" style="color:${GULF};text-decoration:none;">The drives</a>: invite-only, the last Sunday of every month.`)}
      ${li(`<a href="${SITE}/tour" style="color:${GULF};text-decoration:none;">The tour</a>: one car, Denver to Miami, summer into fall.`)}
    `)}
    ${btn('Scroll the film', SITE)}
    ${replyNote()}
  `;
  return baseEmailTemplate(content, {
    hero: {
      src: `${SITE}/og-experience.jpg`,
      alt: 'The industrial garage door open onto a lit corridor',
    },
    preheader: 'First booking windows go to the waitlist before anyone else.',
  });
}

/** Sponsor inquiry confirmation — to the inquirer. */
export function sponsorConfirmationEmail(s: SponsorData, tierLabel: string): string {
  const firstName = esc(s.name.split(' ')[0] || s.name);
  const rows = [
    `${li(`Interest: <span style="color:${INK};">${esc(tierLabel)}</span>`)}`,
    s.company ? li(`Company: <span style="color:${INK};">${esc(s.company)}</span>`) : '',
    s.budget ? li(`Budget range: <span style="color:${INK};">${esc(s.budget)}</span>`) : '',
  ].join('');
  const content = `
    ${kicker('The sponsorship')}
    ${h1('Got your note.')}
    ${jewel('A billboard that drives.')}
    ${p(`Thanks, ${firstName}. We read every inquiry personally and reply within a couple of days, usually sooner. You&rsquo;ll hear from the founder directly.`)}
    ${card('Your inquiry', rows)}
    ${p(`Meanwhile, the car and the route are worth a look: ten markets, ~5,000 miles, one wrap.`)}
    ${btn('See the route', `${SITE}/tour`)}
    ${replyNote()}
  `;
  return baseEmailTemplate(content, {
    hero: {
      src: `${SITE}/images/experience/photo/wrap-livery-lift.jpg`,
      alt: 'The 2017 Audi S8 in heritage racing livery at dusk',
    },
    preheader: 'A real person reads every note. You will hear from the founder directly.',
  });
}

/* ---------- lifecycle emails ---------- */

/** Approval (to applicant). */
export function approvalEmail(a: ApplicationData): string {
  const firstName = esc(a.full_name.split(' ')[0] || a.full_name);
  const content = `
    ${kicker('Welcome')}
    ${h1('You&rsquo;re in.')}
    ${jewel('The door is open.')}
    ${p(`Hi ${firstName}. Your application is approved. Welcome to Drive Exotiq.`)}
    ${card('What&rsquo;s next', `
      ${li(`Watch for the next drive in ${esc(a.city_of_interest)}. Invites go out a few days ahead.`)}
      ${li('We&rsquo;ll let you know the moment exotiq.rent opens.')}
    `)}
    ${btn('See the drives', `${SITE}/drives`)}
    ${replyNote()}
  `;
  return baseEmailTemplate(content, {
    hero: {
      src: `${SITE}/images/experience/poster/tour-road.jpg`,
      alt: 'The S8 running a canyon road',
    },
    preheader: 'Your application is approved. Welcome to Drive Exotiq.',
  });
}

/** Not this time (to applicant) — graceful, quiet, no hero. */
export function rejectionEmail(a: ApplicationData): string {
  const content = `
    ${h1('Update on your application')}
    ${p(`Hi ${esc(a.full_name)},`)}
    ${p('Thank you for your interest in Drive Exotiq. We&rsquo;re not able to add you to the list right now. We keep it small on purpose, and space is limited.')}
    ${p(`If you&rsquo;d like, we&rsquo;ll keep you posted as things open up in ${esc(a.city_of_interest)}, and when the exotiq.rent marketplace launches.`)}
    ${btn('Join the waitlist', `${SITE}/marketplace`)}
    ${p('You&rsquo;re welcome to reach out again down the road. Thanks for understanding.')}
  `;
  return baseEmailTemplate(content);
}

/* ---------- admin notifications (to the team, no hero) ---------- */

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:9px 0;color:${INK2};font-size:14.5px;border-bottom:1px solid ${LINE};">
      <strong style="color:${INK};">${label}</strong>
    </td>
    <td style="padding:9px 0;color:${GULF};font-size:14.5px;text-align:right;border-bottom:1px solid ${LINE};">
      ${value}
    </td>
  </tr>`;

/** New application (to team). */
export function adminNotificationEmail(a: ApplicationData): string {
  const submissionDate = new Date(a.created_at ?? Date.now()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const content = `
    ${h1('New application')}
    <table role="presentation" width="100%" style="width:100%;border-collapse:collapse;margin:0 0 22px 0;">
      ${a.interest ? row('Interest', esc(a.interest)) : ''}
      ${row('Name', esc(a.full_name))}
      ${row('Email', `<a href="mailto:${esc(a.email)}" style="color:${GULF};text-decoration:none;">${esc(a.email)}</a>`)}
      ${row('Phone', `<a href="tel:${esc(a.phone)}" style="color:${GULF};text-decoration:none;">${esc(a.phone)}</a>`)}
      ${row('Current city', esc(a.current_city))}
      ${row('City they&rsquo;d drive in', esc(a.city_of_interest))}
      ${a.invite_code ? row('Invite code', esc(a.invite_code)) : ''}
      ${row('Submitted', esc(submissionDate))}
    </table>
    ${card('What they drive', `<p style="margin:0;color:${INK2};font-family:${SERIF};font-style:italic;font-size:15px;line-height:1.6;">&ldquo;${esc(a.brief_intro)}&rdquo;</p>`)}
    ${btn('Open the admin dashboard', `${SITE}/admin`)}
  `;
  return baseEmailTemplate(content);
}

/** New waitlist signup (to team). */
export function adminWaitlistEmail(w: WaitlistData): string {
  const content = `
    ${h1('New waitlist signup')}
    <table role="presentation" width="100%" style="width:100%;border-collapse:collapse;margin:0 0 22px 0;">
      ${row('Email', `<a href="mailto:${esc(w.email)}" style="color:${GULF};text-decoration:none;">${esc(w.email)}</a>`)}
      ${row('City', esc(w.city || '·'))}
      ${row('Would drive', esc(w.desired_car || '·'))}
      ${row('Source', 'marketplace')}
    </table>
  `;
  return baseEmailTemplate(content);
}

/** New sponsor inquiry (to team). */
export function adminSponsorEmail(s: SponsorData, tierLabel: string): string {
  const content = `
    ${h1('New sponsor inquiry')}
    <table role="presentation" width="100%" style="width:100%;border-collapse:collapse;margin:0 0 22px 0;">
      ${row('Tier', esc(tierLabel))}
      ${row('Name', esc(s.name))}
      ${row('Company', esc(s.company || '·'))}
      ${row('Email', `<a href="mailto:${esc(s.email)}" style="color:${GULF};text-decoration:none;">${esc(s.email)}</a>`)}
      ${row('Phone', esc(s.phone || '·'))}
      ${row('Budget', esc(s.budget || '·'))}
    </table>
    ${s.message ? card('Message', `<p style="margin:0;color:${INK2};font-size:14.5px;line-height:1.65;">${esc(s.message)}</p>`) : ''}
  `;
  return baseEmailTemplate(content);
}
