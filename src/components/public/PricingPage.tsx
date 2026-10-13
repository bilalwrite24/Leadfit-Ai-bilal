import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ArrowRight, Sparkles, Globe, Bot, Radio, Send, Inbox, ShieldCheck } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { setCurrentPage, signIn } = useApp();

  const features = [
    'Unlimited Autonomous AI Agents (Prospect Discovery, Signal Radar, Qualification, Personalization)',
    'Live Prospect Discovery powered by Google Search Grounding data',
    'Full Buying Signals Radar (Funding, Hiring spikes, Leadership shifts, Tech adoption)',
    'Explainable ICP Scoring with transparent rationale & conversation angles',
    'Unlimited CSV Batch Imports and Uncapped CSV Data Exports',
    'Multi-Touch Sequence Campaign Builder with Strict Human-in-the-Loop Approval',
    'Unified Inbox with Gemini Intent & Sentiment Classification',
    'Sales Copilot AI Chatbot with Google Search grounding',
    'Multi-User Team Workspace Support',
    'No Credit Card Required · Zero Subscription Paywalls',
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free & Open Access · Zero Subscription Fees</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Every capability is completely free.
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-balance">
          We have removed all paywalls and subscription plans. Enjoy unrestricted access to autonomous prospecting, real-time buying signals, and Gemini sales intelligence.
        </p>
      </div>

      {/* Hero Single Free Tier Card */}
      <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl border-2 border-indigo-600 bg-white dark:bg-slate-900 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              LeadFit AI Full Access
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Community & Pro Unlimited
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Everything unlocked for all revenue leaders, founders, and sales teams.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                $0
              </span>
              <span className="text-xs font-semibold text-slate-500">/ forever</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
              No credit card needed
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Included in your free workspace:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-200">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Big CTA */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Strict human approval on all outreach</span>
          </div>

          <button
            onClick={() => signIn('user@leadfit.ai', 'Sales Leader')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Free Workspace Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
