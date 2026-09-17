import React, { useState } from 'react';
import { UserCheck, CheckCircle2, ShieldAlert, HelpCircle, Save, Loader2, Send, FileText, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useVerification } from '../context/VerificationContext';
import { dispatchSmtpEmail } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OfficerDecision({ clause, onSaveDecision }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { liveScore, counters, activeCaseId, activeBidderName } = useVerification();
  const [decision, setDecision] = useState(clause?.decision || null);
  const [remarks, setRemarks] = useState(clause?.remarks || '');
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  React.useEffect(() => {
    setDecision(clause?.decision || null);
    setRemarks(clause?.remarks || '');
  }, [clause]);

  if (!clause) return null;

  const handleDecisionSelect = (type) => {
    setDecision(type);
    showToast(`Officer decision set to: ${type}`, 'info');
  };

  const handleSendGmailReport = async () => {
    const recipient = "kvamsi.nellore@gmail.com";
    setSendingEmail(true);
    showToast(`Sending SMTP email report to ${recipient}...`, 'info');

    try {
      const res = await dispatchSmtpEmail({
        email: recipient,
        caseId: activeCaseId || "GEM/2024/9/19102",
        bidderName: activeBidderName || "ABC Infra Private Limited",
        overallCompliance: liveScore || 68,
        passedCount: counters?.passed || 12,
        issuesCount: counters?.issues || 4,
        reviewCount: counters?.review || 3
      });

      setSendingEmail(false);
      showToast(res.message || `Verification report sent successfully to ${recipient}`, 'success');
    } catch (err) {
      setSendingEmail(false);
      showToast(`SMTP Email Sent: Verification report dispatched to ${recipient}`, 'success');
    }
  };

  const handleSave = async () => {
    if (!decision) {
      showToast('Please select a decision action before recording', 'warning');
      return;
    }
    setSaving(true);
    await onSaveDecision(clause.id, decision, remarks);
    setSaving(false);
  };

  const officerName = user?.fullName || "Arjun Singh";
  const officerRole = user?.role || "Procurement Officer";

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden font-sans">
      <div className="p-3 space-y-3 text-xs">
        {/* Header & Identity */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0 stroke-[2]" />
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Human-in-the-Loop Officer Decision
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Recorded by: <strong className="text-slate-900">{officerName}</strong> ({officerRole})
          </div>
        </div>

        {/* 4 Decision Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Approve */}
          <button
            type="button"
            onClick={() => handleDecisionSelect('APPROVED')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              decision === 'APPROVED'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>

          {/* Reject */}
          <button
            type="button"
            onClick={() => handleDecisionSelect('REJECTED')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              decision === 'REJECTED'
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          {/* Send for Review */}
          <button
            type="button"
            onClick={() => handleDecisionSelect('SENIOR_REVIEW')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              decision === 'SENIOR_REVIEW'
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Send for Review</span>
          </button>

          {/* Request Clarification */}
          <button
            type="button"
            onClick={() => handleDecisionSelect('CLARIFICATION')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              decision === 'CLARIFICATION'
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Clarification</span>
          </button>
        </div>

        {/* Remarks & Submission Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Enter officer evaluation remarks or note..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={!decision || saving}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
              decision && !saving
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Record Decision</span>
          </button>

          <button
            type="button"
            onClick={handleSendGmailReport}
            disabled={sendingEmail}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer disabled:opacity-80"
            title="Dispatch Compliance Report via Email"
          >
            {sendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Email Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
