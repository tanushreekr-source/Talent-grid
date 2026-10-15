import React from 'react';
import { 
  Sparkles, 
  UserX, 
  Scale, 
  AlertTriangle, 
  Split, 
  CheckCircle2, 
  X,
  Play
} from 'lucide-react';
import { useWorkforce } from '../context/WorkforceContext';

export const ScenarioBanner: React.FC = () => {
  const { activeScenario, loadScenario, clearActiveScenario } = useWorkforce();

  const scenarios: {
    id: 'A' | 'B' | 'C' | 'D' | 'E';
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'A',
      title: 'Scenario A: Smart Team',
      subtitle: 'React, Python, SQL, Testing',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: 'border-teal-500/40 text-teal-300 hover:bg-teal-500/10',
    },
    {
      id: 'B',
      title: 'Scenario B: Unavailable Member',
      subtitle: 'Mark lead unavailable & replace',
      icon: <UserX className="w-3.5 h-3.5" />,
      color: 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10',
    },
    {
      id: 'C',
      title: 'Scenario C: Workload Imbalance',
      subtitle: '115% vs 30% util rebalance',
      icon: <Scale className="w-3.5 h-3.5" />,
      color: 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10',
    },
    {
      id: 'D',
      title: 'Scenario D: Skill Gap',
      subtitle: 'Flag missing Rust & recommend course',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      color: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10',
    },
    {
      id: 'E',
      title: 'Scenario E: Alternative Team',
      subtitle: 'No 100% fit, suggest best alternative',
      icon: <Split className="w-3.5 h-3.5" />,
      color: 'border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10',
    },
  ];

  const getScenarioExplanation = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    switch (id) {
      case 'A':
        return {
          header: 'Scenario A — Smart Team Formation Activated',
          body: 'Evaluates OmniChannel E-Commerce Platform requiring React, Python, SQL, and Testing. The algorithm ranks individual candidates using the 50/20/20/10 weighted formula and assembles a balanced complementary team covering 100% of technical requirements.',
          highlight: 'Check the Team Builder ranking table below to inspect individual skill match percentages and feasibility.',
        };
      case 'B':
        return {
          header: 'Scenario B — Employee Availability Real-Time Shift',
          body: 'Marcus Vance has been transitioned to "On-Leave" status. Notice how the matching algorithm drops his Availability score to 0 and recalculates the team instantly, proposing suitable available substitutes (such as Maya Lin or Elena Rostova).',
          highlight: 'Demonstrates rule: High match score never overrides zero capacity or leave status.',
        };
      case 'C':
        return {
          header: 'Scenario C — Workload Imbalance & Smart Rebalance',
          body: 'Sarah Chen is overallocated at 115% capacity (-6h free), while Alex Rivera is underutilized at 30% capacity (+28h free). The Rebalance Engine proposes shifting 6-10h of backend API responsibilities to normalize both engineers.',
          highlight: 'Inspect the proposed Before vs After utilization in the Workload Planner below.',
        };
      case 'D':
        return {
          header: 'Scenario D — Skill Gap Detection & Training Pipeline',
          body: 'AI Vision & Telemetry Engine requires Rust proficiency level 4. Since no active employee currently holds Rust at that level, the team builder flags the missing skill and directs the manager to the enterprise training catalog.',
          highlight: 'Click "Training Catalog" or the warning banner to view recommended courses for upskilling.',
        };
      case 'E':
        return {
          header: 'Scenario E — Alternative Team Optimization Under Strict Constraints',
          body: 'Enterprise FinTech Ledger requires 3 senior engineers with level 5 PostgreSQL and Python. Because senior architects are constrained across active pipelines, WorkWise AI generates feasible alternative compositions with explicit trade-offs.',
          highlight: 'Review the "Alternative Team Compositions" tab to compare coverage and experience trade-offs.',
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 text-xs">
      {/* Quick Launch Scenario Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-teal-400 font-semibold font-mono">
            Hackathon Scenarios:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scenarios.map((s) => {
            const isSelected = activeScenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => loadScenario(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 border-teal-400 font-semibold shadow-sm'
                    : `bg-slate-800/70 border-slate-700/80 ${s.color}`
                }`}
                title={s.subtitle}
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-slate-950 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Detailed Banner */}
      {activeScenario && (
        <div className="bg-teal-950/40 border-t border-teal-800/40 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs">
                <Play className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
                <span>{getScenarioExplanation(activeScenario).header}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-4xl">
                {getScenarioExplanation(activeScenario).body}
              </p>
              <p className="text-[11px] text-teal-400/90 font-mono mt-0.5">
                💡 {getScenarioExplanation(activeScenario).highlight}
              </p>
            </div>

            <button
              onClick={clearActiveScenario}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
