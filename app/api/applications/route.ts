import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { applicationSchema } from '@/lib/validations';
import { sendNewApplicationEmails } from '@/lib/email-send';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: a real user never fills the hidden `website` field. Silently
    // accept (so bots don't learn) but do nothing — no insert, no email.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || null;

    const supabase = getSupabaseAdmin();

    const { data: insertedData, error } = await supabase
      .from('de_applications')
      .insert([
        {
          full_name: data.fullName,
          email: data.email.toLowerCase().trim(),
          phone: data.phone,
          current_city: data.currentCity,
          city_of_interest: data.cityOfInterest,
          interest: data.interest,
          brief_intro: data.briefIntro,
          invite_code: data.inviteCode || null,
          sms_transactional_consent: data.smsTransactionalConsent || false,
          sms_marketing_consent: data.smsMarketingConsent || false,
          consent_timestamp: (data.smsTransactionalConsent || data.smsMarketingConsent)
            ? new Date().toISOString()
            : null,
          consent_ip: (data.smsTransactionalConsent || data.smsMarketingConsent)
            ? ipAddress
            : null,
        },
      ])
      .select('id, full_name, email, created_at')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      );
    }

    // Server-only, never throws — safe to await without guarding the response.
    await sendNewApplicationEmails({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      current_city: data.currentCity,
      city_of_interest: data.cityOfInterest,
      interest: data.interest,
      brief_intro: data.briefIntro,
      invite_code: data.inviteCode || null,
      created_at: insertedData?.created_at || new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, application: insertedData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Application API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
