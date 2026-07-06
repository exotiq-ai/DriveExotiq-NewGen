import 'server-only';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

/**
 * Stories loader. Reads finished posts from content/blog/*.md — front-matter is
 * a leading HTML comment of `key: value` lines (see content/blog/README.md).
 * Returns an empty list when no posts have landed yet, so the index degrades to
 * a clean "coming soon" state rather than erroring.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  date: string | null;
  readTime: string;
  html: string;
}

function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^\s*<!--([\s\S]*?)-->/);
  const meta: Record<string, string> = {};
  let body = raw;
  if (match) {
    for (const line of match[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      if (key) meta[key] = value;
    }
    body = raw.slice(match[0].length);
  }
  return { meta, body };
}

function readTimeFor(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function fileToPost(file: string): BlogPost | null {
  const full = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(full, 'utf8');
  const { meta, body } = parseFrontMatter(raw);
  const title = meta.title;
  if (!title) return null;
  const slug = meta.slug || file.replace(/\.md$/, '');
  const dek = meta.metadescription || meta['meta description'] || '';
  const category = meta.category || meta.pillar || 'Stories';
  const author = meta.author || 'Drive Exotiq';
  const date = meta.date || null;
  return {
    slug,
    title,
    dek,
    category,
    author,
    date,
    readTime: readTimeFor(body),
    html: marked.parse(body, { async: false }) as string,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .map(fileToPost)
    .filter((p): p is BlogPost => p !== null);
  // Newest first when dates exist; otherwise stable by title.
  return posts.sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : -1;
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) || null;
}
