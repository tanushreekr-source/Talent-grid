import React, { useState } from 'react';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';
import { useWorkforce } from '../../context/WorkforceContext';
import { Department, Priority, RequiredSkill } from '../../types';
import { ALL_SKILLS_CATALOG } from '../../data/seedData';

interface AddProjectModalProps {
  onClose: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose }) => {
  const { addProject } = useWorkforce();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('Full-Stack Development');
  const [priority, setPriority] = useState<Priority>('High');
  const [durationWeeks, setDurationWeeks] = useState<number>(12);
  const [weeklyEffortRequired, setWeeklyEffortRequired] = useState<number>(60);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [requiredExperience, setRequiredExperience] = useState<number>(4);

  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([
    { name: 'React', minProficiency: 3, importance: 'critical' },
    { name: 'Python', minProficiency: 3, importance: 'critical' },
  ]);

  const [newSkillName, setNewSkillName] = useState(ALL_SKILLS_CATALOG[2] || 'SQL');
  const [newSkillProf, setNewSkillProf] = useState(3);
  const [newSkillImportance, setNewSkillImportance] = useState<'critical' | 'desirable'>('critical');

  const handleAddSkill = () => {
    if (!requiredSkills.some((s) => s.name.toLowerCase() === newSkillName.toLowerCase())) {
      setRequiredSkills([
        ...requiredSkills,
        { name: newSkillName, minProficiency: newSkillProf, importance: newSkillImportance },
      ]);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s.name !== skillName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      description: description.trim() || 'Enterprise software delivery initiative.',
      department,
      priority,
      status: 'Planning',
      durationWeeks: Number(durationWeeks) || 12,
      weeklyEffortRequired: Number(weeklyEffortRequired) || 60,
      teamSize: Number(teamSize) || 3,
      requiredExperience: Number(requiredExperience) || 3,
      requiredSkills,
      assignedTeamMemberIds: [],
      deadline: '2027-02-28',
      budget: '$200,000',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col text-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400">
            <FolderPlus className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Create New Project Specification</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Analytics Gateway"
              className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project objectives, architecture requirements, and milestone commitments..."
              className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              >
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Full-Stack Development">Full-Stack Development</option>
                <option value="Data Analytics & AI">Data Analytics & AI</option>
                <option value="QA & Test Engineering">QA & Test Engineering</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Project Management">Project Management</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Delivery Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Team Size</label>
              <input
                type="number"
                min="1"
                max="10"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Weekly Effort (h)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={weeklyEffortRequired}
                onChange={(e) => setWeeklyEffortRequired(Number(e.target.value))}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Duration (Wks)</label>
              <input
                type="number"
                min="1"
                max="52"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Min Exp (Yrs)</label>
              <input
                type="number"
                min="0"
                max="15"
                value={requiredExperience}
                onChange={(e) => setRequiredExperience(Number(e.target.value))}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Required Skills Configurator */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <label className="text-slate-300 font-semibold block">Required Competencies & Minimum Proficiency</label>
            <div className="flex items-center gap-2">
              <select
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 bg-slate-800 text-white rounded-lg p-2 border border-slate-700 text-xs focus:outline-none focus:border-teal-400"
              >
                {ALL_SKILLS_CATALOG.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(Number(e.target.value))}
                className="w-24 bg-slate-800 text-white rounded-lg p-2 border border-slate-700 text-xs focus:outline-none focus:border-teal-400"
              >
                <option value={1}>&ge; Lvl 1</option>
                <option value={2}>&ge; Lvl 2</option>
                <option value={3}>&ge; Lvl 3</option>
                <option value={4}>&ge; Lvl 4</option>
                <option value={5}>&ge; Lvl 5</option>
              </select>

              <select
                value={newSkillImportance}
                onChange={(e) => setNewSkillImportance(e.target.value as 'critical' | 'desirable')}
                className="w-24 bg-slate-800 text-white rounded-lg p-2 border border-slate-700 text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="critical">Critical</option>
                <option value="desirable">Desirable</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg border border-slate-700 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Configured skills */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {requiredSkills.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono"
                >
                  <span>{s.name}</span>
                  <span className="text-teal-400 font-bold">&ge;L{s.minProficiency}</span>
                  <span className="text-slate-400 text-[10px]">({s.importance})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.name)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 transition-colors shadow-sm"
            >
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
