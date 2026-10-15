import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Clock, 
  GraduationCap, 
  FolderKanban, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { Employee, Department, AvailabilityStatus } from '../types';

interface EmployeesViewProps {
  onOpenAddModal: () => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({ onOpenAddModal }) => {
  const { employees, deleteEmployee, toggleEmployeeAvailability } = useWorkforce();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Departments list for filter
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department)));
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.skills.some((s) => s.name.toLowerCase().includes(q));

      const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || emp.availabilityStatus === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search talent by name, role, skill (e.g. Python, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-400"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Availability Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-400"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="partially-available">Partially Available</option>
            <option value="on-leave">On Leave</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Employees Directory Grid/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const utilPct = Math.round((emp.allocatedHours / emp.weeklyCapacity) * 100);
          const isOverallocated = emp.remainingCapacity < 0;

          return (
            <div
              key={emp.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-colors"
            >
              {/* Header: Avatar, Name, Role, Availability Toggle */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-sm overflow-hidden shrink-0">
                      {emp.avatarUrl ? (
                        <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        emp.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{emp.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({emp.id})</span>
                      </div>
                      <p className="text-xs text-slate-400">{emp.role}</p>
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <select
                    value={emp.availabilityStatus}
                    onChange={(e) => toggleEmployeeAvailability(emp.id, e.target.value as AvailabilityStatus)}
                    className={`text-[10px] font-mono px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                      emp.availabilityStatus === 'available'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                        : emp.availabilityStatus === 'partially-available'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                        : 'bg-rose-950/40 text-rose-300 border-rose-800'
                    }`}
                  >
                    <option value="available">Available</option>
                    <option value="partially-available">Partially Available</option>
                    <option value="on-leave">On Leave</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Metadata row */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{emp.department}</span>
                  <span>·</span>
                  <span>{emp.experience} yrs exp</span>
                </div>

                {/* Capacity & Allocation Math Card */}
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Weekly Capacity:</span>
                    <span className="font-mono text-slate-200">{emp.weeklyCapacity}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Allocated:</span>
                    <span className="font-mono text-slate-200">{emp.allocatedHours}h ({utilPct}%)</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-700/40 pt-1">
                    <span className="text-slate-400">Remaining Capacity:</span>
                    <span className={`font-mono font-bold ${isOverallocated ? 'text-rose-400' : 'text-teal-300'}`}>
                      {emp.remainingCapacity}h
                    </span>
                  </div>

                  {/* Utilization Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        isOverallocated
                          ? 'bg-rose-500'
                          : utilPct > 80
                          ? 'bg-amber-400'
                          : 'bg-teal-400'
                      }`}
                      style={{ width: `${Math.min(100, utilPct)}%` }}
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                    Proficiencies (1-5):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {emp.skills.map((s) => (
                      <span
                        key={s.name}
                        className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono"
                      >
                        {s.name} <strong className="text-teal-400">L{s.proficiency}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Leave dates if applicable */}
                {emp.leaveStartDate && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/20 border border-amber-800/40 p-2 rounded flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Leave: {emp.leaveStartDate} to {emp.leaveEndDate}</span>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedEmployee(emp)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Profile</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmDeleteId(emp.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete employee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 text-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">Delete Employee Record</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this employee? This will unassign them from any active projects and recalculate project staffing immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteEmployee(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-500 hover:bg-rose-400 text-slate-950"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Employee Profile Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 text-slate-200 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-lg overflow-hidden">
                  {selectedEmployee.avatarUrl ? (
                    <img src={selectedEmployee.avatarUrl} alt={selectedEmployee.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedEmployee.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedEmployee.name}</h3>
                  <p className="text-xs text-slate-400">{selectedEmployee.role} · {selectedEmployee.department}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedEmployee.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Assignments */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-teal-400" />
                Active Project Commitments
              </h4>
              {selectedEmployee.currentProjectAssignments.length === 0 ? (
                <p className="text-slate-500 italic">No active projects assigned.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedEmployee.currentProjectAssignments.map((a) => (
                    <div
                      key={a.projectId}
                      className="p-2.5 rounded bg-slate-800 border border-slate-700 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium text-white">{a.projectName}</div>
                        <div className="text-[11px] text-slate-400">{a.role}</div>
                      </div>
                      <span className="font-mono text-teal-300 font-bold">{a.hoursPerWeek}h / week</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed & Recommended Training */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                <span className="font-semibold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Completed Training
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedEmployee.completedTraining.map((t) => (
                    <li key={t}>· {t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                <span className="font-semibold text-white flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  Recommended Upskilling
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedEmployee.recommendedTraining.map((t) => (
                    <li key={t} className="text-cyan-300">· {t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
