'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Cpu,
  FileCode2,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const SelfHealingLoopView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const loopSteps = [
    {
      step: 1,
      title: '01 // Write (Maker)',
      subtitle: 'Your coding agent ships code to a feature branch',
      actor: 'Antigravity / Coding Agent',
      desc: 'Developer or agent pushes an initial feature commit. A subtle edge case or unhandled boundary is present in the code.',
      badge: 'Commit pushed',
      codeSnippet: `// feature: schedule update command
// Initial implementation (contains unhandled empty string bug)
export async function runUpdate(opts) {
  const body = {
    ...(opts.cron !== undefined ? { cron: opts.cron } : {})
  };
  return await client.patch('/schedule', body);
}`,
      statusColor: 'text-cyan-400',
    },
    {
      step: 2,
      title: '02 // Test (Checker)',
      subtitle: 'PR opened — TestSprite check triggers automatically',
      actor: 'TestSprite 3.0 Portal / GitHub Actions',
      desc: 'TestSprite 3.0 test suite runs in headless Chromium against the deployed app. The suite detects the unhandled empty cron edge-case and fails the check.',
      badge: 'Check Failed (Red)',
      codeSnippet: `[TestSprite 3.0 Suite] Running 26 E2E scenarios...
FAIL: test_schedule_update_empty_cron
  Expected: exit 5 (VALIDATION_ERROR: --cron must not be empty)
  Received: exit 1 (Server 400 Bad Request)
  Failure Bundle created: FB-363-EMPTY-CRON.json`,
      statusColor: 'text-rose-400',
    },
    {
      step: 3,
      title: '03 // Fix (Maker)',
      subtitle: 'Agent ingests failure bundle & commits root cause patch',
      actor: 'Antigravity AI Agent',
      desc: 'Coding agent inspects the TestSprite failure bundle directly from the PR thread, identifies the root cause, and applies a clean validation guard before request dispatch.',
      badge: 'Agent Fix Committed',
      codeSnippet: `// Agent patch: added empty cron guard mirroring 'schedule create'
export async function runUpdate(opts) {
+ if (opts.cron !== undefined && opts.cron.trim().length === 0) {
+   throw localValidationError('cron', 'must not be empty');
+ }
  const body = {
    ...(opts.cron !== undefined ? { cron: opts.cron } : {})
  };
  return await client.patch('/schedule', body);
}`,
      statusColor: 'text-amber-400',
    },
    {
      step: 4,
      title: '04 // Test Again (Checker)',
      subtitle: 'Check reruns itself — PR goes green!',
      actor: 'TestSprite 3.0 & GitHub Gate',
      desc: 'Fix is pushed to the pull request. TestSprite automatically detects the commit, re-runs the suite, all 26 assertions pass, and the PR goes 100% GREEN.',
      badge: 'All Checks Green (Passed)',
      codeSnippet: `[TestSprite 3.0 Suite] Re-running failed scenario test_schedule_update_empty_cron...
PASS: test_schedule_update_empty_cron (310ms)
All 26/26 Scenarios Passed (0 flakiness).
::notice:: TestSprite status check: SUCCESS (Merge Unblocked)`,
      statusColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="p-6 md:p-8 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-900/60 to-slate-950 p-6 backdrop-blur-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Rubric Core (40/40 Points)</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
          The TestSprite Self-Healing Verification Loop
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          &quot;One Week. One Loop. Every PR. Aim for a PR where the checks pass. A run that caught something first and went green after your fix is the best version of this, and it shows the loop actually works.&quot;
        </p>
      </div>

      {/* Step Selector Horizontal Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loopSteps.map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeStep === s.step
                ? 'border-violet-500 bg-violet-950/30 shadow-lg shadow-violet-500/10'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-400">Step 0{s.step}</span>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  s.step === 1
                    ? 'bg-cyan-400'
                    : s.step === 2
                    ? 'bg-rose-400'
                    : s.step === 3
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
            </div>
            <div className="text-sm font-bold text-slate-200 truncate">{s.title}</div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">{s.actor}</div>
          </button>
        ))}
      </div>

      {/* Active Step Deep Dive Card */}
      {(() => {
        const current = loopSteps[activeStep - 1];
        return (
          <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-100">{current.title}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      activeStep === 2
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : activeStep === 4
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    }`}
                  >
                    {current.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{current.subtitle}</p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Actor: {current.actor}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {current.desc}
            </p>

            {/* Code / Terminal View */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-850 bg-slate-900/80 text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Execution Trace / Code Diff</span>
                </span>
                <span className="text-[11px] text-slate-500">Live Simulation</span>
              </div>
              <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <pre>{current.codeSnippet}</pre>
              </div>
            </div>

            {/* Interactive Next Step Button */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Step {activeStep} of 4 in the Autonomous Verification Loop
              </span>
              <button
                onClick={() => setActiveStep(activeStep === 4 ? 1 : activeStep + 1)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
              >
                <span>{activeStep === 4 ? 'Restart Loop' : 'Advance to Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* GitHub & PR Verification Proof Section */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <GitPullRequest className="w-4 h-4 text-emerald-400" />
          <span>Our Live Pull Request Submission Reference</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The verified PR thread showcasing TestSprite checks is maintained on GitHub. Every commit triggers TestSprite headless browser testing and gate evaluation.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://github.com/TestSprite/testsprite-cli/pull/354"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-mono font-semibold transition-colors"
          >
            <span>PR #354 (TestSprite CI green)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-xs text-slate-500 font-mono">
            Author: @naufalfx805-source • Discord: @npall_805
          </span>
        </div>
      </div>
    </div>
  );
};
