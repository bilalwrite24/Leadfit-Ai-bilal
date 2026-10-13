import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  X,
  TrendingUp,
  Building,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { BuyingSignal } from '../../types';

export const BuyingSignalsPage: React.FC = () => {
  const { buyingSignals, updateSignalStatus, setCurrentPage, setActiveProspectDrawerId, prospects } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Signal Types' },
    { id: 'funding', label: 'Company Funding' },
    { id: 'hiring', label: 'Hiring & Headcount' },
    { id: 'leadership', label: 'Leadership Transitions' },
    { id: 'tech_adoption', label: 'Tech Stack Adoption' },
    { id: 'announcement', label: 'Company Announcements' },
    { id: 'competitor_engagement', label: 'Competitor Mentions' },
  ];

  const filteredSignals = buyingSignals.filter((sig) => {
    const matchesType = filterType === 'all' || sig.signalType === filterType;
    const matchesStatus = filterStatus === 'all' || sig.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleActionSignal = (sig: BuyingSignal) => {
    updateSignalStatus(sig.id, 'actioned');
    // Find matching prospect if exists or navigate to lead finder
    const match = prospects.find((p) => p.company.toLowerCase().includes(sig.company.toLowerCase()));
    if (match) {
      setCurrentPage('prospects');
      setActiveProspectDrawerId(match.id);
    } else {
      setCurrentPage('lead-finder');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Buying Signals Radar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor verified external trigger events indicating high purchase intent.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400">Total Live Signals:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {buyingSignals.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pr-2">
          <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="actioned">Actioned</option>
          </select>
        </div>
      </div>

      {/* Unsupported signal source banner per prompt section 9:
          "Website intent, only if a legitimate tracking integration exists. Make unsupported signal sources visibly unavailable until configured." */}
      <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>
            <strong>First-Party Website Intent Radar:</strong> Visibly inactive until your domain tracking script or reverse-IP connector is configured in Settings.
          </span>
        </div>
        <button
          onClick={() => setCurrentPage('settings')}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
        >
          Setup Script →
        </button>
      </div>

      {/* Signals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSignals.map((sig) => {
          return (
            <div
              key={sig.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sig.company}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{sig.domain}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        sig.status === 'new'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : sig.status === 'actioned'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {sig.status}
                    </span>
                  </div>
                </div>

                {/* Event Summary */}
                <div className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {sig.summary}
                </div>

                {/* Clear distinction: Verified Source vs AI Interpretation */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Verified Source: </span>
                      {sig.sourceUrl ? (
                        <a
                          href={sig.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{sig.sourceUrl.replace('https://', '').split('/')[0]}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span>Public Registry Records</span>
                      )}
                      <span className="text-slate-400 ml-2">· Observed {sig.observedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">AI Relevance Interpretation: </span>
                      <span>{sig.relevanceExplanation}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Matched ICP: <strong className="text-slate-600 dark:text-slate-300">{sig.matchedICP}</strong></span>
                    <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold">
                      {Math.round(sig.confidence * 100)}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  {sig.status === 'new' && (
                    <button
                      onClick={() => updateSignalStatus(sig.id, 'reviewed')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {sig.status !== 'dismissed' && (
                    <button
                      onClick={() => updateSignalStatus(sig.id, 'dismissed')}
                      className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleActionSignal(sig)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Engage Prospect</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
