import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, Search, Calendar, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import emblemSvg from '../assets/emblem.svg';

export default function Header() {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [financialYear, setFinancialYear] = useState('FY 2026-27');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out of GeM Procurement Portal session', 'info');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`Searching for: "${searchQuery}"`, 'info');
    }
  };

  // Current formatted date/time
  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const todayTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 px-5 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Government & GeM Branding */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-9 flex items-center justify-center shrink-0">
            <img src={emblemSvg} alt="Satyamev Jayate Emblem" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 leading-tight">
              Government of India
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              Ministry of Finance
            </p>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

        <div className="hidden sm:flex items-center space-x-2">
          <div className="bg-blue-900 text-white p-1 rounded font-black text-[10px] tracking-tight">
            GeM
          </div>
          <div className="text-[10px] font-semibold text-slate-700">
            eMarketplace
            <span className="block text-[8px] text-slate-500 font-normal">One Nation • One Marketplace</span>
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenders, bidders, documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none rounded-lg text-xs transition-all border border-transparent focus:border-blue-600"
          />
        </div>
      </form>

      {/* Right Controls: Date/Time, FY Selector, Notifications, Officer Profile */}
      <div className="flex items-center space-x-3">
        {/* Date / Time */}
        <div className="hidden lg:flex items-center space-x-2 text-slate-500 text-xs border-r border-slate-200 pr-3">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-700 leading-none">{todayDate}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{todayTime}</div>
          </div>
        </div>

        {/* FY Selector */}
        <select
          value={financialYear}
          onChange={(e) => setFinancialYear(e.target.value)}
          className="hidden xl:block bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer transition-colors"
        >
          <option value="FY 2026-27">FY 2026-27</option>
          <option value="FY 2025-26">FY 2025-26</option>
          <option value="FY 2024-25">FY 2024-25</option>
        </select>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile Badge */}
        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-2.5 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              {user?.fullName ? user.fullName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'PR'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user?.fullName || "Procurement Officer"}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {user?.department || "Ministry of Finance"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* User Menu Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl py-1 z-50 text-xs animate-fade-up">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{user?.fullName || "Procurement Officer"}</div>
                <div className="text-[10px] text-slate-500">{user?.email || "officer@gem.gov.in"}</div>
                <div className="text-[9px] text-blue-600 font-bold mt-1">
                  Role: {user?.role || "Senior Procurement Officer"}
                </div>
              </div>

              <button
                onClick={() => { setShowMenu(false); navigate('/settings'); }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                Account Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold flex items-center space-x-2 transition-colors border-t border-slate-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
