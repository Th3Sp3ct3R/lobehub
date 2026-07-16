import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  type AzaLiveAccessCapabilityMap,
  getAzaLiveAccessCapabilityMap,
} from './liveAccessCapabilityMap';
import { type AzaLiveAgentFleetMap, getAzaLiveAgentFleetMap } from './liveAgentFleetMap';
import { type AzaLiveAppMap, getAzaLiveAppMap } from './liveAppMap';
import {
  type AzaLiveArchitectureDataFlowMap,
  getAzaLiveArchitectureDataFlowMap,
} from './liveArchitectureDataFlowMap';
import {
  type AzaLiveAzaImplementationMap,
  getAzaLiveAzaImplementationMap,
} from './liveAzaImplementationMap';
import {
  type AzaLiveVerificationRunbookMap,
  getAzaLiveVerificationRunbookMap,
} from './liveAzaVerificationRunbookMap';
import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { type AzaLiveCodexHarnessMap, getAzaLiveCodexHarnessMap } from './liveCodexHarnessMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import {
  type AzaLiveCommandRecordSchemaMap,
  getAzaLiveCommandRecordSchemaMap,
} from './liveCommandRecordSchemaMap';
import {
  type AzaLiveCommunicationProtocolMap,
  getAzaLiveCommunicationProtocolMap,
} from './liveCommunicationProtocolMap';
import {
  type AzaLiveContentAppAuditMap,
  getAzaLiveContentAppAuditMap,
} from './liveContentAppAuditMap';
import { type AzaLiveContentOpsMap, getAzaLiveContentOpsMap } from './liveContentOpsMap';
import {
  type AzaLiveDailyCommandWorkflowMap,
  getAzaLiveDailyCommandWorkflowMap,
} from './liveDailyCommandWorkflowMap';
import { type AzaLiveGtmMap, getAzaLiveGtmMap } from './liveGtmMap';
import { type AzaLiveMcpToolingMap, getAzaLiveMcpToolingMap } from './liveMcpToolingMap';
import {
  type AzaLiveMemoryIntakeFunnelMap,
  getAzaLiveMemoryIntakeFunnelMap,
} from './liveMemoryIntakeFunnelMap';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './liveMemoryMap';
import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './liveOperatingBoard';
import { type AzaLiveProjectMap, getAzaLiveProjectMap } from './liveProjectMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './liveServiceMap';
import {
  type AzaLiveTeamDataRoutingMap,
  getAzaLiveTeamDataRoutingMap,
} from './liveTeamDataRoutingMap';
import {
  type AzaLiveVantaBrainCoverageMap,
  getAzaLiveVantaBrainCoverageMap,
} from './liveVantaBrainCoverageMap';
import {
  type AzaLiveWorkspaceRootReconciliationMap,
  getAzaLiveWorkspaceRootReconciliationMap,
} from './liveWorkspaceRootReconciliationMap';

type JsonRecord = Record<string, unknown>;

type RootKind = 'directory' | 'file' | 'missing' | 'other';

export type SystemRootCheck = {
  exists: boolean;
  id: string;
  kind: RootKind;
  label: string;
  modifiedAt: string | null;
  path: string;
  role: string;
  writePolicy: string;
};

export type SystemLayerStatus =
  | 'blocked'
  | 'inventory-only'
  | 'live-read-only'
  | 'missing'
  | 'present-write-gated'
  | 'projection-read-only';

export type SystemLayer = {
  evidence: string[];
  id: string;
  name: string;
  owns: string[];
  readsFrom: string[];
  role: string;
  roots: string[];
  status: SystemLayerStatus;
  writesTo: string[];
};

export type SystemEdge = {
  approval: string;
  channel: string;
  evidence: string[];
  from: string;
  id: string;
  status: 'active' | 'blocked' | 'draft' | 'planned' | 'snapshot';
  to: string;
};

export type AzaLiveSystemMap = {
  appAndContent: {
    appCount: number;
    appInventoryFields: string[];
    contentStageCount: number;
    installedAppCount: number;
    privacyExcluded: string[];
    visibleAppCount: number;
  };
  generatedAt: string;
  layers: SystemLayer[];
  links: SystemEdge[];
  memoryDecision: {
    canonicalLayer: string;
    decision: string;
    granularLayer: string;
    promotionRule: string;
  };
  mode: 'read_only_system_map';
  rootChecks: SystemRootCheck[];
  sourceArtifacts: string[];
  summary: {
    boardBlockedCards: number;
    boardLiveOperatingRecordCount: number;
    boardLiveOperatingRecordProof: boolean;
    boardLiveOperatingRecordTypesExpected: number;
    boardLiveOperatingRecordTypesFound: number;
    boardTotalCards: number;
    accessCapabilityAccountLabelsKnown: number;
    accessCapabilityApprovalRequiredSurfaces: number;
    accessCapabilityAuditRequiredSurfaces: number;
    accessCapabilityAuthPointersKnown: number;
    accessCapabilityBlockedSurfaces: number;
    accessCapabilityBrowserSurfaces: number;
    accessCapabilityReadySurfaces: number;
    accessCapabilitySurfaces: number;
    accessCapabilityVisibleSurfaces: number;
    agentFleetAgents: number;
    agentFleetArchangels: number;
    agentFleetCodexPipelineAgents: number;
    agentFleetGhostAgents: number;
    agentFleetNamespaceRoutes: number;
    agentFleetSkillManifestFiles: number;
    agentFleetSkillRootDirectories: number;
    agentFleetSourcesPresent: number;
    architectureDataFlowActiveReadOnlyEdges: number;
    architectureDataFlowApprovalRequiredEdges: number;
    architectureDataFlowBlockedEdges: number;
    architectureDataFlowEdges: number;
    architectureDataFlowGates: number;
    architectureDataFlowNodes: number;
    azaImplementationApiCapabilities: number;
    azaImplementationDatabaseTables: number;
    azaImplementationEnvNames: number;
    azaImplementationFilesPresent: number;
    azaImplementationFilesTotal: number;
    azaImplementationHealthcheckServices: number;
    azaImplementationImplementedMcpTools: number;
    azaImplementationInitSqlMounts: number;
    azaImplementationMigrationFiles: number;
    azaImplementationPlaceholderMcpTools: number;
    azaImplementationPortBindings: number;
    azaImplementationRunningServices: number;
    azaImplementationServicesInCompose: number;
    azaImplementationServicesTotal: number;
    azaImplementationVolumes: number;
    azaVerificationApprovalRequiredSteps: number;
    azaVerificationBlockedSteps: number;
    azaVerificationPassedSteps: number;
    azaVerificationReadyToProbeSteps: number;
    azaVerificationServiceContracts: number;
    azaVerificationSteps: number;
    azaVerificationVanCommandSteps: number;
    brainAccessProfiles: number;
    brainBlockedPromotionSteps: number;
    brainNamespaces: number;
    brainPromotionSteps: number;
    brainSourceRootsPresent: number;
    canonicalStoreBlockedChecks: number;
    canonicalStoreRequiredEnvPresent: number;
    canonicalStoreRequiredEnvTotal: number;
    canonicalStoreSupportedDriver: boolean;
    canonicalStoreTotalChecks: number;
    codexHarnessActiveManualLanes: number;
    codexHarnessBlockedLanes: number;
    codexHarnessCodexAppPresent: boolean;
    codexHarnessDurableHandoffReady: boolean;
    codexHarnessPrimitives: number;
    commandRecordApprovalRequiredRecords: number;
    commandRecordBlockedRecords: number;
    commandRecordDurableWriteReady: boolean;
    commandRecordRecordTypes: number;
    commandRecordRequiredFields: number;
    communicationActiveManualProtocols: number;
    communicationApprovalRequiredProtocols: number;
    communicationBlockedProtocols: number;
    communicationLiveAzAApiAvailable: boolean;
    communicationLiveMcpAvailable: boolean;
    communicationProtocolCount: number;
    communicationSnapshotProtocols: number;
    commandApprovalRequiredGates: number;
    commandBlockedGates: number;
    commandPassedGates: number;
    commandTotalGates: number;
    contentAppAuditApprovalRequiredTargets: number;
    contentAppAuditBlockedTargets: number;
    contentAppAuditMissingAccountLabels: number;
    contentAppAuditMissingAuthPointers: number;
    contentAppAuditMissingEvidencePointers: number;
    contentAppAuditMissingMetadataSlots: number;
    contentAppAuditMissingOutputPaths: number;
    contentAppAuditMetadataSlots: number;
    contentAppAuditReadyForCaptureTargets: number;
    contentAppAuditTargets: number;
    contentApprovalQueue: number;
    contentAppBundleMetadataApps: number;
    contentAppChromeWebAppWrappers: number;
    contentAppTranslocatedApps: number;
    contentAppUnclassifiedApps: number;
    contentCandidateApps: number;
    contentOpsStages: number;
    contentWriteBackSteps: number;
    dailyCommandActiveManualStages: number;
    dailyCommandBlockedStages: number;
    dailyCommandCadences: number;
    dailyCommandCanonicalWriteReady: boolean;
    dailyCommandDurableBoardReady: boolean;
    dailyCommandDurableHandoffReady: boolean;
    dailyCommandHandoffs: number;
    dailyCommandStages: number;
    expectedAzAPortsMissing: number;
    gtmBoards: number;
    gtmLanes: number;
    gtmRecordTypes: number;
    gtmRequiredFields: number;
    installedAppCount: number;
    liveAzAReadAvailable: boolean;
    liveMcpAvailable: boolean;
    liveOperatingRecordCount: number;
    liveOperatingRecordProof: boolean;
    liveOperatingRecordTypesExpected: number;
    liveOperatingRecordTypesFound: number;
    listeningPortCount: number;
    memoryIntakeApprovalRequiredStages: number;
    memoryIntakeBlockedStages: number;
    memoryIntakeCanonicalWriteReady: boolean;
    memoryIntakeNamespaceRoutes: number;
    memoryIntakeProjectionReady: boolean;
    memoryIntakeSources: number;
    memoryIntakeStages: number;
    memoryRootsPresent: number;
    memoryRootsTotal: number;
    mcpAzaHealthy: boolean;
    mcpBlockedProofSteps: number;
    mcpClientConfigFiles: number;
    mcpClientConfigsPresent: number;
    mcpConfiguredServerNames: number;
    mcpImplementedToolCallsTotal: number;
    mcpImplementedToolCallsVerified: number;
    mcpImplementedTools: number;
    mcpLiveImplementedToolCallOk: boolean;
    mcpLiveImplementedToolCoverageOk: boolean;
    mcpLiveInitialized: boolean;
    mcpLivePlaceholderProbeOk: boolean;
    mcpLiveToolsListOk: boolean;
    mcpLiveToolsTotal: number;
    mcpPlaceholderTools: number;
    mcpReadyToProbeSteps: number;
    mcpToolingChannels: number;
    projectedVaultFiles: number;
    projectGitRepositories: number;
    projectPackageJsonProjects: number;
    projectRootsPresent: number;
    projectTopLevelDirectories: number;
    operatingRecordProofOk: boolean;
    operatingRecordTypesFound: number;
    operatingRecordTypesTotal: number;
    rootsPresent: number;
    rootsTotal: number;
    skillMarkdownFiles: number;
    staticArtifactsPresent: boolean;
    teamDataBlockedHandoffs: number;
    teamDataBlockedRecordRoutes: number;
    teamDataCanonicalWriteReady: boolean;
    teamDataDurableBoardReady: boolean;
    teamDataHandoffs: number;
    teamDataLanes: number;
    teamDataRecordRoutes: number;
    teamDataTeamOwners: number;
    vantaBrainCoverageCoveredTargets: number;
    vantaBrainCoveragePartialTargets: number;
    vantaBrainCoverageRootPresent: boolean;
    vantaBrainCoverageSourceRootsPresent: number;
    vantaBrainCoverageStaleTargets: number;
    vantaBrainCoverageTargets: number;
    visibleAppCount: number;
    workspaceRootActiveReadOnlyRoots: number;
    workspaceRootCommandHarnessPresent: boolean;
    workspaceRootDecisionsNeedingReconciliation: number;
    workspaceRootDesktopVanListenerCount: number;
    workspaceRootLegacyRootPresent: boolean;
    workspaceRootRootsPresent: number;
    workspaceRootRootsTotal: number;
    workspaceRootVanListenerCount: number;
    writesAllowed: false;
  };
};

const SYSTEM_ROOTS = [
  {
    id: 'lobehub',
    label: 'LobeHub harness',
    path: '/Users/growthgod/lobehub',
    role: 'AzA command center, approval UI, operator board, and artifact catalog.',
    writePolicy: 'Scoped command-center writes only after organization is explained.',
  },
  {
    id: 'van',
    label: 'VAN active runtime workspace',
    path: '/Users/growthgod/VAN',
    role: 'Active product repos, agent repos, AzA implementation, device adapters, and service code.',
    writePolicy: 'No writes without explicit target, reason, rollback, and approval.',
  },
  {
    id: 'aza-memory',
    label: 'AzA canonical brain target',
    path: '/Users/growthgod/VAN/aza_memory',
    role: 'Typed memory records, search indexes, MCP access, events, and projection pipeline.',
    writePolicy: 'Blocked until AzA API, MCP, durable store, schema, and redaction gates pass.',
  },
  {
    id: 'vanta-brain',
    label: 'VANTA-Brain projection vault',
    path: '/Users/growthgod/Documents/VANTA-Brain',
    role: 'Human-readable reviewed summaries, decisions, indexes, and safe projections.',
    writePolicy: 'Read-only during this pass.',
  },
  {
    id: 'codex-state',
    label: 'Codex local state',
    path: '/Users/growthgod/.codex',
    role: 'Codex goals, worktrees, skills, memories, rollouts, plugins, and execution evidence.',
    writePolicy: 'Runtime-native; promote durable facts into AzA with provenance.',
  },
  {
    id: 'agents-state',
    label: 'Agent skills root',
    path: '/Users/growthgod/.agents',
    role: 'Shared agent skills, prompts, and capability packages.',
    writePolicy: 'Index metadata first; do not blindly copy skill bodies into canonical memory.',
  },
  {
    id: 'hermes-state',
    label: 'Hermes runtime',
    path: '/Users/growthgod/.hermes',
    role: 'Hermes agents, skills, sessions, kanban, logs, memories, and runtime evidence.',
    writePolicy: 'Promote reviewed session facts into AzA with agent and session provenance.',
  },
  {
    id: 'applications',
    label: 'System applications',
    path: '/Applications',
    role: 'Desktop apps, Electron apps, browsers, content tools, device tools, and AI surfaces.',
    writePolicy: 'Inventory only until app, account, output folder, and action class are approved.',
  },
  {
    id: 'user-applications',
    label: 'User applications',
    path: '/Users/growthgod/Applications',
    role: 'User-scoped apps and URL handlers.',
    writePolicy: 'Inventory only unless a specific app write is approved.',
  },
  {
    id: 'desktop-van',
    label: 'Legacy Desktop/VAN runtime',
    path: '/Users/growthgod/Desktop/VAN',
    role: 'Legacy or alternate VANTA runtime path observed in service inventory.',
    writePolicy: 'Reconcile before routing tasks or writes through it.',
  },
] as const;

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const readJson = async (name: string): Promise<JsonRecord> => {
  const raw = await readFile(artifactPath(name), 'utf8');
  const parsed: unknown = JSON.parse(raw);

  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as JsonRecord)
    : {};
};

const recordArray = (value: unknown): JsonRecord[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is JsonRecord =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const checkRoot = async (root: (typeof SYSTEM_ROOTS)[number]): Promise<SystemRootCheck> => {
  try {
    const stats = await stat(root.path);
    const kind: RootKind = stats.isDirectory() ? 'directory' : stats.isFile() ? 'file' : 'other';

    return {
      exists: true,
      id: root.id,
      kind,
      label: root.label,
      modifiedAt: stats.mtime.toISOString(),
      path: root.path,
      role: root.role,
      writePolicy: root.writePolicy,
    };
  } catch {
    return {
      exists: false,
      id: root.id,
      kind: 'missing',
      label: root.label,
      modifiedAt: null,
      path: root.path,
      role: root.role,
      writePolicy: root.writePolicy,
    };
  }
};

const rootExists = (rootChecks: SystemRootCheck[], id: string) =>
  rootChecks.some((root) => root.id === id && root.exists);

const buildLayers = (
  rootChecks: SystemRootCheck[],
  readiness: AzaLiveReadiness,
  memoryMap: AzaLiveMemoryMap,
  appMap: AzaLiveAppMap,
  appCount: number,
): SystemLayer[] => [
  {
    evidence: ['/aza/live-readiness', '/aza/live-operating-board'],
    id: 'command-harness',
    name: 'LobeHub harness',
    owns: ['operator UI', 'approval surface', 'artifact catalog', 'derived boards'],
    readsFrom: ['public AzA artifacts', 'live readiness', 'operating board'],
    role: 'Main AzA command center layer.',
    roots: ['/Users/growthgod/lobehub'],
    status:
      rootExists(rootChecks, 'lobehub') && readiness.summary.artifactsPresent
        ? 'live-read-only'
        : 'missing',
    writesTo: ['approved LobeHub command-center files only'],
  },
  {
    evidence: ['/aza/van-project-root-inventory.json'],
    id: 'runtime-workspace',
    name: 'VAN runtime workspace',
    owns: ['product repos', 'agent repos', 'device adapters', 'service code'],
    readsFrom: ['filesystem metadata', 'repo markers', 'safe project inventory'],
    role: 'Active implementation and runtime layer.',
    roots: ['/Users/growthgod/VAN'],
    status: rootExists(rootChecks, 'van') ? 'present-write-gated' : 'missing',
    writesTo: ['blocked until explicit target approval'],
  },
  {
    evidence: ['/aza/aza-brain-readiness-audit.json', '/aza/live-readiness'],
    id: 'canonical-brain',
    name: 'AzA canonical brain',
    owns: ['typed records', 'search', 'MCP retrieval', 'projection history', 'permissions'],
    readsFrom: ['approved runtime sources', 'agent runtime summaries', 'GTM records'],
    role: 'Durable memory and retrieval plane after health and schema gates pass.',
    roots: ['/Users/growthgod/VAN/aza_memory'],
    status:
      readiness.summary.liveAzAReadAvailable || readiness.summary.liveMcpAvailable
        ? 'live-read-only'
        : 'blocked',
    writesTo: ['blocked canonical store until API, MCP, schema, redaction, and approval pass'],
  },
  {
    evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/aza-read-write-contract.json'],
    id: 'projection-vault',
    name: 'VANTA-Brain vault',
    owns: ['reviewed markdown summaries', 'decisions', 'safe indexes', 'projection notes'],
    readsFrom: ['approved AzA canonical records only'],
    role: 'Human-readable projection layer, not raw canonical memory.',
    roots: ['/Users/growthgod/Documents/VANTA-Brain'],
    status: rootExists(rootChecks, 'vanta-brain') ? 'projection-read-only' : 'missing',
    writesTo: ['blocked until canonical AzA record and explicit projection approval'],
  },
  {
    evidence: ['/aza/live-memory-map', '/aza/agent-memory-skill-inventory.json'],
    id: 'agent-runtimes',
    name: 'Agent runtimes and skills',
    owns: ['Codex state', 'Hermes sessions', 'agent skills', 'working context'],
    readsFrom: ['runtime-native stores'],
    role: 'Granular per-agent overlay layer.',
    roots: ['/Users/growthgod/.codex', '/Users/growthgod/.agents', '/Users/growthgod/.hermes'],
    status:
      rootExists(rootChecks, 'codex-state') &&
      rootExists(rootChecks, 'agents-state') &&
      rootExists(rootChecks, 'hermes-state') &&
      memoryMap.summary.rootsPresent > 0
        ? 'present-write-gated'
        : 'missing',
    writesTo: ['AzA promoted facts after sensitivity review'],
  },
  {
    evidence: [
      '/aza/live-app-map',
      '/aza/app-surface-inventory.json',
      '/aza/content-generation-app-registry.json',
    ],
    id: 'app-content-layer',
    name: 'Apps, webapps, and content surfaces',
    owns: [
      'generation tools',
      'browser surfaces',
      'voice tools',
      'publishing tools',
      'device apps',
    ],
    readsFrom: ['Computer app inventory', 'approved exports', 'reviewed artifacts'],
    role: 'Content generation and operation layer.',
    roots: ['/Applications', '/Users/growthgod/Applications'],
    status: appCount > 0 || appMap.summary.installedAppCount > 0 ? 'inventory-only' : 'missing',
    writesTo: ['draft artifacts and approved AzA asset records only'],
  },
];

const buildLinks = (
  readiness: AzaLiveReadiness,
  board: AzaLiveOperatingBoard,
  memoryMap: AzaLiveMemoryMap,
  serviceMap: AzaLiveServiceMap,
): SystemEdge[] => [
  {
    approval: 'none for read-only inspection',
    channel: 'Next route and public AzA artifacts',
    evidence: ['/aza', '/aza/live-readiness'],
    from: 'operator',
    id: 'operator-to-lobehub',
    status: readiness.summary.artifactsPresent ? 'active' : 'blocked',
    to: 'command-harness',
  },
  {
    approval: 'repo edits require path-aware user approval',
    channel: 'Codex terminal, code graph, filesystem, validation, and browser checks',
    evidence: ['current Codex session', '/aza/live-operating-board'],
    from: 'command-harness',
    id: 'lobehub-to-codex',
    status: 'active',
    to: 'codex-executor',
  },
  {
    approval: 'approval required before VAN writes',
    channel: 'read-only filesystem metadata and future project adapter',
    evidence: ['/aza/van-project-root-inventory.json'],
    from: 'codex-executor',
    id: 'codex-to-van',
    status: 'snapshot',
    to: 'runtime-workspace',
  },
  {
    approval: 'blocked until live API or MCP health and schema gates pass',
    channel: 'planned HTTP API and MCP',
    evidence: ['/aza/aza-brain-readiness-audit.json', '/aza/live-readiness'],
    from: 'command-harness',
    id: 'lobehub-to-aza',
    status:
      readiness.summary.liveAzAReadAvailable || readiness.summary.liveMcpAvailable
        ? 'draft'
        : 'blocked',
    to: 'canonical-brain',
  },
  {
    approval: 'explicit projection approval required',
    channel: 'planned projection worker',
    evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/aza-read-write-contract.json'],
    from: 'canonical-brain',
    id: 'aza-to-vanta-brain',
    status: readiness.summary.projectionToVantaBrainAllowed ? 'draft' : 'blocked',
    to: 'projection-vault',
  },
  {
    approval: 'sensitivity review required before promotion',
    channel: 'agent metadata and session-summary adapter',
    evidence: ['/aza/live-memory-map', '/aza/agent-memory-skill-inventory.json'],
    from: 'agent-runtimes',
    id: 'agents-to-aza',
    status:
      readiness.summary.canonicalWritesAllowed && memoryMap.summary.rootsPresent > 0
        ? 'draft'
        : 'blocked',
    to: 'canonical-brain',
  },
  {
    approval: 'human approval required for publishing or account-changing actions',
    channel: 'Computer inventory, reviewed captures, exports, screenshots, and asset records',
    evidence: ['/aza/app-surface-inventory.json', '/aza/content-generation-app-registry.json'],
    from: 'app-content-layer',
    id: 'apps-to-aza',
    status: 'planned',
    to: 'canonical-brain',
  },
  {
    approval: 'route only after service owner and cwd verification',
    channel: 'local HTTP, databases, model runtime, and CLI processes',
    evidence: ['/aza/live-service-map', '/aza/local-service-port-inventory.json'],
    from: 'local-services',
    id: 'services-to-command',
    status: serviceMap.summary.listenerCount > 0 ? 'snapshot' : 'blocked',
    to: 'command-harness',
  },
  {
    approval: 'use board evidence before marking work done',
    channel: 'derived operating board',
    evidence: ['/aza/live-operating-board'],
    from: 'command-harness',
    id: 'board-to-work',
    status: board.summary.totalCards > 0 ? 'active' : 'blocked',
    to: 'daily-command',
  },
];

export const getAzaLiveSystemMap = async (
  readiness?: AzaLiveReadiness,
  board?: AzaLiveOperatingBoard,
  serviceMap?: AzaLiveServiceMap,
  memoryMap?: AzaLiveMemoryMap,
  appMap?: AzaLiveAppMap,
  projectMap?: AzaLiveProjectMap,
  gtmMap?: AzaLiveGtmMap,
  commandGateMap?: AzaLiveCommandGateMap,
  canonicalStoreMap?: AzaLiveCanonicalStoreMap,
  codexHarnessMap?: AzaLiveCodexHarnessMap,
  commandRecordSchemaMap?: AzaLiveCommandRecordSchemaMap,
  communicationProtocolMap?: AzaLiveCommunicationProtocolMap,
  brainTopologyMap?: AzaLiveBrainTopologyMap,
  memoryIntakeFunnelMap?: AzaLiveMemoryIntakeFunnelMap,
  contentOpsMap?: AzaLiveContentOpsMap,
  contentAppAuditMap?: AzaLiveContentAppAuditMap,
  accessCapabilityMap?: AzaLiveAccessCapabilityMap,
  teamDataRoutingMap?: AzaLiveTeamDataRoutingMap,
  vantaBrainCoverageMap?: AzaLiveVantaBrainCoverageMap,
  dailyCommandWorkflowMap?: AzaLiveDailyCommandWorkflowMap,
  agentFleetMap?: AzaLiveAgentFleetMap,
  workspaceRootReconciliationMap?: AzaLiveWorkspaceRootReconciliationMap,
  architectureDataFlowMap?: AzaLiveArchitectureDataFlowMap,
  azaImplementationMap?: AzaLiveAzaImplementationMap,
  azaVerificationRunbookMap?: AzaLiveVerificationRunbookMap,
  mcpToolingMap?: AzaLiveMcpToolingMap,
): Promise<AzaLiveSystemMap> => {
  const [
    liveReadiness,
    liveServiceMap,
    liveMemoryMap,
    liveAppMap,
    liveProjectMap,
    appInventory,
    contentRegistry,
    rootChecks,
  ] = await Promise.all([
    readiness ?? getAzaLiveReadiness(),
    serviceMap ?? getAzaLiveServiceMap(),
    memoryMap ?? getAzaLiveMemoryMap(),
    appMap ?? getAzaLiveAppMap(),
    projectMap ?? getAzaLiveProjectMap(),
    readJson('app-surface-inventory.json'),
    readJson('content-generation-app-registry.json'),
    Promise.all(SYSTEM_ROOTS.map(checkRoot)),
  ]);
  const liveBoard = board ?? (await getAzaLiveOperatingBoard(liveReadiness));
  const liveGtmMap = gtmMap ?? (await getAzaLiveGtmMap(liveBoard));
  const liveCommandGateMap =
    commandGateMap ??
    (await getAzaLiveCommandGateMap({
      appMap: liveAppMap,
      board: liveBoard,
      gtmMap: liveGtmMap,
      memoryMap: liveMemoryMap,
      projectMap: liveProjectMap,
      readiness: liveReadiness,
      serviceMap: liveServiceMap,
    }));
  const liveBrainTopologyMap =
    brainTopologyMap ??
    (await getAzaLiveBrainTopologyMap({
      commandGateMap: liveCommandGateMap,
      memoryMap: liveMemoryMap,
      readiness: liveReadiness,
    }));
  const liveCanonicalStoreMap = canonicalStoreMap ?? (await getAzaLiveCanonicalStoreMap());
  const liveCodexHarnessMap =
    codexHarnessMap ??
    (await getAzaLiveCodexHarnessMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      commandGateMap: liveCommandGateMap,
    }));
  const liveCommandRecordSchemaMap =
    commandRecordSchemaMap ??
    (await getAzaLiveCommandRecordSchemaMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      codexHarnessMap: liveCodexHarnessMap,
      commandGateMap: liveCommandGateMap,
    }));
  const liveCommunicationProtocolMap =
    communicationProtocolMap ??
    (await getAzaLiveCommunicationProtocolMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      codexHarnessMap: liveCodexHarnessMap,
      commandRecordSchemaMap: liveCommandRecordSchemaMap,
      readiness: liveReadiness,
      serviceMap: liveServiceMap,
    }));
  const liveMemoryIntakeFunnelMap =
    memoryIntakeFunnelMap ??
    (await getAzaLiveMemoryIntakeFunnelMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      commandGateMap: liveCommandGateMap,
      commandRecordSchemaMap: liveCommandRecordSchemaMap,
      communicationProtocolMap: liveCommunicationProtocolMap,
      memoryMap: liveMemoryMap,
      topology: liveBrainTopologyMap,
    }));
  const liveContentOpsMap =
    contentOpsMap ??
    (await getAzaLiveContentOpsMap({
      appMap: liveAppMap,
      commandGateMap: liveCommandGateMap,
    }));
  const liveContentAppAuditMap =
    contentAppAuditMap ??
    (await getAzaLiveContentAppAuditMap({
      appMap: liveAppMap,
      commandGateMap: liveCommandGateMap,
      contentOpsMap: liveContentOpsMap,
    }));
  const liveAccessCapabilityMap =
    accessCapabilityMap ??
    (await getAzaLiveAccessCapabilityMap({
      contentAppAuditMap: liveContentAppAuditMap,
    }));
  const liveTeamDataRoutingMap =
    teamDataRoutingMap ??
    (await getAzaLiveTeamDataRoutingMap({
      board: liveBoard,
      canonicalStoreMap: liveCanonicalStoreMap,
      commandGateMap: liveCommandGateMap,
      commandRecordSchemaMap: liveCommandRecordSchemaMap,
      contentAppAuditMap: liveContentAppAuditMap,
      gtmMap: liveGtmMap,
      memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
    }));
  const liveVantaBrainCoverageMap =
    vantaBrainCoverageMap ??
    (await getAzaLiveVantaBrainCoverageMap({
      memoryMap: liveMemoryMap,
    }));
  const liveDailyCommandWorkflowMap =
    dailyCommandWorkflowMap ??
    (await getAzaLiveDailyCommandWorkflowMap({
      board: liveBoard,
      canonicalStoreMap: liveCanonicalStoreMap,
      codexHarnessMap: liveCodexHarnessMap,
      commandGateMap: liveCommandGateMap,
      commandRecordSchemaMap: liveCommandRecordSchemaMap,
      contentAppAuditMap: liveContentAppAuditMap,
      gtmMap: liveGtmMap,
      memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
      readiness: liveReadiness,
      teamDataRoutingMap: liveTeamDataRoutingMap,
      vantaBrainCoverageMap: liveVantaBrainCoverageMap,
    }));
  const liveAgentFleetMap =
    agentFleetMap ??
    (await getAzaLiveAgentFleetMap({
      memoryMap: liveMemoryMap,
      topology: liveBrainTopologyMap,
    }));
  const liveWorkspaceRootReconciliationMap =
    workspaceRootReconciliationMap ??
    (await getAzaLiveWorkspaceRootReconciliationMap({
      commandGateMap: liveCommandGateMap,
      projectMap: liveProjectMap,
      readiness: liveReadiness,
      serviceMap: liveServiceMap,
    }));
  const liveArchitectureDataFlowMap =
    architectureDataFlowMap ??
    (await getAzaLiveArchitectureDataFlowMap({
      brainTopologyMap: liveBrainTopologyMap,
      communicationProtocolMap: liveCommunicationProtocolMap,
      contentOpsMap: liveContentOpsMap,
      memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
      teamDataRoutingMap: liveTeamDataRoutingMap,
      workspaceRootReconciliationMap: liveWorkspaceRootReconciliationMap,
    }));
  const liveAzaImplementationMap =
    azaImplementationMap ??
    (await getAzaLiveAzaImplementationMap({
      serviceMap: liveServiceMap,
    }));
  const liveAzaVerificationRunbookMap =
    azaVerificationRunbookMap ??
    (await getAzaLiveVerificationRunbookMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      implementationMap: liveAzaImplementationMap,
      readiness: liveReadiness,
      serviceMap: liveServiceMap,
    }));
  const liveMcpToolingMap =
    mcpToolingMap ??
    (await getAzaLiveMcpToolingMap({
      implementationMap: liveAzaImplementationMap,
      readiness: liveReadiness,
    }));
  const apps = recordArray(appInventory.apps);
  const contentStages = recordArray(contentRegistry.contentStages);
  const privacy = getRecord(appInventory.privacy);

  return {
    appAndContent: {
      appCount: apps.length,
      appInventoryFields: [
        'identity',
        'purpose',
        'auth boundary',
        'input and output',
        'automation mode',
        'evidence',
      ],
      contentStageCount: contentStages.length,
      installedAppCount: liveAppMap.summary.installedAppCount,
      privacyExcluded: stringArray(privacy.excluded),
      visibleAppCount: liveAppMap.summary.visibleAppCount,
    },
    generatedAt: new Date().toISOString(),
    layers: buildLayers(rootChecks, liveReadiness, liveMemoryMap, liveAppMap, apps.length),
    links: buildLinks(liveReadiness, liveBoard, liveMemoryMap, liveServiceMap),
    memoryDecision: {
      canonicalLayer:
        'AzA stores durable typed records with provenance, permissions, search, MCP access, and projection history.',
      decision: 'Hybrid unified brain with granular agent overlays.',
      granularLayer:
        'Codex, Hermes, and specialized agents keep local skills, prompts, tools, raw sessions, and working context.',
      promotionRule:
        'Promote facts into AzA only after source path, agent, session, sensitivity, allowed readers, and verification evidence are attached.',
    },
    mode: 'read_only_system_map',
    rootChecks,
    sourceArtifacts: [
      '/aza/aza-pc-architecture.html',
      '/aza/aza-pc-architecture.architecture.json',
      '/aza/aza-pc-architecture.png',
      '/aza/app-surface-inventory.json',
      '/aza/content-generation-app-registry.json',
      '/aza/local-service-port-inventory.json',
      '/aza/agent-memory-skill-inventory.json',
      '/aza/van-project-root-inventory.json',
      '/aza/vanta-brain-readonly-audit.json',
      '/aza/aza-read-write-contract.json',
      '/aza/aza-brain-readiness-audit.json',
      '/aza/live-agent-access-matrix',
      '/aza/live-agent-fleet-map',
      '/aza/live-app-map',
      '/aza/live-approval-packet',
      '/aza/live-architecture-data-flow',
      '/aza/live-access-capability-map',
      '/aza/live-aza-implementation',
      '/aza/live-aza-durable-store-readiness',
      '/aza/live-aza-verification-runbook',
      '/aza/live-brain-topology',
      '/aza/live-browser-operating-sessions',
      '/aza/live-browser-task-tooling-map',
      '/aza/live-canonical-store',
      '/aza/live-codex-harness',
      '/aza/live-command-record-schema',
      '/aza/live-communication-protocols',
      '/aza/live-command-gates',
      '/aza/live-content-app-audit',
      '/aza/live-content-ops',
      '/aza/live-daily-command-workflow',
      '/aza/live-delivery-roadmap',
      '/aza/live-execution-sequence',
      '/aza/live-gtm-map',
      '/aza/live-implementation-proof',
      '/aza/live-goal-completion-audit',
      '/aza/live-memory-intake-funnel',
      '/aza/live-memory-map',
      '/aza/live-mcp-tooling-map',
      '/aza/live-ownership-resolution',
      '/aza/live-tooling-recommendation-plan',
      '/aza/live-readiness',
      '/aza/live-operating-board',
      '/aza/live-operating-records',
      '/aza/live-project-map',
      '/aza/live-service-map',
      '/aza/live-team-data-routing',
      '/aza/live-vanta-brain-coverage',
      '/aza/live-vanta-brain-diagnostics',
      '/aza/live-workspace-root-reconciliation',
    ],
    summary: {
      boardBlockedCards: liveBoard.summary.blockedCards,
      boardLiveOperatingRecordCount: liveBoard.summary.liveOperatingRecordCount,
      boardLiveOperatingRecordProof: liveBoard.summary.liveOperatingRecordProof,
      boardLiveOperatingRecordTypesExpected: liveBoard.summary.liveOperatingRecordTypesExpected,
      boardLiveOperatingRecordTypesFound: liveBoard.summary.liveOperatingRecordTypesFound,
      boardTotalCards: liveBoard.summary.totalCards,
      accessCapabilityAccountLabelsKnown: liveAccessCapabilityMap.summary.accountLabelsKnown,
      accessCapabilityApprovalRequiredSurfaces:
        liveAccessCapabilityMap.summary.approvalRequiredSurfaces,
      accessCapabilityAuditRequiredSurfaces: liveAccessCapabilityMap.summary.auditRequiredSurfaces,
      accessCapabilityAuthPointersKnown: liveAccessCapabilityMap.summary.authPointersKnown,
      accessCapabilityBlockedSurfaces: liveAccessCapabilityMap.summary.blockedSurfaces,
      accessCapabilityBrowserSurfaces: liveAccessCapabilityMap.summary.browserSurfaces,
      accessCapabilityReadySurfaces:
        liveAccessCapabilityMap.summary.readyReadOnlySurfaces +
        liveAccessCapabilityMap.summary.draftReadySurfaces +
        liveAccessCapabilityMap.summary.reviewedCaptureReadySurfaces,
      accessCapabilitySurfaces: liveAccessCapabilityMap.summary.surfaces,
      accessCapabilityVisibleSurfaces: liveAccessCapabilityMap.summary.visibleSurfaces,
      agentFleetAgents: liveAgentFleetMap.summary.hermesAgents,
      agentFleetArchangels: liveAgentFleetMap.summary.archangelAgents,
      agentFleetCodexPipelineAgents: liveAgentFleetMap.summary.codexPipelineAgents,
      agentFleetGhostAgents: liveAgentFleetMap.summary.ghostFleetAgents,
      agentFleetNamespaceRoutes: liveAgentFleetMap.summary.namespaceRoutes,
      agentFleetSkillManifestFiles: liveAgentFleetMap.summary.skillManifestFiles,
      agentFleetSkillRootDirectories: liveAgentFleetMap.summary.skillRootDirectories,
      agentFleetSourcesPresent: liveAgentFleetMap.summary.sourcesPresent,
      architectureDataFlowActiveReadOnlyEdges:
        liveArchitectureDataFlowMap.summary.activeReadOnlyEdges,
      architectureDataFlowApprovalRequiredEdges:
        liveArchitectureDataFlowMap.summary.approvalRequiredEdges,
      architectureDataFlowBlockedEdges: liveArchitectureDataFlowMap.summary.blockedEdges,
      architectureDataFlowEdges: liveArchitectureDataFlowMap.summary.edges,
      architectureDataFlowGates: liveArchitectureDataFlowMap.summary.gates,
      architectureDataFlowNodes: liveArchitectureDataFlowMap.summary.nodes,
      azaImplementationApiCapabilities: liveAzaImplementationMap.summary.apiCapabilities,
      azaImplementationDatabaseTables: liveAzaImplementationMap.summary.databaseTables,
      azaImplementationEnvNames: liveAzaImplementationMap.summary.envNames,
      azaImplementationFilesPresent: liveAzaImplementationMap.summary.filesPresent,
      azaImplementationFilesTotal: liveAzaImplementationMap.summary.filesTotal,
      azaImplementationHealthcheckServices: liveAzaImplementationMap.summary.healthcheckServices,
      azaImplementationImplementedMcpTools: liveAzaImplementationMap.summary.implementedMcpTools,
      azaImplementationInitSqlMounts: liveAzaImplementationMap.summary.initSqlMounts,
      azaImplementationMigrationFiles: liveAzaImplementationMap.summary.migrationFiles,
      azaImplementationPlaceholderMcpTools: liveAzaImplementationMap.summary.placeholderMcpTools,
      azaImplementationPortBindings: liveAzaImplementationMap.summary.portBindings,
      azaImplementationRunningServices: liveAzaImplementationMap.summary.runningServices,
      azaImplementationServicesInCompose: liveAzaImplementationMap.summary.servicesInCompose,
      azaImplementationServicesTotal: liveAzaImplementationMap.summary.servicesTotal,
      azaImplementationVolumes: liveAzaImplementationMap.summary.volumes,
      azaVerificationApprovalRequiredSteps:
        liveAzaVerificationRunbookMap.summary.approvalRequiredSteps,
      azaVerificationBlockedSteps: liveAzaVerificationRunbookMap.summary.blockedSteps,
      azaVerificationPassedSteps: liveAzaVerificationRunbookMap.summary.passedSteps,
      azaVerificationReadyToProbeSteps: liveAzaVerificationRunbookMap.summary.readyToProbeSteps,
      azaVerificationServiceContracts: liveAzaVerificationRunbookMap.summary.serviceContracts,
      azaVerificationSteps: liveAzaVerificationRunbookMap.summary.steps,
      azaVerificationVanCommandSteps: liveAzaVerificationRunbookMap.summary.vanCommandSteps,
      brainAccessProfiles: liveBrainTopologyMap.summary.accessProfiles,
      brainBlockedPromotionSteps: liveBrainTopologyMap.summary.blockedSteps,
      brainNamespaces: liveBrainTopologyMap.summary.namespaces,
      brainPromotionSteps: liveBrainTopologyMap.summary.promotionSteps,
      brainSourceRootsPresent: liveBrainTopologyMap.summary.sourceRootsPresent,
      canonicalStoreBlockedChecks: liveCanonicalStoreMap.summary.blockedChecks,
      canonicalStoreRequiredEnvPresent: liveCanonicalStoreMap.summary.requiredEnvPresent,
      canonicalStoreRequiredEnvTotal: liveCanonicalStoreMap.summary.requiredEnvTotal,
      canonicalStoreSupportedDriver: liveCanonicalStoreMap.summary.supportedDriver,
      canonicalStoreTotalChecks: liveCanonicalStoreMap.summary.totalChecks,
      codexHarnessActiveManualLanes: liveCodexHarnessMap.summary.activeManualLanes,
      codexHarnessBlockedLanes: liveCodexHarnessMap.summary.blockedLanes,
      codexHarnessCodexAppPresent: liveCodexHarnessMap.summary.codexAppPresent,
      codexHarnessDurableHandoffReady: liveCodexHarnessMap.summary.durableHandoffReady,
      codexHarnessPrimitives: liveCodexHarnessMap.summary.primitives,
      commandRecordApprovalRequiredRecords:
        liveCommandRecordSchemaMap.summary.approvalRequiredRecords,
      commandRecordBlockedRecords: liveCommandRecordSchemaMap.summary.blockedRecords,
      commandRecordDurableWriteReady: liveCommandRecordSchemaMap.summary.durableWriteReady,
      commandRecordRecordTypes: liveCommandRecordSchemaMap.summary.recordTypes,
      commandRecordRequiredFields: liveCommandRecordSchemaMap.summary.requiredFields,
      communicationActiveManualProtocols:
        liveCommunicationProtocolMap.summary.activeManualProtocols,
      communicationApprovalRequiredProtocols:
        liveCommunicationProtocolMap.summary.approvalRequiredProtocols,
      communicationBlockedProtocols: liveCommunicationProtocolMap.summary.blockedProtocols,
      communicationLiveAzAApiAvailable: liveCommunicationProtocolMap.summary.liveAzAApiAvailable,
      communicationLiveMcpAvailable: liveCommunicationProtocolMap.summary.liveMcpAvailable,
      communicationProtocolCount: liveCommunicationProtocolMap.summary.protocolCount,
      communicationSnapshotProtocols: liveCommunicationProtocolMap.summary.snapshotProtocols,
      commandApprovalRequiredGates: liveCommandGateMap.summary.approvalRequiredGates,
      commandBlockedGates: liveCommandGateMap.summary.blockedGates,
      commandPassedGates: liveCommandGateMap.summary.passedGates,
      commandTotalGates: liveCommandGateMap.summary.totalGates,
      contentAppAuditApprovalRequiredTargets:
        liveContentAppAuditMap.summary.approvalRequiredTargets,
      contentAppAuditBlockedTargets: liveContentAppAuditMap.summary.blockedTargets,
      contentAppAuditMissingAccountLabels: liveContentAppAuditMap.summary.missingAccountLabels,
      contentAppAuditMissingAuthPointers: liveContentAppAuditMap.summary.missingAuthPointers,
      contentAppAuditMissingEvidencePointers:
        liveContentAppAuditMap.summary.missingEvidencePointers,
      contentAppAuditMissingMetadataSlots: liveContentAppAuditMap.summary.missingMetadataSlots,
      contentAppAuditMissingOutputPaths: liveContentAppAuditMap.summary.missingOutputPaths,
      contentAppAuditMetadataSlots: liveContentAppAuditMap.summary.metadataSlots,
      contentAppAuditReadyForCaptureTargets: liveContentAppAuditMap.summary.readyForCaptureTargets,
      contentAppAuditTargets: liveContentAppAuditMap.summary.contentTargets,
      contentApprovalQueue: liveContentOpsMap.summary.appsNeedingApproval,
      contentAppBundleMetadataApps: liveAppMap.summary.bundleMetadataApps,
      contentAppChromeWebAppWrappers: liveAppMap.summary.browserWebAppWrappers,
      contentAppTranslocatedApps: liveAppMap.summary.translocatedApps,
      contentAppUnclassifiedApps: liveAppMap.summary.unclassifiedApps,
      contentCandidateApps: liveAppMap.summary.contentCandidateCount,
      contentOpsStages: liveContentOpsMap.summary.contentStages,
      contentWriteBackSteps: liveContentOpsMap.summary.writeBackSteps,
      dailyCommandActiveManualStages: liveDailyCommandWorkflowMap.summary.activeManualStages,
      dailyCommandBlockedStages: liveDailyCommandWorkflowMap.summary.blockedStages,
      dailyCommandCadences: liveDailyCommandWorkflowMap.summary.cadences,
      dailyCommandCanonicalWriteReady: liveDailyCommandWorkflowMap.summary.canonicalWriteReady,
      dailyCommandDurableBoardReady: liveDailyCommandWorkflowMap.summary.durableBoardReady,
      dailyCommandDurableHandoffReady: liveDailyCommandWorkflowMap.summary.durableHandoffReady,
      dailyCommandHandoffs: liveDailyCommandWorkflowMap.summary.handoffs,
      dailyCommandStages: liveDailyCommandWorkflowMap.summary.stages,
      expectedAzAPortsMissing: liveServiceMap.summary.azaPortsMissing,
      gtmBoards: liveGtmMap.summary.boards,
      gtmLanes: liveGtmMap.summary.lanes,
      gtmRecordTypes: liveGtmMap.summary.recordTypes,
      gtmRequiredFields: liveGtmMap.summary.requiredFields,
      installedAppCount: liveAppMap.summary.installedAppCount,
      liveAzAReadAvailable: liveReadiness.summary.liveAzAReadAvailable,
      liveMcpAvailable: liveReadiness.summary.liveMcpAvailable,
      liveOperatingRecordCount: liveBoard.summary.liveOperatingRecordCount,
      liveOperatingRecordProof: liveBoard.summary.liveOperatingRecordProof,
      liveOperatingRecordTypesExpected: liveBoard.summary.liveOperatingRecordTypesExpected,
      liveOperatingRecordTypesFound: liveBoard.summary.liveOperatingRecordTypesFound,
      listeningPortCount: liveServiceMap.summary.listenerCount,
      memoryIntakeApprovalRequiredStages: liveMemoryIntakeFunnelMap.summary.approvalRequiredStages,
      memoryIntakeBlockedStages: liveMemoryIntakeFunnelMap.summary.blockedStages,
      memoryIntakeCanonicalWriteReady: liveMemoryIntakeFunnelMap.summary.canonicalWriteReady,
      memoryIntakeNamespaceRoutes: liveMemoryIntakeFunnelMap.summary.namespaceRoutes,
      memoryIntakeProjectionReady: liveMemoryIntakeFunnelMap.summary.projectionReady,
      memoryIntakeSources: liveMemoryIntakeFunnelMap.summary.sources,
      memoryIntakeStages: liveMemoryIntakeFunnelMap.summary.stages,
      memoryRootsPresent: liveMemoryMap.summary.rootsPresent,
      memoryRootsTotal: liveMemoryMap.summary.rootsTotal,
      mcpAzaHealthy: liveMcpToolingMap.summary.azaMcpHealthy,
      mcpBlockedProofSteps: liveMcpToolingMap.summary.blockedProofSteps,
      mcpClientConfigFiles: liveMcpToolingMap.summary.clientConfigFiles,
      mcpClientConfigsPresent: liveMcpToolingMap.summary.clientConfigsPresent,
      mcpConfiguredServerNames: liveMcpToolingMap.summary.configuredServerNames,
      mcpImplementedToolCallsTotal: liveMcpToolingMap.summary.implementedToolCallsTotal,
      mcpImplementedToolCallsVerified: liveMcpToolingMap.summary.implementedToolCallsVerified,
      mcpImplementedTools: liveMcpToolingMap.summary.implementedTools,
      mcpLiveImplementedToolCallOk: liveMcpToolingMap.summary.liveImplementedToolCallOk,
      mcpLiveImplementedToolCoverageOk: liveMcpToolingMap.summary.liveImplementedToolCoverageOk,
      mcpLiveInitialized: liveMcpToolingMap.summary.liveMcpInitialized,
      mcpLivePlaceholderProbeOk: liveMcpToolingMap.summary.livePlaceholderProbeOk,
      mcpLiveToolsListOk: liveMcpToolingMap.summary.liveToolsListOk,
      mcpLiveToolsTotal: liveMcpToolingMap.summary.liveToolsTotal,
      mcpPlaceholderTools: liveMcpToolingMap.summary.placeholderTools,
      mcpReadyToProbeSteps: liveMcpToolingMap.summary.readyToProbeSteps,
      mcpToolingChannels: liveMcpToolingMap.summary.toolingChannels,
      projectedVaultFiles: liveMemoryMap.summary.projectionVaultFiles,
      projectGitRepositories: liveProjectMap.summary.gitRepositories,
      projectPackageJsonProjects: liveProjectMap.summary.packageJsonProjects,
      projectRootsPresent: liveProjectMap.summary.rootsPresent,
      projectTopLevelDirectories: liveProjectMap.summary.topLevelDirectories,
      operatingRecordProofOk: liveBoard.summary.liveOperatingRecordProof,
      operatingRecordTypesFound: liveBoard.summary.liveOperatingRecordTypesFound,
      operatingRecordTypesTotal: liveBoard.summary.liveOperatingRecordTypesExpected,
      rootsPresent: rootChecks.filter((root) => root.exists).length,
      rootsTotal: rootChecks.length,
      skillMarkdownFiles: liveMemoryMap.summary.skillMarkdownFiles,
      staticArtifactsPresent: liveReadiness.summary.artifactsPresent,
      teamDataBlockedHandoffs: liveTeamDataRoutingMap.summary.blockedHandoffs,
      teamDataBlockedRecordRoutes: liveTeamDataRoutingMap.summary.blockedRecordRoutes,
      teamDataCanonicalWriteReady: liveTeamDataRoutingMap.summary.canonicalWriteReady,
      teamDataDurableBoardReady: liveTeamDataRoutingMap.summary.durableBoardReady,
      teamDataHandoffs: liveTeamDataRoutingMap.handoffs.length,
      teamDataLanes: liveTeamDataRoutingMap.summary.lanes,
      teamDataRecordRoutes: liveTeamDataRoutingMap.summary.recordRoutes,
      teamDataTeamOwners: liveTeamDataRoutingMap.summary.teamOwners,
      vantaBrainCoverageCoveredTargets: liveVantaBrainCoverageMap.summary.coveredTargets,
      vantaBrainCoveragePartialTargets: liveVantaBrainCoverageMap.summary.partialTargets,
      vantaBrainCoverageRootPresent: liveVantaBrainCoverageMap.summary.rootPresent,
      vantaBrainCoverageSourceRootsPresent: liveVantaBrainCoverageMap.summary.sourceRootsPresent,
      vantaBrainCoverageStaleTargets: liveVantaBrainCoverageMap.summary.staleTargets,
      vantaBrainCoverageTargets: liveVantaBrainCoverageMap.summary.coverageTargets,
      visibleAppCount: liveAppMap.summary.visibleAppCount,
      workspaceRootActiveReadOnlyRoots:
        liveWorkspaceRootReconciliationMap.summary.activeReadOnlyRoots,
      workspaceRootCommandHarnessPresent:
        liveWorkspaceRootReconciliationMap.summary.commandHarnessPresent,
      workspaceRootDecisionsNeedingReconciliation:
        liveWorkspaceRootReconciliationMap.summary.decisionsNeedingReconciliation,
      workspaceRootDesktopVanListenerCount:
        liveWorkspaceRootReconciliationMap.summary.desktopVanListenerCount,
      workspaceRootLegacyRootPresent: liveWorkspaceRootReconciliationMap.summary.legacyRootPresent,
      workspaceRootRootsPresent: liveWorkspaceRootReconciliationMap.summary.rootsPresent,
      workspaceRootRootsTotal: liveWorkspaceRootReconciliationMap.summary.rootsTotal,
      workspaceRootVanListenerCount: liveWorkspaceRootReconciliationMap.summary.vanListenerCount,
      writesAllowed: false,
    },
  };
};
