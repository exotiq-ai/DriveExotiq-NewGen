import { isPreview } from '@/lib/preview';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { bookingLeadSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = bookingLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Validate the preview exercise, without storing a record or contacting providers.
    if (isPreview) {
      return NextResponse.json(
        { success: true, preview: true, lead: null },
        { status: 201 }
      );
    }

    const { firstName, lastName, email, phone, smsTransactionalConsent, smsMarketingConsent } = parsed.data;

    const userAgent = request.headers.get('user-agent') || null;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || null;
    const referer = request.headers.get('referer') || null;

    const utmSource = body.utm_source || null;
    const utmMedium = body.utm_medium || null;
    const utmCampaign = body.utm_campaign || null;

    const fleetSlug = body.fleet_slug || null;

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('de_booking_leads')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase().trim(),
          phone,
          status: 'lead',
          location: body.location || 'phoenix',
          fleet_slug: fleetSlug,
          source_page: body.source_page || referer,
          session_id: body.session_id || null,
          ip_address: ipAddress,
          user_agent: userAgent,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          referrer_url: referer,
          sms_transactional_consent: smsTransactionalConsent || false,
          sms_marketing_consent: smsMarketingConsent || false,
          consent_timestamp: (smsTransactionalConsent || smsMarketingConsent)
            ? new Date().toISOString()
            : null,
          consent_ip: (smsTransactionalConsent || smsMarketingConsent)
            ? ipAddress
            : null,
        },
      ])
      .select('id, first_name, email, status')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save booking lead' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, lead: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking lead API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
