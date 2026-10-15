import React, { useState } from 'react';
import { 
  Plus, 
  HelpCircle, 
  FolderPlus, 
  UserPlus, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';

interface HeaderProps {
  onOpenNewEmployeeModal: () => void;
  onOpenNewProjectModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewEmployeeModal,
  onOpenNewProjectModal,
}) => {
  const { activeTab, employees, projects } = useWorkforce();
  const [showFairnessModal, setShowFairnessModal] = useState(false);

  // Compute live top stats
  const totalEmployees = employees.length;
  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;
  const totalCapacity = employees.reduce((acc, e) => acc + e.weeklyCapacity, 0);
  const totalAllocated = employees.reduce((acc, e) => acc + e.allocatedHours, 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Workforce Intelligence Dashboard', subtitle: 'Live capacity health, talent distribution, and project staffing posture' };
      case 'team-builder':
        return { title: 'Smart Project Team Builder', subtitle: 'Explainable weighted matching, complementary skills assembly, and alternative teams' };
      case 'employees':
        return { title: 'Talent Directory', subtitle: 'Searchable employee profiles, verified proficiencies, and real-time workload limits' };
      case 'projects':
        return { title: 'Projects Portfolio', subtitle: 'Required competencies, staffing status, and delivery milestones' };
      case 'workload-planner':
        return { title: 'Workload & Capacity Planner', subtitle: 'Balanced allocation management with intelligent one-click rebalancing' };
      case 'skills-intelligence':
        return { title: 'Skills Matrix & Gap Intelligence', subtitle: 'Organizational skill inventory, coverage ratios, and pipeline risk areas' };
      case 'training':
        return { title: 'Enterprise Training & Upskilling', subtitle: 'Curated learning paths aligned directly to active project skill shortages' };
      case 'reports':
        return { title: 'Workforce Audits & Decision Reports', subtitle: 'Executive utilization logs, staffing completeness audits, and ethical compliance' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-slate-600">/</span>
              <span>{totalEmployees} Staff</span>
              <span>·</span>
              <span>{activeProjectsCount} Active Projects</span>
              <span>·</span>
              <span className={avgUtilization > 85 ? 'text-amber-400' : 'text-teal-400'}>
                {avgUtilization}% Org Util
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFairnessModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="View Ethical & Explainable AI Audit Model"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Fairness Model</span>
          </button>

          <button
            onClick={onOpenNewEmployeeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Add Employee</span>
          </button>

          <button
            onClick={onOpenNewProjectModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-950" />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Fairness & Explainability Modal */}
      {showFairnessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">WorkWise AI: Fairness & Explainability Charter</h3>
              </div>
              <button
                onClick={() => setShowFairnessModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-300">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-400" />
                  Deterministic Weighted Scoring Model
                </div>
                <p className="text-slate-400 text-[11px]">
                  All candidate matches are calculated using open, verifiable math:
                  <span className="font-mono text-teal-300 block mt-1">
                    Score = (Skill Match × 50%) + (Experience × 20%) + (Availability × 20%) + (Workload Balance × 10%)
                  </span>
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-white">Ethical Guardrails:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>
                    <strong className="text-slate-200">No Protected Attributes:</strong> Gender, age, ethnicity, or personal background are strictly omitted from matching calculations.
                  </li>
                  <li>
                    <strong className="text-slate-200">Anti-Concealment Rule:</strong> Missing skills or negative remaining capacity are explicitly surfaced in warnings; they cannot be hidden by high skill scores.
                  </li>
                  <li>
                    <strong className="text-slate-200">Human-In-The-Loop:</strong> The AI proposes recommendations and compositions; managers retain 100% final approval and can adjust weighting parameters in real time.
                  </li>
                  <li>
                    <strong className="text-slate-200">Zero Black-Box Actions:</strong> No autonomous hiring, firing, or disciplinary actions.
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFairnessModal(false)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Understood & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
