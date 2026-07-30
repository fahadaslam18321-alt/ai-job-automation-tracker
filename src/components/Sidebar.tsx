import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Target, 
  BarChart3, 
  User, 
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'generator' | 'skills' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'generator' | 'skills' | 'analytics') => void;
  profile: CandidateProfile;
  onOpenProfile: () => void;
  totalApplications: number;
  interviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
  totalApplications,
  interviewCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Job Dashboard',
      description: 'Track applications & status',
      icon: LayoutDashboard,
      badge: totalApplications > 0 ? totalApplications.toString() : undefined
    },
    {
      id: 'generator' as const,
      label: 'Tailor & Generator',
      description: '3 Bullets & Cover Letter',
      icon: Sparkles,
      badge: 'AI'
    },
    {
      id: 'skills' as const,
      label: 'Skill Match Analysis',
      description: 'Identify missing keywords',
      icon: Target
    },
    {
      id: 'analytics' as const,
      label: 'Analytics & Insights',
      description: 'Conversion & metrics',
      icon: BarChart3
    }
  ];

  return (
    <aside id="app-sidebar" className="w-72 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Briefcase className="h-5.5 w-5.5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-base tracking-tight text-white">JobPulse AI</h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">PRO</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Application Automation Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav id="sidebar-navigation" className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Core Workflows
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <div className="text-left">
                  <div className="leading-snug">{item.label}</div>
                  <div className={`text-[11px] font-normal ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : item.badge === 'AI' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Stats Pill */}
        <div className="mt-6 mx-1 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-300 font-medium">
            <span>Interview Pipeline</span>
            <span className="text-indigo-400 font-bold text-sm">{interviewCount} active</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalApplications > 0 ? Math.min((interviewCount / totalApplications) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      </nav>

      {/* Candidate Profile Widget */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          id="btn-sidebar-profile"
          onClick={onOpenProfile}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-colors border border-slate-700/40 text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
              {profile.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{profile.fullName}</div>
              <div className="text-[11px] text-slate-400 truncate">{profile.currentRole}</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white shrink-0" />
        </button>
      </div>
    </aside>
  );
};
