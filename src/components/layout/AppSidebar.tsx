import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  UserSearch,
  Radio,
  Users,
  Send,
  Inbox,
  Calendar,
  BarChart3,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AppPage } from '../../types';

export const AppSidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    conversations,
    buyingSignals,
    workspace,
  } = useApp();

  const navItems: { id: AppPage; label: string; icon: React.ReactNode; badgeCount?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'agents', label: 'AI Agents', icon: <Bot className="w-4 h-4 shrink-0" /> },
    { id: 'lead-finder', label: 'Lead Finder', icon: <UserSearch className="w-4 h-4 shrink-0" /> },
    {
      id: 'buying-signals',
      label: 'Buying Signals',
      icon: <Radio className="w-4 h-4 shrink-0" />,
      badgeCount: buyingSignals.filter((s) => s.status === 'new').length,
    },
    { id: 'prospects', label: 'Prospects CRM', icon: <Users className="w-4 h-4 shrink-0" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Send className="w-4 h-4 shrink-0" /> },
    {
      id: 'inbox',
      label: 'Unified Inbox',
      icon: <Inbox className="w-4 h-4 shrink-0" />,
      badgeCount: conversations.filter((c) => c.status === 'needs_reply' || c.status === 'unread').length,
    },
    { id: 'meetings', label: 'Meetings', icon: <Calendar className="w-4 h-4 shrink-0" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
    { id: 'integrations', label: 'Integrations', icon: <Plug className="w-4 h-4 shrink-0" /> },
    { id: 'developer', label: 'Developer Profile', icon: <Sparkles className="w-4 h-4 shrink-0 text-amber-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-200 select-none ${
        sidebarCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2.5 overflow-hidden text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          {!sidebarCollapsed && (
            <div className="truncate">
              <span className="font-extrabold text-white text-base tracking-tight block leading-none">
                LeadFit AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide block mt-1">
                {workspace.name}
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span
                      className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] tabular-nums font-semibold ${
                        isActive
                          ? 'bg-indigo-800 text-white'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Public Site Switcher / Help link */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={() => setCurrentPage('landing')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ${
            sidebarCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Visit Public Website"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {!sidebarCollapsed && <span>Public Website</span>}
        </button>
      </div>
    </aside>
  );
};
