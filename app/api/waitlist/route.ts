import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { waitlistSchema } from '@/lib/validations';

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

    // Honeypot — silently drop bots (fake success).
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = waitlistSchema.safeParse(body);
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
      .from('de_waitlist')
      .insert([
        {
          email: data.email.toLowerCase().trim(),
          city: data.city || null,
          desired_car: data.desiredCar || null,
          source: 'marketplace',
          consent_ip: ipAddress,
        },
      ])
      .select('id, email, created_at')
      .single();

    if (error) {
      // Unique violation (23505): the email is already on the list. Treat the
      // re-signup as idempotent success — same response as a fresh insert —
      // and return before the admin email so repeats never notify twice.
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('de_waitlist')
          .select('id, email, created_at')
          .eq('email', data.email.toLowerCase().trim())
          .maybeSingle();
        return NextResponse.json({ success: true, waitlist: existing }, { status: 201 });
      }
      console.error('Supabase waitlist insert error:', error);
      return NextResponse.json({ error: 'Failed to join the waitlist' }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      try {
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `Waitlist: ${esc(data.email)}${data.city ? ` · ${esc(data.city)}` : ''}`,
          html: `
            <h2>New exotiq.rent waitlist signup</h2>
            <p><strong>Email:</strong> ${esc(data.email)}</p>
            <p><strong>City:</strong> ${esc(data.city || '—')}</p>
            <p><strong>Would drive:</strong> ${esc(data.desiredCar || '—')}</p>
          `,
        });
      } catch (emailError) {
        console.error('Error sending waitlist notification:', emailError);
      }
    }

    return NextResponse.json({ success: true, waitlist: inserted }, { status: 201 });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
