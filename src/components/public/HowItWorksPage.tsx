import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Bot, Target, Radio, CheckCircle, Zap } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentPage, signIn } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Company & Solution Input',
      desc: 'Enter your company URL and solution parameters. LeadFit AI analyzes your value proposition, pain points addressed, and customer segments.',
      detail: 'Our ICP suggestion engine utilizes server-side Gemini 3.8 Flash to suggest target verticals, employee tiers, and titles.',
    },
    {
      step: '02',
      title: 'Autonomous Radar Deployment',
      desc: 'Specialized background agents monitor verified corporate registries, venture capital announcements, job boards, and verified public channels.',
      detail: 'Signals are categorized into Funding, Hiring, Leadership Transitions, and Technology Adoptions with source URLs logged.',
    },
    {
      step: '03',
      title: 'Fit Scoring & Deep Research',
      desc: 'Each identified prospect is scored against your ICP criteria (0-100) and enriched with comprehensive background intelligence.',
      detail: 'Clear reasons, competitive angles, and risk assessments are prepared for your review before any outreach begins.',
    },
    {
      step: '04',
      title: 'Human-Approved Outreach Execution',
      desc: 'Multi-touch sequences are drafted automatically. Your sales reps inspect and approve each communication with one click.',
      detail: 'All inbound replies land in your Unified Inbox with AI sentiment classification and suggested response drafts.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          Workflow Architecture
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How LeadFit AI converts signals into confirmed meetings.
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          See the end-to-end data pipeline from initial ICP configuration to human-approved sequence dispatch and meeting calendar booking.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((st) => (
          <div
            key={st.step}
            className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            <div className="md:col-span-2 font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {st.step}
            </div>
            <div className="md:col-span-5 space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{st.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              {st.detail}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <button
          onClick={() => signIn('demo@leadfit.ai', 'Sales Leader')}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20"
        >
          <span>Try the Agent Setup Wizard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
