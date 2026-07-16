import {
  type AzaLiveApprovalPacketMap,
  getAzaLiveApprovalPacketMap,
} from './liveApprovalPacketMap';
import { type AzaLiveGtmMap, getAzaLiveGtmMap } from './liveGtmMap';
import {
  type AzaLiveImplementationProofMap,
  getAzaLiveImplementationProofMap,
} from './liveImplementationProofMap';
import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './liveOperatingBoard';
import {
  type AzaLiveTeamDataRoutingMap,
  getAzaLiveTeamDataRoutingMap,
} from './liveTeamDataRoutingMap';

type DeliveryRoadmapStatus =
  | 'approval_required'
  | 'blocked_by_runtime'
  | 'complete_read_only'
  | 'modeled_read_only'
  | 'planned_after_runtime';

type DeliveryRoadmapLane =
  | 'application'
  | 'brain'
  | 'command_center'
  | 'content'
  | 'gtm'
  | 'runtime'
  | 'team';

export type AzaDeliveryMilestone = {
  blockedBy: string[];
  deliverable: string;
  evidence: string[];
  id: string;
  lane: DeliveryRoadmapLane;
  nextAction: string;
  owner: string;
  recordTypes: string[];
  status: DeliveryRoadmapStatus;
  title: string;
};

export type AzaDeliveryWorkstream = {
  currentState: string;
  id: string;
  milestoneIds: string[];
  name: string;
  nextProof: string;
  owner: string;
  status: DeliveryRoadmapStatus;
};

export type AzaLiveDeliveryRoadmapMap = {
  generatedAt: string;
  milestones: AzaDeliveryMilestone[];
  mode: 'read_only_delivery_roadmap_map';
  recommendation: {
    currentFocus: string;
    nextApproval: string;
    nextBuild: string;
    writeRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    approvalRequiredMilestones: number;
    blockedByRuntimeMilestones: number;
    completeReadOnlyMilestones: number;
    modeledReadOnlyMilestones: number;
    milestones: number;
    plannedAfterRuntimeMilestones: number;
    workstreams: number;
    writesAllowed: false;
  };
  workstreams: AzaDeliveryWorkstream[];
};

const statusForProofGate = (
  proofMap: AzaLiveImplementationProofMap,
  gateId: string,
): DeliveryRoadmapStatus => {
  const gate = proofMap.gates.find((item) => item.id === gateId);

  if (!gate) return 'blocked_by_runtime';
  if (gate.status === 'passed') return 'complete_read_only';
  if (gate.status === 'approval_required') return 'approval_required';
  if (gate.status === 'planned' || gate.status === 'partial') return 'planned_after_runtime';

  return 'blocked_by_runtime';
};

const blockersForProofGate = (proofMap: AzaLiveImplementationProofMap, gateId: string) =>
  proofMap.gates.find((item) => item.id === gateId)?.blockers ?? ['proof gate is not available'];

const buildMilestones = ({
  approvalPacket,
  gtmMap,
  proofMap,
  teamDataRoutingMap,
}: {
  approvalPacket: AzaLiveApprovalPacketMap;
  gtmMap: AzaLiveGtmMap;
  proofMap: AzaLiveImplementationProofMap;
  teamDataRoutingMap: AzaLiveTeamDataRoutingMap;
}): AzaDeliveryMilestone[] => [
  {
    blockedBy: [],
    deliverable:
      'Readable LobeHub command center with architecture, memory, GTM, content, agent, app, service, proof, and approval maps.',
    evidence: ['/aza/live-system-map', '/aza/live-goal-completion-audit'],
    id: 'command_center_read_only_foundation',
    lane: 'command_center',
    nextAction: 'Use LobeHub as the operator harness and Codex as the implementation executor.',
    owner: 'Engineering lead',
    recordTypes: ['architecture_snapshot', 'evidence_receipt'],
    status: 'complete_read_only',
    title: 'Keep the read-only command center current',
  },
  {
    blockedBy:
      approvalPacket.summary.approvalRequiredPackets > 0
        ? ['operator approval is required before VAN runtime commands']
        : [],
    deliverable:
      'Approved runtime verification packet for AzA services, Postgres, pgvector, MCP, and shared-store proof.',
    evidence: ['/aza/live-approval-packet', '/aza/live-aza-verification-runbook'],
    id: 'approve_runtime_verification_packet',
    lane: 'runtime',
    nextAction:
      'Approve or decline the narrow AzA runtime verification packet before any command runs in /Users/growthgod/VAN/aza_memory.',
    owner: 'Human operator',
    recordTypes: ['approval_decision', 'service_health_evidence'],
    status: 'approval_required',
    title: 'Decide the first runtime approval packet',
  },
  {
    blockedBy: blockersForProofGate(proofMap, 'start_and_verify_aza_services'),
    deliverable: 'Gateway, API, MCP, sync, and worker observable on ports 8786-8790.',
    evidence: ['/aza/live-readiness', '/aza/live-service-map'],
    id: 'make_aza_services_observable',
    lane: 'runtime',
    nextAction:
      'After approval, run only the approved startup/probe commands and attach health evidence.',
    owner: 'Engineering lead',
    recordTypes: ['service_health_evidence', 'codex_execution_run'],
    status: statusForProofGate(proofMap, 'start_and_verify_aza_services'),
    title: 'Make AzA services observable',
  },
  {
    blockedBy: blockersForProofGate(proofMap, 'verify_postgres_canonical_store'),
    deliverable:
      'Canonical Postgres, pgvector, migration, and table-name proof without exposing database rows.',
    evidence: ['/aza/live-canonical-store', '/aza/live-aza-implementation'],
    id: 'verify_canonical_store',
    lane: 'brain',
    nextAction:
      'Prove store prerequisites and migrations before enabling any durable command, memory, GTM, or evidence records.',
    owner: 'Knowledge lead',
    recordTypes: ['canonical_store_proof', 'evidence_receipt'],
    status: statusForProofGate(proofMap, 'verify_postgres_canonical_store'),
    title: 'Verify the canonical store',
  },
  {
    blockedBy: blockersForProofGate(proofMap, 'verify_mcp_tools'),
    deliverable: 'Implemented AzA MCP retrieval tools listed and safely callable.',
    evidence: ['/aza/live-mcp-tooling-map', '/aza/live-aza-verification-runbook'],
    id: 'verify_mcp_retrieval',
    lane: 'brain',
    nextAction:
      'After MCP health is visible, initialize MCP, list tools, call safe retrieval tools, and keep placeholders unavailable.',
    owner: 'Knowledge lead',
    recordTypes: ['mcp_tool_proof', 'evidence_receipt'],
    status: statusForProofGate(proofMap, 'verify_mcp_tools'),
    title: 'Verify MCP retrieval',
  },
  {
    blockedBy: blockersForProofGate(proofMap, 'extend_lobehub_read_adapter_to_records'),
    deliverable:
      'LobeHub reads live AzA records for memory, board, app, GTM, evidence, and command-center views.',
    evidence: ['/aza/live-communication-protocols', '/aza/live-command-record-schema'],
    id: 'wire_lobehub_read_adapters',
    lane: 'application',
    nextAction:
      'Replace static or derived command-center data with read-only adapters after API/MCP/store proof.',
    owner: 'Product lead',
    recordTypes: ['read_adapter_contract', 'operator_command', 'evidence_receipt'],
    status: statusForProofGate(proofMap, 'extend_lobehub_read_adapter_to_records'),
    title: 'Wire LobeHub to live AzA records',
  },
  {
    blockedBy: blockersForProofGate(proofMap, 'build_first_durable_board'),
    deliverable:
      'Daily Command, Memory Intake, GTM Pipeline, Content Factory, and Product Delivery backed by typed records.',
    evidence: ['/aza/live-operating-board', '/aza/live-team-data-routing'],
    id: 'build_durable_operating_board',
    lane: 'team',
    nextAction:
      'Keep using derived boards until canonical writes and durable command records are available.',
    owner: 'Product lead',
    recordTypes: ['operator_command', 'gtm_work_item', 'content_operation', 'daily_command_log'],
    status: teamDataRoutingMap.summary.durableBoardReady
      ? 'planned_after_runtime'
      : 'blocked_by_runtime',
    title: 'Build durable team operating boards',
  },
  {
    blockedBy: teamDataRoutingMap.summary.canonicalWriteReady
      ? []
      : [`${teamDataRoutingMap.summary.blockedRecordRoutes} team record routes are blocked`],
    deliverable:
      'Offer, lead, pilot, proof, renewal, content campaign, task, publish event, evidence, and learning records.',
    evidence: ['/aza/live-gtm-map', '/aza/live-team-data-routing'],
    id: 'activate_gtm_record_lanes',
    lane: 'gtm',
    nextAction:
      'Use the modeled GTM lanes today, then write durable records only after canonical gates pass.',
    owner: 'Growth lead',
    recordTypes: gtmMap.recordTypes.map((recordType) => recordType.name),
    status: 'modeled_read_only',
    title: 'Activate GTM lanes as modeled records',
  },
  {
    blockedBy:
      approvalPacket.summary.approvalRequiredPackets > 0
        ? ['content app metadata audit still requires explicit approval']
        : [],
    deliverable:
      'Content app account labels, auth pointers, output paths, output kinds, and evidence pointers before capture or publishing.',
    evidence: ['/aza/live-content-app-audit', '/aza/live-approval-packet'],
    id: 'approve_content_app_metadata',
    lane: 'content',
    nextAction:
      'Approve metadata-only content app audit before any capture, generation workflow write-back, or publishing action.',
    owner: 'Content lead',
    recordTypes: ['content_operation', 'content_campaign', 'publish_event', 'evidence_receipt'],
    status: 'approval_required',
    title: 'Approve content app metadata before operations',
  },
  {
    blockedBy: blockersForProofGate(proofMap, 'projection_approval'),
    deliverable:
      'Reviewed, redacted, canonical AzA summaries projected to an explicit VANTA-Brain destination.',
    evidence: ['/aza/live-vanta-brain-coverage', '/aza/live-command-gates'],
    id: 'defer_vanta_brain_projection',
    lane: 'brain',
    nextAction:
      'Do not write VANTA-Brain projections until canonical record ids, redaction proof, and exact destination approval exist.',
    owner: 'Human operator',
    recordTypes: ['projection_request', 'memory_promotion', 'evidence_receipt'],
    status: 'blocked_by_runtime',
    title: 'Defer VANTA-Brain projection until canonical proof',
  },
];

const statusFromMilestones = (milestones: AzaDeliveryMilestone[]): DeliveryRoadmapStatus => {
  if (milestones.some((item) => item.status === 'approval_required')) return 'approval_required';
  if (milestones.some((item) => item.status === 'blocked_by_runtime')) return 'blocked_by_runtime';
  if (milestones.some((item) => item.status === 'planned_after_runtime')) {
    return 'planned_after_runtime';
  }
  if (milestones.some((item) => item.status === 'modeled_read_only')) return 'modeled_read_only';

  return 'complete_read_only';
};

const buildWorkstreams = (milestones: AzaDeliveryMilestone[]): AzaDeliveryWorkstream[] => {
  const byLane = (lane: DeliveryRoadmapLane) => milestones.filter((item) => item.lane === lane);
  const workstream = ({
    currentState,
    id,
    lane,
    name,
    nextProof,
    owner,
  }: {
    currentState: string;
    id: string;
    lane: DeliveryRoadmapLane;
    name: string;
    nextProof: string;
    owner: string;
  }): AzaDeliveryWorkstream => {
    const laneMilestones = byLane(lane);

    return {
      currentState,
      id,
      milestoneIds: laneMilestones.map((item) => item.id),
      name,
      nextProof,
      owner,
      status: statusFromMilestones(laneMilestones),
    };
  };

  return [
    workstream({
      currentState: 'LobeHub is the readable command harness; Codex is the executor.',
      id: 'command_center',
      lane: 'command_center',
      name: 'Command Center',
      nextProof: 'Keep all maps current and never mark the goal complete before live proof exists.',
      owner: 'Engineering lead',
    }),
    workstream({
      currentState: 'Runtime verification is approval-gated; AzA service health is not proven.',
      id: 'runtime',
      lane: 'runtime',
      name: 'Runtime Verification',
      nextProof: 'Approve or decline the AzA runtime verification packet.',
      owner: 'Human operator',
    }),
    workstream({
      currentState: 'Canonical memory is modeled but live store and MCP proof are blocked.',
      id: 'brain',
      lane: 'brain',
      name: 'Canonical Brain',
      nextProof: 'Prove Postgres, pgvector, migrations, MCP retrieval, and redaction gates.',
      owner: 'Knowledge lead',
    }),
    workstream({
      currentState: 'LobeHub record adapters are planned after live AzA API/MCP/store proof.',
      id: 'application',
      lane: 'application',
      name: 'Application Development',
      nextProof: 'Wire read-only adapters after runtime proof, then durable write adapters later.',
      owner: 'Product lead',
    }),
    workstream({
      currentState: 'Team boards are derived from read-only maps, not durable AzA records.',
      id: 'team',
      lane: 'team',
      name: 'Team Data',
      nextProof: 'Back Daily Command, GTM, content, product, and memory lanes with typed records.',
      owner: 'Product lead',
    }),
    workstream({
      currentState: 'GTM schema, lanes, roles, and record types are modeled and ready to use.',
      id: 'gtm',
      lane: 'gtm',
      name: 'Go To Market',
      nextProof: 'Attach real offers, pilots, proof, renewals, and learnings to durable records.',
      owner: 'Growth lead',
    }),
    workstream({
      currentState: 'Content apps are inventoried, but metadata capture and publishing are gated.',
      id: 'content',
      lane: 'content',
      name: 'Content Operations',
      nextProof: 'Approve metadata-only audit before any app-backed content operation.',
      owner: 'Content lead',
    }),
  ];
};

export const getAzaLiveDeliveryRoadmapMap = async ({
  approvalPacket,
  board,
  gtmMap,
  proofMap,
  teamDataRoutingMap,
}: {
  approvalPacket?: AzaLiveApprovalPacketMap;
  board?: AzaLiveOperatingBoard;
  gtmMap?: AzaLiveGtmMap;
  proofMap?: AzaLiveImplementationProofMap;
  teamDataRoutingMap?: AzaLiveTeamDataRoutingMap;
} = {}): Promise<AzaLiveDeliveryRoadmapMap> => {
  const liveBoard = board ?? (await getAzaLiveOperatingBoard());
  const liveGtmMap = gtmMap ?? (await getAzaLiveGtmMap(liveBoard));
  const liveTeamDataRoutingMap =
    teamDataRoutingMap ??
    (await getAzaLiveTeamDataRoutingMap({
      board: liveBoard,
      gtmMap: liveGtmMap,
    }));
  const [liveProofMap, liveApprovalPacket] = await Promise.all([
    proofMap ?? getAzaLiveImplementationProofMap(),
    approvalPacket ?? getAzaLiveApprovalPacketMap(),
  ]);
  const milestones = buildMilestones({
    approvalPacket: liveApprovalPacket,
    gtmMap: liveGtmMap,
    proofMap: liveProofMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
  });
  const workstreams = buildWorkstreams(milestones);

  return {
    generatedAt: new Date().toISOString(),
    milestones,
    mode: 'read_only_delivery_roadmap_map',
    recommendation: {
      currentFocus:
        'Use the read-only LobeHub command center as the operating surface while runtime gates stay blocked.',
      nextApproval:
        'The next human decision is whether to approve the narrow AzA runtime verification packet.',
      nextBuild:
        'After approval and runtime proof, wire LobeHub read adapters to live AzA records before enabling durable write flows.',
      writeRule:
        'No VAN, VANTA-Brain, database, browser, app, device, publishing, or customer-facing write is allowed from this roadmap.',
    },
    safety: {
      captured: [
        'milestone ids',
        'workstream labels',
        'owner labels',
        'status labels',
        'record type names',
        'evidence route pointers',
        'next-action labels',
        'blocker labels',
      ],
      excluded: [
        'raw command execution',
        'raw environment values',
        'database rows',
        'raw memories',
        'raw sessions',
        'raw skill bodies',
        'browser tab contents',
        'private app contents',
        'lead contact details',
        'customer private data',
        'credentials',
        'tokens',
        'cookies',
        'passwords',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-operating-board',
      '/aza/live-implementation-proof',
      '/aza/live-approval-packet',
      '/aza/live-gtm-map',
      '/aza/live-team-data-routing',
      '/aza/live-command-record-schema',
      '/aza/live-goal-completion-audit',
    ],
    summary: {
      approvalRequiredMilestones: milestones.filter((item) => item.status === 'approval_required')
        .length,
      blockedByRuntimeMilestones: milestones.filter((item) => item.status === 'blocked_by_runtime')
        .length,
      completeReadOnlyMilestones: milestones.filter((item) => item.status === 'complete_read_only')
        .length,
      milestones: milestones.length,
      modeledReadOnlyMilestones: milestones.filter((item) => item.status === 'modeled_read_only')
        .length,
      plannedAfterRuntimeMilestones: milestones.filter(
        (item) => item.status === 'planned_after_runtime',
      ).length,
      workstreams: workstreams.length,
      writesAllowed: false,
    },
    workstreams,
  };
};
