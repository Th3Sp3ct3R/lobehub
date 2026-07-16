import {
  type AzaLiveGoalCompletionAuditMap,
  getAzaLiveGoalCompletionAuditMap,
} from './liveGoalCompletionAuditMap';
import { type AzaLiveSystemMap, getAzaLiveSystemMap } from './liveSystemMap';

type ExecutionStatus =
  | 'approval_required'
  | 'blocked_by_approval'
  | 'blocked_by_runtime'
  | 'current_read_only'
  | 'planned_after_runtime'
  | 'ready_read_only';

type ExecutionLane =
  | 'approval'
  | 'architecture'
  | 'content'
  | 'gtm'
  | 'memory'
  | 'runtime'
  | 'team';

export type AzaExecutionStep = {
  approvalTarget: string | null;
  blockedBy: string[];
  currentEvidence: string[];
  executor: 'Codex executor' | 'LobeHub harness' | 'Operator' | 'Team owners';
  id: string;
  lane: ExecutionLane;
  nextAction: string;
  order: number;
  outputRecord: string;
  status: ExecutionStatus;
  title: string;
};

export type AzaLiveExecutionSequenceMap = {
  generatedAt: string;
  mode: 'read_only_execution_sequence_map';
  recommendation: {
    firstApprovalRequest: string;
    firstSafeAction: string;
    firstRuntimeProof: string;
    writeRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  steps: AzaExecutionStep[];
  summary: {
    approvalRequiredSteps: number;
    blockedByApprovalSteps: number;
    blockedByRuntimeSteps: number;
    currentReadOnlySteps: number;
    plannedAfterRuntimeSteps: number;
    readyReadOnlySteps: number;
    steps: number;
    writesAllowed: false;
  };
};

const buildSteps = ({
  audit,
  systemMap,
}: {
  audit: AzaLiveGoalCompletionAuditMap;
  systemMap: AzaLiveSystemMap;
}): AzaExecutionStep[] => {
  const summary = systemMap.summary;

  return [
    {
      approvalTarget: null,
      blockedBy: [],
      currentEvidence: ['/aza/live-system-map', '/aza/live-goal-completion-audit'],
      executor: 'LobeHub harness',
      id: 'keep_command_center_read_only_current',
      lane: 'architecture',
      nextAction:
        'Use the live system map, source-of-truth map, and live goal audit as the current operator view.',
      order: 1,
      outputRecord: 'architecture_snapshot',
      status: 'current_read_only',
      title: 'Keep the current architecture map readable and live',
    },
    {
      approvalTarget: '/Users/growthgod/VAN/aza_memory',
      blockedBy: ['explicit operator approval for VAN commands is required'],
      currentEvidence: ['/aza/live-aza-verification-runbook', '/aza/aza-read-write-contract.json'],
      executor: 'Operator',
      id: 'request_van_aza_service_approval',
      lane: 'approval',
      nextAction:
        'Ask for approval to run only the listed AzA service commands inside /Users/growthgod/VAN/aza_memory.',
      order: 2,
      outputRecord: 'approval_decision',
      status: 'approval_required',
      title: 'Request approval before touching VAN AzA runtime services',
    },
    {
      approvalTarget: '/Users/growthgod/VAN/aza_memory',
      blockedBy:
        summary.expectedAzAPortsMissing > 0
          ? [`${summary.expectedAzAPortsMissing} AzA service ports are missing`]
          : [],
      currentEvidence: ['/aza/live-readiness', '/aza/live-service-map'],
      executor: 'Codex executor',
      id: 'start_and_verify_aza_services',
      lane: 'runtime',
      nextAction:
        'After approval, start gateway, API, MCP, sync, and worker; prove /health and /ready on ports 8786-8790.',
      order: 3,
      outputRecord: 'service_health_evidence',
      status: summary.expectedAzAPortsMissing > 0 ? 'blocked_by_approval' : 'ready_read_only',
      title: 'Start and verify AzA service health',
    },
    {
      approvalTarget: 'Postgres connection metadata only; never expose secret values',
      blockedBy:
        summary.canonicalStoreBlockedChecks > 0
          ? [`${summary.canonicalStoreBlockedChecks} canonical store checks are blocked`]
          : [],
      currentEvidence: ['/aza/live-canonical-store', '/aza/live-aza-implementation'],
      executor: 'Codex executor',
      id: 'verify_postgres_canonical_store',
      lane: 'runtime',
      nextAction:
        'Prove required env presence, database connection, migrations, pgvector, expected tables, and shared store wiring.',
      order: 4,
      outputRecord: 'canonical_store_proof',
      status: summary.canonicalStoreBlockedChecks > 0 ? 'blocked_by_runtime' : 'ready_read_only',
      title: 'Verify Postgres canonical store and schema',
    },
    {
      approvalTarget: 'AzA MCP localhost endpoint',
      blockedBy: summary.mcpAzaHealthy
        ? []
        : ['AzA MCP is not healthy and MCP session proof cannot run yet'],
      currentEvidence: ['/aza/live-mcp-tooling-map', '/aza/live-aza-verification-runbook'],
      executor: 'Codex executor',
      id: 'verify_mcp_retrieval_tools',
      lane: 'runtime',
      nextAction:
        'Initialize MCP, list tools, call implemented retrieval tools, and prove placeholders stay unavailable.',
      order: 5,
      outputRecord: 'mcp_tool_proof',
      status: summary.mcpAzaHealthy ? 'ready_read_only' : 'blocked_by_runtime',
      title: 'Verify MCP session and retrieval tools',
    },
    {
      approvalTarget: 'LobeHub read adapters for AzA records',
      blockedBy: summary.liveAzAReadAvailable ? [] : ['live AzA API read path is not available'],
      currentEvidence: ['/aza/live-command-record-schema', '/aza/live-communication-protocols'],
      executor: 'LobeHub harness',
      id: 'wire_lobehub_read_adapters',
      lane: 'memory',
      nextAction:
        'Replace static or derived records with read-only adapters for live AzA memory, board, app, GTM, and evidence records.',
      order: 6,
      outputRecord: 'read_adapter_contract',
      status: summary.liveAzAReadAvailable ? 'planned_after_runtime' : 'blocked_by_runtime',
      title: 'Wire LobeHub read adapters to live AzA records',
    },
    {
      approvalTarget: 'AzA command, approval, Codex run, and evidence records',
      blockedBy: summary.commandRecordDurableWriteReady
        ? []
        : ['durable command record writes are not ready'],
      currentEvidence: ['/aza/live-codex-harness', '/aza/live-command-record-schema'],
      executor: 'Codex executor',
      id: 'create_durable_codex_handoff',
      lane: 'team',
      nextAction:
        'Persist operator command, approval, Codex run, validation, evidence, and next action records.',
      order: 7,
      outputRecord: 'command_record_bundle',
      status: summary.commandRecordDurableWriteReady
        ? 'planned_after_runtime'
        : 'blocked_by_runtime',
      title: 'Create durable LobeHub-to-Codex handoff records',
    },
    {
      approvalTarget:
        'content app account labels, auth pointers, output paths, and evidence pointers',
      blockedBy:
        summary.contentAppAuditReadyForCaptureTargets > 0
          ? []
          : ['content app account/output/evidence fields are not ready for capture'],
      currentEvidence: ['/aza/live-content-app-audit', '/aza/live-access-capability-map'],
      executor: 'Operator',
      id: 'approve_content_app_field_audit',
      lane: 'content',
      nextAction:
        'Approve a narrow metadata-only app audit for account labels, auth pointers, output paths, output kinds, and evidence pointers.',
      order: 8,
      outputRecord: 'content_app_profile',
      status: 'approval_required',
      title: 'Approve content app metadata audit before capture or publishing',
    },
    {
      approvalTarget: 'GTM and team data records',
      blockedBy: summary.teamDataCanonicalWriteReady
        ? []
        : ['team data canonical writes are not ready'],
      currentEvidence: ['/aza/live-gtm-map', '/aza/live-team-data-routing'],
      executor: 'Team owners',
      id: 'back_gtm_team_lanes_with_records',
      lane: 'gtm',
      nextAction:
        'Back offers, leads, pilots, tasks, content assets, publish events, evidence, and daily command logs with durable AzA records.',
      order: 9,
      outputRecord: 'gtm_team_record_set',
      status: summary.teamDataCanonicalWriteReady ? 'planned_after_runtime' : 'blocked_by_runtime',
      title: 'Back GTM and team lanes with durable records',
    },
    {
      approvalTarget: '/Users/growthgod/Documents/VANTA-Brain specific projection destination',
      blockedBy: audit.goalComplete
        ? ['explicit VANTA-Brain projection approval is still required']
        : ['goal is not complete', 'canonical records and redaction proof are not available'],
      currentEvidence: ['/aza/live-vanta-brain-coverage', '/aza/aza-read-write-contract.json'],
      executor: 'Operator',
      id: 'approve_vanta_brain_projection',
      lane: 'memory',
      nextAction:
        'Only after canonical records and redaction proof, approve a specific VANTA-Brain projection target.',
      order: 10,
      outputRecord: 'projection_approval',
      status: 'blocked_by_runtime',
      title: 'Approve VANTA-Brain projection only after canonical proof',
    },
  ];
};

export const getAzaLiveExecutionSequenceMap = async ({
  audit,
  systemMap,
}: {
  audit?: AzaLiveGoalCompletionAuditMap;
  systemMap?: AzaLiveSystemMap;
} = {}): Promise<AzaLiveExecutionSequenceMap> => {
  const liveSystemMap = systemMap ?? (await getAzaLiveSystemMap());
  const liveAudit = audit ?? (await getAzaLiveGoalCompletionAuditMap({ systemMap: liveSystemMap }));
  const steps = buildSteps({ audit: liveAudit, systemMap: liveSystemMap });

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_execution_sequence_map',
    recommendation: {
      firstApprovalRequest:
        'Ask for approval before running any command in /Users/growthgod/VAN/aza_memory.',
      firstRuntimeProof:
        'Prove AzA gateway, API, MCP, sync, and worker health before database, MCP, or write adapters.',
      firstSafeAction:
        'Continue using LobeHub as the read-only command harness and Codex as the coding executor.',
      writeRule:
        'No VAN, VANTA-Brain, browser/app, device, database, or customer-facing write is allowed from this map.',
    },
    safety: {
      captured: [
        'ordered step labels',
        'status labels',
        'approval target labels',
        'executor labels',
        'blocked-by labels',
        'next-action labels',
        'output record labels',
        'source route pointers',
      ],
      excluded: [
        'raw command execution',
        'database sessions',
        'database contents',
        'raw memories',
        'raw sessions',
        'raw skill bodies',
        'browser tabs',
        'private app contents',
        'credentials',
        'tokens',
        'cookies',
        'environment values',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-system-map',
      '/aza/live-goal-completion-audit',
      '/aza/live-aza-verification-runbook',
      '/aza/live-command-gates',
      '/aza/live-codex-harness',
      '/aza/live-command-record-schema',
      '/aza/live-content-app-audit',
      '/aza/live-gtm-map',
      '/aza/live-team-data-routing',
      '/aza/live-vanta-brain-coverage',
    ],
    steps,
    summary: {
      approvalRequiredSteps: steps.filter((step) => step.status === 'approval_required').length,
      blockedByApprovalSteps: steps.filter((step) => step.status === 'blocked_by_approval').length,
      blockedByRuntimeSteps: steps.filter((step) => step.status === 'blocked_by_runtime').length,
      currentReadOnlySteps: steps.filter((step) => step.status === 'current_read_only').length,
      plannedAfterRuntimeSteps: steps.filter((step) => step.status === 'planned_after_runtime')
        .length,
      readyReadOnlySteps: steps.filter((step) => step.status === 'ready_read_only').length,
      steps: steps.length,
      writesAllowed: false,
    },
  };
};
