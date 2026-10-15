import React from 'react';
import { 
  CandidateMatchResult, 
  Project, 
  AlgorithmWeights 
} from '../../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  Activity, 
  Sparkles,
  Info
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: CandidateMatchResult;
  project: Project;
  weights: AlgorithmWeights;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  project,
  weights,
  onClose,
  onSelect,
  isSelected,
}) => {
  const { employee, overallScore, breakdown, matchedSkills, missingSkills, underdevelopedSkills, reasons, warnings, isAvailable } = candidate;

  const targetEffortPerMember = Math.max(10, Math.round(project.weeklyEffortRequired / Math.max(1, project.teamSize)));
  const utilization = Math.round((employee.allocatedHours / employee.weeklyCapacity) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col text-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg overflow-hidden">
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt={employee.name} className="w-full h-full object-cover" />
              ) : (
                employee.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{employee.name}</h3>
                <span className="text-xs font-mono text-slate-400">({employee.id})</span>
              </div>
              <p className="text-xs text-slate-400">{employee.role} · {employee.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Match Score</div>
              <div className="text-2xl font-bold font-mono text-teal-400">{overallScore}/100</div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Transparent Score Breakdown Formula */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Explainable Match Scoring Breakdown</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Weighted Linear Normalization</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {/* Skill Match */}
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-medium">Skill Match ({weights.skillMatch}%)</div>
                <div className="text-lg font-bold font-mono text-teal-300 mt-0.5">{breakdown.skillScore}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  +{(breakdown.skillScore * weights.skillMatch / 100).toFixed(1)} pts
                </div>
              </div>

              {/* Experience Match */}
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-medium">Experience ({weights.experienceMatch}%)</div>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">{breakdown.experienceScore}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  +{(breakdown.experienceScore * weights.experienceMatch / 100).toFixed(1)} pts
                </div>
              </div>

              {/* Availability Match */}
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-medium">Availability ({weights.availability}%)</div>
                <div className={`text-lg font-bold font-mono mt-0.5 ${breakdown.availabilityScore === 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
                  {breakdown.availabilityScore}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  +{(breakdown.availabilityScore * weights.availability / 100).toFixed(1)} pts
                </div>
              </div>

              {/* Workload Balance */}
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-medium">Workload ({weights.workloadBalance}%)</div>
                <div className="text-lg font-bold font-mono text-indigo-300 mt-0.5">{breakdown.workloadScore}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  +{(breakdown.workloadScore * weights.workloadBalance / 100).toFixed(1)} pts
                </div>
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded border border-slate-800">
              = ({breakdown.skillScore} × {weights.skillMatch}%) + ({breakdown.experienceScore} × {weights.experienceMatch}%) + ({breakdown.availabilityScore} × {weights.availability}%) + ({breakdown.workloadScore} × {weights.workloadBalance}%) = <strong className="text-teal-300">{overallScore}/100</strong>
            </div>
          </div>

          {/* Current Capacity & Availability Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Capacity & Allocation Math</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Weekly Total Capacity:</span>
                  <span className="font-mono">{employee.weeklyCapacity}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Currently Allocated:</span>
                  <span className="font-mono">{employee.allocatedHours}h ({utilization}%)</span>
                </div>
                <div className="flex justify-between border-t border-slate-700/60 pt-1">
                  <span className="text-slate-400">Remaining Capacity:</span>
                  <span className={`font-mono font-bold ${employee.remainingCapacity < 0 ? 'text-rose-400' : 'text-teal-300'}`}>
                    {employee.remainingCapacity}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Required by this Project:</span>
                  <span className="font-mono">{targetEffortPerMember}h/wk</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Availability Status</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-medium capitalize text-white">
                    {employee.availabilityStatus.replace('-', ' ')}
                  </span>
                </div>
                {employee.leaveStartDate && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                    On Leave from {employee.leaveStartDate} to {employee.leaveEndDate || 'N/A'}.
                  </div>
                )}
                <p className="text-[11px] text-slate-400 leading-snug">
                  {isAvailable 
                    ? 'Candidate has sufficient unallocated hours for project sprint.' 
                    : 'Candidate cannot be scheduled without creating an overallocation or scheduling conflict.'}
                </p>
              </div>
            </div>
          </div>

          {/* Required Skills Analysis */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white">Required Project Skills Assessment</h4>
            <div className="space-y-2 text-xs">
              {project.requiredSkills.map((req) => {
                const matched = matchedSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
                const isUnderdeveloped = underdevelopedSkills.some((s) => s.name.toLowerCase() === req.name.toLowerCase());
                const isMissing = missingSkills.some((s) => s.name.toLowerCase() === req.name.toLowerCase());

                return (
                  <div
                    key={req.name}
                    className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span>{req.name}</span>
                        {req.importance === 'critical' && (
                          <span className="text-[10px] text-amber-400 font-mono">Critical</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Required: Level {req.minProficiency} / 5
                      </div>
                    </div>

                    <div className="text-right">
                      {isMissing ? (
                        <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Missing (Lvl 0)
                        </span>
                      ) : isUnderdeveloped ? (
                        <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Underdeveloped (Lvl {matched?.candidateProf})
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-teal-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Exceeds/Meets (Lvl {matched?.candidateProf})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reasons & Explicit Warnings */}
          <div className="space-y-3">
            {reasons.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Recommendation Factors:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {warnings.length > 0 && (
              <div className="space-y-1.5 p-3 rounded-lg bg-rose-950/20 border border-rose-500/30">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Explicit Risk & Constraint Flags:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-rose-300/90">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {employee.currentProjectAssignments.length} active project assignment(s)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onSelect();
                onClose();
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
                isSelected
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-teal-400 hover:bg-teal-300 text-slate-950'
              }`}
            >
              {isSelected ? 'Remove from Proposed Team' : 'Select for Proposed Team'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
