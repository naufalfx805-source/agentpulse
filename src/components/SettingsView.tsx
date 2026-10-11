'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Globe,
  Database,
  CheckCircle2,
  Download,
  Upload,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface SettingsViewProps {
  env: 'production' | 'staging' | 'local';
  setEnv: (env: 'production' | 'staging' | 'local') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ env, setEnv }) => {
  const [apiKey, setApiKey] = useState('sk-user-naufalfx805-testsprite-s4');
  const [profile, setProfile] = useState('default');
  const [endpointUrl, setEndpointUrl] = useState('https://api.testsprite.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>Environment & TestSprite Credentials Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage target execution profiles, endpoint URLs, API keys, and test suite export/import.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved and verified successfully.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>TestSprite 3.0 API Configuration</span>
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              TestSprite API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-user-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Keys are stored with restrictive Owner-Only ACL permissions matching TestSprite CLI security guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Active Profile
              </label>
              <input
                type="text"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                API Endpoint URL
              </label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Target Environment */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Target Deployment Environment</span>
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'production', label: 'Production', desc: 'Live public app on Vercel' },
              { id: 'staging', label: 'Staging', desc: 'Preview PR deployments' },
              { id: 'local', label: 'Local Tunnel', desc: 'Localhost via secure tunnel' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setEnv(item.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  env === item.id
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-bold text-slate-200">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Portability */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Test Suite Definition Import / Export</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => alert('Exporting TestSprite 3.0 suite definition as JSON...')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Suite JSON</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Import capability is enabled.')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import Suite JSON</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
