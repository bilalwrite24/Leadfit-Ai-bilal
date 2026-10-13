import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bot,
  UserCheck,
  Radio,
  Users,
  Send,
  Inbox,
  Calendar,
  BarChart3,
  Plug,
  Settings,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';
import { NavigationTarget } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentPage,
    prospects,
    agents,
    setActiveProspectDrawerId,
    setActiveAgentDrawerId,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const navActions: { label: string; page: NavigationTarget; icon: React.ReactNode; category: string }[] = [
    { label: 'Overview Dashboard', page: 'dashboard', icon: <BarChart3 className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'AI Agents Hub', page: 'agents', icon: <Bot className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Lead Finder Discovery', page: 'lead-finder', icon: <UserCheck className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Buying Signals Radar', page: 'buying-signals', icon: <Radio className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Prospects CRM Table', page: 'prospects', icon: <Users className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Outreach Campaigns', page: 'campaigns', icon: <Send className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Unified Inbox', page: 'inbox', icon: <Inbox className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Meetings Calendar', page: 'meetings', icon: <Calendar className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Performance Analytics', page: 'analytics', icon: <BarChart3 className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Integrations & API', page: 'integrations', icon: <Plug className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
    { label: 'Account & Workspace Settings', page: 'settings', icon: <Settings className="w-4 h-4 text-indigo-500" />, category: 'Navigation' },
  ];

  const filteredNav = navActions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchedProspects = prospects
    .filter(
      (p) =>
        p.fullName.toLowerCase().includes(query.toLowerCase()) ||
        p.company.toLowerCase().includes(query.toLowerCase()) ||
        p.title.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  const matchedAgents = agents
    .filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.role.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const handleNavigate = (page: NavigationTarget) => {
    setCurrentPage(page);
    setCommandPaletteOpen(false);
  };

  const handleOpenProspect = (id: string) => {
    setCurrentPage('prospects');
    setActiveProspectDrawerId(id);
    setCommandPaletteOpen(false);
  };

  const handleOpenAgent = (id: string) => {
    setCurrentPage('agents');
    setActiveAgentDrawerId(id);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, prospects, agents, or commands... (Esc to exit)"
            autoFocus
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {/* Quick Pages */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces & Views
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredNav.map((action) => (
                  <button
                    key={action.page}
                    onClick={() => handleNavigate(action.page)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/80 rounded-lg group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {action.icon}
                      <span>{action.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prospects Section */}
          {matchedProspects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Prospects
              </div>
              <div className="space-y-0.5 mt-1">
                {matchedProspects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleOpenProspect(p.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/80 rounded-lg group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] flex items-center justify-center">
                        {p.firstName[0]}
                        {p.lastName[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{p.fullName}</span>
                        <span className="text-slate-400 ml-1.5 font-normal">
                          · {p.title} at {p.company}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-[11px] text-indigo-600 font-medium">
                      Score {p.icpScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Agents Section */}
          {matchedAgents.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                AI Agents
              </div>
              <div className="space-y-0.5 mt-1">
                {matchedAgents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleOpenAgent(a.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/80 rounded-lg group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-4 h-4 text-indigo-500" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{a.name}</span>
                        <span className="text-slate-400 ml-1.5 font-normal">· {a.role}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{a.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && matchedProspects.length === 0 && matchedAgents.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching pages or records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with click or arrow keys</span>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
              ESC
            </span>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
