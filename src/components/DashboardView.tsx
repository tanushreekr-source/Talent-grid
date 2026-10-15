import React from 'react';
import { 
  Users, 
  FolderKanban, 
  AlertOctagon, 
  UserCheck, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { evaluateTeamCoverage } from '../utils/matchingAlgorithm';

export const DashboardView: React.FC = () => {
  const { employees, projects, setActiveTab, setActiveProjectId, loadScenario } = useWorkforce();

  // 1. Live calculated metrics
  const totalEmployees = employees.length;
  const activeProjects = projects.filter((p) => p.status === 'Active');
  const planningProjects = projects.filter((p) => p.status === 'Planning');

  const availableEmployees = employees.filter(
    (e) => (e.availabilityStatus === 'available' || e.availabilityStatus === 'partially-available') && e.remainingCapacity >= 10
  );

  const overallocatedEmployees = employees.filter(
    (e) => e.remainingCapacity < 0 || e.allocatedHours > e.weeklyCapacity
  );

  const totalCap = employees.reduce((sum, e) => sum + e.weeklyCapacity, 0);
  const totalAlloc = employees.reduce((sum, e) => sum + e.allocatedHours, 0);
  const avgUtilization = totalCap > 0 ? Math.round((totalAlloc / totalCap) * 100) : 0;

  // Unfilled project requirements & coverage
  let totalReqSkills = 0;
  let coveredReqSkills = 0;
  let unfilledRolesCount = 0;

  projects.forEach((proj) => {
    unfilledRolesCount += Math.max(0, proj.teamSize - proj.assignedTeamMemberIds.length);
    const assignedMembers = employees.filter((e) => proj.assignedTeamMemberIds.includes(e.id));
    
    proj.requiredSkills.forEach((req) => {
      totalReqSkills++;
      const isCovered = assignedMembers.some((m) =>
        m.skills.some((s) => s.name.toLowerCase() === req.name.toLowerCase() && s.proficiency >= req.minProficiency)
      );
      if (isCovered) coveredReqSkills++;
    });
  });

  const projectSkillCoveragePct = totalReqSkills > 0 ? Math.round((coveredReqSkills / totalReqSkills) * 100) : 100;

  // Department distribution
  const deptMap: Record<string, number> = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptEntries = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  // Utilization Tiers
  const utilizationTiers = {
    overallocated: employees.filter((e) => (e.allocatedHours / e.weeklyCapacity) > 1.0).length,
    high: employees.filter((e) => {
      const u = e.allocatedHours / e.weeklyCapacity;
      return u >= 0.8 && u <= 1.0;
    }).length,
    balanced: employees.filter((e) => {
      const u = e.allocatedHours / e.weeklyCapacity;
      return u >= 0.5 && u < 0.8;
    }).length,
    underutilized: employees.filter((e) => (e.allocatedHours / e.weeklyCapacity) < 0.5).length,
  };

  // In-Demand Skills vs Available Staff
  const topDemandSkills = ['Python', 'React', 'SQL', 'Testing', 'Kubernetes', 'PostgreSQL'];
  const skillDistribution = topDemandSkills.map((skill) => {
    const qualifiedCount = employees.filter((e) =>
      e.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase() && s.proficiency >= 3)
    ).length;
    return { skill, qualifiedCount };
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Five Core Questions Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-400 font-mono">
                Workforce Decision Engine
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">
              5 Critical Workforce Questions Answered in Real Time
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveProjectId('PRJ-101');
              setActiveTab('team-builder');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors w-fit"
          >
            <span>Launch Team Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 text-xs">
          <div 
            onClick={() => { setActiveTab('team-builder'); }}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] text-teal-400 font-mono font-semibold">Q1. Best Candidates?</span>
            <p className="text-slate-200 font-medium">Explainable 50/20/20/10 multi-criteria matching</p>
          </div>

          <div 
            onClick={() => { setActiveTab('workload-planner'); }}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] text-teal-400 font-mono font-semibold">Q2. Actually Available?</span>
            <p className="text-slate-200 font-medium">{availableEmployees.length} staff ready with &ge;10h free capacity</p>
          </div>

          <div 
            onClick={() => { setActiveTab('workload-planner'); }}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] text-teal-400 font-mono font-semibold">Q3. Team Balanced?</span>
            <p className="text-slate-200 font-medium">{overallocatedEmployees.length > 0 ? `${overallocatedEmployees.length} overallocated` : 'All within capacity limits'}</p>
          </div>

          <div 
            onClick={() => { setActiveTab('skills-intelligence'); }}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] text-teal-400 font-mono font-semibold">Q4. Skills Missing?</span>
            <p className="text-slate-200 font-medium">Rust & Telemetry identified; courses mapped</p>
          </div>

          <div 
            onClick={() => { setActiveTab('team-builder'); }}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] text-teal-400 font-mono font-semibold">Q5. Best Alternative?</span>
            <p className="text-slate-200 font-medium">Auto-computes 3 feasible fallback teams</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Employees */}
        <div 
          onClick={() => setActiveTab('employees')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Total Staff</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{totalEmployees}</div>
          <div className="text-[10px] text-slate-500 font-mono">All verified profiles</div>
        </div>

        {/* Active Projects */}
        <div 
          onClick={() => setActiveTab('projects')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{activeProjects.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">+{planningProjects.length} in planning</div>
        </div>

        {/* Available for Work */}
        <div 
          onClick={() => setActiveTab('employees')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Available</span>
            <UserCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-400 tracking-tight">{availableEmployees.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">&ge;10h free capacity</div>
        </div>

        {/* Above Capacity Limit */}
        <div 
          onClick={() => setActiveTab('workload-planner')}
          className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-colors space-y-1 ${
            overallocatedEmployees.length > 0 
              ? 'border-rose-500/50 bg-rose-950/10 hover:border-rose-500' 
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Over Capacity</span>
            <AlertOctagon className={`w-4 h-4 ${overallocatedEmployees.length > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold tracking-tight ${overallocatedEmployees.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {overallocatedEmployees.length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {overallocatedEmployees.length > 0 ? 'Requires rebalance' : 'Optimal'}
          </div>
        </div>

        {/* Average Utilization */}
        <div 
          onClick={() => setActiveTab('workload-planner')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Avg Utilization</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{avgUtilization}%</div>
          <div className="text-[10px] text-slate-500 font-mono">Target: 70-85%</div>
        </div>

        {/* Project Skill Coverage */}
        <div 
          onClick={() => setActiveTab('skills-intelligence')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Skill Coverage</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{projectSkillCoveragePct}%</div>
          <div className="text-[10px] text-slate-500 font-mono">{coveredReqSkills}/{totalReqSkills} skills met</div>
        </div>

        {/* Unfilled Requirements */}
        <div 
          onClick={() => setActiveTab('projects')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-colors space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Unfilled Roles</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{unfilledRolesCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Open project slots</div>
        </div>
      </div>

      {/* Main Grid: Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-Wise Workforce Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Department-Wise Workforce</h3>
              <p className="text-slate-400 text-xs">Headcount distribution across disciplines</p>
            </div>
            <button
              onClick={() => setActiveTab('employees')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {deptEntries.map(([dept, count]) => {
              const pct = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{dept}</span>
                    <span className="text-slate-400 font-mono">
                      {count} {count === 1 ? 'member' : 'members'} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Utilization Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Employee Utilization Health</h3>
              <p className="text-slate-400 text-xs">Workload distribution & burnout protection</p>
            </div>
            <button
              onClick={() => setActiveTab('workload-planner')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>Workload Planner</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div 
              onClick={() => setActiveTab('workload-planner')}
              className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/20 cursor-pointer hover:bg-rose-950/30 transition-colors"
            >
              <div className="text-[11px] text-rose-300 font-medium">Overallocated (&gt;100%)</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{utilizationTiers.overallocated}</div>
              <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">Burnout risk: Immediate action</div>
            </div>

            <div 
              onClick={() => setActiveTab('workload-planner')}
              className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 cursor-pointer hover:bg-amber-950/30 transition-colors"
            >
              <div className="text-[11px] text-amber-300 font-medium">High Load (80% - 100%)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{utilizationTiers.high}</div>
              <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">Near max capacity</div>
            </div>

            <div 
              onClick={() => setActiveTab('workload-planner')}
              className="p-3 rounded-lg border border-teal-500/30 bg-teal-950/20 cursor-pointer hover:bg-teal-950/30 transition-colors"
            >
              <div className="text-[11px] text-teal-300 font-medium">Balanced (50% - 79%)</div>
              <div className="text-2xl font-bold text-teal-400 mt-1">{utilizationTiers.balanced}</div>
              <div className="text-[10px] text-teal-400/80 font-mono mt-0.5">Sustainable productivity</div>
            </div>

            <div 
              onClick={() => setActiveTab('workload-planner')}
              className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 cursor-pointer hover:bg-cyan-950/30 transition-colors"
            >
              <div className="text-[11px] text-cyan-300 font-medium">Underutilized (&lt;50%)</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{utilizationTiers.underutilized}</div>
              <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">Available for reassignment</div>
            </div>
          </div>

          {/* Quick Rebalance Alert Banner */}
          {overallocatedEmployees.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>{overallocatedEmployees[0]?.name}</strong> is at 115% load. Rebalance proposed.
                </span>
              </div>
              <button
                onClick={() => loadScenario('C')}
                className="px-2.5 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold rounded text-[11px] transition-colors"
              >
                Review Rebalance
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Staffing Status & In-Demand Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Staffing Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Active & Planning Projects</h3>
              <p className="text-slate-400 text-xs">Staffing completeness and weekly hours requirement</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>All Projects</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => {
              const assignedCount = proj.assignedTeamMemberIds.length;
              const isStaffed = assignedCount >= proj.teamSize;
              const isPartiallyStaffed = assignedCount > 0 && assignedCount < proj.teamSize;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    setActiveTab('team-builder');
                  }}
                  className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{proj.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({proj.priority})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span>{proj.weeklyEffortRequired}h/wk</span>
                      <span className="mx-1.5">·</span>
                      <span>Target team: {proj.teamSize}</span>
                      <span className="mx-1.5">·</span>
                      <span>{proj.durationWeeks} weeks</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-medium text-slate-200">
                      {assignedCount} / {proj.teamSize} staffed
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        isStaffed
                          ? 'text-teal-400'
                          : isPartiallyStaffed
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isStaffed ? 'Fully Staffed' : isPartiallyStaffed ? 'Partially Staffed' : 'Unstaffed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Distribution: High Demand Skills vs Pool */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Critical Skills Bench Depth</h3>
              <p className="text-slate-400 text-xs">Number of employees with verified proficiency &ge; 3</p>
            </div>
            <button
              onClick={() => setActiveTab('skills-intelligence')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>Skills Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {skillDistribution.map(({ skill, qualifiedCount }) => {
              const maxScale = Math.max(8, totalEmployees / 2);
              const barWidth = Math.min(100, Math.round((qualifiedCount / maxScale) * 100));

              return (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{skill}</span>
                    <span className="text-slate-400 font-mono">
                      {qualifiedCount} qualified ({Math.round((qualifiedCount / totalEmployees) * 100)}% of staff)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        qualifiedCount <= 2 ? 'bg-amber-400' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Rare skill alert */}
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300 mt-2">
              <span className="text-[11px] text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Zero employees have verified "Rust" (Required by PRJ-102)</span>
              </span>
              <button
                onClick={() => setActiveTab('training')}
                className="text-[11px] text-teal-400 hover:underline font-medium"
              >
                Upskill in Academy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
