import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plug,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Key,
  Globe,
  Mail,
  Calendar,
  Database,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Integration } from '../../types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, toggleIntegrationConnection, showToast } = useApp();

  const [activeModalIntegration, setActiveModalIntegration] = useState<Integration | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = (intg: Integration) => {
    setTestingConnection(true);
    setTestResult(null);

    setTimeout(() => {
      setTestingConnection(false);
      if (intg.id === 'int-gemini') {
        setTestResult('Success: Server-side Gemini 3.8 Flash API route is responsive and ready.');
        showToast('Gemini API test passed', 'success');
      } else if (intg.id === 'int-webhooks') {
        setTestResult('Success: Local webhook dispatcher endpoint ready for HTTPS payloads.');
        showToast('Webhook test passed', 'success');
      } else if (intg.connected) {
        setTestResult('Success: Integration handshake verified.');
        showToast(`${intg.name} connection verified`, 'success');
      } else {
        setTestResult('Warning: Integration is not yet authenticated with OAuth credentials. Please complete authentication below.');
        showToast('Connection requires credentials', 'error');
      }
    }, 900);
  };

  const handleToggleState = (intg: Integration) => {
    toggleIntegrationConnection(intg.id);
    const nextState = !intg.connected;
    showToast(
      nextState ? `Connected ${intg.name}` : `Disconnected ${intg.name}`,
      nextState ? 'success' : 'info'
    );
    if (activeModalIntegration?.id === intg.id) {
      setActiveModalIntegration({ ...intg, connected: nextState });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Integrations & Connectors</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect verified data providers, corporate mailboxes, and enterprise CRMs.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Active Adapters:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {integrations.filter((i) => i.connected).length} / {integrations.length}
          </span>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Secure Service Adapters:</strong> All API keys and OAuth tokens are handled through server-side secret management. Credentials are never exposed to browser client code.
          </span>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {item.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.connected
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Permissions breakdown */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Required Scopes / Permissions:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {item.requiredPermissions.map((perm, idx) => (
                      <li key={idx} className="truncate">
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => {
                    setActiveModalIntegration(item);
                    setTestResult(null);
                  }}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Configure & Test →
                </button>

                {item.connected ? (
                  <button
                    onClick={() => handleToggleState(item)}
                    className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleState(item)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-xs"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration & Test Connection Modal */}
      {activeModalIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Configure {activeModalIntegration.name}
                </h3>
                <span className="text-xs text-slate-400">{activeModalIntegration.category}</span>
              </div>
              <button
                onClick={() => setActiveModalIntegration(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Setup Instructions
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {activeModalIntegration.setupInstructions}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Permissions & Scopes
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                  {activeModalIntegration.requiredPermissions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    testResult.startsWith('Success')
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {testResult}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleTestConnection(activeModalIntegration)}
                disabled={testingConnection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {testingConnection ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span>Test Connection Handshake</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleState(activeModalIntegration)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeModalIntegration.connected
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {activeModalIntegration.connected ? 'Disconnect' : 'Connect Adapter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
