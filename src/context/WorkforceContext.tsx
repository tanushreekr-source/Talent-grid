import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Employee, 
  Project, 
  TrainingCourse, 
  AlgorithmWeights, 
  ActiveTab, 
  AvailabilityStatus,
  RebalanceProposal 
} from '../types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PROJECTS, 
  INITIAL_TRAINING_COURSES 
} from '../data/seedData';
import { DEFAULT_WEIGHTS } from '../utils/matchingAlgorithm';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface WorkforceContextType {
  employees: Employee[];
  projects: Project[];
  trainingCourses: TrainingCourse[];
  weights: AlgorithmWeights;
  activeTab: ActiveTab;
  activeProjectId: string;
  activeScenario: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  notifications: Notification[];
  
  setActiveTab: (tab: ActiveTab) => void;
  setActiveProjectId: (id: string) => void;
  setWeights: (weights: AlgorithmWeights) => void;
  
  // Employee CRUD
  addEmployee: (employee: Omit<Employee, 'id' | 'remainingCapacity'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeAvailability: (id: string, status: AvailabilityStatus, leaveEnd?: string) => void;
  
  // Project CRUD
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  assignTeamToProject: (projectId: string, employeeIds: string[], hoursPerMember?: number) => void;
  removeTeamMember: (projectId: string, employeeId: string) => void;
  
  // Rebalance Engine
  applyRebalanceProposal: (proposal: RebalanceProposal) => void;
  
  // Training
  enrollTraining: (courseId: string, employeeId: string) => void;
  
  // Scenarios & Reset
  loadScenario: (scenario: 'A' | 'B' | 'C' | 'D' | 'E') => void;
  clearActiveScenario: () => void;
  resetToDefaultData: () => void;
  
  // Alerts
  notify: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissNotification: (id: string) => void;
}

const WorkforceContext = createContext<WorkforceContextType | undefined>(undefined);

export const WorkforceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('workwise_employees_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved employees', e);
    }
    return INITIAL_EMPLOYEES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('workwise_projects_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved projects', e);
    }
    return INITIAL_PROJECTS;
  });

  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(() => {
    try {
      const saved = localStorage.getItem('workwise_training_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved training', e);
    }
    return INITIAL_TRAINING_COURSES;
  });

  const [weights, setWeights] = useState<AlgorithmWeights>(() => {
    try {
      const saved = localStorage.getItem('workwise_weights_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse weights', e);
    }
    return DEFAULT_WEIGHTS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string>('PRJ-101');
  const [activeScenario, setActiveScenario] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('workwise_employees_v1', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('workwise_projects_v1', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('workwise_training_v1', JSON.stringify(trainingCourses));
  }, [trainingCourses]);

  useEffect(() => {
    localStorage.setItem('workwise_weights_v1', JSON.stringify(weights));
  }, [weights]);

  const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Employee actions
  const addEmployee = (empData: Omit<Employee, 'id' | 'remainingCapacity'>) => {
    const newId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const remainingCapacity = empData.weeklyCapacity - (empData.allocatedHours || 0);
    const newEmp: Employee = {
      ...empData,
      id: newId,
      remainingCapacity,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    notify(`Employee ${newEmp.name} added successfully.`, 'success');
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== id) return emp;
        const weeklyCap = updates.weeklyCapacity !== undefined ? updates.weeklyCapacity : emp.weeklyCapacity;
        const allocated = updates.allocatedHours !== undefined ? updates.allocatedHours : emp.allocatedHours;
        const remainingCapacity = weeklyCap - allocated;
        return {
          ...emp,
          ...updates,
          remainingCapacity,
        };
      })
    );
    notify(`Employee records updated.`, 'success');
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    // Also remove from any assigned projects
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        assignedTeamMemberIds: p.assignedTeamMemberIds.filter((mId) => mId !== id),
      }))
    );
    notify(`Employee ${target?.name || id} deleted.`, 'info');
  };

  const toggleEmployeeAvailability = (id: string, status: AvailabilityStatus, leaveEnd?: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== id) return emp;
        return {
          ...emp,
          availabilityStatus: status,
          leaveEndDate: status === 'on-leave' ? (leaveEnd || '2026-11-15') : undefined,
        };
      })
    );
    const target = employees.find((e) => e.id === id);
    notify(`Status of ${target?.name} changed to '${status}'. Match scores updated.`, 'warning');
  };

  // Project actions
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProj: Project = {
      ...projectData,
      id: newId,
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newId);
    notify(`Project "${newProj.name}" created. Ready for smart team building.`, 'success');
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj))
    );
    notify(`Project details updated.`, 'success');
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Release assigned employees
    if (target) {
      setEmployees((prev) =>
        prev.map((emp) => {
          const assignment = emp.currentProjectAssignments.find((a) => a.projectId === id);
          if (!assignment) return emp;
          const newAllocated = Math.max(0, emp.allocatedHours - assignment.hoursPerWeek);
          return {
            ...emp,
            allocatedHours: newAllocated,
            remainingCapacity: emp.weeklyCapacity - newAllocated,
            currentProjectAssignments: emp.currentProjectAssignments.filter((a) => a.projectId !== id),
          };
        })
      );
    }
    notify(`Project deleted.`, 'info');
  };

  const assignTeamToProject = (projectId: string, employeeIds: string[], hoursPerMember?: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const effortEach = hoursPerMember || Math.max(10, Math.round(project.weeklyEffortRequired / Math.max(1, employeeIds.length)));

    // Update project assigned IDs
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, assignedTeamMemberIds: employeeIds, status: 'Active' } : p))
    );

    // Update employees assigned hours
    setEmployees((prev) =>
      prev.map((emp) => {
        const isAssigned = employeeIds.includes(emp.id);
        const existingAssignment = emp.currentProjectAssignments.find((a) => a.projectId === projectId);

        if (isAssigned && !existingAssignment) {
          const newAllocated = emp.allocatedHours + effortEach;
          return {
            ...emp,
            allocatedHours: newAllocated,
            remainingCapacity: emp.weeklyCapacity - newAllocated,
            currentProjectAssignments: [
              ...emp.currentProjectAssignments,
              {
                projectId,
                projectName: project.name,
                hoursPerWeek: effortEach,
                role: 'Project Contributor',
              },
            ],
          };
        } else if (!isAssigned && existingAssignment) {
          const newAllocated = Math.max(0, emp.allocatedHours - existingAssignment.hoursPerWeek);
          return {
            ...emp,
            allocatedHours: newAllocated,
            remainingCapacity: emp.weeklyCapacity - newAllocated,
            currentProjectAssignments: emp.currentProjectAssignments.filter((a) => a.projectId !== projectId),
          };
        }
        return emp;
      })
    );

    notify(`Team of ${employeeIds.length} members assigned to "${project.name}". Workloads recalculated.`, 'success');
  };

  const removeTeamMember = (projectId: string, employeeId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, assignedTeamMemberIds: p.assignedTeamMemberIds.filter((id) => id !== employeeId) }
          : p
      )
    );

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const existing = emp.currentProjectAssignments.find((a) => a.projectId === projectId);
        if (!existing) return emp;
        const newAllocated = Math.max(0, emp.allocatedHours - existing.hoursPerWeek);
        return {
          ...emp,
          allocatedHours: newAllocated,
          remainingCapacity: emp.weeklyCapacity - newAllocated,
          currentProjectAssignments: emp.currentProjectAssignments.filter((a) => a.projectId !== projectId),
        };
      })
    );

    notify(`Team member removed from project. Capacity restored.`, 'info');
  };

  // Workload Rebalancing Action
  const applyRebalanceProposal = (proposal: RebalanceProposal) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === proposal.fromEmployeeId) {
          const newAlloc = Math.max(0, emp.allocatedHours - proposal.hours);
          const updatedAssignments = emp.currentProjectAssignments.map((a) => {
            if (a.projectId === proposal.projectId) {
              const updatedHours = Math.max(0, a.hoursPerWeek - proposal.hours);
              return { ...a, hoursPerWeek: updatedHours };
            }
            return a;
          }).filter((a) => a.hoursPerWeek > 0);

          return {
            ...emp,
            allocatedHours: newAlloc,
            remainingCapacity: emp.weeklyCapacity - newAlloc,
            currentProjectAssignments: updatedAssignments,
          };
        }

        if (emp.id === proposal.toEmployeeId) {
          const newAlloc = emp.allocatedHours + proposal.hours;
          const existing = emp.currentProjectAssignments.find((a) => a.projectId === proposal.projectId);
          let updatedAssignments = [...emp.currentProjectAssignments];

          if (existing) {
            updatedAssignments = updatedAssignments.map((a) =>
              a.projectId === proposal.projectId ? { ...a, hoursPerWeek: a.hoursPerWeek + proposal.hours } : a
            );
          } else {
            updatedAssignments.push({
              projectId: proposal.projectId,
              projectName: proposal.projectName,
              hoursPerWeek: proposal.hours,
              role: 'Staff Reassignment Support',
            });
          }

          return {
            ...emp,
            allocatedHours: newAlloc,
            remainingCapacity: emp.weeklyCapacity - newAlloc,
            currentProjectAssignments: updatedAssignments,
          };
        }

        return emp;
      })
    );

    notify(
      `Rebalanced ${proposal.hours}h from ${proposal.fromEmployeeId} to ${proposal.toEmployeeId} on ${proposal.projectName}. Workload normalized.`,
      'success'
    );
  };

  // Training Action
  const enrollTraining = (courseId: string, employeeId: string) => {
    const course = trainingCourses.find((c) => c.id === courseId);
    if (!course) return;

    setTrainingCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c))
    );

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const alreadyRecommended = emp.recommendedTraining.includes(course.title);
        return {
          ...emp,
          recommendedTraining: alreadyRecommended ? emp.recommendedTraining : [...emp.recommendedTraining, course.title],
        };
      })
    );

    const emp = employees.find((e) => e.id === employeeId);
    notify(`Assigned "${course.title}" to ${emp?.name || employeeId}.`, 'success');
  };

  // Scenarios handler
  const loadScenario = (scenario: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveScenario(scenario);

    switch (scenario) {
      case 'A': {
        // Smart Team Formation: Select PRJ-101 (React, Python, SQL, Testing), team size 3
        setActiveProjectId('PRJ-101');
        setActiveTab('team-builder');
        notify('Scenario A Loaded: Smart Team Formation for OmniChannel E-Commerce (React, Python, SQL, Testing).', 'info');
        break;
      }
      case 'B': {
        // Employee Unavailable: Make Marcus Vance on-leave, view rankings recalculation
        setActiveProjectId('PRJ-101');
        setActiveTab('team-builder');
        // Toggle Marcus Vance to on-leave
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === 'EMP-101'
              ? { ...emp, availabilityStatus: 'on-leave', leaveEndDate: '2026-11-20' }
              : emp
          )
        );
        notify('Scenario B Active: Marcus Vance marked On-Leave. Algorithm immediately drops him and recalculates replacement.', 'warning');
        break;
      }
      case 'C': {
        // Workload Imbalance: Sarah Chen overallocated (115%), Alex Rivera underutilized (30%)
        setActiveTab('workload-planner');
        notify('Scenario C Active: Workload Imbalance. Sarah Chen (115%) overallocated vs Alex Rivera (30%). Review Rebalance proposal.', 'info');
        break;
      }
      case 'D': {
        // Skill Gap: AI Vision & Telemetry Engine requires Rust
        setActiveProjectId('PRJ-102');
        setActiveTab('team-builder');
        notify('Scenario D Active: Skill Gap Detected. PRJ-102 requires "Rust" (missing in staff). View recommended training course.', 'warning');
        break;
      }
      case 'E': {
        // Alternative Team: PRJ-103 requires high experience & PostgreSQL 5
        setActiveProjectId('PRJ-103');
        setActiveTab('team-builder');
        notify('Scenario E Active: Strict Constraints. No single candidate covers all senior requirements; comparing best feasible alternative teams.', 'info');
        break;
      }
    }
  };

  const clearActiveScenario = () => {
    setActiveScenario(null);
  };

  const resetToDefaultData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setProjects(INITIAL_PROJECTS);
    setTrainingCourses(INITIAL_TRAINING_COURSES);
    setWeights(DEFAULT_WEIGHTS);
    setActiveProjectId('PRJ-101');
    setActiveScenario(null);
    localStorage.removeItem('workwise_employees_v1');
    localStorage.removeItem('workwise_projects_v1');
    localStorage.removeItem('workwise_training_v1');
    localStorage.removeItem('workwise_weights_v1');
    notify('Reset all workforce data to pristine hackathon default state.', 'info');
  };

  return (
    <WorkforceContext.Provider
      value={{
        employees,
        projects,
        trainingCourses,
        weights,
        activeTab,
        activeProjectId,
        activeScenario,
        notifications,
        setActiveTab,
        setActiveProjectId,
        setWeights,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeAvailability,
        addProject,
        updateProject,
        deleteProject,
        assignTeamToProject,
        removeTeamMember,
        applyRebalanceProposal,
        enrollTraining,
        loadScenario,
        clearActiveScenario,
        resetToDefaultData,
        notify,
        dismissNotification,
      }}
    >
      {children}
    </WorkforceContext.Provider>
  );
};

export const useWorkforce = () => {
  const context = useContext(WorkforceContext);
  if (!context) {
    throw new Error('useWorkforce must be used within a WorkforceProvider');
  }
  return context;
};
