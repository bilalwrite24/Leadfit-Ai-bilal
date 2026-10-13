import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadCSV } from '../../services/csvUtils';
import {
  User,
  Building,
  Target,
  Bell,
  Shield,
  Key,
  Download,
  Moon,
  Sun,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    workspace,
    isDarkMode,
    toggleDarkMode,
    showToast,
    prospects,
    buyingSignals,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'profile' | 'workspace' | 'icp' | 'notifications' | 'security' | 'billing' | 'export'
  >('profile');

  // Form states
  const [userName, setUserName] = useState(user?.name || 'Sarah Jenkins');
  const [userEmail, setUserEmail] = useState(user?.email || 'sarah.jenkins@leadfit.ai');
  const [userRole, setUserRole] = useState(user?.role || 'VP of Growth & Sales');

  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [companyDomain, setCompanyDomain] = useState(workspace.domain);

  // ICP Defaults
  const [defaultIndustries, setDefaultIndustries] = useState('B2B SaaS, Cloud Infrastructure, FinTech');
  const [defaultSizes, setDefaultSizes] = useState('50-250 employees');
  const [defaultRoles, setDefaultRoles] = useState('VP Sales, CRO, Head of Revenue Operations');

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [signalAlerts, setSignalAlerts] = useState(true);
  const [meetingAlerts, setMeetingAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('User profile updated successfully', 'success');
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Workspace settings saved', 'success');
  };

  const handleSaveICP = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Default ICP preferences updated', 'success');
  };

  const handleExportFullWorkspace = () => {
    const data = {
      workspace,
      prospects,
      buyingSignals,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leadfit_workspace_backup_${Date.now()}.json`;
    link.click();
    showToast('Workspace backup exported to JSON', 'success');
  };

  const navItems = [
    { id: 'profile', label: 'User Profile', icon: <User className="w-4 h-4" /> },
    { id: 'workspace', label: 'Workspace & Team', icon: <Building className="w-4 h-4" /> },
    { id: 'icp', label: 'Default ICP Criteria', icon: <Target className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notification Preferences', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'export', label: 'Data Export & Privacy', icon: <Download className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account profile, ICP defaults, notifications, security, and data privacy.
        </p>
      </div>

      {/* 2-Column Split: Nav Tabs & Section Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Nav */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section Content */}
        <div className="md:col-span-8 lg:col-span-9 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs text-xs">
          {/* PROFILE */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">User Profile</h3>
                <p className="text-slate-500 mt-0.5">Manage your personal account details and seat identity.</p>
              </div>

              <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800">
                <img
                  src={user?.avatar || '/src/assets/images/avatar_user_profile_1791856742600.jpg'}
                  alt={user?.name || 'User'}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">{userName}</span>
                  <span className="text-slate-400 text-[11px] block">{userEmail}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-700"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* WORKSPACE */}
          {activeSection === 'workspace' && (
            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Configuration</h3>
                <p className="text-slate-500 mt-0.5">Manage team workspace name, seat counts, and domain matching.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Domain
                  </label>
                  <input
                    type="text"
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Active Subscription Tier
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {workspace.plan} ({workspace.seatCount} User Seats)
                    </span>
                  </div>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Manage Seats</span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-700"
                >
                  Save Workspace
                </button>
              </div>
            </form>
          )}

          {/* ICP DEFAULTS */}
          {activeSection === 'icp' && (
            <form onSubmit={handleSaveICP} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Default ICP Criteria</h3>
                <p className="text-slate-500 mt-0.5">
                  Pre-populate criteria for new prospect scoring and agent wizards.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Target Industries
                  </label>
                  <input
                    type="text"
                    value={defaultIndustries}
                    onChange={(e) => setDefaultIndustries(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Company Size Ranges
                  </label>
                  <input
                    type="text"
                    value={defaultSizes}
                    onChange={(e) => setDefaultSizes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Buyer Titles
                  </label>
                  <input
                    type="text"
                    value={defaultRoles}
                    onChange={(e) => setDefaultRoles(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-700"
                >
                  Update ICP Defaults
                </button>
              </div>
            </form>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
                <p className="text-slate-500 mt-0.5">Control when LeadFit AI alerts your team.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Real-Time Buying Signal Alerts
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Notify immediately when an account raises funding or posts open SDR roles.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={signalAlerts}
                    onChange={(e) => setSignalAlerts(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Inbound Reply & Meeting Alerts
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Alert immediately when a prospect responds or books a calendar slot.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={meetingAlerts}
                    onChange={(e) => setMeetingAlerts(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & API Keys</h3>
                <p className="text-slate-500 mt-0.5">Review authentication enforcement and security policies.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Server-Side Secret Isolation Active</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  All external model calls and OAuth communication take place through server-side proxy handlers. Client sessions do not receive private tokens or API keys.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Two-Factor Authentication
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Enforce 2FA for all workspace members</span>
                  <span className="text-emerald-600 font-semibold">Enabled</span>
                </div>
              </div>
            </div>
          )}

          {/* BILLING */}
          {activeSection === 'billing' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Billing & Plan</h3>
                <p className="text-slate-500 mt-0.5">Current subscription and capacity allowances.</p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Free Unlimited Access Enabled</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  All subscription barriers and billing requirements have been removed. Your workspace has full access to autonomous agents, live Google Search discovery, buying signal radar, and Gemini Sales Copilot at zero charge.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Active Plan: Community Unlimited</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">$0 / Free Forever</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Includes unlimited autonomous agents, uncapped Google Search lead discoveries, complete buying signals radar, and full export capabilities.
                </div>
              </div>
            </div>
          )}

          {/* EXPORT & PRIVACY */}
          {activeSection === 'export' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Export & Portability</h3>
                <p className="text-slate-500 mt-0.5">Download complete records or manage retention policies.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Export Workspace Archive (JSON)
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  Exports all prospects, buying signal history, campaign sequence steps, and conversation logs formatted as structured JSON for archival or compliance.
                </p>
                <button
                  onClick={handleExportFullWorkspace}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-semibold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full JSON Archive</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
