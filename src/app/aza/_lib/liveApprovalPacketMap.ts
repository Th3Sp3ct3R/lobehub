import {
  type AzaLiveVerificationRunbookMap,
  type AzaVerificationStep,
  getAzaLiveVerificationRunbookMap,
} from './liveAzaVerificationRunbookMap';
import {
  type AzaExecutionStep,
  type AzaLiveExecutionSequenceMap,
} from './liveExecutionSequenceMap';

type ApprovalPacketStatus = 'approval_required' | 'blocked_by_runtime' | 'current_read_only';

type ApprovalPacketKind =
  | 'content_app_metadata'
  | 'runtime_verification'
  | 'vanta_brain_projection';

export type AzaApprovalCommandPreview = {
  blockedBy: string[];
  commandKind: AzaVerificationStep['commandKind'];
  commandPreview: string;
  cwd: string;
  expectedEvidence: string[];
  id: string;
  phase: string;
  status: AzaVerificationStep['status'];
  title: string;
};

export type AzaApprovalPacket = {
  allowedCommandClasses: string[];
  approvalText: string;
  blockedCommandClasses: string[];
  evidenceAfter: string[];
  evidenceBefore: string[];
  id: string;
  kind: ApprovalPacketKind;
  rollbackPlan: string[];
  sourceStepIds: string[];
  status: ApprovalPacketStatus;
  target: string;
  title: string;
};

export type AzaLiveApprovalPacketMap = {
  commandPreviews: AzaApprovalCommandPreview[];
  generatedAt: string;
  mode: 'read_only_approval_packet_map';
  packets: AzaApprovalPacket[];
  recommendation: {
    firstApprovalText: string;
    firstSafeAction: string;
    nextIfApproved: string;
    nextIfDenied: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    approvalRequiredPackets: number;
    blockedByRuntimePackets: number;
    commandPreviews: number;
    currentReadOnlyPackets: number;
    executionApprovalSteps: number;
    runbookApprovalSteps: number;
    vanCommandPreviews: number;
    writesAllowed: false;
  };
};

const AZA_RUNTIME_ROOT = '/Users/growthgod/VAN/aza_memory';
const VANTA_BRAIN_ROOT = '/Users/growthgod/Documents/VANTA-Brain';

const commandPreview = (step: AzaVerificationStep): AzaApprovalCommandPreview => ({
  blockedBy: step.blockedBy,
  commandKind: step.commandKind,
  commandPreview: step.commandPreview,
  cwd: step.cwd,
  expectedEvidence: step.expectedEvidence,
  id: step.id,
  phase: step.phase,
  status: step.status,
  title: step.title,
});

const FALLBACK_EXECUTION_STEPS: Array<Pick<AzaExecutionStep, 'id'>> = [
  { id: 'request_van_aza_service_approval' },
  { id: 'start_and_verify_aza_services' },
  { id: 'verify_postgres_canonical_store' },
  { id: 'verify_mcp_retrieval_tools' },
  { id: 'approve_content_app_field_audit' },
  { id: 'approve_vanta_brain_projection' },
];

const stepIds = (steps: Array<Pick<AzaExecutionStep, 'id'>>, ids: string[]) =>
  steps.filter((step) => ids.includes(step.id)).map((step) => step.id);

const buildPackets = (
  sequenceSteps: Array<Pick<AzaExecutionStep, 'id'>>,
  runbook: AzaLiveVerificationRunbookMap,
): AzaApprovalPacket[] => [
  {
    allowedCommandClasses: [
      'metadata-only repo/status checks in the AzA runtime root',
      'docker compose service startup for the named AzA support services only',
      'localhost /health and /ready probes for ports 8786-8790',
      'database extension and table-name verification without row dumps',
      'MCP initialize, tools/list, and safe retrieval contract checks after MCP health is visible',
    ],
    approvalText: `I approve Codex, through the LobeHub harness, to run only the listed AzA runtime verification commands under ${AZA_RUNTIME_ROOT}. No source edits, raw secret output, database row dumps, browser/device actions, VANTA-Brain writes, or customer-facing actions are approved.`,
    blockedCommandClasses: [
      'source edits in /Users/growthgod/VAN',
      'writes to /Users/growthgod/Documents/VANTA-Brain',
      'raw environment printing or secret extraction',
      'database row dumps or unscoped mutations',
      'browser, app, device, publishing, messaging, buying, liking, following, or customer-facing actions',
      'destructive Docker or database cleanup such as volume deletion',
    ],
    evidenceAfter: [
      'HTTP 200 or explicit failure for each AzA /health and /ready probe',
      'compose service status for the approved AzA services',
      'Postgres/pgvector/table-name proof without row contents',
      'MCP tool list and safe retrieval proof when MCP becomes healthy',
      'confirmation that no VAN source edit or VANTA-Brain write occurred',
    ],
    evidenceBefore: [
      'approved target path',
      'approved command class',
      'rollback or stop plan',
      'secret redaction rule',
      'expected evidence list',
    ],
    id: 'approve_aza_runtime_verification',
    kind: 'runtime_verification',
    rollbackPlan: [
      'stop only services started during the approved verification if requested',
      'do not remove volumes unless separately approved',
      'capture command output with secrets redacted',
      'return to LobeHub read-only mode if any probe fails',
    ],
    sourceStepIds: [
      ...stepIds(sequenceSteps, [
        'request_van_aza_service_approval',
        'start_and_verify_aza_services',
        'verify_postgres_canonical_store',
        'verify_mcp_retrieval_tools',
      ]),
      ...runbook.steps
        .filter((step) => step.commandKind === 'approval_required_van_command')
        .map((step) => step.id),
    ],
    status: 'approval_required',
    target: AZA_RUNTIME_ROOT,
    title: 'Approve narrow AzA runtime verification',
  },
  {
    allowedCommandClasses: [
      'metadata-only inventory of content app labels',
      'auth pointer labels without token or cookie values',
      'output path labels and output type labels',
      'evidence pointer labels for generated assets and publishing proofs',
    ],
    approvalText:
      'I approve a metadata-only content app audit for account labels, auth pointers, output paths, output kinds, and evidence pointers. I do not approve posting, publishing, messaging, account changes, login extraction, token inspection, or browser-tab content capture.',
    blockedCommandClasses: [
      'reading cookies, tokens, passwords, or private browser state',
      'posting, publishing, messaging, liking, following, buying, or account mutation',
      'capturing raw document, chat, tab, or customer contents',
      'writing content app records to AzA until canonical store gates pass',
    ],
    evidenceAfter: [
      'app surface id',
      'account label presence status',
      'auth pointer presence status',
      'output path and output kind labels',
      'capture/publish mode remains approval-first',
    ],
    evidenceBefore: [
      'approved app list or app category',
      'approved metadata fields',
      'blocked private-content fields',
      'evidence destination for the audit result',
    ],
    id: 'approve_content_app_metadata_audit',
    kind: 'content_app_metadata',
    rollbackPlan: [
      'discard any collected metadata if it includes private contents',
      'do not save tokens, cookies, passwords, private messages, or tab text',
      'keep all content operations draft-only until a separate publishing approval exists',
    ],
    sourceStepIds: stepIds(sequenceSteps, ['approve_content_app_field_audit']),
    status: 'approval_required',
    target: '/Applications and approved webapp/Electron content surfaces',
    title: 'Approve metadata-only content app audit',
  },
  {
    allowedCommandClasses: [
      'choose a future projection destination label after canonical proof exists',
      'review redaction status for a specific canonical AzA record id',
    ],
    approvalText: `Projection to ${VANTA_BRAIN_ROOT} is not ready to approve. Wait for canonical records, redaction proof, and a specific destination path before requesting projection approval.`,
    blockedCommandClasses: [
      'writing any file under /Users/growthgod/Documents/VANTA-Brain during this pass',
      'projecting raw memories, raw sessions, raw skill bodies, credentials, or private contents',
      'using VANTA-Brain as the canonical writable source before AzA records are proven',
    ],
    evidenceAfter: [
      'canonical AzA record id',
      'redaction proof',
      'specific approved destination path',
      'projection rollback plan',
    ],
    evidenceBefore: [
      'goal completion proof',
      'canonical store proof',
      'MCP/API shared-store proof',
      'human approval for exact destination path',
    ],
    id: 'defer_vanta_brain_projection_approval',
    kind: 'vanta_brain_projection',
    rollbackPlan: [
      'do not write to VANTA-Brain until explicit target approval exists',
      'keep VANTA-Brain read-only as a projection vault',
      'only project redacted summaries backed by canonical AzA ids',
    ],
    sourceStepIds: stepIds(sequenceSteps, ['approve_vanta_brain_projection']),
    status: 'blocked_by_runtime',
    target: VANTA_BRAIN_ROOT,
    title: 'Defer VANTA-Brain projection approval',
  },
];

export const getAzaLiveApprovalPacketMap = async ({
  executionSequence,
  runbook,
}: {
  executionSequence?: AzaLiveExecutionSequenceMap;
  runbook?: AzaLiveVerificationRunbookMap;
} = {}): Promise<AzaLiveApprovalPacketMap> => {
  const liveRunbook = runbook ?? (await getAzaLiveVerificationRunbookMap());
  const sequenceSteps = executionSequence?.steps ?? FALLBACK_EXECUTION_STEPS;
  const executionApprovalSteps =
    executionSequence?.summary.approvalRequiredSteps ?? FALLBACK_EXECUTION_STEPS.length;
  const commandPreviews = liveRunbook.steps
    .filter(
      (step) =>
        step.commandKind === 'approval_required_van_command' ||
        step.id === 'request_van_runtime_approval',
    )
    .map(commandPreview);
  const packets = buildPackets(sequenceSteps, liveRunbook);
  const firstApprovalText =
    packets.find((packet) => packet.id === 'approve_aza_runtime_verification')?.approvalText ?? '';

  return {
    commandPreviews,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_approval_packet_map',
    packets,
    recommendation: {
      firstApprovalText,
      firstSafeAction:
        'Keep LobeHub in read-only command-center mode until the operator approves a specific packet.',
      nextIfApproved:
        'Run only the approved runbook command previews in phase order, redact outputs, and attach evidence to the command record bundle once durable records exist.',
      nextIfDenied:
        'Do not touch VAN runtime services; continue improving read-only maps and planning artifacts in LobeHub.',
    },
    safety: {
      captured: [
        'approval packet ids',
        'target path labels',
        'allowed command class labels',
        'blocked command class labels',
        'command preview labels',
        'expected evidence labels',
        'rollback plan labels',
        'source step ids',
      ],
      excluded: [
        'raw command execution',
        'raw environment values',
        'credentials',
        'tokens',
        'cookies',
        'passwords',
        'database rows',
        'raw memories',
        'raw sessions',
        'browser tab contents',
        'private app contents',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-execution-sequence',
      '/aza/live-aza-verification-runbook',
      '/aza/live-command-gates',
      '/aza/live-readiness',
      '/aza/live-service-map',
      '/aza/live-canonical-store',
      '/aza/live-mcp-tooling-map',
      '/aza/aza-read-write-contract.json',
    ],
    summary: {
      approvalRequiredPackets: packets.filter((packet) => packet.status === 'approval_required')
        .length,
      blockedByRuntimePackets: packets.filter((packet) => packet.status === 'blocked_by_runtime')
        .length,
      commandPreviews: commandPreviews.length,
      currentReadOnlyPackets: packets.filter((packet) => packet.status === 'current_read_only')
        .length,
      executionApprovalSteps,
      runbookApprovalSteps: liveRunbook.summary.approvalRequiredSteps,
      vanCommandPreviews: commandPreviews.filter(
        (preview) => preview.commandKind === 'approval_required_van_command',
      ).length,
      writesAllowed: false,
    },
  };
};
