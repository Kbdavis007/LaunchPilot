import { MDXProvider } from '@mdx-js/react';
import type { MDXComponents } from 'mdx/types';
import type { ComponentType, ReactNode } from 'react';
import { TelemetryChart } from '../components/widgets/TelemetryChart';
import { RoadmapTimeline } from '../components/widgets/RoadmapTimeline';
import { WtpCalculator } from '../components/widgets/WtpCalculator';

type WidgetComponent = ComponentType<Record<string, unknown>>;

const widget = (component: unknown): WidgetComponent => component as WidgetComponent;

const prose = {
  h1: (props: { children?: ReactNode }) => (
    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight mt-8 mb-4" {...props} />
  ),
  h2: (props: { children?: ReactNode }) => (
    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-10 mb-4" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 mt-6 mb-2" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="my-3 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="my-4 space-y-2 list-disc list-outside pl-5 text-sm text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="my-4 space-y-2 list-decimal list-outside pl-5 text-sm text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  li: (props: { children?: ReactNode }) => <li className="leading-relaxed pl-1" {...props} />,
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote
      className="my-5 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border-l-4 border-emerald-500 text-neutral-700 dark:text-neutral-300 italic text-sm leading-relaxed"
      {...props}
    />
  ),
  a: (props: { children?: ReactNode; href?: string }) => (
    <a className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2" {...props} />
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className="font-semibold text-neutral-900 dark:text-neutral-100" {...props} />
  ),
  hr: () => <hr className="my-8 border-neutral-200 dark:border-neutral-800" />,
  table: (props: { children?: ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-left text-xs" {...props} />
    </div>
  ),
  thead: (props: { children?: ReactNode }) => (
    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200" {...props} />
  ),
  th: (props: { children?: ReactNode }) => <th className="p-3" {...props} />,
  tbody: (props: { children?: ReactNode }) => (
    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  td: (props: { children?: ReactNode }) => <td className="p-3" {...props} />,
  pre: (props: { children?: ReactNode }) => (
    <pre className="my-6 p-4 rounded-lg bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto leading-relaxed" {...props} />
  ),
  code: (props: { children?: ReactNode }) => (
    <code className="font-mono text-[0.85em] bg-neutral-100 dark:bg-neutral-800/70 px-1 py-0.5 rounded" {...props} />
  ),
};

/** Whitelisted registry: any tag not listed here is neutralized by the MDX compiler. */
export const mdxComponents: MDXComponents = {
  ...prose,
  WtpCalculator: widget(WtpCalculator),
  RoadmapTimeline: widget(RoadmapTimeline),
  TelemetryChart: widget(TelemetryChart),
} as MDXComponents;

export const MdxProvider = ({ children }: { children: ReactNode }) => (
  <MDXProvider components={mdxComponents}>{children}</MDXProvider>
);
