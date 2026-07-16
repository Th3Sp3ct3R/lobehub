import {
  type AzaLiveApprovalPacketMap,
  getAzaLiveApprovalPacketMap,
} from './liveApprovalPacketMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import {
  type AzaLiveCommandRecordSchemaMap,
  getAzaLiveCommandRecordSchemaMap,
} from './liveCommandRecordSchemaMap';
import {
  type AzaLiveOperatingRecordsMap,
  getAzaLiveOperatingRecordsMap,
} from './liveOperatingRecordsMap';

type NativeApprovalAdapterStatus = 'blocked' | 'modeled' | 'read_ready' | 'write_ready';

export type AzaNativeApprovalAdapterCapability = {
  blockedBy: string[];
  evidence: string[];
  id: string;
  label: string;
  nextAction: string;
  proof: string;
  status: NativeApprovalAdapterStatus;
};

export type AzaLiveNativeApprovalAdapterMap = {
  capabilities: AzaNativeApprovalAdapterCapability[];
  generatedAt: string;
  mode: 'read_only_native_approval_adapter_map';
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    approvalDecisionSchemaModeled: boolean;
    approvalRequiredPackets: number;
    blockedCapabilities: number;
    canonicalWritesAllowed: false;
    commandRecordSchemas: number;
    liveOperatingRecordReadBinding: boolean;
    operatingRecordTypesExpected: number;
    operatingRecordTypesFound: number;
    operatingRecordsVisible: number;
    readReadyCapabilities: number;
    writeAdapterReady: boolean;
    writesAllowed: false;
  };
};

const hasSchema = (schemaMap: AzaLiveCommandRecordSchemaMap, id: string) =>
  schemaMap.recordSchemas.some((schema) => schema.id === id);

const buildWriteBlockers = ({
  approvalPacketMap,
  commandGateMap,
  schemaMap,
}: {
  approvalPacketMap: AzaLiveApprovalPacketMap;
  commandGateMap: AzaLiveCommandGateMap;
  schemaMap: AzaLiveCommandRecordSchemaMap;
}) => [
  ...(!commandGateMap.summary.canonicalWritesAllowed ? ['canonical write gate is closed'] : []),
  ...(!schemaMap.summary.durableWriteReady ? ['durable command-record writes are not ready'] : []),
  ...(approvalPacketMap.summary.approvalRequiredPackets === 0
    ? ['no approval packet is available']
    : []),
];

export const getAzaLiveNativeApprovalAdapterMap = async ({
  approvalPacketMap,
  commandGateMap,
  depth = 'full',
  operatingRecordsMap,
  schemaMap,
}: {
  approvalPacketMap?: AzaLiveApprovalPacketMap;
  commandGateMap?: AzaLiveCommandGateMap;
  depth?: 'full' | 'summary';
  operatingRecordsMap?: AzaLiveOperatingRecordsMap;
  schemaMap?: AzaLiveCommandRecordSchemaMap;
} = {}): Promise<AzaLiveNativeApprovalAdapterMap> => {
  if (depth === 'summary' && !approvalPacketMap && !commandGateMap && !schemaMap) {
    const liveOperatingRecordsMap = operatingRecordsMap ?? (await getAzaLiveOperatingRecordsMap());
    const deferredFullProof =
      'full approval packet/schema proof is deferred to /aza/live-native-approval-adapter';
    const capabilities: AzaNativeApprovalAdapterCapability[] = [
      {
        blockedBy: [],
        evidence: ['/aza/live-operating-records'],
        id: 'operating_record_reader',
        label: 'Read live AzA operating records',
        nextAction:
          'Use this read binding as the board source while keeping write actions approval-gated.',
        proof: `${liveOperatingRecordsMap.summary.recordCount} operating records across ${liveOperatingRecordsMap.summary.expectedRecordTypesFound}/${liveOperatingRecordsMap.summary.expectedRecordTypes} expected types are visible.`,
        status: liveOperatingRecordsMap.summary.operatingRecordProof ? 'read_ready' : 'blocked',
      },
      {
        blockedBy: [deferredFullProof],
        evidence: ['/aza/live-native-approval-adapter'],
        id: 'approval_packet_model',
        label: 'Model approval packets',
        nextAction:
          'Open the full adapter endpoint when packet details are needed; keep the command index on summary reads.',
        proof: 'Approval packets are intentionally summarized for the command index.',
        status: 'modeled',
      },
      {
        blockedBy: ['canonical write gate is closed', deferredFullProof],
        evidence: ['/aza/live-command-record-schema', '/aza/live-command-gates'],
        id: 'approval_decision_writer',
        label: 'Write approval decisions',
        nextAction:
          'Keep disabled until canonical write gates, schema proof, and explicit human approval are all present.',
        proof: 'Approval decision writes are not enabled from the summary adapter.',
        status: 'blocked',
      },
      {
        blockedBy: ['canonical write gate is closed', deferredFullProof],
        evidence: ['/aza/live-command-record-schema', '/aza/live-codex-harness'],
        id: 'task_and_run_writer',
        label: 'Write command, task, and Codex run records',
        nextAction:
          'Wire only after approval decisions can be persisted with evidence and rollback metadata.',
        proof: 'Command, task, and run writes remain blocked in read-only summary mode.',
        status: 'blocked',
      },
    ];

    return {
      capabilities,
      generatedAt: new Date().toISOString(),
      mode: 'read_only_native_approval_adapter_map',
      safety: {
        captured: [
          'adapter summary labels',
          'operating record counts',
          'record type coverage',
          'safe evidence route pointers',
        ],
        excluded: [
          'raw command execution',
          'approval write bodies',
          'database writes',
          'raw database rows',
          'credentials',
          'tokens',
          'cookies',
          'passwords',
          'browser tab contents',
          'VANTA-Brain file contents',
        ],
        writesAllowed: false,
      },
      sourceArtifacts: ['/aza/live-operating-records', '/aza/live-native-approval-adapter'],
      summary: {
        approvalDecisionSchemaModeled: false,
        approvalRequiredPackets: 1,
        blockedCapabilities: capabilities.filter((capability) => capability.status === 'blocked')
          .length,
        canonicalWritesAllowed: false,
        commandRecordSchemas: 0,
        liveOperatingRecordReadBinding: liveOperatingRecordsMap.summary.operatingRecordProof,
        operatingRecordTypesExpected: liveOperatingRecordsMap.summary.expectedRecordTypes,
        operatingRecordTypesFound: liveOperatingRecordsMap.summary.expectedRecordTypesFound,
        operatingRecordsVisible: liveOperatingRecordsMap.summary.recordCount,
        readReadyCapabilities: capabilities.filter(
          (capability) => capability.status === 'read_ready',
        ).length,
        writeAdapterReady: false,
        writesAllowed: false,
      },
    };
  }

  const [liveApprovalPacketMap, liveCommandGateMap, liveOperatingRecordsMap, liveSchemaMap] =
    await Promise.all([
      approvalPacketMap ?? getAzaLiveApprovalPacketMap(),
      commandGateMap ?? getAzaLiveCommandGateMap(),
      operatingRecordsMap ?? getAzaLiveOperatingRecordsMap(),
      schemaMap ?? getAzaLiveCommandRecordSchemaMap(),
    ]);
  const writeBlockers = buildWriteBlockers({
    approvalPacketMap: liveApprovalPacketMap,
    commandGateMap: liveCommandGateMap,
    schemaMap: liveSchemaMap,
  });
  const approvalDecisionSchemaModeled = hasSchema(liveSchemaMap, 'approval_decision');
  const writeAdapterReady =
    writeBlockers.length === 0 &&
    approvalDecisionSchemaModeled &&
    liveOperatingRecordsMap.summary.operatingRecordProof;

  const capabilities: AzaNativeApprovalAdapterCapability[] = [
    {
      blockedBy: [],
      evidence: ['/aza/live-operating-records'],
      id: 'operating_record_reader',
      label: 'Read live AzA operating records',
      nextAction:
        'Use this read binding as the board source while keeping write actions approval-gated.',
      proof: `${liveOperatingRecordsMap.summary.recordCount} operating records across ${liveOperatingRecordsMap.summary.expectedRecordTypesFound}/${liveOperatingRecordsMap.summary.expectedRecordTypes} expected types are visible.`,
      status: liveOperatingRecordsMap.summary.operatingRecordProof ? 'read_ready' : 'blocked',
    },
    {
      blockedBy:
        liveApprovalPacketMap.summary.approvalRequiredPackets > 0
          ? []
          : ['approval packet is missing'],
      evidence: ['/aza/live-approval-packet'],
      id: 'approval_packet_model',
      label: 'Model approval packets',
      nextAction:
        'Use packet ids and allowed/blocked command classes before any filesystem, browser, app, or AzA write.',
      proof: `${liveApprovalPacketMap.summary.approvalRequiredPackets} approval-required packet(s) and ${liveApprovalPacketMap.summary.commandPreviews} command preview(s) are modeled.`,
      status: liveApprovalPacketMap.summary.approvalRequiredPackets > 0 ? 'modeled' : 'blocked',
    },
    {
      blockedBy: approvalDecisionSchemaModeled
        ? writeBlockers
        : ['approval decision schema is missing'],
      evidence: ['/aza/live-command-record-schema', '/aza/live-command-gates'],
      id: 'approval_decision_writer',
      label: 'Write approval decisions',
      nextAction:
        'Keep disabled until canonical write gates, schema proof, and explicit human approval are all present.',
      proof: approvalDecisionSchemaModeled
        ? 'Approval decision schema is modeled.'
        : 'Approval decision schema is missing.',
      status: writeAdapterReady ? 'write_ready' : 'blocked',
    },
    {
      blockedBy: writeBlockers,
      evidence: ['/aza/live-command-record-schema', '/aza/live-codex-harness'],
      id: 'task_and_run_writer',
      label: 'Write command, task, and Codex run records',
      nextAction:
        'Wire only after approval decisions can be persisted with evidence and rollback metadata.',
      proof: `${liveSchemaMap.summary.recordTypes} command record schema(s) are modeled; durable write ready=${liveSchemaMap.summary.durableWriteReady ? 'yes' : 'no'}.`,
      status: writeAdapterReady ? 'write_ready' : 'blocked',
    },
  ];

  return {
    capabilities,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_native_approval_adapter_map',
    safety: {
      captured: [
        'approval packet counts',
        'command schema counts',
        'gate statuses',
        'operating record counts',
        'record type coverage',
        'adapter capability statuses',
        'safe evidence route pointers',
      ],
      excluded: [
        'raw command execution',
        'approval write bodies',
        'database writes',
        'raw database rows',
        'credentials',
        'tokens',
        'cookies',
        'passwords',
        'browser tab contents',
        'VANTA-Brain file contents',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-approval-packet',
      '/aza/live-command-gates',
      '/aza/live-command-record-schema',
      '/aza/live-operating-records',
    ],
    summary: {
      approvalDecisionSchemaModeled,
      approvalRequiredPackets: liveApprovalPacketMap.summary.approvalRequiredPackets,
      blockedCapabilities: capabilities.filter((capability) => capability.status === 'blocked')
        .length,
      canonicalWritesAllowed: false,
      commandRecordSchemas: liveSchemaMap.summary.recordTypes,
      liveOperatingRecordReadBinding: liveOperatingRecordsMap.summary.operatingRecordProof,
      operatingRecordTypesExpected: liveOperatingRecordsMap.summary.expectedRecordTypes,
      operatingRecordTypesFound: liveOperatingRecordsMap.summary.expectedRecordTypesFound,
      operatingRecordsVisible: liveOperatingRecordsMap.summary.recordCount,
      readReadyCapabilities: capabilities.filter((capability) => capability.status === 'read_ready')
        .length,
      writeAdapterReady,
      writesAllowed: false,
    },
  };
};
