import React from 'react';
import type { BlogPostRecord } from '../../blog/post-registry';
import { mdxComponents } from '../../blog/mdx-components';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

interface MdxPostViewerProps {
  post: BlogPostRecord;
  onBack?: () => void;
}

/**
 * Renders a compiled MDX post. Interactive widgets are hydrated through the
 * whitelisted component registry (OpenSpec Module F §3) rather than parsed by hand.
 */
export const MdxPostViewer: React.FC<MdxPostViewerProps> = ({ post, onBack }) => {
  const { frontmatter, Component } = post;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Dispatches</span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{frontmatter.phase}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{frontmatter.date}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{frontmatter.reading_time_minutes} min read</span>
        <span aria-hidden="true">·</span>
        <span>{frontmatter.author.name}</span>
      </div>

      <h1
        className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight mb-4"
        style={{ textWrap: 'balance' }}
      >
        {frontmatter.title}
      </h1>

      <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-normal">
        {frontmatter.summary}
      </p>

      <div className="mb-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-2.5">
          Milestone Target Outcomes
        </div>
        <div className="space-y-1.5">
          {frontmatter.target_outcomes.map((outcome) => (
            <div key={outcome} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span>{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-none">
        <Component components={mdxComponents} />
      </div>

      <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <span>Categories:</span>
          {frontmatter.tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">{tag}</span>
              {idx < frontmatter.tags.length - 1 && <span aria-hidden="true">·</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="font-mono text-[11px] text-neutral-400">
          Source: content/posts/{post.slug}.mdx
        </div>
      </div>
    </article>
  );
};
