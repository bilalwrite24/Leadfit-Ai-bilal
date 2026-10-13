import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentSetupWizard } from './AgentSetupWizard';
import {
  Bot,
  Plus,
  Play,
  Pause,
  Clock,
  Target,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sparkles,
} from 'lucide-react';
import { Agent } from '../../types';

export const AgentsPage: React.FC = () => {
  const {
    agents,
    toggleAgentStatus,
    activeAgentDrawerId,
    setActiveAgentDrawerId,
    updateAgent,
  } = useApp();

  const [wizardOpen, setWizardOpen] = useState(false);

  const selectedAgent = agents.find((a) => a.id === activeAgentDrawerId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Sales Agents</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your autonomous prospecting, signal detection, and qualification agents.
          </p>
        </div>

        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deploy New Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const isActive = agent.status === 'active';
          return (
            <div
              key={agent.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</h3>
                      <span className="text-[11px] text-slate-400 block font-normal">
                        {agent.role}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {agent.description}
                </p>

                {/* Target ICP */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Target ICP
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block">
                    {agent.targetICP}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Discovered</span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {agent.leadsDiscovered}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Qualification</span>
                    <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {agent.qualificationRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Schedule</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium block truncate">
                      {agent.cadence.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Last evaluated: {agent.lastRun}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAgentStatus(agent.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAgentDrawerId(agent.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Configure Agent & View Logs"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Detail Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedAgent.name}
                </h2>
                <div className="text-xs text-slate-400">{selectedAgent.role}</div>
              </div>
              <button
                onClick={() => setActiveAgentDrawerId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              <div className="space-y-3">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Configuration & Filters
                </span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Industries</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {selectedAgent.filters.industries.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Company Headcount</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {selectedAgent.filters.companySizes.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Decision Makers</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {selectedAgent.filters.seniority.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="space-y-3">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Agent Execution Log
                </span>
                <div className="space-y-2">
                  {selectedAgent.activityLog.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">{log.action}</span>
                        <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-snug">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveAgentDrawerId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Wizard Modal */}
      <AgentSetupWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
};
