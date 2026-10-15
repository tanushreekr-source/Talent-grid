import React, { useState } from 'react';
import { WorkforceProvider, useWorkforce } from './context/WorkforceContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ScenarioBanner } from './components/ScenarioBanner';
import { NotificationToast } from './components/NotificationToast';
import { DashboardView } from './components/DashboardView';
import { TeamBuilderView } from './components/TeamBuilderView';
import { EmployeesView } from './components/EmployeesView';
import { ProjectsView } from './components/ProjectsView';
import { WorkloadPlannerView } from './components/WorkloadPlannerView';
import { SkillsIntelligenceView } from './components/SkillsIntelligenceView';
import { TrainingView } from './components/TrainingView';
import { ReportsView } from './components/ReportsView';
import { AddEmployeeModal } from './components/modals/AddEmployeeModal';
import { AddProjectModal } from './components/modals/AddProjectModal';

const AppContent: React.FC = () => {
  const { activeTab } = useWorkforce();
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Hackathon Demonstration Scenarios Bar */}
        <ScenarioBanner />

        {/* Global Dashboard Header */}
        <Header 
          onOpenNewEmployeeModal={() => setShowAddEmployeeModal(true)}
          onOpenNewProjectModal={() => setShowAddProjectModal(true)}
        />

        {/* Tab Viewport */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'team-builder' && <TeamBuilderView />}
          {activeTab === 'employees' && (
            <EmployeesView onOpenAddModal={() => setShowAddEmployeeModal(true)} />
          )}
          {activeTab === 'projects' && (
            <ProjectsView onOpenAddModal={() => setShowAddProjectModal(true)} />
          )}
          {activeTab === 'workload-planner' && <WorkloadPlannerView />}
          {activeTab === 'skills-intelligence' && <SkillsIntelligenceView />}
          {activeTab === 'training' && <TrainingView />}
          {activeTab === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* Modals */}
      {showAddEmployeeModal && (
        <AddEmployeeModal onClose={() => setShowAddEmployeeModal(false)} />
      )}
      {showAddProjectModal && (
        <AddProjectModal onClose={() => setShowAddProjectModal(false)} />
      )}

      {/* Toast Notification Container */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <WorkforceProvider>
      <AppContent />
    </WorkforceProvider>
  );
}
