import React from 'react';
import { BlogPost } from '../../types/blog';
import { WtpCalculator } from '../widgets/WtpCalculator';
import { RoadmapTimeline } from '../widgets/RoadmapTimeline';
import { TelemetryChart } from '../widgets/TelemetryChart';
import { Calendar, Clock, User, CheckCircle2, Tag, ArrowLeft } from 'lucide-react';

interface MdxPostViewerProps {
  post: BlogPost;
  onBack?: () => void;
}

export const MdxPostViewer: React.FC<MdxPostViewerProps> = ({ post, onBack }) => {
  const { frontmatter, rawMdx } = post;

  // Render prose blocks and embed interactive React widgets when tags appear
  const renderContent = () => {
    // Split content by our known component tags
    const parts = rawMdx.split(/(<WtpCalculator[^/]*\/>|<RoadmapTimeline[^/]*\/>|<TelemetryChart[^/]*\/>)/g);

    return parts.map((part, index) => {
      const trimmed = part.trim();
      if (trimmed.startsWith('<WtpCalculator')) {
        return (
          <WtpCalculator
            key={index}
            defaultPersona="solo_hacker"
            initialPainScore={8}
            defaultMonthlyPrice={29}
            interactive={true}
            headline="Live Willingness-to-Pay (WTP) Scorecard"
          />
        );
      }
      if (trimmed.startsWith('<RoadmapTimeline')) {
        return (
          <RoadmapTimeline
            key={index}
            activePhase={frontmatter.phase}
            expandable={true}
            variant="detailed"
          />
        );
      }
      if (trimmed.startsWith('<TelemetryChart')) {
        return (
          <TelemetryChart
            key={index}
            primaryMetric="all"
            refreshIntervalSeconds={5}
            telemetrySource="edge_benchmark"
          />
        );
      }

      // Render standard markdown prose
      return <div key={index}>{renderMarkdownSection(part)}</div>;
    });
  };

  // Simple clean markdown parser for prose, headings, code blocks, tables, lists
  const renderMarkdownSection = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(2); // skip separator
        elements.push(
          <div key={key} className="my-6 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="p-3">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono text-neutral-700 dark:text-neutral-300">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3">
                        {cell.trim().replace(/\*\*(.*?)\*\*/g, '$1')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          codeContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} className="my-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <div className="bg-neutral-100 dark:bg-neutral-800/70 px-4 py-1.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 flex justify-between">
                <span>{codeLanguage || 'text'}</span>
                <span>OpenSpec Specification Block</span>
              </div>
              <pre className="p-4 bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{codeContent.join('\n')}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Markdown tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cells = line.split('|').slice(1, -1);
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable(`table-${i}`);
      }

      // Headers
      if (line.startsWith('# ')) {
        // Skip root h1 if already in title, or render
        continue;
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-10 mb-4"
            style={{ textWrap: 'balance' }}
          >
            {line.replace('## ', '')}
          </h2>
        );
        continue;
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-base sm:text-lg font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 mt-6 mb-2"
          >
            {line.replace('### ', '')}
          </h3>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-5 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 italic text-sm leading-relaxed"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
        continue;
      }

      // Bullet lists
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const bulletText = line.substring(2);
        elements.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2.5 my-1.5 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-2 shrink-0" />
            <span>
              {bulletText.split('**').map((part, pIdx) =>
                pIdx % 2 === 1 ? (
                  <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </span>
          </div>
        );
        continue;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)/);
        if (match) {
          const num = match[1];
          const text = match[2];
          elements.push(
            <div key={`num-${i}`} className="flex items-start gap-3 my-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 shrink-0">
                {num}.
              </span>
              <span>
                {text.split('**').map((part, pIdx) =>
                  pIdx % 2 === 1 ? (
                    <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </span>
            </div>
          );
          continue;
        }
      }

      // Dividers
      if (line.trim() === '---') {
        elements.push(<hr key={`hr-${i}`} className="my-8 border-neutral-200 dark:border-neutral-800" />);
        continue;
      }

      // Standard paragraphs
      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`} className="my-3 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {line.split('**').map((part, pIdx) =>
              pIdx % 2 === 1 ? (
                <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
    }

    if (inTable) {
      flushTable('table-end');
    }

    return elements;
  };

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Dispatches</span>
        </button>
      )}

      {/* Header unboxed metadata following Zero-Pill discipline */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{frontmatter.phase}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{frontmatter.date}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{frontmatter.reading_time_minutes} min read</span>
        <span aria-hidden="true">·</span>
        <span>{frontmatter.author.name}</span>
      </div>

      {/* Main Title */}
      <h1
        className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight mb-4"
        style={{ textWrap: 'balance' }}
      >
        {frontmatter.title}
      </h1>

      {/* Summary Kicker */}
      <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-normal">
        {frontmatter.summary}
      </p>

      {/* Target Outcomes Callout Box */}
      <div className="mb-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-2.5">
          Milestone Target Outcomes
        </div>
        <div className="space-y-1.5">
          {frontmatter.target_outcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span>{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Article Content & Embedded Widgets */}
      <div className="prose-neutral dark:prose-invert max-w-none">
        {renderContent()}
      </div>

      {/* Footer Tags & Metadata */}
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
          Source: {post.filePath}
        </div>
      </div>
    </article>
  );
};
