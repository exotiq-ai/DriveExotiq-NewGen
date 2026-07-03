import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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

// Extract Instagram post ID and image URL from post URL
function parseInstagramUrl(url: string) {
  try {
    // Match Instagram post URLs
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    ];

    let postId = null;
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        postId = match[1];
        break;
      }
    }

    if (!postId) {
      return { postId: null, embedUrl: null };
    }

    // Create embed URL for thumbnail
    const embedUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

    return { postId, embedUrl };
  } catch (error) {
    return { postId: null, embedUrl: null };
  }
}

// GET all Instagram posts
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('de_instagram_posts')
      .select('*')
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST create new Instagram post
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { post_url, caption } = body;

    if (!post_url) {
      return NextResponse.json({ error: 'Post URL is required' }, { status: 400 });
    }

    // Parse Instagram URL
    const { postId, embedUrl } = parseInstagramUrl(post_url);

    if (!postId) {
      return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('de_instagram_posts')
      .insert({
        post_url,
        image_url: embedUrl,
        caption: caption || null,
        post_id: postId,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error('Error creating Instagram post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// PATCH update Instagram post
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, is_active, display_order, caption } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (typeof is_active !== 'undefined') updates.is_active = is_active;
    if (typeof display_order !== 'undefined') updates.display_order = display_order;
    if (typeof caption !== 'undefined') updates.caption = caption;

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('de_instagram_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
  } catch (error) {
    console.error('Error updating Instagram post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE Instagram post
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('de_instagram_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Instagram post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}





