import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { getAzaLiveContentAppAuditMap } from './liveContentAppAuditMap';
import { getAzaLiveContentAppMetadataCollectionPlanMap } from './liveContentAppMetadataCollectionPlanMap';
import { getAzaLiveMcpToolingMap } from './liveMcpToolingMap';
import { getAzaLiveOperatingRecordsMap } from './liveOperatingRecordsMap';
import { getAzaLiveReadiness } from './liveReadiness';
import { type AzaLiveSystemMap } from './liveSystemMap';
import { getAzaLiveVantaBrainCoverageMap } from './liveVantaBrainCoverageMap';

type JsonRecord = Record<string, unknown>;
type GoalAuditSummary = Partial<AzaLiveSystemMap['summary']> & {
  azaReadyStoreMode?: string;
  mcpImplementedToolCallsTotal?: number;
  mcpImplementedToolCallsVerified?: number;
  mcpLiveImplementedToolCallOk?: boolean;
  mcpLiveImplementedToolCoverageOk?: boolean;
  mcpLivePlaceholderProbeOk?: boolean;
  mcpLiveToolsListOk?: boolean;
  contentAppAuditMetadataSlots?: number;
  contentAppAuditMissingMetadataSlots?: number;
  contentAppMetadataCollectionBrowserAssistedPackets?: number;
  contentAppMetadataCollectionMissingFields?: number;
  contentAppMetadataCollectionPackets?: number;
  liveOperatingRecordCount?: number;
  liveOperatingRecordProof?: boolean;
  liveOperatingRecordTypesExpected?: number;
  liveOperatingRecordTypesFound?: number;
  operatingRecordProofOk?: boolean;
  operatingRecordTypesFound?: number;
  operatingRecordTypesTotal?: number;
  vantaBrainCoverageProjectionScanBlocked?: number;
  vantaBrainCoverageProjectionScanTimedOut?: number;
};

type RequirementStatus =
  | 'blocked_runtime'
  | 'complete_boundary_current'
  | 'complete_design_current'
  | 'partial_live_model'
  | 'partial_static_model';

export type LiveGoalRequirement = {
  currentProof: string;
  evidence: string[];
  id: string;
  nextProof: string;
  remainingBlockers: string[];
  requirement: string;
  status: RequirementStatus;
};

export type AzaLiveGoalCompletionAuditMap = {
  generatedAt: string;
  goalComplete: false;
  mode: 'read_only_live_goal_completion_audit';
  overallStatus: 'active_goal_not_complete';
  requirements: LiveGoalRequirement[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    blockedRuntimeRequirements: number;
    completeBoundaryRequirements: number;
    completeDesignRequirements: number;
    goalComplete: false;
    partialRequirements: number;
    requirements: number;
    writesAllowed: false;
  };
};

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const readJson = async (name: string): Promise<JsonRecord> => {
  const raw = await readFile(artifactPath(name), 'utf8');
  const parsed: unknown = JSON.parse(raw);

  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as JsonRecord)
    : {};
};

const emptyRecord = (): JsonRecord => ({});

const recordArray = (value: unknown): JsonRecord[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is JsonRecord =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const numberValue = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const summaryCount = (summary: GoalAuditSummary, key: keyof GoalAuditSummary) =>
  numberValue(summary[key]);

const summaryFlag = (summary: GoalAuditSummary, key: keyof GoalAuditSummary) =>
  Boolean(summary[key]);

const requirementBase = (goalAudit: JsonRecord, id: string) => {
  const requirement = recordArray(goalAudit.requirementCoverage).find(
    (entry) => text(entry.id) === id,
  );

  return {
    evidence: stringArray(requirement?.evidence),
    requirement: text(requirement?.requirement, id),
  };
};

const FAST_ROOTS = [
  '/Users/growthgod/lobehub',
  '/Users/growthgod/VAN',
  '/Users/growthgod/VAN/aza_memory',
  '/Users/growthgod/Documents/VANTA-Brain',
  '/Users/growthgod/.codex',
  '/Users/growthgod/.agents',
  '/Users/growthgod/.hermes',
  '/Applications',
  '/Users/growthgod/Applications',
  '/Users/growthgod/Desktop/VAN',
] as const;

const pathExists = async (targetPath: string) => Boolean(await stat(targetPath).catch(() => null));

const probeAzaReadyMode = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 750);

  try {
    const response = await fetch('http://127.0.0.1:8787/ready', {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => ({}))) as JsonRecord;

    return typeof data.mode === 'string' ? data.mode : 'unknown';
  } catch {
    return 'unavailable';
  } finally {
    clearTimeout(timeout);
  }
};

const buildFastGoalAuditSummary = async (): Promise<GoalAuditSummary> => {
  const [
    auditProof,
    readiness,
    appInventory,
    contentRegistry,
    vantaAudit,
    vantaCoverage,
    mcpTooling,
    contentAppAudit,
    liveOperatingRecords,
    gtmModel,
    roots,
    readyMode,
  ] = await Promise.all([
    readJson('aza-goal-completion-audit.json').catch(emptyRecord),
    getAzaLiveReadiness(),
    readJson('app-surface-inventory.json').catch(emptyRecord),
    readJson('content-generation-app-registry.json').catch(emptyRecord),
    readJson('vanta-brain-readonly-audit.json').catch(emptyRecord),
    getAzaLiveVantaBrainCoverageMap().catch(() => null),
    getAzaLiveMcpToolingMap().catch(() => null),
    getAzaLiveContentAppAuditMap().catch(() => null),
    getAzaLiveOperatingRecordsMap().catch(() => null),
    readJson('gtm-team-operating-model.json').catch(emptyRecord),
    Promise.all(FAST_ROOTS.map(pathExists)),
    probeAzaReadyMode(),
  ]);

  const apps = recordArray(appInventory.apps);
  const currentObservedApps = recordArray(contentRegistry.currentObservedApps);
  const candidateApps = stringArray(contentRegistry.candidateAppsPendingVerification);
  const gtmRecordTypes = getRecord(gtmModel.recordTypes);
  const gtmRequiredFields = Object.values(gtmRecordTypes).reduce<number>((total, record) => {
    const requiredFields = stringArray(getRecord(record).requiredFields);

    return total + requiredFields.length;
  }, 0);
  const observedCounts = getRecord(vantaAudit.observedCounts);
  const vantaSummary = vantaCoverage?.summary;
  const memoryRoots = vantaCoverage
    ? new Set(
        vantaCoverage.coverageTargets
          .flatMap((target) => target.expectedSourceRoots)
          .map((root) => root.id),
      )
    : null;
  const services = readiness.services ?? [];
  const missingServices = services.filter(
    (service) => !service.listening || service.health !== 'ok',
  ).length;
  const durableHandoffProof = getRecord(auditProof.durableHandoffProof);
  const durableEvidenceProof = getRecord(auditProof.durableEvidenceProof);
  const durableOperatingRecordProof = getRecord(auditProof.durableOperatingRecordProof);
  const durableHandoffProofOk =
    text(durableHandoffProof.status) === 'passed' &&
    durableHandoffProof.handoffWriteOk === true &&
    durableHandoffProof.handoffReadOk === true;
  const durableEvidenceProofOk =
    text(durableEvidenceProof.status) === 'passed' &&
    durableEvidenceProof.evidenceWriteOk === true &&
    durableEvidenceProof.evidenceReadOk === true;
  const durableOperatingRecordProofOk =
    text(durableOperatingRecordProof.status) === 'passed' &&
    durableOperatingRecordProof.allRecordTypesWriteOk === true &&
    durableOperatingRecordProof.allRecordTypesReadOk === true;
  const operatingRecordTypes = stringArray(durableOperatingRecordProof.recordTypes);
  const liveOperatingRecordProof = liveOperatingRecords?.summary.operatingRecordProof ?? false;
  const liveOperatingRecordTypesFound =
    liveOperatingRecords?.summary.expectedRecordTypesFound ?? operatingRecordTypes.length;
  const liveOperatingRecordTypesExpected = liveOperatingRecords?.summary.expectedRecordTypes ?? 7;
  const contentAppAuditTargets = contentAppAudit?.targets ?? [];
  const contentAppMetadataCollectionPlan = contentAppAudit
    ? await getAzaLiveContentAppMetadataCollectionPlanMap({
        contentAppAuditMap: contentAppAudit,
      }).catch(() => null)
    : null;

  return {
    agentFleetAgents: numberValue(observedCounts.hermesAgents),
    agentFleetSkillManifestFiles:
      numberValue(observedCounts.agentSkills) +
      numberValue(observedCounts.codexSkills) +
      numberValue(observedCounts.hermesSkills),
    architectureDataFlowEdges: 11,
    architectureDataFlowNodes: 11,
    azaVerificationBlockedSteps: missingServices || 5,
    brainAccessProfiles: 4,
    brainNamespaces: 5,
    brainPromotionSteps: 5,
    azaReadyStoreMode: readyMode,
    canonicalStoreBlockedChecks: readyMode === 'postgres' ? 0 : 1,
    codexHarnessActiveManualLanes: 2,
    codexHarnessCodexAppPresent: true,
    codexHarnessDurableHandoffReady: durableHandoffProofOk && durableEvidenceProofOk,
    commandBlockedGates:
      readiness.summary.liveAzAReadAvailable && readiness.summary.liveMcpAvailable ? 3 : 4,
    contentAppAuditMetadataSlots: contentAppAudit?.summary.metadataSlots ?? 0,
    contentAppAuditMissingMetadataSlots: contentAppAudit?.summary.missingMetadataSlots ?? 0,
    contentAppAuditTargets:
      contentAppAudit?.summary.contentTargets ?? apps.length + candidateApps.length,
    contentAppMetadataCollectionBrowserAssistedPackets:
      contentAppMetadataCollectionPlan?.summary.browserAssistedPackets ?? 0,
    contentAppMetadataCollectionMissingFields:
      contentAppMetadataCollectionPlan?.summary.missingCollectionFields ?? 0,
    contentAppMetadataCollectionPackets:
      contentAppMetadataCollectionPlan?.summary.packets ?? contentAppAuditTargets.length,
    contentAppBundleMetadataApps: apps.length,
    contentAppChromeWebAppWrappers: apps.filter((app) =>
      text(app.bundleId).startsWith('com.google.Chrome.app.'),
    ).length,
    contentCandidateApps: candidateApps.length,
    expectedAzAPortsMissing: missingServices,
    gtmBoards: recordArray(gtmModel.firstBoards).length,
    gtmLanes: recordArray(gtmModel.operatingLanes).length,
    gtmRecordTypes: Object.keys(gtmRecordTypes).length,
    gtmRequiredFields,
    installedAppCount: apps.length,
    liveAzAReadAvailable: readiness.summary.liveAzAReadAvailable,
    liveMcpAvailable: readiness.summary.liveMcpAvailable,
    listeningPortCount: services.filter((service) => service.listening).length,
    memoryIntakeNamespaceRoutes: 6,
    memoryIntakeStages: 9,
    memoryRootsPresent: memoryRoots
      ? vantaSummary?.sourceRootsPresent
      : roots.filter(Boolean).length,
    memoryRootsTotal: memoryRoots ? memoryRoots.size : FAST_ROOTS.length,
    mcpLiveImplementedToolCallOk: mcpTooling?.summary.liveImplementedToolCallOk ?? false,
    mcpImplementedToolCallsTotal: mcpTooling?.summary.implementedToolCallsTotal ?? 0,
    mcpImplementedToolCallsVerified: mcpTooling?.summary.implementedToolCallsVerified ?? 0,
    mcpLiveImplementedToolCoverageOk: mcpTooling?.summary.liveImplementedToolCoverageOk ?? false,
    mcpLivePlaceholderProbeOk: mcpTooling?.summary.livePlaceholderProbeOk ?? false,
    mcpLiveToolsListOk: mcpTooling?.summary.liveToolsListOk ?? false,
    liveOperatingRecordCount: liveOperatingRecords?.summary.recordCount ?? 0,
    liveOperatingRecordProof,
    liveOperatingRecordTypesExpected,
    liveOperatingRecordTypesFound,
    operatingRecordProofOk: durableOperatingRecordProofOk && liveOperatingRecordProof,
    operatingRecordTypesFound: liveOperatingRecordTypesFound,
    operatingRecordTypesTotal: liveOperatingRecordTypesExpected,
    rootsPresent: roots.filter(Boolean).length,
    rootsTotal: FAST_ROOTS.length,
    staticArtifactsPresent: readiness.summary.artifactsPresent,
    teamDataRecordRoutes: Object.keys(gtmRecordTypes).length,
    vantaBrainCoverageCoveredTargets: vantaSummary?.coveredTargets ?? 0,
    vantaBrainCoveragePartialTargets: vantaSummary?.partialTargets ?? 0,
    vantaBrainCoverageProjectionScanBlocked: vantaSummary?.projectionScanBlocked ? 1 : 0,
    vantaBrainCoverageProjectionScanTimedOut: vantaSummary?.projectionScanTimedOut ? 1 : 0,
    vantaBrainCoverageRootPresent: vantaSummary?.rootPresent ?? Boolean(roots[3]),
    vantaBrainCoverageStaleTargets: vantaSummary?.staleTargets ?? 0,
    vantaBrainCoverageTargets: vantaSummary?.coverageTargets ?? 6,
    visibleAppCount: currentObservedApps.length,
    writesAllowed: false,
  };
};

const buildRequirements = (
  goalAudit: JsonRecord,
  summary: GoalAuditSummary,
): LiveGoalRequirement[] => {
  const base = (id: string) => requirementBase(goalAudit, id);
  const apiLive = summaryFlag(summary, 'liveAzAReadAvailable');
  const mcpLive = summaryFlag(summary, 'liveMcpAvailable');
  const storeMode = text(summary.azaReadyStoreMode, 'unavailable');
  const durableStoreReady =
    storeMode === 'postgres' && summaryCount(summary, 'canonicalStoreBlockedChecks') === 0;
  const runtimeServicesLive = apiLive && mcpLive;
  const mcpToolListOk = summaryFlag(summary, 'mcpLiveToolsListOk');
  const mcpImplementedToolCoverageOk =
    summaryFlag(summary, 'mcpLiveImplementedToolCoverageOk') ||
    (summaryFlag(summary, 'mcpLiveImplementedToolCallOk') &&
      summaryCount(summary, 'mcpImplementedToolCallsTotal') > 0 &&
      summaryCount(summary, 'mcpImplementedToolCallsVerified') ===
        summaryCount(summary, 'mcpImplementedToolCallsTotal'));
  const durableStoreProof = getRecord(goalAudit.durableStoreProof);
  const sharedStoreProofOk =
    durableStoreReady &&
    text(durableStoreProof.status) === 'passed' &&
    durableStoreProof.apiWriteOk === true &&
    durableStoreProof.apiReadOk === true &&
    durableStoreProof.mcpReadOk === true &&
    durableStoreProof.sharedStoreProof === true;
  const durableBoardProof = getRecord(goalAudit.durableBoardProof);
  const durableBoardProofOk =
    durableStoreReady &&
    text(durableBoardProof.status) === 'passed' &&
    durableBoardProof.projectWriteOk === true &&
    durableBoardProof.taskWriteOk === true &&
    durableBoardProof.projectReadOk === true &&
    durableBoardProof.taskReadOk === true;
  const durableHandoffProof = getRecord(goalAudit.durableHandoffProof);
  const durableHandoffProofOk =
    durableStoreReady &&
    text(durableHandoffProof.status) === 'passed' &&
    durableHandoffProof.handoffWriteOk === true &&
    durableHandoffProof.handoffReadOk === true;
  const durableEvidenceProof = getRecord(goalAudit.durableEvidenceProof);
  const durableEvidenceProofOk =
    durableStoreReady &&
    text(durableEvidenceProof.status) === 'passed' &&
    durableEvidenceProof.evidenceWriteOk === true &&
    durableEvidenceProof.evidenceReadOk === true;
  const durableOperatingRecordProof = getRecord(goalAudit.durableOperatingRecordProof);
  const durableOperatingRecordProofOk =
    durableStoreReady &&
    text(durableOperatingRecordProof.status) === 'passed' &&
    durableOperatingRecordProof.allRecordTypesWriteOk === true &&
    durableOperatingRecordProof.allRecordTypesReadOk === true;
  const liveOperatingBoardReady =
    durableOperatingRecordProofOk &&
    summaryFlag(summary, 'liveOperatingRecordProof') &&
    summaryCount(summary, 'operatingRecordTypesFound') ===
      summaryCount(summary, 'operatingRecordTypesTotal');
  const databaseProofOk = durableStoreReady && mcpImplementedToolCoverageOk;
  const commandCenterBlockers = [
    ...(apiLive ? [] : ['AzA API is not verified live']),
    ...(mcpLive ? [] : ['AzA MCP is not verified live']),
    ...(durableStoreReady
      ? []
      : [`canonical store is not durable yet; current /ready mode is ${storeMode}`]),
  ];
  const appDevBlockers = [
    ...(runtimeServicesLive ? [] : ['service gates are blocked']),
    ...(databaseProofOk ? [] : ['database proof is missing']),
    ...(mcpImplementedToolCoverageOk
      ? []
      : [
          mcpToolListOk
            ? 'full implemented MCP retrieval tool coverage is incomplete'
            : 'MCP protocol/tool proof beyond health is missing',
        ]),
    ...(sharedStoreProofOk ? [] : ['API/MCP shared durable store proof is missing']),
    ...(durableBoardProofOk ? [] : ['durable board writes are missing']),
    ...(durableHandoffProofOk ? [] : ['durable Codex handoff writes are missing']),
    ...(durableEvidenceProofOk ? [] : ['durable evidence writes are missing']),
    ...(durableOperatingRecordProofOk ? [] : ['durable operating records are missing']),
    'approved projection path is missing',
  ];

  return [
    {
      ...base('define_pc_architecture'),
      currentProof: `Live audit summary has ${summaryCount(summary, 'rootsPresent')}/${summaryCount(summary, 'rootsTotal')} roots present, ${summaryCount(summary, 'listeningPortCount')} AzA listeners, ${summaryCount(summary, 'installedAppCount')} cataloged apps, ${summaryCount(summary, 'memoryRootsPresent')}/${summaryCount(summary, 'memoryRootsTotal')} memory roots, ${summaryCount(summary, 'architectureDataFlowNodes')} architecture nodes, and ${summaryCount(summary, 'architectureDataFlowEdges')} data-flow edges.`,
      id: 'define_pc_architecture',
      nextProof:
        'Keep replacing static inventories with live read adapters until every command-center section is backed by current records.',
      remainingBlockers: [
        ...(sharedStoreProofOk ? [] : ['live AzA canonical records are not available']),
        ...(durableBoardProofOk ? [] : ['durable board records are not available']),
        ...(durableHandoffProofOk ? [] : ['durable Codex handoff records are not available']),
        ...(durableEvidenceProofOk ? [] : ['durable evidence records are not available']),
        ...(durableOperatingRecordProofOk ? [] : ['durable operating records are not available']),
        'approved VANTA-Brain projection is not available',
      ],
      status: 'partial_live_model',
    },
    {
      ...base('explain_information_organization_before_changes'),
      currentProof:
        'The source-of-truth map and read/write contract exist, and this pass kept writes scoped to LobeHub command-center artifacts.',
      id: 'explain_information_organization_before_changes',
      nextProof:
        'Before any future VAN write, require a target path, reason, rollback, approval, and verification plan.',
      remainingBlockers: ['future VAN writes still require explicit approval'],
      status: 'complete_boundary_current',
    },
    {
      ...base('do_not_write_vanta_brain'),
      currentProof:
        'Projection remains disabled in the live readiness/system maps and this route performs no vault writes.',
      id: 'do_not_write_vanta_brain',
      nextProof:
        'Projection can only proceed after canonical AzA records, redaction proof, destination approval, and a specific VANTA-Brain target.',
      remainingBlockers: ['user approval for projection is not present'],
      status: 'complete_boundary_current',
    },
    {
      ...base('audit_vanta_brain_coverage'),
      currentProof: `VANTA-Brain root is present=${summaryFlag(summary, 'vantaBrainCoverageRootPresent') ? 'yes' : 'no'}; coverage targets: ${summaryCount(summary, 'vantaBrainCoverageCoveredTargets')}/${summaryCount(summary, 'vantaBrainCoverageTargets')} covered, ${summaryCount(summary, 'vantaBrainCoveragePartialTargets')} partial, ${summaryCount(summary, 'vantaBrainCoverageStaleTargets')} stale; direct projection scan blocked=${summaryFlag(summary, 'vantaBrainCoverageProjectionScanBlocked') ? 'yes' : 'no'}, timed out=${summaryFlag(summary, 'vantaBrainCoverageProjectionScanTimedOut') ? 'yes' : 'no'}.`,
      id: 'audit_vanta_brain_coverage',
      nextProof:
        'Repair or relocate the projection vault path, then verify actual canonical logging and projection freshness once AzA services and projection worker are live.',
      remainingBlockers: [
        'complete canonical logging is not proven',
        'projection freshness is not proven',
        'direct VANTA-Brain directory enumeration is blocked',
      ],
      status: 'partial_live_model',
    },
    {
      ...base('brain_design_choice'),
      currentProof: `Hybrid model is represented with ${summaryCount(summary, 'brainNamespaces')} namespaces, ${summaryCount(summary, 'brainAccessProfiles')} access profiles, ${summaryCount(summary, 'memoryIntakeNamespaceRoutes')} namespace routes, and ${summaryCount(summary, 'brainPromotionSteps')} promotion steps.`,
      id: 'brain_design_choice',
      nextProof:
        'Enforce the namespaces through live AzA API/MCP access checks after canonical services are healthy.',
      remainingBlockers: ['live access enforcement is not verified'],
      status: 'complete_design_current',
    },
    {
      ...base('organize_main_brain_command_center'),
      currentProof: `LobeHub command center is live; AzA API available=${apiLive ? 'yes' : 'no'}, MCP available=${mcpLive ? 'yes' : 'no'}, /ready store mode=${storeMode}, canonical store blocked checks=${summaryCount(summary, 'canonicalStoreBlockedChecks')}.`,
      id: 'organize_main_brain_command_center',
      nextProof:
        durableHandoffProofOk && durableEvidenceProofOk
          ? 'Wire the proven durable handoff and evidence records into the native LobeHub task/approval adapter.'
          : durableStoreReady
            ? 'Create durable command, approval, Codex run, evidence, and board records through approved write gates.'
            : 'Keep AzA services running, then make API and MCP use the same durable Postgres/vector store.',
      remainingBlockers:
        commandCenterBlockers.length > 0
          ? commandCenterBlockers
          : ['native LobeHub task/approval adapter is not wired'],
      status: durableStoreReady ? 'partial_live_model' : 'blocked_runtime',
    },
    {
      ...base('lobehub_harness_codex_executor'),
      currentProof: `Codex app present=${summaryFlag(summary, 'codexHarnessCodexAppPresent') ? 'yes' : 'no'}; manual lanes=${summaryCount(summary, 'codexHarnessActiveManualLanes')}; durable handoff ready=${durableHandoffProofOk ? 'yes' : 'no'}; durable evidence ready=${durableEvidenceProofOk ? 'yes' : 'no'}.`,
      id: 'lobehub_harness_codex_executor',
      nextProof:
        durableHandoffProofOk && durableEvidenceProofOk
          ? 'Wire the proven AzA handoff and evidence records into LobeHub native task creation, approvals, and Codex run tracking.'
          : 'Create durable command, approval, Codex run, and evidence records after canonical store and write gates pass.',
      remainingBlockers:
        durableHandoffProofOk && durableEvidenceProofOk
          ? [
              'native LobeHub task adapter is not implemented',
              'browser-session input/output adapter is planned but not wired',
            ]
          : ['durable LobeHub-to-Codex handoff is not ready'],
      status: 'partial_live_model',
    },
    {
      ...base('organize_gtm_strategy'),
      currentProof: `GTM lanes=${summaryCount(summary, 'gtmLanes')}, boards=${summaryCount(summary, 'gtmBoards')}, record types=${summaryCount(summary, 'gtmRecordTypes')}, required fields=${summaryCount(summary, 'gtmRequiredFields')}, team data routes=${summaryCount(summary, 'teamDataRecordRoutes')}, live operating record types=${summaryCount(summary, 'operatingRecordTypesFound')}/${summaryCount(summary, 'operatingRecordTypesTotal')}.`,
      id: 'organize_gtm_strategy',
      nextProof: durableOperatingRecordProofOk
        ? 'Bind visible LobeHub tables to live AzA operating records and collect app/account/output metadata.'
        : 'Back GTM lanes with durable offer, lead, pilot, task, content, publish, evidence, and measurement records.',
      remainingBlockers: durableBoardProofOk
        ? durableOperatingRecordProofOk
          ? liveOperatingBoardReady
            ? ['real app/account/output metadata is not collected']
            : ['LobeHub operating-board feed is not reading all live AzA operating record types']
          : [
              durableEvidenceProofOk
                ? 'offer, lead, pilot, content, publish, and measurement record adapters are still missing'
                : 'offer, lead, pilot, content, publish, evidence, and measurement record adapters are still missing',
            ]
        : ['durable team board is not ready', 'canonical team data writes are not ready'],
      status: 'partial_live_model',
    },
    {
      ...base('organize_application_development'),
      currentProof: `Implementation metadata exists, command blocked gates=${summaryCount(summary, 'commandBlockedGates')}, implementation proof blocked gates=${summaryCount(summary, 'azaVerificationBlockedSteps')}, MCP implemented retrieval tools verified=${summaryCount(summary, 'mcpImplementedToolCallsVerified')}/${summaryCount(summary, 'mcpImplementedToolCallsTotal')}, database proof=${databaseProofOk ? 'yes' : 'no'}, shared API/MCP store proof=${sharedStoreProofOk ? 'yes' : 'no'}, durable board write proof=${durableBoardProofOk ? 'yes' : 'no'}, durable handoff proof=${durableHandoffProofOk ? 'yes' : 'no'}, durable evidence proof=${durableEvidenceProofOk ? 'yes' : 'no'}, and durable operating record proof=${durableOperatingRecordProofOk ? 'yes' : 'no'}.`,
      id: 'organize_application_development',
      nextProof:
        appDevBlockers.length === 1 && appDevBlockers[0] === 'approved projection path is missing'
          ? 'Choose and approve a projection path, or keep VANTA-Brain as a read-only vault while native adapters continue.'
          : 'Pass service, database, MCP, shared-store, durable-board, and projection gates in order.',
      remainingBlockers: appDevBlockers,
      status: appDevBlockers.length > 1 ? 'blocked_runtime' : 'partial_live_model',
    },
    {
      ...base('granular_agent_memory_model'),
      currentProof: `Agent fleet agents=${summaryCount(summary, 'agentFleetAgents')}, skill manifests=${summaryCount(summary, 'agentFleetSkillManifestFiles')}, access profiles=${summaryCount(summary, 'brainAccessProfiles')}, memory intake stages=${summaryCount(summary, 'memoryIntakeStages')}.`,
      id: 'granular_agent_memory_model',
      nextProof:
        'Verify live record-level permissions through API/MCP once the canonical store is online.',
      remainingBlockers: [
        ...(sharedStoreProofOk ? [] : ['canonical storage is not verified']),
        'record-level access enforcement is not verified',
      ],
      status: 'partial_live_model',
    },
    {
      ...base('organize_webapps_electron_content_generation'),
      currentProof: `Cataloged apps=${summaryCount(summary, 'installedAppCount')}, visible apps=${summaryCount(summary, 'visibleAppCount')}, bundle metadata=${summaryCount(summary, 'contentAppBundleMetadataApps')}, Chrome/webapp wrappers=${summaryCount(summary, 'contentAppChromeWebAppWrappers')}, content audit targets=${summaryCount(summary, 'contentAppAuditTargets')}, metadata slots=${summaryCount(summary, 'contentAppAuditMetadataSlots')}, missing metadata slots=${summaryCount(summary, 'contentAppAuditMissingMetadataSlots')}, collection packets=${summaryCount(summary, 'contentAppMetadataCollectionPackets')}, browser-assisted packets=${summaryCount(summary, 'contentAppMetadataCollectionBrowserAssistedPackets')}, browser-session IO planned=${durableHandoffProof.browserSessionIoPlanned === true ? 'yes' : 'no'}, content/publish operating records=${durableOperatingRecordProofOk ? 'proven' : 'missing'}.`,
      evidence: [
        ...base('organize_webapps_electron_content_generation').evidence,
        '/aza/live-content-app-metadata-collection-plan',
      ],
      id: 'organize_webapps_electron_content_generation',
      nextProof:
        'Use /aza/live-content-app-metadata-collection-plan to collect account labels, auth pointers, output paths, output kinds, and evidence pointers only after explicit approval.',
      remainingBlockers: [
        'account labels are missing',
        'auth pointers are missing',
        'output paths are missing',
        'app-backed capture and publishing remain approval-first',
      ],
      status: 'partial_live_model',
    },
    {
      ...base('do_not_write_van'),
      currentProof:
        'No VAN write is required for this live audit; VAN remains approval-gated and read-only for the current command-center pass.',
      id: 'do_not_write_van',
      nextProof:
        'Before any future VAN command or edit, require explicit approval for the target command or path.',
      remainingBlockers: ['future VAN work still requires approval'],
      status: 'complete_boundary_current',
    },
  ];
};

export const getAzaLiveGoalCompletionAuditMap = async ({
  systemMap,
}: {
  systemMap?: AzaLiveSystemMap;
} = {}): Promise<AzaLiveGoalCompletionAuditMap> => {
  const [goalAudit, summary] = await Promise.all([
    readJson('aza-goal-completion-audit.json'),
    systemMap ? Promise.resolve(systemMap.summary) : buildFastGoalAuditSummary(),
  ]);
  const requirements = buildRequirements(goalAudit, summary);

  return {
    generatedAt: new Date().toISOString(),
    goalComplete: false,
    mode: 'read_only_live_goal_completion_audit',
    overallStatus: 'active_goal_not_complete',
    requirements,
    safety: {
      captured: [
        'original requirement ids',
        'requirement text',
        'live summary counts',
        'status labels',
        'evidence route pointers',
        'remaining blocker labels',
        'next proof labels',
      ],
      excluded: [
        'raw memories',
        'raw sessions',
        'raw skill bodies',
        'browser tabs',
        'private app contents',
        'database contents',
        'environment values',
        'secrets',
        'tokens',
        'cookies',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/aza-goal-completion-audit.json',
      '/aza/aza-pc-architecture.html',
      '/aza/aza-pc-architecture.architecture.json',
      '/aza/aza-pc-architecture.png',
      '/aza/live-system-map',
      '/aza/live-readiness',
      '/aza/live-command-gates',
      '/aza/live-implementation-proof',
      '/aza/live-aza-verification-runbook',
      '/aza/live-approval-packet',
      '/aza/live-delivery-roadmap',
      '/aza/live-mcp-tooling-map',
      '/aza/live-vanta-brain-coverage',
      '/aza/live-vanta-brain-diagnostics',
      '/aza/live-browser-operating-sessions',
      '/aza/live-content-app-metadata-collection-plan',
      '/aza/live-operating-records',
    ],
    summary: {
      blockedRuntimeRequirements: requirements.filter(
        (requirement) => requirement.status === 'blocked_runtime',
      ).length,
      completeBoundaryRequirements: requirements.filter(
        (requirement) => requirement.status === 'complete_boundary_current',
      ).length,
      completeDesignRequirements: requirements.filter(
        (requirement) => requirement.status === 'complete_design_current',
      ).length,
      goalComplete: false,
      partialRequirements: requirements.filter((requirement) =>
        requirement.status.startsWith('partial'),
      ).length,
      requirements: requirements.length,
      writesAllowed: false,
    },
  };
};
