import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, Search, Eye, FileCheck, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function DocumentVerification() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const documents = [
    {
      id: 'DOC-901',
      bidder: 'ABC Infra Private Limited',
      docType: 'Statement of Profit & Loss FY 2022-23',
      filename: 'Statement_of_Profit_and_Loss.pdf',
      status: 'Extracted',
      extractedValue: 'Revenue from Operations ₹ 3,53,00,000',
      finding: 'Turnover 29.4% below requirement (₹ 5.00 Cr req)',
      caseId: 'GEM/2024/B/19102'
    },
    {
      id: 'DOC-902',
      bidder: 'ABC Infra Private Limited',
      docType: 'Audited Balance Sheet FY 2022-23',
      filename: 'Audited_Balance_Sheet_2023.pdf',
      status: 'Extracted',
      extractedValue: 'Shareholders Equity ₹ 12,40,00,000',
      finding: 'Compliant Positive Net Worth',
      caseId: 'GEM/2024/B/19102'
    },
    {
      id: 'DOC-903',
      bidder: 'TechServe Global India',
      docType: 'GST Registration Certificate',
      filename: 'GST_Registration.pdf',
      status: 'Verified',
      extractedValue: 'GSTIN 07AAAAA0000A1Z5 Status: ACTIVE',
      finding: 'Active Tax Compliance',
      caseId: 'GEM/2024/B/18442'
    },
    {
      id: 'DOC-904',
      bidder: 'Apex Logistics Ltd',
      docType: 'GST Registration Certificate',
      filename: 'Apex_GST_Certificate.pdf',
      status: 'Issue',
      extractedValue: 'GSTIN Status: CANCELLED (Suo Moto)',
      finding: 'GSTIN Cancelled on Tax Portal',
      caseId: 'GEM/2024/B/17391'
    }
  ];

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Document Verification Workspace</h1>
        <p className="text-xs text-slate-500 mt-0.5">Inspect individual bidder uploaded files, extracted fields, and validation findings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{doc.id}</span>
                <h3 className="text-sm font-bold text-slate-900">{doc.docType}</h3>
                <p className="text-xs text-blue-700 font-medium">{doc.bidder}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                doc.status === 'Issue' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Extracted Data</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                {doc.extractedValue}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">{doc.finding}</span>
              <button
                onClick={() => {
                  showToast(`Opening document view for ${doc.filename}`, 'info');
                  navigate(`/verification?caseId=${doc.caseId}`);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Evidence</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}