import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Code2,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Rocket,
  Award,
  ArrowRight,
  Globe,
  Terminal,
  Server,
  Zap,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  SlidersHorizontal,
  X,
  Link as LinkIcon,
} from 'lucide-react';

import bilalExactPhoto from '../../assets/images/bilal_exact_photo.jpg';
import bilalStudioPhoto from '../../assets/images/bilal_iqbal_portrait_1791860238855.jpg';

// Custom inline LinkedIn Icon
const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8V10.9M7.86 6.5a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63s1.63-.73 1.63-1.63A1.63 1.63 0 0 0 7.86 6.5" />
  </svg>
);

export const DeveloperPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [photoNotification, setPhotoNotification] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const email = 'bilalwrite24@gmail.com';
  const linkedinUrl = 'https://www.linkedin.com/in/bilal-iqbal-jutt/';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exact photo handling with bundled assets & persistent storage
  const defaultPhoto = bilalExactPhoto;
  const studioPhoto = bilalStudioPhoto;

  const [portraitUrl, setPortraitUrl] = useState<string>(() => {
    const saved = localStorage.getItem('leadfit_bilal_exact_photo');
    // If old unbundled relative string was saved, upgrade to bundled defaultPhoto
    if (saved && !saved.startsWith('/src/assets/')) return saved;
    return defaultPhoto;
  });

  const showNotification = (msg: string) => {
    setPhotoNotification(msg);
    setTimeout(() => setPhotoNotification(null), 4000);
  };

  const handleApplyPhoto = async (newUrlOrData: string, label: string) => {
    setPortraitUrl(newUrlOrData);
    localStorage.setItem('leadfit_bilal_exact_photo', newUrlOrData);
    showNotification(`Exact photo updated (${label}) and persisted.`);

    // If it's a dataUrl, sync to server in background so disk updates as well
    if (newUrlOrData.startsWith('data:image/')) {
      try {
        await fetch('/api/developer-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: newUrlOrData }),
        });
      } catch (err) {
        console.warn('Could not sync photo to server disk, but saved in localStorage:', err);
      }
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        handleApplyPhoto(dataUrl, 'Uploaded File');
        setIsPhotoModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactSubject('');
      setContactMessage('');
    }, 4000);
  };

  const techSkills = [
    {
      category: 'Generative AI & Agentic Architecture',
      icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      skills: [
        'Google Gemini 2.5 / 3.8 Flash SDK',
        'Multi-Agent Coordination & Loops',
        'Google Search Grounding & Tool Calling',
        'Retrieval Augmented Generation (RAG)',
        'Explainable Scoring & Intent Classifiers',
        'Strict Prompt Engineering & JSON Schema',
      ],
    },
    {
      category: 'Frontend & Full-Stack Engineering',
      icon: <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      skills: [
        'React 19 & Next.js Architecture',
        'TypeScript (Strict Strictness)',
        'Tailwind CSS & Modern Design Systems',
        'High-Density SaaS Dashboards & Telemetry',
        'Framer Motion & Fluid Micro-Interactions',
        'State Management & Performance Profiling',
      ],
    },
    {
      category: 'Backend, APIs & Cloud Systems',
      icon: <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      skills: [
        'Node.js & Express RESTful APIs',
        'Server-Side Proxy Handlers & Secret Isolation',
        'Cloud SQL / Relational PostgreSQL',
        'Firebase Firestore & Authentication',
        'CSV Streaming & Batch Parsing Pipelines',
        'Webhooks & Third-Party CRM Adapters',
      ],
    },
    {
      category: 'Software Craftsmanship & DevOps',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      skills: [
        'Clean Architecture & Modular Patterns',
        'Human-in-the-Loop Safety Workflows',
        'Git Version Control & CI/CD Pipelines',
        'Vercel & Cloud Run Deployments',
        'Zero-Trust Data Protection',
        'WCAG Accessibility & High Usability',
      ],
    },
  ];

  const milestones = [
    {
      year: '2026',
      title: 'Architected LeadFit AI (B2B Sales Agent SaaS)',
      description:
        'Engineered LeadFit AI with autonomous prospect discovery, live web search grounding, explainable ICP scoring, multi-channel sequence campaigns, 100 results with direct LinkedIn links, and 100% free open access for modern sales teams.',
    },
    {
      year: '2025',
      title: 'Advanced AI Systems & Autonomous Workflows',
      description:
        'Specialized in multi-agent orchestration, LLM tool-calling architectures, intent classification engines, and scalable full-stack web applications for global startups and high-growth teams.',
    },
    {
      year: '2024',
      title: 'Full-Stack Enterprise Applications & SaaS Platforms',
      description:
        'Delivered production-grade web applications utilizing TypeScript, modern React ecosystems, Node.js backends, and cloud databases with rigorous UX/UI design standards.',
    },
    {
      year: '2023',
      title: 'Foundational Web & Software Engineering',
      description:
        'Built responsive web solutions, API integrations, and developer tooling, creating optimized frontend experiences and solid backend services.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Hidden File Input for Direct Local Image Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Floating Notification */}
      {photoNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">{photoNotification}</span>
        </div>
      )}

      {/* 1. HERO PROFILE CARD */}
      <div className="p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Portrait Image with Interactive Upload Overlay */}
          <div className="relative shrink-0 flex flex-col items-center">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              title="Click or drag & drop to update your exact photo"
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 ${
                isDragging
                  ? 'border-indigo-500 ring-4 ring-indigo-500/30'
                  : 'border-white dark:border-slate-800'
              } shadow-2xl relative group cursor-pointer transition-all duration-300`}
            >
              <img
                src={portraitUrl}
                alt="Bilal Iqbal"
                onError={() => setPortraitUrl(studioPhoto)}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay with Camera Icon */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-xs">
                <Camera className="w-7 h-7 mb-1 text-indigo-400" />
                <span className="text-[11px] font-bold">Use Exact Photo</span>
                <span className="text-[10px] text-slate-300 mt-0.5">Click to upload file</span>
              </div>
            </div>

            {/* Quick Action below Portrait */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Exact Photo</span>
              </button>
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-[11px] transition-colors cursor-pointer"
                title="Photo Options & URL"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Online Status Badge */}
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-md flex items-center gap-1.5 border border-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Available for Hire</span>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creator & Lead Architect of LeadFit AI</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Bilal Iqbal
              </h1>
              <p className="text-base sm:text-lg font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                Senior Full-Stack Software Engineer & AI Systems Architect
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-balance">
              Building next-generation intelligent SaaS applications, autonomous agent pipelines, and high-performance web systems. Creator of LeadFit AI — engineered with 100 results per lead search, direct verified LinkedIn profile links, and 100% free open access with zero paywalls.
            </p>

            {/* Quick Action Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {/* LinkedIn Button */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold transition-all shadow-md shadow-[#0A66C2]/20 cursor-pointer"
              >
                <LinkedInIcon className="w-4 h-4" />
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              {/* Email Copy Button */}
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email Address'}</span>
              </button>

              {/* Upload Exact Photo Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Upload Exact Photo</span>
              </button>

              {/* Direct Mailto */}
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO SETTINGS MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Developer Profile Photo
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: File Upload */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  1. Choose Exact Image File from Device
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Select Image File (PNG, JPG, WebP)</span>
                </button>
                <p className="text-[11px] text-slate-500">
                  Select your exact photo and it will immediately apply and save to storage.
                </p>
              </div>

              {/* Option 2: Image URL */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  2. Or Enter Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://... image link"
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        handleApplyPhoto(customUrlInput.trim(), 'Custom URL');
                        setCustomUrlInput('');
                        setIsPhotoModalOpen(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Option 3: Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  3. Available Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleApplyPhoto(defaultPhoto, 'Exact Photo Asset');
                      setIsPhotoModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:border-indigo-500 text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">Bilal Photo</div>
                    <div className="text-[10px] text-slate-500">Original Profile Photo</div>
                  </button>
                  <button
                    onClick={() => {
                      handleApplyPhoto(studioPhoto, 'Studio Portrait');
                      setIsPhotoModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:border-indigo-500 text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">Studio Portrait</div>
                    <div className="text-[10px] text-slate-500">Generated Headshot</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE VISION: WHY BILAL BUILT LEADFIT AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Engineering Story & Philosophy
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Transforming B2B Sales with Autonomous Intelligence & Zero Friction
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              "Sales representatives spend over 65% of their working week on manual prospect discovery, parsing LinkedIn search results, and cross-referencing news announcements instead of having high-value conversations with interested prospects."
            </p>
            <p>
              "I built <strong>LeadFit AI</strong> to solve this exact problem: an end-to-end autonomous agent system that continuously discovers qualified accounts, monitors real-world buying signals (such as Series funding, open hiring surges, and leadership shifts), calculates transparent 0–100 ICP fit scores, and drafts personalized outreach with strict human approval."
            </p>
            <p>
              "Most importantly, I believe advanced revenue intelligence should be accessible to all builders. That is why LeadFit AI includes <strong>100 results per search</strong>, direct verified LinkedIn profile links, and <strong>100% free unlimited access</strong> with no paywalls or credit gates."
            </p>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('lead-finder')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Lead Finder Platform (100 Leads)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlights Box */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Architecture Pillars of LeadFit AI</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">100 Results with LinkedIn URLs</strong>
                <span className="text-slate-500">Every prospect includes verified LinkedIn handles, valid work emails, and domain credentials.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">Live Web Search Grounding</strong>
                <span className="text-slate-500">Integrated with Gemini 3.8 Flash to extract real corporate announcements, funding rounds, and hiring triggers.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">Strict Human-in-the-Loop Safeguard</strong>
                <span className="text-slate-500">Autonomous draft generation with zero unapproved emails dispatched without human sign-off.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">100% Free Open Access</strong>
                <span className="text-slate-500">Zero subscription paywalls, no credits, and uncapped autonomous pipeline scaling for all teams.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TECHNICAL COMPETENCIES & TOOLKIT */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Technical Mastery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Full-Stack & AI Engineering Competencies
          </h2>
          <p className="text-xs text-slate-500">
            Proven expertise spanning modern frontend architectures, large language model integrations, server-side infrastructure, and data portability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techSkills.map((tech, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60">
                  {tech.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {tech.category}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tech.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CAREER MILESTONES & TIMELINE */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Career Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Engineering Milestones
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-4 shadow-2xs"
            >
              <div className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold shrink-0 mt-0.5">
                {item.year}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DIRECT GET IN TOUCH & CONNECT */}
      <div className="p-8 md:p-12 rounded-3xl bg-slate-900 text-white space-y-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Let's Collaborate on Your Next AI or SaaS Venture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Interested in discussing AI engineering, autonomous agent design, full-stack systems architecture, or potential collaboration? Reach out directly to Bilal Iqbal.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          {messageSent ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-white">Message Dispatched Successfully!</div>
              <p>Bilal will review your inquiry and respond to your provided email promptly.</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Subject / Project Objective</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. AI Engineering Collaboration / SaaS Architecture"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Message & Context</label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share details about your team, tech requirements, or collaboration goals..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct: <strong>{email}</strong></span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#0A66C2] text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </a>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message to Bilal</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
