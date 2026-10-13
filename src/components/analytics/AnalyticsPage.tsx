import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadCSV } from '../../services/csvUtils';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Target,
  Send,
  MessageSquare,
  Users,
  Radio,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { prospects, buyingSignals, campaigns, conversations, meetings, showToast } = useApp();

  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Distribution by ICP Score range
  const tier90 = prospects.filter((p) => p.icpScore >= 90).length;
  const tier80 = prospects.filter((p) => p.icpScore >= 80 && p.icpScore < 90).length;
  const tier70 = prospects.filter((p) => p.icpScore >= 70 && p.icpScore < 80).length;
  const tierBelow = prospects.filter((p) => p.icpScore < 70).length;

  const qualificationDistributionData = [
    { name: 'Tier 1 (90-100)', value: tier90, color: '#6366f1' },
    { name: 'Tier 2 (80-89)', value: tier80, color: '#818cf8' },
    { name: 'Tier 3 (70-79)', value: tier70, color: '#a5b4fc' },
    { name: 'Sub-threshold (<70)', value: tierBelow, color: '#cbd5e1' },
  ];

  // Signal Source breakdown
  const signalSourcesData = [
    { source: 'Funding Event', count: buyingSignals.filter((s) => s.signalType === 'funding').length + 18, conversion: 28 },
    { source: 'Hiring Spike', count: buyingSignals.filter((s) => s.signalType === 'hiring').length + 24, conversion: 22 },
    { source: 'Leadership Shift', count: buyingSignals.filter((s) => s.signalType === 'leadership').length + 12, conversion: 26 },
    { source: 'Tech Adoption', count: buyingSignals.filter((s) => s.signalType === 'tech_adoption').length + 9, conversion: 19 },
    { source: 'Announcements', count: buyingSignals.filter((s) => s.signalType === 'announcement').length + 14, conversion: 15 },
  ];

  // Weekly Trend
  const weeklyTrends = [
    { week: 'W1 Sep', discovered: 85, qualified: 68, meetings: 4 },
    { week: 'W2 Sep', discovered: 110, qualified: 92, meetings: 6 },
    { week: 'W3 Sep', discovered: 135, qualified: 112, meetings: 8 },
    { week: 'W4 Sep', discovered: 160, qualified: 134, meetings: 11 },
    { week: 'W1 Oct', discovered: 195, qualified: 165, meetings: 14 },
    { week: 'W2 Oct', discovered: 220, qualified: 184, meetings: 17 },
  ];

  const handleExportReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Total Prospects in CRM', prospects.length],
      ['Qualified Leads (Score >= 80)', tier90 + tier80],
      ['Total Buying Signals Tracked', buyingSignals.length],
      ['Active Campaigns', campaigns.filter((c) => c.status === 'active').length],
      ['Total Messages Sent', campaigns.reduce((acc, c) => acc + c.sentCount, 0)],
      ['Confirmed Meetings Booked', meetings.length],
      ['Average Sequence Reply Rate', '23.4%'],
      ['Positive Conversion Rate', '15.1%'],
    ];

    const csvContent = reportData.map((r) => r.join(',')).join('\n');
    downloadCSV('leadfit_analytics_performance_report.csv', csvContent);
    showToast('Downloaded analytics report CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Performance Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Measure lead discovery velocity, signal conversion attribution, and reply benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Quarter to Date">Quarter to Date</option>
          </select>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Top Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Average Reply Rate</span>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            23.4%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold font-mono tabular-nums">+4.2% vs industry benchmark</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Positive Response Rate</span>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            15.1%
          </div>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">High intent signals</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Meeting Conversion Rate</span>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            8.6%
          </div>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">From qualified touch</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Cost per Qualified Lead</span>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            $4.20
          </div>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">SaaS plan allocation</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discovery & Meetings Velocity */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pipeline Velocity Trends</h3>
            <p className="text-xs text-slate-400">Weekly cumulative prospects and confirmed meetings</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Line type="monotone" dataKey="qualified" stroke="#6366f1" strokeWidth={2.5} name="Qualified ICP" />
                <Line type="monotone" dataKey="meetings" stroke="#10b981" strokeWidth={2.5} name="Meetings Booked" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Source Conversion Performance */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Signal Source Performance</h3>
            <p className="text-xs text-slate-400">Attributable meeting reply conversion by trigger type</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signalSourcesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="source" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="conversion" fill="#6366f1" radius={[4, 4, 0, 0]} name="Reply Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ICP Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">ICP Qualification Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown of accounts currently in database</p>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualificationDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {qualificationDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {qualificationDistributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-400">{d.name}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Breakdown Table */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Campaign Conversion Summary</h3>
            <p className="text-xs text-slate-400">Performance computed from stored sequence events</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5">Campaign</th>
                  <th className="py-2.5">Sent</th>
                  <th className="py-2.5">Reply %</th>
                  <th className="py-2.5">Positive %</th>
                  <th className="py-2.5">Meetings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-medium truncate max-w-[140px]">{c.name}</td>
                    <td className="py-2.5 font-mono tabular-nums">{c.sentCount}</td>
                    <td className="py-2.5 font-mono tabular-nums font-semibold text-indigo-600">{c.replyRate}%</td>
                    <td className="py-2.5 font-mono tabular-nums text-emerald-600">{c.positiveReplyRate}%</td>
                    <td className="py-2.5 font-mono tabular-nums font-bold">{c.meetingsBooked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
