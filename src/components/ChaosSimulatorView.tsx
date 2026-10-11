'use client';

import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Send,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { ChaosConfig } from '../types/agent';

export const ChaosSimulatorView: React.FC = () => {
  const [chaos, setChaos] = useState<ChaosConfig>({
    latencyMs: 120,
    failureRate: 0,
    rateLimitEnabled: false,
    simulateFlakyNetwork: false,
    injectedErrorCode: 429,
  });

  const [webhookEvent, setWebhookEvent] = useState<'pull_request' | 'deployment' | 'testsprite_check'>('pull_request');
  const [isFiring, setIsFiring] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const samplePayloads = {
    pull_request: {
      action: 'opened',
      number: 354,
      pull_request: {
        title: 'fix(debug): log swallowed errors in test advisory and init setup',
        head: { ref: 'fix/issue-186-debug-logging-silent-catches' },
        base: { ref: 'main' },
        user: { login: 'naufalfx805-source' },
      },
      testsprite: {
        status: chaos.rateLimitEnabled ? 'RATE_LIMITED' : 'TRIGGERED',
        check_run_id: 'cr_8831920',
      },
    },
    deployment: {
      action: 'created',
      deployment: {
        id: 991823,
        environment: 'Production (Vercel)',
        url: 'https://agentpulse.vercel.app',
        creator: 'naufalfx805-source',
      },
    },
    testsprite_check: {
      event: 'test_suite_completed',
      run_id: 'run_61048b',
      scenarios_evaluated: 26,
      passed: chaos.failureRate > 0 ? 25 : 26,
      failed: chaos.failureRate > 0 ? 1 : 0,
      verdict: chaos.failureRate > 0 ? 'FAILED' : 'PASSED',
      auto_healed: chaos.failureRate > 0,
      duration_ms: 1840 + chaos.latencyMs,
    },
  };

  const handleFireWebhook = () => {
    setIsFiring(true);
    setTimeout(() => {
      setIsFiring(false);
      setLastResponse({
        timestamp: new Date().toISOString(),
        event: webhookEvent,
        statusCode: chaos.rateLimitEnabled ? 429 : chaos.failureRate > 0 ? chaos.injectedErrorCode : 200,
        latencyMs: chaos.latencyMs,
        simulatedVerdict: chaos.rateLimitEnabled
          ? 'RATE_LIMITED_REFUSAL (exit 7)'
          : chaos.failureRate > 0
          ? 'ASSERTION_DEFECT_TRIGGERED -> FAILURE_BUNDLE_DISPATCHED'
          : 'PR_STATUS_CHECK_GREEN (TestSprite 3.0 Pass)',
      });
    }, chaos.latencyMs || 250);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Chaos Testing & Webhook Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate CI webhook triggers, inject network latency spikes, rate limits, and test automated self-healing resilience.
          </p>
        </div>
        <button
          onClick={handleFireWebhook}
          disabled={isFiring}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>{isFiring ? 'Dispatching...' : 'Dispatch Webhook Event'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Chaos Controls */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Chaos Injection Levers</span>
            </h2>

            {/* Latency Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Artificial Latency Spike</span>
                <span className="text-amber-400 font-mono font-bold">+{chaos.latencyMs}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="2500"
                step="50"
                value={chaos.latencyMs}
                onChange={(e) => setChaos({ ...chaos, latencyMs: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Exercises client-side timeouts and request-cushion guards.
              </p>
            </div>

            {/* Failure Rate Toggle */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Simulated Assertion Defect Rate</span>
                <span className="text-rose-400 font-mono font-bold">{chaos.failureRate}% Failure</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={chaos.failureRate}
                onChange={(e) => setChaos({ ...chaos, failureRate: Number(e.target.value) })}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Triggers an assertion defect to test the failure bundle ingestion & auto-healing cycle.
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer">
                <span className="text-xs font-medium text-slate-300">
                  Inject Model 429 Quota Exhaustion
                </span>
                <input
                  type="checkbox"
                  checked={chaos.rateLimitEnabled}
                  onChange={(e) => setChaos({ ...chaos, rateLimitEnabled: e.target.checked })}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer">
                <span className="text-xs font-medium text-slate-300">
                  Simulate Jitter & Packet Drops
                </span>
                <input
                  type="checkbox"
                  checked={chaos.simulateFlakyNetwork}
                  onChange={(e) => setChaos({ ...chaos, simulateFlakyNetwork: e.target.checked })}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Payload & Live Response */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Simulated Webhook Payload</span>
              </h2>
              <div className="flex space-x-1">
                {(['pull_request', 'deployment', 'testsprite_check'] as const).map((evt) => (
                  <button
                    key={evt}
                    onClick={() => setWebhookEvent(evt)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono transition-colors ${
                      webhookEvent === evt
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {evt}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-[220px]">
              <pre>{JSON.stringify(samplePayloads[webhookEvent], null, 2)}</pre>
            </div>

            {/* Response Section */}
            {lastResponse && (
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-950 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Simulator Result</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      lastResponse.statusCode === 200
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    HTTP {lastResponse.statusCode}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {lastResponse.simulatedVerdict}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
