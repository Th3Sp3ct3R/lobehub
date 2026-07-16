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
  type AzaLiveContentAppAuditMap,
  getAzaLiveContentAppAuditMap,
} from './liveContentAppAuditMap';
import { type AzaLiveGtmMap, getAzaLiveGtmMap } from './liveGtmMap';
import {
  type AzaLiveMemoryIntakeFunnelMap,
  getAzaLiveMemoryIntakeFunnelMap,
} from './liveMemoryIntakeFunnelMap';
import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './liveOperatingBoard';

type TeamRouteStatus = 'active_read_only' | 'approval_required' | 'blocked' | 'modeled' | 'planned';

export type TeamDataLaneRoute = {
  board: string;
  cadence: string;
  currentStore: string;
  durableTarget: string;
  evidence: string[];
  id: string;
  name: string;
  nextAction: string;
  objective: string;
  ownerRole: string;
  records: string[];
  status: TeamRouteStatus;
  writeGate: string;
};

export type TeamRecordRoute = {
  blockedBy: string[];
  canonicalTarget: string;
  currentStore: string;
  evidence: string[];
  laneIds: string[];
  ownerRoles: string[];
  projectionTarget: string;
  recordType: string;
  requiredBeforeWrite: string[];
  requiredFields: string[];
  status: TeamRouteStatus;
};

export type TeamHandoffRoute = {
  approval: string;
  blockedBy: string[];
  channel: string;
  evidence: string[];
  from: string;
  id: string;
  recordTypes: string[];
  status: TeamRouteStatus;
  to: string;
};

export type TeamStorageBoundary = {
  layer: string;
  pathOrSurface: string;
  readPolicy: string;
  recordTypes: string[];
  status: TeamRouteStatus;
  writePolicy: string;
};

export type AzaLiveTeamDataRoutingMap = {
  generatedAt: string;
  handoffs: TeamHandoffRoute[];
  lanes: TeamDataLaneRoute[];
  mode: 'read_only_live_team_data_routing_map';
  recommendation: {
    commandRule: string;
    dataRule: string;
    projectionRule: string;
    storageRule: string;
  };
  recordRoutes: TeamRecordRoute[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  storageBoundaries: TeamStorageBoundary[];
  summary: {
    activeReadOnlyHandoffs: number;
    approvalRequiredHandoffs: number;
    blockedHandoffs: number;
    blockedRecordRoutes: number;
    canonicalWriteReady: boolean;
    durableBoardReady: boolean;
    lanes: number;
    recordRoutes: number;
    storageBoundaries: number;
    teamOwners: number;
    writesAllowed: false;
  };
};

const uniq = (items: string[]) =>
  [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));

const canonicalWriteBlockers = (
  canonicalStoreMap: AzaLiveCanonicalStoreMap,
  commandGateMap: AzaLiveCommandGateMap,
  commandRecordSchemaMap: AzaLiveCommandRecordSchemaMap,
) => {
  const canonicalGate = commandGateMap.gates.find((gate) => gate.id === 'canonical_aza_writes');

  return [
    ...(canonicalGate && canonicalGate.status !== 'passed' ? [canonicalGate.reason] : []),
    ...(canonicalStoreMap.summary.blockedChecks > 0
      ? [`${canonicalStoreMap.summary.blockedChecks} canonical store checks are blocked.`]
      : []),
    ...(canonicalStoreMap.summary.partialChecks > 0
      ? [`${canonicalStoreMap.summary.partialChecks} canonical store checks are partial.`]
      : []),
    ...(!commandRecordSchemaMap.summary.durableWriteReady
      ? ['Durable command record writes are not ready.']
      : []),
  ];
};

const routeStatus = ({
  blockers,
  requiresApproval,
}: {
  blockers: string[];
  requiresApproval?: boolean;
}): TeamRouteStatus => {
  if (blockers.length > 0) return 'blocked';
  if (requiresApproval) return 'approval_required';

  return 'planned';
};

const laneBoardName = (gtmMap: AzaLiveGtmMap, laneId: string) => {
  if (laneId === 'revenue') return 'GTM Pipeline';
  if (laneId === 'content') return 'Content Factory';
  if (laneId === 'knowledge') return 'Memory Intake';
  if (laneId === 'product') return 'Product Delivery';
  if (laneId === 'operations') return 'Daily Command';

  return gtmMap.boards[0]?.name ?? 'Daily Command';
};

const laneNextAction = (laneId: string) => {
  if (laneId === 'revenue') {
    return 'Create durable offer, lead, pilot, proof, renewal, and evidence records after AzA write gates pass.';
  }
  if (laneId === 'content') {
    return 'Complete content app audit fields before asset, publish_event, and analytics_snapshot records can be trusted.';
  }
  if (laneId === 'knowledge') {
    return 'Keep projection blocked until a canonical AzA id, redaction pass, and explicit VANTA-Brain approval exist.';
  }
  if (laneId === 'product') {
    return 'Route implementation tasks through Codex with target path, validation command, rollback, and evidence.';
  }
  if (laneId === 'operations') {
    return 'Keep browser, device, account, and fleet actions approval-first with evidence receipts.';
  }

  return 'Attach owner, record type, evidence, and write gate before durable storage.';
};

const laneStatus = ({
  canonicalBlockers,
  contentAppAuditMap,
  laneId,
}: {
  canonicalBlockers: string[];
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  laneId: string;
}): TeamRouteStatus => {
  if (laneId === 'content' && contentAppAuditMap.summary.readyForCaptureTargets === 0) {
    return 'approval_required';
  }
  if (laneId === 'operations') return 'approval_required';
  if (canonicalBlockers.length > 0) return 'blocked';

  return 'planned';
};

const buildLanes = ({
  canonicalBlockers,
  contentAppAuditMap,
  gtmMap,
}: {
  canonicalBlockers: string[];
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  gtmMap: AzaLiveGtmMap;
}): TeamDataLaneRoute[] =>
  gtmMap.lanes.map((lane) => ({
    board: laneBoardName(gtmMap, lane.id),
    cadence: lane.cadence,
    currentStore: 'LobeHub derived map and public AzA artifacts',
    durableTarget: 'AzA typed records after canonical API, store, schema, and approval gates pass',
    evidence: ['/aza/live-gtm-map', '/aza/live-operating-board'],
    id: lane.id,
    name: lane.name,
    nextAction: laneNextAction(lane.id),
    objective: lane.objective,
    ownerRole: lane.ownerRole,
    records: lane.records,
    status: laneStatus({ canonicalBlockers, contentAppAuditMap, laneId: lane.id }),
    writeGate:
      lane.id === 'content'
        ? 'content_app_audit_required'
        : lane.id === 'operations'
          ? 'browser_device_actions'
          : 'canonical_aza_writes',
  }));

const recordSchemaIdFor = (recordType: string) => {
  if (
    [
      'offer',
      'segment',
      'lead',
      'outreach_touch',
      'pilot',
      'proof',
      'renewal',
      'daily_command_log',
    ].includes(recordType)
  ) {
    return 'gtm_work_item';
  }
  if (
    [
      'campaign',
      'content_campaign',
      'asset',
      'prompt',
      'draft',
      'publish_event',
      'analytics_snapshot',
    ].includes(recordType)
  ) {
    return 'content_operation';
  }
  if (['source', 'memory_record', 'conflict', 'supersession', 'audit'].includes(recordType)) {
    return 'memory_promotion';
  }
  if (['projection'].includes(recordType)) return 'projection_request';
  if (['task', 'problem', 'feature', 'validation', 'release_gate'].includes(recordType)) {
    return 'operator_command';
  }
  if (['agent', 'skill', 'session', 'device', 'approval'].includes(recordType)) {
    return 'approval_decision';
  }
  if (['evidence'].includes(recordType)) return 'evidence_receipt';
  if (['decision'].includes(recordType)) return 'operator_command';

  return 'operator_command';
};

const requiredBeforeForRecord = (recordType: string) => {
  if (['publish_event', 'device', 'outreach_touch'].includes(recordType)) {
    return ['browser_device_actions', 'human_approval', 'evidence_receipt'];
  }
  if (['asset', 'analytics_snapshot', 'content_campaign'].includes(recordType)) {
    return ['content_app_audit_required', 'canonical_aza_writes'];
  }
  if (recordType === 'projection') {
    return ['canonical_aza_writes', 'redaction_pass', 'human_projection_approval'];
  }
  if (['memory_record', 'source', 'conflict', 'supersession'].includes(recordType)) {
    return ['sensitivity_access_review', 'canonical_aza_writes'];
  }

  return ['canonical_aza_writes', 'evidence_attached'];
};

const recordBlockers = ({
  canonicalBlockers,
  contentAppAuditMap,
  recordType,
}: {
  canonicalBlockers: string[];
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  recordType: string;
}) => [
  ...canonicalBlockers,
  ...(['asset', 'publish_event', 'analytics_snapshot', 'content_campaign'].includes(recordType) &&
  contentAppAuditMap.summary.readyForCaptureTargets === 0
    ? [
        'No content app target is ready for capture because account/output/evidence fields are missing.',
      ]
    : []),
];

const buildRecordRoutes = ({
  canonicalBlockers,
  commandRecordSchemaMap,
  contentAppAuditMap,
  gtmMap,
}: {
  canonicalBlockers: string[];
  commandRecordSchemaMap: AzaLiveCommandRecordSchemaMap;
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  gtmMap: AzaLiveGtmMap;
}): TeamRecordRoute[] => {
  const records = uniq([
    ...gtmMap.lanes.flatMap((lane) => lane.records),
    ...gtmMap.boards.flatMap((board) => board.records),
    ...gtmMap.recordTypes.map((record) => record.name),
  ]);

  return records.map((recordType) => {
    const gtmRecord = gtmMap.recordTypes.find((record) => record.name === recordType);
    const schemaId = recordSchemaIdFor(recordType);
    const schema = commandRecordSchemaMap.recordSchemas.find((record) => record.id === schemaId);
    const blockers = recordBlockers({ canonicalBlockers, contentAppAuditMap, recordType });
    const laneIds = gtmMap.lanes
      .filter((lane) => lane.records.includes(recordType))
      .map((lane) => lane.id);
    const ownerRoles = gtmMap.lanes
      .filter((lane) => lane.records.includes(recordType))
      .map((lane) => lane.ownerRole);

    return {
      blockedBy: blockers,
      canonicalTarget: `AzA ${schemaId} envelope for ${recordType}`,
      currentStore: 'LobeHub derived board, GTM model JSON, or runtime artifact metadata',
      evidence: ['/aza/live-gtm-map', '/aza/live-command-record-schema'],
      laneIds,
      ownerRoles: uniq(ownerRoles.length > 0 ? ownerRoles : ['Command owner']),
      projectionTarget:
        recordType === 'projection'
          ? 'VANTA-Brain reviewed markdown after approval'
          : 'VANTA-Brain summary only after canonical AzA record and redaction',
      recordType,
      requiredBeforeWrite: requiredBeforeForRecord(recordType),
      requiredFields: gtmRecord?.requiredFields ??
        schema?.requiredFields ?? ['owner', 'status', 'evidenceIds'],
      status: routeStatus({
        blockers,
        requiresApproval: ['publish_event', 'outreach_touch', 'device', 'projection'].includes(
          recordType,
        ),
      }),
    };
  });
};

const buildHandoffs = ({
  canonicalBlockers,
  commandGateMap,
  contentAppAuditMap,
  memoryIntakeFunnelMap,
}: {
  canonicalBlockers: string[];
  commandGateMap: AzaLiveCommandGateMap;
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  memoryIntakeFunnelMap: AzaLiveMemoryIntakeFunnelMap;
}): TeamHandoffRoute[] => {
  const browserGate = commandGateMap.gates.find((gate) => gate.id === 'browser_device_actions');
  const projectionGate = commandGateMap.gates.find((gate) => gate.id === 'vanta_brain_projection');

  return [
    {
      approval: 'none for read-only review',
      blockedBy: [],
      channel: 'LobeHub page, live maps, and public AzA artifacts',
      evidence: ['/aza', '/aza/live-system-map'],
      from: 'human_operator',
      id: 'operator_to_daily_command',
      recordTypes: ['daily_command_log', 'task', 'evidence'],
      status: 'active_read_only',
      to: 'daily_command_board',
    },
    {
      approval: 'LobeHub-scoped edits only; VAN writes require explicit approval',
      blockedBy: [],
      channel: 'Codex desktop execution, terminal validation, code graph, and screenshots',
      evidence: ['/aza/live-codex-harness', '/aza/live-command-record-schema'],
      from: 'daily_command_board',
      id: 'daily_command_to_codex',
      recordTypes: ['operator_command', 'codex_execution_run', 'evidence_receipt'],
      status: 'active_read_only',
      to: 'codex_executor',
    },
    {
      approval: 'blocked until canonical write gates pass',
      blockedBy: canonicalBlockers,
      channel: 'planned AzA API or MCP record write',
      evidence: ['/aza/live-canonical-store', '/aza/live-command-gates'],
      from: 'codex_executor',
      id: 'codex_to_aza_records',
      recordTypes: ['task', 'decision', 'evidence', 'gtm_work_item', 'content_operation'],
      status: canonicalBlockers.length > 0 ? 'blocked' : 'planned',
      to: 'aza_canonical_brain',
    },
    {
      approval: 'explicit approval required for posting, messaging, device, or account actions',
      blockedBy:
        contentAppAuditMap.summary.readyForCaptureTargets === 0
          ? ['No content app target has required account/output/evidence fields.']
          : browserGate && browserGate.status !== 'passed'
            ? [browserGate.reason]
            : [],
      channel: 'browser, Electron app, voice tool, publishing surface, or device adapter',
      evidence: ['/aza/live-content-app-audit', '/aza/live-content-ops'],
      from: 'content_factory',
      id: 'content_to_app_surfaces',
      recordTypes: ['content_campaign', 'asset', 'publish_event', 'analytics_snapshot'],
      status: 'approval_required',
      to: 'content_app_surfaces',
    },
    {
      approval: 'sensitivity and access review required',
      blockedBy:
        memoryIntakeFunnelMap.summary.blockedStages > 0
          ? [`${memoryIntakeFunnelMap.summary.blockedStages} memory intake stages are blocked.`]
          : [],
      channel: 'memory proposal, evidence receipt, canonical AzA record, MCP retrieval',
      evidence: ['/aza/live-memory-intake-funnel'],
      from: 'team_records',
      id: 'team_records_to_memory_intake',
      recordTypes: ['memory_promotion', 'source', 'memory_record', 'projection'],
      status: memoryIntakeFunnelMap.summary.blockedStages > 0 ? 'blocked' : 'planned',
      to: 'aza_memory_intake',
    },
    {
      approval: 'explicit VANTA-Brain projection approval required',
      blockedBy:
        projectionGate && projectionGate.status !== 'passed' ? [projectionGate.reason] : [],
      channel: 'planned projection worker',
      evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-command-gates'],
      from: 'aza_canonical_brain',
      id: 'aza_to_vanta_brain_projection',
      recordTypes: ['projection', 'decision', 'audit'],
      status: projectionGate?.status === 'passed' ? 'planned' : 'blocked',
      to: 'vanta_brain_projection_vault',
    },
  ];
};

const buildStorageBoundaries = (): TeamStorageBoundary[] => [
  {
    layer: 'LobeHub harness',
    pathOrSurface: '/Users/growthgod/lobehub',
    readPolicy: 'Can render derived boards, live maps, artifact catalogs, and approval context.',
    recordTypes: ['operator_command', 'approval_decision', 'task', 'evidence'],
    status: 'active_read_only',
    writePolicy: 'Scoped command-center implementation only after organization is explained.',
  },
  {
    layer: 'Codex executor state',
    pathOrSurface: '/Users/growthgod/.codex',
    readPolicy: 'Execution evidence and rollout summaries can be referenced as source pointers.',
    recordTypes: ['codex_execution_run', 'evidence_receipt', 'decision'],
    status: 'active_read_only',
    writePolicy: 'Runtime-native; promote verified summaries to AzA after gates pass.',
  },
  {
    layer: 'AzA canonical brain',
    pathOrSurface: '/Users/growthgod/VAN/aza_memory',
    readPolicy: 'Planned canonical read/write API and MCP retrieval.',
    recordTypes: ['all durable team records'],
    status: 'blocked',
    writePolicy: 'Blocked until API, MCP, Postgres, schema, redaction, and approval pass.',
  },
  {
    layer: 'VANTA-Brain projection vault',
    pathOrSurface: '/Users/growthgod/Documents/VANTA-Brain',
    readPolicy: 'Read-only reviewed markdown projection inventory.',
    recordTypes: ['projection', 'decision', 'audit'],
    status: 'blocked',
    writePolicy: 'No writes during this pass; future projection requires explicit approval.',
  },
  {
    layer: 'Content app surfaces',
    pathOrSurface: '/Applications and browser/Electron surfaces',
    readPolicy: 'Inventory and audit metadata only.',
    recordTypes: ['app_surface', 'asset', 'publish_event', 'analytics_snapshot'],
    status: 'approval_required',
    writePolicy: 'Capture, publish, message, device, or account actions require explicit approval.',
  },
];

export const getAzaLiveTeamDataRoutingMap = async ({
  board,
  canonicalStoreMap,
  commandGateMap,
  commandRecordSchemaMap,
  contentAppAuditMap,
  gtmMap,
  memoryIntakeFunnelMap,
}: {
  board?: AzaLiveOperatingBoard;
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  commandGateMap?: AzaLiveCommandGateMap;
  commandRecordSchemaMap?: AzaLiveCommandRecordSchemaMap;
  contentAppAuditMap?: AzaLiveContentAppAuditMap;
  gtmMap?: AzaLiveGtmMap;
  memoryIntakeFunnelMap?: AzaLiveMemoryIntakeFunnelMap;
} = {}): Promise<AzaLiveTeamDataRoutingMap> => {
  const liveBoard = board ?? (await getAzaLiveOperatingBoard());
  const liveGtmMap = gtmMap ?? (await getAzaLiveGtmMap(liveBoard));
  const liveCommandGateMap =
    commandGateMap ?? (await getAzaLiveCommandGateMap({ board: liveBoard, gtmMap: liveGtmMap }));
  const liveCanonicalStoreMap = canonicalStoreMap ?? (await getAzaLiveCanonicalStoreMap());
  const liveCommandRecordSchemaMap =
    commandRecordSchemaMap ??
    (await getAzaLiveCommandRecordSchemaMap({
      canonicalStoreMap: liveCanonicalStoreMap,
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
  const canonicalBlockers = canonicalWriteBlockers(
    liveCanonicalStoreMap,
    liveCommandGateMap,
    liveCommandRecordSchemaMap,
  );
  const lanes = buildLanes({
    canonicalBlockers,
    contentAppAuditMap: liveContentAppAuditMap,
    gtmMap: liveGtmMap,
  });
  const recordRoutes = buildRecordRoutes({
    canonicalBlockers,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    contentAppAuditMap: liveContentAppAuditMap,
    gtmMap: liveGtmMap,
  });
  const handoffs = buildHandoffs({
    canonicalBlockers,
    commandGateMap: liveCommandGateMap,
    contentAppAuditMap: liveContentAppAuditMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
  });
  const storageBoundaries = buildStorageBoundaries();

  return {
    generatedAt: new Date().toISOString(),
    handoffs,
    lanes,
    mode: 'read_only_live_team_data_routing_map',
    recommendation: {
      commandRule:
        'Every team item starts in LobeHub with lane, owner, agent, record type, target, approval mode, and evidence requirement.',
      dataRule:
        'Use typed AzA records as the durable source once canonical write gates pass; until then, LobeHub maps remain derived read-only views.',
      projectionRule:
        'Project to VANTA-Brain only after canonical AzA id, redaction, and explicit destination approval.',
      storageRule:
        'Store metadata, evidence pointers, and reviewed summaries only; keep raw credentials, messages, browser contents, and customer private data out.',
    },
    recordRoutes,
    safety: {
      captured: [
        'team lane labels',
        'owner role labels',
        'record type names',
        'required field names',
        'board names',
        'handoff labels',
        'gate ids',
        'blocker labels',
        'storage boundary labels',
        'evidence artifact paths',
      ],
      excluded: [
        'lead contact details',
        'customer private data',
        'private messages',
        'browser contents',
        'raw credentials',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'database contents',
      ],
      writesAllowed: false,
    },
    storageBoundaries,
    summary: {
      activeReadOnlyHandoffs: handoffs.filter((handoff) => handoff.status === 'active_read_only')
        .length,
      approvalRequiredHandoffs: handoffs.filter((handoff) => handoff.status === 'approval_required')
        .length,
      blockedHandoffs: handoffs.filter((handoff) => handoff.status === 'blocked').length,
      blockedRecordRoutes: recordRoutes.filter((route) => route.status === 'blocked').length,
      canonicalWriteReady: canonicalBlockers.length === 0,
      durableBoardReady: liveCommandRecordSchemaMap.summary.durableWriteReady,
      lanes: lanes.length,
      recordRoutes: recordRoutes.length,
      storageBoundaries: storageBoundaries.length,
      teamOwners: uniq(lanes.map((lane) => lane.ownerRole)).length,
      writesAllowed: false,
    },
  };
};
