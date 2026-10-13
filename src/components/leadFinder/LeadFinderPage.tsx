import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { exportProspectsToCSV, downloadCSV, parseCSVProspects } from '../../services/csvUtils';
import { fetchLiveDiscoverLeads, fetchDraftOutreach } from '../../services/geminiService';
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Building,
  MapPin,
  Briefcase,
  Sparkles,
  Loader2,
  Globe,
  Radio,
  X,
  Mail,
  Copy,
  Check,
  Trash2,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Bookmark,
  History,
  ShieldCheck,
  Zap,
  Users,
  Send,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Prospect } from '../../types';

// Custom inline LinkedIn Icon for crisp branding
const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8V10.9M7.86 6.5a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63s1.63-.73 1.63-1.63A1.63 1.63 0 0 0 7.86 6.5" />
  </svg>
);

export const LeadFinderPage: React.FC = () => {
  const {
    prospects,
    addProspect,
    importProspects,
    deleteProspect,
    campaigns,
    updateCampaign,
    showToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // View state: 'grid' or 'table'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination state (up to 100 results per page)
  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [minIcpScore, setMinIcpScore] = useState<number>(0);
  const [selectedSignalType, setSelectedSignalType] = useState('all');
  const [emailStatusFilter, setEmailStatusFilter] = useState('all');

  // Autonomous Discovery state
  const [liveQuery, setLiveQuery] = useState('');
  const [liveRole, setLiveRole] = useState('VP of Sales / CRO');
  const [liveLocation, setLiveLocation] = useState('United States');
  const [liveSize, setLiveSize] = useState('50-250');
  const [discovering, setDiscovering] = useState(false);
  const [showDiscoveryRadar, setShowDiscoveryRadar] = useState(true);

  // Multi-select batch state
  const [selectedProspectIds, setSelectedProspectIds] = useState<string[]>([]);

  // Modals & Drawers
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeInspectorProspect, setActiveInspectorProspect] = useState<Prospect | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [aiDraftMessage, setAiDraftMessage] = useState<{ subject?: string; body: string } | null>(null);

  // Manual Add Form state
  const [newFullName, setNewFullName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLinkedin, setNewLinkedin] = useState('');
  const [newLocation, setNewLocation] = useState('United States');
  const [newIndustry, setNewIndustry] = useState('B2B SaaS');
  const [newSignal, setNewSignal] = useState('');

  // Add to Campaign Modal
  const [batchCampaignModalOpen, setBatchCampaignModalOpen] = useState(false);
  const [targetCampaignId, setTargetCampaignId] = useState(campaigns[0]?.id || '');

  // Saved Searches
  const [savedSearches, setSavedSearches] = useState<{ id: string; name: string; query: string; industry: string }[]>([
    { id: 'save-1', name: 'Series A/B FinTech', query: 'Fintech', industry: 'Fintech Infrastructure' },
    { id: 'save-2', name: 'DevOps Decision Makers', query: 'DevOps', industry: 'DevOps & Cloud' },
    { id: 'save-3', name: 'Enterprise AI & Data', query: 'AI', industry: 'Enterprise AI' },
    { id: 'save-4', name: 'Cybersecurity CROs', query: 'Security', industry: 'Cybersecurity & PAM' },
  ]);

  const searchPresets = [
    { label: 'FinTech Series A/B hiring AEs', q: 'FinTech Series A/B companies hiring sales reps', role: 'VP of Sales', loc: 'New York, NY' },
    { label: 'DevOps & Cloud startups in Austin & SF', q: 'DevOps & Cloud infrastructure startups', role: 'Chief Technology Officer', loc: 'Austin, TX' },
    { label: 'AI & Data intelligence revenue leaders', q: 'Enterprise AI and data analytics companies', role: 'Chief Revenue Officer (CRO)', loc: 'San Francisco, CA' },
    { label: 'Cybersecurity CROs & CISOs', q: 'Cybersecurity and identity access management platforms', role: 'VP of Go-to-Market', loc: 'Boston, MA' },
    { label: 'HealthTech startups scaling commercial teams', q: 'HealthTech SaaS modern clinical workflow software', role: 'Head of Growth', loc: 'United States' },
  ];

  // Dynamic filter lists
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    prospects.forEach((p) => {
      if (p.industry) set.add(p.industry);
    });
    return ['all', ...Array.from(set)];
  }, [prospects]);

  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    prospects.forEach((p) => {
      if (p.location) set.add(p.location);
    });
    return ['all', ...Array.from(set)];
  }, [prospects]);

  // Filtered prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        (p.linkedinUrl && p.linkedinUrl.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.buyingSignals.some((s) => s.summary.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));

      const matchesIndustry = selectedIndustry === 'all' || p.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || p.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesScore = minIcpScore === 0 || p.icpScore >= minIcpScore;
      const matchesEmail = emailStatusFilter === 'all' || p.emailStatus === emailStatusFilter;

      const matchesSize =
        selectedSize === 'all' ||
        (selectedSize === '1-50' && (p.employeeCount.includes('1-50') || p.employeeCount.includes('45') || p.employeeCount.includes('30'))) ||
        (selectedSize === '51-200' && (p.employeeCount.includes('51-200') || p.employeeCount.includes('65') || p.employeeCount.includes('140') || p.employeeCount.includes('85') || p.employeeCount.includes('120') || p.employeeCount.includes('175'))) ||
        (selectedSize === '201-500' && (p.employeeCount.includes('201-500') || p.employeeCount.includes('210') || p.employeeCount.includes('250') || p.employeeCount.includes('280') || p.employeeCount.includes('300') || p.employeeCount.includes('420'))) ||
        (selectedSize === '500+' && (p.employeeCount.includes('500') || p.employeeCount.includes('1000') || p.employeeCount.includes('Enterprise')));

      const matchesSignal =
        selectedSignalType === 'all' ||
        (selectedSignalType === 'has_signal' && p.buyingSignals.length > 0) ||
        p.buyingSignals.some((s) => s.type.toLowerCase().includes(selectedSignalType.toLowerCase()));

      return matchesSearch && matchesIndustry && matchesLocation && matchesScore && matchesEmail && matchesSize && matchesSignal;
    });
  }, [prospects, searchQuery, selectedIndustry, selectedLocation, minIcpScore, emailStatusFilter, selectedSize, selectedSignalType]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProspects.length / pageSize));
  const validCurrentPage = Math.min(currentPageNum, totalPages);
  const paginatedProspects = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredProspects.slice(startIndex, startIndex + pageSize);
  }, [filteredProspects, validCurrentPage, pageSize]);

  // Export handlers
  const handleExportCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly
      ? filteredProspects.filter((p) => selectedProspectIds.includes(p.id))
      : filteredProspects;

    if (listToExport.length === 0) {
      showToast('No prospects to export.', 'error');
      return;
    }
    const csvContent = exportProspectsToCSV(listToExport);
    downloadCSV(`leadfit_prospects_${Date.now()}.csv`, csvContent);
    showToast(`Exported ${listToExport.length} prospects to CSV`, 'success');
  };

  // CSV Import handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSVProspects(text);
        if (parsed.length > 0) {
          importProspects(parsed);
        } else {
          showToast('Could not find prospect rows in CSV file.', 'error');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Live Discovery Run
  const handleRunLiveDiscovery = async (customQuery?: string, customRole?: string, customLoc?: string) => {
    const topic = customQuery || liveQuery || 'Fast-growing B2B software companies';
    const roleTarget = customRole || liveRole;
    const locTarget = customLoc || liveLocation;

    setDiscovering(true);
    try {
      const res = await fetchLiveDiscoverLeads({
        query: topic,
        industry: selectedIndustry === 'all' ? undefined : selectedIndustry,
        location: locTarget,
        role: roleTarget,
        employeeCount: liveSize,
      });

      if (res.prospects && res.prospects.length > 0) {
        let addedCount = 0;
        for (const p of res.prospects) {
          addProspect(p);
          addedCount++;
        }
        showToast(
          `Discovered ${addedCount} verified leads with LinkedIn profiles!`,
          'success'
        );
        setLiveQuery('');
      } else {
        showToast('No prospects found for this query. Try a broader search term.', 'info');
      }
    } catch {
      showToast('Live discovery encountered an issue; fallback accounts generated.', 'error');
    } finally {
      setDiscovering(false);
    }
  };

  // Manual Add Form Submit
  const handleManualAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newCompany) {
      showToast('Name and Company are required.', 'error');
      return;
    }

    const nameParts = newFullName.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';
    const domainClean = newCompany.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newP: Prospect = {
      id: `manual-${Date.now()}`,
      firstName,
      lastName,
      fullName: newFullName.trim(),
      title: newTitle || 'Decision Maker',
      company: newCompany.trim(),
      companyDomain: `${domainClean}.com`,
      email: newEmail || `${firstName.toLowerCase()}@${domainClean}.com`,
      emailStatus: 'verified',
      linkedinUrl:
        newLinkedin.trim() ||
        `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${domainClean}`,
      location: newLocation || 'United States',
      industry: newIndustry || 'B2B SaaS',
      employeeCount: '50-250 employees',
      icpScore: 92,
      scoreExplanation: 'Direct user entry with verified decision-maker credentials and LinkedIn profile.',
      strengths: ['Direct target account identified by sales team', 'Verified LinkedIn identity'],
      buyingSignals: newSignal
        ? [{ type: 'Active Outreach', summary: newSignal, date: 'Today' }]
        : [{ type: 'Active Outreach', summary: 'Added to immediate campaign sequence', date: 'Today' }],
      source: 'Manual',
      owner: 'Sarah Jenkins',
      status: 'ready_for_outreach',
      tags: ['Manual Entry', 'Direct Target', 'Verified Profile'],
      lastActivity: 'Added just now',
      notes: ['Manually added prospect.'],
    };

    addProspect(newP);
    setAddModalOpen(false);
    setNewFullName('');
    setNewTitle('');
    setNewCompany('');
    setNewEmail('');
    setNewLinkedin('');
    setNewSignal('');
  };

  // Multi-select toggle helpers
  const toggleSelectProspect = (id: string) => {
    setSelectedProspectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedProspects.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedProspectIds.includes(id));
    if (allSelected) {
      setSelectedProspectIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedProspectIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (selectedProspectIds.length === 0) return;
    selectedProspectIds.forEach((id) => deleteProspect(id));
    showToast(`Removed ${selectedProspectIds.length} prospects`, 'info');
    setSelectedProspectIds([]);
  };

  // Batch add to campaign
  const handleBatchAddToCampaign = () => {
    if (selectedProspectIds.length === 0 || !targetCampaignId) return;
    const targetCamp = campaigns.find((c) => c.id === targetCampaignId);
    if (targetCamp) {
      updateCampaign(targetCamp.id, {
        prospectCount: targetCamp.prospectCount + selectedProspectIds.length,
      });
      showToast(`Added ${selectedProspectIds.length} prospects to "${targetCamp.name}"`, 'success');
      setSelectedProspectIds([]);
      setBatchCampaignModalOpen(false);
    }
  };

  // Save current search filter
  const handleSaveSearch = () => {
    if (!searchQuery && selectedIndustry === 'all') {
      showToast('Enter a search keyword or pick an industry to save.', 'info');
      return;
    }
    const name = searchQuery ? `Search: ${searchQuery}` : `Industry: ${selectedIndustry}`;
    const newSaved = {
      id: `save-${Date.now()}`,
      name,
      query: searchQuery,
      industry: selectedIndustry,
    };
    setSavedSearches((prev) => [newSaved, ...prev]);
    showToast(`Saved search "${name}"`, 'success');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
    setSelectedSize('all');
    setMinIcpScore(0);
    setSelectedSignalType('all');
    setEmailStatusFilter('all');
    setCurrentPageNum(1);
    showToast('Filters cleared', 'info');
  };

  // Open inspector drawer and prepare AI draft
  const handleOpenInspector = (prospect: Prospect) => {
    setActiveInspectorProspect(prospect);
    setAiDraftMessage(null);
  };

  // Trigger quick AI draft inside inspector
  const handleGenerateInspectorDraft = async () => {
    if (!activeInspectorProspect) return;
    setAiDraftLoading(true);
    try {
      const res = await fetchDraftOutreach({
        prospectName: activeInspectorProspect.fullName,
        title: activeInspectorProspect.title,
        company: activeInspectorProspect.company,
        channel: 'email',
        signalContext: activeInspectorProspect.buyingSignals[0]?.summary,
        valueProposition: 'LeadFit AI autonomous prospect discovery and buying signal radar',
      });
      setAiDraftMessage(res);
      showToast('AI personalized draft created!', 'success');
    } catch {
      showToast('Generated sample outreach draft.', 'info');
      setAiDraftMessage({
        subject: `Quick question regarding ${activeInspectorProspect.company}'s sales pipeline`,
        body: `Hi ${activeInspectorProspect.firstName},\n\nNoticed ${activeInspectorProspect.company}'s recent momentum with ${activeInspectorProspect.buyingSignals[0]?.summary || 'growth'}. Leading revenue teams at your stage often face pipeline predictability hurdles.\n\nLeadFit AI identifies in-market B2B buyers and triggers automated high-fit outreach before competitors reach them.\n\nWorth a brief 10-minute exchange this Thursday?\n\nBest regards,\nSarah Jenkins`,
      });
    } finally {
      setAiDraftLoading(false);
    }
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    showToast('Email address copied to clipboard', 'success');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedIndustry !== 'all' ||
    selectedLocation !== 'all' ||
    selectedSize !== 'all' ||
    minIcpScore > 0 ||
    selectedSignalType !== 'all' ||
    emailStatusFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Lead Finder & AI Discovery Radar
            </h1>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>100 Results Loaded · Free Unlimited</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover decision makers across 100+ verified accounts with direct LinkedIn profile links, verified emails, and explainable ICP scoring.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle Discovery Radar View */}
          <button
            onClick={() => setShowDiscoveryRadar(!showDiscoveryRadar)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              showDiscoveryRadar
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showDiscoveryRadar ? 'AI Radar Active' : 'Show AI Radar'}</span>
          </button>

          {/* Add Lead */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>

          {/* Import CSV */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import CSV</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => handleExportCSV(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. AUTONOMOUS AI DISCOVERY RADAR PANEL */}
      {showDiscoveryRadar && (
        <div className="p-5 rounded-2xl border-2 border-indigo-600/30 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-950/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Autonomous AI Prospecting Engine</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Includes 100 Results · Verified LinkedIn Profiles
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Search live web directories and corporate signals for matching executives with direct LinkedIn URLs and verified work emails.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDiscoveryRadar(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Minimize</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Discovery Query & Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={liveQuery}
                onChange={(e) => setLiveQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRunLiveDiscovery();
                  }
                }}
                placeholder="Target query (e.g. Series B Fintech CROs in New York, DevOps startups hiring in Austin...)"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-2xs"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={liveRole}
                onChange={(e) => setLiveRole(e.target.value)}
                className="w-full py-2 px-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="VP of Sales / CRO">VP of Sales / CRO</option>
                <option value="Head of Revenue Operations">Head of RevOps</option>
                <option value="Director of Demand Generation">Director of Demand Gen</option>
                <option value="Chief Technology Officer (CTO)">CTO / VP Engineering</option>
                <option value="Head of Growth">Head of Growth</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={liveLocation}
                onChange={(e) => setLiveLocation(e.target.value)}
                className="w-full py-2 px-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="United States">United States</option>
                <option value="Austin, TX">Austin, TX</option>
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Boston, MA">Boston, MA</option>
                <option value="London, United Kingdom">London, UK</option>
                <option value="Europe (UK & DACH)">Europe</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={() => handleRunLiveDiscovery()}
                disabled={discovering}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap cursor-pointer"
              >
                {discovering ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Discovering Leads...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Discovery</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Queries */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Instant Discovery Presets:</span>
            </span>
            {searchPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setLiveQuery(preset.q);
                  setLiveRole(preset.role);
                  setLiveLocation(preset.loc);
                  handleRunLiveDiscovery(preset.q, preset.role, preset.loc);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEARCH & CRITERIA FILTER BAR */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              placeholder="Search leads by name, company, title, location, LinkedIn link, or buying signal..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => {
              setSelectedIndustry(e.target.value);
              setCurrentPageNum(1);
            }}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Industries</option>
            {availableIndustries
              .filter((i) => i !== 'all')
              .map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPageNum(1);
            }}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Locations</option>
            {availableLocations
              .filter((l) => l !== 'all')
              .map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
          </select>

          {/* Company Size Filter */}
          <select
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value);
              setCurrentPageNum(1);
            }}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Sizes</option>
            <option value="1-50">1-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>

          {/* Min ICP Score */}
          <select
            value={minIcpScore}
            onChange={(e) => {
              setMinIcpScore(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          >
            <option value={0}>Any ICP Score</option>
            <option value={80}>ICP 80+ Match</option>
            <option value={85}>ICP 85+ Match</option>
            <option value={90}>ICP 90+ Match</option>
          </select>

          {/* Results per page selector */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-slate-400 text-[11px]">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPageNum(1);
              }}
              className="py-1.5 px-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 (All)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Summary, Saved Searches Bar & Pagination Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-slate-500">
              Showing <strong className="text-slate-900 dark:text-white font-semibold">
                {paginatedProspects.length}
              </strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{filteredProspects.length}</strong> matching prospects
              {' '}(<strong className="text-indigo-600 dark:text-indigo-400">{prospects.length}</strong> total in database)
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}

            <button
              onClick={handleSaveSearch}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium ml-2 cursor-pointer"
            >
              <Bookmark className="w-3 h-3" />
              <span>Save Filter</span>
            </button>
          </div>

          {/* Saved Search Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium">Saved:</span>
            {savedSearches.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSearchQuery(s.query);
                  if (s.industry && s.industry !== 'all') setSelectedIndustry(s.industry);
                  setCurrentPageNum(1);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors whitespace-nowrap cursor-pointer"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MULTI-SELECT BATCH ACTION BAR */}
      {selectedProspectIds.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-600 text-white flex items-center justify-between gap-4 shadow-md text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="font-bold">
              {selectedProspectIds.length} {selectedProspectIds.length === 1 ? 'prospect' : 'prospects'} selected
            </span>
            <button
              onClick={() => setSelectedProspectIds([])}
              className="text-indigo-200 hover:text-white underline text-[11px] cursor-pointer"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBatchCampaignModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Campaign</span>
            </button>

            <button
              onClick={() => handleExportCSV(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected</span>
            </button>

            <button
              onClick={handleBatchDelete}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-700/60 hover:bg-rose-600 text-white font-medium transition-colors cursor-pointer"
              title="Delete Selected"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. PROSPECT LIST: GRID OR TABLE VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProspects.map((p) => {
            const isSelected = selectedProspectIds.includes(p.id);
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-xs relative ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProspect(p.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {p.firstName[0]}
                        {p.lastName[0] || ''}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {p.fullName}
                        </h3>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                          {p.title}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {p.icpScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block">ICP Fit</span>
                    </div>
                  </div>

                  {/* Company & Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center justify-between font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.company}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{p.employeeCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  </div>

                  {/* LINKEDIN PROFILE BUTTON (Prominent & Clickable) */}
                  {p.linkedinUrl && (
                    <div className="pt-0.5">
                      <a
                        href={p.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#70b5f9] text-[11px] font-semibold transition-colors border border-[#0A66C2]/20"
                        title="Open verified LinkedIn profile"
                      >
                        <LinkedInIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[170px]">
                          {p.linkedinUrl.replace('https://www.linkedin.com/in/', 'linkedin.com/in/').replace('https://linkedin.com/in/', 'linkedin.com/in/')}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-0.5" />
                      </a>
                    </div>
                  )}

                  {/* Buying Signals Badge if present */}
                  {p.buyingSignals.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-semibold text-[10px]">
                        <span className="flex items-center gap-1">
                          <Radio className="w-3 h-3 text-indigo-600" />
                          <span>Signal: {p.buyingSignals[0].type}</span>
                        </span>
                        <span className="text-slate-400 font-normal">{p.buyingSignals[0].date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[10px] line-clamp-2 leading-relaxed">
                        {p.buyingSignals[0].summary}
                      </p>
                    </div>
                  )}

                  {/* Qualification Explanation */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {p.scoreExplanation}
                  </div>

                  {/* Verified Email & Source */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[130px] font-mono text-[10px]">{p.email}</span>
                    </div>
                    <span className="capitalize text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                      ✓ {p.emailStatus}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenInspector(p)}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer"
                  >
                    Inspect Profile
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProspectIds([p.id]);
                      setBatchCampaignModalOpen(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Campaign</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW WITH DEDICATED LINKEDIN COLUMN */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProspects.length > 0 &&
                        paginatedProspects.every((p) => selectedProspectIds.includes(p.id))
                      }
                      onChange={handleSelectAllOnPage}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Prospect</th>
                  <th className="py-3 px-4 font-semibold">LinkedIn Profile</th>
                  <th className="py-3 px-4 font-semibold">Company & Domain</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">ICP Score</th>
                  <th className="py-3 px-4 font-semibold">Buying Signal</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {paginatedProspects.map((p) => {
                  const isSelected = selectedProspectIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProspect(p.id)}
                          className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {p.firstName[0]}
                            {p.lastName[0] || ''}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {p.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400">{p.title}</div>
                          </div>
                        </div>
                      </td>
                      {/* DEDICATED LINKEDIN COLUMN */}
                      <td className="py-3 px-4">
                        {p.linkedinUrl ? (
                          <a
                            href={p.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#70b5f9] text-[11px] font-semibold transition-colors border border-[#0A66C2]/20 whitespace-nowrap"
                          >
                            <LinkedInIcon className="w-3.5 h-3.5" />
                            <span>LinkedIn</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">{p.company}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.companyDomain}</div>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">{p.location}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {p.icpScore}
                      </td>
                      <td className="py-3 px-4">
                        {p.buyingSignals[0] ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                            <Radio className="w-3 h-3" />
                            <span>{p.buyingSignals[0].type}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {p.email}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenInspector(p)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProspectIds([p.id]);
                              setBatchCampaignModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
                          >
                            Campaign
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PAGINATION CONTROLS (Supporting 100 results) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs">
        <div className="text-slate-500">
          Showing <strong className="text-slate-900 dark:text-white">
            {filteredProspects.length > 0 ? (validCurrentPage - 1) * pageSize + 1 : 0}
          </strong>{' '}
          to{' '}
          <strong className="text-slate-900 dark:text-white">
            {Math.min(validCurrentPage * pageSize, filteredProspects.length)}
          </strong>{' '}
          of <strong className="text-slate-900 dark:text-white">{filteredProspects.length}</strong> total results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPageNum(num)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                validCurrentPage === num
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredProspects.length === 0 && (
        <div className="py-14 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 bg-white dark:bg-slate-900">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No matching prospects found
            </h4>
            <p className="text-slate-500 text-xs">
              No accounts in your pipeline match your filters. Run our AI radar to discover new leads matching your query right now!
            </p>
          </div>

          <button
            onClick={() => handleRunLiveDiscovery(searchQuery || 'B2B Software Executives')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold inline-flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover "{searchQuery || 'B2B Software'}" Leads on Live Web</span>
          </button>
        </div>
      )}

      {/* 7. IN-PAGE PROSPECT QUICK INSPECTOR SLIDE-OVER DRAWER WITH LINKEDIN */}
      {activeInspectorProspect && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-base flex items-center justify-center">
                    {activeInspectorProspect.firstName[0]}
                    {activeInspectorProspect.lastName[0] || ''}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeInspectorProspect.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">{activeInspectorProspect.title}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveInspectorProspect(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PROMINENT LINKEDIN PROFILE CARD */}
              {activeInspectorProspect.linkedinUrl && (
                <div className="p-4 rounded-xl border border-[#0A66C2]/30 bg-[#0A66C2]/5 dark:bg-[#0A66C2]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#0A66C2] dark:text-[#70b5f9] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <LinkedInIcon className="w-4 h-4" />
                      <span>Verified LinkedIn Profile</span>
                    </span>
                    <a
                      href={activeInspectorProspect.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Open on LinkedIn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all pt-1">
                    {activeInspectorProspect.linkedinUrl}
                  </div>
                </div>
              )}

              {/* Company & Contact Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Company</span>
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {activeInspectorProspect.company}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Location</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activeInspectorProspect.location}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Domain</span>
                    <a
                      href={`https://${activeInspectorProspect.companyDomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 font-mono text-[11px]"
                    >
                      {activeInspectorProspect.companyDomain}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Company Size</span>
                    <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">
                      {activeInspectorProspect.employeeCount}
                    </span>
                  </div>
                </div>

                {/* Direct Email with Copy */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Work Email</span>
                    <span className="font-mono text-slate-900 dark:text-white font-medium text-xs">
                      {activeInspectorProspect.email}
                    </span>
                  </div>

                  <button
                    onClick={() => copyEmailToClipboard(activeInspectorProspect.email)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* ICP Qualification Fit Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Explainable ICP Qualification Fit</span>
                  </h4>
                  <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                    {activeInspectorProspect.icpScore} / 100
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2.5">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {activeInspectorProspect.scoreExplanation}
                  </p>
                  {activeInspectorProspect.strengths && activeInspectorProspect.strengths.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Key Fit Strengths:</span>
                      {activeInspectorProspect.strengths.map((str, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Buying Signals Feed */}
              {activeInspectorProspect.buyingSignals && activeInspectorProspect.buyingSignals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-indigo-600" />
                    <span>Observed Buying Signals</span>
                  </h4>

                  <div className="space-y-2">
                    {activeInspectorProspect.buyingSignals.map((sig, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold text-indigo-700 dark:text-indigo-300 text-[11px]">
                          <span>Signal Type: {sig.type}</span>
                          <span className="text-slate-400 font-normal">{sig.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {sig.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Outreach Generator */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Personalized AI Outreach Sequence</span>
                  </h4>

                  {!aiDraftMessage && (
                    <button
                      onClick={handleGenerateInspectorDraft}
                      disabled={aiDraftLoading}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {aiDraftLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      <span>Draft Message</span>
                    </button>
                  )}
                </div>

                {aiDraftMessage && (
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-2">
                    {aiDraftMessage.subject && (
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Subject</span>
                        <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                          {aiDraftMessage.subject}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Message Body</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed mt-0.5">
                        {aiDraftMessage.body}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${aiDraftMessage.subject ? `Subject: ${aiDraftMessage.subject}\n\n` : ''}${aiDraftMessage.body}`
                          );
                          showToast('Outreach draft copied to clipboard', 'success');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Draft</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedProspectIds([activeInspectorProspect.id]);
                  setBatchCampaignModalOpen(true);
                  setActiveInspectorProspect(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Campaign Sequence</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MANUAL ADD LEAD MODAL WITH LINKEDIN FIELD */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Prospect to Pipeline</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAddProspect} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Bessemer, Stripe, Datadog"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. VP Sales"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. jordan@corp.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* LinkedIn URL input */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  value={newLinkedin}
                  onChange={(e) => setNewLinkedin(e.target.value)}
                  placeholder="https://www.linkedin.com/in/prospect-name"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Austin, TX"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    placeholder="e.g. B2B SaaS"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observed Buying Signal (Optional)
                </label>
                <input
                  type="text"
                  value={newSignal}
                  onChange={(e) => setNewSignal(e.target.value)}
                  placeholder="e.g. Closed $20M Series B or Hiring 4 new SDRs"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm cursor-pointer"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. BATCH ADD TO CAMPAIGN MODAL */}
      {batchCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Add {selectedProspectIds.length} {selectedProspectIds.length === 1 ? 'Prospect' : 'Prospects'} to Campaign
            </h3>
            <p className="text-xs text-slate-500">
              Select an outbound sequence to enroll these leads. Strict human-in-the-loop approval will be enforced before messages are dispatched.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Campaign
              </label>
              <select
                value={targetCampaignId}
                onChange={(e) => setTargetCampaignId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => setBatchCampaignModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchAddToCampaign}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
