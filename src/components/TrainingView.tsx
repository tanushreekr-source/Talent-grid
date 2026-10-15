import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  Check,
  AlertTriangle 
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';
import { TrainingCourse, Employee } from '../types';

export const TrainingView: React.FC = () => {
  const { trainingCourses, employees, projects, enrollTraining } = useWorkforce();
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Skill Gaps across active projects
  const identifiedProjectGaps = React.useMemo(() => {
    const gaps: Array<{
      projectId: string;
      projectName: string;
      skillName: string;
      minProficiency: number;
      availableProficiency: number;
      priority: 'Critical' | 'High' | 'Medium';
      recommendedCourse?: TrainingCourse;
    }> = [];

    projects.forEach((proj) => {
      const assigned = employees.filter((e) => proj.assignedTeamMemberIds.includes(e.id));
      proj.requiredSkills.forEach((req) => {
        let maxProf = 0;
        assigned.forEach((m) => {
          const s = m.skills.find((sk) => sk.name.toLowerCase() === req.name.toLowerCase());
          if (s && s.proficiency > maxProf) maxProf = s.proficiency;
        });

        if (maxProf < req.minProficiency) {
          const matchCourse = trainingCourses.find((c) =>
            c.skillsTaught.some((st) => st.toLowerCase() === req.name.toLowerCase())
          );

          gaps.push({
            projectId: proj.id,
            projectName: proj.name,
            skillName: req.name,
            minProficiency: req.minProficiency,
            availableProficiency: maxProf,
            priority: maxProf === 0 ? 'Critical' : 'High',
            recommendedCourse: matchCourse,
          });
        }
      });
    });

    return gaps;
  }, [projects, employees, trainingCourses]);

  const handleOpenEnroll = (course: TrainingCourse) => {
    setSelectedCourse(course);
    setSelectedEmployeeId(employees[0]?.id || '');
    setShowEnrollModal(true);
  };

  const handleConfirmEnroll = () => {
    if (selectedCourse && selectedEmployeeId) {
      enrollTraining(selectedCourse.id, selectedEmployeeId);
      setShowEnrollModal(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Active Pipeline Skill Gaps Callout */}
      {identifiedProjectGaps.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">
              Active Project Skill Shortages Requiring Upskilling ({identifiedProjectGaps.length} Gaps)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {identifiedProjectGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{gap.projectName}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        gap.priority === 'Critical'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {gap.priority}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    Missing Competency: <strong className="text-teal-300">{gap.skillName}</strong> (Required: Lvl {gap.minProficiency}, Team has: Lvl {gap.availableProficiency})
                  </div>
                </div>

                {gap.recommendedCourse ? (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 truncate">
                      Mapped Course: <strong>{gap.recommendedCourse.title}</strong>
                    </span>
                    <button
                      onClick={() => handleOpenEnroll(gap.recommendedCourse!)}
                      className="px-2.5 py-1 bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold rounded text-[11px] shrink-0"
                    >
                      Enroll Staff
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No exact catalog match</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Catalog Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">Curated Enterprise Learning Catalog</h3>
          <p className="text-slate-400 text-xs">
            Upskilling programs verified to advance individual 1-5 proficiency tiers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingCourses.map((course) => {
            // Find employees currently enrolled or recommended
            const enrolledStaff = employees.filter((e) =>
              e.recommendedTraining.includes(course.title) || e.completedTraining.includes(course.title)
            );

            return (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-semibold">
                        {course.provider}
                      </span>
                      <h4 className="font-bold text-white text-sm leading-tight mt-0.5">{course.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {course.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  {/* Skills taught */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                      Skills Advanced:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.skillsTaught.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded bg-teal-950/40 border border-teal-800 text-teal-300 text-[11px] font-mono"
                        >
                          {st} &rarr; Target Lvl {course.targetProficiency}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta stats */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.duration}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {course.enrolledCount} enrolled
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-mono">
                    {enrolledStaff.length > 0 ? `${enrolledStaff.length} internal learners` : 'No current learners'}
                  </span>

                  <button
                    onClick={() => handleOpenEnroll(course)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Employee</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-teal-400">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Assign Course</h3>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Target Course:</span>
                <div className="p-2.5 rounded bg-slate-800 font-semibold text-white">
                  {selectedCourse.title}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Candidate Employee:</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-lg p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-teal-400"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role} · {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-slate-400 text-[11px] leading-snug">
                Enrolling will add this course to the employee's recommended learning profile and enhance future project matching readiness.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnroll}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-teal-400 hover:bg-teal-300 text-slate-950 transition-colors shadow-sm"
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
