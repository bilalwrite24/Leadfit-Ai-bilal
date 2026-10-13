import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchDraftOutreach } from '../../services/geminiService';
import {
  Send,
  Plus,
  Play,
  Pause,
  Copy,
  Clock,
  Mail,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Users,
} from 'lucide-react';
import { Campaign, CampaignStep } from '../../types';

export const CampaignsPage: React.FC = () => {
  const { campaigns, addCampaign, updateCampaign, prospects, showToast } = useApp();

  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState<Campaign | null>(null);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [campName, setCampName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedProspectIds, setSelectedProspectIds] = useState<string[]>([]);
  const [generatingDrafts, setGeneratingDrafts] = useState(false);

  const [steps, setSteps] = useState<CampaignStep[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      channel: 'email',
      delayDays: 0,
      subject: 'Quick question regarding {{company}}\'s sales pipeline',
      template: 'Hi {{firstName}},\n\nNoticed {{company}}\'s recent momentum with {{recentSignal}}. Typically, revenue leaders at this stage face pipeline predictability challenges and SDR ramp hurdles.\n\nLeadFit AI equips sales teams with autonomous agents to discover high-fit prospects and detect buying signals before competitors reach them.\n\nWorth a brief 10-minute exchange this Thursday to see how peers in your space are approaching this?\n\nBest,\nSarah Jenkins',
      requiresApproval: true,
    },
    {
      id: 'step-2',
      stepNumber: 2,
      channel: 'linkedin',
      delayDays: 3,
      template: 'Hi {{firstName}}, sent an email earlier this week regarding {{company}}\'s growth. Thought I\'d drop a brief note here in case LinkedIn is more convenient!',
      requiresApproval: true,
    },
  ]);

  const handleToggleCampaignStatus = (c: Campaign) => {
    const nextStatus = c.status === 'active' ? 'paused' : 'active';
    updateCampaign(c.id, { status: nextStatus });
  };

  const handleDuplicateCampaign = (c: Campaign) => {
    const duplicate: Campaign = {
      ...c,
      id: `camp-${Date.now()}`,
      name: `${c.name} (Copy)`,
      status: 'draft',
      sentCount: 0,
      openRate: 0,
      replyRate: 0,
      positiveReplyRate: 0,
      meetingsBooked: 0,
      createdAt: 'Today',
    };
    addCampaign(duplicate);
  };

  const handleAddSequenceStep = (channel: 'email' | 'linkedin') => {
    const newStep: CampaignStep = {
      id: `step-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      channel,
      delayDays: 3,
      subject: channel === 'email' ? 'Follow-up regarding {{company}}' : undefined,
      template: `Hi {{firstName}},\n\nFollowing up to check if you had a moment to review my earlier note?`,
      requiresApproval: true,
    };
    setSteps([...steps, newStep]);
  };

  const handleUpdateStepTemplate = (index: number, template: string) => {
    const updated = [...steps];
    updated[index].template = template;
    setSteps(updated);
  };

  const handleUpdateStepSubject = (index: number, subject: string) => {
    const updated = [...steps];
    updated[index].subject = subject;
    setSteps(updated);
  };

  const handleGenerateAIDraft = async (index: number) => {
    setGeneratingDrafts(true);
    try {
      const sampleProspect = prospects[0] || {
        fullName: 'Alex Vance',
        title: 'VP of Sales',
        company: 'NexusMetric',
      };
      const res = await fetchDraftOutreach({
        prospectName: sampleProspect.fullName,
        title: sampleProspect.title,
        company: sampleProspect.company,
        channel: steps[index].channel,
        signalContext: 'Recent series funding and sales headcount growth',
        valueProposition: 'LeadFit AI identifies in-market B2B buyers and triggers automated outreach',
      });

      const updated = [...steps];
      if (res.subject) updated[index].subject = res.subject;
      updated[index].template = res.body;
      setSteps(updated);
      showToast('Generated personalized sequence copy with Gemini', 'success');
    } catch (err) {
      showToast('Could not generate draft; please edit manually.', 'error');
    } finally {
      setGeneratingDrafts(false);
    }
  };

  const handleCreateCampaign = () => {
    if (!campName.trim()) {
      showToast('Please specify a campaign name', 'error');
      return;
    }
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: campName.trim(),
      status: 'active',
      targetAudience: targetAudience || 'Selected ICP prospects',
      prospectCount: selectedProspectIds.length || 25,
      steps,
      sentCount: 0,
      openRate: 0,
      replyRate: 0,
      positiveReplyRate: 0,
      meetingsBooked: 0,
      createdAt: 'Today',
    };
    addCampaign(newCampaign);
    setBuilderOpen(false);
    setWizardStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Outreach Campaigns</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-channel outreach sequences with strict human-in-the-loop approval.
          </p>
        </div>

        <button
          onClick={() => {
            setCampName('Q4 Enterprise RevOps Wave');
            setTargetAudience('VPs of Sales & RevOps with recent hiring announcements');
            setSelectedProspectIds(prospects.map((p) => p.id));
            setBuilderOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => {
          const isActive = c.status === 'active';
          return (
            <div
              key={c.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      Created {c.createdAt}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {c.targetAudience}
                </p>

                {/* Steps summary */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {c.steps.length} Steps:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {c.steps.map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium flex items-center gap-1"
                      >
                        {st.channel === 'email' ? <Mail className="w-2.5 h-2.5" /> : <Linkedin className="w-2.5 h-2.5" />}
                        <span>Day {st.delayDays}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance counters */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sent</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {c.sentCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Open Rate</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {c.openRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Reply Rate</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {c.replyRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Meetings</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {c.meetingsBooked}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setSelectedCampaignForDetail(c)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Sequence →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicateCampaign(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Duplicate Campaign"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleCampaignStatus(c)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isActive ? 'Pause' : 'Resume'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaignForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedCampaignForDetail.name}
                </h3>
                <span className="text-xs text-slate-400">{selectedCampaignForDetail.targetAudience}</span>
              </div>
              <button
                onClick={() => setSelectedCampaignForDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Sequence Steps (All require human approval before send)
              </span>

              {selectedCampaignForDetail.steps.map((st, i) => (
                <div
                  key={st.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                      {st.channel === 'email' ? <Mail className="w-4 h-4 text-indigo-500" /> : <Linkedin className="w-4 h-4 text-sky-500" />}
                      <span>Step {st.stepNumber}: {st.channel.toUpperCase()} (Day {st.delayDays})</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">Human Approval Enforced</span>
                  </div>

                  {st.subject && (
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      Subject: {st.subject}
                    </div>
                  )}

                  <div className="whitespace-pre-line text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                    {st.template}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedCampaignForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-step Campaign Builder Modal */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Multi-Step Campaign Builder
                </h2>
                <div className="text-[11px] text-slate-500">
                  Step {wizardStep} of 4 · Human Approval Safeguard Active
                </div>
              </div>
              <button
                onClick={() => setBuilderOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Campaign Details & Audience
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      Name your sequence and designate your target prospect segment.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={campName}
                        onChange={(e) => setCampName(e.target.value)}
                        placeholder="e.g. Series A/B Outbound Wave"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Target Audience Description
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g. CROs & VP Sales at Series B tech firms with hiring signals"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Select Qualified Prospects ({selectedProspectIds.length} chosen)
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      Choose which verified prospects enter this campaign queue.
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {prospects.map((p) => {
                      const isChecked = selectedProspectIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProspectIds((prev) =>
                              prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white block">
                                {p.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {p.title} at {p.company}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            Score {p.icpScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Sequence Steps & Copy Drafts
                      </h3>
                      <p className="text-slate-500 mt-0.5">
                        Customize email & LinkedIn touches. Personalize with variables like {'{{company}}'} or {'{{recentSignal}}'}.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddSequenceStep('email')}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        + Add Email
                      </button>
                      <button
                        onClick={() => handleAddSequenceStep('linkedin')}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        + Add LinkedIn
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {steps.map((st, i) => (
                      <div
                        key={st.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Step {st.stepNumber}: {st.channel === 'email' ? 'Email Touch' : 'LinkedIn InMail'} (Wait {st.delayDays} days)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGenerateAIDraft(i)}
                            disabled={generatingDrafts}
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Draft with Gemini</span>
                          </button>
                        </div>

                        {st.channel === 'email' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject</label>
                            <input
                              type="text"
                              value={st.subject || ''}
                              onChange={(e) => handleUpdateStepSubject(i, e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Message Body</label>
                          <textarea
                            rows={4}
                            value={st.template}
                            onChange={(e) => handleUpdateStepTemplate(i, e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Review & Launch Configuration
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      Verify settings before activating this campaign.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                      <span className="text-slate-400">Campaign Name</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{campName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                      <span className="text-slate-400">Target Prospects</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedProspectIds.length} accounts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                      <span className="text-slate-400">Sequence Steps</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{steps.length} multi-touch steps</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Human Approval Rule</span>
                      <span className="font-semibold text-emerald-600">Strictly Enforced (No auto-sends)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep((s) => s - 1)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  onClick={() => setBuilderOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
              )}

              {wizardStep < 4 ? (
                <button
                  onClick={() => setWizardStep((s) => s + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleCreateCampaign}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate Campaign</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
