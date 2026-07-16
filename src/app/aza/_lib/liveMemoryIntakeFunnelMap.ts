import {
  type AzaLiveAgentAccessMatrixMap,
  getAzaLiveAgentAccessMatrixMap,
} from './liveAgentAccessMatrixMap';
import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import {
  type AzaLiveCommandRecordSchemaMap,
  getAzaLiveCommandRecordSchemaMap,
} from './liveCommandRecordSchemaMap';
import {
  type AzaLiveCommunicationProtocolMap,
  getAzaLiveCommunicationProtocolMap,
} from './liveCommunicationProtocolMap';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './liveMemoryMap';

type IntakeStatus = 'active_read_only' | 'approval_required' | 'blocked' | 'modeled' | 'planned';

export type MemoryIntakeSource = {
  defaultReaders: string[];
  evidence: string[];
  id: string;
  label: string;
  namespace: string;
  nextAction: string;
  recordTypes: string[];
  sourcePath: string;
  status: IntakeStatus;
  writePolicy: string;
};

export type MemoryIntakeStage = {
  blockedBy: string[];
  evidence: string[];
  from: string;
  gate: string;
  id: string;
  input: string;
  label: string;
  output: string;
  owner: string;
  status: IntakeStatus;
  to: string;
};

export type MemoryNamespaceRoute = {
  accessProfileIds: string[];
  allowedReaders: string[];
  denied: string[];
  evidence: string[];
  id: string;
  label: string;
  namespace: string;
  projectionPolicy: string;
  sourceIds: string[];
  status: IntakeStatus;
};

export type AzaLiveMemoryIntakeFunnelMap = {
  generatedAt: string;
  mode: 'read_only_memory_intake_funnel_map';
  namespaceRoutes: MemoryNamespaceRoute[];
  recommendation: {
    decision: 'hybrid_unified_brain_with_granular_agent_session_overlays';
    granularLayer: string;
    intakeRule: string;
    projectionLayer: string;
    unifiedLayer: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sources: MemoryIntakeSource[];
  stages: MemoryIntakeStage[];
  summary: {
    activeReadOnlySources: number;
    activeReadOnlyStages: number;
    approvalRequiredSources: number;
    approvalRequiredStages: number;
    blockedSources: number;
    blockedStages: number;
    canonicalWriteReady: boolean;
    durableCommandRecordsReady: boolean;
    memoryRootsPresent: number;
    memoryRootsTotal: number;
    namespaceRoutes: number;
    projectionReady: boolean;
    sources: number;
    stages: number;
    writesAllowed: false;
  };
};

const rootById = (memoryMap: AzaLiveMemoryMap, id: string) =>
  memoryMap.roots.find((root) => root.id === id);

const rootPath = (memoryMap: AzaLiveMemoryMap, id: string, fallback: string) =>
  rootById(memoryMap, id)?.path ?? fallback;

const rootStatus = (memoryMap: AzaLiveMemoryMap, id: string): IntakeStatus =>
  rootById(memoryMap, id)?.status === 'present' ? 'active_read_only' : 'blocked';

const namespaceStatus = (topology: AzaLiveBrainTopologyMap, namespaceId: string): IntakeStatus => {
  const status = topology.namespaces.find((namespace) => namespace.id === namespaceId)?.status;

  if (status === 'passed' || status === 'inventory_only') return 'active_read_only';
  if (status === 'planned') return 'planned';
  if (status === 'approval_required') return 'approval_required';

  return 'blocked';
};

const protocolBlockers = (
  protocolMap: AzaLiveCommunicationProtocolMap,
  protocolId: string,
): string[] =>
  protocolMap.protocols.find((protocol) => protocol.id === protocolId)?.blockedBy ?? [];

const gateBlockers = (gateMap: AzaLiveCommandGateMap, gateId: string): string[] => {
  const gate = gateMap.gates.find((candidate) => candidate.id === gateId);

  if (!gate || gate.status === 'passed') return [];

  return [gate.reason];
};

const recordStatus = (schemaMap: AzaLiveCommandRecordSchemaMap, recordId: string): IntakeStatus => {
  const status = schemaMap.recordSchemas.find((record) => record.id === recordId)?.status;

  if (status === 'modeled') return 'modeled';
  if (status === 'planned') return 'planned';
  if (status === 'approval_required') return 'approval_required';

  return 'blocked';
};

const buildSources = ({
  accessMatrix,
  commandRecordSchemaMap,
  memoryMap,
}: {
  accessMatrix: AzaLiveAgentAccessMatrixMap;
  commandRecordSchemaMap: AzaLiveCommandRecordSchemaMap;
  memoryMap: AzaLiveMemoryMap;
}): MemoryIntakeSource[] => {
  const codexAccess = accessMatrix.matrix.find((row) => row.id === 'codex_executor');
  const agentAccess = accessMatrix.matrix.find((row) => row.id === 'agent_runtime');
  const gtmStatus = recordStatus(commandRecordSchemaMap, 'gtm_work_item');
  const contentStatus = recordStatus(commandRecordSchemaMap, 'content_operation');

  return [
    {
      defaultReaders: codexAccess?.canRead ?? ['command_context', 'agent_capability_overlays'],
      evidence: ['/aza/live-memory-map', '/aza/live-codex-harness'],
      id: 'codex_executor_state',
      label: 'Codex executor state and rollout memory',
      namespace: 'session_and_working_memory',
      nextAction:
        'Keep using Codex memories as execution evidence and promote only verified summaries into AzA.',
      recordTypes: ['session', 'memory_source', 'codex_execution_run', 'evidence_receipt'],
      sourcePath: '/Users/growthgod/.codex',
      status:
        rootStatus(memoryMap, 'codex-skills') === 'active_read_only' &&
        rootStatus(memoryMap, 'codex-memories') === 'active_read_only'
          ? 'active_read_only'
          : 'blocked',
      writePolicy: 'Runtime-native. Do not bulk-copy raw logs or rollout transcripts.',
    },
    {
      defaultReaders: ['human_operator', 'codex_executor', 'owning_agent'],
      evidence: ['/aza/live-memory-map', '/aza/live-brain-topology'],
      id: 'agent_skill_catalog',
      label: 'Agent skill catalog',
      namespace: 'agent_capability_overlays',
      nextAction: 'Index skill metadata, owner, source path, capability, and allowed agents.',
      recordTypes: ['skill', 'agent', 'access_profile'],
      sourcePath: rootPath(memoryMap, 'agent-skills', '/Users/growthgod/.agents/skills'),
      status: rootStatus(memoryMap, 'agent-skills'),
      writePolicy: 'Metadata only; raw skill bodies stay in their native roots until approved.',
    },
    {
      defaultReaders: agentAccess?.canRead ?? ['owning_agent_overlay', 'approved_canonical_core'],
      evidence: ['/aza/live-memory-map', '/aza/live-agent-access-matrix'],
      id: 'hermes_runtime_memory',
      label: 'Hermes agents, sessions, skills, and memories',
      namespace: 'session_and_working_memory',
      nextAction:
        'Summarize sessions, label sensitivity, and promote decisions or evidence instead of raw transcripts.',
      recordTypes: ['agent', 'skill', 'session', 'memory_source', 'task', 'evidence'],
      sourcePath: '/Users/growthgod/.hermes',
      status:
        rootStatus(memoryMap, 'hermes-agents') === 'active_read_only' &&
        rootStatus(memoryMap, 'hermes-sessions') === 'active_read_only'
          ? 'active_read_only'
          : 'blocked',
      writePolicy: 'Runtime-native. Cross-agent promotion requires sensitivity and access review.',
    },
    {
      defaultReaders: ['human_operator', 'codex_executor', 'approved_agents'],
      evidence: ['/aza/live-project-map', '/aza/aza-read-write-contract.json'],
      id: 'van_project_workspace',
      label: 'VAN project and runtime metadata',
      namespace: 'canonical_core',
      nextAction:
        'Represent each project as metadata first, then request approval before any VAN write.',
      recordTypes: ['project', 'artifact', 'decision', 'task', 'service'],
      sourcePath: '/Users/growthgod/VAN',
      status: 'approval_required',
      writePolicy: 'No writes without target path, reason, rollback, and explicit approval.',
    },
    {
      defaultReaders: ['human_operator', 'gtm_content_operator', 'codex_executor'],
      evidence: ['/aza/live-app-map', '/aza/live-content-ops'],
      id: 'content_app_surfaces',
      label: 'Webapp, Electron, voice, browser, and content surfaces',
      namespace: 'content_operations',
      nextAction:
        'Classify output folders, account labels, and automation mode before capture or publishing.',
      recordTypes: ['app_surface', 'content_campaign', 'asset', 'publish_event'],
      sourcePath: '/Applications and browser/Electron surfaces',
      status: contentStatus === 'approval_required' ? 'approval_required' : 'modeled',
      writePolicy:
        'Read-only, draft-only, reviewed-capture, approval-first, or blocked by action risk.',
    },
    {
      defaultReaders: ['human_operator', 'gtm_content_operator', 'codex_executor'],
      evidence: ['/aza/live-gtm-map', '/aza/live-operating-board'],
      id: 'gtm_team_records',
      label: 'GTM strategy, team boards, offers, pilots, and daily command data',
      namespace: 'gtm_operations',
      nextAction:
        'Turn modeled lanes into durable AzA records only after canonical write gates pass.',
      recordTypes: ['offer', 'lead', 'pilot', 'content_campaign', 'task', 'daily_command_log'],
      sourcePath: '/Users/growthgod/lobehub/public/aza/gtm-team-operating-model.json',
      status: gtmStatus === 'blocked' ? 'blocked' : 'modeled',
      writePolicy: 'Schema modeled now; durable GTM writes are blocked until AzA is live.',
    },
    {
      defaultReaders: ['human_operator', 'approved_agents'],
      evidence: ['/aza/live-memory-map', '/aza/vanta-brain-readonly-audit.json'],
      id: 'vanta_brain_projection_vault',
      label: 'VANTA-Brain projection vault',
      namespace: 'projection_vault',
      nextAction:
        'Keep inventory read-only until canonical AzA records exist and projection is approved.',
      recordTypes: ['projection', 'decision', 'evidence', 'index'],
      sourcePath: rootPath(memoryMap, 'vanta-brain', '/Users/growthgod/Documents/VANTA-Brain'),
      status: rootStatus(memoryMap, 'vanta-brain'),
      writePolicy: 'Read-only during this pass.',
    },
  ];
};

const buildStages = ({
  canonicalStoreMap,
  commandGateMap,
  commandRecordSchemaMap,
  communicationProtocolMap,
  memoryMap,
}: {
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  commandGateMap: AzaLiveCommandGateMap;
  commandRecordSchemaMap: AzaLiveCommandRecordSchemaMap;
  communicationProtocolMap: AzaLiveCommunicationProtocolMap;
  memoryMap: AzaLiveMemoryMap;
}): MemoryIntakeStage[] => {
  const canonicalBlockedBy = [
    ...gateBlockers(commandGateMap, 'canonical_aza_writes'),
    ...(canonicalStoreMap.summary.blockedChecks > 0
      ? [`${canonicalStoreMap.summary.blockedChecks} canonical store checks are blocked.`]
      : []),
    ...(commandRecordSchemaMap.summary.durableWriteReady
      ? []
      : ['Durable command records are not ready.']),
  ];
  const mcpBlockedBy = protocolBlockers(communicationProtocolMap, 'lobehub_to_aza_mcp');
  const projectionBlockedBy = [
    ...gateBlockers(commandGateMap, 'vanta_brain_projection'),
    ...protocolBlockers(communicationProtocolMap, 'aza_to_vanta_brain_projection'),
  ];
  const allMemoryRootsPresent = memoryMap.summary.rootsPresent === memoryMap.summary.rootsTotal;

  return [
    {
      blockedBy: allMemoryRootsPresent ? [] : ['One or more configured memory roots are missing.'],
      evidence: ['/aza/live-memory-map'],
      from: 'runtime roots',
      gate: 'source_visible',
      id: 'discover_sources',
      input:
        'Codex, agent skills, Hermes, VAN, content apps, GTM artifacts, and VANTA-Brain roots.',
      label: 'Discover source roots',
      output: 'Source roster with path, namespace, status, and write policy.',
      owner: 'Codex',
      status: allMemoryRootsPresent ? 'active_read_only' : 'blocked',
      to: 'AzA intake funnel',
    },
    {
      blockedBy: [],
      evidence: ['/aza/live-brain-topology', '/aza/live-command-record-schema'],
      from: 'AzA intake funnel',
      gate: 'classification_model',
      id: 'classify_record_envelopes',
      input: 'Source roster and candidate record types.',
      label: 'Classify namespace and record envelope',
      output: 'Typed candidate with record type, owner, namespace, sensitivity, and readers.',
      owner: 'AzA command center',
      status: 'modeled',
      to: 'memory proposal queue',
    },
    {
      blockedBy: [],
      evidence: ['/aza/live-memory-map', '/aza/live-app-map', '/aza/live-project-map'],
      from: 'source roots',
      gate: 'safe_metadata_only',
      id: 'extract_safe_metadata',
      input: 'Paths, counts, modified windows, app names, safe markers, and artifact pointers.',
      label: 'Extract safe metadata',
      output: 'Metadata-only source facts; no raw contents or secrets.',
      owner: 'Codex',
      status: 'active_read_only',
      to: 'memory proposal queue',
    },
    {
      blockedBy:
        recordStatus(commandRecordSchemaMap, 'memory_promotion') === 'blocked'
          ? ['Memory promotion record is blocked by durable write readiness.']
          : [],
      evidence: ['/aza/live-command-record-schema'],
      from: 'memory proposal queue',
      gate: 'record_schema_defined',
      id: 'draft_memory_proposal',
      input: 'Metadata-only candidate plus source evidence.',
      label: 'Draft memory promotion proposal',
      output: 'memory_promotion candidate with source, owner, readers, and evidence ids.',
      owner: 'AzA command center',
      status: 'modeled',
      to: 'approval and sensitivity review',
    },
    {
      blockedBy: [],
      evidence: ['/aza/live-agent-access-matrix', '/aza/aza-read-write-contract.json'],
      from: 'memory proposal queue',
      gate: 'sensitivity_access_review',
      id: 'review_sensitivity_access',
      input: 'Record candidate, source path, owning agent, and intended readers.',
      label: 'Review sensitivity and access',
      output: 'Allowed readers, denied surfaces, approval state, and projection policy.',
      owner: 'Human operator',
      status: 'approval_required',
      to: 'verified candidate queue',
    },
    {
      blockedBy: [],
      evidence: ['/aza/live-command-gates', '/aza/live-implementation-proof'],
      from: 'approved candidate',
      gate: 'evidence_attached',
      id: 'verify_evidence',
      input: 'Claim, path, app, service, project, GTM, or memory assertion.',
      label: 'Attach verification evidence',
      output: 'Verified or blocked candidate with file, HTTP, command, screenshot, or API proof.',
      owner: 'Codex',
      status: 'active_read_only',
      to: 'canonical write gate',
    },
    {
      blockedBy: canonicalBlockedBy,
      evidence: ['/aza/live-canonical-store', '/aza/live-command-gates'],
      from: 'verified candidate queue',
      gate: 'canonical_aza_writes',
      id: 'write_canonical_aza_record',
      input: 'Verified typed record candidate.',
      label: 'Write canonical AzA record',
      output: 'Durable AzA id, provenance, audit event, permissions, and index target.',
      owner: 'AzA API or MCP adapter',
      status: canonicalBlockedBy.length === 0 ? 'planned' : 'blocked',
      to: 'AzA canonical brain',
    },
    {
      blockedBy: mcpBlockedBy,
      evidence: ['/aza/live-communication-protocols', '/aza/live-implementation-proof'],
      from: 'AzA canonical brain',
      gate: 'mcp_retrieval_verified',
      id: 'index_search_mcp_retrieval',
      input: 'Canonical AzA record.',
      label: 'Index for search, graph, and MCP retrieval',
      output: 'Searchable memory graph node and retrievable MCP record.',
      owner: 'AzA MCP adapter',
      status: mcpBlockedBy.length === 0 ? 'planned' : 'blocked',
      to: 'LobeHub and approved agents',
    },
    {
      blockedBy: projectionBlockedBy,
      evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-command-gates'],
      from: 'AzA canonical brain',
      gate: 'human_projection_approval',
      id: 'project_reviewed_summary',
      input: 'Canonical AzA record approved for human-readable projection.',
      label: 'Project reviewed summary to VANTA-Brain',
      output: 'Redacted markdown summary or index entry after explicit destination approval.',
      owner: 'AzA projection worker',
      status: projectionBlockedBy.length === 0 ? 'approval_required' : 'blocked',
      to: 'VANTA-Brain projection vault',
    },
  ];
};

const buildNamespaceRoutes = ({
  accessMatrix,
  topology,
}: {
  accessMatrix: AzaLiveAgentAccessMatrixMap;
  topology: AzaLiveBrainTopologyMap;
}): MemoryNamespaceRoute[] => {
  const namespaceReaders = (namespaceId: string) =>
    accessMatrix.namespaces.find((namespace) => namespace.id === namespaceId)?.readers ?? [];
  const deniedFor = (profileId: string) =>
    accessMatrix.matrix.find((profile) => profile.id === profileId)?.denied ?? [];

  return [
    {
      accessProfileIds: ['human_operator', 'codex_executor', 'approved_agents'],
      allowedReaders: namespaceReaders('canonical_core'),
      denied: deniedFor('codex_executor'),
      evidence: ['/aza/live-brain-topology', '/aza/live-agent-access-matrix'],
      id: 'canonical_core_route',
      label: 'Verified durable facts into canonical AzA',
      namespace: 'canonical_core',
      projectionPolicy: 'May project only after canonical id, redaction, evidence, and approval.',
      sourceIds: ['van_project_workspace', 'gtm_team_records', 'content_app_surfaces'],
      status: namespaceStatus(topology, 'canonical_core'),
    },
    {
      accessProfileIds: ['human_operator', 'codex_executor', 'agent_runtime'],
      allowedReaders: namespaceReaders('agent_capability_overlays'),
      denied: deniedFor('agent_runtime'),
      evidence: ['/aza/live-memory-map', '/aza/live-agent-access-matrix'],
      id: 'agent_capability_route',
      label: 'Agent and skill metadata into capability overlays',
      namespace: 'agent_capability_overlays',
      projectionPolicy: 'Project summaries only, not full skill bodies or hidden prompts.',
      sourceIds: ['agent_skill_catalog', 'hermes_runtime_memory', 'codex_executor_state'],
      status: namespaceStatus(topology, 'agent_capability_overlays'),
    },
    {
      accessProfileIds: ['human_operator', 'codex_executor', 'agent_runtime'],
      allowedReaders: namespaceReaders('session_and_working_memory'),
      denied: deniedFor('agent_runtime'),
      evidence: ['/aza/live-memory-map', '/aza/live-agent-access-matrix'],
      id: 'session_memory_route',
      label: 'Session summaries and promoted facts into working-memory overlays',
      namespace: 'session_and_working_memory',
      projectionPolicy: 'Project only reviewed decisions, facts, artifacts, and evidence pointers.',
      sourceIds: ['codex_executor_state', 'hermes_runtime_memory'],
      status: namespaceStatus(topology, 'session_and_working_memory'),
    },
    {
      accessProfileIds: ['human_operator', 'gtm_content_operator', 'codex_executor'],
      allowedReaders: ['human_operator', 'gtm_content_operator', 'codex_executor'],
      denied: deniedFor('gtm_content_operator'),
      evidence: ['/aza/live-content-ops', '/aza/live-command-record-schema'],
      id: 'content_operations_route',
      label: 'Content app outputs into asset and campaign records',
      namespace: 'content_operations',
      projectionPolicy: 'Project campaign learning only after review and analytics evidence.',
      sourceIds: ['content_app_surfaces', 'gtm_team_records'],
      status: 'approval_required',
    },
    {
      accessProfileIds: ['human_operator', 'gtm_content_operator', 'codex_executor'],
      allowedReaders: ['human_operator', 'gtm_content_operator', 'codex_executor'],
      denied: deniedFor('gtm_content_operator'),
      evidence: ['/aza/live-gtm-map', '/aza/live-operating-board'],
      id: 'gtm_operations_route',
      label: 'GTM lanes into offers, pilots, tasks, and daily command records',
      namespace: 'gtm_operations',
      projectionPolicy: 'Project public-safe GTM decisions and learnings after canonical storage.',
      sourceIds: ['gtm_team_records'],
      status: 'modeled',
    },
    {
      accessProfileIds: ['human_operator', 'approved_agents'],
      allowedReaders: namespaceReaders('projection_vault'),
      denied: ['raw_secret_material', 'unapproved_projection', 'raw_session_transcripts'],
      evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-brain-topology'],
      id: 'projection_vault_route',
      label: 'Reviewed canonical records into VANTA-Brain projections',
      namespace: 'projection_vault',
      projectionPolicy: 'Blocked during this pass until explicit projection approval.',
      sourceIds: ['vanta_brain_projection_vault'],
      status: namespaceStatus(topology, 'projection_vault'),
    },
  ];
};

export const getAzaLiveMemoryIntakeFunnelMap = async ({
  accessMatrix,
  canonicalStoreMap,
  commandGateMap,
  commandRecordSchemaMap,
  communicationProtocolMap,
  memoryMap,
  topology,
}: {
  accessMatrix?: AzaLiveAgentAccessMatrixMap;
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  commandGateMap?: AzaLiveCommandGateMap;
  commandRecordSchemaMap?: AzaLiveCommandRecordSchemaMap;
  communicationProtocolMap?: AzaLiveCommunicationProtocolMap;
  memoryMap?: AzaLiveMemoryMap;
  topology?: AzaLiveBrainTopologyMap;
} = {}): Promise<AzaLiveMemoryIntakeFunnelMap> => {
  const liveMemoryMap = memoryMap ?? (await getAzaLiveMemoryMap());
  const liveCommandGateMap =
    commandGateMap ?? (await getAzaLiveCommandGateMap({ memoryMap: liveMemoryMap }));
  const liveTopology =
    topology ??
    (await getAzaLiveBrainTopologyMap({
      commandGateMap: liveCommandGateMap,
      memoryMap: liveMemoryMap,
    }));
  const liveAccessMatrix =
    accessMatrix ??
    (await getAzaLiveAgentAccessMatrixMap({
      memoryMap: liveMemoryMap,
      topology: liveTopology,
    }));
  const liveCanonicalStoreMap = canonicalStoreMap ?? (await getAzaLiveCanonicalStoreMap());
  const liveCommandRecordSchemaMap =
    commandRecordSchemaMap ??
    (await getAzaLiveCommandRecordSchemaMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      commandGateMap: liveCommandGateMap,
    }));
  const liveCommunicationProtocolMap =
    communicationProtocolMap ??
    (await getAzaLiveCommunicationProtocolMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      commandRecordSchemaMap: liveCommandRecordSchemaMap,
    }));
  const sources = buildSources({
    accessMatrix: liveAccessMatrix,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    memoryMap: liveMemoryMap,
  });
  const stages = buildStages({
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    communicationProtocolMap: liveCommunicationProtocolMap,
    memoryMap: liveMemoryMap,
  });
  const namespaceRoutes = buildNamespaceRoutes({
    accessMatrix: liveAccessMatrix,
    topology: liveTopology,
  });
  const canonicalWriteReady =
    liveCanonicalStoreMap.summary.blockedChecks === 0 &&
    liveCanonicalStoreMap.summary.partialChecks === 0 &&
    liveCommandGateMap.summary.canonicalWritesAllowed &&
    liveCommandRecordSchemaMap.summary.durableWriteReady;

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_memory_intake_funnel_map',
    namespaceRoutes,
    recommendation: {
      decision: 'hybrid_unified_brain_with_granular_agent_session_overlays',
      granularLayer:
        'Codex, Hermes, apps, and specialized agents keep local skills, raw sessions, prompts, tools, and working memory in their native roots.',
      intakeRule:
        'Intake safe metadata first, draft typed proposals, review sensitivity and access, attach evidence, then write to AzA only after gates pass.',
      projectionLayer:
        'VANTA-Brain receives reviewed markdown projections only after canonical AzA records exist and the exact destination is approved.',
      unifiedLayer:
        'AzA is the single canonical brain for durable typed records, provenance, permissions, search, MCP retrieval, and projection history.',
    },
    safety: {
      captured: [
        'source categories',
        'source paths',
        'record type names',
        'namespace labels',
        'access profile ids',
        'promotion stage labels',
        'gate statuses',
        'blocker labels',
        'evidence artifact paths',
        'summary counts',
      ],
      excluded: [
        'raw memory contents',
        'raw session transcripts',
        'raw skill bodies',
        'browser tab contents',
        'private messages',
        'generated media contents',
        'database contents',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    sources,
    stages,
    summary: {
      activeReadOnlySources: sources.filter((source) => source.status === 'active_read_only')
        .length,
      activeReadOnlyStages: stages.filter((stage) => stage.status === 'active_read_only').length,
      approvalRequiredSources: sources.filter((source) => source.status === 'approval_required')
        .length,
      approvalRequiredStages: stages.filter((stage) => stage.status === 'approval_required').length,
      blockedSources: sources.filter((source) => source.status === 'blocked').length,
      blockedStages: stages.filter((stage) => stage.status === 'blocked').length,
      canonicalWriteReady,
      durableCommandRecordsReady: liveCommandRecordSchemaMap.summary.durableWriteReady,
      memoryRootsPresent: liveMemoryMap.summary.rootsPresent,
      memoryRootsTotal: liveMemoryMap.summary.rootsTotal,
      namespaceRoutes: namespaceRoutes.length,
      projectionReady:
        namespaceStatus(liveTopology, 'projection_vault') !== 'blocked' &&
        liveCommandGateMap.gates.find((gate) => gate.id === 'vanta_brain_projection')?.status ===
          'passed',
      sources: sources.length,
      stages: stages.length,
      writesAllowed: false,
    },
  };
};
