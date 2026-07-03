/**
 * Email Templates for Drive Exotiq
 * Professional, branded HTML email templates
 */

export interface ApplicationData {
  full_name: string;
  email: string;
  phone: string;
  current_city: string;
  city_of_interest: string;
  brief_intro: string;
  invite_code?: string | null;
  created_at?: string;
}

/**
 * Base email template with Drive Exotiq branding
 */
function baseEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drive Exotiq</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #C0C0C0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1B1B1B; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6EC1E4 0%, #0A1929 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                DRIVE EXOTIQ
              </h1>
              <p style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 14px; opacity: 0.9;">
                Where Precision Meets Passion
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #0A1929; border-top: 1px solid rgba(192, 192, 192, 0.1); text-align: center;">
              <p style="margin: 0 0 16px 0; color: #C0C0C0; font-size: 14px;">
                Follow us on <a href="https://www.instagram.com/driveexotiq" style="color: #6EC1E4; text-decoration: none;">Instagram</a>
              </p>
              <p style="margin: 0; color: #C0C0C0; font-size: 12px; opacity: 0.7;">
                © 2025 Drive Exotiq. All rights reserved.
              </p>
              <p style="margin: 8px 0 0 0; color: #C0C0C0; font-size: 12px; opacity: 0.7;">
                <a href="mailto:hello@exotiq.ai" style="color: #6EC1E4; text-decoration: none;">hello@exotiq.ai</a>
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

/**
 * Application Confirmation Email (to applicant)
 */
export function applicationConfirmationEmail(application: ApplicationData): string {
  const submissionDate = application.created_at 
    ? new Date(application.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
      Thank You for Your Application! 🚗
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Hi ${application.full_name},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      We've received your application to join Drive Exotiq and are excited to review it. Thank you for your interest in our exclusive community of exotic car enthusiasts.
    </p>
    
    <div style="background-color: #0A1929; border-left: 3px solid #6EC1E4; padding: 20px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px 0; color: #FFFFFF; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #C0C0C0; font-size: 15px; line-height: 1.8;">
        <li>Our team will review your application within <strong style="color: #6EC1E4;">7-14 business days</strong></li>
        <li>We'll notify you via email once a decision has been made</li>
        <li>In the meantime, follow us on <a href="https://www.instagram.com/driveexotiq" style="color: #6EC1E4; text-decoration: none;">Instagram</a> for community updates</li>
      </ul>
    </div>
    
    <div style="background-color: #0A1929; padding: 20px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px 0; color: #FFFFFF; font-size: 16px; font-weight: 600;">
        Your Application Details:
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #C0C0C0; font-size: 14px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">City of Interest:</strong>
          </td>
          <td style="padding: 8px 0; color: #6EC1E4; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            ${application.city_of_interest}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #C0C0C0; font-size: 14px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Submitted:</strong>
          </td>
          <td style="padding: 8px 0; color: #6EC1E4; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            ${submissionDate}
          </td>
        </tr>
      </table>
    </div>
    
    <p style="margin: 24px 0 0 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Questions? Reply to this email or reach out to us at <a href="mailto:hello@exotiq.ai" style="color: #6EC1E4; text-decoration: none;">hello@exotiq.ai</a>
    </p>
    
    <p style="margin: 24px 0 0 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong style="color: #FFFFFF;">The Drive Exotiq Team</strong>
    </p>
  `;

  return baseEmailTemplate(content);
}

/**
 * Admin Notification Email (to team)
 */
export function adminNotificationEmail(application: ApplicationData): string {
  const submissionDate = application.created_at 
    ? new Date(application.created_at).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
      🎯 New Application Received
    </h2>
    
    <div style="background-color: #0A1929; padding: 24px; margin: 20px 0; border-radius: 4px; border-left: 3px solid #6EC1E4;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Name:</strong>
          </td>
          <td style="padding: 10px 0; color: #6EC1E4; font-size: 15px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            ${application.full_name}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Email:</strong>
          </td>
          <td style="padding: 10px 0; color: #6EC1E4; font-size: 15px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <a href="mailto:${application.email}" style="color: #6EC1E4; text-decoration: none;">${application.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Phone:</strong>
          </td>
          <td style="padding: 10px 0; color: #6EC1E4; font-size: 15px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <a href="tel:${application.phone}" style="color: #6EC1E4; text-decoration: none;">${application.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Current City:</strong>
          </td>
          <td style="padding: 10px 0; color: #6EC1E4; font-size: 15px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            ${application.current_city}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">City of Interest:</strong>
          </td>
          <td style="padding: 10px 0; color: #6EC1E4; font-size: 15px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            ${application.city_of_interest}
          </td>
        </tr>
        ${application.invite_code ? `
        <tr>
          <td style="padding: 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Invite Code:</strong>
          </td>
          <td style="padding: 10px 0; color: #6EC1E4; font-size: 15px; text-align: right; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            ${application.invite_code}
          </td>
        </tr>
        ` : ''}
        <tr>
          <td colspan="2" style="padding: 16px 0 10px 0; color: #C0C0C0; font-size: 15px; border-bottom: 1px solid rgba(192, 192, 192, 0.1);">
            <strong style="color: #FFFFFF;">Why Drive Exotiq:</strong>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px 0; color: #C0C0C0; font-size: 15px; line-height: 1.6; font-style: italic;">
            "${application.brief_intro}"
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0 10px 0; color: #C0C0C0; font-size: 15px;">
            <strong style="color: #FFFFFF;">Submitted:</strong>
          </td>
          <td style="padding: 16px 0 10px 0; color: #6EC1E4; font-size: 15px; text-align: right;">
            ${submissionDate}
          </td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com'}/admin" 
         style="display: inline-block; padding: 14px 32px; background-color: #6EC1E4; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        View in Admin Dashboard →
      </a>
    </div>
  `;

  return baseEmailTemplate(content);
}

/**
 * Approval Email (to applicant)
 */
export function approvalEmail(application: ApplicationData): string {
  const content = `
    <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
      Congratulations! 🎉
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Hi ${application.full_name},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Great news! Your application to Drive Exotiq has been <strong style="color: #6EC1E4;">approved</strong>. Welcome to the community!
    </p>
    
    <div style="background-color: #0A1929; border-left: 3px solid #6EC1E4; padding: 20px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px 0; color: #FFFFFF; font-size: 16px; font-weight: 600;">
        Next Steps:
      </p>
      <ol style="margin: 0; padding-left: 20px; color: #C0C0C0; font-size: 15px; line-height: 1.8;">
        <li>Complete your profile setup</li>
        <li>Browse available exotic cars in <strong style="color: #6EC1E4;">${application.city_of_interest}</strong></li>
        <li>Book your first experience</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com'}" 
         style="display: inline-block; padding: 14px 32px; background-color: #6EC1E4; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Get Started →
      </a>
    </div>
    
    <p style="margin: 24px 0 0 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      We're excited to have you join us. If you have any questions, don't hesitate to reach out.
    </p>
    
    <p style="margin: 24px 0 0 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong style="color: #FFFFFF;">The Drive Exotiq Team</strong>
    </p>
  `;

  return baseEmailTemplate(content);
}

/**
 * Rejection Email (to applicant) - Graceful and professional
 */
export function rejectionEmail(application: ApplicationData): string {
  const content = `
    <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
      Update on Your Application
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Hi ${application.full_name},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Thank you for your interest in joining Drive Exotiq. After careful review, we're unable to approve your application at this time.
    </p>
    
    <p style="margin: 0 0 20px 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      We'd love to keep you updated on future opportunities. Would you like to join our waitlist? We'll notify you when new spots become available in <strong style="color: #6EC1E4;">${application.city_of_interest}</strong>.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com'}/waitlist" 
         style="display: inline-block; padding: 14px 32px; background-color: #6EC1E4; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Join Waitlist →
      </a>
    </div>
    
    <p style="margin: 24px 0 0 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      You're welcome to reapply in 6 months. We appreciate your understanding.
    </p>
    
    <p style="margin: 24px 0 0 0; color: #C0C0C0; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong style="color: #FFFFFF;">The Drive Exotiq Team</strong>
    </p>
  `;

  return baseEmailTemplate(content);
}


