import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Users, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  Info, 
  Search, 
  ShieldCheck,
  Check,
  Plus,
  RefreshCw,
  Award
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { 
  rankCandidates, 
  buildTeamCompositions, 
  evaluateTeamCoverage, 
  DEFAULT_WEIGHTS 
} from '../utils/matchingAlgorithm';
import { CandidateMatchResult, Employee } from '../types';
import { CandidateDetailModal } from './modals/CandidateDetailModal';

export const TeamBuilderView: React.FC = () => {
  const { 
    employees, 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    weights, 
    setWeights, 
    assignTeamToProject,
    setActiveTab,
    notify
  } = useWorkforce();

  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<CandidateMatchResult | null>(null);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Active Project
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // Working team selection (starts with currently assigned or empty)
  const [stagedMemberIds, setStagedMemberIds] = useState<string[]>(() => {
    return currentProject?.assignedTeamMemberIds || [];
  });

  // Keep stagedMemberIds in sync when active project changes
  React.useEffect(() => {
    if (currentProject) {
      setStagedMemberIds(currentProject.assignedTeamMemberIds);
    }
  }, [currentProject?.id]);

  // Evaluate candidate pool rankings
  const rankedCandidates = useMemo(() => {
    if (!currentProject) return [];
    return rankCandidates(employees, currentProject, weights);
  }, [employees, currentProject, weights]);

  // Filter candidates by search
  const filteredCandidates = useMemo(() => {
    if (!candidateSearch.trim()) return rankedCandidates;
    const q = candidateSearch.toLowerCase();
    return rankedCandidates.filter(
      (c) =>
        c.employee.name.toLowerCase().includes(q) ||
        c.employee.role.toLowerCase().includes(q) ||
        c.employee.department.toLowerCase().includes(q) ||
        c.employee.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [rankedCandidates, candidateSearch]);

  // Team Compositions (Primary and Alternatives)
  const compositions = useMemo(() => {
    if (!currentProject) return [];
    return buildTeamCompositions(employees, currentProject, weights);
  }, [employees, currentProject, weights]);

  // Staged team evaluation
  const stagedCandidates = useMemo(() => {
    return rankedCandidates.filter((c) => stagedMemberIds.includes(c.employee.id));
  }, [rankedCandidates, stagedMemberIds]);

  const stagedCoverage = useMemo(() => {
    if (!currentProject) return { coveragePercentage: 0, coveredSkills: [], uncoveredSkills: [], totalAllocatedHours: 0, remainingCapacityTotal: 0, averageExperience: 0, averageMatchScore: 0 };
    return evaluateTeamCoverage(stagedCandidates, currentProject);
  }, [stagedCandidates, currentProject]);

  const toggleSelectMember = (candidateId: string) => {
    if (stagedMemberIds.includes(candidateId)) {
      setStagedMemberIds((prev) => prev.filter((id) => id !== candidateId));
      notify('Member removed from staged team.', 'info');
    } else {
      if (stagedMemberIds.length >= currentProject.teamSize) {
        notify(`Team size limit reached (${currentProject.teamSize} members). Swap or remove an existing member first.`, 'warning');
        return;
      }
      setStagedMemberIds((prev) => [...prev, candidateId]);
      notify('Member added to staged team.', 'success');
    }
  };

  const handleApplyComposition = (compMembers: CandidateMatchResult[]) => {
    const ids = compMembers.map((m) => m.employee.id);
    setStagedMemberIds(ids);
    notify(`Loaded composition (${compMembers.length} members). Click "Commit Team to Project" to save.`, 'info');
  };

  const handleCommitTeam = () => {
    if (!currentProject) return;
    if (stagedMemberIds.length === 0) {
      notify('Please select at least 1 team member before committing.', 'warning');
      return;
    }
    assignTeamToProject(currentProject.id, stagedMemberIds);
  };

  const targetEffortPerMember = currentProject 
    ? Math.max(10, Math.round(currentProject.weeklyEffortRequired / Math.max(1, currentProject.teamSize)))
    : 20;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Project Selector & Quick Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-semibold">
                Target Project:
              </span>
              <select
                value={currentProject?.id}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="bg-slate-800 text-white font-bold text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.priority} · {p.teamSize} Staff needed)
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              {currentProject?.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                showWeightSliders
                  ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>Matching Weights ({weights.skillMatch}/{weights.experienceMatch}/{weights.availability}/{weights.workloadBalance})</span>
            </button>

            {compositions.length > 0 && (
              <button
                onClick={() => handleApplyComposition(compositions[0].members)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Auto-Compose Best Team</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Technical Requirements Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Required Competencies:</span>
            {currentProject?.requiredSkills.map((req) => (
              <span
                key={req.name}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-mono"
              >
                <strong className="text-white">{req.name}</strong>
                <span className="text-teal-400">&ge;Lvl {req.minProficiency}</span>
                {req.importance === 'critical' && <span className="text-amber-400 text-[10px]">*</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
            <span>Team Size: <strong className="text-white">{currentProject?.teamSize}</strong></span>
            <span>·</span>
            <span>Effort: <strong className="text-white">{currentProject?.weeklyEffortRequired}h/wk</strong></span>
            <span>·</span>
            <span>Min Exp: <strong className="text-white">{currentProject?.requiredExperience} yrs</strong></span>
          </div>
        </div>

        {/* Dynamic Weights Adjustment Drawer */}
        {showWeightSliders && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Explainable Algorithm Weight Configuration</span>
              </div>
              <button
                onClick={() => setWeights(DEFAULT_WEIGHTS)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Standard (50/20/20/10)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Skill Match Weight</span>
                  <span className="font-mono text-teal-400">{weights.skillMatch}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={weights.skillMatch}
                  onChange={(e) => setWeights({ ...weights, skillMatch: Number(e.target.value) })}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Experience Weight</span>
                  <span className="font-mono text-cyan-400">{weights.experienceMatch}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.experienceMatch}
                  onChange={(e) => setWeights({ ...weights, experienceMatch: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Availability Weight</span>
                  <span className="font-mono text-emerald-400">{weights.availability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.availability}
                  onChange={(e) => setWeights({ ...weights, availability: Number(e.target.value) })}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Workload Balance Weight</span>
                  <span className="font-mono text-indigo-400">{weights.workloadBalance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={weights.workloadBalance}
                  onChange={(e) => setWeights({ ...weights, workloadBalance: Number(e.target.value) })}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staged Proposed Team Summary Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h3 className="font-bold text-white text-sm">
                Proposed Team Composition ({stagedMemberIds.length} / {currentProject?.teamSize} Selected)
              </h3>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Collectively covers required project skills while enforcing availability and capacity constraints
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono">
              <span className="text-slate-400">Team Coverage: </span>
              <strong className={stagedCoverage.coveragePercentage === 100 ? 'text-teal-400' : 'text-amber-400'}>
                {stagedCoverage.coveragePercentage}%
              </strong>
            </div>

            <button
              onClick={handleCommitTeam}
              disabled={stagedMemberIds.length === 0}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                stagedMemberIds.length > 0
                  ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Commit Team to Project
            </button>
          </div>
        </div>

        {/* Staged Members Cards */}
        {stagedCandidates.length === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-slate-800 text-center space-y-2">
            <p className="text-slate-400 text-xs">
              No team members staged yet. Select candidates from the ranked list below or click "Auto-Compose Best Team".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stagedCandidates.map((cand) => {
              const emp = cand.employee;
              return (
                <div
                  key={emp.id}
                  className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-xs overflow-hidden shrink-0">
                        {emp.avatarUrl ? (
                          <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                          emp.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">{emp.name}</div>
                        <div className="text-[11px] text-slate-400">{emp.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-teal-400">{cand.overallScore} pts</div>
                      <span className="text-[10px] text-slate-500 font-mono">{emp.experience} yrs exp</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Project Contribution:</span>
                      <span className="font-mono text-teal-300 font-medium">~{targetEffortPerMember}h/wk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Remaining Capacity:</span>
                      <span className={`font-mono ${emp.remainingCapacity < targetEffortPerMember ? 'text-amber-400' : 'text-slate-200'}`}>
                        {emp.remainingCapacity}h
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedCandidateForModal(cand)}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Explain Score
                    </button>
                    <button
                      onClick={() => toggleSelectMember(emp.id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Coverage & Gaps Status */}
        {stagedCandidates.length > 0 && (
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Covered Skills:</span>
              {stagedCoverage.coveredSkills.map((sk) => (
                <span key={sk} className="text-teal-400 font-mono flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {sk}
                </span>
              ))}

              {stagedCoverage.uncoveredSkills.length > 0 && (
                <>
                  <span className="text-slate-600">|</span>
                  <span className="text-rose-400 font-medium">Uncovered Gaps:</span>
                  {stagedCoverage.uncoveredSkills.map((gap) => (
                    <span key={gap.name} className="text-rose-400 font-mono flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {gap.name} (&ge;Lvl {gap.minProficiency})
                    </span>
                  ))}
                </>
              )}
            </div>

            {stagedCoverage.uncoveredSkills.length > 0 && (
              <button
                onClick={() => setActiveTab('training')}
                className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Find Training for Missing Skills</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Alternative Team Compositions Panel */}
      {compositions.length > 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Alternative Feasible Team Compositions</h3>
              <p className="text-slate-400 text-xs">
                Compare trade-offs between bandwidth cushion, senior leadership, and skill coverage
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {compositions.length} Options Generated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {compositions.map((comp) => {
              const isCurrentlyStaged = 
                comp.members.length === stagedMemberIds.length &&
                comp.members.every((m) => stagedMemberIds.includes(m.employee.id));

              return (
                <div
                  key={comp.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                    isCurrentlyStaged
                      ? 'bg-teal-950/20 border-teal-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{comp.title}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${comp.coveragePercentage === 100 ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {comp.coveragePercentage}% Coverage
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{comp.description}</p>
                  </div>

                  {/* Members list */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Proposed Roster:
                    </div>
                    <div className="space-y-0.5 text-xs text-slate-300">
                      {comp.members.map((m) => (
                        <div key={m.employee.id} className="flex justify-between items-center text-[11px]">
                          <span>{m.employee.name}</span>
                          <span className="font-mono text-slate-400">{m.employee.remainingCapacity}h free</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tradeoffs */}
                  <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-700/60 pt-2">
                    {comp.tradeoffs.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-teal-400">·</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleApplyComposition(comp.members)}
                    className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isCurrentlyStaged
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isCurrentlyStaged ? 'Currently Active' : 'Load This Alternative'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Candidate Ranking & Explainable Scoring Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Ranked Candidate Evaluation</h3>
            <p className="text-slate-400 text-xs">
              Every score is 100% explainable with transparent factor weighting
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name, skill, or role..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* Candidates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-[11px] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank & Candidate</th>
                <th className="py-3 px-3">Overall Match</th>
                <th className="py-3 px-3">Factor Breakdown</th>
                <th className="py-3 px-3">Relevant Skills</th>
                <th className="py-3 px-3">Capacity & Avail</th>
                <th className="py-3 px-3">Risk & Warnings</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCandidates.map((cand, index) => {
                const emp = cand.employee;
                const isSelected = stagedMemberIds.includes(emp.id);
                const isOverallocated = emp.remainingCapacity < 0;
                const isUnavailable = !cand.isAvailable;

                return (
                  <tr
                    key={emp.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-teal-950/15' : ''
                    }`}
                  >
                    {/* Rank & Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-500 font-bold text-xs w-4">
                          #{index + 1}
                        </span>
                        <div className="w-8 h-8 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-xs overflow-hidden shrink-0">
                          {emp.avatarUrl ? (
                            <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            emp.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{emp.name}</span>
                            {isSelected && (
                              <span className="text-[10px] text-teal-300 font-mono px-1 py-0.2 rounded bg-teal-900/60 border border-teal-800">
                                Selected
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {emp.role} · {emp.experience} yrs
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Overall Match Score */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="text-base font-bold font-mono text-teal-400">
                          {cand.overallScore} <span className="text-[10px] text-slate-500">/100</span>
                        </div>
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              cand.overallScore >= 75
                                ? 'bg-teal-400'
                                : cand.overallScore >= 50
                                ? 'bg-cyan-500'
                                : 'bg-slate-600'
                            }`}
                            style={{ width: `${cand.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Factor Breakdown (Skill / Exp / Avail / Workload) */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-[11px] text-slate-400 space-y-0.5">
                        <div className="flex justify-between w-28">
                          <span>Skill:</span>
                          <span className="text-teal-300">{cand.breakdown.skillScore}</span>
                        </div>
                        <div className="flex justify-between w-28">
                          <span>Exp:</span>
                          <span className="text-cyan-300">{cand.breakdown.experienceScore}</span>
                        </div>
                        <div className="flex justify-between w-28">
                          <span>Avail:</span>
                          <span className={cand.breakdown.availabilityScore === 0 ? 'text-rose-400 font-bold' : 'text-emerald-300'}>
                            {cand.breakdown.availabilityScore}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Relevant Skills */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.matchedSkills.map((sk) => (
                          <span
                            key={sk.name}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              sk.meetsRequirement
                                ? 'bg-teal-950/60 text-teal-300 border border-teal-800/60'
                                : 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                            }`}
                          >
                            {sk.name} (Lvl {sk.candidateProf})
                          </span>
                        ))}
                        {cand.missingSkills.length > 0 && (
                          <span className="text-[10px] text-slate-500 font-mono self-center">
                            +{cand.missingSkills.length} missing
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Capacity & Availability */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              emp.availabilityStatus === 'available'
                                ? 'bg-emerald-400'
                                : emp.availabilityStatus === 'partially-available'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span className="capitalize font-medium text-slate-200">
                            {emp.availabilityStatus.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          Free: <strong className={emp.remainingCapacity < 0 ? 'text-rose-400' : 'text-white'}>
                            {emp.remainingCapacity}h
                          </strong> / {emp.weeklyCapacity}h
                        </div>
                      </div>
                    </td>

                    {/* Warnings & Risk Flags */}
                    <td className="py-3.5 px-3">
                      {cand.warnings.length > 0 ? (
                        <div className="text-[11px] text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[140px]" title={cand.warnings[0]}>
                            {cand.warnings[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-teal-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fully Qualified</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCandidateForModal(cand)}
                          className="px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                          title="View mathematical score breakdown"
                        >
                          Explain
                        </button>

                        <button
                          onClick={() => toggleSelectMember(emp.id)}
                          className={`px-3 py-1 text-[11px] font-semibold rounded transition-colors ${
                            isSelected
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white'
                              : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-sm'
                          }`}
                        >
                          {isSelected ? 'Remove' : 'Select'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Score Detail Modal */}
      {selectedCandidateForModal && currentProject && (
        <CandidateDetailModal
          candidate={selectedCandidateForModal}
          project={currentProject}
          weights={weights}
          onClose={() => setSelectedCandidateForModal(null)}
          onSelect={() => toggleSelectMember(selectedCandidateForModal.employee.id)}
          isSelected={stagedMemberIds.includes(selectedCandidateForModal.employee.id)}
        />
      )}
    </div>
  );
};
