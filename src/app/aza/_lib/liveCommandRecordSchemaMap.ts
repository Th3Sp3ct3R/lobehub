import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { type AzaLiveCodexHarnessMap, getAzaLiveCodexHarnessMap } from './liveCodexHarnessMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';

type SchemaStatus = 'approval_required' | 'blocked' | 'modeled' | 'planned';

export type CommandRecordSchema = {
  blockedBy: string[];
  evidence: string[];
  id: string;
  owner: string;
  readers: string[];
  requiredFields: string[];
  sensitivityDefault: string;
  status: SchemaStatus;
  title: string;
  writeGate: string;
  writer: string;
};

export type CommandSchemaField = {
  description: string;
  id: string;
  requiredFor: string[];
  safetyRule: string;
};

export type CommandRecordLifecycleStep = {
  evidence: string[];
  from: string;
  id: string;
  label: string;
  outputRecord: string;
  status: SchemaStatus;
  to: string;
};

export type AzaLiveCommandRecordSchemaMap = {
  fieldCatalog: CommandSchemaField[];
  generatedAt: string;
  lifecycle: CommandRecordLifecycleStep[];
  mode: 'read_only_command_record_schema_map';
  recordSchemas: CommandRecordSchema[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    approvalRequiredRecords: number;
    blockedRecords: number;
    durableWriteReady: boolean;
    modeledRecords: number;
    plannedRecords: number;
    recordTypes: number;
    requiredFields: number;
    writesAllowed: false;
  };
};

const baseRequiredFields = [
  'id',
  'recordType',
  'createdAt',
  'owner',
  'source',
  'sensitivity',
  'allowedReaders',
  'evidenceIds',
  'verificationStatus',
];

const buildBlockedBy = ({
  canonicalStoreMap,
  commandGateMap,
  codexHarnessMap,
}: {
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  commandGateMap: AzaLiveCommandGateMap;
  codexHarnessMap: AzaLiveCodexHarnessMap;
}) => [
  ...(canonicalStoreMap.summary.blockedChecks > 0 ? ['canonical store readiness is blocked'] : []),
  ...(!commandGateMap.summary.canonicalWritesAllowed ? ['canonical write gate is closed'] : []),
  ...(!codexHarnessMap.summary.durableHandoffReady
    ? ['durable LobeHub-to-Codex handoff is not ready']
    : []),
];

const buildRecordSchemas = ({
  canonicalStoreMap,
  commandGateMap,
  codexHarnessMap,
}: {
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  commandGateMap: AzaLiveCommandGateMap;
  codexHarnessMap: AzaLiveCodexHarnessMap;
}): CommandRecordSchema[] => {
  const commonBlockers = buildBlockedBy({ canonicalStoreMap, commandGateMap, codexHarnessMap });
  const commandWriteReady =
    commonBlockers.length === 0 && commandGateMap.summary.canonicalWritesAllowed;

  return [
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-command-gates', '/aza/live-codex-harness'],
      id: 'operator_command',
      owner: 'LobeHub harness',
      readers: ['human_operator', 'codex_executor', 'knowledge_lead'],
      requiredFields: [
        ...baseRequiredFields,
        'lane',
        'targetPath',
        'actionClass',
        'approvalState',
        'rollbackPlan',
        'nextAction',
      ],
      sensitivityDefault: 'internal',
      status: commandWriteReady ? 'planned' : 'blocked',
      title: 'Operator command',
      writeGate: 'source_and_owner',
      writer: 'LobeHub command center',
    },
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-command-gates', '/aza/live-codex-harness'],
      id: 'approval_decision',
      owner: 'Human operator',
      readers: ['human_operator', 'codex_executor', 'knowledge_lead'],
      requiredFields: [
        ...baseRequiredFields,
        'gate',
        'decision',
        'decisionReason',
        'approvedScope',
        'expiresAt',
      ],
      sensitivityDefault: 'internal',
      status: 'approval_required',
      title: 'Approval decision',
      writeGate: 'human_projection_approval',
      writer: 'LobeHub approval surface',
    },
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-codex-harness'],
      id: 'codex_execution_run',
      owner: 'Codex executor',
      readers: ['human_operator', 'codex_executor', 'engineering_lead'],
      requiredFields: [
        ...baseRequiredFields,
        'commandId',
        'executor',
        'workingDirectory',
        'filesTouched',
        'validationCommands',
        'result',
      ],
      sensitivityDefault: 'internal',
      status: commandWriteReady ? 'planned' : 'blocked',
      title: 'Codex execution run',
      writeGate: 'evidence_attached',
      writer: 'Codex executor bridge',
    },
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-implementation-proof'],
      id: 'evidence_receipt',
      owner: 'Evidence collector',
      readers: ['human_operator', 'codex_executor', 'verifier', 'knowledge_lead'],
      requiredFields: [
        ...baseRequiredFields,
        'evidenceType',
        'artifactUri',
        'claim',
        'observedAt',
        'redactionStatus',
      ],
      sensitivityDefault: 'internal',
      status: commandWriteReady ? 'planned' : 'blocked',
      title: 'Evidence receipt',
      writeGate: 'evidence_attached',
      writer: 'Codex or verifier',
    },
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-gtm-map', '/aza/live-operating-board'],
      id: 'gtm_work_item',
      owner: 'Growth lead',
      readers: ['human_operator', 'growth_lead', 'content_lead', 'codex_executor'],
      requiredFields: [
        ...baseRequiredFields,
        'board',
        'lane',
        'status',
        'offer',
        'nextAction',
        'proofNeeded',
      ],
      sensitivityDefault: 'business_internal',
      status: commandWriteReady ? 'planned' : 'blocked',
      title: 'GTM work item',
      writeGate: 'schema_verified',
      writer: 'LobeHub GTM board adapter',
    },
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-content-ops', '/aza/live-app-map'],
      id: 'content_operation',
      owner: 'Content lead',
      readers: ['human_operator', 'content_lead', 'growth_lead'],
      requiredFields: [
        ...baseRequiredFields,
        'appSurfaceId',
        'stage',
        'accountLabel',
        'outputPath',
        'actionClass',
        'approvalMode',
      ],
      sensitivityDefault: 'business_internal',
      status: 'approval_required',
      title: 'Content operation',
      writeGate: 'browser_device_actions',
      writer: 'Content operations adapter',
    },
    {
      blockedBy: commonBlockers,
      evidence: ['/aza/live-brain-topology', '/aza/live-agent-access-matrix'],
      id: 'memory_promotion',
      owner: 'Knowledge lead',
      readers: ['human_operator', 'knowledge_lead', 'allowed_agent_profile'],
      requiredFields: [
        ...baseRequiredFields,
        'sourceRecordId',
        'namespace',
        'agentId',
        'sessionId',
        'summary',
        'confidence',
      ],
      sensitivityDefault: 'scoped_internal',
      status: commandWriteReady ? 'planned' : 'blocked',
      title: 'Memory promotion',
      writeGate: 'secret_redaction',
      writer: 'AzA memory intake adapter',
    },
    {
      blockedBy: [
        ...commonBlockers,
        'VANTA-Brain projection requires explicit destination approval',
      ],
      evidence: ['/aza/live-command-gates', '/aza/vanta-brain-readonly-audit.json'],
      id: 'projection_request',
      owner: 'Human operator',
      readers: ['human_operator', 'knowledge_lead'],
      requiredFields: [
        ...baseRequiredFields,
        'canonicalRecordId',
        'destinationPath',
        'template',
        'redactionStatus',
        'approvalDecisionId',
      ],
      sensitivityDefault: 'reviewed_projection',
      status: 'approval_required',
      title: 'Projection request',
      writeGate: 'human_projection_approval',
      writer: 'Future AzA projection worker',
    },
  ];
};

const buildFieldCatalog = (): CommandSchemaField[] => [
  {
    description: 'Record source path, route, API response, screenshot, or command output pointer.',
    id: 'source',
    requiredFor: ['all_records'],
    safetyRule: 'Store safe pointers and summaries only; never raw secrets or private bodies.',
  },
  {
    description: 'Human or agent owner accountable for the record and next action.',
    id: 'owner',
    requiredFor: ['all_records'],
    safetyRule: 'Owner must be a role label, not a credential or private identity secret.',
  },
  {
    description: 'Sensitivity label used to decide allowed readers and projection eligibility.',
    id: 'sensitivity',
    requiredFor: ['all_records'],
    safetyRule: 'Default to internal or scoped until explicitly reviewed.',
  },
  {
    description: 'Allowed agent or role profiles that can read the record.',
    id: 'allowedReaders',
    requiredFor: ['all_records'],
    safetyRule: 'Use profile labels; do not copy private messages or account credentials.',
  },
  {
    description: 'Evidence receipt identifiers proving a claim or completion state.',
    id: 'evidenceIds',
    requiredFor: ['all_records'],
    safetyRule: 'Evidence must be redacted and point to safe artifacts.',
  },
  {
    description: 'Approval state and approval decision reference for writes or account actions.',
    id: 'approvalState',
    requiredFor: ['operator_command', 'content_operation', 'projection_request'],
    safetyRule: 'Approval must name the scope and must not imply broad standing consent.',
  },
  {
    description: 'Rollback plan for filesystem, app, browser, DB, or projection writes.',
    id: 'rollbackPlan',
    requiredFor: ['operator_command', 'codex_execution_run'],
    safetyRule: 'Required before approved writes to VAN, LobeHub source, AzA, apps, or devices.',
  },
  {
    description: 'Verification state: unverified, partial, passed, failed, or blocked.',
    id: 'verificationStatus',
    requiredFor: ['all_records'],
    safetyRule: 'Default to unverified unless current evidence proves the claim.',
  },
];

const buildLifecycle = (durableWriteReady: boolean): CommandRecordLifecycleStep[] => [
  {
    evidence: ['/aza/live-codex-harness'],
    from: 'operator',
    id: 'capture_intent',
    label: 'Capture operator intent',
    outputRecord: 'operator_command',
    status: 'modeled',
    to: 'LobeHub harness',
  },
  {
    evidence: ['/aza/live-command-gates', '/aza/aza-read-write-contract.json'],
    from: 'LobeHub harness',
    id: 'classify_approval',
    label: 'Classify write boundary and approval',
    outputRecord: 'approval_decision',
    status: 'approval_required',
    to: 'Human operator',
  },
  {
    evidence: ['/aza/live-codex-harness'],
    from: 'LobeHub harness',
    id: 'execute_with_codex',
    label: 'Execute approved work with Codex',
    outputRecord: 'codex_execution_run',
    status: durableWriteReady ? 'planned' : 'blocked',
    to: 'Codex executor',
  },
  {
    evidence: ['/aza/live-implementation-proof'],
    from: 'Codex executor',
    id: 'attach_evidence',
    label: 'Attach evidence and verification status',
    outputRecord: 'evidence_receipt',
    status: durableWriteReady ? 'planned' : 'blocked',
    to: 'AzA command center',
  },
  {
    evidence: ['/aza/live-brain-topology', '/aza/live-agent-access-matrix'],
    from: 'AzA command center',
    id: 'promote_memory',
    label: 'Promote durable facts into scoped memory',
    outputRecord: 'memory_promotion',
    status: durableWriteReady ? 'planned' : 'blocked',
    to: 'AzA canonical brain',
  },
  {
    evidence: ['/aza/vanta-brain-readonly-audit.json'],
    from: 'AzA canonical brain',
    id: 'request_projection',
    label: 'Request reviewed VANTA-Brain projection',
    outputRecord: 'projection_request',
    status: 'approval_required',
    to: 'VANTA-Brain projection vault',
  },
];

export const getAzaLiveCommandRecordSchemaMap = async ({
  canonicalStoreMap,
  codexHarnessMap,
  commandGateMap,
}: {
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  codexHarnessMap?: AzaLiveCodexHarnessMap;
  commandGateMap?: AzaLiveCommandGateMap;
} = {}): Promise<AzaLiveCommandRecordSchemaMap> => {
  const [liveCanonicalStoreMap, liveCommandGateMap] = await Promise.all([
    canonicalStoreMap ?? getAzaLiveCanonicalStoreMap(),
    commandGateMap ?? getAzaLiveCommandGateMap(),
  ]);
  const liveCodexHarnessMap =
    codexHarnessMap ??
    (await getAzaLiveCodexHarnessMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      commandGateMap: liveCommandGateMap,
    }));
  const durableWriteReady =
    liveCanonicalStoreMap.summary.blockedChecks === 0 &&
    liveCanonicalStoreMap.summary.partialChecks === 0 &&
    liveCommandGateMap.summary.canonicalWritesAllowed &&
    liveCodexHarnessMap.summary.durableHandoffReady;
  const recordSchemas = buildRecordSchemas({
    canonicalStoreMap: liveCanonicalStoreMap,
    codexHarnessMap: liveCodexHarnessMap,
    commandGateMap: liveCommandGateMap,
  });
  const fieldCatalog = buildFieldCatalog();

  return {
    fieldCatalog,
    generatedAt: new Date().toISOString(),
    lifecycle: buildLifecycle(durableWriteReady),
    mode: 'read_only_command_record_schema_map',
    recordSchemas,
    safety: {
      captured: [
        'record type names',
        'required field names',
        'owner roles',
        'reader role labels',
        'write gate labels',
        'schema statuses',
        'lifecycle labels',
      ],
      excluded: [
        'record contents',
        'raw task contents',
        'raw memory contents',
        'raw evidence bodies',
        'database contents',
        'browser tabs',
        'private messages',
        'secrets',
        'tokens',
        'cookies',
      ],
      writesAllowed: false,
    },
    summary: {
      approvalRequiredRecords: recordSchemas.filter(
        (record) => record.status === 'approval_required',
      ).length,
      blockedRecords: recordSchemas.filter((record) => record.status === 'blocked').length,
      durableWriteReady,
      modeledRecords: recordSchemas.filter((record) => record.status === 'modeled').length,
      plannedRecords: recordSchemas.filter((record) => record.status === 'planned').length,
      recordTypes: recordSchemas.length,
      requiredFields: new Set(recordSchemas.flatMap((record) => record.requiredFields)).size,
      writesAllowed: false,
    },
  };
};
