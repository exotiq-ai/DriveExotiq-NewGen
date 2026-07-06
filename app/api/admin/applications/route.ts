import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendStatusUpdateEmails } from '@/lib/email-send';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

// Simple auth check
function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || !expectedPassword) {
    return false;
  }

  const providedPassword = authHeader.replace('Bearer ', '');
  return providedPassword === expectedPassword;
}

// GET all applications
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('de_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// PATCH update application status
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Get current application to check if status changed
    const { data: currentApp } = await supabaseAdmin
      .from('de_applications')
      .select('status')
      .eq('id', id)
      .single();

    const oldStatus = currentApp?.status;

    // Update application
    const { data, error } = await supabaseAdmin
      .from('de_applications')
      .update({
        status,
        notes: notes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send status update email if status changed to approved or rejected
    if (oldStatus !== status && (status === 'approved' || status === 'rejected')) {
      // Server-only, never throws.
      await sendStatusUpdateEmails({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        current_city: data.current_city,
        city_of_interest: data.city_of_interest,
        brief_intro: data.brief_intro,
        invite_code: data.invite_code,
        created_at: data.created_at,
        status: data.status,
      });
    }

    return NextResponse.json({ application: data });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
