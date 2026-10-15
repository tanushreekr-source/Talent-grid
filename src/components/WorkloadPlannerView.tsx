import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeftRight, 
  Users, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { generateWorkloadRebalanceProposals } from '../utils/matchingAlgorithm';
import { RebalanceProposal, Employee } from '../types';

export const WorkloadPlannerView: React.FC = () => {
  const { employees, projects, applyRebalanceProposal, toggleEmployeeAvailability } = useWorkforce();
  const [filterTier, setFilterTier] = useState<'all' | 'overallocated' | 'high' | 'balanced' | 'underutilized'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<RebalanceProposal | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Compute live proposals
  const proposals = useMemo(() => {
    return generateWorkloadRebalanceProposals(employees, projects);
  }, [employees, projects]);

  // Employee utilization categorization
  const enrichedEmployees = useMemo(() => {
    return employees.map((emp) => {
      const utilPct = emp.weeklyCapacity > 0 ? Math.round((emp.allocatedHours / emp.weeklyCapacity) * 100) : 0;
      let statusTier: 'overallocated' | 'high' | 'balanced' | 'underutilized' = 'balanced';
      if (utilPct > 100 || emp.remainingCapacity < 0) statusTier = 'overallocated';
      else if (utilPct >= 80) statusTier = 'high';
      else if (utilPct >= 50) statusTier = 'balanced';
      else statusTier = 'underutilized';

      return {
        ...emp,
        utilPct,
        statusTier,
      };
    });
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return enrichedEmployees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = filterTier === 'all' || emp.statusTier === filterTier;
      return matchesSearch && matchesTier;
    });
  }, [enrichedEmployees, searchQuery, filterTier]);

  const overallocatedCount = enrichedEmployees.filter((e) => e.statusTier === 'overallocated').length;
  const highLoadCount = enrichedEmployees.filter((e) => e.statusTier === 'high').length;
  const underutilizedCount = enrichedEmployees.filter((e) => e.statusTier === 'underutilized').length;

  const handleOpenRebalanceConfirm = (prop: RebalanceProposal) => {
    setSelectedProposal(prop);
    setShowConfirmModal(true);
  };

  const handleExecuteRebalance = () => {
    if (selectedProposal) {
      applyRebalanceProposal(selectedProposal);
      setShowConfirmModal(false);
      setSelectedProposal(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Automated Rebalance Proposal Alert */}
      {proposals.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                <AlertOctagon className="w-4 h-4" />
                <span>Workforce Imbalance Detected ({overallocatedCount} Overallocated Staff)</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
                WorkWise AI identified that active sprint workloads can be safely shifted to qualified peers with spare capacity without degrading delivery timeline.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenRebalanceConfirm(proposals[0])}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 transition-colors shadow-sm"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Review Smart Rebalance Proposal</span>
              </button>
            </div>
          </div>

          {/* Quick proposal preview */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="text-slate-300">
              Shift <strong className="text-rose-400">{proposals[0].hours}h/wk</strong> on <strong>{proposals[0].projectName}</strong> from <strong>{proposals[0].fromEmployeeId}</strong> ({proposals[0].fromEmployeeBeforeUtilization}% &rarr; {proposals[0].fromEmployeeAfterUtilization}%) to <strong>{proposals[0].toEmployeeId}</strong> ({proposals[0].toEmployeeBeforeUtilization}% &rarr; {proposals[0].toEmployeeAfterUtilization}%)
            </div>
            <span className="text-[10px] text-teal-400">Zero skills compromised</span>
          </div>
        </div>
      )}

      {/* Utilization Tier Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterTier(filterTier === 'overallocated' ? 'all' : 'overallocated')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            filterTier === 'overallocated'
              ? 'bg-rose-950/30 border-rose-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-rose-300">Overallocated (&gt;100%)</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{overallocatedCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">High burnout probability</div>
        </button>

        <button
          onClick={() => setFilterTier(filterTier === 'high' ? 'all' : 'high')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            filterTier === 'high'
              ? 'bg-amber-950/30 border-amber-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-300">High Load (80% - 100%)</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{highLoadCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Near ceiling</div>
        </button>

        <button
          onClick={() => setFilterTier(filterTier === 'balanced' ? 'all' : 'balanced')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            filterTier === 'balanced'
              ? 'bg-teal-950/30 border-teal-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-teal-300">Balanced (50% - 79%)</div>
          <div className="text-2xl font-bold font-mono text-teal-400 mt-1">
            {enrichedEmployees.filter((e) => e.statusTier === 'balanced').length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Sustainable pace</div>
        </button>

        <button
          onClick={() => setFilterTier(filterTier === 'underutilized' ? 'all' : 'underutilized')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            filterTier === 'underutilized'
              ? 'bg-cyan-950/30 border-cyan-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-cyan-300">Underutilized (&lt;50%)</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{underutilizedCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Spare capacity ready</div>
        </button>
      </div>

      {/* Capacity & Allocation Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Staff Capacity & Utilization Monitor</h3>
            <p className="text-slate-400 text-xs">
              remaining capacity = weekly capacity − currently allocated hours
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by name, department, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>
            {filterTier !== 'all' && (
              <button
                onClick={() => setFilterTier('all')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-[11px] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Weekly Capacity</th>
                <th className="py-3 px-3">Allocated Hours</th>
                <th className="py-3 px-3">Remaining Capacity</th>
                <th className="py-3 px-3">Utilization %</th>
                <th className="py-3 px-3">Assigned Projects</th>
                <th className="py-3 px-4 text-right">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEmployees.map((emp) => {
                const isOver = emp.statusTier === 'overallocated';
                const isHigh = emp.statusTier === 'high';
                const isUnder = emp.statusTier === 'underutilized';

                return (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-xs overflow-hidden shrink-0">
                          {emp.avatarUrl ? (
                            <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            emp.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.role} · {emp.department}</div>
                        </div>
                      </div>
                    </td>

                    {/* Weekly Capacity */}
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {emp.weeklyCapacity}h / week
                    </td>

                    {/* Allocated Hours */}
                    <td className="py-3.5 px-3 font-mono font-medium">
                      <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {emp.allocatedHours}h
                      </span>
                    </td>

                    {/* Remaining Capacity */}
                    <td className="py-3.5 px-3 font-mono font-bold">
                      <span className={isOver ? 'text-rose-400' : isUnder ? 'text-cyan-300' : 'text-teal-300'}>
                        {emp.remainingCapacity}h
                      </span>
                    </td>

                    {/* Utilization Bar */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {emp.utilPct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isOver
                                ? 'bg-rose-500'
                                : isHigh
                                ? 'bg-amber-400'
                                : isUnder
                                ? 'bg-cyan-400'
                                : 'bg-teal-400'
                            }`}
                            style={{ width: `${Math.min(100, emp.utilPct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Assigned Projects */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.currentProjectAssignments.length === 0 ? (
                          <span className="text-slate-500 text-[11px] italic">No active project</span>
                        ) : (
                          emp.currentProjectAssignments.map((a) => (
                            <span
                              key={a.projectId}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                            >
                              {a.projectName} ({a.hoursPerWeek}h)
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Workload Status */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                          isOver
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                            : isHigh
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                            : isUnder
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                            : 'bg-teal-950/60 text-teal-300 border border-teal-800'
                        }`}
                      >
                        {isOver ? 'Overallocated' : isHigh ? 'Near Limit' : isUnder ? 'Underutilized' : 'Balanced'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Smart Rebalance with Before & After Comparison */}
      {showConfirmModal && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-rose-400">
                <ArrowLeftRight className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Manager Rebalance Authorization</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedProposal.rationale}
            </p>

            {/* Before and After Side-by-Side Comparison */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Workload Impact Assessment (Before &rarr; After)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Source Overallocated Employee */}
                <div className="p-3 rounded-lg bg-slate-900 border border-rose-500/30 space-y-2">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>From: {selectedProposal.fromEmployeeId}</span>
                    <span className="text-rose-400 text-[11px] font-mono">Relieved</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Before Utilization:</span>
                      <span className="text-rose-400 font-bold">{selectedProposal.fromEmployeeBeforeUtilization}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shifted Hours:</span>
                      <span className="text-white">-{selectedProposal.hours}h / week</span>
                    </div>
                    <div className="flex justify-between text-teal-300 border-t border-slate-800 pt-1 font-bold">
                      <span>Normalized Utilization:</span>
                      <span>{selectedProposal.fromEmployeeAfterUtilization}%</span>
                    </div>
                  </div>
                </div>

                {/* Target Underutilized Peer */}
                <div className="p-3 rounded-lg bg-slate-900 border border-teal-500/30 space-y-2">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>To: {selectedProposal.toEmployeeId}</span>
                    <span className="text-teal-400 text-[11px] font-mono">Reassigned</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Before Utilization:</span>
                      <span className="text-cyan-300 font-bold">{selectedProposal.toEmployeeBeforeUtilization}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Assigned Hours:</span>
                      <span className="text-white">+{selectedProposal.hours}h / week</span>
                    </div>
                    <div className="flex justify-between text-teal-300 border-t border-slate-800 pt-1 font-bold">
                      <span>Optimal Utilization:</span>
                      <span>{selectedProposal.toEmployeeAfterUtilization}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Preserved */}
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Verified technical skill match: {selectedProposal.skillsMatched.join(', ')}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Action will update live sprint assignments & remaining capacity immediately.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteRebalance}
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-rose-500 hover:bg-rose-400 text-slate-950 transition-colors shadow-sm"
                >
                  Authorize & Apply Rebalance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
