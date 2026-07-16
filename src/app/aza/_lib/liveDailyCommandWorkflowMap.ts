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
  type AzaLiveContentAppAuditMap,
  getAzaLiveContentAppAuditMap,
} from './liveContentAppAuditMap';
import { type AzaLiveGtmMap, getAzaLiveGtmMap } from './liveGtmMap';
import {
  type AzaLiveMemoryIntakeFunnelMap,
  getAzaLiveMemoryIntakeFunnelMap,
} from './liveMemoryIntakeFunnelMap';
import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './liveOperatingBoard';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import {
  type AzaLiveTeamDataRoutingMap,
  getAzaLiveTeamDataRoutingMap,
} from './liveTeamDataRoutingMap';
import {
  type AzaLiveVantaBrainCoverageMap,
  getAzaLiveVantaBrainCoverageMap,
} from './liveVantaBrainCoverageMap';

type WorkflowStatus =
  | 'active_manual'
  | 'active_read_only'
  | 'approval_required'
  | 'blocked'
  | 'planned';

export type DailyCommandWorkflowStage = {
  approval: string;
  blockedBy: string[];
  evidence: string[];
  from: string;
  id: string;
  input: string;
  label: string;
  nextAction: string;
  output: string;
  owner: string;
  recordTypes: string[];
  status: WorkflowStatus;
  to: string;
};

export type DailyCommandCadence = {
  board: string;
  cadence: string;
  evidence: string[];
  id: string;
  nextAction: string;
  owner: string;
  recordTypes: string[];
  source: string;
  status: WorkflowStatus;
};

export type DailyCommandHandoff = {
  approval: string;
  blockedBy: string[];
  evidence: string[];
  from: string;
  id: string;
  label: string;
  recordTypes: string[];
  status: WorkflowStatus;
  to: string;
};

export type AzaLiveDailyCommandWorkflowMap = {
  cadences: DailyCommandCadence[];
  generatedAt: string;
  handoffs: DailyCommandHandoff[];
  mode: 'read_only_daily_command_workflow_map';
  recommendation: {
    currentLoop: string;
    durableLoop: string;
    evidenceRule: string;
    memoryRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  stages: DailyCommandWorkflowStage[];
  summary: {
    activeManualStages: number;
    activeReadOnlyStages: number;
    approvalRequiredStages: number;
    blockedBoardCards: number;
    blockedStages: number;
    boardCards: number;
    cadences: number;
    canonicalWriteReady: boolean;
    durableBoardReady: boolean;
    durableHandoffReady: boolean;
    handoffs: number;
    plannedStages: number;
    stages: number;
    writesAllowed: false;
  };
};

const uniq = (items: string[]) =>
  [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));

const stageStatus = ({
  blocked,
  requiresApproval,
}: {
  blocked: string[];
  requiresApproval?: boolean;
}): WorkflowStatus => {
  if (blocked.length > 0) return 'blocked';
  if (requiresApproval) return 'approval_required';

  return 'planned';
};

const buildStages = ({
  board,
  codexHarnessMap,
  commandGateMap,
  commandRecordSchemaMap,
  contentAppAuditMap,
  memoryIntakeFunnelMap,
  readiness,
  teamDataRoutingMap,
  vantaBrainCoverageMap,
}: {
  board: AzaLiveOperatingBoard;
  codexHarnessMap: AzaLiveCodexHarnessMap;
  commandGateMap: AzaLiveCommandGateMap;
  commandRecordSchemaMap: AzaLiveCommandRecordSchemaMap;
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  memoryIntakeFunnelMap: AzaLiveMemoryIntakeFunnelMap;
  readiness: AzaLiveReadiness;
  teamDataRoutingMap: AzaLiveTeamDataRoutingMap;
  vantaBrainCoverageMap: AzaLiveVantaBrainCoverageMap;
}): DailyCommandWorkflowStage[] => {
  const codexBlocked = [
    ...(!codexHarnessMap.summary.codexAppPresent ? ['Codex app path is not present.'] : []),
    ...(!codexHarnessMap.summary.codexStatePresent ? ['Codex state path is not present.'] : []),
  ];
  const canonicalWriteGate = commandGateMap.gates.find(
    (gate) => gate.id === 'canonical_aza_writes',
  );
  const durableRecordBlocked = [
    ...(!commandRecordSchemaMap.summary.durableWriteReady
      ? ['Durable command record schema is not write-ready.']
      : []),
    ...(!teamDataRoutingMap.summary.durableBoardReady
      ? ['Durable team board records are not ready.']
      : []),
    ...(canonicalWriteGate && canonicalWriteGate.status !== 'passed'
      ? [canonicalWriteGate.reason]
      : []),
  ];
  const memoryBlocked =
    memoryIntakeFunnelMap.summary.blockedStages > 0
      ? [`${memoryIntakeFunnelMap.summary.blockedStages} memory intake stages are blocked.`]
      : [];
  const contentBlocked =
    contentAppAuditMap.summary.readyForCaptureTargets === 0
      ? ['No content app target is ready for capture because audit fields are missing.']
      : [];
  const projectionBlocked = [
    ...(!readiness.summary.projectionToVantaBrainAllowed
      ? ['VANTA-Brain projection write is not allowed.']
      : []),
    ...(vantaBrainCoverageMap.summary.staleTargets > 0
      ? [`${vantaBrainCoverageMap.summary.staleTargets} VANTA-Brain coverage target is stale.`]
      : []),
  ];

  return [
    {
      approval: 'none for read-only planning',
      blockedBy: [],
      evidence: ['/aza/live-operating-board', '/aza/live-gtm-map'],
      from: 'human_operator',
      id: 'operator_intake',
      input: 'Intent, goal, target lane, expected output, and constraints.',
      label: 'Operator intent enters LobeHub',
      nextAction: 'Keep using the LobeHub AzA page as the command context for today work.',
      output: 'Daily command card with owner, lane, approval mode, and evidence requirement.',
      owner: 'Human operator',
      recordTypes: ['operator_command', 'daily_command_log'],
      status: 'active_read_only',
      to: 'lobehub_harness',
    },
    {
      approval: 'approval policy is classified before any write',
      blockedBy: [],
      evidence: ['/aza/live-command-gates', '/aza/live-ownership-resolution'],
      from: 'lobehub_harness',
      id: 'route_and_gate',
      input: 'Target path, action class, data class, risk, and owner.',
      label: 'LobeHub classifies route and gate',
      nextAction:
        'Route read-only, LobeHub-scoped, VAN-scoped, app/device, canonical, and projection work through separate gates.',
      output: 'Approval class and blocked-write decision.',
      owner: 'Command lead',
      recordTypes: ['approval_decision', 'operator_command'],
      status: 'active_manual',
      to: 'command_gates',
    },
    {
      approval: 'LobeHub-scoped edits only in this pass',
      blockedBy: codexBlocked,
      evidence: ['/aza/live-codex-harness', 'current Codex desktop thread'],
      from: 'command_gates',
      id: 'codex_execution',
      input: 'Approved implementation task with file scope and validation expectations.',
      label: 'Codex executes approved work',
      nextAction:
        'Keep Codex execution manual until durable LobeHub task handoff and command records are verified.',
      output: 'Files changed, validation commands, screenshots, and result summary.',
      owner: 'Codex executor',
      recordTypes: ['codex_execution_run', 'evidence_receipt'],
      status: codexBlocked.length > 0 ? 'blocked' : 'active_manual',
      to: 'codex_executor',
    },
    {
      approval: 'evidence required before done',
      blockedBy: [],
      evidence: ['/aza/live-implementation-proof', '/aza/live-command-record-schema'],
      from: 'codex_executor',
      id: 'evidence_capture',
      input: 'Command output, HTTP response, browser screenshot, file pointer, or verifier result.',
      label: 'Attach evidence and verification status',
      nextAction:
        'Keep every architecture claim tied to live route payloads, source files, screenshots, or command output.',
      output: 'Evidence receipt candidate and verification status.',
      owner: 'Evidence collector',
      recordTypes: ['evidence_receipt'],
      status: 'active_manual',
      to: 'daily_command_board',
    },
    {
      approval: 'blocked until canonical write gates pass',
      blockedBy: durableRecordBlocked,
      evidence: [
        '/aza/live-canonical-store',
        '/aza/live-command-record-schema',
        '/aza/live-team-data-routing',
      ],
      from: 'daily_command_board',
      id: 'durable_record_write',
      input: 'Verified command, execution, evidence, GTM, content, or team data record.',
      label: 'Persist durable records into AzA',
      nextAction:
        'Do not write records until AzA services, Postgres, schema, MCP, redaction, and rollback gates are verified.',
      output: 'Typed AzA record with provenance, allowed readers, and evidence ids.',
      owner: 'Knowledge lead',
      recordTypes: ['operator_command', 'gtm_work_item', 'content_operation', 'evidence_receipt'],
      status: stageStatus({ blocked: durableRecordBlocked }),
      to: 'aza_canonical_brain',
    },
    {
      approval: 'sensitivity and access review required',
      blockedBy: memoryBlocked,
      evidence: ['/aza/live-memory-intake-funnel', '/aza/live-agent-access-matrix'],
      from: 'aza_canonical_brain',
      id: 'memory_promotion',
      input: 'Reviewed source fact, session summary, project decision, or evidence receipt.',
      label: 'Promote durable facts into scoped memory',
      nextAction:
        'Keep raw sessions, raw skill bodies, and raw memories in granular roots until promotion has source, session, sensitivity, and readers.',
      output: 'Scoped AzA memory record or namespace route.',
      owner: 'Knowledge lead',
      recordTypes: ['memory_promotion', 'memory_source', 'session_summary'],
      status: stageStatus({ blocked: memoryBlocked }),
      to: 'aza_memory_namespaces',
    },
    {
      approval: 'human approval required for capture or publishing',
      blockedBy: contentBlocked,
      evidence: ['/aza/live-content-app-audit', '/aza/live-content-ops'],
      from: 'daily_command_board',
      id: 'content_operations',
      input: 'Content campaign, target app, account label, output path, and action class.',
      label: 'Route content work through approved app surfaces',
      nextAction:
        'Fill account labels, auth pointers, output paths, output kinds, and evidence pointers before capture or publishing.',
      output: 'Draft asset, reviewed capture, publish event, or analytics snapshot.',
      owner: 'Content lead',
      recordTypes: ['content_campaign', 'asset', 'publish_event', 'analytics_snapshot'],
      status: stageStatus({ blocked: contentBlocked, requiresApproval: true }),
      to: 'content_app_surfaces',
    },
    {
      approval: 'explicit destination approval required',
      blockedBy: projectionBlocked,
      evidence: ['/aza/live-vanta-brain-coverage', '/aza/aza-read-write-contract.json'],
      from: 'aza_canonical_brain',
      id: 'vanta_brain_projection',
      input: 'Canonical AzA record with redaction and projection policy.',
      label: 'Project reviewed summaries to VANTA-Brain',
      nextAction:
        'Keep VANTA-Brain read-only until a specific projection target is approved after canonical storage.',
      output: 'Reviewed markdown projection with canonical source id.',
      owner: 'Human operator',
      recordTypes: ['projection_request', 'decision', 'audit'],
      status: stageStatus({ blocked: projectionBlocked, requiresApproval: true }),
      to: 'vanta_brain_projection_vault',
    },
    {
      approval: 'manual review until durable board exists',
      blockedBy:
        board.summary.blockedCards > 0
          ? [`${board.summary.blockedCards} board cards are blocked.`]
          : [],
      evidence: ['/aza/live-operating-board', '/aza/live-team-data-routing'],
      from: 'daily_command_board',
      id: 'daily_review_loop',
      input: 'Blocked cards, next proof gates, owner updates, and validation evidence.',
      label: 'Review board and choose next proof gate',
      nextAction: 'Use blocked cards to decide the next LobeHub-only adapter or approved VAN task.',
      output: 'Next approved command scope and evidence requirement.',
      owner: 'Command lead',
      recordTypes: ['daily_command_log', 'task', 'decision'],
      status: board.summary.blockedCards > 0 ? 'active_manual' : 'planned',
      to: 'human_operator',
    },
  ];
};

const buildCadences = ({
  board,
  gtmMap,
  teamDataRoutingMap,
}: {
  board: AzaLiveOperatingBoard;
  gtmMap: AzaLiveGtmMap;
  teamDataRoutingMap: AzaLiveTeamDataRoutingMap;
}): DailyCommandCadence[] => {
  const boardCadences = board.lanes.map(
    (lane): DailyCommandCadence => ({
      board: lane.name,
      cadence: 'daily command review',
      evidence: ['/aza/live-operating-board'],
      id: `board-${lane.id}`,
      nextAction:
        lane.cards.find((card) => card.status === 'blocked')?.nextAction ??
        lane.cards[0]?.nextAction ??
        'Attach owner, status, and evidence before moving work.',
      owner: uniq(lane.cards.map((card) => card.owner)).join(', ') || 'Command lead',
      recordTypes: uniq(lane.cards.flatMap((card) => card.evidence)),
      source: 'operating_board',
      status: lane.cards.some((card) => card.status === 'blocked') ? 'active_manual' : 'planned',
    }),
  );
  const laneCadences = gtmMap.lanes.map((lane): DailyCommandCadence => {
    const route = teamDataRoutingMap.lanes.find((candidate) => candidate.id === lane.id);

    return {
      board: route?.board ?? 'Daily Command',
      cadence: lane.cadence,
      evidence: ['/aza/live-gtm-map', '/aza/live-team-data-routing'],
      id: `lane-${lane.id}`,
      nextAction: route?.nextAction ?? 'Attach record type, owner, evidence, and write gate.',
      owner: lane.ownerRole,
      recordTypes: lane.records,
      source: 'gtm_team_lane',
      status:
        route?.status === 'blocked'
          ? 'blocked'
          : route?.status === 'approval_required'
            ? 'approval_required'
            : 'planned',
    };
  });

  return [...boardCadences, ...laneCadences];
};

const buildHandoffs = ({
  codexHarnessMap,
  teamDataRoutingMap,
}: {
  codexHarnessMap: AzaLiveCodexHarnessMap;
  teamDataRoutingMap: AzaLiveTeamDataRoutingMap;
}): DailyCommandHandoff[] => [
  ...codexHarnessMap.handoffSteps.map(
    (step): DailyCommandHandoff => ({
      approval: step.contract,
      blockedBy: step.status === 'blocked' ? [step.contract] : [],
      evidence: step.evidence,
      from: step.from,
      id: `codex-${step.id}`,
      label: step.label,
      recordTypes: ['operator_command', 'codex_execution_run', 'evidence_receipt'],
      status:
        step.status === 'active_manual'
          ? 'active_manual'
          : step.status === 'blocked'
            ? 'blocked'
            : 'planned',
      to: step.to,
    }),
  ),
  ...teamDataRoutingMap.handoffs.map(
    (handoff): DailyCommandHandoff => ({
      approval: handoff.approval,
      blockedBy: handoff.blockedBy,
      evidence: handoff.evidence,
      from: handoff.from,
      id: `team-${handoff.id}`,
      label: `${handoff.from} to ${handoff.to}`,
      recordTypes: handoff.recordTypes,
      status:
        handoff.status === 'active_read_only'
          ? 'active_read_only'
          : handoff.status === 'approval_required'
            ? 'approval_required'
            : handoff.status === 'blocked'
              ? 'blocked'
              : 'planned',
      to: handoff.to,
    }),
  ),
];

export const getAzaLiveDailyCommandWorkflowMap = async ({
  board,
  canonicalStoreMap,
  codexHarnessMap,
  commandGateMap,
  commandRecordSchemaMap,
  contentAppAuditMap,
  gtmMap,
  memoryIntakeFunnelMap,
  readiness,
  teamDataRoutingMap,
  vantaBrainCoverageMap,
}: {
  board?: AzaLiveOperatingBoard;
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  codexHarnessMap?: AzaLiveCodexHarnessMap;
  commandGateMap?: AzaLiveCommandGateMap;
  commandRecordSchemaMap?: AzaLiveCommandRecordSchemaMap;
  contentAppAuditMap?: AzaLiveContentAppAuditMap;
  gtmMap?: AzaLiveGtmMap;
  memoryIntakeFunnelMap?: AzaLiveMemoryIntakeFunnelMap;
  readiness?: AzaLiveReadiness;
  teamDataRoutingMap?: AzaLiveTeamDataRoutingMap;
  vantaBrainCoverageMap?: AzaLiveVantaBrainCoverageMap;
} = {}): Promise<AzaLiveDailyCommandWorkflowMap> => {
  const liveReadiness = readiness ?? (await getAzaLiveReadiness());
  const liveBoard = board ?? (await getAzaLiveOperatingBoard(liveReadiness));
  const liveGtmMap = gtmMap ?? (await getAzaLiveGtmMap(liveBoard));
  const liveCommandGateMap =
    commandGateMap ?? (await getAzaLiveCommandGateMap({ board: liveBoard, gtmMap: liveGtmMap }));
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
  const liveContentAppAuditMap =
    contentAppAuditMap ??
    (await getAzaLiveContentAppAuditMap({ commandGateMap: liveCommandGateMap }));
  const liveMemoryIntakeFunnelMap =
    memoryIntakeFunnelMap ??
    (await getAzaLiveMemoryIntakeFunnelMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      commandGateMap: liveCommandGateMap,
      commandRecordSchemaMap: liveCommandRecordSchemaMap,
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
    vantaBrainCoverageMap ?? (await getAzaLiveVantaBrainCoverageMap());
  const stages = buildStages({
    board: liveBoard,
    codexHarnessMap: liveCodexHarnessMap,
    commandGateMap: liveCommandGateMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    contentAppAuditMap: liveContentAppAuditMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
    readiness: liveReadiness,
    teamDataRoutingMap: liveTeamDataRoutingMap,
    vantaBrainCoverageMap: liveVantaBrainCoverageMap,
  });
  const cadences = buildCadences({
    board: liveBoard,
    gtmMap: liveGtmMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
  });
  const handoffs = buildHandoffs({
    codexHarnessMap: liveCodexHarnessMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
  });

  return {
    cadences,
    generatedAt: new Date().toISOString(),
    handoffs,
    mode: 'read_only_daily_command_workflow_map',
    recommendation: {
      currentLoop:
        'Use LobeHub as the visible command loop and Codex as the manual execution agent until durable task handoff exists.',
      durableLoop:
        'Promote to durable AzA records only after API/MCP health, Postgres store, schema, redaction, rollback, and approval gates pass.',
      evidenceRule:
        'Every done claim needs a route payload, source file pointer, command output, screenshot, API response, or verifier result.',
      memoryRule:
        'Store durable facts in unified AzA with granular agent/session/source labels; keep raw runtime memory in Codex, Hermes, and agent roots.',
    },
    safety: {
      captured: [
        'workflow stage labels',
        'owner roles',
        'record type names',
        'approval labels',
        'blocker labels',
        'evidence artifact paths',
        'board and lane cadence metadata',
        'handoff labels',
      ],
      excluded: [
        'raw task contents',
        'raw memory contents',
        'raw sessions',
        'raw skill bodies',
        'browser tabs',
        'private messages',
        'lead contact details',
        'customer data',
        'database contents',
        'secrets',
        'tokens',
        'cookies',
        'credentials',
      ],
      writesAllowed: false,
    },
    stages,
    summary: {
      activeManualStages: stages.filter((stage) => stage.status === 'active_manual').length,
      activeReadOnlyStages: stages.filter((stage) => stage.status === 'active_read_only').length,
      approvalRequiredStages: stages.filter((stage) => stage.status === 'approval_required').length,
      blockedBoardCards: liveBoard.summary.blockedCards,
      blockedStages: stages.filter((stage) => stage.status === 'blocked').length,
      boardCards: liveBoard.summary.totalCards,
      cadences: cadences.length,
      canonicalWriteReady: liveTeamDataRoutingMap.summary.canonicalWriteReady,
      durableBoardReady: liveTeamDataRoutingMap.summary.durableBoardReady,
      durableHandoffReady: liveCodexHarnessMap.summary.durableHandoffReady,
      handoffs: handoffs.length,
      plannedStages: stages.filter((stage) => stage.status === 'planned').length,
      stages: stages.length,
      writesAllowed: false,
    },
  };
};
