import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Search,
  Filter
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { ALL_SKILLS_CATALOG } from '../data/seedData';

export const SkillsIntelligenceView: React.FC = () => {
  const { employees, projects, setActiveTab } = useWorkforce();
  const [skillSearch, setSkillSearch] = useState('');
  const [filterGapOnly, setFilterGapOnly] = useState(false);

  // Compute skill inventory and demand
  const skillAnalysis = useMemo(() => {
    // Collect all skills present in employees or required by projects
    const allSkills = Array.from(
      new Set([
        ...ALL_SKILLS_CATALOG,
        ...employees.flatMap((e) => e.skills.map((s) => s.name)),
        ...projects.flatMap((p) => p.requiredSkills.map((s) => s.name)),
      ])
    ).sort();

    return allSkills.map((skillName) => {
      // Available candidates with proficiency >= 3
      const qualifiedEmployees = employees.filter((e) =>
        e.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase() && s.proficiency >= 3)
      );

      // Max proficiency available in org
      let maxProficiency = 0;
      employees.forEach((e) => {
        const found = e.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
        if (found && found.proficiency > maxProficiency) {
          maxProficiency = found.proficiency;
        }
      });

      // Demand across all projects
      const demandedByProjects = projects.filter((p) =>
        p.requiredSkills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())
      );

      let maxRequiredProf = 0;
      demandedByProjects.forEach((p) => {
        const req = p.requiredSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
        if (req && req.minProficiency > maxRequiredProf) {
          maxRequiredProf = req.minProficiency;
        }
      });

      const isShortage = demandedByProjects.length > 0 && qualifiedEmployees.length < demandedByProjects.length;
      const isCriticalGap = demandedByProjects.length > 0 && maxProficiency < maxRequiredProf;

      let priority: 'Critical' | 'High' | 'Medium' | 'Sufficient' = 'Sufficient';
      if (isCriticalGap) priority = 'Critical';
      else if (isShortage) priority = 'High';
      else if (demandedByProjects.length > 0 && qualifiedEmployees.length <= 2) priority = 'Medium';

      return {
        skillName,
        qualifiedCount: qualifiedEmployees.length,
        qualifiedEmployees,
        maxProficiency,
        demandedByProjects,
        maxRequiredProf,
        isShortage,
        isCriticalGap,
        priority,
      };
    });
  }, [employees, projects]);

  const filteredSkills = useMemo(() => {
    return skillAnalysis.filter((item) => {
      const matchesSearch = item.skillName.toLowerCase().includes(skillSearch.toLowerCase());
      const matchesGap = filterGapOnly ? (item.isShortage || item.isCriticalGap) : true;
      return matchesSearch && matchesGap;
    });
  }, [skillAnalysis, skillSearch, filterGapOnly]);

  const criticalGapsCount = skillAnalysis.filter((s) => s.priority === 'Critical').length;
  const shortageCount = skillAnalysis.filter((s) => s.priority === 'High').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Critical Skill Deficits</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{criticalGapsCount}</div>
          <p className="text-[11px] text-slate-500">
            Required by active pipelines with 0 staff meeting minimum level (e.g. Rust)
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Bench Capacity Shortages</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{shortageCount}</div>
          <p className="text-[11px] text-slate-500">
            Fewer qualified personnel than required project assignments
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Skill Catalog Monitored</span>
            <Cpu className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-400">{skillAnalysis.length}</div>
          <p className="text-[11px] text-slate-500">
            Tracking individual 1-5 proficiency matrix across all divisions
          </p>
        </div>
      </div>

      {/* Critical Gap Banner if present */}
      {criticalGapsCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Organizational Skill Gap Detected:</strong> Project <em>"AI Vision & Telemetry Engine"</em> requires <strong>Rust &ge;Level 4</strong>, but current staff bench has 0 qualified engineers.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('training')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 transition-colors shrink-0"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Open Training Catalog</span>
          </button>
        </div>
      )}

      {/* Filter and Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Organizational Skill Competency Matrix</h3>
            <p className="text-slate-400 text-xs">
              Live audit comparing current qualified bench against active project demands
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400"
              />
            </div>

            <button
              onClick={() => setFilterGapOnly(!filterGapOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                filterGapOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {filterGapOnly ? 'Showing Gaps Only' : 'Show Gaps Only'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-[11px] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-3">Bench Supply (&ge;L3)</th>
                <th className="py-3 px-3">Max In-House Level</th>
                <th className="py-3 px-3">Project Demand</th>
                <th className="py-3 px-3">Risk Assessment</th>
                <th className="py-3 px-4 text-right">Upskilling Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSkills.map((item) => (
                <tr key={item.skillName} className="hover:bg-slate-800/40 transition-colors">
                  {/* Skill Name */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white">{item.skillName}</span>
                  </td>

                  {/* Qualified Count */}
                  <td className="py-3.5 px-3 font-mono">
                    <span className={item.qualifiedCount === 0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {item.qualifiedCount} staff
                    </span>
                  </td>

                  {/* Max In-House Level */}
                  <td className="py-3.5 px-3 font-mono">
                    {item.maxProficiency > 0 ? (
                      <span className="text-teal-300">Level {item.maxProficiency} / 5</span>
                    ) : (
                      <span className="text-slate-500 italic">None (0/5)</span>
                    )}
                  </td>

                  {/* Project Demand */}
                  <td className="py-3.5 px-3">
                    {item.demandedByProjects.length === 0 ? (
                      <span className="text-slate-500 text-[11px]">No active projects</span>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="font-mono text-slate-200">
                          {item.demandedByProjects.length} project(s) require up to L{item.maxRequiredProf}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {item.demandedByProjects.map((p) => p.name).join(', ')}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Risk Assessment */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                        item.priority === 'Critical'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                          : item.priority === 'High'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          : item.priority === 'Medium'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                          : 'bg-teal-950/60 text-teal-300 border border-teal-800'
                      }`}
                    >
                      {item.priority === 'Critical' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                      {item.priority === 'Sufficient' && <CheckCircle2 className="w-3 h-3 text-teal-400" />}
                      {item.priority}
                    </span>
                  </td>

                  {/* Upskilling Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveTab('training')}
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1"
                    >
                      <span>Find Courses</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
