import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
  Check,
  Building,
} from 'lucide-react';
import { AppPage } from '../../types';

export const AppTopBar: React.FC = () => {
  const {
    currentPage,
    user,
    signOut,
    setCurrentPage,
    workspace,
    setCommandPaletteOpen,
    notifications,
    markNotificationsAsRead,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const pageTitles: Record<AppPage, string> = {
    dashboard: 'Overview',
    agents: 'AI Agents Hub',
    'lead-finder': 'Lead Finder',
    'buying-signals': 'Buying Signals Radar',
    prospects: 'Prospects CRM',
    campaigns: 'Outreach Campaigns',
    inbox: 'Unified Inbox',
    meetings: 'Meetings & Schedule',
    analytics: 'Performance Analytics',
    integrations: 'Integrations & API',
    developer: 'Developer Profile (Bilal Iqbal)',
    settings: 'Settings & Workspace',
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between gap-6 transition-colors">
      {/* Zone 1: Contextual Breadcrumb Trail & Workspace Selector */}
      <div className="flex items-center gap-3">
        {/* Workspace Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="truncate max-w-[130px]">{workspace.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {workspaceMenuOpen && (
            <div
              className="absolute left-0 mt-1 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs"
              onClick={() => setWorkspaceMenuOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Workspace
              </div>
              <div className="px-3 py-2 flex items-center justify-between text-slate-900 dark:text-white font-medium bg-indigo-50/50 dark:bg-indigo-950/30">
                <span>{workspace.name}</span>
                <Check className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="px-3 py-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                Plan: <span className="font-semibold text-slate-800 dark:text-slate-200">{workspace.plan}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => setCurrentPage('settings')}
                  className="w-full text-left px-3 py-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Manage Workspaces →
                </button>
              </div>
            </div>
          )}
        </div>

        <span className="text-slate-300 dark:text-slate-700">/</span>

        {/* Current Page Title */}
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {pageTitles[currentPage as AppPage] || 'Workspace'}
        </div>
      </div>

      {/* Zone 2: Global Search Command Trigger */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-400 hover:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span>Search prospects, agents, signals, actions...</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifMenuOpen((prev) => !prev);
              if (unreadCount > 0) markNotificationsAsRead();
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {notifMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs"
              onClick={() => setNotifMenuOpen(false)}
            >
              <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Activity Alerts</span>
                <span className="text-[11px] text-indigo-600 font-medium">Real-time</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <p className="text-slate-800 dark:text-slate-200 leading-snug">{n.title}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || '/src/assets/images/avatar_user_profile_1791856742600.jpg'}
              alt={user?.name || 'User'}
              className="w-6 h-6 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate hidden md:inline">
              {user?.name || 'Sarah J.'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs"
              onClick={() => setUserMenuOpen(false)}
            >
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">{user?.role}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setCurrentPage('settings')}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace Settings</span>
                </button>
                <button
                  onClick={() => setCurrentPage('integrations')}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Integrations & API</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={signOut}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
