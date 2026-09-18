import React, { useState, useEffect } from 'react';
import { Sparkles, FileCheck, AlertTriangle, FileX, Loader2, X, ShieldAlert, ArrowRight, Info } from 'lucide-react';
import { fetchDemoCases, processDemoCase } from '../services/api';
import { useVerification } from '../context/VerificationContext';
import { useToast } from '../context/ToastContext';

export default function DemoCasesModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const { startVerificationWorkflow, isProcessing } = useVerification();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCases();
    }
  }, [isOpen]);

  const loadCases = async () => {
    const data = await fetchDemoCases();
    setCases(data);
  };

  if (!isOpen) return null;

  const handleRunDemo = async (caseId) => {
    if (isProcessing) return;
    setSelectedCaseId(caseId);
    setLoading(true);

    showToast(`Loading synthetic demo dataset (${caseId}) through AI verification pipeline...`, 'info');

    const result = await processDemoCase(caseId);

    setLoading(false);
    showToast(`Synthetic demo case ${caseId} processed successfully!`, 'success');

    // Trigger verification workflow in state
    if (result && result.analysis) {
      // Fetch demo PDF from demo-data if available
      try {
        const demoPdfRes = await fetch(`http://localhost:8000/demo-data/${caseId}`);
        if (demoPdfRes.ok) {
          const blob = await demoPdfRes.blob();
          const file = new File([blob], `${caseId}_Package.pdf`, { type: "application/pdf" });
          startVerificationWorkflow(file, result.analysis);
          onClose();
          return;
        }
      } catch (e) {
        console.warn("Could not fetch demo PDF file, using dummy blob", e);
      }

      startVerificationWorkflow(
        new File(["%PDF-1.4 Demonstration PDF Document"], `${caseId}_Package.pdf`, { type: "application/pdf" }),
        result.analysis
      );
    }
    
    onClose();
  };

  const caseIcons = {
    Case_A_Consistent: <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
    Case_B_Mismatch_Review: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    Case_C_Incomplete: <FileX className="w-5 h-5 text-rose-600 shrink-0" />
  };

  const caseBadges = {
    Case_A_Consistent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Case_B_Mismatch_Review: 'bg-amber-100 text-amber-800 border-amber-200',
    Case_C_Incomplete: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn font-sans">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">Try with Demo Documents</h2>
              <p className="text-[10px] text-slate-300 font-medium">SIH 2026 National Jury Interactive Evaluation Suite</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start space-x-2 text-[11px] text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Synthetic Test Dataset Notice: </strong>
            Every document in this suite is fictional test data generated strictly for demonstration purposes. Documents actually flow through the live OCR, vector RAG, and forensic compliance engine.
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="p-5 space-y-3.5 max-h-[480px] overflow-y-auto">
          {cases.map((c) => {
            const caseKey = c.case_id;
            const isLoadingThis = loading && selectedCaseId === caseKey;

            return (
              <div 
                key={caseKey}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    {caseIcons[caseKey] || <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        Vendor: <span className="text-slate-800 font-bold">{c.bidder_name}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${caseBadges[caseKey] || 'bg-slate-100 text-slate-700'}`}>
                    {c.badge || 'DEMO SCENARIO'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {c.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Purpose: {c.purpose}
                  </span>

                  <button
                    onClick={() => handleRunDemo(caseKey)}
                    disabled={loading || isProcessing}
                    className={`py-1.5 px-3.5 rounded-lg text-xs font-bold text-white flex items-center space-x-1.5 transition-all shadow-2xs ${
                      loading || isProcessing
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoadingThis ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <span>Load Demo Case</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span className="font-semibold">GeM Forensic Verification Engine v2.0 • Synthetic Jury Dataset</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
