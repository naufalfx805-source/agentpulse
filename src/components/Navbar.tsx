'use client';

import React from 'react';
import {
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Zap,
  RotateCcw,
  Settings,
  ExternalLink,
  HeartPulse,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'pipelines' | 'scenarios' | 'simulator' | 'selfhealing' | 'healthmonitor' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  env: 'production' | 'staging' | 'local';
  setEnv: (env: 'production' | 'staging' | 'local') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, env, setEnv }) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Fleet Overview', icon: Activity },
    { id: 'pipelines' as ActiveTab, label: 'Pipeline Studio', icon: Layers },
    { id: 'scenarios' as ActiveTab, label: 'Test Scenarios', icon: Cpu },
    { id: 'simulator' as ActiveTab, label: 'Chaos & Webhooks', icon: Zap },
    { id: 'selfhealing' as ActiveTab, label: 'The TestSprite Loop', icon: RotateCcw, highlight: true },
    { id: 'healthmonitor' as ActiveTab, label: 'Test Health', icon: HeartPulse, highlight: true },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  AgentPulse
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v3.0 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Autonomous Verification & Self-Healing Ops
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? tab.highlight
                        ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/40'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : tab.highlight
                      ? 'text-fuchsia-400/80 hover:text-fuchsia-300 hover:bg-fuchsia-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.highlight ? 'text-fuchsia-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Environment Selector */}
            <select
              value={env}
              onChange={(e) => setEnv(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="production">Prod (US-East)</option>
              <option value="staging">Staging (V3 Sandbox)</option>
              <option value="local">Local Tunnel</option>
            </select>

            {/* TestSprite Portal Badge */}
            <a
              href="https://testsprite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <span>TestSprite 3.0</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            {/* GitHub Repo */}
            <a
              href="https://github.com/naufalfx805-source"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
              title="GitHub Profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto space-x-2 py-2 border-t border-slate-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
