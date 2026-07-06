import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sponsorInquirySchema, SPONSOR_TIER_LABEL, SponsorTier } from '@/lib/sponsor';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@exotiq.ai';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Drive Exotiq <hello@exotiq.ai>';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const esc = (s: string) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: a real user never fills the hidden `website` field. Silently
    // accept (so bots don't learn) but do nothing — no insert, no email.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = sponsorInquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;

    const supabase = getSupabaseAdmin();
    const { data: inserted, error } = await supabase
      .from('de_sponsor_inquiries')
      .insert([
        {
          name: data.name,
          company: data.company || null,
          email: data.email.toLowerCase().trim(),
          phone: data.phone || null,
          interest: data.interest,
          budget: data.budget || null,
          message: data.message || null,
          consent_ip: ipAddress,
        },
      ])
      .select('id, name, email, created_at')
      .single();

    if (error) {
      console.error('Supabase sponsor insert error:', error);
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    // Admin notification (awaited; failures are isolated, never break the insert).
    if (process.env.RESEND_API_KEY) {
      try {
        const tier = SPONSOR_TIER_LABEL[data.interest as SponsorTier] || 'Not sure yet';
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `Sponsor — ${tier}: ${data.name}${data.company ? ` · ${data.company}` : ''}`,
          html: `
            <h2>New sponsor inquiry</h2>
            <p><strong>Tier:</strong> ${esc(tier)}</p>
            <p><strong>Name:</strong> ${esc(data.name)}</p>
            <p><strong>Company:</strong> ${esc(data.company || '—')}</p>
            <p><strong>Email:</strong> ${esc(data.email)}</p>
            <p><strong>Phone:</strong> ${esc(data.phone || '—')}</p>
            <p><strong>Budget:</strong> ${esc(data.budget || '—')}</p>
            <p><strong>Message:</strong><br>${esc(data.message || '—')}</p>
          `,
        });
      } catch (emailError) {
        console.error('Error sending sponsor notification:', emailError);
      }
    }

    return NextResponse.json({ success: true, inquiry: inserted }, { status: 201 });
  } catch (error) {
    console.error('Sponsor inquiry API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
