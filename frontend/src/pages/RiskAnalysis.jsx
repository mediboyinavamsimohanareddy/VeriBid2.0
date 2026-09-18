import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Network, Search, Cpu, Eye, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function RiskAnalysis() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const riskSignals = [
    {
      id: 'RSK-101',
      title: 'Turnover Requirement Shortfall & UDIN Failure',
      vendor: 'ABC Infra Private Limited',
      caseId: 'GEM/2024/B/19102',
      clause: '3.2.1 Average Annual Turnover',
      severity: 'HIGH RISK',
      evidence: 'Declared ₹3.53 Cr vs ₹5.00 Cr threshold required in Clause 3.2.1 (Shortfall: 29.4%).',
      shap_feature_importance: [
        { feature: 'UDIN Verification Failure', impact: '+32%' },
        { feature: 'Turnover Shortfall (29.4%)', impact: '+23%' },
        { feature: 'Address Discrepancy (GST vs PAN)', impact: '+15%' }
      ],
      graph_collusion: {
        detected: true,
        cluster_id: 'CARTEL_GRP_09',
        shared_attributes: ['PDF Author Metadata', 'Bank IFSC Code']
      },
      forgery_analysis: {
        tamper_detected: true,
        method: 'Error Level Analysis (ELA)',
        confidence: 0.94,
        flagged_regions: [{ x: 120, y: 340, width: 200, height: 50 }]
      }
    },
    {
      id: 'RSK-102',
      title: 'OEM Authorization Letter Missing',
      vendor: 'ABC Infra Private Limited',
      caseId: 'GEM/2024/B/19102',
      clause: '4.1 OEM Authorization',
      severity: 'HIGH RISK',
      evidence: 'Manufacturer Authorization Form (MAF) not found in uploaded bid document package.',
      shap_feature_importance: [
        { feature: 'Missing Mandatory OEM Authorization', impact: '+25%' }
      ],
      graph_collusion: {
        detected: false,
        cluster_id: 'NONE',
        shared_attributes: []
      },
      forgery_analysis: {
        tamper_detected: false,
        method: 'Error Level Analysis (ELA)',
        confidence: 0.12,
        flagged_regions: []
      }
    },
    {
      id: 'RSK-103',
      title: 'GSTIN Registration Cancelled / Inactive',
      vendor: 'Apex Logistics Ltd',
      caseId: 'GEM/2024/B/17391',
      clause: '3.2.3 GST Registration',
      severity: 'HIGH RISK',
      evidence: 'Tax GSTIN status returned Suo Moto CANCELLED on GST portal lookup.',
      shap_feature_importance: [
        { feature: 'GSTIN Inactive/Cancelled on Portal', impact: '+35%' }
      ],
      graph_collusion: {
        detected: true,
        cluster_id: 'CARTEL_GRP_04',
        shared_attributes: ['Subnet IP Address', 'Shared Contact Phone']
      },
      forgery_analysis: {
        tamper_detected: false,
        method: 'Error Level Analysis (ELA)',
        confidence: 0.18,
        flagged_regions: []
      }
    },
    {
      id: 'RSK-104',
      title: 'Past Experience Order Value Slightly Below Preferred Threshold',
      vendor: 'ABC Infra Private Limited',
      caseId: 'GEM/2024/B/19102',
      clause: '3.2.3 Similar Experience',
      severity: 'MEDIUM RISK',
      evidence: 'Declared single order value ₹1.85 Cr vs preferred benchmark of ₹2.00 Cr.',
      shap_feature_importance: [
        { feature: 'Experience Contract Margin Variance', impact: '+12%' }
      ],
      graph_collusion: {
        detected: false,
        cluster_id: 'NONE',
        shared_attributes: []
      },
      forgery_analysis: {
        tamper_detected: false,
        method: 'Error Level Analysis (ELA)',
        confidence: 0.10,
        flagged_regions: []
      }
    }
  ];

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Risk Analysis & ML Forensic Workspace</h1>
        <p className="text-xs text-slate-500 mt-0.5">Automated detection of non-compliant bids, document image tampering (ELA), SHAP risk attribution, and collusion rings</p>
      </div>

      <div className="space-y-3">
        {riskSignals.map((risk) => (
          <div key={risk.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
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

            {/* ADVANCED FORENSIC ML BADGES & SHAP EXPLANATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              {/* SHAP XAI Badges */}
              <div className="p-2.5 bg-slate-900 text-white rounded-lg text-xs space-y-1">
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>SHAP XAI Feature Attribution</span>
                </div>
                <div className="space-y-1 pt-0.5">
                  {risk.shap_feature_importance.map((f, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-300 truncate pr-1">{f.feature}</span>
                      <span className="text-rose-400 font-bold">{f.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Image Forgery / ELA Status */}
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                risk.forgery_analysis.tamper_detected
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider">
                  <Search className={`w-3 h-3 ${risk.forgery_analysis.tamper_detected ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span>Document Vision Forensics</span>
                </div>
                <div className="text-[11px] font-bold">
                  {risk.forgery_analysis.tamper_detected ? (
                    <span className="text-rose-700 font-extrabold">Potential Manipulation Detected</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">No Image Tampering Detected</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Method: {risk.forgery_analysis.method} (Conf: {(risk.forgery_analysis.confidence * 100).toFixed(0)}%)
                </div>
              </div>

              {/* Cartel & Collusion Graph Network Status */}
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                risk.graph_collusion.detected
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider">
                  <Network className={`w-3 h-3 ${risk.graph_collusion.detected ? 'text-amber-600' : 'text-slate-500'}`} />
                  <span>Cartel & Collusion Graph ML</span>
                </div>
                <div className="text-[11px] font-bold">
                  {risk.graph_collusion.detected ? (
                    <span className="text-amber-800 font-extrabold">Collusion Cluster: {risk.graph_collusion.cluster_id}</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">Clean Independent Submission</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-600">
                  Shared: {risk.graph_collusion.shared_attributes.length > 0 ? risk.graph_collusion.shared_attributes.join(', ') : 'None'}
                </div>
              </div>
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
