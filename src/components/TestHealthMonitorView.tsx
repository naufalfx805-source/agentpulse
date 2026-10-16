'use client';

import React from 'react';
import {
  HeartPulse,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  Activity,
  BarChart3,
  Shield,
  Info,
  AlertOctagon,
} from 'lucide-react';
import { TestScenario, TestHealthMetrics, TestRunHistory, TestHealthAlert } from '../types/agent';

interface TestHealthMonitorViewProps {
  metrics: TestHealthMetrics;
  runHistory: TestRunHistory[];
  alerts: TestHealthAlert[];
  scenarios: TestScenario[];
}

export const TestHealthMonitorView: React.FC<TestHealthMonitorViewProps> = ({
  metrics,
  runHistory,
  alerts,
  scenarios,
}) => {
  const getPassRateColor = (rate: number) => {
    if (rate >= 95) return 'text-emerald-400';
    if (rate >= 80) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getPassRateBg = (rate: number) => {
    if (rate >= 95) return 'bg-emerald-500/10 border-emerald-500/30';
    if (rate >= 80) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-rose-500/10 border-rose-500/30';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-cyan-500';
    if (score >= 70) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-600';
  };

  const getFlakinessColor = (score: number) => {
    if (score <= 2) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score <= 5) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (score <= 15) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getAlertBorder = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-rose-500/40 bg-rose-500/5';
      case 'warning':
        return 'border-amber-500/40 bg-amber-500/5';
      default:
        return 'border-cyan-500/40 bg-cyan-500/5';
    }
  };

  // Sort scenarios by duration (slowest first)
  const sortedByDuration = [...scenarios].sort((a, b) => b.durationMs - a.durationMs);
  const maxDuration = sortedByDuration[0]?.durationMs || 1;

  // Calculate max tests in a run for chart scaling
  const maxTestsInRun = Math.max(...runHistory.map((r) => r.passed + r.failed + r.flaky), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Test Health Monitor</h2>
            <p className="text-sm text-slate-400">
              Real-time test suite health, flakiness tracking & duration analysis
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">Live Monitoring</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Tests */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Tests</span>
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-slate-100">{metrics.totalTests}</span>
            <span className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />+3
            </span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className={`border rounded-xl p-4 transition-colors ${getPassRateBg(metrics.passRate)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pass Rate</span>
            <CheckCircle2 className={`w-4 h-4 ${getPassRateColor(metrics.passRate)}`} />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-bold ${getPassRateColor(metrics.passRate)}`}>
              {metrics.passRate}%
            </span>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg Duration</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-slate-100">{metrics.avgDurationMs}</span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
        </div>

        {/* Flaky Tests */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Flaky Tests</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-bold ${metrics.flakyCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.flakyCount}
            </span>
            {metrics.flakyCount > 0 && (
              <span className="text-xs text-amber-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />watch
              </span>
            )}
          </div>
        </div>

        {/* Last Run */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Last Run</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <span className="text-lg font-semibold text-slate-200">{metrics.lastRunAt}</span>
        </div>

        {/* Health Score */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Health Score</span>
            <Shield className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span
              className={`text-2xl font-bold bg-gradient-to-r ${getHealthScoreColor(metrics.healthScore)} bg-clip-text text-transparent`}
            >
              {metrics.healthScore}
            </span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* Test Trend Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Run History — Last 7 Executions</h3>
        </div>
        <div className="flex items-end justify-between gap-3 h-40">
          {runHistory.map((run) => {
            const total = run.passed + run.failed + run.flaky;
            const passH = (run.passed / maxTestsInRun) * 100;
            const failH = (run.failed / maxTestsInRun) * 100;
            const flakyH = (run.flaky / maxTestsInRun) * 100;
            return (
              <div key={run.runId} className="flex-1 flex flex-col items-center group">
                <div className="w-full flex flex-col justify-end h-32 gap-0.5">
                  {run.flaky > 0 && (
                    <div
                      className="w-full bg-amber-500/60 rounded-t-sm transition-all group-hover:bg-amber-500/80"
                      style={{ height: `${flakyH}%` }}
                      title={`${run.flaky} flaky`}
                    />
                  )}
                  {run.failed > 0 && (
                    <div
                      className="w-full bg-rose-500/60 transition-all group-hover:bg-rose-500/80"
                      style={{ height: `${failH}%` }}
                      title={`${run.failed} failed`}
                    />
                  )}
                  <div
                    className="w-full bg-emerald-500/60 rounded-b-sm transition-all group-hover:bg-emerald-500/80"
                    style={{ height: `${passH}%` }}
                    title={`${run.passed} passed`}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-[10px] text-slate-500 font-mono">{run.runId.replace('run-', '#')}</div>
                  <div className="text-[10px] text-slate-600">{total}t</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500/60" />
            <span>Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-500/60" />
            <span>Failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500/60" />
            <span>Flaky</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Flakiness Heatmap + Duration Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flakiness Heatmap */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">Flakiness Heatmap</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`border rounded-lg p-3 transition-all hover:scale-[1.02] ${getFlakinessColor(scenario.flakinessScore)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate max-w-[70%]">{scenario.title}</span>
                  <span className="text-xs font-mono font-bold">{scenario.flakinessScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      scenario.flakinessScore <= 2
                        ? 'bg-emerald-500'
                        : scenario.flakinessScore <= 5
                          ? 'bg-amber-500'
                          : scenario.flakinessScore <= 15
                            ? 'bg-orange-500'
                            : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(scenario.flakinessScore * 5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500" />0-2%</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-500" />2-5%</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-orange-500" />5-15%</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-rose-500" />&gt;15%</span>
          </div>
        </div>

        {/* Duration Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Duration Breakdown</h3>
            <span className="text-[10px] text-slate-500 ml-auto">slowest first</span>
          </div>
          <div className="space-y-3">
            {sortedByDuration.map((scenario) => {
              const pct = (scenario.durationMs / maxDuration) * 100;
              const isOver = scenario.durationMs > 1000;
              return (
                <div key={scenario.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300 truncate max-w-[65%]">{scenario.title}</span>
                    <div className="flex items-center space-x-1">
                      {isOver && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                      <span className={`text-xs font-mono font-bold ${isOver ? 'text-amber-400' : 'text-slate-400'}`}>
                        {scenario.durationMs}ms
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isOver ? 'bg-amber-500' : 'bg-cyan-500/70'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-[10px] text-slate-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500/50" />
            Tests exceeding 1000ms threshold are flagged
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">Active Health Alerts</h3>
          <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {alerts.length} active
          </span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition-all hover:translate-x-1 ${getAlertBorder(alert.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex-shrink-0">{getAlertIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-slate-200">{alert.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-2">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                  {alert.testId && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-500 border border-slate-700">
                      {alert.testId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
