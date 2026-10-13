import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  Plus,
  ExternalLink,
  Info,
  CalendarCheck,
  Building,
  User,
  X,
} from 'lucide-react';
import { Meeting } from '../../types';

export const MeetingsPage: React.FC = () => {
  const { meetings, addMeeting, updateMeeting, prospects, showToast, setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // New Meeting Form
  const [selectedProspectId, setSelectedProspectId] = useState(prospects[0]?.id || '');
  const [meetingTitle, setMeetingTitle] = useState('LeadFit AI Discovery & Solution Overview');
  const [meetingDate, setMeetingDate] = useState('Thursday, Oct 22, 2026');
  const [meetingTime, setMeetingTime] = useState('3:00 PM - 3:30 PM EST');
  const [meetingNotes, setMeetingNotes] = useState('Review outbound buying signals and SDR acceleration workflow.');

  const filteredMeetings = meetings.filter((m) => m.status === activeTab);

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const p = prospects.find((pros) => pros.id === selectedProspectId);
    if (!p) return;

    const newM: Meeting = {
      id: `meet-${Date.now()}`,
      prospectId: p.id,
      prospectName: p.fullName,
      prospectTitle: p.title,
      company: p.company,
      title: meetingTitle,
      date: meetingDate,
      time: meetingTime,
      durationMinutes: 30,
      status: 'upcoming',
      notes: meetingNotes,
      followUpTasks: ['Send calendar invitation', 'Prepare company intelligence brief'],
      calendarSynced: true,
      meetingLink: 'https://meet.google.com/leadfit-demo-room',
    };

    addMeeting(newM);
    setScheduleModalOpen(false);
  };

  const handleMarkCompleted = (id: string) => {
    updateMeeting(id, {
      status: 'completed',
      outcome: 'Meeting successfully completed. Prospect moving to pilot evaluation.',
    });
  };

  const handleCancelMeeting = (id: string) => {
    updateMeeting(id, { status: 'cancelled' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Meetings & Scheduling</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track confirmed prospect discussions, agenda outcomes, and calendar synchronization.
          </p>
        </div>

        <button
          onClick={() => setScheduleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Meeting</span>
        </button>
      </div>

      {/* Calendar Notice Banner */}
      <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-900 dark:text-indigo-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Calendar Notice:</strong> Meetings shown are synchronized with your active demo workspace. Connect Google Calendar or Outlook in Integrations for two-way live calendar blocking.
          </span>
        </div>
        <button
          onClick={() => setCurrentPage('integrations')}
          className="font-semibold text-indigo-700 dark:text-indigo-300 underline hover:no-underline whitespace-nowrap"
        >
          Integrate Calendar →
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => {
          const count = meetings.filter((m) => m.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab}</span>
              <span className="font-mono text-[10px] tabular-nums opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetings.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h3>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {m.company} · {m.prospectName}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    m.status === 'upcoming'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : m.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* Date & Time */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{m.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{m.time} ({m.durationMinutes} min)</span>
                </div>
              </div>

              {/* Notes */}
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Notes:</span>
                {m.notes}
              </div>

              {/* Outcome if completed */}
              {m.outcome && (
                <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 text-xs">
                  <strong>Outcome:</strong> {m.outcome}
                </div>
              )}

              {/* Follow-up tasks */}
              {m.followUpTasks.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block">
                    Follow-up Tasks:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
                    {m.followUpTasks.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              {m.meetingLink ? (
                <a
                  href={m.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400">Offline / Phone</span>
              )}

              {m.status === 'upcoming' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkCompleted(m.id)}
                    className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    title="Mark Completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCancelMeeting(m.id)}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Cancel Meeting"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredMeetings.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No {activeTab} meetings found.
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Schedule Prospect Meeting
              </h3>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prospect
                </label>
                <select
                  value={selectedProspectId}
                  onChange={(e) => setSelectedProspectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {prospects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time & Zone
                  </label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Agenda & Notes
                </label>
                <textarea
                  rows={3}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
