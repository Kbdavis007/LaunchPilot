import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 py-10 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            LaunchPilot & SaaS Pass
          </span>
          <span className="mx-2 text-neutral-400">·</span>
          <span>OpenSpec System Engine & Serverless Edge Architecture</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
          <span>Cloudflare Workers + D1</span>
          <span aria-hidden="true">·</span>
          <span>OpenHands Autonomous Agent</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">Sub-50ms SLA</span>
        </div>
      </div>
    </footer>
  );
};
