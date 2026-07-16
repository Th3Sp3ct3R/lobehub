import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import { type AzaLiveProjectMap, getAzaLiveProjectMap } from './liveProjectMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './liveServiceMap';

type RootStatus =
  | 'active_read_only'
  | 'approval_required'
  | 'blocked'
  | 'missing'
  | 'projection_read_only'
  | 'runtime_native';

type ReconciliationStatus = 'blocked' | 'needs_reconciliation' | 'resolved_by_policy';

type WorkspaceRootDefinition = {
  expectedOwner: string;
  id: string;
  layer: string;
  path: string;
  role: string;
  writePolicy: string;
};

export type WorkspaceRootMarker = {
  exists: boolean;
  name: string;
};

export type WorkspaceRootGitState = {
  branch: string | null;
  gitPresent: boolean;
  mode: 'detached' | 'missing' | 'worktree_or_repository';
};

export type WorkspaceRootState = WorkspaceRootDefinition & {
  directDirectories: number;
  directFiles: number;
  git: WorkspaceRootGitState;
  markers: WorkspaceRootMarker[];
  modifiedAt: string | null;
  projectEntries: number;
  serviceListenerCount: number;
  status: RootStatus;
};

export type WorkspaceRootDecision = {
  evidence: string[];
  id: string;
  nextAction: string;
  owner: string;
  rootId: string;
  status: ReconciliationStatus;
};

export type WorkspaceCommunicationPath = {
  approval: string;
  channel: string;
  evidence: string[];
  from: string;
  id: string;
  status: 'active_read_only' | 'blocked' | 'planned';
  to: string;
};

export type AzaLiveWorkspaceRootReconciliationMap = {
  communicationPaths: WorkspaceCommunicationPath[];
  decisions: WorkspaceRootDecision[];
  generatedAt: string;
  mode: 'read_only_workspace_root_reconciliation_map';
  recommendation: {
    azaTarget: string;
    commandHarness: string;
    legacyRule: string;
    projectionRule: string;
    runtimeWorkspace: string;
  };
  rootStates: WorkspaceRootState[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    activeReadOnlyRoots: number;
    approvalRequiredRoots: number;
    blockedRoots: number;
    commandHarnessPresent: boolean;
    decisionsNeedingReconciliation: number;
    desktopVanListenerCount: number;
    legacyRootPresent: boolean;
    rootsPresent: number;
    rootsTotal: number;
    vanListenerCount: number;
    writesAllowed: false;
  };
};

const ROOTS: WorkspaceRootDefinition[] = [
  {
    expectedOwner: 'LobeHub harness',
    id: 'lobehub',
    layer: 'command_harness',
    path: '/Users/growthgod/lobehub',
    role: 'Current AzA command-center harness and operator surface.',
    writePolicy: 'Scoped AzA command-center edits only after organization is explained.',
  },
  {
    expectedOwner: 'VAN active runtime workspace',
    id: 'van',
    layer: 'runtime_workspace',
    path: '/Users/growthgod/VAN',
    role: 'Active project, agent, service, device, and product workspace.',
    writePolicy:
      'Approval required before any write with target, reason, rollback, and validation.',
  },
  {
    expectedOwner: 'AzA canonical brain target',
    id: 'aza_memory',
    layer: 'canonical_brain_target',
    path: '/Users/growthgod/VAN/aza_memory',
    role: 'Planned canonical typed memory, search, MCP, and projection service root.',
    writePolicy:
      'Blocked until API, MCP, durable store, schema, redaction, and approval gates pass.',
  },
  {
    expectedOwner: 'VANTA-Brain projection vault',
    id: 'vanta_brain',
    layer: 'projection_vault',
    path: '/Users/growthgod/Documents/VANTA-Brain',
    role: 'Human-readable reviewed projection vault, not raw canonical memory.',
    writePolicy: 'Read-only during this pass.',
  },
  {
    expectedOwner: 'Legacy or alternate runtime inventory',
    id: 'desktop_van',
    layer: 'legacy_runtime',
    path: '/Users/growthgod/Desktop/VAN',
    role: 'Legacy or alternate VANTA runtime root still observed in service/process evidence.',
    writePolicy:
      'Inventory only until owner, current task, migration, or archive decision is explicit.',
  },
  {
    expectedOwner: 'Codex executor runtime',
    id: 'codex_state',
    layer: 'executor_state',
    path: '/Users/growthgod/.codex',
    role: 'Codex goals, memories, skills, plugins, worktrees, and execution evidence.',
    writePolicy: 'Runtime-native. Promote only verified summaries and evidence to AzA.',
  },
  {
    expectedOwner: 'Hermes agent runtime',
    id: 'hermes_state',
    layer: 'agent_runtime',
    path: '/Users/growthgod/.hermes',
    role: 'Hermes agents, skills, sessions, kanban, memories, and runtime evidence.',
    writePolicy: 'Runtime-native. Promote reviewed session summaries and facts into AzA.',
  },
  {
    expectedOwner: 'Agent skill library',
    id: 'agent_skills',
    layer: 'skill_library',
    path: '/Users/growthgod/.agents',
    role: 'Shared agent skill and capability package root.',
    writePolicy: 'Metadata-first; skill edits require specific target and validation.',
  },
];

const MARKERS = [
  '.git',
  'AGENTS.md',
  'CLAUDE.md',
  'README.md',
  'package.json',
  'pnpm-workspace.yaml',
  'src/app/aza/page.tsx',
  'public/aza',
] as const;

const pathExists = async (targetPath: string) => Boolean(await stat(targetPath).catch(() => null));

const markerState = async (rootPath: string): Promise<WorkspaceRootMarker[]> =>
  Promise.all(
    MARKERS.map(async (name) => ({
      exists: await pathExists(path.join(rootPath, ...name.split('/'))),
      name,
    })),
  );

const readGitHead = async (rootPath: string): Promise<WorkspaceRootGitState> => {
  const gitPath = path.join(rootPath, '.git');
  const gitStats = await stat(gitPath).catch(() => null);

  if (!gitStats) return { branch: null, gitPresent: false, mode: 'missing' };

  const gitDirFromPointer = (content: string) => {
    const firstLine = content.split(/\r?\n/, 1)[0] ?? '';

    if (!firstLine.startsWith('gitdir:')) return null;

    return firstLine.slice('gitdir:'.length).trim() || null;
  };
  const headPath = gitStats.isDirectory()
    ? path.join(gitPath, 'HEAD')
    : await readFile(gitPath, 'utf8')
        .then((content) => {
          const gitDir = gitDirFromPointer(content);

          return gitDir ? path.join(rootPath, gitDir, 'HEAD') : null;
        })
        .catch(() => null);
  const head = headPath ? await readFile(headPath, 'utf8').catch(() => '') : '';
  const ref = head.match(/^ref:\s*refs\/heads\/(.+)$/m)?.[1]?.trim();

  return {
    branch: ref || (head.trim() ? head.trim().slice(0, 12) : null),
    gitPresent: true,
    mode: ref ? 'worktree_or_repository' : 'detached',
  };
};

const statusForRoot = ({
  definition,
  exists,
  readiness,
}: {
  definition: WorkspaceRootDefinition;
  exists: boolean;
  readiness: AzaLiveReadiness;
}): RootStatus => {
  if (!exists) return 'missing';
  if (definition.id === 'lobehub') return 'active_read_only';
  if (definition.id === 'vanta_brain') return 'projection_read_only';
  if (definition.id === 'aza_memory') {
    return readiness.summary.liveAzAReadAvailable || readiness.summary.liveMcpAvailable
      ? 'active_read_only'
      : 'blocked';
  }
  if (definition.id === 'van' || definition.id === 'desktop_van') return 'approval_required';

  return 'runtime_native';
};

const listenerCountFor = (serviceMap: AzaLiveServiceMap, rootPath: string) =>
  serviceMap.listeners.filter((listener) => listener.cwd?.startsWith(rootPath)).length;

const projectEntriesFor = (projectMap: AzaLiveProjectMap, rootId: string) => {
  const projectRootId =
    rootId === 'desktop_van' ? 'desktop-van' : rootId === 'aza_memory' ? 'van' : rootId;

  if (!['van', 'lobehub', 'desktop-van'].includes(projectRootId)) return 0;

  return projectMap.roots.find((root) => root.id === projectRootId)?.entries.length ?? 0;
};

const scanRoot = async ({
  definition,
  projectMap,
  readiness,
  serviceMap,
}: {
  definition: WorkspaceRootDefinition;
  projectMap: AzaLiveProjectMap;
  readiness: AzaLiveReadiness;
  serviceMap: AzaLiveServiceMap;
}): Promise<WorkspaceRootState> => {
  const rootStats = await stat(definition.path).catch(() => null);
  const entries = rootStats?.isDirectory()
    ? await readdir(definition.path, { withFileTypes: true }).catch(() => [])
    : [];
  const visibleEntries = entries.filter((entry) => !entry.name.startsWith('.DS_Store'));

  return {
    ...definition,
    directDirectories: visibleEntries.filter((entry) => entry.isDirectory()).length,
    directFiles: visibleEntries.filter((entry) => entry.isFile()).length,
    git: await readGitHead(definition.path),
    markers: await markerState(definition.path),
    modifiedAt: rootStats?.mtime.toISOString() ?? null,
    projectEntries: projectEntriesFor(projectMap, definition.id),
    serviceListenerCount: listenerCountFor(serviceMap, definition.path),
    status: statusForRoot({ definition, exists: Boolean(rootStats), readiness }),
  };
};

const buildDecisions = ({
  commandGateMap,
  roots,
}: {
  commandGateMap: AzaLiveCommandGateMap;
  roots: WorkspaceRootState[];
}): WorkspaceRootDecision[] => {
  const root = (id: string) => roots.find((candidate) => candidate.id === id);
  const vanWriteGate = commandGateMap.gates.find((gate) => gate.id === 'van_filesystem_writes');
  const canonicalGate = commandGateMap.gates.find((gate) => gate.id === 'canonical_aza_writes');
  const projectionGate = commandGateMap.gates.find((gate) => gate.id === 'vanta_brain_projection');

  return [
    {
      evidence: ['/aza/live-workspace-root-reconciliation', '/aza/live-system-map'],
      id: 'lobehub_is_current_command_layer',
      nextAction: 'Keep the AzA command-center UI, live maps, and approval context under LobeHub.',
      owner: 'LobeHub harness',
      rootId: 'lobehub',
      status: root('lobehub')?.status === 'active_read_only' ? 'resolved_by_policy' : 'blocked',
    },
    {
      evidence: ['/aza/live-project-map', '/aza/live-command-gates'],
      id: 'van_is_runtime_workspace',
      nextAction:
        vanWriteGate?.nextAction ??
        'Use VAN as the runtime workspace only after target-specific write approval.',
      owner: 'VAN active runtime workspace',
      rootId: 'van',
      status: root('van')?.status === 'approval_required' ? 'resolved_by_policy' : 'blocked',
    },
    {
      evidence: ['/aza/live-readiness', '/aza/live-command-gates'],
      id: 'aza_memory_is_canonical_target_not_live_store',
      nextAction:
        canonicalGate?.nextAction ??
        'Verify AzA API, MCP, durable store, schema, and rollback before canonical writes.',
      owner: 'AzA canonical brain target',
      rootId: 'aza_memory',
      status:
        root('aza_memory')?.status === 'blocked' ? 'needs_reconciliation' : 'resolved_by_policy',
    },
    {
      evidence: ['/aza/live-vanta-brain-coverage', '/aza/aza-read-write-contract.json'],
      id: 'vanta_brain_is_projection_vault',
      nextAction:
        projectionGate?.nextAction ??
        'Keep VANTA-Brain read-only until exact projection destination is approved.',
      owner: 'VANTA-Brain projection vault',
      rootId: 'vanta_brain',
      status:
        root('vanta_brain')?.status === 'projection_read_only' ? 'resolved_by_policy' : 'blocked',
    },
    {
      evidence: ['/aza/live-service-map', '/aza/live-project-map'],
      id: 'desktop_van_needs_runtime_reconciliation',
      nextAction:
        'Classify any Desktop/VAN services by owner, current purpose, and migrate/archive decision.',
      owner: 'Legacy runtime inventory',
      rootId: 'desktop_van',
      status:
        (root('desktop_van')?.serviceListenerCount ?? 0) > 0 ||
        root('desktop_van')?.status !== 'missing'
          ? 'needs_reconciliation'
          : 'blocked',
    },
  ];
};

const buildCommunicationPaths = ({
  readiness,
}: {
  readiness: AzaLiveReadiness;
}): WorkspaceCommunicationPath[] => [
  {
    approval: 'none for read-only operator review',
    channel: 'Next.js route and rendered command-center page',
    evidence: ['/aza', '/aza/live-workspace-root-reconciliation'],
    from: 'human_operator',
    id: 'operator_to_lobehub',
    status: 'active_read_only',
    to: 'lobehub',
  },
  {
    approval: 'LobeHub-only edits allowed after organization is explained',
    channel: 'Codex desktop thread, file edits, validation commands, screenshots',
    evidence: ['/aza/live-daily-command-workflow', '/aza/live-codex-harness'],
    from: 'lobehub',
    id: 'lobehub_to_codex',
    status: 'active_read_only',
    to: 'codex_state',
  },
  {
    approval: 'explicit target approval required before runtime writes',
    channel: 'planned filesystem and service work',
    evidence: ['/aza/live-command-gates'],
    from: 'lobehub',
    id: 'lobehub_to_van',
    status: 'blocked',
    to: 'van',
  },
  {
    approval: 'blocked until service/store/MCP gates pass',
    channel: 'planned API/MCP and durable store',
    evidence: ['/aza/live-readiness', '/aza/live-canonical-store'],
    from: 'lobehub',
    id: 'lobehub_to_aza_memory',
    status:
      readiness.summary.liveAzAReadAvailable || readiness.summary.liveMcpAvailable
        ? 'planned'
        : 'blocked',
    to: 'aza_memory',
  },
  {
    approval: 'explicit projection approval required',
    channel: 'planned projection worker',
    evidence: ['/aza/live-vanta-brain-coverage', '/aza/aza-read-write-contract.json'],
    from: 'aza_memory',
    id: 'aza_memory_to_vanta_brain',
    status: 'blocked',
    to: 'vanta_brain',
  },
];

export const getAzaLiveWorkspaceRootReconciliationMap = async ({
  commandGateMap,
  projectMap,
  readiness,
  serviceMap,
}: {
  commandGateMap?: AzaLiveCommandGateMap;
  projectMap?: AzaLiveProjectMap;
  readiness?: AzaLiveReadiness;
  serviceMap?: AzaLiveServiceMap;
} = {}): Promise<AzaLiveWorkspaceRootReconciliationMap> => {
  const [liveReadiness, liveServiceMap, liveProjectMap, liveCommandGateMap] = await Promise.all([
    readiness ?? getAzaLiveReadiness(),
    serviceMap ?? getAzaLiveServiceMap(),
    projectMap ?? getAzaLiveProjectMap(),
    commandGateMap ?? getAzaLiveCommandGateMap(),
  ]);
  const rootStates = await Promise.all(
    ROOTS.map((definition) =>
      scanRoot({
        definition,
        projectMap: liveProjectMap,
        readiness: liveReadiness,
        serviceMap: liveServiceMap,
      }),
    ),
  );
  const decisions = buildDecisions({ commandGateMap: liveCommandGateMap, roots: rootStates });
  const communicationPaths = buildCommunicationPaths({ readiness: liveReadiness });

  return {
    communicationPaths,
    decisions,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_workspace_root_reconciliation_map',
    recommendation: {
      azaTarget:
        'AzA canonical memory is targeted at /Users/growthgod/VAN/aza_memory, but live API/MCP/store gates are still blocked.',
      commandHarness:
        'Use /Users/growthgod/lobehub as the command harness and operator surface for AzA.',
      legacyRule:
        'Treat /Users/growthgod/Desktop/VAN as legacy or alternate runtime until listener ownership is reconciled.',
      projectionRule:
        'Use /Users/growthgod/Documents/VANTA-Brain only as a read-only reviewed projection vault during this pass.',
      runtimeWorkspace:
        'Use /Users/growthgod/VAN as the active runtime/project workspace, with approval required before writes.',
    },
    rootStates,
    safety: {
      captured: [
        'root paths',
        'root existence',
        'modified times',
        'top-level directory and file counts',
        'marker presence',
        'git branch names from HEAD',
        'service listener counts by cwd prefix',
        'project entry counts',
        'ownership decisions',
        'communication path labels',
      ],
      excluded: [
        'git remotes',
        'env files',
        'raw source file contents',
        'raw markdown contents',
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
      activeReadOnlyRoots: rootStates.filter((root) => root.status === 'active_read_only').length,
      approvalRequiredRoots: rootStates.filter((root) => root.status === 'approval_required')
        .length,
      blockedRoots: rootStates.filter((root) => root.status === 'blocked').length,
      commandHarnessPresent:
        rootStates.find((root) => root.id === 'lobehub')?.status === 'active_read_only',
      decisionsNeedingReconciliation: decisions.filter(
        (decision) => decision.status === 'needs_reconciliation',
      ).length,
      desktopVanListenerCount: liveServiceMap.summary.desktopVanListenerCount,
      legacyRootPresent: rootStates.find((root) => root.id === 'desktop_van')?.status !== 'missing',
      rootsPresent: rootStates.filter((root) => root.status !== 'missing').length,
      rootsTotal: rootStates.length,
      vanListenerCount: liveServiceMap.summary.vanListenerCount,
      writesAllowed: false,
    },
  };
};
