import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { parse as parseYaml } from 'yaml';

const SITE_URL = 'https://launchpilot.dev';
const SITE_TITLE = 'LaunchPilot & SaaS Pass Engineering Blog';
const SITE_DESCRIPTION =
  'Engineering dispatches on serverless edge architecture, OpenSpec contracts, and autonomous delivery for solo founders.';

interface FeedPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  author: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function readPosts(contentDir: string): FeedPost[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
      const frontmatter = match ? (parseYaml(match[1]) as Record<string, unknown>) : {};
      const author = (frontmatter.author ?? {}) as Record<string, string>;
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: String(frontmatter.title ?? file),
        date: String(frontmatter.date ?? '1970-01-01'),
        summary: String(frontmatter.summary ?? ''),
        tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [],
        author: author.name ?? 'LaunchPilot Core Architecture Team',
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function renderRss(posts: FeedPost[]): string {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
      <description>${escapeXml(post.summary)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-US</language>
${items}
  </channel>
</rss>
`;
}

function renderAtom(posts: FeedPost[]): string {
  const updated = posts[0] ? new Date(`${posts[0].date}T00:00:00Z`).toISOString() : new Date().toISOString();
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}" />
    <id>${SITE_URL}/blog/${post.slug}</id>
    <updated>${new Date(`${post.date}T00:00:00Z`).toISOString()}</updated>
    <author><name>${escapeXml(post.author)}</name></author>
    <summary>${escapeXml(post.summary)}</summary>
${post.tags.map((tag) => `    <category term="${escapeXml(tag)}" />`).join('\n')}
  </entry>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${SITE_URL}/atom.xml" rel="self" />
  <link href="${SITE_URL}/blog" />
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
${entries}
</feed>
`;
}

function syndicationFeeds(): Plugin {
  const contentDir = path.resolve(import.meta.dirname, '../../content/posts');
  const assets = (): Record<string, string> => {
    const posts = readPosts(contentDir);
    return { 'feed.xml': renderRss(posts), 'atom.xml': renderAtom(posts) };
  };
  return {
    name: 'launchpilot-syndication-feeds',
    generateBundle() {
      const emitted = assets();
      for (const [fileName, source] of Object.entries(emitted)) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (!url.endsWith('feed.xml') && !url.endsWith('atom.xml')) {
          next();
          return;
        }
        const fileName = url.endsWith('atom.xml') ? 'atom.xml' : 'feed.xml';
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.end(assets()[fileName]);
      });
    },
  };
}

export default defineConfig(() => ({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
    tailwindcss(),
    syndicationFeeds(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, "src"),
      '@/domain': path.resolve(import.meta.dirname, "../worker/src/modules"),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    allowedHosts: ['.all-hands.dev', 'localhost'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
