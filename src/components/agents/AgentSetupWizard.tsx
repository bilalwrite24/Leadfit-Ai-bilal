import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchSuggestedICP, SuggestedICPResponse } from '../../services/geminiService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Bot,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Agent } from '../../types';

interface AgentSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentSetupWizard: React.FC<AgentSetupWizardProps> = ({ isOpen, onClose }) => {
  const { addAgent, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState<SuggestedICPResponse | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState('Nexus Cloud Solutions');
  const [website, setWebsite] = useState('https://nexuscloud.io');
  const [companyDesc, setCompanyDesc] = useState(
    'We provide cloud cost optimization and automated Kubernetes cluster autoscaling for mid-market engineering teams.'
  );
  const [products, setProducts] = useState(
    'CloudScale Autonomous Engine, FinOps Cost Explorer, Kubernetes Infrastructure Optimizer'
  );

  const [targetIndustries, setTargetIndustries] = useState('B2B SaaS, DevOps & Infrastructure, FinTech');
  const [targetCountries, setTargetCountries] = useState('United States, Canada, United Kingdom, Germany');
  const [companySizes, setCompanySizes] = useState('51-200, 201-500 employees');
  const [decisionMakerRoles, setDecisionMakerRoles] = useState('VP of Engineering, Head of DevOps, CTO, VP of Infrastructure');

  const [excludedIndustries, setExcludedIndustries] = useState('Consumer Goods, Retail Brick-and-Mortar, Real Estate');
  const [excludedTitles, setExcludedTitles] = useState('Intern, Junior Recruiter, Office Manager');
  const [excludedAccounts, setExcludedAccounts] = useState('acme-corp.com, competitor-one.io');

  const [selectedSignals, setSelectedSignals] = useState<string[]>([
    'Funding Rounds (Series A/B/C)',
    'Engineering & DevOps Headcount Growth',
    'Executive Leadership Changes',
    'Modern Cloud Tech Stack Adoption',
  ]);

  const [prospectingCadence, setProspectingCadence] = useState('Daily Morning Batch');
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'both'>('both');
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);

  if (!isOpen) return null;

  const handleRequestGeminiSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const result = await fetchSuggestedICP({
        companyName,
        website,
        description: companyDesc,
        products,
      });
      setSuggestionResult(result);
      if (result) {
        setTargetIndustries(result.targetIndustries.join(', '));
        setCompanySizes(result.companySizes.join(', '));
        setDecisionMakerRoles(result.decisionMakerRoles.join(', '));
        setTargetCountries(result.targetGeographies.join(', '));
      }
      showToast('Gemini suggested target ICP parameters based on your company details', 'info');
    } catch (err) {
      showToast('Could not fetch suggestions; you may configure fields manually.', 'error');
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleToggleSignal = (sig: string) => {
    setSelectedSignals((prev) =>
      prev.includes(sig) ? prev.filter((s) => s !== sig) : [...prev, sig]
    );
  };

  const handleFinish = () => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: `${companyName} Prospector`,
      role: 'Prospect Discovery Agent',
      description: `Autonomous agent scouting for ${targetIndustries} across ${targetCountries}.`,
      targetICP: `${companySizes} · ${decisionMakerRoles}`,
      status: 'active',
      lastRun: 'Just now',
      leadsDiscovered: 0,
      qualificationRate: 90.0,
      cadence: prospectingCadence,
      filters: {
        industries: targetIndustries.split(',').map((s) => s.trim()),
        companySizes: companySizes.split(',').map((s) => s.trim()),
        locations: targetCountries.split(',').map((s) => s.trim()),
        seniority: decisionMakerRoles.split(',').map((s) => s.trim()),
      },
      activityLog: [
        {
          timestamp: 'Just now',
          action: 'Agent Initialized',
          details: 'Created with custom ICP criteria and buying signal radar.',
        },
      ],
    };

    addAgent(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with progress */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Autonomous Agent Setup Wizard
              </h2>
              <div className="text-[11px] text-slate-500">
                Step {step} of 7 · Progress {Math.round((step / 7) * 100)}%
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 1: Company Profile & Website
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Provide your organization details so the agent understands what your business solves.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Description & Core Value Proposition
                  </label>
                  <textarea
                    rows={3}
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 2: Products & Solutions Offered
                </h3>
                <p className="text-slate-500 mt-0.5">
                  List specific products, modules, or services your sales team sells.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Products and Solutions
                </label>
                <textarea
                  rows={4}
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  placeholder="e.g. Enterprise Security Suite, SOC2 Automated Compliance Monitor"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Gemini Suggestion CTA */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200 block">
                    Want AI to suggest your target ICP in Step 3?
                  </span>
                  <p className="text-indigo-800/80 dark:text-indigo-300 text-[11px] leading-relaxed">
                    Gemini 3.8 Flash can analyze your company description and products to suggest optimal target industries, roles, and sizes. You will review everything before saving.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequestGeminiSuggestion}
                    disabled={loadingSuggestion}
                    className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-700 transition-colors"
                  >
                    {loadingSuggestion ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate ICP Suggestions</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 3: Target Customer Profile (ICP)
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Define the criteria for accounts and decision makers you want to discover.
                </p>
              </div>

              {suggestionResult && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px]">
                  <strong>AI Suggestion Applied:</strong> {suggestionResult.qualificationRationale}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Industries
                  </label>
                  <input
                    type="text"
                    value={targetIndustries}
                    onChange={(e) => setTargetIndustries(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Countries / Geographies
                  </label>
                  <input
                    type="text"
                    value={targetCountries}
                    onChange={(e) => setTargetCountries(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Company Sizes
                    </label>
                    <input
                      type="text"
                      value={companySizes}
                      onChange={(e) => setCompanySizes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Decision-Maker Roles
                    </label>
                    <input
                      type="text"
                      value={decisionMakerRoles}
                      onChange={(e) => setDecisionMakerRoles(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 4: Exclusions & Negative Criteria
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Prevent the agent from contacting companies or job titles that are out of scope.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Excluded Industries
                  </label>
                  <input
                    type="text"
                    value={excludedIndustries}
                    onChange={(e) => setExcludedIndustries(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Excluded Job Titles
                  </label>
                  <input
                    type="text"
                    value={excludedTitles}
                    onChange={(e) => setExcludedTitles(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Existing Customers & Competitor Domains (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={excludedAccounts}
                    onChange={(e) => setExcludedAccounts(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 5: Select Buying Signals to Monitor
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Choose which public and verifiable trigger events prompt outreach readiness.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  'Funding Rounds (Series A/B/C)',
                  'Engineering & DevOps Headcount Growth',
                  'Executive Leadership Changes (First 90 days)',
                  'Modern Cloud Tech Stack Adoption',
                  'Competitor Evaluation Mentions',
                  'Public Product or Regional Expansion Announcements',
                ].map((sig) => {
                  const isSelected = selectedSignals.includes(sig);
                  return (
                    <button
                      type="button"
                      key={sig}
                      onClick={() => handleToggleSignal(sig)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{sig}</span>
                      <CheckCircle2
                        className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300 dark:text-slate-700'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 6: Prospecting & Outreach Preferences
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Configure scheduling frequency and approval controls.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Agent Discovery Cadence
                  </label>
                  <select
                    value={prospectingCadence}
                    onChange={(e) => setProspectingCadence(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Hourly background schedule">Continuous / Hourly</option>
                    <option value="Daily Morning Batch">Daily Morning Batch (08:00 Local)</option>
                    <option value="Weekly Review">Weekly Pipeline Refresh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Outreach Channels
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOutreachChannel('email')}
                      className={`p-3 rounded-xl border text-center font-medium ${
                        outreachChannel === 'email'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Email Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutreachChannel('both')}
                      className={`p-3 rounded-xl border text-center font-medium ${
                        outreachChannel === 'both'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Email + LinkedIn Steps
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Enforce Human Approval
                    </span>
                    <span className="text-[11px] text-slate-500">
                      All messages must be manually approved in the Campaign or Inbox queue before sending.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireHumanApproval}
                    onChange={(e) => setRequireHumanApproval(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 7: Review Proposed ICP & Agent Configuration
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Confirm your parameters before deploying the autonomous sales agent.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 font-medium">Company</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{companyName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 font-medium">Target Industries</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{targetIndustries}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 font-medium">Decision Makers</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{decisionMakerRoles}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 font-medium">Active Signals</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedSignals.length} triggers</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Outreach Safety</span>
                  <span className="font-semibold text-emerald-600">Strict Human Approval Enabled</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          )}

          {step < 7 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-600/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Deploy Agent</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
