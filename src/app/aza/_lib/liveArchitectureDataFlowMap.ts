import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import {
  type AzaLiveCommunicationProtocolMap,
  getAzaLiveCommunicationProtocolMap,
} from './liveCommunicationProtocolMap';
import { type AzaLiveContentOpsMap, getAzaLiveContentOpsMap } from './liveContentOpsMap';
import {
  type AzaLiveMemoryIntakeFunnelMap,
  getAzaLiveMemoryIntakeFunnelMap,
} from './liveMemoryIntakeFunnelMap';
import {
  type AzaLiveTeamDataRoutingMap,
  getAzaLiveTeamDataRoutingMap,
} from './liveTeamDataRoutingMap';
import {
  type AzaLiveWorkspaceRootReconciliationMap,
  getAzaLiveWorkspaceRootReconciliationMap,
} from './liveWorkspaceRootReconciliationMap';

type FlowNodeStatus =
  | 'active_manual'
  | 'active_read_only'
  | 'approval_required'
  | 'blocked'
  | 'planned'
  | 'projection_read_only'
  | 'runtime_native'
  | 'snapshot';

type FlowEdgeStatus =
  | 'active_manual'
  | 'active_read_only'
  | 'approval_required'
  | 'blocked'
  | 'planned'
  | 'snapshot';

export type ArchitectureFlowNode = {
  evidence: string[];
  id: string;
  label: string;
  layer: string;
  owner: string;
  pathOrSurface: string;
  readPolicy: string;
  role: string;
  status: FlowNodeStatus;
  writePolicy: string;
};

export type ArchitectureFlowEdge = {
  approval: string;
  blockedBy: string[];
  channel: string;
  evidence: string[];
  from: string;
  id: string;
  payloads: string[];
  status: FlowEdgeStatus;
  to: string;
};

export type ArchitectureGate = {
  evidence: string[];
  id: string;
  label: string;
  nextProof: string;
  status: FlowEdgeStatus;
};

export type AzaLiveArchitectureDataFlowMap = {
  edges: ArchitectureFlowEdge[];
  gates: ArchitectureGate[];
  generatedAt: string;
  mode: 'read_only_live_architecture_data_flow_map';
  nodes: ArchitectureFlowNode[];
  recommendation: {
    brainModel: 'hybrid_unified_brain_with_granular_agent_overlays';
    commandModel: string;
    granularModel: string;
    projectionModel: string;
    unifiedModel: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    activeManualEdges: number;
    activeReadOnlyEdges: number;
    approvalRequiredEdges: number;
    blockedEdges: number;
    contentStages: number;
    edges: number;
    gates: number;
    memorySources: number;
    nodes: number;
    plannedEdges: number;
    teamRecordRoutes: number;
    workspaceDecisionsNeedingReconciliation: number;
    writesAllowed: false;
  };
};

const rootState = (map: AzaLiveWorkspaceRootReconciliationMap, id: string) =>
  map.rootStates.find((root) => root.id === id);

const rootStatus = (
  map: AzaLiveWorkspaceRootReconciliationMap,
  id: string,
  fallback: FlowNodeStatus,
): FlowNodeStatus => {
  const status = rootState(map, id)?.status;

  if (status === 'active_read_only') return 'active_read_only';
  if (status === 'approval_required') return 'approval_required';
  if (status === 'blocked') return 'blocked';
  if (status === 'projection_read_only') return 'projection_read_only';
  if (status === 'runtime_native') return 'runtime_native';

  return fallback;
};

const protocolStatus = (
  status: AzaLiveCommunicationProtocolMap['protocols'][number]['status'],
): FlowEdgeStatus => {
  if (status === 'active') return 'active_read_only';
  if (status === 'active_manual') return 'active_manual';
  if (status === 'approval_required') return 'approval_required';
  if (status === 'snapshot') return 'snapshot';
  if (status === 'planned') return 'planned';

  return 'blocked';
};

const payloadsByProtocol: Record<string, string[]> = {
  agent_runtime_to_aza_memory_promotion: [
    'agent/session summaries',
    'verified facts',
    'decisions',
    'evidence pointers',
  ],
  aza_to_postgres_canonical_store: ['typed records', 'embeddings', 'permissions', 'audit events'],
  aza_to_vanta_brain_projection: ['redacted summaries', 'decision notes', 'evidence indexes'],
  codex_to_van_workspace: ['repo metadata', 'approved code changes', 'validation evidence'],
  content_apps_to_aza_asset_registry: [
    'draft assets',
    'capture evidence',
    'publish-event candidates',
  ],
  lobehub_to_aza_http_api: ['command records', 'memory reads', 'operator queries'],
  lobehub_to_aza_mcp: ['retrieval requests', 'tool results', 'agent memory queries'],
  lobehub_to_codex_manual_execution: [
    'implementation intent',
    'terminal commands',
    'file diffs',
    'test evidence',
  ],
  lobehub_to_durable_command_records: [
    'command records',
    'approval records',
    'Codex run records',
    'evidence receipts',
  ],
  local_services_to_lobehub_inventory: ['listener metadata', 'cwd ownership', 'health hints'],
  operator_to_lobehub_next_route: ['operator intent', 'approval decisions', 'review context'],
};

const buildNodes = ({
  contentOpsMap,
  memoryIntakeFunnelMap,
  teamDataRoutingMap,
  topology,
  workspaceRootReconciliationMap,
}: {
  contentOpsMap: AzaLiveContentOpsMap;
  memoryIntakeFunnelMap: AzaLiveMemoryIntakeFunnelMap;
  teamDataRoutingMap: AzaLiveTeamDataRoutingMap;
  topology: AzaLiveBrainTopologyMap;
  workspaceRootReconciliationMap: AzaLiveWorkspaceRootReconciliationMap;
}): ArchitectureFlowNode[] => [
  {
    evidence: ['/aza'],
    id: 'human_operator',
    label: 'Human operator',
    layer: 'operator',
    owner: 'growthgod',
    pathOrSurface: 'Codex desktop and LobeHub command-center UI',
    readPolicy: 'May inspect all non-secret architecture, source pointers, and evidence.',
    role: 'Issues intent, approvals, GTM priorities, and final publishing decisions.',
    status: 'active_read_only',
    writePolicy: 'Approves scoped actions; no automated protected writes by default.',
  },
  {
    evidence: ['/aza/live-workspace-root-reconciliation'],
    id: 'lobehub_harness',
    label: 'LobeHub harness',
    layer: 'command_harness',
    owner: 'LobeHub harness',
    pathOrSurface:
      rootState(workspaceRootReconciliationMap, 'lobehub')?.path ?? '/Users/growthgod/lobehub',
    readPolicy: 'Reads safe live maps, static AzA artifacts, and approved metadata.',
    role: 'AzA command center, operator surface, route catalog, and approval context.',
    status: rootStatus(workspaceRootReconciliationMap, 'lobehub', 'active_read_only'),
    writePolicy: 'Scoped AzA command-center edits only after organization is explained.',
  },
  {
    evidence: ['/aza/live-codex-harness', '/aza/live-workspace-root-reconciliation'],
    id: 'codex_executor',
    label: 'Codex executor',
    layer: 'execution_agent',
    owner: 'Codex',
    pathOrSurface:
      rootState(workspaceRootReconciliationMap, 'codex_state')?.path ?? '/Users/growthgod/.codex',
    readPolicy: 'Reads code, graph index, filesystem metadata, and validation output.',
    role: 'Executes coding work, validation, browser checks, and evidence collection.',
    status: rootStatus(workspaceRootReconciliationMap, 'codex_state', 'runtime_native'),
    writePolicy: 'Writes only to approved targets; protected roots require explicit approval.',
  },
  {
    evidence: ['/aza/live-project-map', '/aza/live-workspace-root-reconciliation'],
    id: 'van_runtime_workspace',
    label: 'VAN runtime workspace',
    layer: 'runtime_workspace',
    owner: 'VAN active runtime workspace',
    pathOrSurface: rootState(workspaceRootReconciliationMap, 'van')?.path ?? '/Users/growthgod/VAN',
    readPolicy: 'Metadata and project inventory are safe to inspect.',
    role: 'Active project, agent, product, device, and implementation workspace.',
    status: rootStatus(workspaceRootReconciliationMap, 'van', 'approval_required'),
    writePolicy:
      'Approval required before any write with target, reason, rollback, and validation.',
  },
  {
    evidence: ['/aza/live-readiness', '/aza/live-workspace-root-reconciliation'],
    id: 'aza_canonical_target',
    label: 'AzA canonical brain target',
    layer: 'canonical_memory',
    owner: 'AzA',
    pathOrSurface:
      rootState(workspaceRootReconciliationMap, 'aza_memory')?.path ??
      '/Users/growthgod/VAN/aza_memory',
    readPolicy: 'Should expose API/MCP reads after service health is verified.',
    role: 'Future canonical typed memory, search, retrieval, permissions, and audit system.',
    status: rootStatus(workspaceRootReconciliationMap, 'aza_memory', 'blocked'),
    writePolicy:
      'Blocked until API, MCP, durable store, schema, redaction, and approval gates pass.',
  },
  {
    evidence: ['/aza/live-brain-topology', '/aza/live-canonical-store'],
    id: 'canonical_core',
    label: 'Canonical core records',
    layer: 'canonical_records',
    owner: 'AzA',
    pathOrSurface:
      topology.namespaces.find((namespace) => namespace.id === 'canonical_core')?.scope ??
      'planned typed records',
    readPolicy: 'Approved agents and Codex read by namespace and access profile.',
    role: 'Durable records, provenance, permissions, search indexes, and projection history.',
    status: topology.summary.canonicalWritesAllowed ? 'planned' : 'blocked',
    writePolicy: 'No canonical writes until readiness and command gates pass.',
  },
  {
    evidence: ['/aza/live-memory-intake-funnel', '/aza/live-agent-fleet-map'],
    id: 'agent_memory_overlays',
    label: 'Agent memory overlays',
    layer: 'granular_memory',
    owner: 'Codex, Hermes, and specialized agents',
    pathOrSurface: '/Users/growthgod/.codex, /Users/growthgod/.hermes, /Users/growthgod/.agents',
    readPolicy: 'Metadata and summaries first; raw memories stay in native runtimes.',
    role: `${memoryIntakeFunnelMap.summary.sources} intake sources and ${memoryIntakeFunnelMap.summary.namespaceRoutes} namespace routes.`,
    status:
      memoryIntakeFunnelMap.summary.activeReadOnlySources > 0 ? 'active_read_only' : 'blocked',
    writePolicy:
      'Granular local writes stay with owning runtime; promotion requires sensitivity review.',
  },
  {
    evidence: ['/aza/live-content-ops', '/aza/live-content-app-audit'],
    id: 'content_app_surfaces',
    label: 'Content webapps and Electron apps',
    layer: 'content_generation',
    owner: 'GTM and content operator',
    pathOrSurface: '/Applications, browser sessions, Electron apps, and content tools',
    readPolicy: 'Inventory app role, output type, account label, and allowed action mode.',
    role: `${contentOpsMap.summary.contentStages} content stages with ${contentOpsMap.summary.appsNeedingApproval} approval-queued apps.`,
    status:
      contentOpsMap.summary.appsNeedingApproval > 0 ? 'approval_required' : 'active_read_only',
    writePolicy: 'No publishing, account, browser, or device actions without explicit approval.',
  },
  {
    evidence: ['/aza/live-gtm-map', '/aza/live-team-data-routing'],
    id: 'gtm_team_records',
    label: 'GTM and team data lanes',
    layer: 'team_operations',
    owner: 'GTM, product, operations, and knowledge owners',
    pathOrSurface: 'LobeHub-derived board and public AzA artifacts',
    readPolicy: 'Read modeled lanes, records, owners, handoffs, and blocked routes.',
    role: `${teamDataRoutingMap.summary.lanes} lanes and ${teamDataRoutingMap.summary.recordRoutes} record routes.`,
    status: teamDataRoutingMap.summary.durableBoardReady ? 'planned' : 'blocked',
    writePolicy: 'Durable board writes require AzA store, schema, and approval gates.',
  },
  {
    evidence: ['/aza/live-vanta-brain-coverage', '/aza/live-memory-map'],
    id: 'vanta_brain_projection_vault',
    label: 'VANTA-Brain projection vault',
    layer: 'projection_vault',
    owner: 'VANTA-Brain projection vault',
    pathOrSurface:
      rootState(workspaceRootReconciliationMap, 'vanta_brain')?.path ??
      '/Users/growthgod/Documents/VANTA-Brain',
    readPolicy: 'Read-only reviewed markdown and projection inventory during this pass.',
    role: 'Human-readable decisions, documentation, indexes, and reviewed summaries.',
    status: rootStatus(workspaceRootReconciliationMap, 'vanta_brain', 'projection_read_only'),
    writePolicy: 'No writes during this pass; future projections need canonical id and approval.',
  },
  {
    evidence: ['/aza/live-service-map', '/aza/live-workspace-root-reconciliation'],
    id: 'legacy_desktop_van',
    label: 'Desktop/VAN legacy root',
    layer: 'legacy_runtime',
    owner: 'Legacy runtime inventory',
    pathOrSurface:
      rootState(workspaceRootReconciliationMap, 'desktop_van')?.path ??
      '/Users/growthgod/Desktop/VAN',
    readPolicy: 'Inventory only until owner and current purpose are reconciled.',
    role: 'Legacy or alternate VANTA root still present in service/process evidence.',
    status: rootStatus(workspaceRootReconciliationMap, 'desktop_van', 'snapshot'),
    writePolicy: 'No writes until owner, current task, migration, or archive decision is explicit.',
  },
];

const buildEdges = (
  communicationProtocolMap: AzaLiveCommunicationProtocolMap,
): ArchitectureFlowEdge[] =>
  communicationProtocolMap.protocols.map((protocol) => ({
    approval: protocol.approval,
    blockedBy: protocol.blockedBy,
    channel: protocol.transport,
    evidence: protocol.evidence,
    from: protocol.from,
    id: protocol.id,
    payloads: payloadsByProtocol[protocol.id] ?? ['metadata', 'evidence', 'typed records'],
    status: protocolStatus(protocol.status),
    to: protocol.to,
  }));

const buildGates = ({
  communicationProtocolMap,
  memoryIntakeFunnelMap,
  teamDataRoutingMap,
  workspaceRootReconciliationMap,
}: {
  communicationProtocolMap: AzaLiveCommunicationProtocolMap;
  memoryIntakeFunnelMap: AzaLiveMemoryIntakeFunnelMap;
  teamDataRoutingMap: AzaLiveTeamDataRoutingMap;
  workspaceRootReconciliationMap: AzaLiveWorkspaceRootReconciliationMap;
}): ArchitectureGate[] => [
  {
    evidence: ['/aza/live-workspace-root-reconciliation'],
    id: 'workspace_roots_reconciled',
    label: 'Workspace roots reconciled',
    nextProof:
      'Resolve AzA memory service/store readiness and Desktop/VAN listener ownership before calling the PC map complete.',
    status:
      workspaceRootReconciliationMap.summary.decisionsNeedingReconciliation > 0
        ? 'blocked'
        : 'active_read_only',
  },
  {
    evidence: ['/aza/live-communication-protocols'],
    id: 'live_protocols_verified',
    label: 'Live communication protocols verified',
    nextProof:
      'Turn blocked AzA API/MCP/store protocols into verified active or planned edges with health checks.',
    status:
      communicationProtocolMap.summary.blockedProtocols > 0
        ? 'blocked'
        : communicationProtocolMap.summary.approvalRequiredProtocols > 0
          ? 'approval_required'
          : 'active_read_only',
  },
  {
    evidence: ['/aza/live-memory-intake-funnel'],
    id: 'memory_promotion_ready',
    label: 'Memory promotion ready',
    nextProof:
      'Enable only after canonical writes, namespace routing, sensitivity labels, and evidence receipts are live.',
    status: memoryIntakeFunnelMap.summary.canonicalWriteReady ? 'planned' : 'blocked',
  },
  {
    evidence: ['/aza/live-team-data-routing'],
    id: 'team_data_durable',
    label: 'Team data durable',
    nextProof:
      'Move GTM, content, product, knowledge, and operations lanes from modeled routes into durable AzA records.',
    status: teamDataRoutingMap.summary.durableBoardReady ? 'planned' : 'blocked',
  },
];

export const getAzaLiveArchitectureDataFlowMap = async ({
  brainTopologyMap,
  communicationProtocolMap,
  contentOpsMap,
  memoryIntakeFunnelMap,
  teamDataRoutingMap,
  workspaceRootReconciliationMap,
}: {
  brainTopologyMap?: AzaLiveBrainTopologyMap;
  communicationProtocolMap?: AzaLiveCommunicationProtocolMap;
  contentOpsMap?: AzaLiveContentOpsMap;
  memoryIntakeFunnelMap?: AzaLiveMemoryIntakeFunnelMap;
  teamDataRoutingMap?: AzaLiveTeamDataRoutingMap;
  workspaceRootReconciliationMap?: AzaLiveWorkspaceRootReconciliationMap;
} = {}): Promise<AzaLiveArchitectureDataFlowMap> => {
  const [
    liveBrainTopologyMap,
    liveCommunicationProtocolMap,
    liveContentOpsMap,
    liveMemoryIntakeFunnelMap,
    liveTeamDataRoutingMap,
    liveWorkspaceRootReconciliationMap,
  ] = await Promise.all([
    brainTopologyMap ?? getAzaLiveBrainTopologyMap(),
    communicationProtocolMap ?? getAzaLiveCommunicationProtocolMap(),
    contentOpsMap ?? getAzaLiveContentOpsMap(),
    memoryIntakeFunnelMap ?? getAzaLiveMemoryIntakeFunnelMap(),
    teamDataRoutingMap ?? getAzaLiveTeamDataRoutingMap(),
    workspaceRootReconciliationMap ?? getAzaLiveWorkspaceRootReconciliationMap(),
  ]);
  const nodes = buildNodes({
    contentOpsMap: liveContentOpsMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
    topology: liveBrainTopologyMap,
    workspaceRootReconciliationMap: liveWorkspaceRootReconciliationMap,
  });
  const edges = buildEdges(liveCommunicationProtocolMap);
  const gates = buildGates({
    communicationProtocolMap: liveCommunicationProtocolMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
    workspaceRootReconciliationMap: liveWorkspaceRootReconciliationMap,
  });

  return {
    edges,
    gates,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_architecture_data_flow_map',
    nodes,
    recommendation: {
      brainModel: 'hybrid_unified_brain_with_granular_agent_overlays',
      commandModel:
        'LobeHub is the harness and operator surface; Codex is the coding executor inside that harness.',
      granularModel:
        'Agents keep local skills, tool state, raw sessions, and working memory in their native runtimes.',
      projectionModel:
        'VANTA-Brain is a read-only reviewed projection vault until canonical AzA records and projection approval exist.',
      unifiedModel:
        'AzA should be the single canonical brain for durable typed records, provenance, permissions, search, MCP retrieval, and projection history.',
    },
    safety: {
      captured: [
        'node labels',
        'root paths',
        'layer roles',
        'protocol labels',
        'payload categories',
        'approval requirements',
        'blocked reasons',
        'evidence route names',
        'summary counts',
      ],
      excluded: [
        'raw source contents',
        'raw memory contents',
        'raw session transcripts',
        'raw skill bodies',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'private messages',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      activeManualEdges: edges.filter((edge) => edge.status === 'active_manual').length,
      activeReadOnlyEdges: edges.filter((edge) => edge.status === 'active_read_only').length,
      approvalRequiredEdges: edges.filter((edge) => edge.status === 'approval_required').length,
      blockedEdges: edges.filter((edge) => edge.status === 'blocked').length,
      contentStages: liveContentOpsMap.summary.contentStages,
      edges: edges.length,
      gates: gates.length,
      memorySources: liveMemoryIntakeFunnelMap.summary.sources,
      nodes: nodes.length,
      plannedEdges: edges.filter((edge) => edge.status === 'planned').length,
      teamRecordRoutes: liveTeamDataRoutingMap.summary.recordRoutes,
      workspaceDecisionsNeedingReconciliation:
        liveWorkspaceRootReconciliationMap.summary.decisionsNeedingReconciliation,
      writesAllowed: false,
    },
  };
};
