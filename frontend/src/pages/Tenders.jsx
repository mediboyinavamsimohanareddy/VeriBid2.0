import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Landmark, Users, ArrowRight, Eye, Calendar, Building, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Tenders() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  const tenders = [
    {
      id: 'GEM/2026/B/12345',
      title: 'Construction & Civil Works Package II',
      department: 'Ministry of Defence / Ordnance Board',
      closingDate: '30 Sep 2026',
      bidsCount: 14,
      value: '₹ 15.00 Cr',
      status: 'Active',
      caseId: 'GEM/2024/B/19102'
    },
    {
      id: 'GEM/2026/B/12346',
      title: 'IT Hardware & Server Infrastructure Ingestion',
      department: 'Ministry of Finance / Income Tax',
      closingDate: '25 Sep 2026',
      bidsCount: 8,
      value: '₹ 8.50 Cr',
      status: 'Active',
      caseId: 'GEM/2024/B/18442'
    },
    {
      id: 'GEM/2026/B/12347',
      title: 'Logistics Fleet & Freight Transportation Contract',
      department: 'Ministry of Railways / Northern Railway',
      closingDate: '20 Sep 2026',
      bidsCount: 22,
      value: '₹ 24.10 Cr',
      status: 'Under Evaluation',
      caseId: 'GEM/2024/B/17391'
    },
    {
      id: 'GEM/2026/B/12348',
      title: 'Solar Power Plant Equipment Supply & Maintenance',
      department: 'Ministry of New & Renewable Energy',
      closingDate: '15 Oct 2026',
      bidsCount: 6,
      value: '₹ 12.00 Cr',
      status: 'Active',
      caseId: 'GEM/2024/B/19102'
    },
    {
      id: 'GEM/2026/B/12349',
      title: 'Medical Devices & Hospital Laboratory Consumables',
      department: 'Ministry of Health & Family Welfare',
      closingDate: '18 Oct 2026',
      bidsCount: 19,
      value: '₹ 5.80 Cr',
      status: 'Active',
      caseId: 'GEM/2024/B/18442'
    }
  ];

  const filteredTenders = tenders.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'ALL' || t.department.includes(filterDepartment);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tender Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Browse active government procurement tenders and associated bidder submissions</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tender by ID, title, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Defence">Ministry of Defence</option>
            <option value="Finance">Ministry of Finance</option>
            <option value="Railways">Ministry of Railways</option>
          </select>
        </div>
      </div>

      {/* Tenders List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-2.5 px-4">Tender ID</th>
                <th className="py-2.5 px-4">Tender Title</th>
                <th className="py-2.5 px-4">Department / Org</th>
                <th className="py-2.5 px-4">Closing Date</th>
                <th className="py-2.5 px-4">Est. Value</th>
                <th className="py-2.5 px-4 text-center">Bids Received</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTenders.map((tender) => (
                <tr key={tender.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-blue-700">{tender.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{tender.title}</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">{tender.department}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs font-mono">{tender.closingDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{tender.value}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">{tender.bidsCount} Bids</td>
                  <td className="py-3 px-4">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {tender.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        showToast(`Opening Bid Verification for ${tender.id}`, 'info');
                        navigate(`/verification?caseId=${tender.caseId}`);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-md transition-colors inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Verify Bids</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}