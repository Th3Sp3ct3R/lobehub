import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './liveMemoryMap';

type AccessStatus = 'active_read_only' | 'approval_required' | 'blocked' | 'planned';

export type AgentAccessRow = {
  allowedRecords: string[];
  canRead: string[];
  canWrite: string[];
  denied: string[];
  evidenceRequired: string[];
  id: string;
  label: string;
  memoryRoots: string[];
  promotionRule: string;
  requiresApprovalFor: string[];
  sessionScope: string;
  status: AccessStatus;
};

export type NamespaceAccessSummary = {
  defaultReaders: string[];
  id: string;
  label: string;
  readers: string[];
  status: string;
  writePolicy: string;
};

export type AzaLiveAgentAccessMatrixMap = {
  generatedAt: string;
  matrix: AgentAccessRow[];
  mode: 'read_only_live_agent_access_matrix_map';
  namespaces: NamespaceAccessSummary[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    accessRows: number;
    activeReadOnlyRows: number;
    approvalRequiredRows: number;
    blockedRows: number;
    memoryRootsPresent: number;
    namespaces: number;
    plannedRows: number;
    sessionBackedRows: number;
    writesAllowed: false;
  };
};

const rootsFor = (memoryMap: AzaLiveMemoryMap, rootIds: string[]) =>
  memoryMap.roots
    .filter((root) => rootIds.includes(root.id))
    .map((root) => root.path)
    .sort((a, b) => a.localeCompare(b));

const profileStatus = (profileId: string): AccessStatus => {
  if (profileId === 'human_operator') return 'approval_required';
  if (profileId === 'gtm_content_operator') return 'planned';
  if (profileId === 'agent_runtime') return 'active_read_only';
  if (profileId === 'codex_executor') return 'approval_required';

  return 'planned';
};

const sessionScopeFor = (profileId: string) => {
  if (profileId === 'codex_executor') {
    return 'Codex may use current-goal context, rollout summaries, and explicit evidence paths, but should not bulk-promote raw logs.';
  }
  if (profileId === 'agent_runtime') {
    return 'Agents can read their own runtime/session overlays and promoted canonical records scoped to their role.';
  }
  if (profileId === 'gtm_content_operator') {
    return 'GTM/content agents use campaign, approval, evidence, and content-operation records; private account state stays excluded.';
  }
  if (profileId === 'human_operator') {
    return 'Human operator can approve cross-namespace reads, writes, projections, and risky actions with target and evidence.';
  }

  return 'Session scope not configured.';
};

const rootIdsForProfile = (profileId: string) => {
  if (profileId === 'codex_executor') return ['codex-skills', 'codex-memories'];
  if (profileId === 'agent_runtime') {
    return ['hermes-agents', 'hermes-skills', 'hermes-sessions', 'hermes-memories'];
  }
  if (profileId === 'gtm_content_operator') return ['vanta-brain'];
  if (profileId === 'human_operator') {
    return [
      'agent-skills',
      'codex-skills',
      'codex-memories',
      'hermes-agents',
      'hermes-skills',
      'hermes-sessions',
      'hermes-memories',
      'vanta-brain',
    ];
  }

  return [];
};

const buildMatrix = (
  topology: AzaLiveBrainTopologyMap,
  memoryMap: AzaLiveMemoryMap,
): AgentAccessRow[] =>
  topology.accessProfiles.map((profile) => ({
    allowedRecords: profile.allowedRecords,
    canRead: profile.canRead,
    canWrite: profile.canWrite,
    denied: profile.denied,
    evidenceRequired: profile.evidenceRequired,
    id: profile.id,
    label: profile.label,
    memoryRoots: rootsFor(memoryMap, rootIdsForProfile(profile.id)),
    promotionRule: topology.recommendedModel.promotionRule,
    requiresApprovalFor: profile.requiresApprovalFor,
    sessionScope: sessionScopeFor(profile.id),
    status: profileStatus(profile.id),
  }));

const buildNamespaceSummaries = (
  topology: AzaLiveBrainTopologyMap,
  matrix: AgentAccessRow[],
): NamespaceAccessSummary[] =>
  topology.namespaces.map((namespace) => ({
    defaultReaders: namespace.defaultReaders,
    id: namespace.id,
    label: namespace.label,
    readers: matrix
      .filter(
        (row) =>
          row.canRead.includes(namespace.id) ||
          row.canRead.includes('all_namespaces') ||
          namespace.defaultReaders.includes(row.id),
      )
      .map((row) => row.id)
      .sort((a, b) => a.localeCompare(b)),
    status: namespace.status,
    writePolicy: namespace.writePolicy,
  }));

export const getAzaLiveAgentAccessMatrixMap = async ({
  memoryMap,
  topology,
}: {
  memoryMap?: AzaLiveMemoryMap;
  topology?: AzaLiveBrainTopologyMap;
} = {}): Promise<AzaLiveAgentAccessMatrixMap> => {
  const [liveMemoryMap, liveTopology] = await Promise.all([
    memoryMap ?? getAzaLiveMemoryMap(),
    topology ?? getAzaLiveBrainTopologyMap({ memoryMap }),
  ]);
  const matrix = buildMatrix(liveTopology, liveMemoryMap);
  const namespaces = buildNamespaceSummaries(liveTopology, matrix);

  return {
    generatedAt: new Date().toISOString(),
    matrix,
    mode: 'read_only_live_agent_access_matrix_map',
    namespaces,
    safety: {
      captured: [
        'access profile labels',
        'namespace labels',
        'allowed record type names',
        'memory root paths',
        'session scope labels',
        'approval labels',
        'evidence requirement labels',
      ],
      excluded: [
        'raw memory contents',
        'raw session transcripts',
        'raw skill bodies',
        'secrets',
        'tokens',
        'cookies',
        'passwords',
        'private messages',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      accessRows: matrix.length,
      activeReadOnlyRows: matrix.filter((row) => row.status === 'active_read_only').length,
      approvalRequiredRows: matrix.filter((row) => row.status === 'approval_required').length,
      blockedRows: matrix.filter((row) => row.status === 'blocked').length,
      memoryRootsPresent: liveMemoryMap.summary.rootsPresent,
      namespaces: namespaces.length,
      plannedRows: matrix.filter((row) => row.status === 'planned').length,
      sessionBackedRows: matrix.filter((row) => row.memoryRoots.length > 0).length,
      writesAllowed: false,
    },
  };
};
