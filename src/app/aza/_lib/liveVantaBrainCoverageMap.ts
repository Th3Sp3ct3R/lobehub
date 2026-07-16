import { scanDirectoryBounded } from './boundedDirectoryScan';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './liveMemoryMap';

type ProjectionEntryKind = 'directory' | 'file' | 'other';
type CoverageStatus = 'covered' | 'missing' | 'partial' | 'stale' | 'unverified';
type GapSeverity = 'high' | 'low' | 'medium';

type CoverageTargetDefinition = {
  evidence: string[];
  expectedSourceRootIds: string[];
  id: string;
  label: string;
  minimumSignals: number;
  nextAction: string;
  projectionSignals: string[];
  recordTypes: string[];
};

export type VantaBrainProjectionEntry = {
  childDirectoryCount: number;
  childFileCount: number;
  kind: ProjectionEntryKind;
  modifiedAt: string | null;
  name: string;
  path: string;
  representativeChildren: string[];
};

export type VantaBrainCoverageTarget = {
  evidence: string[];
  expectedSourceRoots: Array<{
    id: string;
    path: string;
    present: boolean;
  }>;
  gap: string;
  id: string;
  label: string;
  matchedProjectionSignals: string[];
  nextAction: string;
  projectionSignals: string[];
  recordTypes: string[];
  status: CoverageStatus;
};

export type VantaBrainCoverageGap = {
  blockedBy: string[];
  evidence: string[];
  id: string;
  label: string;
  nextAction: string;
  severity: GapSeverity;
};

export type AzaLiveVantaBrainCoverageMap = {
  answer: {
    conclusion: string;
    coverageTruth: 'partial_projection_only';
    harnessInterpretation: string;
  };
  coverageTargets: VantaBrainCoverageTarget[];
  generatedAt: string;
  gaps: VantaBrainCoverageGap[];
  mode: 'read_only_vanta_brain_coverage_map';
  projectionEntries: VantaBrainProjectionEntry[];
  projectionRoot: {
    exists: boolean;
    modifiedAt: string | null;
    path: string;
    scanIssue: string | null;
    scanTimedOut: boolean;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    coveredTargets: number;
    coverageTargets: number;
    directProjectionDirectories: number;
    directProjectionFiles: number;
    missingTargets: number;
    partialTargets: number;
    projectionEntryCount: number;
    projectionScanBlocked: boolean;
    projectionScanTimedOut: boolean;
    rootPresent: boolean;
    sourceRootsPresent: number;
    sourceRootsTotal: number;
    staleTargets: number;
    writesAllowed: false;
  };
};

const VANTA_BRAIN_ROOT = '/Users/growthgod/Documents/VANTA-Brain';
const MAX_DIRECT_ENTRIES = 220;
const STALE_WINDOW_DAYS = 30;
const STALE_WINDOW_MS = STALE_WINDOW_DAYS * 24 * 60 * 60 * 1000;

const COVERAGE_TARGETS: CoverageTargetDefinition[] = [
  {
    evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-memory-map'],
    expectedSourceRootIds: ['vanta-brain'],
    id: 'documentation',
    label: 'Documentation coverage',
    minimumSignals: 3,
    nextAction:
      'Keep docs as reviewed projections, then attach canonical AzA ids before any future sync writes.',
    projectionSignals: [
      'docs',
      'Architecture',
      '03-architecture',
      'Research',
      'README.md',
      'AGENT_ARCHITECTURE.md',
      'COLLABORATOR_ONBOARDING.md',
    ],
    recordTypes: ['documentation', 'architecture_note', 'decision', 'project_summary'],
  },
  {
    evidence: ['/aza/agent-memory-skill-inventory.json', '/aza/live-memory-map'],
    expectedSourceRootIds: ['hermes-agents', 'vanta-brain'],
    id: 'agents',
    label: 'Agent directory coverage',
    minimumSignals: 2,
    nextAction:
      'Cross-link each agent projection to its runtime source path, role, allowed readers, and owner.',
    projectionSignals: ['02-agents', 'Agents', 'agent-archive', 'Orchestrators', 'openclaw/agents'],
    recordTypes: ['agent', 'agent_profile', 'access_profile'],
  },
  {
    evidence: ['/aza/agent-memory-skill-inventory.json', '/aza/live-memory-map'],
    expectedSourceRootIds: ['agent-skills', 'codex-skills', 'hermes-skills'],
    id: 'skills',
    label: 'Skill catalog coverage',
    minimumSignals: 2,
    nextAction:
      'Create metadata-only skill records in AzA before projecting a dedicated VANTA-Brain skill index.',
    projectionSignals: ['Skills', 'skills', 'MCP', '02-agents', 'Agents', 'templates'],
    recordTypes: ['skill', 'capability', 'tooling_instruction'],
  },
  {
    evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-memory-map'],
    expectedSourceRootIds: ['codex-memories', 'hermes-sessions', 'vanta-brain'],
    id: 'sessions',
    label: 'Session summary coverage',
    minimumSignals: 2,
    nextAction:
      'Promote session summaries with source agent, session id, sensitivity, and evidence instead of raw transcripts.',
    projectionSignals: ['04-sessions', '04-sessions/distilled', '04-sessions/lobe', 'Daily'],
    recordTypes: ['session', 'session_summary', 'evidence_receipt'],
  },
  {
    evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-memory-map'],
    expectedSourceRootIds: ['codex-memories', 'hermes-memories', 'vanta-brain'],
    id: 'memories',
    label: 'Runtime memory coverage',
    minimumSignals: 2,
    nextAction:
      'Treat VANTA-Brain memory folders as projections until AzA canonical memory records and retrieval are live.',
    projectionSignals: ['Memory', 'odysseus/memory', 'logs/session-memory', '_system/hermes-sync'],
    recordTypes: ['memory_source', 'memory_summary', 'projection_pointer'],
  },
  {
    evidence: ['/aza/van-project-root-inventory.json', '/aza/live-project-map'],
    expectedSourceRootIds: ['vanta-brain'],
    id: 'projects',
    label: 'Project and product coverage',
    minimumSignals: 3,
    nextAction:
      'Resolve each project folder to one owner, source repo, runtime path, status, and current next action.',
    projectionSignals: ['01-projects', 'Projects', '08-gitgod/repos', '_repos', 'docs/projects'],
    recordTypes: ['project', 'product', 'repo_pointer', 'artifact'],
  },
];

const normalizeSignal = (value: string) =>
  value.replaceAll('\\', '/').replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();

const scanProjectionEntries = async (): Promise<{
  entries: VantaBrainProjectionEntry[];
  rootExists: boolean;
  rootModifiedAt: string | null;
  scanIssue: string | null;
  scanTimedOut: boolean;
}> => {
  const scan = await scanDirectoryBounded({
    maxEntries: MAX_DIRECT_ENTRIES,
    root: VANTA_BRAIN_ROOT,
    timeoutMs: 1500,
  });

  return {
    entries: scan.entries.map((entry) => ({
      childDirectoryCount: 0,
      childFileCount: 0,
      kind: entry.kind,
      modifiedAt: entry.modifiedAt,
      name: entry.name,
      path: entry.path,
      representativeChildren: [],
    })),
    rootExists: scan.rootExists,
    rootModifiedAt: scan.rootModifiedAt,
    scanIssue: scan.error,
    scanTimedOut: scan.timedOut,
  };
};

const buildSignalIndex = (entries: VantaBrainProjectionEntry[]) => {
  const index = new Set<string>();

  for (const entry of entries) {
    index.add(normalizeSignal(entry.name));

    for (const child of entry.representativeChildren) {
      index.add(normalizeSignal(`${entry.name}/${child}`));
    }
  }

  return index;
};

const resolveExpectedSourceRoots = (
  memoryMap: AzaLiveMemoryMap,
  expectedSourceRootIds: string[],
): VantaBrainCoverageTarget['expectedSourceRoots'] =>
  expectedSourceRootIds.map((id) => {
    const root = memoryMap.roots.find((candidate) => candidate.id === id);

    return {
      id,
      path: root?.path ?? 'not found in live memory map',
      present: root?.status === 'present',
    };
  });

const isTargetStale = (
  entries: VantaBrainProjectionEntry[],
  matchedSignals: string[],
  signalIndex: Set<string>,
) => {
  const cutoff = Date.now() - STALE_WINDOW_MS;
  const matchedTopLevelNames = new Set(
    matchedSignals.map((signal) => normalizeSignal(signal).split('/')[0]),
  );
  const matchedEntries = entries.filter((entry) =>
    matchedTopLevelNames.has(normalizeSignal(entry.name)),
  );

  if (matchedEntries.length === 0) return false;

  return matchedEntries.every((entry) => {
    if (!entry.modifiedAt) return true;
    if (!signalIndex.has(normalizeSignal(entry.name))) return false;

    return new Date(entry.modifiedAt).getTime() < cutoff;
  });
};

const buildCoverageTargets = (
  memoryMap: AzaLiveMemoryMap,
  entries: VantaBrainProjectionEntry[],
  rootExists: boolean,
): VantaBrainCoverageTarget[] => {
  const signalIndex = buildSignalIndex(entries);

  return COVERAGE_TARGETS.map((target) => {
    const expectedSourceRoots = resolveExpectedSourceRoots(memoryMap, target.expectedSourceRootIds);
    const matchedProjectionSignals = target.projectionSignals.filter((signal) =>
      signalIndex.has(normalizeSignal(signal)),
    );
    const sourceRootsPresent = expectedSourceRoots.filter((root) => root.present).length;
    const hasMinimumSignals = matchedProjectionSignals.length >= target.minimumSignals;
    const hasAllSources = sourceRootsPresent === expectedSourceRoots.length;
    const stale = isTargetStale(entries, matchedProjectionSignals, signalIndex);
    let status: CoverageStatus = 'missing';
    let gap = 'Projection root is missing.';

    if (rootExists && hasMinimumSignals && hasAllSources && !stale) {
      status = 'covered';
      gap =
        'Projection signals and source roots are present, but this still proves structure only, not complete canonical sync.';
    } else if (rootExists && matchedProjectionSignals.length > 0) {
      status = stale ? 'stale' : 'partial';
      gap = hasAllSources
        ? 'Projection exists but needs canonical AzA record ids, freshness proof, and access metadata.'
        : 'Projection exists, but at least one expected source root is missing from the live memory map.';
    } else if (rootExists && sourceRootsPresent > 0) {
      status = 'unverified';
      gap = 'Source roots exist, but no matching VANTA-Brain projection signal was found.';
    }

    return {
      evidence: target.evidence,
      expectedSourceRoots,
      gap,
      id: target.id,
      label: target.label,
      matchedProjectionSignals,
      nextAction: target.nextAction,
      projectionSignals: target.projectionSignals,
      recordTypes: target.recordTypes,
      status,
    };
  });
};

const buildCoverageGaps = (
  targets: VantaBrainCoverageTarget[],
  memoryMap: AzaLiveMemoryMap,
  projectionScan: {
    rootExists: boolean;
    scanIssue: string | null;
    scanTimedOut: boolean;
  },
): VantaBrainCoverageGap[] => {
  const gaps: VantaBrainCoverageGap[] = [
    {
      blockedBy: ['canonical AzA API/MCP health', 'durable store verification'],
      evidence: ['/aza/live-readiness', '/aza/live-canonical-store'],
      id: 'no_canonical_sync_proof',
      label: 'VANTA-Brain does not prove 100% live logging',
      nextAction:
        'Verify AzA canonical records first, then project reviewed summaries to VANTA-Brain with source ids.',
      severity: 'high',
    },
    {
      blockedBy: ['schema and access labels for skill records'],
      evidence: ['/aza/live-memory-map', '/aza/live-agent-access-matrix'],
      id: 'skill_projection_not_dedicated',
      label: 'Skill coverage is metadata-only until a dedicated AzA skill index exists',
      nextAction:
        'Index skill metadata, owner, source path, capability, allowed readers, and version before copying any skill body.',
      severity: 'medium',
    },
    {
      blockedBy: ['projection approval'],
      evidence: ['/aza/aza-read-write-contract.json'],
      id: 'projection_writes_blocked',
      label: 'Projection writes remain blocked by user instruction',
      nextAction:
        'Keep VANTA-Brain read-only until a specific projection target is approved after redaction.',
      severity: 'high',
    },
  ];
  const staleTargets = targets.filter((target) => target.status === 'stale');

  if (projectionScan.rootExists && (projectionScan.scanTimedOut || projectionScan.scanIssue)) {
    gaps.push({
      blockedBy: ['direct directory enumeration is timing out or blocked'],
      evidence: ['/aza/live-vanta-brain-coverage', '/aza/live-memory-map'],
      id: 'projection_scan_blocked',
      label: 'VANTA-Brain direct scan is blocked',
      nextAction:
        'Repair or relocate the projection vault path before treating it as reliable command-center context.',
      severity: 'high',
    });
  }

  if (staleTargets.length > 0) {
    gaps.push({
      blockedBy: staleTargets.map((target) => target.label),
      evidence: staleTargets.flatMap((target) => target.evidence),
      id: 'stale_projection_signals',
      label: 'Some projection folders look stale from metadata',
      nextAction:
        'Refresh only after canonical records and an approved projection plan exist; do not write directly to VANTA-Brain.',
      severity: 'medium',
    });
  }

  if (memoryMap.summary.projectionVaultFiles === 0) {
    gaps.push({
      blockedBy: ['missing or empty VANTA-Brain projection root'],
      evidence: ['/aza/live-memory-map'],
      id: 'empty_projection_vault',
      label: 'Projection vault has no visible files in the live memory map',
      nextAction:
        'Verify the projection root path before trusting VANTA-Brain as readable context.',
      severity: 'high',
    });
  }

  return gaps;
};

export const getAzaLiveVantaBrainCoverageMap = async ({
  memoryMap,
}: {
  memoryMap?: AzaLiveMemoryMap;
} = {}): Promise<AzaLiveVantaBrainCoverageMap> => {
  const liveMemoryMap = memoryMap ?? (await getAzaLiveMemoryMap());
  const projectionScan = await scanProjectionEntries();
  const coverageTargets = buildCoverageTargets(
    liveMemoryMap,
    projectionScan.entries,
    projectionScan.rootExists,
  );
  const sourceRootIds = new Set(COVERAGE_TARGETS.flatMap((target) => target.expectedSourceRootIds));
  const sourceRoots = [...sourceRootIds]
    .map((id) => liveMemoryMap.roots.find((root) => root.id === id))
    .filter((root): root is NonNullable<typeof root> => Boolean(root));

  return {
    answer: {
      conclusion:
        'VANTA-Brain has real projection structure for documentation, agents, sessions, memories, and projects, but it is not proven as a complete or canonical logger for every agent memory, skill, or session.',
      coverageTruth: 'partial_projection_only',
      harnessInterpretation:
        'LobeHub should read VANTA-Brain as a human-readable projection vault while Codex and Hermes keep granular runtime state and AzA becomes the canonical typed brain.',
    },
    coverageTargets,
    generatedAt: new Date().toISOString(),
    gaps: buildCoverageGaps(coverageTargets, liveMemoryMap, projectionScan),
    mode: 'read_only_vanta_brain_coverage_map',
    projectionEntries: projectionScan.entries,
    projectionRoot: {
      exists: projectionScan.rootExists,
      modifiedAt: projectionScan.rootModifiedAt,
      path: VANTA_BRAIN_ROOT,
      scanIssue: projectionScan.scanIssue,
      scanTimedOut: projectionScan.scanTimedOut,
    },
    safety: {
      captured: [
        'projection root existence',
        'top-level folder and file names',
        'one-level child names',
        'directory counts',
        'file counts',
        'modified times',
        'scan timeout status',
        'coverage target status',
        'expected source root ids and paths',
      ],
      excluded: [
        'raw markdown contents',
        'raw session transcripts',
        'raw skill bodies',
        'database contents',
        'browser tabs',
        'private messages',
        'secrets',
        'tokens',
        'cookies',
        'credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      coveredTargets: coverageTargets.filter((target) => target.status === 'covered').length,
      coverageTargets: coverageTargets.length,
      directProjectionDirectories: projectionScan.entries.filter(
        (entry) => entry.kind === 'directory',
      ).length,
      directProjectionFiles: projectionScan.entries.filter((entry) => entry.kind === 'file').length,
      missingTargets: coverageTargets.filter((target) => target.status === 'missing').length,
      partialTargets: coverageTargets.filter((target) => target.status === 'partial').length,
      projectionEntryCount: projectionScan.entries.length,
      projectionScanBlocked: Boolean(projectionScan.scanIssue),
      projectionScanTimedOut: projectionScan.scanTimedOut,
      rootPresent: projectionScan.rootExists,
      sourceRootsPresent: sourceRoots.filter((root) => root.status === 'present').length,
      sourceRootsTotal: sourceRootIds.size,
      staleTargets: coverageTargets.filter((target) => target.status === 'stale').length,
      writesAllowed: false,
    },
  };
};
