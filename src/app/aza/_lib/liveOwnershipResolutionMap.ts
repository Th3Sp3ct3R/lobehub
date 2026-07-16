import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import { type AzaLiveSystemMap, getAzaLiveSystemMap, type SystemRootCheck } from './liveSystemMap';

type OwnershipStatus =
  | 'approval_required'
  | 'blocked'
  | 'canonical_target'
  | 'inventory_only'
  | 'projection_read_only'
  | 'runtime_native'
  | 'source_of_truth';

export type OwnershipDecision = {
  canonicalOwner: string;
  evidence: string[];
  id: string;
  layer: string;
  nextAction: string;
  path: string;
  readPolicy: string;
  role: string;
  status: OwnershipStatus;
  writePolicy: string;
};

export type OwnershipConflict = {
  decision: string;
  evidence: string[];
  id: string;
  nextAction: string;
  status: 'blocked' | 'needs_reconciliation' | 'resolved_by_policy';
};

export type OwnershipWriteLane = {
  allowedNow: boolean;
  approval: string;
  evidence: string[];
  id: string;
  target: string;
};

export type AzaLiveOwnershipResolutionMap = {
  conflicts: OwnershipConflict[];
  decisions: OwnershipDecision[];
  generatedAt: string;
  mode: 'read_only_live_ownership_resolution_map';
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    approvalRequiredDecisions: number;
    blockedDecisions: number;
    conflicts: number;
    canonicalTargets: number;
    projectionReadOnlyRoots: number;
    rootDecisions: number;
    runtimeNativeRoots: number;
    sourceOfTruthRoots: number;
    writeLanes: number;
    writesAllowed: false;
  };
  writeLanes: OwnershipWriteLane[];
};

const rootById = (systemMap: AzaLiveSystemMap, id: string) =>
  systemMap.rootChecks.find((root) => root.id === id);

const rootDecision = ({
  canonicalOwner,
  evidence,
  id,
  layer,
  nextAction,
  readPolicy,
  root,
  status,
  writePolicy,
}: {
  canonicalOwner: string;
  evidence: string[];
  id: string;
  layer: string;
  nextAction: string;
  readPolicy: string;
  root: SystemRootCheck | undefined;
  status: OwnershipStatus;
  writePolicy: string;
}): OwnershipDecision => ({
  canonicalOwner,
  evidence,
  id,
  layer,
  nextAction,
  path: root?.path ?? 'missing',
  readPolicy,
  role: root?.role ?? 'Root missing from live system map.',
  status: root?.exists ? status : 'blocked',
  writePolicy,
});

const buildDecisions = (
  systemMap: AzaLiveSystemMap,
  commandGateMap: AzaLiveCommandGateMap,
): OwnershipDecision[] => [
  rootDecision({
    canonicalOwner: 'LobeHub harness',
    evidence: ['/aza/live-system-map', '/aza/aza-read-write-contract.json'],
    id: 'lobehub_harness',
    layer: 'command_surface',
    nextAction:
      'Keep AzA command-center UI, approvals, route catalog, and read-only adapters here.',
    readPolicy:
      'May read safe inventories, live maps, route health, artifact metadata, and approved evidence.',
    root: rootById(systemMap, 'lobehub'),
    status: 'source_of_truth',
    writePolicy:
      'Scoped AzA harness edits only after organization is explained and validation is run.',
  }),
  rootDecision({
    canonicalOwner: 'VAN active runtime workspace',
    evidence: ['/aza/live-project-map', '/aza/live-command-gates'],
    id: 'van_runtime_workspace',
    layer: 'active_runtime',
    nextAction:
      'Treat as the implementation/runtime source, but require target, reason, rollback, and approval before writes.',
    readPolicy:
      'May inventory top-level metadata and safe markers; raw contents and secrets stay excluded.',
    root: rootById(systemMap, 'van'),
    status: 'approval_required',
    writePolicy:
      commandGateMap.gates.find((gate) => gate.id === 'van_filesystem_writes')?.reason ??
      'VAN writes require explicit approval.',
  }),
  rootDecision({
    canonicalOwner: 'AzA canonical brain target',
    evidence: ['/aza/live-readiness', '/aza/live-command-gates', '/aza/live-brain-topology'],
    id: 'aza_memory_canonical_target',
    layer: 'canonical_memory',
    nextAction:
      'Start writes only after AzA API, MCP, durable store, schema, redaction, rollback, and approval gates are verified.',
    readPolicy:
      'May probe expected health ports and describe schema/readiness; live record reads are blocked.',
    root: rootById(systemMap, 'aza-memory'),
    status: 'canonical_target',
    writePolicy:
      commandGateMap.gates.find((gate) => gate.id === 'canonical_aza_writes')?.reason ??
      'Canonical writes are blocked.',
  }),
  rootDecision({
    canonicalOwner: 'VANTA-Brain projection vault',
    evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-command-gates'],
    id: 'vanta_brain_projection',
    layer: 'projection',
    nextAction:
      'Keep read-only until canonical AzA records exist, redaction passes, and a projection destination is approved.',
    readPolicy: 'May inventory markdown/file metadata and coverage evidence only.',
    root: rootById(systemMap, 'vanta-brain'),
    status: 'projection_read_only',
    writePolicy:
      commandGateMap.gates.find((gate) => gate.id === 'vanta_brain_projection')?.reason ??
      'Projection is blocked for this pass.',
  }),
  rootDecision({
    canonicalOwner: 'Codex executor runtime',
    evidence: ['/aza/live-memory-map', '/aza/live-brain-topology'],
    id: 'codex_runtime_state',
    layer: 'executor_memory',
    nextAction: 'Promote only durable facts, decisions, artifacts, and evidence pointers into AzA.',
    readPolicy: 'May use Codex goal, skill, rollout, and memory metadata for routing and evidence.',
    root: rootById(systemMap, 'codex-state'),
    status: 'runtime_native',
    writePolicy: 'Runtime-native; do not project raw local state directly to VANTA-Brain.',
  }),
  rootDecision({
    canonicalOwner: 'Agent skill library',
    evidence: ['/aza/live-memory-map', '/aza/live-brain-topology'],
    id: 'agent_skill_library',
    layer: 'skills',
    nextAction: 'Index skill metadata and allowed agents; avoid bulk-copying raw skill bodies.',
    readPolicy: 'May inventory skill roots and SKILL.md counts.',
    root: rootById(systemMap, 'agents-state'),
    status: 'runtime_native',
    writePolicy: 'Skill edits require a specific target skill and validation plan.',
  }),
  rootDecision({
    canonicalOwner: 'Hermes runtime',
    evidence: ['/aza/live-memory-map', '/aza/live-brain-topology'],
    id: 'hermes_runtime',
    layer: 'agent_runtime',
    nextAction: 'Promote reviewed session summaries and verified task facts into AzA.',
    readPolicy: 'May inventory agents, skills, sessions, and memory metadata.',
    root: rootById(systemMap, 'hermes-state'),
    status: 'runtime_native',
    writePolicy: 'Runtime-native; raw sessions are not global memory by default.',
  }),
  rootDecision({
    canonicalOwner: 'Application inventory',
    evidence: ['/aza/live-app-map', '/aza/live-content-ops'],
    id: 'applications_inventory',
    layer: 'app_surface',
    nextAction:
      'Classify app role, account label, output path, and approval mode before automation.',
    readPolicy:
      'May inventory installed app names, paths, bundle ids, and visible app process names.',
    root: rootById(systemMap, 'applications'),
    status: 'inventory_only',
    writePolicy:
      'No browser, publishing, messaging, buying, device, or account-changing action without approval.',
  }),
  rootDecision({
    canonicalOwner: 'Legacy or alternate runtime inventory',
    evidence: ['/aza/live-service-map', '/aza/live-system-map'],
    id: 'desktop_van_legacy_runtime',
    layer: 'legacy_runtime',
    nextAction:
      'Reconcile Desktop/VAN service ownership before treating it as production or archive material.',
    readPolicy: 'May inventory path presence and listener ownership only.',
    root: rootById(systemMap, 'desktop-van'),
    status: 'inventory_only',
    writePolicy:
      'Do not write until owner, active service role, and migration/archive decision are explicit.',
  }),
];

const buildConflicts = (
  systemMap: AzaLiveSystemMap,
  commandGateMap: AzaLiveCommandGateMap,
): OwnershipConflict[] => [
  {
    decision:
      'LobeHub owns the command-center harness; VAN owns active implementation/runtime code.',
    evidence: ['/aza/live-system-map', '/aza/aza-read-write-contract.json'],
    id: 'lobehub_vs_van',
    nextAction:
      'Keep command UI work in LobeHub; require explicit approval before VAN runtime writes.',
    status:
      commandGateMap.gates.find((gate) => gate.id === 'van_filesystem_writes')?.status ===
      'approval_required'
        ? 'resolved_by_policy'
        : 'needs_reconciliation',
  },
  {
    decision: 'AzA is the canonical brain target; VANTA-Brain is a reviewed projection vault.',
    evidence: ['/aza/live-brain-topology', '/aza/vanta-brain-readonly-audit.json'],
    id: 'aza_memory_vs_vanta_brain',
    nextAction:
      'Do not use VANTA-Brain as raw canonical memory; project only approved AzA summaries after redaction.',
    status: 'resolved_by_policy',
  },
  {
    decision: 'Codex and Hermes keep runtime-native memories; AzA receives promoted durable facts.',
    evidence: ['/aza/live-memory-map', '/aza/live-brain-topology'],
    id: 'runtime_memory_vs_canonical_memory',
    nextAction:
      'Attach agent, session, source, sensitivity, allowed readers, and evidence before promotion.',
    status: 'resolved_by_policy',
  },
  {
    decision:
      'Desktop/VAN appears as legacy or alternate runtime and needs reconciliation with /Users/growthgod/VAN.',
    evidence: ['/aza/live-service-map', '/aza/live-system-map'],
    id: 'desktop_van_vs_van',
    nextAction:
      'Classify any Desktop/VAN services by owner, health route, current task, and migration/archive decision.',
    status: systemMap.rootChecks.find((root) => root.id === 'desktop-van')?.exists
      ? 'needs_reconciliation'
      : 'blocked',
  },
  {
    decision:
      'Installed apps and visible app processes are inventory only until account/action scope is approved.',
    evidence: ['/aza/live-app-map', '/aza/live-content-ops'],
    id: 'apps_vs_automation',
    nextAction:
      'Resolve account labels, output folders, allowed action classes, and approval mode before any app action.',
    status: 'needs_reconciliation',
  },
];

const buildWriteLanes = (commandGateMap: AzaLiveCommandGateMap): OwnershipWriteLane[] => [
  {
    allowedNow: true,
    approval:
      'Allowed only for scoped AzA command-center artifacts after organization is explained.',
    evidence: ['/aza/aza-read-write-contract.json'],
    id: 'lobehub_command_center_files',
    target: '/Users/growthgod/lobehub/src/app/aza and /Users/growthgod/lobehub/public/aza',
  },
  {
    allowedNow: false,
    approval:
      commandGateMap.gates.find((gate) => gate.id === 'van_filesystem_writes')?.nextAction ??
      'Require approval before VAN writes.',
    evidence: ['/aza/live-command-gates'],
    id: 'van_runtime_files',
    target: '/Users/growthgod/VAN',
  },
  {
    allowedNow: false,
    approval:
      commandGateMap.gates.find((gate) => gate.id === 'canonical_aza_writes')?.nextAction ??
      'Canonical write gates must pass first.',
    evidence: ['/aza/live-command-gates', '/aza/live-readiness'],
    id: 'aza_canonical_records',
    target: '/Users/growthgod/VAN/aza_memory',
  },
  {
    allowedNow: false,
    approval:
      commandGateMap.gates.find((gate) => gate.id === 'vanta_brain_projection')?.nextAction ??
      'Projection requires explicit approval.',
    evidence: ['/aza/live-command-gates', '/aza/vanta-brain-readonly-audit.json'],
    id: 'vanta_brain_projection',
    target: '/Users/growthgod/Documents/VANTA-Brain',
  },
  {
    allowedNow: false,
    approval:
      commandGateMap.gates.find((gate) => gate.id === 'browser_device_actions')?.nextAction ??
      'Browser and device actions require explicit approval.',
    evidence: ['/aza/live-command-gates', '/aza/live-content-ops'],
    id: 'browser_app_device_actions',
    target: 'browser, Electron, posting, messaging, device, and account-changing actions',
  },
];

export const getAzaLiveOwnershipResolutionMap = async ({
  commandGateMap,
  systemMap,
}: {
  commandGateMap?: AzaLiveCommandGateMap;
  systemMap?: AzaLiveSystemMap;
} = {}): Promise<AzaLiveOwnershipResolutionMap> => {
  const [liveSystemMap, liveCommandGateMap] = await Promise.all([
    systemMap ?? getAzaLiveSystemMap(),
    commandGateMap ?? getAzaLiveCommandGateMap(),
  ]);
  const decisions = buildDecisions(liveSystemMap, liveCommandGateMap);
  const conflicts = buildConflicts(liveSystemMap, liveCommandGateMap);
  const writeLanes = buildWriteLanes(liveCommandGateMap);

  return {
    conflicts,
    decisions,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_ownership_resolution_map',
    safety: {
      captured: [
        'root labels',
        'root paths',
        'ownership decisions',
        'read policies',
        'write policies',
        'conflict labels',
        'write-lane approval labels',
      ],
      excluded: [
        'file contents',
        'raw memory contents',
        'raw session transcripts',
        'secrets',
        'tokens',
        'cookies',
        'passwords',
        'browser tabs',
        'private messages',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      approvalRequiredDecisions: decisions.filter(
        (decision) => decision.status === 'approval_required',
      ).length,
      blockedDecisions: decisions.filter((decision) => decision.status === 'blocked').length,
      canonicalTargets: decisions.filter((decision) => decision.status === 'canonical_target')
        .length,
      conflicts: conflicts.length,
      projectionReadOnlyRoots: decisions.filter(
        (decision) => decision.status === 'projection_read_only',
      ).length,
      rootDecisions: decisions.length,
      runtimeNativeRoots: decisions.filter((decision) => decision.status === 'runtime_native')
        .length,
      sourceOfTruthRoots: decisions.filter((decision) => decision.status === 'source_of_truth')
        .length,
      writeLanes: writeLanes.length,
      writesAllowed: false,
    },
    writeLanes,
  };
};
