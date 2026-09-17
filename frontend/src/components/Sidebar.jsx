import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Landmark, 
  FileCheck, 
  FileText,
  Users, 
  ShieldAlert, 
  BarChart3,
  History,
  Bell,
  UserCog,
  Settings
} from 'lucide-react';
import emblemSvg from '../assets/emblem.svg';
import { useToast } from '../context/ToastContext';

export default function Sidebar({ onOpenUpload }) {
  const { showToast } = useToast();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tenders', path: '/tenders', icon: Landmark, count: 124 },
    { name: 'Bid Verification', path: '/verification', icon: FileCheck },
    { name: 'Document Verification', path: '/documents', icon: FileText },
    { name: 'Vendor Management', path: '/vendors', icon: Users },
    { name: 'Risk Analysis', path: '/risk', icon: ShieldAlert },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Audit Trail', path: '/audit', icon: History },
    { name: 'Notifications', path: '/notifications', icon: Bell, count: 5 },
    { name: 'User Management', path: '/users', icon: UserCog },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#071328] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800/80 select-none font-sans">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3 bg-[#0B1A30]">
        <div className="w-9 h-10 rounded bg-white flex items-center justify-center p-1 shrink-0 shadow-xs">
          <img src={emblemSvg} alt="Emblem" className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-black tracking-tight text-white">VeriBid</span>
            <span className="text-[9px] bg-blue-600/80 text-blue-100 font-bold px-1.5 py-0.5 rounded">AI</span>
          </div>
          <p className="text-[10px] font-medium text-slate-400">Bid Compliance Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => showToast(`Navigated to ${item.name}`, 'info')}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-[#10223A] hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className="w-4 h-4 shrink-0 stroke-[2]" />
                <span className="truncate text-xs font-medium">{item.name}</span>
              </div>
              {item.count && (
                <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full shrink-0">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="p-3 m-2.5 rounded-xl bg-[#0B1A30] border border-slate-800/90 text-center space-y-2">
        <div className="text-[11px] font-bold text-white tracking-wide">
          Transparent Procurement
        </div>
        <div className="text-[10px] text-slate-400">
          Stronger India
        </div>
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Operational
          </span>
          <span className="text-slate-500 font-mono">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
}
