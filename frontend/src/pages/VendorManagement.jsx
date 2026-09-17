import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Building2, CheckCircle2, AlertTriangle, ShieldCheck, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function VendorManagement() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const vendors = [
    {
      name: 'ABC Infra Private Limited',
      pan: 'AAACA1234F',
      gstin: '07AAAAA0000A1Z5',
      udyam: 'UDYAM-DL-01-0019201',
      status: 'Active / Verified GST',
      riskLevel: 'MEDIUM RISK',
      bidsCount: 3,
      caseId: 'GEM/2024/B/19102'
    },
    {
      name: 'TechServe Global India',
      pan: 'AABCT9876K',
      gstin: '27AABCT9876K1Z9',
      udyam: 'UDYAM-MH-02-0048123',
      status: 'Verified Compliant',
      riskLevel: 'LOW RISK',
      bidsCount: 5,
      caseId: 'GEM/2024/B/18442'
    },
    {
      name: 'Apex Logistics Ltd',
      pan: 'AAACAL0091L',
      gstin: '06AAACAL0091L1Z2',
      udyam: 'UDYAM-HR-03-0091234',
      status: 'GST Cancelled',
      riskLevel: 'HIGH RISK',
      bidsCount: 2,
      caseId: 'GEM/2024/B/17391'
    }
  ];

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Central repository for bidder profile verification, GSTIN status, PAN validation, and risk signals</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor by name, PAN, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredVendors.map((vendor) => (
          <div key={vendor.name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{vendor.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono">PAN: {vendor.pan}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                vendor.riskLevel === 'LOW RISK' ? 'bg-emerald-100 text-emerald-800' :
                vendor.riskLevel === 'MEDIUM RISK' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {vendor.riskLevel}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">GSTIN:</span>
                <span className="font-mono font-bold text-slate-800">{vendor.gstin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Udyam Registration:</span>
                <span className="font-mono text-slate-700">{vendor.udyam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Past Bids Submitted:</span>
                <span className="font-bold text-slate-900">{vendor.bidsCount} Bids</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700">{vendor.status}</span>
              <button
                onClick={() => {
                  showToast(`Viewing history for ${vendor.name}`, 'info');
                  navigate(`/verification?caseId=${vendor.caseId}`);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Bids</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}