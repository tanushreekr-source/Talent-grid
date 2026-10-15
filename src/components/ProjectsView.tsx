import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Users, 
  Clock, 
  Calendar, 
  Sparkles, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Target
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { Project, ProjectStatus, Priority } from '../types';

interface ProjectsViewProps {
  onOpenAddModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenAddModal }) => {
  const { projects, employees, setActiveProjectId, setActiveTab, deleteProject } = useWorkforce();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setFilterStatus('Active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'Active'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('Planning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'Planning'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Planning
          </button>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const assignedMembers = employees.filter((e) => project.assignedTeamMemberIds.includes(e.id));
          const isFullyStaffed = assignedMembers.length >= project.teamSize;
          const openSlots = Math.max(0, project.teamSize - assignedMembers.length);

          // Calculate collective skill coverage
          let coveredCount = 0;
          project.requiredSkills.forEach((req) => {
            const isMet = assignedMembers.some((m) =>
              m.skills.some((s) => s.name.toLowerCase() === req.name.toLowerCase() && s.proficiency >= req.minProficiency)
            );
            if (isMet) coveredCount++;
          });
          const coveragePct = project.requiredSkills.length > 0 
            ? Math.round((coveredCount / project.requiredSkills.length) * 100) 
            : 100;

          return (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{project.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">({project.id})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                      project.priority === 'Critical'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                        : project.priority === 'High'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                        : 'bg-teal-950/60 text-teal-300 border border-teal-800'
                    }`}
                  >
                    {project.priority}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Weekly Effort</span>
                    <strong className="text-slate-200">{project.weeklyEffortRequired}h / wk</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Staffing</span>
                    <strong className={isFullyStaffed ? 'text-teal-400' : 'text-amber-400'}>
                      {assignedMembers.length} / {project.teamSize}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Skill Coverage</span>
                    <strong className={coveragePct === 100 ? 'text-teal-400' : 'text-amber-400'}>
                      {coveragePct}%
                    </strong>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                    Required Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills.map((req) => (
                      <span
                        key={req.name}
                        className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono"
                      >
                        {req.name} <strong className="text-teal-400">&ge;L{req.minProficiency}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Members */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                    Assigned Team:
                  </div>
                  {assignedMembers.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No team members assigned yet.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedMembers.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-950/40 border border-teal-800 text-teal-300 text-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          {m.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setConfirmDeleteId(project.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActiveProjectId(project.id);
                    setActiveTab('team-builder');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build / Optimize Team</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 text-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">Delete Project</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this project? Assigned team members will have their hours returned to their remaining capacity.
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
                  deleteProject(confirmDeleteId);
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
    </div>
  );
};
