import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Sparkles, 
  Cpu, 
  Scale, 
  GraduationCap, 
  FileText, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { ActiveTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, resetToDefaultData, employees, projects } = useWorkforce();

  // Quick live badge counts
  const overallocatedCount = employees.filter((e) => e.remainingCapacity < 0).length;
  const unstaffedProjectsCount = projects.filter((p) => p.assignedTeamMemberIds.length === 0).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'team-builder', label: 'Team Builder', icon: <Sparkles className="w-4 h-4 text-teal-400" />, badge: unstaffedProjectsCount > 0 ? unstaffedProjectsCount : undefined, badgeColor: 'bg-teal-500/20 text-teal-300' },
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'workload-planner', label: 'Workload Planner', icon: <Scale className="w-4 h-4" />, badge: overallocatedCount > 0 ? overallocatedCount : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'skills-intelligence', label: 'Skills Intelligence', icon: <Cpu className="w-4 h-4" /> },
    { id: 'training', label: 'Training Catalog', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'reports', label: 'Audits & Reports', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg">
              W
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                WorkWise <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider px-1 py-0.5 rounded bg-teal-950/80 border border-teal-800/60">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-medium">Enterprise Workforce</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono tracking-tight">
            Right Talent · Right Project
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Decision Support
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-teal-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Fairness & Reset Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>Fair & Explainable AI Matching</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
          100% transparent scoring. No black-box automated hiring or termination.
        </p>

        <button
          onClick={resetToDefaultData}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
          title="Reset all employees, projects, and workload to initial hackathon demonstration state"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
