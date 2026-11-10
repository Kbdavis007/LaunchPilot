import { z } from 'zod';

export const ROADMAP_PHASES = [
  'Phase 0',
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Phase 4',
  'Phase 5',
  'Phase 6',
  'Phase 7',
] as const;

export const blogAuthorSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  handle: z.string().min(1),
  avatar: z.string().min(1).optional(),
});

/**
 * Frontmatter envelope from OpenSpec Module F §2.
 * Invalid frontmatter throws at compile time via the post registry.
 */
export const blogPostFrontmatterSchema = z.object({
  title: z.string().min(1).max(140),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phase: z.enum(ROADMAP_PHASES),
  target_outcomes: z.array(z.string().min(1)).min(2).max(4),
  author: blogAuthorSchema,
  summary: z.string().min(80).max(240),
  tags: z.array(z.string().min(1)).min(1),
  reading_time_minutes: z.number().int().positive(),
});

export type BlogPostFrontmatter = z.infer<typeof blogPostFrontmatterSchema>;

export const parseFrontmatter = (input: unknown): BlogPostFrontmatter =>
  blogPostFrontmatterSchema.parse(input);
