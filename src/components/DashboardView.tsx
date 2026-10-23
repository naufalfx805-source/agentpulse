'use client';

import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { AgentPipeline, TestScenario, VerificationEvent } from '../types/agent';

interface DashboardViewProps {
  pipelines: AgentPipeline[];
  scenarios: TestScenario[];
  events: VerificationEvent[];
  onTriggerRun: (pipelineId: string) => void;
  onNavigateTab: (tab: any) => void;
  /** Open one monitored pipeline in Pipeline Studio. */
  onOpenPipeline: (pipelineId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  pipelines,
  scenarios,
  events,
  onTriggerRun,
  onNavigateTab,
  onOpenPipeline,
}) => {
  const avgSuccessRate = (
    pipelines.reduce((acc, p) => acc + p.successRate, 0) / pipelines.length
  ).toFixed(1);

  const totalHealingCount = pipelines.reduce((acc, p) => acc + p.healingAttempts, 0);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-emerald-950/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built for TestSprite Hackathon Season 4</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Autonomous Agent Verification & Self-Healing Ops
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Real-time telemetry, continuous headless verification, and automated regression remediation. Powered by TestSprite 3.0 test suites and deterministic CI gates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('selfhealing')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Inspect The Loop</span>
            </button>
            <button
              onClick={() => onNavigateTab('pipelines')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <span>View Pipelines</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Fleet Reliability
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">{avgSuccessRate}%</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +0.8%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Across 26 continuous test runs</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Self-Healed Regressions
            </span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">{totalHealingCount}</span>
            <span className="text-xs text-violet-400 font-medium">100% resolved</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Mean Time to Repair (MTTR): 42s</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Scenarios
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">{scenarios.length} Suites</span>
            <span className="text-xs text-cyan-400 font-medium">TestSprite 3.0</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Zero flakiness tolerance</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Avg Verification Latency
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">410ms</span>
            <span className="text-xs text-emerald-400 font-medium">-15% vs v2.8</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Headed Chromium engine</p>
        </div>
      </div>

      {/* Main Content Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pipelines List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Monitored Agent Pipelines</span>
            </h2>
            <button
              onClick={() => onNavigateTab('pipelines')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Open Studio &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onOpenPipeline(pipeline.id)}
                        className="font-bold text-slate-200 hover:text-emerald-300 text-left transition-colors"
                      >
                        {pipeline.name}
                      </button>
                      <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-400 font-mono">
                        {pipeline.agentModel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Target: <span className="text-slate-400 uppercase">{pipeline.targetEnv}</span> • Last run: {pipeline.lastRunAt} • Budget: {pipeline.tokenBudget.toLocaleString()} tokens
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pipeline.successRate}% Success
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenPipeline(pipeline.id)}
                      aria-label={`View details of ${pipeline.name}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onTriggerRun(pipeline.id)}
                      disabled={pipeline.status === 'running'}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
                    >
                      {pipeline.status === 'running' ? 'Executing...' : 'Run Pipeline'}
                    </button>
                  </div>
                </div>

                {/* Steps Mini Progress */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/60">
                  {pipeline.steps.map((step, idx) => (
                    <div key={step.id} className="text-left space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            step.status === 'success'
                              ? 'bg-emerald-400'
                              : step.status === 'running'
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-300 truncate">
                          {idx + 1}. {step.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {step.durationMs ? `${step.durationMs}ms` : 'Ready'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Verification Event Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Live Verification Stream</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 animate-pulse">● Live Stream</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3 max-h-[520px] overflow-y-auto">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-1.5 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    {evt.severity === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {evt.severity === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {evt.severity === 'error' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                    {evt.severity === 'info' && <Clock className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{evt.pipelineName}</span>
                  </span>
                  <span className="text-slate-500 font-mono">{evt.timestamp}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{evt.message}</p>
                {evt.details && (
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800 font-mono text-[10px] text-emerald-400/90">
                    {evt.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
