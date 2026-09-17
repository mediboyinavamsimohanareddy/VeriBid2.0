import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import TenderClauses from '../components/TenderClauses';
import EvidenceViewer from '../components/EvidenceViewer';
import RightAuditPanel from '../components/RightAuditPanel';
import WorkflowStepper from '../components/WorkflowStepper';
import DocumentUploadModal from '../components/DocumentUploadModal';
import ClarificationModal from '../components/ClarificationModal';
import OfficerDecision from '../components/OfficerDecision';
import { saveOfficerDecision } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useVerification } from '../context/VerificationContext';

export default function Verification() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const caseIdFromUrl = searchParams.get('caseId');

  const { 
    clauses, 
    selectedClause, 
    selectClause, 
    loadCaseById,
    activeCaseId,
    activeBidderName,
    currentStage,
    isProcessing,
    activeSession
  } = useVerification();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);

  useEffect(() => {
    if (caseIdFromUrl) {
      loadCaseById(caseIdFromUrl);
      showToast(`Loaded Case ${caseIdFromUrl} into Bid Verification Workspace`, 'info');
    }
  }, [caseIdFromUrl]);

  const handleSaveDecision = async (clauseId, decision, remarks) => {
    if (decision === 'CLARIFICATION') {
      setIsClarificationOpen(true);
      return;
    }
    await saveOfficerDecision(activeCaseId || "GEM/2024/9/19102", clauseId, decision, remarks);
    showToast(`Officer decision recorded: ${decision} for Clause ${clauseId}`, 'success');
  };

  const statusLabel = isProcessing
    ? "Verification In Progress"
    : activeSession
    ? "Verification Complete"
    : "Ready For Verification";

  return (
    <div className="space-y-4 font-sans animate-fade-up select-none">
      {/* 1. TOP CASE CONTEXT HEADER (Matching Reference Image 2) */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Case ID Badge / Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-left cursor-pointer hover:border-blue-500 transition-colors">
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none mb-0.5">CASE ID</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-slate-900 font-mono">{activeCaseId || "GEM/2024/9/19102"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Bidder Badge / Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-left cursor-pointer hover:border-blue-500 transition-colors">
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none mb-0.5">BIDDER</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-extrabold text-slate-900">{activeBidderName || "ABC Infra Private Limited"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Verification Status Badge */}
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden md:block">
          GeM Compliance Verification Engine • GFR Rule 149
        </div>
      </div>

      {/* 2. TOP STEPPER & OVERALL COMPLIANCE BAR */}
      <WorkflowStepper />

      {/* 3. MAIN 3-COLUMN WORKSPACE (Matching Reference Image 2 Desktop Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[620px] items-stretch">
        {/* Left Column: REQUIRED PROPERTIES (3 Cols) */}
        <div className="lg:col-span-3 h-[620px]">
          <TenderClauses
            clauses={clauses}
            selectedClauseId={selectedClause?.id}
            onSelectClause={(c) => selectClause(c)}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        </div>

        {/* Center Column: DOCUMENT READER AND EVIDENCE (6 Cols) */}
        <div className="lg:col-span-6 h-[620px]">
          <EvidenceViewer
            clause={selectedClause}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        </div>

        {/* Right Column: REAL-TIME VERIFICATION + LIVE FINDINGS (3 Cols) */}
        <div className="lg:col-span-3 h-[620px]">
          <RightAuditPanel />
        </div>
      </div>

      {/* 4. VERIFICATION PROGRESS INDICATOR BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          VERIFICATION PROGRESS
        </div>

        <div className="flex items-center justify-between px-2 overflow-x-auto text-xs py-1">
          <div className={`flex items-center space-x-2 font-bold ${currentStage >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</span>
            <span>Upload Documents</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

          <div className={`flex items-center space-x-2 font-bold ${currentStage >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
            <span>Analysis</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

          <div className={`flex items-center space-x-2 font-bold ${currentStage >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
            <span>Evidence</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />

          <div className={`flex items-center space-x-2 font-bold ${currentStage >= 4 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>4</span>
            <span>Decision</span>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM HUMAN-IN-THE-LOOP OFFICER ACTION BAR */}
      <OfficerDecision clause={selectedClause} onSaveDecision={handleSaveDecision} />

      {/* Modals */}
      <DocumentUploadModal
        caseId={activeCaseId || "GEM/2024/9/19102"}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <ClarificationModal
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        clause={selectedClause}
        bidderName={activeBidderName || "ABC Infra Private Limited"}
      />
    </div>
  );
}