'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

interface InstagramPost {
  id: string;
  post_url: string;
  image_url: string | null;
  caption: string | null;
  post_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function InstagramAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const storedPassword = sessionStorage.getItem('admin_password');
      if (!storedPassword) {
        router.push('/admin');
        return;
      }

      const response = await fetch('/api/admin/instagram', {
        headers: {
          Authorization: `Bearer ${storedPassword}`,
        },
      });

      if (response.status === 401) {
        router.push('/admin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError('Failed to load Instagram posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostUrl.trim()) return;

    setIsAdding(true);
    setError('');

    try {
      const storedPassword = sessionStorage.getItem('admin_password');
      if (!storedPassword) {
        router.push('/admin');
        return;
      }

      const response = await fetch('/api/admin/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedPassword}`,
        },
        body: JSON.stringify({
          post_url: newPostUrl,
          caption: newCaption.trim() || null,
        }),
      });

      if (response.status === 401) {
        router.push('/admin');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add post');
      }

      setNewPostUrl('');
      setNewCaption('');
      fetchPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to add post');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleActive = async (post: InstagramPost) => {
    try {
      const storedPassword = sessionStorage.getItem('admin_password');
      if (!storedPassword) {
        router.push('/admin');
        return;
      }

      const response = await fetch('/api/admin/instagram', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedPassword}`,
        },
        body: JSON.stringify({
          id: post.id,
          is_active: !post.is_active,
        }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Error toggling post:', err);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const storedPassword = sessionStorage.getItem('admin_password');
      if (!storedPassword) {
        router.push('/admin');
        return;
      }

      const response = await fetch(`/api/admin/instagram?id=${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${storedPassword}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-pure-white">Instagram Feed Manager</h2>
          <p className="text-metallic-silver mt-1">Manage posts displayed on your homepage</p>
        </div>
        <Button onClick={() => router.push('/admin')} variant="secondary">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Add New Post Form */}
      <Card className="bg-jet-grey border-gulf-blue/30">
        <h3 className="text-xl font-semibold text-pure-white mb-4">Add New Instagram Post</h3>
        <form onSubmit={handleAddPost} className="space-y-4">
          <div>
            <label htmlFor="postUrl" className="block text-sm font-medium text-pure-white mb-2">
              Instagram Post URL *
            </label>
            <Input
              id="postUrl"
              type="url"
              value={newPostUrl}
              onChange={(e) => setNewPostUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/ABC123..."
              required
            />
            <p className="text-xs text-metallic-silver mt-1">
              Paste the full Instagram post URL (works with posts and reels)
            </p>
          </div>

          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-pure-white mb-2">
              Caption (Optional)
            </label>
            <Input
              id="caption"
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Alt text or description"
            />
          </div>

          {error && (
            <div className="bg-performance-orange/20 border border-performance-orange/50 rounded-lg p-3 text-performance-orange text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isAdding || !newPostUrl.trim()}>
            {isAdding ? 'Adding...' : 'Add Post'}
          </Button>
        </form>
      </Card>

      {/* Posts List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-pure-white">
            Managed Posts ({posts.length})
          </h3>
          <Button onClick={fetchPosts} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {isLoading && posts.length === 0 ? (
          <div className="text-center py-12 text-metallic-silver">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-metallic-silver mb-4">No Instagram posts yet</p>
            <p className="text-sm text-metallic-silver">
              Add your first post using the form above
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className={`relative ${!post.is_active ? 'opacity-50' : ''}`}
              >
                {/* Image Preview */}
                {post.image_url ? (
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-graphite">
                    <img
                      src={post.image_url}
                      alt={post.caption || 'Instagram post'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-square mb-4 rounded-lg bg-graphite flex items-center justify-center">
                    <svg className="w-16 h-16 text-metallic-silver" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.is_active
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                    }`}
                  >
                    {post.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>

                {/* Post Info */}
                <div className="space-y-2 mb-4">
                  {post.caption && (
                    <p className="text-sm text-metallic-silver line-clamp-2">{post.caption}</p>
                  )}
                  <a
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gulf-blue hover:text-gulf-blue/80 break-all"
                  >
                    View on Instagram →
                  </a>
                  <p className="text-xs text-metallic-silver">
                    Added: {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToggleActive(post)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {post.is_active ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-midnight-blue/30 border-gulf-blue/20">
        <h3 className="text-lg font-semibold text-pure-white mb-3">📱 How It Works</h3>
        <ul className="space-y-2 text-sm text-metallic-silver">
          <li>• Copy any Instagram post or reel URL from your @driveexotiq account</li>
          <li>• Paste it into the form above and click "Add Post"</li>
          <li>• The post will appear on your homepage Instagram feed</li>
          <li>• Toggle "Hide/Show" to control visibility without deleting</li>
          <li>• Only active posts are shown to visitors</li>
          <li>• Posts are displayed in the order you add them (newest first)</li>
        </ul>
      </Card>
    </div>
  );
}





