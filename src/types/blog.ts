export interface Author {
  name: string;
  role: string;
  avatar?: string;
  handle: string;
}

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  phase: string;
  target_outcomes: string[];
  author: Author;
  summary: string;
  tags: string[];
  reading_time_minutes: number;
}

export interface BlogPost {
  slug: string;
  filePath: string;
  frontmatter: BlogPostFrontmatter;
  rawMdx: string;
}
