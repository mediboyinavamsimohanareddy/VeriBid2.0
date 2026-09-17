import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck, 
  Landmark, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  MoreHorizontal, 
  Upload, 
  Search, 
  FileText, 
  History,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const kpis = [
    {
      title: 'Active Tenders',
      value: '124',
      change: '↑ 12% vs last month',
      changeType: 'positive',
      icon: Landmark,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      action: 'View Tenders →',
      path: '/tenders'
    },
    {
      title: 'Total Bids',
      value: '486',
      change: '↑ 18% vs last month',
      changeType: 'positive',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      action: 'View Bids →',
      path: '/verification'
    },
    {
      title: 'Verified Bids',
      value: '352',
      change: '↑ 25% vs last month',
      changeType: 'positive',
      icon: CheckCircle2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 border-teal-200',
      action: 'View Verified →',
      path: '/verification'
    },
    {
      title: 'Under Review',
      value: '86',
      change: '↓ 5% vs last month',
      changeType: 'neutral',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      action: 'Review Now →',
      path: '/verification'
    },
    {
      title: 'Non-Compliant',
      value: '48',
      change: '↓ 10% vs last month',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-200',
      action: 'View Details →',
      path: '/risk'
    },
    {
      title: 'Avg. Compliance Score',
      value: '78 / 100',
      change: '↑ 8% vs last month',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200',
      action: 'Analytics →',
      path: '/reports'
    }
  ];

  const recentBids = [
    {
      id: '1',
      bidder: 'ABC Technologies Pvt Ltd',
      tenderId: 'GEM/2026/B/12345',
      date: '15 Sep 2026',
      score: 92,
      status: 'Compliant',
      caseId: 'GEM/2024/B/19102'
    },
    {
      id: '2',
      bidder: 'Shree Infra Solutions',
      tenderId: 'GEM/2026/B/12346',
      date: '14 Sep 2026',
      score: 76,
      status: 'Under Review',
      caseId: 'GEM/2024/B/18442'
    },
    {
      id: '3',
      bidder: 'National Supplies Co.',
      tenderId: 'GEM/2026/B/12347',
      date: '14 Sep 2026',
      score: 34,
      status: 'Non-Compliant',
      caseId: 'GEM/2024/B/17391'
    },
    {
      id: '4',
      bidder: 'Green Earth Enterprises',
      tenderId: 'GEM/2026/B/12348',
      date: '13 Sep 2026',
      score: 88,
      status: 'Compliant',
      caseId: 'GEM/2024/B/19102'
    },
    {
      id: '5',
      bidder: 'TechNova Systems',
      tenderId: 'GEM/2026/B/12349',
      date: '12 Sep 2026',
      score: 81,
      status: 'Compliant',
      caseId: 'GEM/2024/B/18442'
    }
  ];

  const aiInsights = [
    {
      id: 1,
      title: '3 bidders have expired GST certificates',
      priority: 'High Priority',
      priorityColor: 'bg-rose-100 text-rose-800 border-rose-200',
      time: '2 hours ago',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600',
      path: '/risk'
    },
    {
      id: 2,
      title: '5 bids have name mismatches across documents',
      priority: 'Medium Priority',
      priorityColor: 'bg-amber-100 text-amber-800 border-amber-200',
      time: '5 hours ago',
      icon: FileText,
      iconBg: 'bg-amber-50 text-amber-600',
      path: '/documents'
    },
    {
      id: 3,
      title: '2 vendors found in blacklisted database',
      priority: 'High Priority',
      priorityColor: 'bg-rose-100 text-rose-800 border-rose-200',
      time: '1 day ago',
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 text-rose-600',
      path: '/vendors'
    },
    {
      id: 4,
      title: 'Average verification time reduced by 68%',
      priority: 'Positive Trend',
      priorityColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      time: '1 day ago',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
      path: '/reports'
    }
  ];

  return (
    <div className="space-y-5 font-sans animate-fade-up">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Welcome back, Procurement Officer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor tenders, verify bids, and ensure compliant procurement.
          </p>
        </div>
        <button
          onClick={() => navigate('/verification')}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Verify New Bid</span>
        </button>
      </div>

      {/* 2. Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#1D4ED8] p-6 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>VeriBid Intelligence Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
            AI for Fair Procurement — Building a Transparent India
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed font-normal">
            Automated verification | Real-time validation | Fraud detection for a stronger and more accountable procurement ecosystem.
          </p>
        </div>

        {/* Quote overlay */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-right z-10 max-w-xs">
          <p className="text-xs italic text-blue-100 font-serif">
            "Good Governance leads to a Stronger Nation"
          </p>
          <p className="text-[10px] text-blue-200/80 font-medium mt-1">
            — Government of India
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 3. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(kpi.path)}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 truncate">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-lg ${kpi.bgColor} shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  {kpi.change}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                <span>{kpi.action}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Charts & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Verification Trend Chart (6 Cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Verification Trend</h3>
              <p className="text-[10px] text-slate-500">Historical compliance activity over time</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md px-2 py-1 focus:outline-none"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>

          {/* SVG Trend Chart */}
          <div className="h-44 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
              {/* Gridlines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#E2E8F0" opacity="0.5" />

              {/* Verified Line (Green) */}
              <path
                d="M 10 70 Q 70 50 130 60 T 250 40 T 370 30"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Dots */}
              <circle cx="10" cy="70" r="3.5" fill="#10B981" />
              <circle cx="90" cy="55" r="3.5" fill="#10B981" />
              <circle cx="170" cy="45" r="3.5" fill="#10B981" />
              <circle cx="250" cy="40" r="3.5" fill="#10B981" />
              <circle cx="330" cy="35" r="3.5" fill="#10B981" />
              <circle cx="390" cy="30" r="3.5" fill="#10B981" />

              {/* Under Review Line (Amber) */}
              <path
                d="M 10 90 Q 70 85 130 92 T 250 80 T 370 75"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Non-Compliant Line (Red) */}
              <path
                d="M 10 105 Q 70 100 130 108 T 250 102 T 370 100"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-mono">
              <span>18 Aug</span>
              <span>25 Aug</span>
              <span>1 Sep</span>
              <span>8 Sep</span>
              <span>15 Sep</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Verified
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Under Review
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Non-Compliant
            </span>
          </div>
        </div>

        {/* Compliance Distribution Donut (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Compliance Distribution</h3>
            <p className="text-[10px] text-slate-500">Proportion of verified bid outcomes</p>
          </div>

          {/* Donut Graphic */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background ring */}
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Compliant (72%) */}
              <path
                className="text-emerald-500"
                strokeDasharray="72, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Under Review (18%) */}
              <path
                className="text-amber-500"
                strokeDasharray="18, 100"
                strokeDashoffset="-72"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Non-Compliant (10%) */}
              <path
                className="text-rose-500"
                strokeDasharray="10, 100"
                strokeDashoffset="-90"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-black text-slate-900 block leading-tight">486</span>
              <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Total Bids</span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Compliant
              </span>
              <span className="font-bold text-slate-900 text-[11px]">352 (72%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Under Review
              </span>
              <span className="font-bold text-slate-900 text-[11px]">86 (18%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Non-Compliant
              </span>
              <span className="font-bold text-slate-900 text-[11px]">48 (10%)</span>
            </div>
          </div>
        </div>

        {/* AI Insights List (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">AI Insights & Anomalies</h3>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="text-[10px] text-blue-600 font-bold hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2.5">
            {aiInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  onClick={() => navigate(insight.path)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex items-start space-x-2.5"
                >
                  <div className={`p-1.5 rounded-lg ${insight.iconBg} shrink-0 mt-0.5`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-900 leading-tight truncate">
                      {insight.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${insight.priorityColor}`}>
                        {insight.priority}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{insight.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Bottom Grid: Recent Bids & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Bids Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Recent Bid Submissions</h3>
              <p className="text-[10px] text-slate-500">Latest bidder documents processed by VeriBid</p>
            </div>
            <button
              onClick={() => navigate('/verification')}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              View All Bids →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Bidder Name</th>
                  <th className="py-2 px-3">Tender ID</th>
                  <th className="py-2 px-3">Submission Date</th>
                  <th className="py-2 px-3 text-center">Score</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentBids.map((bid, idx) => {
                  const scoreColor =
                    bid.score >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : bid.score >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800';

                  const statusColor =
                    bid.status === 'Compliant'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : bid.status === 'Under Review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <tr key={bid.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{bid.bidder}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{bid.tenderId}</td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500">{bid.date}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full ${scoreColor}`}>
                          {bid.score}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusColor}`}>
                          {bid.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            showToast(`Opening verification for ${bid.bidder}`, 'info');
                            navigate(`/verification?caseId=${bid.caseId}`);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Open Verification Workspace"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Quick Actions</h3>
            <p className="text-[10px] text-slate-500">Shortcuts for frequent procurement officer workflows</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Action 1: Verify New Bid */}
            <button
              onClick={() => {
                showToast('Navigating to Bid Verification Workspace', 'info');
                navigate('/verification');
              }}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-left transition-all shadow-xs flex flex-col justify-between group col-span-1"
            >
              <div className="p-2 bg-white/10 rounded-lg w-fit mb-2">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">Verify New Bid</div>
                <div className="text-[9px] text-blue-100 font-normal mt-0.5">Upload & analyze</div>
              </div>
            </button>

            {/* Action 2: Check Vendor */}
            <button
              onClick={() => navigate('/vendors')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-left transition-all flex flex-col justify-between group col-span-1"
            >
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight text-slate-900">Check Vendor</div>
                <div className="text-[9px] text-slate-500 font-normal mt-0.5">GST, PAN, Udyam</div>
              </div>
            </button>

            {/* Action 3: Generate Report */}
            <button
              onClick={() => navigate('/reports')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-left transition-all flex flex-col justify-between group col-span-1"
            >
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight text-slate-900">Generate Report</div>
                <div className="text-[9px] text-slate-500 font-normal mt-0.5">Compliance & memo</div>
              </div>
            </button>

            {/* Action 4: View Audit Trail */}
            <button
              onClick={() => navigate('/audit')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-left transition-all flex flex-col justify-between group col-span-1"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-2">
                <History className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight text-slate-900">View Audit Trail</div>
                <div className="text-[9px] text-slate-500 font-normal mt-0.5">Track all activities</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}