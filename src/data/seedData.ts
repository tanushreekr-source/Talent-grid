import { Employee, Project, TrainingCourse } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-101',
    name: 'Marcus Vance',
    department: 'Full-Stack Development',
    role: 'Senior Full-Stack Architect',
    experience: 7,
    email: 'marcus.vance@workwise.corp',
    skills: [
      { name: 'React', proficiency: 5 },
      { name: 'Python', proficiency: 4 },
      { name: 'SQL', proficiency: 4 },
      { name: 'Testing', proficiency: 4 },
      { name: 'TypeScript', proficiency: 5 },
      { name: 'Node.js', proficiency: 4 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 20,
    remainingCapacity: 20,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 20, role: 'Lead Architect' }
    ],
    completedTraining: ['Advanced React Patterns', 'Enterprise System Design'],
    recommendedTraining: ['Cloud Native Kubernetes Deployment'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-102',
    name: 'Elena Rostova',
    department: 'Frontend Engineering',
    role: 'Staff Frontend Engineer',
    experience: 6,
    email: 'elena.rostova@workwise.corp',
    skills: [
      { name: 'React', proficiency: 5 },
      { name: 'TypeScript', proficiency: 5 },
      { name: 'Next.js', proficiency: 5 },
      { name: 'Testing', proficiency: 4 },
      { name: 'UI/UX Design', proficiency: 3 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 25,
    remainingCapacity: 15,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 25, role: 'Frontend Lead' }
    ],
    completedTraining: ['Modern End-to-End Testing & Playwright'],
    recommendedTraining: ['High-Performance Python & FastAPI'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-103',
    name: 'Sarah Chen',
    department: 'Backend Engineering',
    role: 'Principal Backend Engineer',
    experience: 8,
    email: 'sarah.chen@workwise.corp',
    skills: [
      { name: 'Python', proficiency: 5 },
      { name: 'SQL', proficiency: 5 },
      { name: 'PostgreSQL', proficiency: 5 },
      { name: 'Docker', proficiency: 4 },
      { name: 'Testing', proficiency: 3 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 46, // OVERALLOCATED (115%) for Scenario C!
    remainingCapacity: -6,
    availabilityStatus: 'partially-available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 26, role: 'Backend Lead' },
      { projectId: 'PRJ-105', projectName: 'Healthcare Analytics Pipeline', hoursPerWeek: 20, role: 'Data Integration Lead' }
    ],
    completedTraining: ['Enterprise PostgreSQL Optimization & Indexing'],
    recommendedTraining: ['Rust for Cloud Systems & Memory Safety'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-104',
    name: 'Alex Rivera',
    department: 'Backend Engineering',
    role: 'Backend Software Engineer',
    experience: 4,
    email: 'alex.rivera@workwise.corp',
    skills: [
      { name: 'Python', proficiency: 4 },
      { name: 'SQL', proficiency: 4 },
      { name: 'Docker', proficiency: 3 },
      { name: 'PostgreSQL', proficiency: 3 },
      { name: 'Testing', proficiency: 3 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 12, // UNDERUTILIZED (30%) - Ready to balance Sarah Chen in Scenario C!
    remainingCapacity: 28,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 12, role: 'API Developer' }
    ],
    completedTraining: ['FastAPI Microservices'],
    recommendedTraining: ['Enterprise PostgreSQL Optimization & Indexing'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-105',
    name: 'David Kim',
    department: 'QA & Test Engineering',
    role: 'Senior QA Automation Engineer',
    experience: 5,
    email: 'david.kim@workwise.corp',
    skills: [
      { name: 'Testing', proficiency: 5 },
      { name: 'Python', proficiency: 4 },
      { name: 'SQL', proficiency: 3 },
      { name: 'Playwright', proficiency: 5 },
      { name: 'CI/CD', proficiency: 4 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 20,
    remainingCapacity: 20,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-105', projectName: 'Healthcare Analytics Pipeline', hoursPerWeek: 20, role: 'QA Lead' }
    ],
    completedTraining: ['Modern End-to-End Testing & Playwright'],
    recommendedTraining: ['Automated Security Testing'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-106',
    name: 'Priya Patel',
    department: 'Data Analytics & AI',
    role: 'Lead Data Scientist',
    experience: 6,
    email: 'priya.patel@workwise.corp',
    skills: [
      { name: 'Python', proficiency: 5 },
      { name: 'SQL', proficiency: 5 },
      { name: 'Machine Learning', proficiency: 5 },
      { name: 'Testing', proficiency: 3 },
      { name: 'PyTorch', proficiency: 4 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 32,
    remainingCapacity: 8,
    availabilityStatus: 'partially-available',
    currentProjectAssignments: [
      { projectId: 'PRJ-105', projectName: 'Healthcare Analytics Pipeline', hoursPerWeek: 32, role: 'ML Architect' }
    ],
    completedTraining: ['Applied Machine Learning with PyTorch'],
    recommendedTraining: ['Cloud Native Kubernetes Deployment'],
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171edd275f9?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-107',
    name: 'Maya Lin',
    department: 'Full-Stack Development',
    role: 'Full-Stack Developer',
    experience: 4,
    email: 'maya.lin@workwise.corp',
    skills: [
      { name: 'React', proficiency: 4 },
      { name: 'Python', proficiency: 3 },
      { name: 'SQL', proficiency: 4 },
      { name: 'Testing', proficiency: 3 },
      { name: 'Node.js', proficiency: 4 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 15,
    remainingCapacity: 25,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 15, role: 'Full-Stack Engineer' }
    ],
    completedTraining: ['Advanced React Patterns'],
    recommendedTraining: ['Modern End-to-End Testing & Playwright'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-108',
    name: 'Tariq Al-Mansoor',
    department: 'Backend Engineering',
    role: 'Senior Backend Engineer',
    experience: 5,
    email: 'tariq.mansoor@workwise.corp',
    skills: [
      { name: 'Python', proficiency: 4 },
      { name: 'SQL', proficiency: 4 },
      { name: 'Docker', proficiency: 4 },
      { name: 'Kubernetes', proficiency: 3 },
      { name: 'Testing', proficiency: 4 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 40, // At full capacity (100%)
    remainingCapacity: 0,
    availabilityStatus: 'unavailable',
    currentProjectAssignments: [
      { projectId: 'PRJ-105', projectName: 'Healthcare Analytics Pipeline', hoursPerWeek: 40, role: 'Data Engineer' }
    ],
    completedTraining: ['Enterprise PostgreSQL Optimization & Indexing'],
    recommendedTraining: ['Kubernetes Cluster Administration & GitOps'],
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-109',
    name: 'Jordan Lee',
    department: 'UI/UX Design',
    role: 'Lead Product Designer',
    experience: 6,
    email: 'jordan.lee@workwise.corp',
    skills: [
      { name: 'UI/UX Design', proficiency: 5 },
      { name: 'Design Systems', proficiency: 5 },
      { name: 'User Research', proficiency: 4 },
      { name: 'React', proficiency: 2 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 20,
    remainingCapacity: 20,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 20, role: 'Design Lead' }
    ],
    completedTraining: ['Design Systems at Scale'],
    recommendedTraining: ['Frontend Foundations for Designers'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-110',
    name: 'Carlos Mendez',
    department: 'Cloud & DevOps',
    role: 'DevOps & Infrastructure Architect',
    experience: 7,
    email: 'carlos.mendez@workwise.corp',
    skills: [
      { name: 'Kubernetes', proficiency: 5 },
      { name: 'AWS', proficiency: 5 },
      { name: 'CI/CD', proficiency: 5 },
      { name: 'Docker', proficiency: 5 },
      { name: 'Python', proficiency: 3 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 20,
    remainingCapacity: 20,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 20, role: 'Cloud Lead' }
    ],
    completedTraining: ['Kubernetes Cluster Administration & GitOps'],
    recommendedTraining: ['Rust for Cloud Systems & Memory Safety'],
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-111',
    name: 'Emily Zhang',
    department: 'QA & Test Engineering',
    role: 'QA Engineer',
    experience: 3,
    email: 'emily.zhang@workwise.corp',
    skills: [
      { name: 'Testing', proficiency: 4 },
      { name: 'SQL', proficiency: 3 },
      { name: 'Python', proficiency: 2 },
      { name: 'Cypress', proficiency: 4 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 15,
    remainingCapacity: 25,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 15, role: 'QA Tester' }
    ],
    completedTraining: ['Modern End-to-End Testing & Playwright'],
    recommendedTraining: ['High-Performance Python & FastAPI'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-112',
    name: 'Robert Taylor',
    department: 'Project Management',
    role: 'Agile Delivery Director',
    experience: 9,
    email: 'robert.taylor@workwise.corp',
    skills: [
      { name: 'Agile', proficiency: 5 },
      { name: 'Scrum', proficiency: 5 },
      { name: 'Risk Management', proficiency: 5 },
      { name: 'Jira', proficiency: 5 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 35,
    remainingCapacity: 5,
    availabilityStatus: 'partially-available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 20, role: 'Program Lead' },
      { projectId: 'PRJ-105', projectName: 'Healthcare Analytics Pipeline', hoursPerWeek: 15, role: 'Delivery Lead' }
    ],
    completedTraining: ['Agile Technical Leadership & Resource Planning'],
    recommendedTraining: ['Data-Driven Agile Metrics'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-113',
    name: 'Sophia Wang',
    department: 'Frontend Engineering',
    role: 'Frontend Developer',
    experience: 3,
    email: 'sophia.wang@workwise.corp',
    skills: [
      { name: 'React', proficiency: 4 },
      { name: 'Testing', proficiency: 3 },
      { name: 'TypeScript', proficiency: 4 },
      { name: 'Tailwind CSS', proficiency: 5 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 10,
    remainingCapacity: 30,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 10, role: 'UI Developer' }
    ],
    completedTraining: ['Advanced React Patterns'],
    recommendedTraining: ['Modern End-to-End Testing & Playwright'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-114',
    name: 'Vikram Joshi',
    department: 'Backend Engineering',
    role: 'Senior Microservices Engineer',
    experience: 6,
    email: 'vikram.joshi@workwise.corp',
    skills: [
      { name: 'Python', proficiency: 4 },
      { name: 'SQL', proficiency: 4 },
      { name: 'PostgreSQL', proficiency: 4 },
      { name: 'Docker', proficiency: 4 },
      { name: 'Testing', proficiency: 3 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 0,
    remainingCapacity: 40,
    availabilityStatus: 'on-leave', // Currently on leave with leave dates
    leaveStartDate: '2026-10-10',
    leaveEndDate: '2026-10-28',
    currentProjectAssignments: [],
    completedTraining: ['Enterprise PostgreSQL Optimization & Indexing'],
    recommendedTraining: ['Rust for Cloud Systems & Memory Safety'],
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-115',
    name: 'Liam O\'Connor',
    department: 'Full-Stack Development',
    role: 'Junior Software Engineer',
    experience: 2,
    email: 'liam.oconnor@workwise.corp',
    skills: [
      { name: 'React', proficiency: 3 },
      { name: 'Python', proficiency: 2 },
      { name: 'SQL', proficiency: 3 },
      { name: 'Testing', proficiency: 2 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 15,
    remainingCapacity: 25,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-104', projectName: 'NextGen Customer Portal', hoursPerWeek: 15, role: 'Associate Developer' }
    ],
    completedTraining: ['Git Foundations & Code Reviews'],
    recommendedTraining: ['High-Performance Python & FastAPI'],
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'EMP-116',
    name: 'Zoe Morales',
    department: 'Data Analytics & AI',
    role: 'BI & Analytics Engineer',
    experience: 4,
    email: 'zoe.morales@workwise.corp',
    skills: [
      { name: 'SQL', proficiency: 5 },
      { name: 'Python', proficiency: 3 },
      { name: 'Testing', proficiency: 3 },
      { name: 'Tableau', proficiency: 5 },
    ],
    weeklyCapacity: 40,
    allocatedHours: 20,
    remainingCapacity: 20,
    availabilityStatus: 'available',
    currentProjectAssignments: [
      { projectId: 'PRJ-105', projectName: 'Healthcare Analytics Pipeline', hoursPerWeek: 20, role: 'BI Specialist' }
    ],
    completedTraining: ['Modern Data Warehousing'],
    recommendedTraining: ['Applied Machine Learning with PyTorch'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'OmniChannel E-Commerce Platform',
    description: 'Next-generation high-availability commerce portal with live catalog, inventory sync, and microservices checkout.',
    department: 'Full-Stack Development',
    priority: 'Critical',
    status: 'Planning',
    durationWeeks: 12,
    weeklyEffortRequired: 60, // 20h * 3 members
    teamSize: 3,
    requiredExperience: 4,
    requiredSkills: [
      { name: 'React', minProficiency: 3, importance: 'critical' },
      { name: 'Python', minProficiency: 3, importance: 'critical' },
      { name: 'SQL', minProficiency: 3, importance: 'critical' },
      { name: 'Testing', minProficiency: 3, importance: 'critical' },
    ],
    assignedTeamMemberIds: [],
    deadline: '2027-01-30',
    budget: '$180,000'
  },
  {
    id: 'PRJ-102',
    name: 'AI Vision & Telemetry Engine',
    description: 'Edge-distributed telemetry processor analyzing industrial optical streams and sensor data.',
    department: 'Data Analytics & AI',
    priority: 'High',
    status: 'Planning',
    durationWeeks: 16,
    weeklyEffortRequired: 50,
    teamSize: 3,
    requiredExperience: 5,
    requiredSkills: [
      { name: 'Python', minProficiency: 4, importance: 'critical' },
      { name: 'Kubernetes', minProficiency: 4, importance: 'critical' },
      { name: 'Rust', minProficiency: 4, importance: 'critical' }, // SKILL GAP for Scenario D!
      { name: 'Testing', minProficiency: 3, importance: 'desirable' },
    ],
    assignedTeamMemberIds: [],
    deadline: '2027-03-15',
    budget: '$220,000'
  },
  {
    id: 'PRJ-103',
    name: 'Enterprise FinTech Ledger System',
    description: 'Double-entry transactional ledger with strict audit compliance and low-latency PostgreSQL clustering.',
    department: 'Backend Engineering',
    priority: 'Critical',
    status: 'Planning',
    durationWeeks: 20,
    weeklyEffortRequired: 60,
    teamSize: 3,
    requiredExperience: 6,
    requiredSkills: [
      { name: 'PostgreSQL', minProficiency: 5, importance: 'critical' },
      { name: 'Python', minProficiency: 5, importance: 'critical' },
      { name: 'SQL', minProficiency: 5, importance: 'critical' },
      { name: 'Testing', minProficiency: 4, importance: 'critical' },
    ],
    assignedTeamMemberIds: [],
    deadline: '2027-04-10',
    budget: '$275,000'
  },
  {
    id: 'PRJ-104',
    name: 'NextGen Customer Portal',
    description: 'Unified customer self-service hub with biometric sign-in and responsive workflow management.',
    department: 'Frontend Engineering',
    priority: 'Medium',
    status: 'Active',
    durationWeeks: 10,
    weeklyEffortRequired: 110,
    teamSize: 5,
    requiredExperience: 3,
    requiredSkills: [
      { name: 'React', minProficiency: 4, importance: 'critical' },
      { name: 'TypeScript', minProficiency: 4, importance: 'critical' },
      { name: 'Python', minProficiency: 3, importance: 'critical' },
      { name: 'UI/UX Design', minProficiency: 3, importance: 'desirable' },
    ],
    assignedTeamMemberIds: ['EMP-101', 'EMP-102', 'EMP-103', 'EMP-104', 'EMP-109'],
    deadline: '2026-12-15',
    budget: '$150,000'
  },
  {
    id: 'PRJ-105',
    name: 'Healthcare Analytics Pipeline',
    description: 'HIPAA-compliant patient cohort data engine with predictive length-of-stay modeling.',
    department: 'Data Analytics & AI',
    priority: 'High',
    status: 'Active',
    durationWeeks: 14,
    weeklyEffortRequired: 90,
    teamSize: 4,
    requiredExperience: 5,
    requiredSkills: [
      { name: 'Python', minProficiency: 5, importance: 'critical' },
      { name: 'SQL', minProficiency: 5, importance: 'critical' },
      { name: 'Machine Learning', minProficiency: 4, importance: 'critical' },
      { name: 'Testing', minProficiency: 4, importance: 'critical' },
    ],
    assignedTeamMemberIds: ['EMP-103', 'EMP-105', 'EMP-106', 'EMP-108'],
    deadline: '2027-01-20',
    budget: '$210,000'
  }
];

export const INITIAL_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'TRN-201',
    title: 'Rust for Cloud Systems & Memory Safety',
    provider: 'WorkWise Engineering Academy',
    skillsTaught: ['Rust'],
    targetProficiency: 4,
    duration: '4 Weeks (20 Hours)',
    level: 'Advanced',
    description: 'Deep dive into memory safety, async concurrency with Tokio, and building low-latency microservices with zero garbage collection overhead.',
    enrolledCount: 3
  },
  {
    id: 'TRN-202',
    title: 'Modern End-to-End Testing & Playwright',
    provider: 'WorkWise QA Center of Excellence',
    skillsTaught: ['Testing', 'Playwright'],
    targetProficiency: 4,
    duration: '3 Weeks (15 Hours)',
    level: 'Intermediate',
    description: 'Comprehensive test automation covering visual regression, mock API integration, and automated CI/CD pipeline verification.',
    enrolledCount: 7
  },
  {
    id: 'TRN-203',
    title: 'Enterprise PostgreSQL Optimization & Indexing',
    provider: 'Data Systems Institute',
    skillsTaught: ['PostgreSQL', 'SQL'],
    targetProficiency: 5,
    duration: '3 Weeks (18 Hours)',
    level: 'Advanced',
    description: 'Query execution plans, composite and partial indexes, connection pooling, and multi-tenant partitioning at enterprise scale.',
    enrolledCount: 5
  },
  {
    id: 'TRN-204',
    title: 'Kubernetes Cluster Administration & GitOps',
    provider: 'Cloud Native Foundation',
    skillsTaught: ['Kubernetes', 'CI/CD'],
    targetProficiency: 4,
    duration: '4 Weeks (24 Hours)',
    level: 'Advanced',
    description: 'Production cluster management, Helm charts, ArgoCD GitOps workflows, and horizontal pod auto-scaling policies.',
    enrolledCount: 4
  },
  {
    id: 'TRN-205',
    title: 'High-Performance Python & FastAPI Microservices',
    provider: 'Python Software Guild',
    skillsTaught: ['Python'],
    targetProficiency: 4,
    duration: '2 Weeks (12 Hours)',
    level: 'Intermediate',
    description: 'Asynchronous event loops, Pydantic data validation, high-throughput REST APIs, and background job processing with Celery.',
    enrolledCount: 9
  },
  {
    id: 'TRN-206',
    title: 'Advanced React 19 & State Architecture',
    provider: 'Modern Web Institute',
    skillsTaught: ['React', 'TypeScript'],
    targetProficiency: 5,
    duration: '3 Weeks (16 Hours)',
    level: 'Advanced',
    description: 'React 19 Actions, Server Components, concurrent transitions, optimistic UI updates, and enterprise state management paradigms.',
    enrolledCount: 8
  },
  {
    id: 'TRN-207',
    title: 'Applied Machine Learning with PyTorch',
    provider: 'WorkWise AI Research Labs',
    skillsTaught: ['Machine Learning', 'PyTorch'],
    targetProficiency: 4,
    duration: '5 Weeks (30 Hours)',
    level: 'Advanced',
    description: 'Building custom neural networks, fine-tuning foundation models, deploying inference endpoints, and model monitoring.',
    enrolledCount: 4
  },
  {
    id: 'TRN-208',
    title: 'Agile Technical Leadership & Resource Planning',
    provider: 'Executive Leadership Institute',
    skillsTaught: ['Agile', 'Risk Management'],
    targetProficiency: 5,
    duration: '2 Weeks (10 Hours)',
    level: 'Intermediate',
    description: 'Workforce capacity planning, sprint velocity forecasting, team workload balancing, and stakeholder communication strategies.',
    enrolledCount: 6
  }
];

export const ALL_SKILLS_CATALOG = [
  'React',
  'Python',
  'SQL',
  'Testing',
  'TypeScript',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'Rust',
  'Machine Learning',
  'PyTorch',
  'Playwright',
  'UI/UX Design',
  'Design Systems',
  'Agile',
  'CI/CD',
  'AWS',
  'Next.js',
  'Node.js',
  'Tableau'
];
