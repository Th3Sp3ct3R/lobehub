import { type AzaLiveCommandGateMap } from './liveCommandGateMap';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './liveMemoryMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';

type TopologyStatus = 'approval_required' | 'blocked' | 'inventory_only' | 'passed' | 'planned';

export type BrainNamespace = {
  backingSources: string[];
  defaultReaders: string[];
  id: string;
  label: string;
  promotionRule: string;
  scope: string;
  status: TopologyStatus;
  writePolicy: string;
};

export type BrainAccessProfile = {
  allowedRecords: string[];
  canRead: string[];
  canWrite: string[];
  denied: string[];
  evidenceRequired: string[];
  id: string;
  label: string;
  requiresApprovalFor: string[];
};

export type BrainPromotionStep = {
  evidence: string[];
  gate: string;
  id: string;
  input: string;
  label: string;
  output: string;
  owner: string;
  status: TopologyStatus;
};

export type BrainSourceRoot = {
  id: string;
  indexPolicy: string;
  namespace: string;
  path: string;
  recordType: string;
  role: string;
  status: 'missing' | 'present';
  writePolicy: string;
};

export type AzaLiveBrainTopologyMap = {
  accessProfiles: BrainAccessProfile[];
  generatedAt: string;
  mode: 'read_only_live_brain_topology_map';
  namespaces: BrainNamespace[];
  promotionPipeline: BrainPromotionStep[];
  recommendedModel: {
    decision: 'hybrid_unified_brain_with_granular_agent_namespaces';
    granularLayer: string;
    projectionLayer: string;
    promotionRule: string;
    unifiedLayer: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceRoots: BrainSourceRoot[];
  summary: {
    accessProfiles: number;
    approvalRequiredSteps: number;
    blockedSteps: number;
    canonicalWritesAllowed: false;
    memoryRootsPresent: number;
    memoryRootsTotal: number;
    namespaces: number;
    passedSteps: number;
    promotionSteps: number;
    projectionWritesAllowed: false;
    sourceRootsPresent: number;
    writesAllowed: false;
  };
};

const statusForGate = (
  gateMap: AzaLiveCommandGateMap | undefined,
  id: string,
  fallback: TopologyStatus = 'blocked',
): TopologyStatus => {
  const status = gateMap?.gates.find((gate) => gate.id === id)?.status;

  if (!status) return fallback;

  return status === 'approval_required' ? 'approval_required' : status;
};

const rootNamespace = (rootId: string) => {
  if (rootId.includes('skill')) return 'skills';
  if (rootId.includes('session')) return 'sessions';
  if (rootId.includes('memories')) return 'agent_memory';
  if (rootId.includes('agents')) return 'agents';
  if (rootId === 'vanta-brain') return 'projection';

  return 'sources';
};

const buildSourceRoots = (memoryMap: AzaLiveMemoryMap): BrainSourceRoot[] =>
  memoryMap.roots.map((root) => ({
    id: root.id,
    indexPolicy: root.indexPolicy,
    namespace: rootNamespace(root.id),
    path: root.path,
    recordType: root.azARecordType,
    role: root.role,
    status: root.status,
    writePolicy:
      root.id === 'vanta-brain'
        ? 'Read-only projection inventory until explicit projection approval.'
        : 'Index metadata first; promote verified facts into AzA only after canonical write gates pass.',
  }));

const buildNamespaces = (
  memoryMap: AzaLiveMemoryMap,
  gateMap: AzaLiveCommandGateMap | undefined,
): BrainNamespace[] => [
  {
    backingSources: ['/Users/growthgod/VAN/aza_memory'],
    defaultReaders: ['human_operator', 'codex_executor', 'approved_agents'],
    id: 'canonical_core',
    label: 'AzA canonical core',
    promotionRule:
      'Only verified records with source path, agent, session, sensitivity, allowed readers, and evidence may enter the core.',
    scope:
      'Durable typed records, provenance, permissions, search indexes, MCP retrieval, audit events, and projection history.',
    status: statusForGate(gateMap, 'canonical_aza_writes'),
    writePolicy:
      'Blocked until AzA API, MCP, durable store, schema, redaction, and approval gates pass.',
  },
  {
    backingSources: memoryMap.roots
      .filter((root) => root.kind === 'skills' || root.kind === 'agent-definitions')
      .map((root) => root.path),
    defaultReaders: ['human_operator', 'codex_executor', 'owning_agent'],
    id: 'agent_capability_overlays',
    label: 'Agent capability overlays',
    promotionRule:
      'Index skill and agent metadata globally, but keep raw skill bodies and execution files in their native roots unless approved.',
    scope: 'Per-agent roles, tools, prompts, skills, and capability metadata.',
    status: memoryMap.summary.rootsPresent === memoryMap.summary.rootsTotal ? 'passed' : 'blocked',
    writePolicy:
      'Read metadata now; writes stay in the owning runtime until a specific change is approved.',
  },
  {
    backingSources: memoryMap.roots
      .filter((root) => root.kind === 'sessions' || root.kind.includes('memory'))
      .map((root) => root.path),
    defaultReaders: ['human_operator', 'codex_executor', 'owning_agent'],
    id: 'session_and_working_memory',
    label: 'Session and working-memory overlays',
    promotionRule:
      'Summarize raw sessions first, label sensitivity, then promote only decisions, facts, artifacts, and evidence pointers.',
    scope:
      'Codex memories, Hermes sessions, Hermes memories, rollout summaries, and temporary working context.',
    status:
      memoryMap.summary.hermesSessionFiles > 0 || memoryMap.summary.codexMemoryFiles > 0
        ? 'passed'
        : 'blocked',
    writePolicy:
      'Read counts and metadata now; do not bulk-ingest raw sessions into global memory.',
  },
  {
    backingSources: ['/Users/growthgod/lobehub', '/aza/live-brain-topology'],
    defaultReaders: ['human_operator', 'codex_executor'],
    id: 'command_context',
    label: 'LobeHub command context',
    promotionRule:
      'Commands become durable records only after target, owner, lane, sensitivity, approval status, and evidence are attached.',
    scope:
      'Operator UI, routed intents, read-only live maps, boards, approval states, and command evidence.',
    status: 'inventory_only',
    writePolicy:
      'Scoped LobeHub command-center writes only; no VAN or VANTA-Brain writes from this layer.',
  },
  {
    backingSources: ['/Users/growthgod/Documents/VANTA-Brain'],
    defaultReaders: ['human_operator', 'approved_agents'],
    id: 'projection_vault',
    label: 'VANTA-Brain projection vault',
    promotionRule:
      'Projection happens only after a canonical AzA record exists, redaction passes, and the exact destination is approved.',
    scope: 'Human-readable summaries, decisions, indexes, and reviewed documentation.',
    status: statusForGate(gateMap, 'vanta_brain_projection'),
    writePolicy: 'Read-only for this pass.',
  },
];

const buildAccessProfiles = (): BrainAccessProfile[] => [
  {
    allowedRecords: ['project', 'service', 'artifact', 'decision', 'evidence', 'task'],
    canRead: ['canonical_core', 'command_context', 'agent_capability_overlays'],
    canWrite: ['approved_lobehub_files', 'approved_workspace_files'],
    denied: [
      'raw_secret_material',
      'unapproved_vanta_brain_projection',
      'unapproved_browser_actions',
    ],
    evidenceRequired: ['file path', 'command output', 'test result', 'HTTP response', 'screenshot'],
    id: 'codex_executor',
    label: 'Codex coding executor',
    requiresApprovalFor: ['/Users/growthgod/VAN', 'browser/device actions', 'VANTA-Brain writes'],
  },
  {
    allowedRecords: ['agent', 'skill', 'session', 'memory_source', 'task', 'evidence'],
    canRead: ['owning_agent_overlay', 'approved_canonical_core', 'session_and_working_memory'],
    canWrite: ['owning_runtime_memory'],
    denied: ['other_agent_private_memory', 'raw_secret_material', 'customer_credentials'],
    evidenceRequired: ['agent id', 'session id', 'source path', 'sensitivity label'],
    id: 'agent_runtime',
    label: 'Hermes or specialized agent',
    requiresApprovalFor: [
      'cross-agent memory promotion',
      'customer-facing action',
      'filesystem writes',
    ],
  },
  {
    allowedRecords: ['offer', 'lead', 'pilot', 'content_campaign', 'task', 'evidence'],
    canRead: ['command_context', 'approved_gtm_records', 'approved_content_records'],
    canWrite: ['draft_records_after_schema_gate'],
    denied: ['private messages', 'raw lead credentials', 'cookies', 'tokens'],
    evidenceRequired: ['lane', 'owner', 'status', 'next action', 'source artifact'],
    id: 'gtm_content_operator',
    label: 'GTM and content operator',
    requiresApprovalFor: ['publishing', 'outbound messages', 'account-changing actions'],
  },
  {
    allowedRecords: ['all_non_secret_records'],
    canRead: ['all_namespaces'],
    canWrite: ['approval_decisions', 'scoped_manual_overrides'],
    denied: ['raw_secret_material_in_memory', 'unsafe bulk projections'],
    evidenceRequired: ['explicit approval', 'target path', 'rollback plan', 'verification method'],
    id: 'human_operator',
    label: 'Human operator',
    requiresApprovalFor: ['VAN writes', 'VANTA-Brain projection', 'browser/device actions'],
  },
];

const buildPromotionPipeline = (
  readiness: AzaLiveReadiness,
  gateMap: AzaLiveCommandGateMap | undefined,
  memoryMap: AzaLiveMemoryMap,
): BrainPromotionStep[] => [
  {
    evidence: ['/aza/live-memory-map', '/aza/live-project-map', '/aza/live-app-map'],
    gate: 'source_visible',
    id: 'capture_metadata',
    input: 'Agent roots, session roots, project roots, app surfaces, and command artifacts.',
    label: 'Capture safe metadata',
    output: 'Source pointers, counts, owner candidates, and artifact links.',
    owner: 'Codex',
    status: memoryMap.summary.rootsPresent === memoryMap.summary.rootsTotal ? 'passed' : 'blocked',
  },
  {
    evidence: ['/aza/live-brain-topology', '/aza/aza-read-write-contract.json'],
    gate: 'classification_model',
    id: 'classify_namespace',
    input: 'Metadata and candidate records.',
    label: 'Classify namespace, record type, and sensitivity',
    output:
      'Typed record envelope with namespace, sensitivity, allowed readers, and projection policy.',
    owner: 'AzA command center',
    status: 'inventory_only',
  },
  {
    evidence: ['/aza/live-command-gates'],
    gate: 'evidence_attached',
    id: 'verify_fact',
    input: 'Claim, route, project, app, memory, or GTM status.',
    label: 'Attach verification evidence',
    output: 'Verified or blocked record candidate.',
    owner: 'Codex',
    status: statusForGate(
      gateMap,
      'artifact_catalog_ready',
      readiness.summary.artifactsPresent ? 'passed' : 'blocked',
    ),
  },
  {
    evidence: ['/aza/live-readiness', '/aza/live-command-gates'],
    gate: 'canonical_aza_writes',
    id: 'canonical_write',
    input: 'Verified record candidate.',
    label: 'Write canonical AzA record',
    output: 'Durable AzA id with provenance, audit event, indexes, and permissions.',
    owner: 'AzA API or MCP adapter',
    status: readiness.summary.canonicalWritesAllowed
      ? 'passed'
      : statusForGate(gateMap, 'canonical_aza_writes'),
  },
  {
    evidence: ['/aza/live-command-gates', '/aza/vanta-brain-readonly-audit.json'],
    gate: 'human_projection_approval',
    id: 'project_to_vanta_brain',
    input: 'Canonical AzA record approved for projection.',
    label: 'Project reviewed summary',
    output: 'Reviewed markdown summary in VANTA-Brain.',
    owner: 'AzA projection worker',
    status: readiness.summary.projectionToVantaBrainAllowed
      ? 'passed'
      : statusForGate(gateMap, 'vanta_brain_projection'),
  },
];

export const getAzaLiveBrainTopologyMap = async ({
  commandGateMap,
  memoryMap,
  readiness,
}: {
  commandGateMap?: AzaLiveCommandGateMap;
  memoryMap?: AzaLiveMemoryMap;
  readiness?: AzaLiveReadiness;
} = {}): Promise<AzaLiveBrainTopologyMap> => {
  const [liveReadiness, liveMemoryMap, liveCommandGateMap] = await Promise.all([
    readiness ?? getAzaLiveReadiness(),
    memoryMap ?? getAzaLiveMemoryMap(),
    commandGateMap,
  ]);
  const sourceRoots = buildSourceRoots(liveMemoryMap);
  const namespaces = buildNamespaces(liveMemoryMap, liveCommandGateMap);
  const accessProfiles = buildAccessProfiles();
  const promotionPipeline = buildPromotionPipeline(
    liveReadiness,
    liveCommandGateMap,
    liveMemoryMap,
  );

  return {
    accessProfiles,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_brain_topology_map',
    namespaces,
    promotionPipeline,
    recommendedModel: {
      decision: 'hybrid_unified_brain_with_granular_agent_namespaces',
      granularLayer:
        'Agents keep local skills, prompts, tool state, raw sessions, and temporary working memory in their native roots.',
      projectionLayer:
        'VANTA-Brain remains a reviewed markdown projection vault, not the canonical database.',
      promotionRule:
        'Promote only verified facts, decisions, artifacts, and summaries into AzA with source, owner, session, sensitivity, readers, and evidence.',
      unifiedLayer:
        'AzA is the single canonical brain for durable typed records, provenance, permissions, search, MCP retrieval, and projection history.',
    },
    safety: {
      captured: [
        'namespace labels',
        'access profile labels',
        'record type names',
        'source root metadata',
        'promotion step labels',
        'live gate statuses',
        'summary counts',
      ],
      excluded: [
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
    sourceRoots,
    summary: {
      accessProfiles: accessProfiles.length,
      approvalRequiredSteps: promotionPipeline.filter((step) => step.status === 'approval_required')
        .length,
      blockedSteps: promotionPipeline.filter((step) => step.status === 'blocked').length,
      canonicalWritesAllowed: false,
      memoryRootsPresent: liveMemoryMap.summary.rootsPresent,
      memoryRootsTotal: liveMemoryMap.summary.rootsTotal,
      namespaces: namespaces.length,
      passedSteps: promotionPipeline.filter((step) => step.status === 'passed').length,
      promotionSteps: promotionPipeline.length,
      projectionWritesAllowed: false,
      sourceRootsPresent: sourceRoots.filter((root) => root.status === 'present').length,
      writesAllowed: false,
    },
  };
};
