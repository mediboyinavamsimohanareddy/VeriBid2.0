import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const notifications = [
    {
      id: 1,
      title: '3 bidders have expired GST certificates',
      desc: 'ABC Infra Private Limited and 2 other vendors have expired or cancelled GST status.',
      time: '2 hours ago',
      type: 'HIGH',
      path: '/risk'
    },
    {
      id: 2,
      title: '5 bids have name mismatches across documents',
      desc: 'Cross-document verification detected company name discrepancies in financial attachments.',
      time: '5 hours ago',
      type: 'MEDIUM',
      path: '/documents'
    },
    {
      id: 3,
      title: '2 vendors found in blacklisted database',
      desc: 'Automated database lookup flagged vendor entities on central procurement warning list.',
      time: '1 day ago',
      type: 'HIGH',
      path: '/vendors'
    },
    {
      id: 4,
      title: 'Verification completed for Case GEM/2024/B/18442',
      desc: 'TechServe Global India compliance score calculated: 92/100 (Compliant).',
      time: '1 day ago',
      type: 'INFO',
      path: '/verification?caseId=GEM/2024/B/18442'
    }
  ];

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Alerts & Notifications</h1>
        <p className="text-xs text-slate-500 mt-0.5">High-priority alerts, document expiration warnings, and automated verification completion events</p>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => navigate(n.path)}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex items-start justify-between"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                n.type === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                n.type === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600">{n.desc}</p>
                <span className="text-[10px] text-slate-400 font-mono inline-block pt-1">{n.time}</span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
              n.type === 'HIGH' ? 'bg-rose-50 text-rose-800 border-rose-200' :
              n.type === 'MEDIUM' ? 'bg-amber-50 text-amber-800 border-amber-200' :
              'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {n.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}