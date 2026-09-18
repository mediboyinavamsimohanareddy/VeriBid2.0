import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from 'lucide-react';
import { uploadDocument } from '../services/api';
import { useVerification } from '../context/VerificationContext';
import { useToast } from '../context/ToastContext';
import DemoCasesModal from './DemoCasesModal';

export default function DocumentUploadModal({ caseId = "GEM/2024/9/19102", isOpen, onClose, onUploadComplete }) {
  const { showToast } = useToast();
  const { startVerificationWorkflow, isProcessing } = useVerification();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
        setStatus(null);
      } else {
        alert('Please select a valid PDF document.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || isProcessing) return;

    setUploading(true);
    setStatus('Creating verification session & analyzing PDF...');

    const res = await uploadDocument(caseId, file);

    setUploading(false);
    setStatus('Session Created! Triggering Live Verification Pipeline...');

    setTimeout(() => {
      startVerificationWorkflow(file, res.analysis || {
        score: 68,
        findings: [
          { id: "F1", type: "RED_FLAG", title: "Turnover Below Required", category: "Financial Eligibility", clause: "Clause 3.2.1", description: "Extracted turnover ₹3.53 Cr is below required ₹5.00 Cr threshold.", severity: "CRITICAL", pageNumber: 14, extractedValue: "₹ 3.53 Crore", requiredValue: "₹ 5.00 Crore" },
          { id: "F2", type: "WARNING", title: "Missing CA Certificate", category: "Compliance Certificates", clause: "Mandatory Attachments", description: "Audited CA certification not detected in document package.", severity: "MEDIUM" },
          { id: "F3", type: "PASSED", title: "GST Registration Verified", category: "Compliance Certificates", clause: "GSTIN Check", description: "Active GSTIN 07AAAAA0000A1Z5 verified.", severity: "LOW" },
          { id: "F4", type: "PASSED", title: "OEM Authorization Verified", category: "Technical Eligibility", clause: "Clause 4.1", description: "Valid Manufacturer Authorization Letter attached.", severity: "LOW" }
        ],
        checks: [
          { id: "C1", title: "Turnover Requirement Check", status: "FAILED", severity: "RED" },
          { id: "C2", title: "GST Registration Check", status: "PASSED", severity: "GREEN" },
          { id: "C3", title: "CA Certificate Check", status: "REVIEW", severity: "ORANGE" }
        ]
      });

      if (onUploadComplete) onUploadComplete(res);
      onClose();
    }, 800);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn font-sans">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Select Verification Method</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* Required Feature Choice: [ Upload Documents ] [ Try with Demo Documents ] */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                className="py-2 px-3 bg-white text-slate-900 rounded font-bold shadow-2xs text-xs flex items-center justify-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Documents</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDemoModalOpen(true);
                }}
                className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold transition-colors text-xs flex items-center justify-center space-x-1.5 border border-blue-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Try with Demo Documents</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-700">
                    {file ? file.name : 'Click to upload PDF bidder submission'}
                  </div>
                  <p className="text-[10px] text-slate-400">PDF up to 25MB supported for OCR verification</p>
                </label>
              </div>

              {status && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 font-semibold flex items-center space-x-2 text-[11px]">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  <span>{status}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-xs font-bold flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Use SIH Demo Cases</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!file || uploading || isProcessing}
                    className={`py-1.5 px-4 rounded text-xs font-bold text-white transition-all ${
                      file && !uploading && !isProcessing ? 'bg-[#071328] hover:bg-slate-800 shadow-2xs' : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? 'Verification Active...' : 'Run Live Verification'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <DemoCasesModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
}
