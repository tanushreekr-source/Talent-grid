import React, { useState } from 'react';
import { X, Plus, Trash2, UserPlus, ShieldCheck } from 'lucide-react';
import { useWorkforce } from '../../context/WorkforceContext';
import { Department, AvailabilityStatus, SkillProficiency } from '../../types';
import { ALL_SKILLS_CATALOG } from '../../data/seedData';

interface AddEmployeeModalProps {
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose }) => {
  const { addEmployee } = useWorkforce();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Department>('Full-Stack Development');
  const [experience, setExperience] = useState<number>(3);
  const [email, setEmail] = useState('');
  const [weeklyCapacity, setWeeklyCapacity] = useState<number>(40);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('available');

  const [skills, setSkills] = useState<SkillProficiency[]>([
    { name: 'React', proficiency: 4 },
    { name: 'TypeScript', proficiency: 3 },
  ]);

  const [newSkillName, setNewSkillName] = useState(ALL_SKILLS_CATALOG[0]);
  const [newSkillProf, setNewSkillProf] = useState(3);

  const handleAddSkill = () => {
    if (!skills.some((s) => s.name.toLowerCase() === newSkillName.toLowerCase())) {
      setSkills([...skills, { name: newSkillName, proficiency: newSkillProf }]);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    addEmployee({
      name: name.trim(),
      role: role.trim(),
      department,
      experience: Number(experience) || 1,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@workwise.corp`,
      skills,
      weeklyCapacity: Number(weeklyCapacity) || 40,
      allocatedHours: 0,
      availabilityStatus,
      currentProjectAssignments: [],
      completedTraining: [],
      recommendedTraining: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col text-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Add New Employee Profile</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>
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
              <label className="text-slate-400 block mb-1">Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="35"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Weekly Capacity (Hours)</label>
              <input
                type="number"
                min="10"
                max="60"
                value={weeklyCapacity}
                onChange={(e) => setWeeklyCapacity(Number(e.target.value))}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Availability Status</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-teal-400"
              >
                <option value="available">Available</option>
                <option value="partially-available">Partially Available</option>
                <option value="on-leave">On Leave</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <label className="text-slate-300 font-semibold block">Technical Skills & Proficiency (1-5)</label>
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
                <option value={1}>Lvl 1 (Novice)</option>
                <option value={2}>Lvl 2 (Junior)</option>
                <option value={3}>Lvl 3 (Competent)</option>
                <option value={4}>Lvl 4 (Advanced)</option>
                <option value={5}>Lvl 5 (Expert)</option>
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

            {/* Added skills pill-less tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {skills.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono"
                >
                  <span>{s.name}</span>
                  <span className="text-teal-400 font-bold">L{s.proficiency}</span>
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
              Create Employee Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
