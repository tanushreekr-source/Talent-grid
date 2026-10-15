import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  TrendingUp,
  Award
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';

export const ReportsView: React.FC = () => {
  const { employees, projects, trainingCourses } = useWorkforce();

  const totalEmployees = employees.length;
  const activeProjects = projects.filter((p) => p.status === 'Active');
  const totalCapacity = employees.reduce((sum, e) => sum + e.weeklyCapacity, 0);
  const totalAllocated = employees.reduce((sum, e) => sum + e.allocatedHours, 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

  const overallocatedStaff = employees.filter((e) => e.remainingCapacity < 0 || e.allocatedHours > e.weeklyCapacity);
  const availableStaff = employees.filter((e) => e.availabilityStatus === 'available' && e.remainingCapacity >= 10);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'WorkWise AI',
      summary: {
        totalEmployees,
        activeProjects: activeProjects.length,
        avgUtilization: `${avgUtilization}%`,
        overallocatedHeadcount: overallocatedStaff.length,
        availableHeadcount: availableStaff.length,
      },
      workforceUtilization: employees.map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        department: e.department,
        capacity: e.weeklyCapacity,
        allocated: e.allocatedHours,
        remaining: e.remainingCapacity,
        utilizationPct: Math.round((e.allocatedHours / e.weeklyCapacity) * 100),
      })),
      projectStaffing: projects.map((p) => ({
        id: p.id,
        name: p.name,
        priority: p.priority,
        teamSizeNeeded: p.teamSize,
        currentAssigned: p.assignedTeamMemberIds.length,
        weeklyEffort: p.weeklyEffortRequired,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workwise-workforce-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar with Export / Print */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Executive Workforce Intelligence Audit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive decision-support audit covering talent utilization, project health, and ethical AI compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Data (JSON)</span>
          </button>
        </div>
      </div>

      {/* Audit Document Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm space-y-8">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-teal-400 uppercase tracking-widest font-semibold">
              WorkWise AI Enterprise Systems
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Quarterly Workforce & Team Optimization Audit
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Audit Timestamp: {new Date().toLocaleDateString()} · Certified Real-Time Application State
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 space-y-0.5">
            <div>Scope: <strong className="text-white">All Divisions</strong></div>
            <div>Scoring Algorithm: <strong className="text-teal-400">Verifiable 50/20/20/10</strong></div>
            <div>Compliance: <strong className="text-emerald-400">ISO-30414 & AI Ethics</strong></div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Total Headcount</span>
            <div className="text-2xl font-bold text-white font-mono">{totalEmployees}</div>
            <span className="text-[10px] text-slate-500 font-mono">Across 8 disciplines</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Average Utilization</span>
            <div className="text-2xl font-bold text-teal-400 font-mono">{avgUtilization}%</div>
            <span className="text-[10px] text-slate-500 font-mono">{totalAllocated}h of {totalCapacity}h committed</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Available For New Work</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{availableStaff.length}</div>
            <span className="text-[10px] text-slate-500 font-mono">&ge;10h free bandwidth</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Burnout Risk Staff</span>
            <div className={`text-2xl font-bold font-mono ${overallocatedStaff.length > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {overallocatedStaff.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Exceeding 100% capacity</span>
          </div>
        </div>

        {/* Section: Project Staffing Completeness */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            1. Project Staffing Completeness & Skill Risk Assessment
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Effort (h/wk)</th>
                  <th className="py-2.5 px-3">Staffing Fill Ratio</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((p) => {
                  const fillRatio = `${p.assignedTeamMemberIds.length} / ${p.teamSize}`;
                  const isFilled = p.assignedTeamMemberIds.length >= p.teamSize;
                  return (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-semibold text-white">{p.name}</td>
                      <td className="py-2.5 px-3 font-mono">{p.priority}</td>
                      <td className="py-2.5 px-3 font-mono">{p.weeklyEffortRequired}h</td>
                      <td className="py-2.5 px-3 font-mono">{fillRatio}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={isFilled ? 'text-teal-400' : 'text-amber-400'}>
                          {isFilled ? 'Target Reached' : 'Open Positions'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Capacity Allocation Roster */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            2. Employee Capacity Audit & Remaining Bandwidth
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Role & Dept</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Allocated</th>
                  <th className="py-2.5 px-3">Remaining</th>
                  <th className="py-2.5 px-3">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {employees.map((emp) => {
                  const util = Math.round((emp.allocatedHours / emp.weeklyCapacity) * 100);
                  const isOver = emp.remainingCapacity < 0;
                  return (
                    <tr key={emp.id}>
                      <td className="py-2.5 px-3 font-semibold text-white">{emp.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{emp.role} ({emp.department})</td>
                      <td className="py-2.5 px-3 font-mono">{emp.weeklyCapacity}h</td>
                      <td className="py-2.5 px-3 font-mono">{emp.allocatedHours}h</td>
                      <td className={`py-2.5 px-3 font-mono font-bold ${isOver ? 'text-rose-400' : 'text-teal-300'}`}>
                        {emp.remainingCapacity}h
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={isOver ? 'text-rose-400 font-bold' : util > 80 ? 'text-amber-400' : 'text-slate-300'}>
                          {util}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 11: Fairness, Ethics & Data Protection Declaration */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-bold text-white text-sm">
              Section 11 Compliance: Fairness, Ethical AI & Data Protection Charter
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-1">
              <strong className="text-white block">1. Non-Discriminatory Scoring:</strong>
              <p className="text-slate-400 text-[11px]">
                WorkWise AI evaluates candidates exclusively on verified skills, audited professional experience, verified schedule availability, and workload balance. Gender, religion, caste, ethnicity, age, disability, or personal attributes are not captured or included in any scoring algorithms.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-white block">2. Managerial Decision Sovereignty:</strong>
              <p className="text-slate-400 text-[11px]">
                The platform is designed strictly as decision support. No automated hiring, termination, promotion, or punitive actions are executed by the software. Resource managers retain full discretion and can override or modify any proposed team compositions.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-white block">3. Anti-Concealment Transparency:</strong>
              <p className="text-slate-400 text-[11px]">
                Missing technical competencies and negative remaining capacities cannot be masked by high general match scores. All warnings are explicitly surfaced on candidate cards.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-white block">4. Data Isolation & Privacy:</strong>
              <p className="text-slate-400 text-[11px]">
                Employee profiles in this demonstration environment are fictional and stored locally. No proprietary talent metrics are sent to unauthorized third-party telemetry services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
