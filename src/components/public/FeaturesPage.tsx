import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserSearch,
  Radio,
  Target,
  Send,
  Inbox,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { setCurrentPage, signIn } = useApp();

  const features = [
    {
      title: 'Real-Time Buying Signal Radar',
      description: 'Never reach out cold again. LeadFit AI tracks external intent indicators so your team contacts accounts right when they need you.',
      points: [
        'Verified funding announcements from SEC filings and venture databases',
        'Headcount surges and specific SDR / AE open job board listings',
        'Executive C-level and VP leadership transition alerts in first 90 days',
        'Published tech stack migrations and modern tooling announcements',
      ],
      icon: <Radio className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Explainable ICP Lead Qualification',
      description: 'Say goodbye to ambiguous black-box qualification numbers. Every prospect receives transparent evaluation breakdown.',
      points: [
        'Custom scoring rules based on headcount, industry, and decision-maker roles',
        'Specific highlighted advantages and conversation opening angles',
        'Clear detection of deal risks (e.g., competing stack, sub-threshold headcount)',
        'Actionable recommended next step generated for every account',
      ],
      icon: <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Contextual Multi-Channel Personalization',
      description: 'Draft emails and LinkedIn touches that sound authentically human and cite verified company milestones.',
      points: [
        'Automated referencing of observed buying signals in sequence touch #1',
        'Strict human-in-the-loop approval prevents any unintended outbound sends',
        'Custom business hours, timezone delivery, and multi-step delays',
        'Seamless variable interpolation: {{company}}, {{title}}, {{recentSignal}}',
      ],
      icon: <Send className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Unified Inbox with Gemini Reply Analysis',
      description: 'Handle all inbound prospect responses from a single prioritized command desk.',
      points: [
        'Automatic sentiment and intent classification (Interested, Needs Info, Timing Objection)',
        'Context-aware suggested reply drafts ready for fast one-click approval',
        'One-click meeting link insertion and calendar scheduling coordination',
        'Direct lead status synchronization across the pipeline',
      ],
      icon: <Inbox className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          Platform Architecture & Capabilities
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for high-conversion B2B pipeline generation.
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Every capability in LeadFit AI is built with transparency, strict human verification, and verifiable signal intelligence to ensure your outbound never looks like automated spam.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center">
              {feat.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {feat.description}
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {feat.points.map((p, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Human-in-the-loop guarantee banner */}
      <div className="p-8 rounded-2xl border border-indigo-200 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Strict Human-in-the-Loop Safeguard</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike reckless automated blast tools, LeadFit AI never transmits an email or LinkedIn message without your explicit approval. Every draft is presented in the Campaign and Inbox queues for review.
          </p>
        </div>
        <button
          onClick={() => signIn('demo@leadfit.ai', 'Sales Leader')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl whitespace-nowrap shadow-sm shadow-indigo-600/20"
        >
          Launch Live App
        </button>
      </div>
    </div>
  );
};
