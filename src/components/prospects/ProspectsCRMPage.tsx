import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { exportProspectsToCSV, downloadCSV } from '../../services/csvUtils';
import { fetchCompanyResearch, fetchQualificationExplanation } from '../../services/geminiService';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Building,
  Mail,
  Linkedin,
  MapPin,
  X,
  Plus,
  Sparkles,
  Loader2,
  Calendar,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Prospect } from '../../types';

export const ProspectsCRMPage: React.FC = () => {
  const {
    prospects,
    updateProspect,
    deleteProspect,
    activeProspectDrawerId,
    setActiveProspectDrawerId,
    showToast,
    setCurrentPage,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'icpScore' | 'fullName' | 'company'>('icpScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Drawer research state
  const [loadingResearch, setLoadingResearch] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const activeProspect = prospects.find((p) => p.id === activeProspectDrawerId);

  // Filter & Sort
  const filteredProspects = prospects
    .filter((p) => {
      const matchQuery =
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.company.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchQuery && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === 'icpScore') {
        return sortAsc ? a.icpScore - b.icpScore : b.icpScore - a.icpScore;
      }
      if (sortField === 'fullName') {
        return sortAsc ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName);
      }
      return sortAsc ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
    });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProspects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProspects.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus: Prospect['status']) => {
    selectedIds.forEach((id) => {
      updateProspect(id, { status: newStatus });
    });
    showToast(`Updated status for ${selectedIds.length} prospects`, 'success');
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteProspect(id));
    setSelectedIds([]);
    showToast('Deleted selected prospects', 'info');
  };

  const handleExportSelected = () => {
    const toExport = prospects.filter((p) => selectedIds.includes(p.id));
    const csv = exportProspectsToCSV(toExport.length > 0 ? toExport : filteredProspects);
    downloadCSV('leadfit_crm_prospects.csv', csv);
    showToast('Exported prospects to CSV', 'success');
  };

  // Drawer Gemini Real-Time Enrichers
  const handleEnrichResearch = async () => {
    if (!activeProspect) return;
    setLoadingResearch(true);
    try {
      const res = await fetchCompanyResearch({
        companyName: activeProspect.company,
        industry: activeProspect.industry,
        rawNotes: activeProspect.scoreExplanation,
      });
      updateProspect(activeProspect.id, {
        companyResearchSummary: res.summary,
        keyAngles: res.keyAngles,
      });
      showToast('Generated company intelligence summary', 'success');
    } catch (err) {
      showToast('Could not fetch research at this time', 'error');
    } finally {
      setLoadingResearch(false);
    }
  };

  const handleExplainScore = async () => {
    if (!activeProspect) return;
    setLoadingExplanation(true);
    try {
      const res = await fetchQualificationExplanation({
        prospectName: activeProspect.fullName,
        company: activeProspect.company,
        score: activeProspect.icpScore,
        signals: activeProspect.buyingSignals,
      });
      updateProspect(activeProspect.id, {
        scoreExplanation: res.explanation,
        strengths: res.strengths,
      });
      showToast('Computed ICP qualification breakdown', 'success');
    } catch (err) {
      showToast('Failed to evaluate qualification explanation', 'error');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleAddNote = () => {
    if (!activeProspect || !newNoteText.trim()) return;
    const updatedNotes = [...(activeProspect.notes || []), newNoteText.trim()];
    updateProspect(activeProspect.id, { notes: updatedNotes });
    setNewNoteText('');
    showToast('Note added to profile', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Prospects CRM</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Searchable pipeline database with qualification scores, verified contacts, and history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSelected}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Bulk Bar */}
      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, title..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            <option value="all">All Lead Statuses</option>
            <option value="new">New</option>
            <option value="qualifying">Qualifying</option>
            <option value="ready_for_outreach">Ready for Outreach</option>
            <option value="contacted">Contacted</option>
            <option value="meeting_scheduled">Meeting Scheduled</option>
            <option value="nurture">Nurture</option>
          </select>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="icpScore">ICP Fit Score</option>
              <option value="fullName">Full Name</option>
              <option value="company">Company</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
            >
              {sortAsc ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions banner if selected */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200">
          <div className="flex items-center gap-2 font-semibold">
            <span>{selectedIds.length} prospects selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('ready_for_outreach')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Mark Ready for Outreach
            </button>
            <button
              onClick={() => handleBulkStatusChange('nurture')}
              className="px-2.5 py-1 rounded-lg border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              Move to Nurture
            </button>
            <button
              onClick={handleBulkDelete}
              className="p-1 text-rose-600 hover:text-rose-700"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Prospects CRM Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-400 font-semibold select-none">
                <th className="p-3.5 w-10">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.length === filteredProspects.length && filteredProspects.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Prospect & Title</th>
                <th className="p-3.5">Company & Headcount</th>
                <th className="p-3.5">ICP Score</th>
                <th className="p-3.5">Buying Signals</th>
                <th className="p-3.5">Email Status</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200">
              {filteredProspects.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleSelect(p.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Name & Title */}
                    <td className="p-3.5">
                      <div
                        onClick={() => setActiveProspectDrawerId(p.id)}
                        className="cursor-pointer group"
                      >
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {p.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.title}</div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.company}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.employeeCount} · {p.industry}
                      </div>
                    </td>

                    {/* ICP Score */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {p.icpScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </div>
                    </td>

                    {/* Signals */}
                    <td className="p-3.5">
                      {p.buyingSignals.length > 0 ? (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {p.buyingSignals[0].type}: {p.buyingSignals[0].summary.slice(0, 24)}...
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">No active signal</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="p-3.5">
                      <span
                        className={`text-[11px] font-medium ${
                          p.emailStatus === 'verified'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {p.emailStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <select
                        value={p.status}
                        onChange={(e) => updateProspect(p.id, { status: e.target.value as any })}
                        className="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-[11px] font-medium"
                      >
                        <option value="new">New</option>
                        <option value="qualifying">Qualifying</option>
                        <option value="ready_for_outreach">Ready for Outreach</option>
                        <option value="contacted">Contacted</option>
                        <option value="meeting_scheduled">Meeting Scheduled</option>
                        <option value="nurture">Nurture</option>
                        <option value="disqualified">Disqualified</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setActiveProspectDrawerId(p.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        View Profile →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Prospect Profile Drawer */}
      {activeProspect && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center">
                  {activeProspect.firstName[0]}
                  {activeProspect.lastName[0]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeProspect.fullName}
                  </h2>
                  <div className="text-xs text-slate-400">
                    {activeProspect.title} at {activeProspect.company}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveProspectDrawerId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              {/* Score & Qualification Section */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      ICP Fit Rating
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {activeProspect.icpScore}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <button
                    onClick={handleExplainScore}
                    disabled={loadingExplanation}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-700 transition-colors"
                  >
                    {loadingExplanation ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Re-evaluate with Gemini</span>
                  </button>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeProspect.scoreExplanation}
                </p>

                {activeProspect.strengths && activeProspect.strengths.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">Key Strengths:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProspect.strengths.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact & Verification Info */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Contact Information
                </span>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeProspect.email}</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Verified
                    </span>
                  </div>

                  {activeProspect.linkedinUrl && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[260px]">{activeProspect.linkedinUrl}</span>
                      </div>
                      <a
                        href={activeProspect.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeProspect.location}</span>
                  </div>
                </div>
              </div>

              {/* Company Research Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Company Research
                  </span>
                  <button
                    onClick={handleEnrichResearch}
                    disabled={loadingResearch}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {loadingResearch ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>Generate AI Context</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeProspect.companyResearchSummary || (
                    <span className="italic text-slate-400">
                      No research brief generated yet. Click "Generate AI Context" above to summarize company background.
                    </span>
                  )}
                </div>

                {activeProspect.keyAngles && activeProspect.keyAngles.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block">
                      Recommended Conversation Angles:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      {activeProspect.keyAngles.map((ang, i) => (
                        <li key={i}>{ang}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Buying Signals Timeline */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Observed Buying Signals
                </span>
                {activeProspect.buyingSignals.length > 0 ? (
                  <div className="space-y-2">
                    {activeProspect.buyingSignals.map((bs, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{bs.type}</span>
                          <span className="font-mono text-[10px] text-slate-400">{bs.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{bs.summary}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-400 text-xs">
                    No active signals observed yet. Monitored by Buying Signal Radar.
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Internal Notes & Rep Comments
                </span>
                <div className="space-y-2">
                  {activeProspect.notes.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                      {n}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an internal note..."
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-semibold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveProspectDrawerId(null);
                  setCurrentPage('campaigns');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Create Outreach Sequence</span>
              </button>

              <button
                onClick={() => setActiveProspectDrawerId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
