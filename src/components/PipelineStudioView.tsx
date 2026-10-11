'use client';

import React, { useState } from 'react';
import {
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Terminal,
  Shield,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { AgentPipeline } from '../types/agent';

interface PipelineStudioViewProps {
  pipelines: AgentPipeline[];
  onTriggerRun: (pipelineId: string) => void;
}

export const PipelineStudioView: React.FC<PipelineStudioViewProps> = ({
  pipelines,
  onTriggerRun,
}) => {
  const [selectedPipelineId, setSelectedPipelineId] = useState(pipelines[0]?.id || '');
  const [tokenBudget, setTokenBudget] = useState(32000);
  const [timeoutSeconds, setTimeoutSeconds] = useState(300);
  const [activeStepTab, setActiveStepTab] = useState<string | null>(null);

  const currentPipeline = pipelines.find((p) => p.id === selectedPipelineId) || pipelines[0];

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Agent Pipeline & Verification Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build, configure, and execute multi-step agent validation workflows with TestSprite 3.0 assertions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPipelineId}
            onChange={(e) => setSelectedPipelineId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-500"
          >
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => onTriggerRun(currentPipeline.id)}
            disabled={currentPipeline.status === 'running'}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>{currentPipeline.status === 'running' ? 'Executing...' : 'Run Pipeline'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Step Flow */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Pipeline Execution DAG ({currentPipeline.steps.length} Steps)
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Status: {currentPipeline.status.toUpperCase()}
              </span>
            </div>

            {/* Steps Visual List */}
            <div className="space-y-4">
              {currentPipeline.steps.map((step, idx) => {
                const isSelected = activeStepTab === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStepTab(step.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-emerald-500/80 bg-slate-850 shadow-md shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            step.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : step.status === 'running'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200">{step.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            Type: <span className="text-emerald-400">{step.type}</span> • Duration: {step.durationMs ? `${step.durationMs}ms` : 'Ready'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {step.status === 'success' && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                        {step.status === 'running' && (
                          <RotateCcw className="w-5 h-5 text-amber-400 animate-spin" />
                        )}
                        {step.status === 'pending' && (
                          <Clock className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    </div>

                    {/* Output detail box */}
                    {step.output && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-300">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
                          <Terminal className="w-3 h-3 text-emerald-400" />
                          <span>Step Output</span>
                        </div>
                        {step.output}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & Controls */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Pipeline Policy & Guardrails</span>
            </h2>

            {/* Token Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Token Allocation Budget</span>
                <span className="text-emerald-400 font-mono font-bold">{tokenBudget.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min="4000"
                max="128000"
                step="4000"
                value={tokenBudget}
                onChange={(e) => setTokenBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Automatic hard-abort if prompt + completion surpasses boundary.
              </p>
            </div>

            {/* Timeout Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Timeout Deadline</span>
                <span className="text-emerald-400 font-mono font-bold">{timeoutSeconds}s</span>
              </div>
              <input
                type="range"
                min="30"
                max="900"
                step="30"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Mirrors `--timeout` flag enforced in TestSprite CLI.
              </p>
            </div>

            {/* Self-Healing Switch */}
            <div className="p-3.5 rounded-xl border border-violet-500/20 bg-violet-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-300 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-violet-400" />
                  <span>Auto-Remediation On Failure</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/30 text-violet-200">
                  ENABLED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                When TestSprite 3.0 captures an assertion defect, the failure bundle is fed directly to the coding agent for automated root-cause patch generation.
              </p>
            </div>

            {/* Telemetry info */}
            <div className="pt-2 border-t border-slate-800 text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Model Backend:</span>
                <span className="font-mono text-slate-200">{currentPipeline.agentModel}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Environment:</span>
                <span className="font-mono text-slate-200 uppercase">{currentPipeline.targetEnv}</span>
              </div>
              <div className="flex justify-between">
                <span>Remediation Rate:</span>
                <span className="font-mono text-emerald-400">100% (4/4 Resolved)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
