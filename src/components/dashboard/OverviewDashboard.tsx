import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Target,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Bot,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

export const OverviewDashboard: React.FC = () => {
  const {
    prospects,
    buyingSignals,
    campaigns,
    conversations,
    meetings,
    agents,
    setCurrentPage,
    setActiveProspectDrawerId,
  } = useApp();

  const totalDiscovered = prospects.length + 380;
  const qualifiedLeads = prospects.filter((p) => p.icpScore >= 80).length;
  const awaitingReview = prospects.filter((p) => p.status === 'ready_for_outreach' || p.status === 'qualifying').length;
  const messagesSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const positiveReplies = conversations.filter((c) => c.status === 'interested' || c.status === 'meeting_booked').length;
  const meetingsBooked = meetings.length;

  const activityChartData = [
    { day: 'Mon', discovered: 42, qualified: 31 },
    { day: 'Tue', discovered: 58, qualified: 44 },
    { day: 'Wed', discovered: 74, qualified: 59 },
    { day: 'Thu', discovered: 65, qualified: 48 },
    { day: 'Fri', discovered: 89, qualified: 71 },
    { day: 'Sat', discovered: 35, qualified: 26 },
    { day: 'Sun', discovered: 49, qualified: 39 },
  ];

  const campaignPerformanceData = campaigns.map((c) => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + '...' : c.name,
    sent: c.sentCount,
    replied: Math.round(c.sentCount * (c.replyRate / 100)),
    positive: Math.round(c.sentCount * (c.positiveReplyRate / 100)),
  }));

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner per instructions: Clearly labelled fictional demo data */}
      <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-950 bg-indigo-50/60 dark:bg-indigo-950/20 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Demo Environment:</strong> Figures and prospects below represent simulated demonstration records until your live CRM & Google Workspace adapters are authenticated.
          </span>
        </div>
        <button
          onClick={() => setCurrentPage('integrations')}
          className="font-semibold underline hover:no-underline whitespace-nowrap text-indigo-700 dark:text-indigo-300"
        >
          Connect Real Sources →
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Discovered</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {totalDiscovered}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold font-mono tabular-nums">+18%</span>
            <span>this week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Qualified ICP</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {qualifiedLeads}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-mono tabular-nums">84.5%</span>
            <span>fit rate</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Awaiting Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {awaitingReview}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Requires approval</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Outreach Sent</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {messagesSent}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Human-approved</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Positive Replies</span>
            <MessageSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {positiveReplies}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold font-mono tabular-nums">15.2%</span>
            <span>reply rate</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Meetings Booked</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {meetingsBooked}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Confirmed slots</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prospect Activity Trends Chart */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Prospect Discovery Velocity</h3>
              <p className="text-xs text-slate-400">Total discovered vs. qualified leads this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Discovered</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Qualified</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="discovered" stroke="#6366f1" strokeWidth={2} fill="url(#discGrad)" />
                <Area type="monotone" dataKey="qualified" stroke="#10b981" strokeWidth={2} fill="url(#qualGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Funnel Bar Chart */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Campaign Conversion</h3>
              <p className="text-xs text-slate-400">Sent vs replies vs positive responses</p>
            </div>
            <button
              onClick={() => setCurrentPage('campaigns')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All Campaigns →
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="sent" fill="#6366f1" radius={[4, 4, 0, 0]} name="Sent" />
                <Bar dataKey="replied" fill="#818cf8" radius={[4, 4, 0, 0]} name="Replied" />
                <Bar dataKey="positive" fill="#10b981" radius={[4, 4, 0, 0]} name="Positive" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Signals Feed + Recent Prospects + AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buying Signals Feed */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Buying Signals</h3>
            </div>
            <button
              onClick={() => setCurrentPage('buying-signals')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Radar
            </button>
          </div>

          <div className="space-y-3">
            {buyingSignals.slice(0, 3).map((sig) => (
              <div
                key={sig.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{sig.company}</span>
                  <span className="font-mono text-[10px] text-slate-400">{sig.observedDate}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                  {sig.summary}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="capitalize">{sig.signalType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{Math.round(sig.confidence * 100)}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Scoring Prospects */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Scored Prospects</h3>
            </div>
            <button
              onClick={() => setCurrentPage('prospects')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open CRM
            </button>
          </div>

          <div className="space-y-3">
            {prospects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setCurrentPage('prospects');
                  setActiveProspectDrawerId(p.id);
                }}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex items-center justify-between cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{p.fullName}</div>
                  <div className="text-[11px] text-slate-500">{p.title} at {p.company}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {p.icpScore}
                  </div>
                  <div className="text-[10px] text-slate-400">ICP Match</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations & Agent Timeline */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Autonomous Actions</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-1.5">
              <span className="font-semibold text-indigo-900 dark:text-indigo-200 block">
                Trigger Outreach for NexusMetric
              </span>
              <p className="text-indigo-800/80 dark:text-indigo-300 text-[11px] leading-relaxed">
                Marcus Vance is scored 94/100 following their $32M Series B announcement. Touch #1 email draft is ready for review.
              </p>
              <button
                onClick={() => setCurrentPage('inbox')}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1 block"
              >
                Review Draft Queue →
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Recent Agent Activity</div>
              {agents.slice(0, 2).map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="truncate">{a.name} · {a.activityLog[0]?.action}</span>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">{a.lastRun}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
