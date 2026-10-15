export type Department = 
  | 'Frontend Engineering'
  | 'Backend Engineering'
  | 'Full-Stack Development'
  | 'Data Analytics & AI'
  | 'QA & Test Engineering'
  | 'UI/UX Design'
  | 'Project Management'
  | 'Cloud & DevOps';

export type AvailabilityStatus = 'available' | 'partially-available' | 'on-leave' | 'unavailable';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ProjectStatus = 'Planning' | 'Active' | 'Review' | 'Completed';

export interface SkillProficiency {
  name: string;
  proficiency: number; // 1 to 5
}

export interface ProjectAssignment {
  projectId: string;
  projectName: string;
  hoursPerWeek: number;
  role: string;
}

export interface Employee {
  id: string;
  name: string;
  department: Department;
  role: string;
  experience: number; // in years
  email: string;
  skills: SkillProficiency[];
  weeklyCapacity: number; // weekly capacity in hours (standard 40)
  allocatedHours: number; // hours already allocated
  remainingCapacity: number; // weeklyCapacity - allocatedHours
  availabilityStatus: AvailabilityStatus;
  leaveStartDate?: string;
  leaveEndDate?: string;
  currentProjectAssignments: ProjectAssignment[];
  completedTraining: string[];
  recommendedTraining: string[];
  avatarUrl?: string;
}

export interface RequiredSkill {
  name: string;
  minProficiency: number; // 1 to 5
  importance?: 'critical' | 'desirable';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  department: Department;
  priority: Priority;
  status: ProjectStatus;
  durationWeeks: number;
  weeklyEffortRequired: number; // total weekly hours required from the team
  teamSize: number; // target number of team members
  requiredExperience: number; // minimum years recommended
  requiredSkills: RequiredSkill[];
  assignedTeamMemberIds: string[];
  deadline?: string;
  budget?: string;
}

export interface AlgorithmWeights {
  skillMatch: number;      // e.g. 50
  experienceMatch: number;  // e.g. 20
  availability: number;     // e.g. 20
  workloadBalance: number;  // e.g. 10
}

export interface MatchedSkillDetail {
  name: string;
  candidateProf: number;
  requiredProf: number;
  meetsRequirement: boolean;
}

export interface CandidateMatchResult {
  employee: Employee;
  overallScore: number; // 0 - 100
  breakdown: {
    skillScore: number;
    experienceScore: number;
    availabilityScore: number;
    workloadScore: number;
  };
  matchedSkills: MatchedSkillDetail[];
  missingSkills: RequiredSkill[];
  underdevelopedSkills: MatchedSkillDetail[];
  reasons: string[];
  warnings: string[];
  isAvailable: boolean;
  hasCapacity: boolean;
  feasibleHours: number;
}

export interface TeamComposition {
  id: string;
  title: string;
  description: string;
  members: CandidateMatchResult[];
  coveragePercentage: number; // 0 to 100
  coveredSkills: string[];
  uncoveredSkills: RequiredSkill[];
  totalAllocatedHours: number;
  remainingCapacityTotal: number;
  averageExperience: number;
  averageMatchScore: number;
  isOptimal: boolean;
  tradeoffs: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  skillsTaught: string[];
  targetProficiency: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  enrolledCount: number;
}

export interface RebalanceProposal {
  id: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  projectId: string;
  projectName: string;
  hours: number;
  rationale: string;
  skillsMatched: string[];
  fromEmployeeBeforeUtilization: number;
  fromEmployeeAfterUtilization: number;
  toEmployeeBeforeUtilization: number;
  toEmployeeAfterUtilization: number;
}

export type ActiveTab = 
  | 'dashboard'
  | 'employees'
  | 'projects'
  | 'team-builder'
  | 'skills-intelligence'
  | 'workload-planner'
  | 'training'
  | 'reports';
