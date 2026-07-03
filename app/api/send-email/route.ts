import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  applicationConfirmationEmail,
  adminNotificationEmail,
  approvalEmail,
  rejectionEmail,
  ApplicationData,
} from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@exotiq.ai';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Drive Exotiq <hello@exotiq.ai>';

/**
 * POST /api/send-email
 * Sends automated emails based on application events
 * 
 * Body:
 * {
 *   type: 'new_application' | 'status_update',
 *   application: ApplicationData,
 *   oldStatus?: 'pending' | 'approved' | 'rejected'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, application, oldStatus } = body;

    if (!type || !application) {
      return NextResponse.json(
        { error: 'Missing required fields: type and application' },
        { status: 400 }
      );
    }

    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      // Don't fail the request, just log the error
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    let results = [];

    if (type === 'new_application') {
      // Send confirmation to applicant
      try {
        const applicantResult = await getResend().emails.send({
          from: FROM_EMAIL,
          to: application.email,
          subject: 'We received your Drive Exotiq application! 🚗',
          html: applicationConfirmationEmail(application),
        });

        results.push({
          type: 'applicant_confirmation',
          success: true,
          emailId: applicantResult.data?.id,
        });
      } catch (error: any) {
        console.error('Error sending applicant confirmation:', error);
        results.push({
          type: 'applicant_confirmation',
          success: false,
          error: error.message,
        });
      }

      // Send notification to admin
      try {
        const adminResult = await getResend().emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New Application: ${application.full_name} - ${application.city_of_interest}`,
          html: adminNotificationEmail(application),
        });

        results.push({
          type: 'admin_notification',
          success: true,
          emailId: adminResult.data?.id,
        });
      } catch (error: any) {
        console.error('Error sending admin notification:', error);
        results.push({
          type: 'admin_notification',
          success: false,
          error: error.message,
        });
      }
    } else if (type === 'status_update') {
      // Status changed (approved/rejected)
      if (application.status === 'approved') {
        try {
          const approvalResult = await getResend().emails.send({
            from: FROM_EMAIL,
            to: application.email,
            subject: 'Welcome to Drive Exotiq! 🎉',
            html: approvalEmail(application),
          });

          results.push({
            type: 'approval',
            success: true,
            emailId: approvalResult.data?.id,
          });
        } catch (error: any) {
          console.error('Error sending approval email:', error);
          results.push({
            type: 'approval',
            success: false,
            error: error.message,
          });
        }
      } else if (application.status === 'rejected') {
        try {
          const rejectionResult = await getResend().emails.send({
            from: FROM_EMAIL,
            to: application.email,
            subject: 'Update on your Drive Exotiq application',
            html: rejectionEmail(application),
          });

          results.push({
            type: 'rejection',
            success: true,
            emailId: rejectionResult.data?.id,
          });
        } catch (error: any) {
          console.error('Error sending rejection email:', error);
          results.push({
            type: 'rejection',
            success: false,
            error: error.message,
          });
        }
      }
    } else {
      return NextResponse.json(
        { error: `Invalid type: ${type}. Must be 'new_application' or 'status_update'` },
        { status: 400 }
      );
    }

    // Return success if at least one email succeeded
    const hasSuccess = results.some((r) => r.success);
    
    return NextResponse.json({
      success: hasSuccess,
      results,
    }, { status: hasSuccess ? 200 : 500 });
  } catch (error: any) {
    console.error('Error in send-email route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}


