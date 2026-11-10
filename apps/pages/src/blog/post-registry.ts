import type { MDXComponents } from 'mdx/types';
import type { ComponentType } from 'react';
import { parseFrontmatter, type BlogPostFrontmatter } from './frontmatter.schema';

interface MdxModule {
  readonly default: ComponentType<{ components?: MDXComponents }>;
  readonly frontmatter?: unknown;
}

export interface BlogPostRecord {
  readonly slug: string;
  readonly Component: ComponentType<{ components?: MDXComponents }>;
  readonly frontmatter: BlogPostFrontmatter;
}

const modules = import.meta.glob<MdxModule>('../../../../content/posts/*.mdx', { eager: true });

const toSlug = (modulePath: string): string =>
  (modulePath.split('/').pop() ?? modulePath).replace(/\.mdx$/, '');

/** Compiled MDX posts, validated against the Module F frontmatter schema at module load. */
export const BLOG_POSTS: readonly BlogPostRecord[] = Object.entries(modules)
  .map(([modulePath, module]) => ({
    slug: toSlug(modulePath),
    Component: module.default,
    frontmatter: parseFrontmatter(module.frontmatter ?? {}),
  }))
  .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));

export const findPost = (slug: string): BlogPostRecord | undefined =>
  BLOG_POSTS.find((post) => post.slug === slug);

export const allTags = (): string[] => [
  'All',
  ...Array.from(new Set(BLOG_POSTS.flatMap((post) => [...post.frontmatter.tags]))),
];
