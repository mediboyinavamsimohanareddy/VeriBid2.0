import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, AlertCircle, FileText, ArrowRight, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function RiskAnalysis() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const riskSignals = [
    {
      id: 'RSK-101',
      title: 'Turnover Requirement Shortfall',
      vendor: 'ABC Infra Private Limited',
      caseId: 'GEM/2024/B/19102',
      clause: '3.2.1 Average Annual Turnover',
      severity: 'HIGH RISK',
      evidence: 'Declared ₹3.53 Cr vs ₹5.00 Cr threshold required in Clause 3.2.1 (Shortfall: 29.4%).'
    },
    {
      id: 'RSK-102',
      title: 'OEM Authorization Letter Missing',
      vendor: 'ABC Infra Private Limited',
      caseId: 'GEM/2024/B/19102',
      clause: '4.1 OEM Authorization',
      severity: 'HIGH RISK',
      evidence: 'Manufacturer Authorization Form (MAF) not found in uploaded bid document package.'
    },
    {
      id: 'RSK-103',
      title: 'GSTIN Registration Cancelled / Inactive',
      vendor: 'Apex Logistics Ltd',
      caseId: 'GEM/2024/B/17391',
      clause: '3.2.3 GST Registration',
      severity: 'HIGH RISK',
      evidence: 'Tax GSTIN status returned Suo Moto CANCELLED on GST portal lookup.'
    },
    {
      id: 'RSK-104',
      title: 'Past Experience Order Value Slightly Below Preferred Threshold',
      vendor: 'ABC Infra Private Limited',
      caseId: 'GEM/2024/B/19102',
      clause: '3.2.3 Similar Experience',
      severity: 'MEDIUM RISK',
      evidence: 'Declared single order value ₹1.85 Cr vs preferred benchmark of ₹2.00 Cr.'
    }
  ];

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Risk Analysis Workspace</h1>
        <p className="text-xs text-slate-500 mt-0.5">Automated detection of non-compliant bids, missing mandatory certificates, and financial shortfalls</p>
      </div>

      <div className="space-y-3">
        {riskSignals.map((risk) => (
          <div key={risk.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded ${risk.severity === 'HIGH RISK' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{risk.title}</h3>
                  <p className="text-xs text-blue-700 font-semibold">{risk.vendor} • <span className="text-slate-500 font-mono">{risk.clause}</span></p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                risk.severity === 'HIGH RISK' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {risk.severity}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
              <strong className="text-slate-900 font-sans">Evidence Path: </strong>{risk.evidence}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  showToast(`Opening risk evidence for ${risk.id}`, 'info');
                  navigate(`/verification?caseId=${risk.caseId}`);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-flex items-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Evidence & Bid</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}