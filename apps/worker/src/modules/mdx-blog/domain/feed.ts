import type { BlogPost } from './blog-post.entity';

export const BLOG_TITLE = 'LaunchPilot & SaaS Pass Engineering Blog';
export const BLOG_DESCRIPTION =
  'Engineering dispatches on serverless edge architecture, OpenSpec contracts, and autonomous delivery for solo founders.';
export const BLOG_LANGUAGE = 'en-US';

const XML_ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

export const escapeXml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);

const asDate = (iso: string): Date => {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
};

/** RFC 822 publication date required by RSS 2.0. */
export const toRfc822 = (iso: string): string => asDate(iso).toUTCString();

export const toIsoTimestamp = (iso: string): string => asDate(iso).toISOString();

export interface FeedChannel {
  readonly siteUrl: string;
  readonly title: string;
  readonly description: string;
  readonly language: string;
}

export const renderRss = (channel: FeedChannel, posts: readonly BlogPost[]): string => {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.canonicalUrl)}</link>
      <guid isPermaLink="true">${escapeXml(post.canonicalUrl)}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <dc:creator>${escapeXml(post.author.name)}</dc:creator>
      <description>${escapeXml(post.summary)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.siteUrl)}/blog</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
${items}
  </channel>
</rss>
`;
};

export const renderAtom = (channel: FeedChannel, posts: readonly BlogPost[]): string => {
  const updated = posts[0] !== undefined ? toIsoTimestamp(posts[0].date) : new Date(0).toISOString();
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(post.canonicalUrl)}" />
    <id>${escapeXml(post.canonicalUrl)}</id>
    <updated>${toIsoTimestamp(post.date)}</updated>
    <author><name>${escapeXml(post.author.name)}</name></author>
    <summary>${escapeXml(post.summary)}</summary>
${post.tags.map((tag) => `    <category term="${escapeXml(tag)}" />`).join('\n')}
  </entry>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(channel.title)}</title>
  <link href="${escapeXml(channel.siteUrl)}/atom.xml" rel="self" />
  <link href="${escapeXml(channel.siteUrl)}/blog" />
  <id>${escapeXml(channel.siteUrl)}/</id>
  <updated>${updated}</updated>
  <subtitle>${escapeXml(channel.description)}</subtitle>
${entries}
</feed>
`;
};
