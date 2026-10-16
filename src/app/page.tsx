'use client';

import React, { useState } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { DashboardView } from '../components/DashboardView';
import { PipelineStudioView } from '../components/PipelineStudioView';
import { ScenarioStudioView } from '../components/ScenarioStudioView';
import { ChaosSimulatorView } from '../components/ChaosSimulatorView';
import { SelfHealingLoopView } from '../components/SelfHealingLoopView';
import { TestHealthMonitorView } from '../components/TestHealthMonitorView';
import { SettingsView } from '../components/SettingsView';
import { INITIAL_PIPELINES, INITIAL_SCENARIOS, INITIAL_EVENTS, INITIAL_TEST_HEALTH_METRICS, INITIAL_TEST_RUN_HISTORY, INITIAL_TEST_HEALTH_ALERTS } from '../data/mockData';
import { AgentPipeline, TestScenario, VerificationEvent } from '../types/agent';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [env, setEnv] = useState<'production' | 'staging' | 'local'>('staging');
  const [pipelines, setPipelines] = useState<AgentPipeline[]>(INITIAL_PIPELINES);
  const [scenarios, setScenarios] = useState<TestScenario[]>(INITIAL_SCENARIOS);
  const [events, setEvents] = useState<VerificationEvent[]>(INITIAL_EVENTS);

  // Trigger simulated live pipeline execution
  const handleTriggerRun = (pipelineId: string) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== pipelineId) return p;
        return {
          ...p,
          status: 'running',
          steps: p.steps.map((s, idx) => ({
            ...s,
            status: idx === 0 ? 'running' : 'pending',
          })),
        };
      })
    );

    // Step-by-step simulated advancement
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      setPipelines((prev) =>
        prev.map((p) => {
          if (p.id !== pipelineId) return p;
          const updatedSteps = p.steps.map((s, idx) => {
            if (idx < stepIndex) return { ...s, status: 'success' as const };
            if (idx === stepIndex) return { ...s, status: 'running' as const };
            return { ...s, status: 'pending' as const };
          });

          const isDone = stepIndex >= p.steps.length;
          return {
            ...p,
            status: isDone ? ('passed' as const) : ('running' as const),
            lastRunAt: 'Just now',
            steps: updatedSteps,
          };
        })
      );

      if (stepIndex >= 4) {
        clearInterval(interval);
        // Log event
        const newEvt: VerificationEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          pipelineId,
          pipelineName: pipelines.find((p) => p.id === pipelineId)?.name || 'Pipeline',
          eventType: 'run_passed',
          severity: 'success',
          message: 'Headed browser verification run completed cleanly. All 26 TestSprite assertions passed.',
        };
        setEvents((prev) => [newEvt, ...prev]);
      }
    }, 700);
  };

  const handleAddScenario = (newScenario: TestScenario) => {
    setScenarios((prev) => [newScenario, ...prev]);
    const newEvt: VerificationEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      pipelineId: 'pipe-01',
      pipelineName: 'TestSprite 3.0 Sync',
      eventType: 'run_started',
      severity: 'info',
      message: `Registered new test scenario: "${newScenario.title}" targeting ${newScenario.targetPath}.`,
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        env={env}
        setEnv={setEnv}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            pipelines={pipelines}
            scenarios={scenarios}
            events={events}
            onTriggerRun={handleTriggerRun}
            onNavigateTab={setActiveTab}
          />
        )}
        {activeTab === 'pipelines' && (
          <PipelineStudioView
            pipelines={pipelines}
            onTriggerRun={handleTriggerRun}
          />
        )}
        {activeTab === 'scenarios' && (
          <ScenarioStudioView
            scenarios={scenarios}
            onAddScenario={handleAddScenario}
          />
        )}
        {activeTab === 'simulator' && <ChaosSimulatorView />}
        {activeTab === 'selfhealing' && <SelfHealingLoopView />}
        {activeTab === 'healthmonitor' && (
          <TestHealthMonitorView
            metrics={INITIAL_TEST_HEALTH_METRICS}
            runHistory={INITIAL_TEST_RUN_HISTORY}
            alerts={INITIAL_TEST_HEALTH_ALERTS}
            scenarios={scenarios}
          />
        )}
        {activeTab === 'settings' && <SettingsView env={env} setEnv={setEnv} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">AgentPulse</span>
            <span>— Built for TestSprite Hackathon Season 4</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.testsprite.com/hackathon-s4"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
            >
              <span>TestSprite Season 4</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/naufalfx805-source"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              @naufalfx805-source
            </a>
            <span>•</span>
            <span className="font-mono text-slate-400">Discord: @npall_805</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
