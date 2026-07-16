import {
  type AzaLiveContentAppAuditMap,
  type ContentAppAuditTarget,
  type ContentAppMetadataSlot,
  getAzaLiveContentAppAuditMap,
} from './liveContentAppAuditMap';

type CollectionMethod =
  | 'browser_session_confirmation'
  | 'filesystem_path_label'
  | 'manual_operator_label'
  | 'redacted_evidence_pointer'
  | 'registry_review';

type CollectionStatus =
  | 'blocked_by_app_status'
  | 'known_from_registry'
  | 'ready_for_browser_assisted_audit'
  | 'ready_for_manual_audit';

export type ContentAppCollectionField = {
  fieldId: string;
  label: string;
  method: CollectionMethod;
  placeholder: string;
  requiredBefore: string[];
  safetyRule: string;
  status: ContentAppMetadataSlot['status'];
  valueSource: string;
};

export type ContentAppCollectionPacket = {
  app: string;
  automationMode: ContentAppAuditTarget['automationMode'];
  category: string;
  collectionFields: ContentAppCollectionField[];
  evidence: string[];
  inputOutputFlow: string[];
  missingFields: string[];
  nextAction: string;
  path: string | null;
  recordTargets: string[];
  status: CollectionStatus;
};

export type AzaLiveContentAppMetadataCollectionPlanMap = {
  generatedAt: string;
  mode: 'read_only_content_app_metadata_collection_plan';
  packets: ContentAppCollectionPacket[];
  recommendation: {
    browserSessionRule: string;
    collectionRule: string;
    promotionRule: string;
    writeRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    blockedPackets: number;
    browserAssistedPackets: number;
    collectionFields: number;
    knownPackets: number;
    manualPackets: number;
    missingCollectionFields: number;
    packets: number;
    writesAllowed: false;
  };
};

const isBrowserSurface = (target: ContentAppAuditTarget) =>
  target.category === 'browser_webapp_surface' ||
  target.contentStages.some((stage) => /publish|measure|research|social/i.test(stage));

const collectionMethodFor = (slot: ContentAppMetadataSlot): CollectionMethod => {
  if (slot.id === 'account_label') return 'browser_session_confirmation';
  if (slot.id === 'auth_pointer') return 'manual_operator_label';
  if (slot.id === 'default_export_path') return 'filesystem_path_label';
  if (slot.id === 'output_kinds') return 'registry_review';
  if (slot.id === 'evidence_pointer') return 'redacted_evidence_pointer';

  return 'registry_review';
};

const statusForPacket = (
  target: ContentAppAuditTarget,
  missingFields: string[],
): CollectionStatus => {
  if (target.status === 'blocked') return 'blocked_by_app_status';
  if (missingFields.length === 0) return 'known_from_registry';
  if (isBrowserSurface(target)) return 'ready_for_browser_assisted_audit';

  return 'ready_for_manual_audit';
};

const recordTargetsFor = (target: ContentAppAuditTarget) => {
  const targets = new Set<string>(['app_surface']);

  if (target.contentStages.includes('capture') || target.contentStages.includes('draft')) {
    targets.add('asset');
    targets.add('content_campaign');
  }
  if (target.contentStages.includes('publish')) targets.add('publish_event');
  if (target.contentStages.includes('measure')) targets.add('analytics_snapshot');
  if (target.metadataSlots.some((slot) => slot.id === 'evidence_pointer')) targets.add('evidence');

  return [...targets].sort((a, b) => a.localeCompare(b));
};

const inputOutputFlowFor = (target: ContentAppAuditTarget) => [
  'Start with the operator intent, target campaign, and app name from the command center.',
  isBrowserSurface(target)
    ? 'Use a logged-in browser/app session only to confirm safe visible labels and export workflow.'
    : 'Use local app metadata or manual operator review to fill safe labels.',
  'Record only account labels, auth pointer names, export path labels, output kind labels, and redacted evidence pointers.',
  'Keep generated files, screenshots, page contents, cookies, tokens, messages, and raw credentials outside this plan unless separately approved.',
  'Promote reviewed metadata into AzA records only after canonical write and approval gates pass.',
];

const buildPacket = (target: ContentAppAuditTarget): ContentAppCollectionPacket => {
  const collectionFields = target.metadataSlots.map(
    (slot): ContentAppCollectionField => ({
      fieldId: slot.id,
      label: slot.label,
      method: collectionMethodFor(slot),
      placeholder: slot.placeholder,
      requiredBefore: slot.requiredBefore,
      safetyRule: slot.safetyRule,
      status: slot.status,
      valueSource: slot.valueSource,
    }),
  );
  const missingFields = collectionFields
    .filter((field) => field.status === 'audit_required')
    .map((field) => field.fieldId);

  return {
    app: target.name,
    automationMode: target.automationMode,
    category: target.category,
    collectionFields,
    evidence: [
      '/aza/live-content-app-audit',
      '/aza/live-browser-operating-sessions',
      '/aza/live-access-capability-map',
    ],
    inputOutputFlow: inputOutputFlowFor(target),
    missingFields,
    nextAction:
      missingFields.length > 0
        ? `Collect safe metadata fields: ${missingFields.join(', ')}.`
        : 'Keep metadata read-only until an action-specific approval exists.',
    path: target.path,
    recordTargets: recordTargetsFor(target),
    status: statusForPacket(target, missingFields),
  };
};

export const getAzaLiveContentAppMetadataCollectionPlanMap = async ({
  contentAppAuditMap,
}: {
  contentAppAuditMap?: AzaLiveContentAppAuditMap;
} = {}): Promise<AzaLiveContentAppMetadataCollectionPlanMap> => {
  const audit = contentAppAuditMap ?? (await getAzaLiveContentAppAuditMap());
  const packets = audit.targets.map(buildPacket).sort((a, b) => a.app.localeCompare(b.app));
  const collectionFields = packets.flatMap((packet) => packet.collectionFields);

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_content_app_metadata_collection_plan',
    packets,
    recommendation: {
      browserSessionRule:
        'Browser sessions can facilitate inputs and outputs, but they are working context, not durable memory.',
      collectionRule:
        'Collect safe labels and pointers first; never collect secret values, cookies, raw tabs, or private content in this route.',
      promotionRule:
        'Promote reviewed metadata to AzA typed records only after source, session, sensitivity, owner, and evidence are attached.',
      writeRule:
        'Do not write to VAN, LobeHub, VANTA-Brain, app accounts, or browser sessions from this plan without explicit approval.',
    },
    safety: {
      captured: [
        'app names',
        'app paths',
        'category labels',
        'automation modes',
        'metadata field ids',
        'metadata field status labels',
        'safe placeholders',
        'collection method labels',
        'record target labels',
        'evidence route pointers',
      ],
      excluded: [
        'account usernames unless separately approved',
        'passwords',
        'API keys',
        'OAuth tokens',
        'cookies',
        'browser local storage',
        'raw browser tabs',
        'private messages',
        'raw screenshots',
        'generated file contents',
        'VANTA-Brain writes',
        'VAN writes',
        'LobeHub writes outside this code change',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-content-app-audit',
      '/aza/live-browser-operating-sessions',
      '/aza/live-access-capability-map',
      '/aza/live-content-ops',
    ],
    summary: {
      blockedPackets: packets.filter((packet) => packet.status === 'blocked_by_app_status').length,
      browserAssistedPackets: packets.filter(
        (packet) => packet.status === 'ready_for_browser_assisted_audit',
      ).length,
      collectionFields: collectionFields.length,
      knownPackets: packets.filter((packet) => packet.status === 'known_from_registry').length,
      manualPackets: packets.filter((packet) => packet.status === 'ready_for_manual_audit').length,
      missingCollectionFields: collectionFields.filter((field) => field.status === 'audit_required')
        .length,
      packets: packets.length,
      writesAllowed: false,
    },
  };
};
