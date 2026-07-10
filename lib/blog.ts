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
  /** Brands/entities named in the post — front-matter `mentions: Name|url; Name|url`.
      Feeds BlogPosting JSON-LD `mentions` so brand tags carry structured-data weight. */
  mentions: { name: string; url: string }[];
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

/**
 * Drop a leading `# Title` line from the body. The frontmatter title renders
 * as the page's single h1, so a markdown h1 at the top would duplicate it.
 */
function stripLeadingH1(body: string): string {
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && /^#\s/.test(lines[i].trim())) {
    return lines.slice(i + 1).join('\n');
  }
  return body;
}

function readTimeFor(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function fileToPost(file: string): BlogPost | null {
  const full = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(full, 'utf8');
  const { meta, body: rawBody } = parseFrontMatter(raw);
  const body = stripLeadingH1(rawBody);
  const title = meta.title;
  if (!title) return null;
  const slug = meta.slug || file.replace(/\.md$/, '');
  const dek = meta.metadescription || meta['meta description'] || '';
  const category = meta.category || meta.pillar || 'Stories';
  const author = meta.author || 'Drive Exotiq';
  const date = meta.date || null;
  const mentions = (meta.mentions || '')
    .split(';')
    .map((entry) => {
      const [name, url] = entry.split('|').map((s) => s.trim());
      return name && url ? { name, url } : null;
    })
    .filter((m): m is { name: string; url: string } => m !== null);
  return {
    slug,
    title,
    dek,
    category,
    author,
    date,
    readTime: readTimeFor(body),
    html: marked.parse(body, { async: false }) as string,
    mentions,
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
