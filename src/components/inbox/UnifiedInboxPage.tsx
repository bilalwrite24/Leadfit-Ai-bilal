import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchClassifyReply } from '../../services/geminiService';
import {
  Inbox,
  Search,
  Filter,
  Mail,
  Linkedin,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  User,
  Building,
  Loader2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Conversation } from '../../types';

export const UnifiedInboxPage: React.FC = () => {
  const {
    conversations,
    addConversationMessage,
    updateConversationStatus,
    updateProspect,
    showToast,
    setCurrentPage,
  } = useApp();

  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<'all' | 'needs_reply' | 'interested' | 'unread'>('all');
  const [search, setSearch] = useState('');

  // Draft reply box
  const [replyText, setReplyText] = useState('');
  const [classifying, setClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<any>(null);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const matchSearch =
      c.prospectName.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filterCategory === 'needs_reply') return c.status === 'needs_reply';
    if (filterCategory === 'interested') return c.status === 'interested' || c.status === 'meeting_booked';
    if (filterCategory === 'unread') return c.status === 'unread';
    return true;
  });

  const handleGenerateReplySuggestion = async () => {
    if (!activeConv) return;
    const lastMsg = activeConv.messages[activeConv.messages.length - 1];
    if (!lastMsg) return;

    setClassifying(true);
    try {
      const res = await fetchClassifyReply({ prospectMessage: lastMsg.text });
      setClassificationResult(res);
      setReplyText(res.suggestedReply);
      showToast('Generated reply suggestion based on message intent', 'info');
    } catch (err) {
      showToast('Failed to analyze reply with Gemini', 'error');
    } finally {
      setClassifying(false);
    }
  };

  const handleApproveAndSendReply = () => {
    if (!replyText.trim() || !activeConv) return;
    addConversationMessage(activeConv.id, {
      sender: 'user',
      text: replyText.trim(),
    });
    setReplyText('');
    setClassificationResult(null);
  };

  const handleMarkInterested = () => {
    if (!activeConv) return;
    updateConversationStatus(activeConv.id, 'interested');
    updateProspect(activeConv.prospectId, { status: 'ready_for_outreach' });
  };

  const handleMarkNotInterested = () => {
    if (!activeConv) return;
    updateConversationStatus(activeConv.id, 'not_interested');
    updateProspect(activeConv.prospectId, { status: 'disqualified' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Unified Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized conversation hub across Email and LinkedIn channels with AI classification.
          </p>
        </div>

        <div className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Demo mailbox active. All outgoing replies require your explicit confirmation.</span>
        </div>
      </div>

      {/* Main Inbox 2-Column Split */}
      <div className="h-[740px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-xs">
        {/* Left Column: Conversation List */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/40 dark:bg-slate-950/40">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-[11px]">
              {(['all', 'needs_reply', 'interested', 'unread'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 rounded-md font-medium capitalize transition-colors ${
                    filterCategory === cat
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredConversations.map((c) => {
              const isSelected = activeConv?.id === c.id;
              const lastMsg = c.messages[c.messages.length - 1];
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedConvId(c.id);
                    setReplyText(c.suggestedReply || '');
                    setClassificationResult(null);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-l-2 border-indigo-600'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {c.prospectName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {c.lastMessageAt}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 truncate mb-1">
                    {c.company} · {c.prospectTitle}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
                    {lastMsg ? lastMsg.text : 'No messages'}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      {c.channel === 'email' ? <Mail className="w-3 h-3 text-indigo-500" /> : <Linkedin className="w-3 h-3 text-sky-500" />}
                      <span className="capitalize">{c.channel}</span>
                    </span>

                    <span
                      className={`font-semibold capitalize px-1.5 py-0.2 rounded-full ${
                        c.status === 'needs_reply'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : c.status === 'interested' || c.status === 'meeting_booked'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation & Reply Draft Composer */}
        {activeConv ? (
          <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Top Bar of Active Conversation */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeConv.prospectName}
                </h3>
                <span className="text-xs text-slate-400">
                  {activeConv.prospectTitle} at {activeConv.company}
                </span>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkInterested}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Interested</span>
                </button>

                <button
                  onClick={handleMarkNotInterested}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Not Interested</span>
                </button>

                <button
                  onClick={() => setCurrentPage('meetings')}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600"
                  title="Schedule Meeting"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeConv.messages.map((m) => {
                const isUserOrAgent = m.sender === 'user' || m.sender === 'agent';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUserOrAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                      <span>
                        {m.sender === 'user'
                          ? 'You (Approved)'
                          : m.sender === 'agent'
                          ? 'LeadFit AI Agent'
                          : activeConv.prospectName}
                      </span>
                      <span>·</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-xl p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                        isUserOrAgent
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      {m.subject && (
                        <div className="font-semibold pb-1 mb-1 border-b border-indigo-500/40 text-[11px]">
                          {m.subject}
                        </div>
                      )}
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Classification Pill if evaluated */}
            {classificationResult && (
              <div className="mx-4 mb-2 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs flex items-center justify-between text-indigo-900 dark:text-indigo-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    Detected Intent: <strong>{classificationResult.intentCategory}</strong> ({classificationResult.sentiment})
                  </span>
                </div>
                <span className="font-mono text-[10px]">
                  {Math.round(classificationResult.confidence * 100)}% Confidence
                </span>
              </div>
            )}

            {/* Reply Composer Box */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Compose Reply (Requires Human Approval)
                </span>

                <button
                  type="button"
                  onClick={handleGenerateReplySuggestion}
                  disabled={classifying}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {classifying ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Generate AI Reply with Gemini</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your approved response here or generate suggestion above..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Channel: {activeConv.channel === 'email' ? 'Verified Work Mail' : 'LinkedIn InMail'}
                </span>

                <button
                  type="button"
                  onClick={handleApproveAndSendReply}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm shadow-indigo-600/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Approve & Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-7 lg:col-span-8 flex items-center justify-center p-8 text-xs text-slate-400">
            Select a conversation to view thread.
          </div>
        )}
      </div>
    </div>
  );
};
