import {
  type AzaLiveBrowserOperatingSessionReadinessMap,
  getAzaLiveBrowserOperatingSessionReadinessMap,
} from './liveBrowserOperatingSessionReadinessMap';
import { getAzaLiveCanonicalStoreMap } from './liveCanonicalStoreMap';
import {
  type AzaLiveContentAppMetadataCollectionPlanMap,
  getAzaLiveContentAppMetadataCollectionPlanMap,
} from './liveContentAppMetadataCollectionPlanMap';
import {
  type AzaLiveGoalCompletionAuditMap,
  getAzaLiveGoalCompletionAuditMap,
} from './liveGoalCompletionAuditMap';
import {
  type AzaLiveGtmTeamOperatingStatusMap,
  getAzaLiveGtmTeamOperatingStatusMap,
} from './liveGtmTeamOperatingStatusMap';
import {
  type AzaLiveNativeApprovalAdapterMap,
  getAzaLiveNativeApprovalAdapterMap,
} from './liveNativeApprovalAdapterMap';
import { getAzaLiveOperatingRecordsMap } from './liveOperatingRecordsMap';
import { AZA_SERVICES } from './liveReadiness';
import {
  type AzaLiveVantaBrainCoverageMap,
  getAzaLiveVantaBrainCoverageMap,
} from './liveVantaBrainCoverageMap';

type GoalStatus = 'approval_required' | 'blocked' | 'complete' | 'partial' | 'ready';
type CompletionVerdict = 'blocked' | 'complete' | 'partial';

export type CurrentGoalStatusCard = {
  detail: string;
  evidence: string[];
  id: string;
  label: string;
  nextAction: string;
  status: GoalStatus;
};

export type CurrentGoalCompletionMatrixItem = {
  evidence: string[];
  evidenceCount: number;
  id: string;
  missingProof: string[];
  nextProof: string;
  primaryEvidence: string[];
  requirement: string;
  status: string;
  verdict: CompletionVerdict;
};

export type CurrentGoalProofQueueItem = {
  approvalRequired: boolean;
  blockedBy: string[];
  evidence: string[];
  id: string;
  owner: string;
  priority: number;
  proofToCollect: string;
  status: string;
  title: string;
};

export type CurrentGoalDurableRecordProof = {
  evidenceRecords: number;
  handoffRecords: number;
  operatingRecords: number;
  projectRecords: number;
  recordProofAvailable: boolean;
  taskRecords: number;
};

export type CurrentGoalMcpToolProof = {
  durableRecordReadProofAvailable: boolean;
  evidenceRecords: number;
  handoffRecords: number;
  implementedTools: number;
  listConversationRecords: number;
  mcpReadProofAvailable: boolean;
  operatingRecords: number;
  projectRecords: number;
  sessionEstablished: boolean;
  taskRecords: number;
  toolsListed: boolean;
  totalTools: number;
};

export type CurrentGoalLobeHubNativeReadProof = {
  liveOperatingRecordRouteAvailable: boolean;
  operatingRecordProof: boolean;
  operatingRecordTypesExpected: number;
  operatingRecordTypesFound: number;
  operatingRecordsVisible: number;
};

export type CurrentGoalServiceProof = {
  allExpectedServicesHealthy: boolean;
  apiReadyStoreMode: string;
  canonicalStoreBlockedChecks: number;
  canonicalStoreConnectionAttempted: boolean;
  canonicalStoreRequiredEnvPresent: number;
  canonicalStoreRequiredEnvTotal: number;
  durableRecordProof: CurrentGoalDurableRecordProof;
  liveAzAReadAvailable: boolean;
  liveMcpAvailable: boolean;
  lobeHubNativeReadProof: CurrentGoalLobeHubNativeReadProof;
  mcpToolProof: CurrentGoalMcpToolProof;
  serviceProofConclusion: string;
};

export type AzaLiveCurrentGoalStatusReportMap = {
  answer: {
    brainRecommendation: string;
    browserSessionRecommendation: string;
    conclusion: string;
    organizationBoundary: string;
  };
  generatedAt: string;
  mode: 'read_only_current_goal_status_report';
  nextActions: Array<{
    approvalRequired: boolean;
    evidence: string[];
    id: string;
    owner: string;
    step: string;
  }>;
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  browserOperatingSessionReadiness: AzaLiveBrowserOperatingSessionReadinessMap;
  completionMatrix: CurrentGoalCompletionMatrixItem[];
  nativeApprovalAdapter: AzaLiveNativeApprovalAdapterMap;
  proofQueue: CurrentGoalProofQueueItem[];
  serviceProof: CurrentGoalServiceProof;
  statusCards: CurrentGoalStatusCard[];
  requirementAudit: {
    blockedRuntimeRequirements: number;
    completeBoundaryRequirements: number;
    completeDesignRequirements: number;
    partialRequirements: number;
    requirements: number;
  };
  strictAggregate: {
    blockedSignals: number;
    browserSessionReady: boolean;
    canonicalWriteReady: boolean;
    contentMetadataReady: boolean;
    durableBoardReady: boolean;
    gtmReady: boolean;
    vantaBrainProjectionReady: boolean;
  };
  summary: {
    blockedRuntimeRequirements: number;
    browserAssistedCollectionPackets: number;
    browserIoBlockedChecks: number;
    browserManualVisibleAvailable: boolean;
    browserOperatingSessionIoPlanned: true;
    browserOperatingSessionReady: boolean;
    completeRequirements: number;
    contentCollectionPackets: number;
    contentMissingCollectionFields: number;
    goalComplete: false;
    gtmBlockedFocusItems: number;
    gtmFocusItems: number;
    partialRequirements: number;
    requirements: number;
    vantaBrainCoveredTargets: number;
    vantaBrainProjectionScanBlocked: boolean;
    vantaBrainRootPresent: boolean;
    writesAllowed: false;
  };
};

const completeRequirementCount = (audit: AzaLiveGoalCompletionAuditMap) =>
  audit.summary.completeBoundaryRequirements + audit.summary.completeDesignRequirements;

const blockerPreview = (audit: AzaLiveGoalCompletionAuditMap) => {
  const blockers = audit.requirements
    .flatMap((requirement) => requirement.remainingBlockers)
    .filter(Boolean);

  return [...new Set(blockers)].slice(0, 6);
};

const verdictForRequirement = (
  status: AzaLiveGoalCompletionAuditMap['requirements'][number]['status'],
): CompletionVerdict => {
  if (status.startsWith('complete')) return 'complete';
  if (status.startsWith('blocked')) return 'blocked';

  return 'partial';
};

const readAzaReadyStoreMode = (data: Record<string, unknown>) => {
  const store = data.store;

  if (typeof data.mode === 'string') return data.mode;
  if (store && typeof store === 'object' && 'mode' in store) {
    const nestedMode = (store as Record<string, unknown>).mode;

    if (typeof nestedMode === 'string') return nestedMode;
  }

  return 'unknown';
};

const probeAzaServiceHealth = async (port: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

const probeAzaReadyStoreMode = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch('http://127.0.0.1:8787/ready', {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    return readAzaReadyStoreMode(data);
  } catch {
    return 'unavailable';
  } finally {
    clearTimeout(timeout);
  }
};

const countAzaApiRecords = async (path: string, key: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`http://127.0.0.1:8787${path}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const records = data[key];

    return response.ok && Array.isArray(records) ? records.length : 0;
  } catch {
    return 0;
  } finally {
    clearTimeout(timeout);
  }
};

const MCP_PLACEHOLDER_TOOLS = [
  'semantic_search_messages',
  'find_related_conversations',
  'search_by_date_range',
  'search_by_provider',
  'search_by_project',
  'get_conversation_branch',
  'get_entity',
  'get_person_context',
  'get_topic_timeline',
  'list_decisions',
  'list_open_tasks',
  'list_preferences',
  'list_procedures',
  'find_conflicts',
  'get_active_assertions',
  'get_superseded_assertions',
  'analyze_conversation_set',
  'summarize_conversation',
  'extract_decisions',
  'extract_tasks',
  'propose_memory',
  'approve_memory',
  'reject_memory',
  'supersede_memory',
] as const;
const MCP_PLACEHOLDER_TOOL_SET = new Set<string>(MCP_PLACEHOLDER_TOOLS);
const MCP_TOOL_PROOF_CACHE_TTL_MS = 10_000;

let cachedMcpToolProof: {
  expiresAt: number;
  proof: CurrentGoalMcpToolProof;
} | null = null;

const emptyMcpToolProof = (): CurrentGoalMcpToolProof => ({
  durableRecordReadProofAvailable: false,
  evidenceRecords: 0,
  handoffRecords: 0,
  implementedTools: 0,
  listConversationRecords: 0,
  mcpReadProofAvailable: false,
  operatingRecords: 0,
  projectRecords: 0,
  sessionEstablished: false,
  taskRecords: 0,
  toolsListed: false,
  totalTools: 0,
});

const recordValue = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const parseMcpResponse = async (response: Response): Promise<Record<string, unknown>> => {
  const raw = await response.text();
  const trimmed = raw.trim();

  if (!trimmed) return {};
  if (trimmed.startsWith('{')) return recordValue(JSON.parse(trimmed));

  const dataLine = trimmed.split('\n').find((line) => line.startsWith('data:'));
  if (!dataLine) return {};

  return recordValue(JSON.parse(dataLine.slice(5).trim()));
};

const postMcp = async (body: Record<string, unknown>, sessionId?: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch('http://127.0.0.1:8788/mcp', {
      body: JSON.stringify(body),
      cache: 'no-store',
      headers: {
        'accept': 'application/json, text/event-stream',
        'content-type': 'application/json',
        ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
      },
      method: 'POST',
      signal: controller.signal,
    });

    return {
      data: await parseMcpResponse(response),
      ok: response.ok,
      sessionId: response.headers.get('mcp-session-id') ?? sessionId ?? null,
    };
  } catch {
    return {
      data: {},
      ok: false,
      sessionId: sessionId ?? null,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const countMcpToolRecords = async (
  sessionId: string,
  id: number,
  name: string,
  key: string,
): Promise<number> => {
  const response = await postMcp(
    {
      id,
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        arguments: { limit: 100, offset: 0 },
        name,
      },
    },
    sessionId,
  );
  const contentValue = recordValue(response.data.result).content;
  const contentArray = Array.isArray(contentValue)
    ? (contentValue as Array<Record<string, unknown>>)
    : [];
  const contentText = contentArray.find((item) => item.type === 'text')?.text;
  const records =
    typeof contentText === 'string' ? recordValue(JSON.parse(contentText))[key] : undefined;

  return response.ok && Array.isArray(records) ? records.length : 0;
};

const buildMcpToolProof = async (): Promise<CurrentGoalMcpToolProof> => {
  if (cachedMcpToolProof && cachedMcpToolProof.expiresAt > Date.now()) {
    return cachedMcpToolProof.proof;
  }

  const init = await postMcp({
    id: 1,
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      capabilities: {},
      clientInfo: { name: 'aza-current-goal-status-report', version: '0.1.0' },
      protocolVersion: '2025-03-26',
    },
  });
  const sessionId = init.sessionId;

  if (!init.ok || !sessionId) return emptyMcpToolProof();

  await postMcp({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }, sessionId);

  const toolsResponse = await postMcp(
    { id: 2, jsonrpc: '2.0', method: 'tools/list', params: {} },
    sessionId,
  );
  const toolsValue = recordValue(toolsResponse.data.result).tools;
  const toolArray = Array.isArray(toolsValue) ? (toolsValue as Array<Record<string, unknown>>) : [];
  const toolNames = toolArray
    .map((tool) => tool.name)
    .filter((name): name is string => typeof name === 'string');
  const implementedTools = toolNames.filter(
    (toolName) => !MCP_PLACEHOLDER_TOOL_SET.has(toolName),
  ).length;

  const listResponse = await postMcp(
    {
      id: 3,
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        arguments: { limit: 3, offset: 0 },
        name: 'list_conversations',
      },
    },
    sessionId,
  );
  const contentValue = recordValue(listResponse.data.result).content;
  const contentArray = Array.isArray(contentValue)
    ? (contentValue as Array<Record<string, unknown>>)
    : [];
  const contentText = contentArray.find((item) => item.type === 'text')?.text;
  const conversations =
    typeof contentText === 'string'
      ? recordValue(JSON.parse(contentText)).conversations
      : undefined;
  const listConversationRecords = Array.isArray(conversations) ? conversations.length : 0;
  const [projectRecords, taskRecords, operatingRecords, handoffRecords, evidenceRecords] =
    await Promise.all([
      countMcpToolRecords(sessionId, 4, 'list_projects', 'projects'),
      countMcpToolRecords(sessionId, 5, 'list_tasks', 'tasks'),
      countMcpToolRecords(sessionId, 6, 'list_operating_records', 'records'),
      countMcpToolRecords(sessionId, 7, 'list_handoffs', 'handoffs'),
      countMcpToolRecords(sessionId, 8, 'list_evidence', 'evidence'),
    ]);
  const durableRecordReadProofAvailable =
    projectRecords > 0 &&
    taskRecords > 0 &&
    operatingRecords > 0 &&
    handoffRecords > 0 &&
    evidenceRecords > 0;

  const proof = {
    durableRecordReadProofAvailable,
    evidenceRecords,
    handoffRecords,
    implementedTools,
    listConversationRecords,
    mcpReadProofAvailable: toolsResponse.ok && listResponse.ok && listConversationRecords > 0,
    operatingRecords,
    projectRecords,
    sessionEstablished: true,
    taskRecords,
    toolsListed: toolsResponse.ok && toolNames.length > 0,
    totalTools: toolNames.length,
  };

  cachedMcpToolProof = {
    expiresAt: Date.now() + MCP_TOOL_PROOF_CACHE_TTL_MS,
    proof,
  };

  return proof;
};

const buildDurableRecordProof = async (): Promise<CurrentGoalDurableRecordProof> => {
  const [projectRecords, taskRecords, operatingRecords, handoffRecords, evidenceRecords] =
    await Promise.all([
      countAzaApiRecords('/v1/projects?limit=100', 'projects'),
      countAzaApiRecords('/v1/tasks?limit=100', 'tasks'),
      countAzaApiRecords('/v1/operating-records?limit=100', 'records'),
      countAzaApiRecords('/v1/handoffs?limit=100', 'handoffs'),
      countAzaApiRecords('/v1/evidence?limit=100', 'evidence'),
    ]);

  return {
    evidenceRecords,
    handoffRecords,
    operatingRecords,
    projectRecords,
    recordProofAvailable:
      projectRecords > 0 &&
      taskRecords > 0 &&
      operatingRecords > 0 &&
      handoffRecords > 0 &&
      evidenceRecords > 0,
    taskRecords,
  };
};

const buildLobeHubNativeReadProof = async (): Promise<CurrentGoalLobeHubNativeReadProof> => {
  const operatingRecords = await getAzaLiveOperatingRecordsMap();

  return {
    liveOperatingRecordRouteAvailable: operatingRecords.summary.liveAzAOperatingRecordsAvailable,
    operatingRecordProof: operatingRecords.summary.operatingRecordProof,
    operatingRecordTypesExpected: operatingRecords.summary.expectedRecordTypes,
    operatingRecordTypesFound: operatingRecords.summary.expectedRecordTypesFound,
    operatingRecordsVisible: operatingRecords.summary.recordCount,
  };
};

const buildServiceProof = async (): Promise<CurrentGoalServiceProof> => {
  const [
    serviceChecks,
    canonicalStore,
    apiReadyStoreMode,
    durableRecordProof,
    mcpToolProof,
    lobeHubNativeReadProof,
  ] = await Promise.all([
    Promise.all(
      AZA_SERVICES.map(async (service) => ({
        healthy: await probeAzaServiceHealth(service.port),
        id: service.id,
      })),
    ),
    getAzaLiveCanonicalStoreMap(),
    probeAzaReadyStoreMode(),
    buildDurableRecordProof(),
    buildMcpToolProof(),
    buildLobeHubNativeReadProof(),
  ]);
  const allExpectedServicesHealthy = serviceChecks.every((service) => service.healthy);
  const liveAzAReadAvailable = serviceChecks.some(
    (service) => service.id === 'aza-api' && service.healthy,
  );
  const liveMcpAvailable = serviceChecks.some(
    (service) => service.id === 'aza-mcp' && service.healthy,
  );

  return {
    allExpectedServicesHealthy,
    apiReadyStoreMode,
    canonicalStoreBlockedChecks: canonicalStore.summary.blockedChecks,
    canonicalStoreConnectionAttempted: canonicalStore.summary.connectionAttempted,
    canonicalStoreRequiredEnvPresent: canonicalStore.summary.requiredEnvPresent,
    canonicalStoreRequiredEnvTotal: canonicalStore.summary.requiredEnvTotal,
    durableRecordProof,
    liveAzAReadAvailable,
    liveMcpAvailable,
    lobeHubNativeReadProof,
    mcpToolProof,
    serviceProofConclusion:
      liveAzAReadAvailable &&
      liveMcpAvailable &&
      apiReadyStoreMode === 'postgres' &&
      durableRecordProof.recordProofAvailable &&
      mcpToolProof.mcpReadProofAvailable
        ? mcpToolProof.durableRecordReadProofAvailable
          ? lobeHubNativeReadProof.operatingRecordProof
            ? 'AzA API, MCP, /ready postgres mode, durable project/task/operating/handoff/evidence reads, MCP durable record tools, and LobeHub operating-record read binding are live; remaining proof is native approvals, schema audit, and projection gates.'
            : 'AzA API, MCP, /ready postgres mode, durable project/task/operating/handoff/evidence reads, and MCP durable record tools are live; remaining proof is LobeHub native approvals, schema audit, and projection gates.'
          : 'AzA API, MCP, /ready postgres mode, durable project/task/operating/handoff/evidence reads, and MCP tools/list + list_conversations are live; remaining proof is LobeHub native approvals, broader MCP record coverage, schema audit, and projection gates.'
        : liveAzAReadAvailable &&
            liveMcpAvailable &&
            apiReadyStoreMode === 'postgres' &&
            durableRecordProof.recordProofAvailable
          ? 'AzA API, MCP, /ready postgres mode, and durable project/task/operating/handoff/evidence reads are live; remaining proof is LobeHub native approvals, MCP tool reads against the same records, schema audit, and projection gates.'
          : liveAzAReadAvailable && liveMcpAvailable && apiReadyStoreMode === 'postgres'
            ? 'AzA API, MCP, and /ready postgres mode are live; remaining proof is durable record reads, schema, shared-store write/read, durable board, evidence, and projection gates.'
            : 'AzA API, MCP, or /ready postgres mode still needs live proof before durable memory work.',
  };
};

const normalizeMissingProof = (proof: string, serviceProof: CurrentGoalServiceProof) => {
  const durableProof = serviceProof.durableRecordProof;
  const lobeHubProof = serviceProof.lobeHubNativeReadProof;
  const mcpProof = serviceProof.mcpToolProof;

  if (serviceProof.liveAzAReadAvailable && proof === 'AzA API is not verified live') {
    return 'AzA API is live; remaining proof is shared durable write/read behavior.';
  }
  if (serviceProof.liveMcpAvailable && proof === 'AzA MCP is not verified live') {
    if (mcpProof.durableRecordReadProofAvailable) {
      return `AzA MCP health and durable record tools are live (${mcpProof.projectRecords} projects, ${mcpProof.taskRecords} tasks, ${mcpProof.operatingRecords} operating, ${mcpProof.handoffRecords} handoffs, ${mcpProof.evidenceRecords} evidence); remaining proof is LobeHub approval binding.`;
    }
    if (mcpProof.mcpReadProofAvailable) {
      return 'AzA MCP health, tools/list, and list_conversations are live; remaining proof is MCP coverage for project/task/operating/handoff/evidence records.';
    }

    return 'AzA MCP health is live; remaining proof is implemented MCP retrieval coverage and shared-store reads.';
  }
  if (
    serviceProof.apiReadyStoreMode === 'postgres' &&
    proof.startsWith('canonical store is not durable yet')
  ) {
    return 'AzA /ready reports postgres; remaining proof is canonical schema, env, migration, shared API/MCP store, and durable writes.';
  }
  if (serviceProof.allExpectedServicesHealthy && proof === 'service gates are blocked') {
    if (mcpProof.durableRecordReadProofAvailable) {
      return 'AzA service health, API durable reads, and MCP durable record tools are visible; remaining proof is LobeHub env/schema/write gates and projection.';
    }

    return 'AzA service health gates are visible; remaining proof is database, MCP tool coverage, shared-store, durable writes, and projection.';
  }
  if (
    durableProof.recordProofAvailable &&
    proof === 'live AzA canonical records are not available'
  ) {
    if (lobeHubProof.operatingRecordProof) {
      return `LobeHub reads ${lobeHubProof.operatingRecordsVisible} live AzA operating records across ${lobeHubProof.operatingRecordTypesFound}/${lobeHubProof.operatingRecordTypesExpected} expected types; remaining proof is native approval/write binding.`;
    }

    return 'AzA API returns durable project, task, operating, handoff, and evidence records; remaining proof is LobeHub native consumption and approval wiring.';
  }
  if (
    durableProof.projectRecords > 0 &&
    durableProof.taskRecords > 0 &&
    proof === 'durable board records are not available'
  ) {
    return `AzA API returns durable board records (${durableProof.projectRecords} project, ${durableProof.taskRecords} tasks); remaining proof is native LobeHub board consumption.`;
  }
  if (
    durableProof.handoffRecords > 0 &&
    proof === 'durable Codex handoff records are not available'
  ) {
    return `AzA API returns ${durableProof.handoffRecords} durable Codex handoff record; remaining proof is LobeHub-to-Codex run tracking.`;
  }
  if (durableProof.evidenceRecords > 0 && proof === 'durable evidence records are not available') {
    return `AzA API returns ${durableProof.evidenceRecords} durable evidence record; remaining proof is approval-bound evidence capture across workflows.`;
  }
  if (
    durableProof.operatingRecords > 0 &&
    proof === 'durable operating records are not available'
  ) {
    if (lobeHubProof.operatingRecordProof) {
      return `LobeHub live-operating-records consumes ${lobeHubProof.operatingRecordsVisible} durable operating records; remaining proof is GTM/team approval write binding.`;
    }

    return `AzA API returns ${durableProof.operatingRecords} durable operating records; remaining proof is GTM/team UI binding.`;
  }
  if (durableProof.recordProofAvailable && proof === 'database proof is missing') {
    return 'AzA API Postgres record reads are proven; remaining proof is LobeHub canonical-store env, schema audit, and write-gate validation.';
  }
  if (
    durableProof.recordProofAvailable &&
    proof === 'API/MCP shared durable store proof is missing'
  ) {
    if (mcpProof.mcpReadProofAvailable) {
      return mcpProof.durableRecordReadProofAvailable
        ? lobeHubProof.operatingRecordProof
          ? 'AzA API durable records, MCP durable record tools, and LobeHub operating-record read binding are live; remaining proof is approval/write gating.'
          : 'AzA API durable records and MCP durable record tools read the same store; remaining proof is LobeHub binding and approval gating.'
        : 'AzA API durable records and MCP list_conversations read are proven; remaining proof is MCP tool coverage for every durable record type and LobeHub binding.';
    }

    return 'AzA API durable records exist and MCP health is live; remaining proof is MCP tool reads against the same records.';
  }
  if (
    mcpProof.mcpReadProofAvailable &&
    proof === 'MCP protocol/tool proof beyond health is missing'
  ) {
    return mcpProof.durableRecordReadProofAvailable
      ? lobeHubProof.operatingRecordProof
        ? `AzA MCP durable record tools and LobeHub operating-record read binding are live (${mcpProof.projectRecords} projects, ${mcpProof.taskRecords} tasks, ${mcpProof.operatingRecords} operating, ${mcpProof.handoffRecords} handoffs, ${mcpProof.evidenceRecords} evidence); remaining proof is native approval/write binding.`
        : `AzA MCP durable record tools are live (${mcpProof.projectRecords} projects, ${mcpProof.taskRecords} tasks, ${mcpProof.operatingRecords} operating, ${mcpProof.handoffRecords} handoffs, ${mcpProof.evidenceRecords} evidence); remaining proof is LobeHub native approval binding.`
      : 'AzA MCP tools/list and list_conversations are live; remaining proof is MCP coverage for project/task/operating/handoff/evidence records.';
  }
  if (
    lobeHubProof.operatingRecordProof &&
    proof === 'native LobeHub task/approval adapter is not wired'
  ) {
    return 'LobeHub native operating-record read binding is live; remaining proof is native task creation and approval write adapter.';
  }
  if (
    lobeHubProof.operatingRecordProof &&
    proof === 'browser-session input/output adapter is planned but not wired'
  ) {
    return 'LobeHub has live AzA operating-record reads; remaining proof is approval-gated browser-session IO capture and output binding.';
  }

  return proof;
};

const normalizeApprovalAdapterProof = (
  proof: string,
  nativeApprovalAdapter: AzaLiveNativeApprovalAdapterMap,
) => {
  if (
    nativeApprovalAdapter.summary.liveOperatingRecordReadBinding &&
    proof === 'native LobeHub task/approval adapter is not wired'
  ) {
    return `LobeHub native read binding and approval packet modeling are live; remaining proof is approval/write persistence. Adapter write ready=${nativeApprovalAdapter.summary.writeAdapterReady ? 'yes' : 'no'}.`;
  }

  return proof;
};

const normalizeBrowserSessionProof = (
  proof: string,
  browserReadiness: AzaLiveBrowserOperatingSessionReadinessMap,
) => {
  if (proof !== 'browser-session input/output adapter is planned but not wired') {
    return proof;
  }

  return browserReadiness.summary.liveOperatingRecordProof
    ? `Browser operating-session readiness is wired to the report: manual visible browser=${browserReadiness.summary.manualVisibleBrowserAvailable ? 'yes' : 'no'}, Chrome CDP=${browserReadiness.summary.chromeCdpHttpAvailable ? 'yes' : 'no'}, content surfaces=${browserReadiness.summary.contentSurfaces}, AzA operating-record feed=${browserReadiness.summary.liveOperatingRecordTypesFound}/${browserReadiness.summary.liveOperatingRecordTypesExpected}. Remaining proof is approved metadata capture and output binding.`
    : 'Browser operating-session readiness route exists, but AzA operating-record feed is not ready for input/output attachment.';
};

const buildCompletionMatrix = (
  audit: AzaLiveGoalCompletionAuditMap,
  serviceProof: CurrentGoalServiceProof,
  nativeApprovalAdapter: AzaLiveNativeApprovalAdapterMap,
  browserReadiness: AzaLiveBrowserOperatingSessionReadinessMap,
): CurrentGoalCompletionMatrixItem[] =>
  audit.requirements.map((requirement) => ({
    evidence: requirement.evidence,
    evidenceCount: requirement.evidence.length,
    id: requirement.id,
    missingProof:
      requirement.remainingBlockers.length > 0
        ? requirement.remainingBlockers.map((proof) =>
            normalizeApprovalAdapterProof(
              normalizeBrowserSessionProof(
                normalizeMissingProof(proof, serviceProof),
                browserReadiness,
              ),
              nativeApprovalAdapter,
            ),
          )
        : ['No missing proof recorded for the current boundary.'],
    nextProof: requirement.nextProof,
    primaryEvidence: requirement.evidence.slice(0, 5),
    requirement: requirement.requirement,
    status: requirement.status,
    verdict: verdictForRequirement(requirement.status),
  }));

const proofOwnerFor = (id: string) => {
  if (id.includes('gtm')) return 'GTM lead';
  if (id.includes('webapps') || id.includes('content')) return 'Content lead';
  if (id.includes('vanta_brain')) return 'Knowledge lead';
  if (id.includes('lobehub') || id.includes('codex')) return 'Command lead';
  if (id.includes('application')) return 'Engineering lead';
  if (id.includes('memory') || id.includes('brain')) return 'Memory architect';

  return 'Command owner';
};

const proofRequiresApproval = (item: CurrentGoalCompletionMatrixItem) =>
  item.id.includes('vanta_brain') ||
  item.id.includes('webapps') ||
  item.id.includes('do_not_write') ||
  item.missingProof.some((proof) => /approval|write|projection|browser|account/i.test(proof));

const buildProofQueue = (
  completionMatrix: CurrentGoalCompletionMatrixItem[],
): CurrentGoalProofQueueItem[] =>
  completionMatrix
    .filter((item) => item.verdict !== 'complete')
    .map((item) => ({
      approvalRequired: proofRequiresApproval(item),
      blockedBy: item.missingProof.slice(0, 5),
      evidence: item.primaryEvidence,
      id: item.id,
      owner: proofOwnerFor(item.id),
      priority: item.verdict === 'blocked' ? 1 : 2,
      proofToCollect: item.nextProof,
      status: item.status,
      title: item.requirement,
    }))
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        Number(b.approvalRequired) - Number(a.approvalRequired) ||
        a.title.localeCompare(b.title),
    );

const buildStrictAggregate = ({
  browserReadiness,
  contentPlan,
  gtmStatus,
  vantaCoverage,
}: {
  browserReadiness: AzaLiveBrowserOperatingSessionReadinessMap;
  contentPlan: AzaLiveContentAppMetadataCollectionPlanMap;
  gtmStatus: AzaLiveGtmTeamOperatingStatusMap;
  vantaCoverage: AzaLiveVantaBrainCoverageMap;
}): AzaLiveCurrentGoalStatusReportMap['strictAggregate'] => {
  const browserSessionReady =
    browserReadiness.summary.manualVisibleBrowserAvailable &&
    browserReadiness.summary.liveOperatingRecordProof;
  const contentMetadataReady = contentPlan.summary.missingCollectionFields === 0;
  const gtmReady =
    gtmStatus.summary.canonicalWriteReady &&
    gtmStatus.summary.durableBoardReady &&
    gtmStatus.summary.blockedFocusItems === 0;
  const vantaBrainProjectionReady =
    vantaCoverage.summary.rootPresent &&
    vantaCoverage.summary.coveredTargets === vantaCoverage.summary.coverageTargets &&
    !vantaCoverage.summary.projectionScanBlocked &&
    !vantaCoverage.summary.projectionScanTimedOut;
  const blockedSignals = [
    !browserSessionReady,
    !gtmStatus.summary.canonicalWriteReady,
    !gtmStatus.summary.durableBoardReady,
    !contentMetadataReady,
    !gtmReady,
    !vantaBrainProjectionReady,
  ].filter(Boolean).length;

  return {
    blockedSignals,
    browserSessionReady,
    canonicalWriteReady: gtmStatus.summary.canonicalWriteReady,
    contentMetadataReady,
    durableBoardReady: gtmStatus.summary.durableBoardReady,
    gtmReady,
    vantaBrainProjectionReady,
  };
};

const buildStatusCards = ({
  browserReadiness,
  contentPlan,
  goalAudit,
  gtmStatus,
  nativeApprovalAdapter,
  serviceProof,
  vantaCoverage,
}: {
  browserReadiness: AzaLiveBrowserOperatingSessionReadinessMap;
  contentPlan: AzaLiveContentAppMetadataCollectionPlanMap;
  goalAudit: AzaLiveGoalCompletionAuditMap;
  gtmStatus: AzaLiveGtmTeamOperatingStatusMap;
  nativeApprovalAdapter: AzaLiveNativeApprovalAdapterMap;
  serviceProof: CurrentGoalServiceProof;
  vantaCoverage: AzaLiveVantaBrainCoverageMap;
}): CurrentGoalStatusCard[] => {
  const blockers = blockerPreview(goalAudit).map((proof) =>
    normalizeMissingProof(proof, serviceProof),
  );

  return [
    {
      detail: `${goalAudit.summary.blockedRuntimeRequirements} runtime requirements are blocked, ${goalAudit.summary.partialRequirements} are partial, and ${completeRequirementCount(goalAudit)} are complete under the current boundary. Main blockers: ${blockers.length > 0 ? blockers.join('; ') : 'none reported'}.`,
      evidence: ['/aza/live-goal-completion-audit'],
      id: 'goal_status',
      label: 'Current goal status',
      nextAction:
        'Keep using live report endpoints until service, store, metadata, browser-session, and projection gates are proven.',
      status: goalAudit.summary.blockedRuntimeRequirements > 0 ? 'blocked' : 'partial',
    },
    {
      detail:
        'Information is organized as LobeHub command harness, Codex executor, AzA canonical brain/runtime, granular agent overlays, application/browser IO surfaces, and VANTA-Brain projection vault.',
      evidence: ['/aza/live-system-map', '/aza/live-ownership-resolution'],
      id: 'information_organization',
      label: 'Information organization',
      nextAction:
        'Before any future write, show the destination layer, source path, record type, owner, approval, and rollback.',
      status: 'complete',
    },
    {
      detail:
        'Use one unified AzA brain for durable memory, search, permissions, provenance, and projections, while each agent keeps scoped skills and working sessions until promoted.',
      evidence: ['/aza/live-brain-topology', '/aza/live-agent-access-matrix'],
      id: 'brain_model',
      label: 'Hybrid brain model',
      nextAction:
        'Verify live record-level access through AzA API/MCP before allowing agent memory writes.',
      status: 'ready',
    },
    {
      detail: `${contentPlan.summary.packets} app collection packets exist, with ${contentPlan.summary.browserAssistedPackets} browser-assisted packets and ${contentPlan.summary.missingCollectionFields} safe metadata fields still missing. Browser proof: manual visible browser=${browserReadiness.summary.manualVisibleBrowserAvailable ? 'yes' : 'no'}, Chrome CDP=${browserReadiness.summary.chromeCdpHttpAvailable ? 'yes' : 'no'}, content surfaces=${browserReadiness.summary.contentSurfaces}, operating-record feed=${browserReadiness.summary.liveOperatingRecordTypesFound}/${browserReadiness.summary.liveOperatingRecordTypesExpected}, blocked checks=${browserReadiness.summary.blockedChecks}.`,
      evidence: [
        '/aza/live-content-app-metadata-collection-plan',
        '/aza/live-browser-operating-sessions',
      ],
      id: 'browser_operating_sessions',
      label: 'Browser sessions as IO',
      nextAction:
        'Use logged-in browser sessions only to confirm visible account labels, export paths, output kinds, and evidence pointers after approval.',
      status:
        browserReadiness.summary.manualVisibleBrowserAvailable &&
        browserReadiness.summary.liveOperatingRecordProof
          ? 'approval_required'
          : 'blocked',
    },
    {
      detail: `${gtmStatus.summary.focusItems} GTM/team focus items are modeled, ${gtmStatus.summary.blockedFocusItems} are blocked, canonical write ready=${gtmStatus.summary.canonicalWriteReady ? 'yes' : 'no'}, durable board ready=${gtmStatus.summary.durableBoardReady ? 'yes' : 'no'}.`,
      evidence: ['/aza/live-gtm-team-operating-status', '/aza/live-team-data-routing'],
      id: 'gtm_team_data',
      label: 'GTM and team data',
      nextAction:
        'Operate GTM from LobeHub today, then promote only approved typed records when AzA write gates pass.',
      status: gtmStatus.summary.canonicalWriteReady ? 'partial' : 'blocked',
    },
    {
      detail: `LobeHub native read binding=${nativeApprovalAdapter.summary.liveOperatingRecordReadBinding ? 'yes' : 'no'}, operating records=${nativeApprovalAdapter.summary.operatingRecordsVisible}, record types=${nativeApprovalAdapter.summary.operatingRecordTypesFound}/${nativeApprovalAdapter.summary.operatingRecordTypesExpected}, approval packets=${nativeApprovalAdapter.summary.approvalRequiredPackets}, write adapter ready=${nativeApprovalAdapter.summary.writeAdapterReady ? 'yes' : 'no'}.`,
      evidence: ['/aza/live-native-approval-adapter', '/aza/live-operating-records'],
      id: 'native_approval_adapter',
      label: 'Native approval adapter',
      nextAction:
        'Keep reads live and wire approval/write persistence only after canonical store, schema, and explicit approval gates pass.',
      status: nativeApprovalAdapter.summary.writeAdapterReady ? 'ready' : 'blocked',
    },
    {
      detail: `VANTA-Brain root present=${vantaCoverage.summary.rootPresent ? 'yes' : 'no'}, covered targets=${vantaCoverage.summary.coveredTargets}/${vantaCoverage.summary.coverageTargets}, projection scan blocked=${vantaCoverage.summary.projectionScanBlocked ? 'yes' : 'no'}.`,
      evidence: ['/aza/live-vanta-brain-coverage'],
      id: 'vanta_brain_boundary',
      label: 'VANTA-Brain boundary',
      nextAction:
        'Keep VANTA-Brain read-only until canonical AzA records, redaction, destination path, and projection approval exist.',
      status: 'approval_required',
    },
  ];
};

export const getAzaLiveCurrentGoalStatusReportMap = async ({
  contentAppMetadataCollectionPlan,
  goalCompletionAudit,
  gtmTeamOperatingStatus,
  vantaBrainCoverage,
}: {
  contentAppMetadataCollectionPlan?: AzaLiveContentAppMetadataCollectionPlanMap;
  goalCompletionAudit?: AzaLiveGoalCompletionAuditMap;
  gtmTeamOperatingStatus?: AzaLiveGtmTeamOperatingStatusMap;
  vantaBrainCoverage?: AzaLiveVantaBrainCoverageMap;
} = {}): Promise<AzaLiveCurrentGoalStatusReportMap> => {
  const serviceProof = await buildServiceProof();
  const [
    goalAudit,
    contentPlan,
    gtmStatus,
    vantaCoverage,
    nativeApprovalAdapter,
    browserReadiness,
  ] = await Promise.all([
    goalCompletionAudit ?? getAzaLiveGoalCompletionAuditMap(),
    contentAppMetadataCollectionPlan ?? getAzaLiveContentAppMetadataCollectionPlanMap(),
    gtmTeamOperatingStatus ?? getAzaLiveGtmTeamOperatingStatusMap({ depth: 'summary' }),
    vantaBrainCoverage ?? getAzaLiveVantaBrainCoverageMap(),
    getAzaLiveNativeApprovalAdapterMap({ depth: 'summary' }),
    getAzaLiveBrowserOperatingSessionReadinessMap(),
  ]);
  const strictAggregate = buildStrictAggregate({
    browserReadiness,
    contentPlan,
    gtmStatus,
    vantaCoverage,
  });
  const completionMatrix = buildCompletionMatrix(
    goalAudit,
    serviceProof,
    nativeApprovalAdapter,
    browserReadiness,
  );

  return {
    answer: {
      brainRecommendation:
        'Use a hybrid model: AzA is the single canonical brain, while each agent keeps granular skills and session overlays until reviewed facts are promoted.',
      browserSessionRecommendation:
        'Browser operating sessions can facilitate inputs and outputs, but they should act as authenticated adapters, not memory. Store safe labels, paths, timestamps, and evidence pointers in AzA after approval.',
      conclusion:
        'The architecture and operating plan are organized enough to use from the AzA command center, but the goal is not complete because runtime writes, app metadata, browser-session capture, and VANTA-Brain projection remain gated.',
      organizationBoundary:
        'LobeHub is the harness, Codex is the coding executor, AzA is the canonical brain/runtime target, VAN is the active project workspace, and VANTA-Brain is read-only projection until explicitly approved.',
    },
    generatedAt: new Date().toISOString(),
    mode: 'read_only_current_goal_status_report',
    nextActions: [
      {
        approvalRequired: false,
        evidence: ['/aza/live-current-goal-status-report', '/aza/live-goal-completion-audit'],
        id: 'operate_from_report',
        owner: 'Human operator + Codex',
        step: 'Use this report as the daily command-center truth before choosing a write lane.',
      },
      {
        approvalRequired: true,
        evidence: ['/aza/live-content-app-metadata-collection-plan'],
        id: 'collect_safe_app_metadata',
        owner: 'Content lead',
        step: 'Approve safe browser/app metadata collection for account labels, auth pointer names, output paths, output kinds, and evidence pointers.',
      },
      {
        approvalRequired: true,
        evidence: ['/aza/live-browser-operating-sessions'],
        id: 'wire_browser_operating_sessions',
        owner: 'Command lead',
        step: 'Approve browser-session use as an input/output adapter before any capture, publishing, messaging, or account-changing workflow.',
      },
      {
        approvalRequired: true,
        evidence: ['/aza/live-vanta-brain-coverage'],
        id: 'approve_projection',
        owner: 'Knowledge lead',
        step: 'Approve a specific VANTA-Brain projection target only after AzA canonical records and redaction proof exist.',
      },
    ],
    safety: {
      captured: [
        'status labels',
        'summary counts',
        'safe blocker labels',
        'next action labels',
        'proof queue labels',
        'proof owner labels',
        'approval-required flags',
        'route evidence pointers',
        'write boundary labels',
      ],
      excluded: [
        'raw browser tabs',
        'browser local storage',
        'cookies',
        'OAuth tokens',
        'passwords',
        'private messages',
        'raw session transcripts',
        'raw skill bodies',
        'raw VANTA-Brain file contents',
        'generated content file contents',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-goal-completion-audit',
      '/aza/live-readiness',
      '/aza/live-aza-api-snapshot',
      '/aza/live-canonical-store',
      '/aza/live-native-approval-adapter',
      '/aza/live-system-map',
      '/aza/live-gtm-team-operating-status',
      '/aza/live-content-app-metadata-collection-plan',
      '/aza/live-browser-operating-sessions',
      '/aza/live-vanta-brain-coverage',
      '/aza/live-brain-topology',
      '/aza/live-agent-access-matrix',
    ],
    browserOperatingSessionReadiness: browserReadiness,
    completionMatrix,
    nativeApprovalAdapter,
    proofQueue: buildProofQueue(completionMatrix),
    serviceProof,
    statusCards: buildStatusCards({
      browserReadiness,
      contentPlan,
      goalAudit,
      gtmStatus,
      nativeApprovalAdapter,
      serviceProof,
      vantaCoverage,
    }),
    requirementAudit: {
      blockedRuntimeRequirements: goalAudit.summary.blockedRuntimeRequirements,
      completeBoundaryRequirements: goalAudit.summary.completeBoundaryRequirements,
      completeDesignRequirements: goalAudit.summary.completeDesignRequirements,
      partialRequirements: goalAudit.summary.partialRequirements,
      requirements: goalAudit.summary.requirements,
    },
    strictAggregate,
    summary: {
      blockedRuntimeRequirements: Math.max(
        goalAudit.summary.blockedRuntimeRequirements,
        strictAggregate.blockedSignals > 0 ? 1 : 0,
      ),
      browserAssistedCollectionPackets: contentPlan.summary.browserAssistedPackets,
      browserIoBlockedChecks: browserReadiness.summary.blockedChecks,
      browserManualVisibleAvailable: browserReadiness.summary.manualVisibleBrowserAvailable,
      browserOperatingSessionIoPlanned: true,
      browserOperatingSessionReady: strictAggregate.browserSessionReady,
      completeRequirements: completeRequirementCount(goalAudit),
      contentCollectionPackets: contentPlan.summary.packets,
      contentMissingCollectionFields: contentPlan.summary.missingCollectionFields,
      goalComplete: false,
      gtmBlockedFocusItems: gtmStatus.summary.blockedFocusItems,
      gtmFocusItems: gtmStatus.summary.focusItems,
      partialRequirements: goalAudit.summary.partialRequirements,
      requirements: goalAudit.summary.requirements,
      vantaBrainCoveredTargets: vantaCoverage.summary.coveredTargets,
      vantaBrainProjectionScanBlocked:
        vantaCoverage.summary.projectionScanBlocked || vantaCoverage.summary.projectionScanTimedOut,
      vantaBrainRootPresent: vantaCoverage.summary.rootPresent,
      writesAllowed: false,
    },
  };
};
