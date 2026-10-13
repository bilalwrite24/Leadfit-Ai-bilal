import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';
import { NavigationTarget } from '../../types';

export const PublicFooter: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>LeadFit AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Find the right prospects. Reach them at the right moment. The autonomous B2B revenue intelligence agent platform.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('features')} className="hover:text-white transition-colors">
                  Features & Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('integrations-public')} className="hover:text-white transition-colors">
                  Integrations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('pricing')} className="hover:text-white transition-colors">
                  Pricing Plans (Free)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('developer')} className="hover:text-amber-400 text-amber-300 transition-colors font-medium">
                  Developer Profile (Bilal Iqbal)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Workspaces</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-white transition-colors">
                  Revenue Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('agents')} className="hover:text-white transition-colors">
                  Autonomous AI Agents
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('lead-finder')} className="hover:text-white transition-colors">
                  Lead Discovery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('buying-signals')} className="hover:text-white transition-colors">
                  Buying Signals Radar
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-slate-400">Strict Human Approval in the Loop</span>
              </li>
              <li>
                <span className="text-slate-400">Isolated Workspace Tenancy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} LeadFit AI Technologies. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPage('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy
            </button>
            <button onClick={() => setCurrentPage('terms')} className="hover:text-slate-300 transition-colors">
              Terms
            </button>
            <button onClick={() => setCurrentPage('sign-in')} className="hover:text-slate-300 transition-colors">
              Platform Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
