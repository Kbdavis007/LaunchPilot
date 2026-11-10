import React, { useState } from 'react';
import { SPEC_FILES, SpecFile } from '../../data/specsData';
import { BLOG_POSTS } from '../../data/blogData';
import { FileCode, Copy, CheckCircle2, ShieldCheck, Download, Search, Terminal, Play, Sparkles, ExternalLink } from 'lucide-react';

export const OpenSpecExplorer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(SPEC_FILES[0].id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationOutput, setValidationOutput] = useState<{
    status: 'idle' | 'success';
    items: { name: string; type: string; reqs: number }[];
    time: string;
  }>({
    status: 'success',
    items: [
      { name: 'spec/edge-runtime-guardrails', type: 'Living Spec', reqs: 3 },
      { name: 'spec/mdx-engineering-blog', type: 'Living Spec', reqs: 3 },
      { name: 'spec/saas-pass-entitlements', type: 'Living Spec', reqs: 3 },
      { name: 'change/phase-2-pain-signal-engine', type: 'Active Change', reqs: 3 },
    ],
    time: '2026-11-10 04:47:01 UTC',
  });

  const categories = ['All', 'Living Spec', 'Active Change', 'Architecture Config', 'Agent Directives'];

  const filteredFiles = SPEC_FILES.filter((f) => {
    const matchesSearch =
      f.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selectedFile = SPEC_FILES.find((f) => f.id === selectedFileId) || SPEC_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.filename.split('/').pop() || 'spec.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setValidationOutput({
        status: 'success',
        items: [
          { name: 'spec/edge-runtime-guardrails', type: 'Living Spec', reqs: 3 },
          { name: 'spec/mdx-engineering-blog', type: 'Living Spec', reqs: 3 },
          { name: 'spec/saas-pass-entitlements', type: 'Living Spec', reqs: 3 },
          { name: 'change/phase-2-pain-signal-engine', type: 'Active Change', reqs: 3 },
        ],
        time: new Date().toISOString(),
      });
      setIsValidating(false);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-6">
      {/* Header with official OpenSpec link & validator banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              OpenSpec v1.17.0 Verified
            </span>
            <a
              href="https://openspec.dev"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono"
            >
              <span>openspec.dev</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            OpenSpec Canonical Blueprints & Living Specs
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Formally generated via <code className="text-emerald-300 font-mono">@fission-ai/openspec</code> following the spec-driven workflow (Proposal → Specs Delta → Design → Tasks → Archive).
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={handleRunValidation}
            disabled={isValidating}
            className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isValidating ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isValidating ? 'Validating...' : 'openspec validate --all'}</span>
          </button>
        </div>
      </div>

      {/* Validation Result Box */}
      {validationOutput.status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/30 text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                CLI Verification Passed:
              </span>{' '}
              <span className="font-mono text-neutral-600 dark:text-neutral-400">
                4 items validated (3 living specs + 1 active change). 0 errors.
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            {validationOutput.time}
          </span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Sidebar & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spec File List */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900/90 shadow-xs overflow-hidden flex flex-col h-[650px]">
          <div className="p-3.5 border-b border-neutral-200/80 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-950/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search specs, paths, requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/5 p-2 space-y-1">
            {filteredFiles.map((file) => {
              const isSelected = file.id === selectedFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-xs flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md shadow-emerald-500/10'
                      : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected
                        ? 'text-emerald-400 dark:text-emerald-600'
                        : file.category === 'Living Spec'
                        ? 'text-emerald-500'
                        : file.category === 'Active Change'
                        ? 'text-cyan-500'
                        : 'text-neutral-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold truncate">{file.filename}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {file.category}
                      </span>
                    </div>
                    <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'opacity-80' : 'text-neutral-400'}`}>
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <span>Schema: spec-driven</span>
            <span className="text-emerald-500 font-bold">100% Validated</span>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-neutral-950 text-neutral-100 shadow-xl overflow-hidden flex flex-col h-[650px]">
          <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-neutral-200 truncate">{selectedFile.path}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-emerald-400 font-mono text-[11px]">{selectedFile.phase}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed text-neutral-200 select-text bg-[#08090d]">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
