import { 
  Employee, 
  Project, 
  AlgorithmWeights, 
  CandidateMatchResult, 
  MatchedSkillDetail, 
  RequiredSkill, 
  TeamComposition, 
  RebalanceProposal 
} from '../types';

export const DEFAULT_WEIGHTS: AlgorithmWeights = {
  skillMatch: 50,
  experienceMatch: 20,
  availability: 20,
  workloadBalance: 10,
};

/**
 * Calculates transparent, explainable match score for an individual employee against a project.
 */
export function evaluateCandidate(
  employee: Employee,
  project: Project,
  weights: AlgorithmWeights = DEFAULT_WEIGHTS
): CandidateMatchResult {
  const targetEffortPerMember = Math.max(10, Math.round(project.weeklyEffortRequired / Math.max(1, project.teamSize)));

  // A. Skill Match Calculation (0 - 100)
  const matchedSkills: MatchedSkillDetail[] = [];
  const missingSkills: RequiredSkill[] = [];
  const underdevelopedSkills: MatchedSkillDetail[] = [];

  let totalSkillPoints = 0;
  const numRequiredSkills = project.requiredSkills.length;

  if (numRequiredSkills === 0) {
    totalSkillPoints = 100;
  } else {
    for (const req of project.requiredSkills) {
      const empSkill = employee.skills.find(
        (s) => s.name.toLowerCase().trim() === req.name.toLowerCase().trim()
      );

      if (!empSkill) {
        missingSkills.push(req);
      } else {
        const meets = empSkill.proficiency >= req.minProficiency;
        const detail: MatchedSkillDetail = {
          name: req.name,
          candidateProf: empSkill.proficiency,
          requiredProf: req.minProficiency,
          meetsRequirement: meets,
        };
        matchedSkills.push(detail);

        if (meets) {
          totalSkillPoints += 100;
        } else {
          // Underdeveloped: partial credit based on ratio
          const partial = Math.round((empSkill.proficiency / req.minProficiency) * 65);
          totalSkillPoints += partial;
          underdevelopedSkills.push(detail);
        }
      }
    }
  }

  const skillScore = numRequiredSkills > 0 ? Math.round(totalSkillPoints / numRequiredSkills) : 100;

  // B. Experience Match Calculation (0 - 100)
  const reqExp = project.requiredExperience || 1;
  const experienceScore = Math.min(100, Math.round((employee.experience / reqExp) * 100));

  // C. Availability Calculation (0 - 100)
  // CRITICAL RULE: Never treat a high match score as proof of actual availability unless current capacity data supports it.
  const isAvailableStatus = employee.availabilityStatus === 'available' || employee.availabilityStatus === 'partially-available';
  const hasRemainingCapacity = employee.remainingCapacity > 0;
  const isAvailable = isAvailableStatus && hasRemainingCapacity;
  const hasCapacity = employee.remainingCapacity >= targetEffortPerMember;

  let availabilityScore = 0;
  if (!isAvailableStatus) {
    availabilityScore = 0; // On leave or unavailable completely zeroes out availability
  } else if (employee.remainingCapacity <= 0) {
    availabilityScore = 0;
  } else {
    availabilityScore = Math.min(100, Math.round((employee.remainingCapacity / targetEffortPerMember) * 100));
  }

  // D. Workload Balance Calculation (0 - 100)
  const utilization = employee.weeklyCapacity > 0 
    ? (employee.allocatedHours / employee.weeklyCapacity) * 100 
    : 100;

  let workloadScore = 0;
  if (utilization > 100) {
    workloadScore = 0; // Overallocated
  } else if (utilization >= 90) {
    workloadScore = 30; // Near limit
  } else if (utilization >= 75) {
    workloadScore = 65; // High workload
  } else if (utilization >= 45) {
    workloadScore = 85; // Balanced
  } else {
    workloadScore = 100; // Spare capacity / Underutilized
  }

  // Normalized weighted score (0 - 100)
  const totalWeight = weights.skillMatch + weights.experienceMatch + weights.availability + weights.workloadBalance;
  const normalizedOverall = Math.round(
    (skillScore * weights.skillMatch +
      experienceScore * weights.experienceMatch +
      availabilityScore * weights.availability +
      workloadScore * weights.workloadBalance) /
      Math.max(1, totalWeight)
  );

  // Feasible hours candidate could reliably contribute
  const feasibleHours = Math.max(0, Math.min(targetEffortPerMember, employee.remainingCapacity));

  // Explainability Reasons & Warnings
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (matchedSkills.some((s) => s.meetsRequirement)) {
    const topSkills = matchedSkills
      .filter((s) => s.meetsRequirement)
      .map((s) => `${s.name} (Lvl ${s.candidateProf})`)
      .join(', ');
    reasons.push(`Meets proficiency for: ${topSkills}`);
  }

  if (employee.experience >= reqExp) {
    reasons.push(`${employee.experience} yrs industry experience exceeds requirement (${reqExp} yrs)`);
  }

  if (employee.remainingCapacity >= targetEffortPerMember) {
    reasons.push(`Has ${employee.remainingCapacity}h/wk free capacity (required: ${targetEffortPerMember}h)`);
  }

  // Warnings
  if (employee.availabilityStatus === 'on-leave') {
    warnings.push(`Currently on leave (${employee.leaveStartDate || 'Pending'} to ${employee.leaveEndDate || 'Pending'}). Not eligible for immediate assignment.`);
  } else if (employee.availabilityStatus === 'unavailable') {
    warnings.push(`Marked as completely unavailable by resource management.`);
  }

  if (employee.remainingCapacity < 0) {
    warnings.push(`Overallocated by ${Math.abs(employee.remainingCapacity)}h (${Math.round(utilization)}% utilization). Cannot take additional projects.`);
  } else if (employee.remainingCapacity < targetEffortPerMember && employee.remainingCapacity > 0) {
    warnings.push(`Limited remaining capacity: only ${employee.remainingCapacity}h/wk available vs ${targetEffortPerMember}h needed.`);
  }

  if (missingSkills.length > 0) {
    warnings.push(`Missing ${missingSkills.length} required skill(s): ${missingSkills.map((s) => s.name).join(', ')}`);
  }

  if (underdevelopedSkills.length > 0) {
    warnings.push(
      `Underdeveloped skill(s): ${underdevelopedSkills
        .map((s) => `${s.name} (has ${s.candidateProf}, requires ${s.requiredProf})`)
        .join(', ')}`
    );
  }

  return {
    employee,
    overallScore: normalizedOverall,
    breakdown: {
      skillScore,
      experienceScore,
      availabilityScore,
      workloadScore,
    },
    matchedSkills,
    missingSkills,
    underdevelopedSkills,
    reasons,
    warnings,
    isAvailable,
    hasCapacity,
    feasibleHours,
  };
}

/**
 * Ranks all employees for a project according to the explainable scoring criteria.
 */
export function rankCandidates(
  employees: Employee[],
  project: Project,
  weights: AlgorithmWeights = DEFAULT_WEIGHTS
): CandidateMatchResult[] {
  const evaluated = employees.map((emp) => evaluateCandidate(emp, project, weights));

  // Sort by overallScore descending, breaking ties by availability, then skill score, then experience
  return evaluated.sort((a, b) => {
    // If one is on-leave/unavailable and the other is available, prioritize available candidate
    if (a.isAvailable !== b.isAvailable) {
      return a.isAvailable ? -1 : 1;
    }
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    if (b.breakdown.skillScore !== a.breakdown.skillScore) {
      return b.breakdown.skillScore - a.breakdown.skillScore;
    }
    return b.employee.experience - a.employee.experience;
  });
}

/**
 * Computes collective skill coverage and stats for a given subset of candidates.
 */
export function evaluateTeamCoverage(
  members: CandidateMatchResult[],
  project: Project
): {
  coveragePercentage: number;
  coveredSkills: string[];
  uncoveredSkills: RequiredSkill[];
  totalAllocatedHours: number;
  remainingCapacityTotal: number;
  averageExperience: number;
  averageMatchScore: number;
} {
  const coveredSkillsSet = new Set<string>();
  const uncoveredSkills: RequiredSkill[] = [];

  for (const req of project.requiredSkills) {
    const isCovered = members.some((m) =>
      m.employee.skills.some(
        (s) =>
          s.name.toLowerCase().trim() === req.name.toLowerCase().trim() &&
          s.proficiency >= req.minProficiency
      )
    );

    if (isCovered) {
      coveredSkillsSet.add(req.name);
    } else {
      uncoveredSkills.push(req);
    }
  }

  const coveragePercentage =
    project.requiredSkills.length > 0
      ? Math.round((coveredSkillsSet.size / project.requiredSkills.length) * 100)
      : 100;

  const totalAllocatedHours = members.reduce((sum, m) => sum + m.employee.allocatedHours, 0);
  const remainingCapacityTotal = members.reduce((sum, m) => sum + Math.max(0, m.employee.remainingCapacity), 0);
  const averageExperience =
    members.length > 0
      ? Number((members.reduce((sum, m) => sum + m.employee.experience, 0) / members.length).toFixed(1))
      : 0;
  const averageMatchScore =
    members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.overallScore, 0) / members.length)
      : 0;

  return {
    coveragePercentage,
    coveredSkills: Array.from(coveredSkillsSet),
    uncoveredSkills,
    totalAllocatedHours,
    remainingCapacityTotal,
    averageExperience,
    averageMatchScore,
  };
}

/**
 * Automatically composes recommended team & feasible alternative combinations.
 */
export function buildTeamCompositions(
  allEmployees: Employee[],
  project: Project,
  weights: AlgorithmWeights = DEFAULT_WEIGHTS
): TeamComposition[] {
  const ranked = rankCandidates(allEmployees, project, weights);
  const teamSize = project.teamSize || 3;
  const targetEffort = project.weeklyEffortRequired || (teamSize * 20);

  // Available candidate pool (has capacity and not on leave)
  const eligiblePool = ranked.filter((c) => c.isAvailable && c.employee.remainingCapacity > 0);

  // 1. PRIMARY OPTIMAL COMPOSITION
  // Greedy selection that maximizes incremental skill coverage first, then capacity & score
  const selectedPrimary: CandidateMatchResult[] = [];
  const coveredSkills = new Set<string>();
  const poolCopy = [...eligiblePool];

  while (selectedPrimary.length < teamSize && poolCopy.length > 0) {
    // Find candidate who adds most uncovered required skills
    let bestIndex = 0;
    let maxNewSkills = -1;
    let highestScore = -1;

    for (let i = 0; i < poolCopy.length; i++) {
      const candidate = poolCopy[i];
      let newSkillsCount = 0;
      for (const req of project.requiredSkills) {
        if (!coveredSkills.has(req.name)) {
          const hasIt = candidate.employee.skills.some(
            (s) =>
              s.name.toLowerCase().trim() === req.name.toLowerCase().trim() &&
              s.proficiency >= req.minProficiency
          );
          if (hasIt) newSkillsCount++;
        }
      }

      if (
        newSkillsCount > maxNewSkills ||
        (newSkillsCount === maxNewSkills && candidate.overallScore > highestScore)
      ) {
        maxNewSkills = newSkillsCount;
        highestScore = candidate.overallScore;
        bestIndex = i;
      }
    }

    const chosen = poolCopy.splice(bestIndex, 1)[0];
    selectedPrimary.push(chosen);
    for (const req of project.requiredSkills) {
      if (
        chosen.employee.skills.some(
          (s) =>
            s.name.toLowerCase().trim() === req.name.toLowerCase().trim() &&
            s.proficiency >= req.minProficiency
        )
      ) {
        coveredSkills.add(req.name);
      }
    }
  }

  // If pool was smaller than team size, backfill with top available or warn
  if (selectedPrimary.length < teamSize && ranked.length > 0) {
    for (const r of ranked) {
      if (selectedPrimary.length >= teamSize) break;
      if (!selectedPrimary.some((m) => m.employee.id === r.employee.id)) {
        selectedPrimary.push(r);
      }
    }
  }

  const primaryStats = evaluateTeamCoverage(selectedPrimary, project);
  const primaryFeasibleHours = selectedPrimary.reduce((acc, m) => acc + Math.max(0, m.employee.remainingCapacity), 0);
  const isPrimaryOptimal = primaryStats.coveragePercentage === 100 && primaryFeasibleHours >= targetEffort;

  const compositions: TeamComposition[] = [];

  compositions.push({
    id: 'primary-optimal',
    title: 'Primary Recommended Team',
    description: isPrimaryOptimal 
      ? 'Optimal complementary skill coverage with verified weekly capacity.' 
      : 'Best matching composition available under current staff capacity.',
    members: selectedPrimary,
    coveragePercentage: primaryStats.coveragePercentage,
    coveredSkills: primaryStats.coveredSkills,
    uncoveredSkills: primaryStats.uncoveredSkills,
    totalAllocatedHours: primaryStats.totalAllocatedHours,
    remainingCapacityTotal: primaryStats.remainingCapacityTotal,
    averageExperience: primaryStats.averageExperience,
    averageMatchScore: primaryStats.averageMatchScore,
    isOptimal: isPrimaryOptimal,
    tradeoffs: [
      primaryStats.coveragePercentage === 100
        ? 'Full skill coverage achieved across all project requirements.'
        : `Lacks complete coverage: ${primaryStats.uncoveredSkills.map((s) => s.name).join(', ')} missing.`,
      `Combined free capacity: ${primaryFeasibleHours}h/wk (Required: ${targetEffort}h/wk)`,
      `Average team experience: ${primaryStats.averageExperience} years.`,
    ],
  });

  // 2. ALTERNATIVE A: "Maximum Capacity & Availability"
  // Prioritize candidates with lowest utilization and highest remaining hours
  const capacityPool = [...eligiblePool].sort(
    (a, b) => b.employee.remainingCapacity - a.employee.remainingCapacity
  );
  const capacityMembers: CandidateMatchResult[] = [];
  for (const c of capacityPool) {
    if (capacityMembers.length >= teamSize) break;
    capacityMembers.push(c);
  }

  if (capacityMembers.length === teamSize && !arraysEqual(capacityMembers, selectedPrimary)) {
    const capStats = evaluateTeamCoverage(capacityMembers, project);
    compositions.push({
      id: 'alt-capacity-first',
      title: 'High-Capacity Alternative',
      description: 'Prioritizes members with maximum free bandwidth to reduce burnout risk.',
      members: capacityMembers,
      coveragePercentage: capStats.coveragePercentage,
      coveredSkills: capStats.coveredSkills,
      uncoveredSkills: capStats.uncoveredSkills,
      totalAllocatedHours: capStats.totalAllocatedHours,
      remainingCapacityTotal: capStats.remainingCapacityTotal,
      averageExperience: capStats.averageExperience,
      averageMatchScore: capStats.averageMatchScore,
      isOptimal: capStats.coveragePercentage === 100,
      tradeoffs: [
        `High bandwidth cushion (${capStats.remainingCapacityTotal}h available).`,
        capStats.coveragePercentage < 100 
          ? `Trade-off: Skill coverage is ${capStats.coveragePercentage}% (${capStats.uncoveredSkills.map(s => s.name).join(', ')} uncovered)` 
          : 'Full skill requirements satisfied.',
        `Average match score: ${capStats.averageMatchScore}/100.`,
      ],
    });
  }

  // 3. ALTERNATIVE B: "Senior Specialization"
  // Prioritize high experience and skill depth
  const seniorPool = [...ranked].sort((a, b) => {
    if (b.employee.experience !== a.employee.experience) {
      return b.employee.experience - a.employee.experience;
    }
    return b.breakdown.skillScore - a.breakdown.skillScore;
  });
  const seniorMembers: CandidateMatchResult[] = [];
  for (const c of seniorPool) {
    if (seniorMembers.length >= teamSize) break;
    seniorMembers.push(c);
  }

  if (
    seniorMembers.length === teamSize &&
    !arraysEqual(seniorMembers, selectedPrimary) &&
    !compositions.some((comp) => arraysEqual(comp.members, seniorMembers))
  ) {
    const senStats = evaluateTeamCoverage(seniorMembers, project);
    compositions.push({
      id: 'alt-senior-depth',
      title: 'Senior Specialist Alternative',
      description: 'Leverages senior architects for high-complexity architecture and technical velocity.',
      members: seniorMembers,
      coveragePercentage: senStats.coveragePercentage,
      coveredSkills: senStats.coveredSkills,
      uncoveredSkills: senStats.uncoveredSkills,
      totalAllocatedHours: senStats.totalAllocatedHours,
      remainingCapacityTotal: senStats.remainingCapacityTotal,
      averageExperience: senStats.averageExperience,
      averageMatchScore: senStats.averageMatchScore,
      isOptimal: senStats.coveragePercentage === 100,
      tradeoffs: [
        `Elevated average experience of ${senStats.averageExperience} years.`,
        seniorMembers.some((m) => !m.isAvailable)
          ? 'Warning: Includes team members currently tight on schedule or nearing capacity limit.'
          : 'High delivery velocity with senior oversight.',
        `Skill coverage: ${senStats.coveragePercentage}%.`,
      ],
    });
  }

  return compositions;
}

function arraysEqual(a: CandidateMatchResult[], b: CandidateMatchResult[]): boolean {
  if (a.length !== b.length) return false;
  const aIds = a.map((x) => x.employee.id).sort().join(',');
  const bIds = b.map((x) => x.employee.id).sort().join(',');
  return aIds === bIds;
}

/**
 * Intelligent Workload Balancing Engine:
 * Identifies overallocated employees and proposes safe shifts to qualified underutilized peers.
 */
export function generateWorkloadRebalanceProposals(
  employees: Employee[],
  projects: Project[]
): RebalanceProposal[] {
  const proposals: RebalanceProposal[] = [];

  // Overallocated employees (> 100% or remainingCapacity < 0)
  const overallocated = employees.filter(
    (e) => e.allocatedHours > e.weeklyCapacity || e.remainingCapacity < 0
  );

  for (const overEmp of overallocated) {
    const excessHours = Math.max(overEmp.allocatedHours - overEmp.weeklyCapacity, 6);

    // Look at projects overEmp is assigned to
    for (const assignment of overEmp.currentProjectAssignments) {
      if (excessHours <= 0) break;
      const project = projects.find((p) => p.id === assignment.projectId);
      if (!project) continue;

      // Find an underutilized peer (< 70% utilization) who has skills matching project requirements
      const candidatePeers = employees.filter((peer) => {
        if (peer.id === overEmp.id) return false;
        if (peer.availabilityStatus !== 'available') return false;
        if (peer.remainingCapacity < 6) return false;
        const peerUtil = (peer.allocatedHours / peer.weeklyCapacity) * 100;
        if (peerUtil >= 75) return false;

        // Check if peer has at least 1-2 skills relevant to this project
        const hasRelevantSkill = project.requiredSkills.some((req) =>
          peer.skills.some((s) => s.name.toLowerCase() === req.name.toLowerCase() && s.proficiency >= 3)
        );
        return hasRelevantSkill;
      });

      // Sort candidate peers by highest remaining capacity and skill match
      candidatePeers.sort((a, b) => b.remainingCapacity - a.remainingCapacity);

      if (candidatePeers.length > 0) {
        const peer = candidatePeers[0];
        const hoursToShift = Math.min(excessHours, Math.min(assignment.hoursPerWeek, peer.remainingCapacity, 10));

        if (hoursToShift >= 4) {
          const fromBeforeUtil = Math.round((overEmp.allocatedHours / overEmp.weeklyCapacity) * 100);
          const fromAfterUtil = Math.round(((overEmp.allocatedHours - hoursToShift) / overEmp.weeklyCapacity) * 100);

          const toBeforeUtil = Math.round((peer.allocatedHours / peer.weeklyCapacity) * 100);
          const toAfterUtil = Math.round(((peer.allocatedHours + hoursToShift) / peer.weeklyCapacity) * 100);

          const matchedSkills = project.requiredSkills
            .filter((req) => peer.skills.some((s) => s.name.toLowerCase() === req.name.toLowerCase()))
            .map((s) => s.name);

          proposals.push({
            id: `reb-${overEmp.id}-${peer.id}-${project.id}`,
            fromEmployeeId: overEmp.id,
            toEmployeeId: peer.id,
            projectId: project.id,
            projectName: project.name,
            hours: hoursToShift,
            rationale: `Transfer ${hoursToShift}h/wk of '${assignment.role}' duties on ${project.name} from ${overEmp.name} (${fromBeforeUtil}% util) to ${peer.name} (${toBeforeUtil}% util). Reduces burnout risk while fully preserving technical capabilities.`,
            skillsMatched: matchedSkills,
            fromEmployeeBeforeUtilization: fromBeforeUtil,
            fromEmployeeAfterUtilization: fromAfterUtil,
            toEmployeeBeforeUtilization: toBeforeUtil,
            toEmployeeAfterUtilization: toAfterUtil,
          });
        }
      }
    }
  }

  return proposals;
}
