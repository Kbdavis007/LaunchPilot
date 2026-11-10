/** OpenSpec Module F — file-backed MDX blog post metadata. */

export type RoadmapPhase =
  | 'Phase 0'
  | 'Phase 1'
  | 'Phase 2'
  | 'Phase 3'
  | 'Phase 4'
  | 'Phase 5'
  | 'Phase 6'
  | 'Phase 7';

export interface BlogAuthor {
  readonly name: string;
  readonly role: string;
  readonly handle: string;
  readonly avatar?: string;
}

export interface BlogPostFrontmatter {
  readonly title: string;
  readonly date: string;
  readonly phase: RoadmapPhase;
  readonly targetOutcomes: readonly string[];
  readonly author: BlogAuthor;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly readingTimeMinutes: number;
}

export interface BlogPost extends BlogPostFrontmatter {
  readonly slug: string;
  readonly canonicalUrl: string;
}
