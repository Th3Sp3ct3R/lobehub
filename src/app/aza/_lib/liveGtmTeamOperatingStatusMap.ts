import {
  type AzaLiveDailyCommandWorkflowMap,
  getAzaLiveDailyCommandWorkflowMap,
} from './liveDailyCommandWorkflowMap';
import { type AzaLiveGtmMap, getAzaLiveGtmMap } from './liveGtmMap';
import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './liveOperatingBoard';
import {
  type AzaLiveTeamDataRoutingMap,
  getAzaLiveTeamDataRoutingMap,
} from './liveTeamDataRoutingMap';

type GtmTeamFocusStatus =
  | 'active_manual'
  | 'active_read_only'
  | 'approval_required'
  | 'blocked'
  | 'done'
  | 'modeled'
  | 'next'
  | 'planned'
  | 'ready'
  | 'review';

export type GtmTeamFocusItem = {
  blockedBy: string[];
  evidence: string[];
  id: string;
  lane: string;
  nextAction: string;
  owner: string;
  recordTypes: string[];
  source: string;
  status: GtmTeamFocusStatus;
  title: string;
};

export type GtmTeamOperatingLaneStatus = {
  blockedCards: number;
  cadence: string;
  durableTarget: string;
  id: string;
  name: string;
  nextAction: string;
  ownerRole: string;
  recordTypes: string[];
  status: string;
  totalCards: number;
};

export type AzaLiveGtmTeamOperatingStatusMap = {
  focusItems: GtmTeamFocusItem[];
  generatedAt: string;
  laneStatus: GtmTeamOperatingLaneStatus[];
  mode: 'read_only_gtm_team_operating_status';
  operatingLoop: Array<{
    evidence: string[];
    id: string;
    owner: string;
    rule: string;
    status: string;
  }>;
  recommendation: {
    commandRule: string;
    gtmRule: string;
    memoryRule: string;
    writeRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    approvalRequiredWorkflowStages: number;
    blockedBoardCards: number;
    blockedFocusItems: number;
    blockedRecordRoutes: number;
    blockedWorkflowStages: number;
    canonicalWriteReady: boolean;
    durableBoardReady: boolean;
    durableHandoffReady: boolean;
    focusItems: number;
    gtmLanes: number;
    gtmRecordTypes: number;
    operatingBoardCards: number;
    teamOwners: number;
    teamRecordRoutes: number;
    workflowStages: number;
    writesAllowed: false;
  };
};

const uniq = (items: string[]) =>
  [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));

const statusRank = (status: string) => {
  if (status === 'blocked') return 0;
  if (status === 'approval_required') return 1;
  if (status === 'next') return 2;
  if (status === 'review') return 3;
  if (status === 'active_manual') return 4;
  if (status === 'active_read_only') return 5;
  if (status === 'ready') return 6;
  if (status === 'planned') return 7;
  if (status === 'done') return 8;

  return 9;
};

const boardFocusItems = (board: AzaLiveOperatingBoard): GtmTeamFocusItem[] =>
  board.lanes.flatMap((lane) =>
    lane.cards.map(
      (card): GtmTeamFocusItem => ({
        blockedBy:
          card.status === 'blocked'
            ? [`${card.title} is blocked behind ${card.approvalMode}.`]
            : [],
        evidence: card.evidence,
        id: card.id,
        lane: lane.name,
        nextAction: card.nextAction,
        owner: card.owner,
        recordTypes: card.linkedRecordTypes ?? [],
        source: '/aza/live-operating-board',
        status: card.status,
        title: card.title,
      }),
    ),
  );

const workflowFocusItems = (workflow: AzaLiveDailyCommandWorkflowMap): GtmTeamFocusItem[] =>
  workflow.stages
    .filter(
      (stage) =>
        stage.status === 'blocked' ||
        stage.status === 'approval_required' ||
        stage.status === 'active_manual',
    )
    .map(
      (stage): GtmTeamFocusItem => ({
        blockedBy: stage.blockedBy,
        evidence: stage.evidence,
        id: stage.id,
        lane: 'Daily command workflow',
        nextAction: stage.nextAction,
        owner: stage.owner,
        recordTypes: stage.recordTypes,
        source: '/aza/live-daily-command-workflow',
        status: stage.status,
        title: stage.label,
      }),
    );

const recordRouteFocusItems = (routing: AzaLiveTeamDataRoutingMap): GtmTeamFocusItem[] =>
  routing.recordRoutes
    .filter((route) => route.status === 'blocked' || route.status === 'approval_required')
    .map(
      (route): GtmTeamFocusItem => ({
        blockedBy: route.blockedBy,
        evidence: route.evidence,
        id: route.recordType,
        lane: route.laneIds.join(', ') || 'Team data route',
        nextAction:
          route.status === 'blocked'
            ? `Clear gates before writing ${route.recordType} records.`
            : `Approve write path before promoting ${route.recordType} records.`,
        owner: route.ownerRoles.join(', ') || 'Command owner',
        recordTypes: [route.recordType],
        source: '/aza/live-team-data-routing',
        status: route.status,
        title: `${route.recordType} route to AzA`,
      }),
    );

const buildLaneStatus = ({
  board,
  gtm,
  routing,
}: {
  board: AzaLiveOperatingBoard;
  gtm: AzaLiveGtmMap;
  routing: AzaLiveTeamDataRoutingMap;
}): GtmTeamOperatingLaneStatus[] => {
  const boardLaneLookup = new Map(board.lanes.map((lane) => [lane.id, lane]));

  return routing.lanes.map((lane) => {
    const boardLane = boardLaneLookup.get(lane.id);

    return {
      blockedCards: boardLane?.cards.filter((card) => card.status === 'blocked').length ?? 0,
      cadence: lane.cadence,
      durableTarget: lane.durableTarget,
      id: lane.id,
      name: lane.name,
      nextAction: lane.nextAction,
      ownerRole: lane.ownerRole,
      recordTypes: uniq([
        ...lane.records,
        ...(gtm.lanes.find((gtmLane) => gtmLane.id === lane.id)?.records ?? []),
      ]),
      status: lane.status,
      totalCards: boardLane?.cards.length ?? 0,
    };
  });
};

const buildSummaryLaneStatus = ({
  board,
  gtm,
}: {
  board: AzaLiveOperatingBoard;
  gtm: AzaLiveGtmMap;
}): GtmTeamOperatingLaneStatus[] => {
  const boardLaneLookup = new Map(board.lanes.map((lane) => [lane.id, lane]));

  return gtm.lanes.map((lane) => {
    const boardLane = boardLaneLookup.get(lane.id);

    return {
      blockedCards: boardLane?.cards.filter((card) => card.status === 'blocked').length ?? 0,
      cadence: lane.cadence,
      durableTarget: 'deferred to /aza/live-team-data-routing',
      id: lane.id,
      name: lane.name,
      nextAction:
        'Use the fast GTM summary for command-center status; open team-data routing for durable write details.',
      ownerRole: lane.ownerRole,
      recordTypes: lane.records,
      status: boardLane?.cards.some((card) => card.status === 'blocked')
        ? 'blocked'
        : 'active_read_only',
      totalCards: boardLane?.cards.length ?? 0,
    };
  });
};

const buildOperatingLoop = ({
  workflow,
}: {
  workflow: AzaLiveDailyCommandWorkflowMap;
}): AzaLiveGtmTeamOperatingStatusMap['operatingLoop'] => [
  {
    evidence: ['/aza/live-daily-command-workflow', '/aza/live-operating-board'],
    id: 'capture_intent',
    owner: 'Human operator',
    rule: 'Capture the operator intent, lane, owner, expected output, and constraints in LobeHub first.',
    status: workflow.summary.activeReadOnlyStages > 0 ? 'active' : 'planned',
  },
  {
    evidence: ['/aza/live-team-data-routing', '/aza/live-command-record-schema'],
    id: 'route_record',
    owner: 'Command lead',
    rule: 'Map work to a typed GTM, task, content, evidence, or memory record before execution.',
    status: workflow.summary.canonicalWriteReady ? 'ready_for_write' : 'read_only',
  },
  {
    evidence: ['/aza/live-codex-harness', '/aza/live-daily-command-workflow'],
    id: 'execute_with_codex',
    owner: 'Codex executor',
    rule: 'Use Codex for implementation and validation, with path-aware approval before writes.',
    status: workflow.summary.activeManualStages > 0 ? 'active_manual' : 'planned',
  },
  {
    evidence: ['/aza/live-content-app-metadata-collection-plan', '/aza/live-content-app-audit'],
    id: 'collect_content_metadata',
    owner: 'Content lead',
    rule: 'Use browser and Electron sessions only as input/output adapters after safe metadata is collected.',
    status: workflow.summary.approvalRequiredStages > 0 ? 'approval_required' : 'planned',
  },
  {
    evidence: ['/aza/live-memory-intake-funnel', '/aza/live-vanta-brain-coverage'],
    id: 'promote_memory',
    owner: 'Knowledge lead',
    rule: 'Promote reviewed facts into AzA first, then project redacted summaries to VANTA-Brain only after approval.',
    status: workflow.summary.canonicalWriteReady ? 'planned_after_write_gate' : 'blocked',
  },
];

export const getAzaLiveGtmTeamOperatingStatusMap = async ({
  board,
  dailyCommandWorkflowMap,
  depth = 'full',
  gtmMap,
  teamDataRoutingMap,
}: {
  board?: AzaLiveOperatingBoard;
  dailyCommandWorkflowMap?: AzaLiveDailyCommandWorkflowMap;
  depth?: 'full' | 'summary';
  gtmMap?: AzaLiveGtmMap;
  teamDataRoutingMap?: AzaLiveTeamDataRoutingMap;
} = {}): Promise<AzaLiveGtmTeamOperatingStatusMap> => {
  const liveBoard = board ?? (await getAzaLiveOperatingBoard());
  const liveGtmMap = gtmMap ?? (await getAzaLiveGtmMap(liveBoard));

  if (depth === 'summary' && !dailyCommandWorkflowMap && !teamDataRoutingMap) {
    const focusItems = boardFocusItems(liveBoard)
      .sort(
        (a, b) =>
          statusRank(a.status) - statusRank(b.status) ||
          a.lane.localeCompare(b.lane) ||
          a.title.localeCompare(b.title),
      )
      .slice(0, 48);

    return {
      focusItems,
      generatedAt: new Date().toISOString(),
      laneStatus: buildSummaryLaneStatus({
        board: liveBoard,
        gtm: liveGtmMap,
      }),
      mode: 'read_only_gtm_team_operating_status',
      operatingLoop: [
        {
          evidence: ['/aza/live-operating-board', '/aza/live-gtm-map'],
          id: 'capture_intent',
          owner: 'Human operator',
          rule: 'Capture operator intent, lane, owner, expected output, and constraints in LobeHub first.',
          status: 'active_read_only',
        },
        {
          evidence: ['/aza/live-team-data-routing'],
          id: 'route_record',
          owner: 'Command lead',
          rule: 'Open the full routing endpoint when durable write route proof is needed.',
          status: 'deferred',
        },
        {
          evidence: ['/aza/live-daily-command-workflow'],
          id: 'execute_with_codex',
          owner: 'Codex executor',
          rule: 'Use the daily workflow endpoint for deeper Codex handoff and approval-stage proof.',
          status: 'deferred',
        },
      ],
      recommendation: {
        commandRule:
          'Use LobeHub as the daily command board, with every work item carrying owner, lane, approval mode, and evidence route.',
        gtmRule:
          'Run GTM through typed offer, lead, pilot, proof, renewal, task, evidence, and learning records once AzA write gates pass.',
        memoryRule:
          'Keep granular agent/session context local until reviewed facts are promoted into scoped AzA memory.',
        writeRule:
          'This status route is read-only; deep routing and workflow proof are opened on demand.',
      },
      safety: {
        captured: [
          'board lane labels',
          'card titles',
          'owner labels',
          'status labels',
          'record type names',
          'blocker labels',
          'next-action labels',
          'evidence route pointers',
        ],
        excluded: [
          'lead contact details',
          'customer private data',
          'raw task contents',
          'raw memory contents',
          'raw sessions',
          'browser tab contents',
          'private messages',
          'credentials',
          'API keys',
          'OAuth tokens',
          'cookies',
          'passwords',
          'VAN writes',
          'VANTA-Brain writes',
        ],
        writesAllowed: false,
      },
      sourceArtifacts: [
        '/aza/live-operating-board',
        '/aza/live-gtm-map',
        '/aza/live-team-data-routing',
        '/aza/live-daily-command-workflow',
      ],
      summary: {
        approvalRequiredWorkflowStages: 0,
        blockedBoardCards: liveBoard.summary.blockedCards,
        blockedFocusItems: focusItems.filter((item) => item.status === 'blocked').length,
        blockedRecordRoutes: 0,
        blockedWorkflowStages: 0,
        canonicalWriteReady: false,
        durableBoardReady: liveBoard.summary.liveOperatingRecordProof,
        durableHandoffReady: false,
        focusItems: focusItems.length,
        gtmLanes: liveGtmMap.summary.lanes,
        gtmRecordTypes: liveGtmMap.summary.recordTypes,
        operatingBoardCards: liveBoard.summary.totalCards,
        teamOwners: liveGtmMap.summary.roleCount,
        teamRecordRoutes: 0,
        workflowStages: 0,
        writesAllowed: false,
      },
    };
  }

  const liveTeamDataRoutingMap =
    teamDataRoutingMap ??
    (await getAzaLiveTeamDataRoutingMap({
      board: liveBoard,
      gtmMap: liveGtmMap,
    }));
  const liveDailyCommandWorkflowMap =
    dailyCommandWorkflowMap ??
    (await getAzaLiveDailyCommandWorkflowMap({
      board: liveBoard,
      gtmMap: liveGtmMap,
      teamDataRoutingMap: liveTeamDataRoutingMap,
    }));
  const focusItems = [
    ...boardFocusItems(liveBoard),
    ...workflowFocusItems(liveDailyCommandWorkflowMap),
    ...recordRouteFocusItems(liveTeamDataRoutingMap),
  ]
    .sort(
      (a, b) =>
        statusRank(a.status) - statusRank(b.status) ||
        a.lane.localeCompare(b.lane) ||
        a.title.localeCompare(b.title),
    )
    .slice(0, 48);

  return {
    focusItems,
    generatedAt: new Date().toISOString(),
    laneStatus: buildLaneStatus({
      board: liveBoard,
      gtm: liveGtmMap,
      routing: liveTeamDataRoutingMap,
    }),
    mode: 'read_only_gtm_team_operating_status',
    operatingLoop: buildOperatingLoop({ workflow: liveDailyCommandWorkflowMap }),
    recommendation: {
      commandRule:
        'Use LobeHub as the daily command board, with every work item carrying owner, lane, approval mode, and evidence route.',
      gtmRule:
        'Run GTM through typed offer, lead, pilot, proof, renewal, task, evidence, and learning records once AzA write gates pass.',
      memoryRule:
        'Keep granular agent/session context local until reviewed facts are promoted into scoped AzA memory.',
      writeRule:
        'This status route is read-only; do not write to VAN, LobeHub, VANTA-Brain, apps, accounts, or browsers from it.',
    },
    safety: {
      captured: [
        'board lane labels',
        'card titles',
        'owner labels',
        'status labels',
        'record type names',
        'blocker labels',
        'next-action labels',
        'evidence route pointers',
      ],
      excluded: [
        'lead contact details',
        'customer private data',
        'raw task contents',
        'raw memory contents',
        'raw sessions',
        'browser tab contents',
        'private messages',
        'credentials',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-operating-board',
      '/aza/live-gtm-map',
      '/aza/live-team-data-routing',
      '/aza/live-daily-command-workflow',
      '/aza/live-content-app-metadata-collection-plan',
      '/aza/live-memory-intake-funnel',
    ],
    summary: {
      approvalRequiredWorkflowStages: liveDailyCommandWorkflowMap.summary.approvalRequiredStages,
      blockedBoardCards: liveBoard.summary.blockedCards,
      blockedFocusItems: focusItems.filter((item) => item.status === 'blocked').length,
      blockedRecordRoutes: liveTeamDataRoutingMap.summary.blockedRecordRoutes,
      blockedWorkflowStages: liveDailyCommandWorkflowMap.summary.blockedStages,
      canonicalWriteReady: liveTeamDataRoutingMap.summary.canonicalWriteReady,
      durableBoardReady: liveTeamDataRoutingMap.summary.durableBoardReady,
      durableHandoffReady: liveDailyCommandWorkflowMap.summary.durableHandoffReady,
      focusItems: focusItems.length,
      gtmLanes: liveGtmMap.summary.lanes,
      gtmRecordTypes: liveGtmMap.summary.recordTypes,
      operatingBoardCards: liveBoard.summary.totalCards,
      teamOwners: liveTeamDataRoutingMap.summary.teamOwners,
      teamRecordRoutes: liveTeamDataRoutingMap.summary.recordRoutes,
      workflowStages: liveDailyCommandWorkflowMap.summary.stages,
      writesAllowed: false,
    },
  };
};
