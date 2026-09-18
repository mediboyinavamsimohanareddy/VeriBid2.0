import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Building2, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function LeftControlPanel({ 
  metadata = {}, 
  onMetadataChange, 
  onFileUpload 
}) {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFile(files[0]);
      showToast(`Ingested ${files.length} file(s) for verification`, 'success');
      if (onFileUpload) onFileUpload(files.length === 1 ? files[0] : files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFile(files[0]);
      showToast(`Ingested ${files.length} file(s) for verification`, 'success');
      if (onFileUpload) onFileUpload(files.length === 1 ? files[0] : files);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-xs h-full flex flex-col overflow-hidden text-xs">
      {/* Header */}
      <div className="bg-[#0B2545] text-white p-3 border-b border-slate-800 flex items-center justify-between">
        <span className="font-extrabold uppercase tracking-wider text-[11px]">Control Sidebar & Ingestion</span>
        <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
          NIC-GeM v4.2
        </span>
      </div>

      <div className="p-3.5 space-y-4 overflow-y-auto flex-1 font-sans">
        {/* Interactive Drag & Drop Upload Block */}
        <div>
          <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wide mb-1.5">
            1. Bid & Document File Ingestion
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-3 text-center transition-all cursor-pointer relative ${
              isDragging 
                ? 'border-blue-600 bg-blue-50/80 scale-[0.99]' 
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-blue-400'
            }`}
          >
            <input 
              type="file" 
              multiple
              accept=".pdf,.zip,.json,.xml,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-full">
                <Upload className="w-5 h-5 stroke-[2.5]" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {uploadedFile ? uploadedFile.name : "Drag & Drop Tender / Invoice Files"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Supports PDF, ZIP, JSON, Tax Invoices (Max 50MB)
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields & Metadata Extractor */}
        <div className="space-y-2.5 pt-1 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
              2. Extracted Procurement Metadata
            </label>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Auto-Parsed
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Tender ID</label>
            <input
              type="text"
              value={metadata.tenderId || 'GEM/2024/B/19102'}
              onChange={(e) => onMetadataChange('tenderId', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Estimated Procurement Value (₹)</label>
            <input
              type="number"
              value={metadata.estimatedValue || 650000}
              onChange={(e) => onMetadataChange('estimatedValue', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono font-extrabold text-blue-900 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Buyer Organization</label>
            <input
              type="text"
              value={metadata.buyerOrg || 'Ministry of Defence / Ordnance Board'}
              onChange={(e) => onMetadataChange('buyerOrg', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Bidding Type Strategy</label>
            <select
              value={metadata.biddingType || 'Online Bidding / Reverse Auction (RA)'}
              onChange={(e) => onMetadataChange('biddingType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
            >
              <option value="Direct Purchase (≤ ₹25,000)">Direct Purchase (≤ ₹25,000)</option>
              <option value="L1 Comparative Report (> ₹25k & ≤ ₹5L)">L1 Comparative Report (&gt; ₹25k &amp; ≤ ₹5L)</option>
              <option value="Online Bidding / Reverse Auction (RA) (> ₹5L)">Online Bidding / Reverse Auction (RA) (&gt; ₹5L)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">CFA Reg Status</label>
              <select
                value={metadata.cfaStatus || 'APPROVED'}
                onChange={(e) => onMetadataChange('cfaStatus', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-extrabold text-slate-800 focus:bg-white outline-none"
              >
                <option value="APPROVED">APPROVED</option>
                <option value="PENDING">PENDING</option>
                <option value="EXEMPTED">EXEMPTED</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">CRAC Readiness</label>
              <select
                value={metadata.cracStatus || 'PENDING_VERIFICATION'}
                onChange={(e) => onMetadataChange('cracStatus', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-extrabold text-slate-800 focus:bg-white outline-none"
              >
                <option value="READY">READY</option>
                <option value="PENDING_VERIFICATION">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Audit Context Metric */}
        <div className="bg-[#002147]/5 p-2.5 rounded-lg border border-slate-300 space-y-1 mt-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
            <span>Threshold Routing Rule:</span>
            <span className="font-mono text-blue-800 font-black">
              {metadata.estimatedValue <= 25000 ? 'DIRECT PURCHASE' : metadata.estimatedValue <= 500000 ? 'L1 COMPARATIVE' : 'REVERSE AUCTION'}
            </span>
          </div>
          <p className="text-[10px] text-slate-600 leading-tight">
            GeM Procurement Policy GFR Rule 149 compliant routing active.
          </p>
        </div>
      </div>
    </div>
  );
}
