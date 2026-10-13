import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plug, Check, ArrowRight, ShieldCheck, Mail, Calendar, Database, Sparkles } from 'lucide-react';

export const IntegrationsPublicPage: React.FC = () => {
  const { integrations, setCurrentPage, signIn } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          Ecosystem & Connectivity
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Connect your existing go-to-market tools.
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Modular adapters allow LeadFit AI to operate with your existing email systems, CRMs, calendar schedulers, and webhook automation platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    item.connected
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {item.connected ? 'Active Adapter' : 'Supported'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold block text-slate-700 dark:text-slate-300">
                  Authentication Type:
                </span>
                <span className="capitalize">{item.authType.replace('_', ' ')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                signIn('demo@leadfit.ai', 'Sales Leader');
                setCurrentPage('integrations');
              }}
              className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-center"
            >
              Configure in Workspace
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
