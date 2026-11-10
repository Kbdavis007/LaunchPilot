import type { BlogPost, RoadmapPhase } from '../domain/blog-post.entity';

interface BlogPostRow {
  readonly slug: string;
  readonly title: string;
  readonly published_at: string;
  readonly phase: RoadmapPhase;
  readonly target_outcomes: string;
  readonly author_name: string;
  readonly author_role: string;
  readonly author_handle: string;
  readonly summary: string;
  readonly tags: string;
  readonly reading_time_minutes: number;
}

export interface BlogRepository {
  listPublished(limit: number): Promise<BlogPost[]>;
}

const parseJsonArray = (value: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

/** D1 adapter for blog metadata (parameterized statements only). */
export const createD1BlogRepository = (db: D1Database, siteUrl: string): BlogRepository => ({
  async listPublished(limit: number): Promise<BlogPost[]> {
    const { results } = await db
      .prepare(
        'SELECT slug, title, published_at, phase, target_outcomes, author_name, author_role, author_handle, summary, tags, reading_time_minutes FROM blog_posts WHERE published = 1 ORDER BY published_at DESC LIMIT ?'
      )
      .bind(limit)
      .all<BlogPostRow>();

    return results.map((row) => ({
      slug: row.slug,
      canonicalUrl: `${siteUrl}/blog/${row.slug}`,
      title: row.title,
      date: row.published_at,
      phase: row.phase,
      targetOutcomes: parseJsonArray(row.target_outcomes),
      author: { name: row.author_name, role: row.author_role, handle: row.author_handle },
      summary: row.summary,
      tags: parseJsonArray(row.tags),
      readingTimeMinutes: row.reading_time_minutes,
    }));
  },
});
