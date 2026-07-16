import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { type AzaLiveAppMap, getAzaLiveAppMap, type LiveAppSurface } from './liveAppMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import { type AzaLiveContentOpsMap, getAzaLiveContentOpsMap } from './liveContentOpsMap';

type JsonRecord = Record<string, unknown>;

type AuditStatus =
  | 'approval_required'
  | 'audit_required'
  | 'blocked'
  | 'known_from_registry'
  | 'not_applicable';

export type ContentAppAuditField = {
  id: string;
  label: string;
  requiredBefore: string[];
  safetyRule: string;
  status: AuditStatus;
  valueSource: string;
};

export type ContentAppMetadataSlot = {
  id: string;
  label: string;
  placeholder: string;
  requiredBefore: string[];
  safetyRule: string;
  status: AuditStatus;
  valueSource: string;
};

export type ContentAppAuditTarget = {
  allowedActions: string[];
  automationMode: LiveAppSurface['automationMode'];
  blockedActions: string[];
  category: string;
  contentStages: string[];
  evidence: string[];
  fieldStatuses: ContentAppAuditField[];
  installed: boolean;
  metadataSlots: ContentAppMetadataSlot[];
  missingRequiredFields: string[];
  name: string;
  nextAction: string;
  path: string | null;
  registryRole: string | null;
  requiredGates: string[];
  status: AuditStatus;
  visible: boolean;
};

export type ContentAppAuditLane = {
  appNames: string[];
  gate: string;
  id: string;
  label: string;
  nextAction: string;
  status: AuditStatus;
};

export type AzaLiveContentAppAuditMap = {
  auditFields: ContentAppAuditField[];
  generatedAt: string;
  lanes: ContentAppAuditLane[];
  mode: 'read_only_live_content_app_audit_map';
  recommendation: {
    auditRule: string;
    contentRule: string;
    publishRule: string;
    storageRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    approvalRequiredTargets: number;
    auditRequiredTargets: number;
    blockedTargets: number;
    browserSurfaceTargets: number;
    contentTargets: number;
    draftOnlyTargets: number;
    humanApproveTargets: number;
    metadataSlots: number;
    missingMetadataSlots: number;
    missingAccountLabels: number;
    missingAuthPointers: number;
    missingEvidencePointers: number;
    missingOutputPaths: number;
    readyForCaptureTargets: number;
    reviewedCaptureTargets: number;
    visibleTargets: number;
    writesAllowed: false;
  };
  targets: ContentAppAuditTarget[];
};

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const readJson = async (name: string): Promise<JsonRecord> => {
  const raw = await readFile(artifactPath(name), 'utf8');
  const parsed: unknown = JSON.parse(raw);

  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as JsonRecord)
    : {};
};

const recordArray = (value: unknown): JsonRecord[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is JsonRecord =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const normalizeName = (name: string) =>
  name
    .replace(/\.app$/i, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const buildRegistryLookup = (registry: JsonRecord) => {
  const lookup = new Map<string, JsonRecord>();

  for (const app of recordArray(registry.currentObservedApps)) {
    const name = text(app.name);
    if (name) lookup.set(normalizeName(name), app);
  }

  return lookup;
};

const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const statusFromPresent = (present: boolean): AuditStatus =>
  present ? 'known_from_registry' : 'audit_required';

const inferredOutputKindsFor = (app: LiveAppSurface, registryRecord: JsonRecord) => {
  const explicitKinds = stringArray(registryRecord.outputKinds);
  if (explicitKinds.length > 0) return explicitKinds;

  const labels = new Set<string>();
  const context = `${app.name} ${app.category} ${app.contentStages.join(' ')}`.toLowerCase();

  if (/image|visual|design|photo|figma|canva/.test(context)) labels.add('image');
  if (/video|screen|clip|heygen|capcut/.test(context)) labels.add('video');
  if (/audio|voice|music|suno|whisper|transcript/.test(context)) labels.add('audio');
  if (/transcript|dictation|whisper|meeting/.test(context)) labels.add('transcript');
  if (/post|copy|social|publish|instagram|tiktok|linkedin|x\b/.test(context))
    labels.add('post_copy');
  if (/analytics|measure|report|dashboard/.test(context)) labels.add('analytics_snapshot');
  if (/document|docs|note|knowledge|research|pdf/.test(context)) labels.add('document');
  if (/browser|webapp|capture|screenshot/.test(context)) labels.add('screenshot');

  return [...labels].sort((a, b) => a.localeCompare(b));
};

const requiredMetadataFieldIds = [
  'account_label',
  'auth_pointer',
  'default_export_path',
  'output_kinds',
  'evidence_pointer',
] as const;

const isRequiredMetadataFieldId = (
  fieldId: string,
): fieldId is (typeof requiredMetadataFieldIds)[number] =>
  (requiredMetadataFieldIds as readonly string[]).includes(fieldId);

const metadataSlotPlaceholder = (fieldId: string) => {
  if (fieldId === 'account_label') {
    return 'Safe account/profile label only; no username, password, cookie, or token.';
  }
  if (fieldId === 'auth_pointer') {
    return 'Pointer label to an existing auth store, profile, or env var name; no secret value.';
  }
  if (fieldId === 'default_export_path') {
    return 'Folder path or export destination label; file contents require separate approval.';
  }
  if (fieldId === 'output_kinds') {
    return 'Allowed kinds such as image, video, audio, transcript, post copy, or analytics snapshot.';
  }
  if (fieldId === 'evidence_pointer') {
    return 'Redacted screenshot, route, receipt, or reviewed artifact path label.';
  }

  return 'Metadata label only.';
};

const field = ({
  id,
  label,
  requiredBefore,
  safetyRule,
  status,
  valueSource,
}: ContentAppAuditField): ContentAppAuditField => ({
  id,
  label,
  requiredBefore,
  safetyRule,
  status,
  valueSource,
});

const targetStatus = (
  app: LiveAppSurface,
  missingRequiredFields: string[],
): ContentAppAuditTarget['status'] => {
  if (app.automationMode === 'blocked') return 'blocked';
  if (app.automationMode === 'human_approve') return 'approval_required';
  if (missingRequiredFields.length > 0) return 'audit_required';

  return 'known_from_registry';
};

const nextActionFor = (target: Pick<ContentAppAuditTarget, 'automationMode' | 'status'>) => {
  if (target.status === 'blocked') {
    return 'Classify purpose, account boundary, output path, risk, and owner before any capture or automation.';
  }
  if (target.status === 'approval_required') {
    return 'Collect missing audit fields, then ask for explicit approval before publishing, messaging, device, account, or filesystem actions.';
  }
  if (target.status === 'audit_required') {
    return 'Fill account label, auth pointer, output path, output kinds, owner, and evidence pointer before allowing reviewed capture.';
  }
  if (target.automationMode === 'draft_only') {
    return 'Allow drafting only; register generated assets after reviewed export path and evidence are attached.';
  }

  return 'Keep as read-only metadata until a narrower action-specific approval exists.';
};

const requiredGatesFor = (
  app: LiveAppSurface,
  missingRequiredFields: string[],
  commandGateMap?: AzaLiveCommandGateMap,
) => {
  const gates = new Set<string>();
  const browserDeviceGate = commandGateMap?.gates.find(
    (gate) => gate.id === 'browser_device_actions',
  );
  const filesystemGate = commandGateMap?.gates.find((gate) => gate.id === 'van_filesystem_writes');

  if (app.automationMode === 'blocked' || app.automationMode === 'human_approve') {
    gates.add(browserDeviceGate?.id ?? 'browser_device_actions');
  }

  if (
    missingRequiredFields.includes('default_export_path') ||
    missingRequiredFields.includes('evidence_pointer')
  ) {
    gates.add(filesystemGate?.id ?? 'van_filesystem_writes');
  }

  if (missingRequiredFields.length > 0) gates.add('content_app_audit_required');

  return [...gates].sort((a, b) => a.localeCompare(b));
};

const appNeedsAudit = (app: LiveAppSurface) =>
  Boolean(app.registryRole) ||
  app.category !== 'unclassified_app' ||
  app.automationMode === 'blocked';

const buildTarget = ({
  app,
  commandGateMap,
  registryRecord,
}: {
  app: LiveAppSurface;
  commandGateMap?: AzaLiveCommandGateMap;
  registryRecord: JsonRecord;
}): ContentAppAuditTarget => {
  const inferredOutputKinds = inferredOutputKindsFor(app, registryRecord);
  const fields = [
    field({
      id: 'name',
      label: 'App name',
      requiredBefore: ['app_surface_record'],
      safetyRule: 'Safe desktop metadata only.',
      status: statusFromPresent(hasText(registryRecord.name) || hasText(app.name)),
      valueSource: hasText(registryRecord.name)
        ? 'content-generation-app-registry.json'
        : 'live app map',
    }),
    field({
      id: 'bundle_id',
      label: 'Bundle id',
      requiredBefore: ['app_surface_record'],
      safetyRule: 'Bundle id is safe metadata; do not infer login state from it.',
      status: statusFromPresent(hasText(registryRecord.bundleId) || hasText(app.bundleId)),
      valueSource: hasText(registryRecord.bundleId)
        ? 'content-generation-app-registry.json'
        : app.bundleId
          ? 'live app map'
          : 'missing',
    }),
    field({
      id: 'content_role',
      label: 'Content role',
      requiredBefore: ['content_campaign_record'],
      safetyRule: 'Role label only; no document or tab contents.',
      status: statusFromPresent(hasText(registryRecord.role) || Boolean(app.registryRole)),
      valueSource: hasText(registryRecord.role)
        ? 'content-generation-app-registry.json'
        : 'missing',
    }),
    field({
      id: 'content_stage',
      label: 'Content stage',
      requiredBefore: ['content_campaign_record'],
      safetyRule: 'Stage labels only.',
      status: statusFromPresent(app.contentStages.length > 0),
      valueSource:
        app.contentStages.length > 0 ? 'content-generation-app-registry.json' : 'missing',
    }),
    field({
      id: 'account_label',
      label: 'Account label',
      requiredBefore: ['publish_event', 'approved_capture', 'browser_device_action'],
      safetyRule:
        'Use a human-readable account label only; never store cookies, passwords, or tokens.',
      status: statusFromPresent(hasText(registryRecord.accountLabel)),
      valueSource: hasText(registryRecord.accountLabel)
        ? 'content-generation-app-registry.json'
        : 'missing',
    }),
    field({
      id: 'auth_pointer',
      label: 'Auth pointer',
      requiredBefore: ['approved_capture', 'publish_event'],
      safetyRule: 'Pointer to existing auth store only; never copy raw credentials.',
      status: statusFromPresent(hasText(registryRecord.authPointer)),
      valueSource: hasText(registryRecord.authPointer)
        ? 'content-generation-app-registry.json'
        : 'missing',
    }),
    field({
      id: 'default_export_path',
      label: 'Default export path',
      requiredBefore: ['asset_record', 'evidence_receipt'],
      safetyRule: 'Path label only; do not read exported file contents in this audit.',
      status: statusFromPresent(hasText(registryRecord.defaultExportPath)),
      valueSource: hasText(registryRecord.defaultExportPath)
        ? 'content-generation-app-registry.json'
        : 'missing',
    }),
    field({
      id: 'output_kinds',
      label: 'Output kinds',
      requiredBefore: ['asset_record', 'content_campaign_record'],
      safetyRule: 'Kind labels only, such as image, video, transcript, document, or screenshot.',
      status: statusFromPresent(inferredOutputKinds.length > 0),
      valueSource: stringArray(registryRecord.outputKinds).length
        ? 'content-generation-app-registry.json'
        : inferredOutputKinds.length > 0
          ? 'derived from safe category/stage labels'
          : 'missing',
    }),
    field({
      id: 'evidence_pointer',
      label: 'Evidence pointer',
      requiredBefore: ['verified_capture', 'publish_event', 'analytics_snapshot'],
      safetyRule: 'Evidence must point to a redacted safe artifact, command output, or screenshot.',
      status: statusFromPresent(hasText(registryRecord.evidencePointer)),
      valueSource: hasText(registryRecord.evidencePointer)
        ? 'content-generation-app-registry.json'
        : 'missing',
    }),
  ];
  const missingRequiredFields = fields
    .filter((candidate) => isRequiredMetadataFieldId(candidate.id))
    .filter((candidate) => candidate.status === 'audit_required')
    .map((candidate) => candidate.id);
  const metadataSlots = fields
    .filter((candidate) => isRequiredMetadataFieldId(candidate.id))
    .map(
      (candidate): ContentAppMetadataSlot => ({
        id: candidate.id,
        label: candidate.label,
        placeholder: metadataSlotPlaceholder(candidate.id),
        requiredBefore: candidate.requiredBefore,
        safetyRule: candidate.safetyRule,
        status: candidate.status,
        valueSource: candidate.valueSource,
      }),
    );
  const status = targetStatus(app, missingRequiredFields);
  const allowedActions = stringArray(registryRecord.allowedActions);
  const blockedActions = stringArray(registryRecord.blockedActions);

  return {
    allowedActions,
    automationMode: app.automationMode,
    blockedActions,
    category: app.category,
    contentStages: app.contentStages,
    evidence: ['/aza/live-app-map', '/aza/live-content-ops'],
    fieldStatuses: fields,
    installed: app.installed,
    metadataSlots,
    missingRequiredFields,
    name: app.name,
    nextAction: nextActionFor({ automationMode: app.automationMode, status }),
    path: app.path,
    registryRole: app.registryRole,
    requiredGates: requiredGatesFor(app, missingRequiredFields, commandGateMap),
    status,
    visible: app.visible,
  };
};

const buildAuditFields = (): ContentAppAuditField[] => [
  field({
    id: 'account_label',
    label: 'Account label',
    requiredBefore: ['publish_event', 'approved_capture', 'browser_device_action'],
    safetyRule: 'Store account labels only, not login material.',
    status: 'audit_required',
    valueSource: 'operator-approved audit',
  }),
  field({
    id: 'auth_pointer',
    label: 'Auth pointer',
    requiredBefore: ['approved_capture', 'publish_event'],
    safetyRule: 'Point to existing auth store or env var label; never copy secrets.',
    status: 'audit_required',
    valueSource: 'operator-approved audit',
  }),
  field({
    id: 'default_export_path',
    label: 'Default export path',
    requiredBefore: ['asset_record', 'evidence_receipt'],
    safetyRule: 'Path metadata only; content reads need separate approval.',
    status: 'audit_required',
    valueSource: 'operator-approved audit',
  }),
  field({
    id: 'output_kinds',
    label: 'Output kinds',
    requiredBefore: ['asset_record', 'content_campaign_record'],
    safetyRule: 'Classify output type without opening private content.',
    status: 'audit_required',
    valueSource: 'operator-approved audit',
  }),
  field({
    id: 'evidence_pointer',
    label: 'Evidence pointer',
    requiredBefore: ['verified_capture', 'publish_event', 'analytics_snapshot'],
    safetyRule: 'Use redacted screenshots, command output, or reviewed artifact paths.',
    status: 'audit_required',
    valueSource: 'operator-approved audit',
  }),
];

const buildLanes = (targets: ContentAppAuditTarget[]): ContentAppAuditLane[] => {
  const missingAccount = targets.filter((target) =>
    target.missingRequiredFields.includes('account_label'),
  );
  const missingOutput = targets.filter((target) =>
    target.missingRequiredFields.includes('default_export_path'),
  );
  const approvalRequired = targets.filter((target) => target.status === 'approval_required');
  const blocked = targets.filter((target) => target.status === 'blocked');

  return [
    {
      appNames: missingAccount.map((target) => target.name).slice(0, 24),
      gate: 'account_boundary',
      id: 'account_label_audit',
      label: 'Account label audit',
      nextAction:
        'Assign safe account labels and auth pointers before capture, posting, messaging, or measurement.',
      status: missingAccount.length > 0 ? 'audit_required' : 'known_from_registry',
    },
    {
      appNames: missingOutput.map((target) => target.name).slice(0, 24),
      gate: 'asset_export_path',
      id: 'output_path_audit',
      label: 'Output and export path audit',
      nextAction:
        'Map default import/export folders and output kinds before registering asset records.',
      status: missingOutput.length > 0 ? 'audit_required' : 'known_from_registry',
    },
    {
      appNames: approvalRequired.map((target) => target.name).slice(0, 24),
      gate: 'browser_device_actions',
      id: 'human_approval_lane',
      label: 'Human approval lane',
      nextAction:
        'Keep publishing, messaging, account, device, and filesystem actions approval-first.',
      status: approvalRequired.length > 0 ? 'approval_required' : 'not_applicable',
    },
    {
      appNames: blocked.map((target) => target.name).slice(0, 24),
      gate: 'classification_required',
      id: 'blocked_app_lane',
      label: 'Blocked app classification',
      nextAction:
        'Classify role, account boundary, output path, owner, and risk before allowing capture.',
      status: blocked.length > 0 ? 'blocked' : 'not_applicable',
    },
  ];
};

export const getAzaLiveContentAppAuditMap = async ({
  appMap,
  commandGateMap,
  contentOpsMap,
}: {
  appMap?: AzaLiveAppMap;
  commandGateMap?: AzaLiveCommandGateMap;
  contentOpsMap?: AzaLiveContentOpsMap;
} = {}): Promise<AzaLiveContentAppAuditMap> => {
  const liveAppMap = appMap ?? (await getAzaLiveAppMap());
  const liveCommandGateMap =
    commandGateMap ?? (await getAzaLiveCommandGateMap({ appMap: liveAppMap }));
  const [registry, liveContentOpsMap] = await Promise.all([
    readJson('content-generation-app-registry.json'),
    contentOpsMap ??
      getAzaLiveContentOpsMap({
        appMap: liveAppMap,
        commandGateMap: liveCommandGateMap,
      }),
  ]);
  const registryLookup = buildRegistryLookup(registry);
  const targets = liveAppMap.installedApps
    .filter(appNeedsAudit)
    .map((app) =>
      buildTarget({
        app,
        commandGateMap: liveCommandGateMap,
        registryRecord: registryLookup.get(normalizeName(app.name)) ?? {},
      }),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const lanes = buildLanes(targets);

  return {
    auditFields: buildAuditFields(),
    generatedAt: new Date().toISOString(),
    lanes,
    mode: 'read_only_live_content_app_audit_map',
    recommendation: {
      auditRule:
        'Do not use a content app for capture, publishing, measurement, or AzA asset records until account label, auth pointer, output path, output kinds, and evidence pointer are mapped.',
      contentRule:
        'Draft-only tools may generate ideas or assets, but produced files enter AzA only after reviewed export path and evidence are attached.',
      publishRule:
        'Publishing, messaging, posting, account-changing, purchasing, and device actions require explicit human approval every time.',
      storageRule:
        'Store metadata and pointers only. Never store cookies, tokens, passwords, raw private messages, browser tabs, or unreviewed document contents.',
    },
    safety: {
      captured: [
        'app names',
        'app paths',
        'bundle ids',
        'visible app names',
        'content role labels',
        'content stages',
        'automation modes',
        'allowed action labels',
        'blocked action labels',
        'missing field labels',
        'metadata slot ids',
        'metadata slot status labels',
        'metadata slot placeholder labels',
        'required gate ids',
        'audit lane labels',
      ],
      excluded: [
        'browser tabs',
        'window titles',
        'window contents',
        'documents',
        'private messages',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
        'raw login state',
        'generated media contents',
        'exported file contents',
        'raw metadata values',
      ],
      writesAllowed: false,
    },
    summary: {
      approvalRequiredTargets: targets.filter((target) => target.status === 'approval_required')
        .length,
      auditRequiredTargets: targets.filter((target) => target.status === 'audit_required').length,
      blockedTargets: targets.filter((target) => target.status === 'blocked').length,
      browserSurfaceTargets: targets.filter((target) =>
        /browser|webapp/i.test(`${target.category} ${target.registryRole ?? ''}`),
      ).length,
      contentTargets: targets.length,
      draftOnlyTargets: targets.filter((target) => target.automationMode === 'draft_only').length,
      humanApproveTargets: targets.filter((target) => target.automationMode === 'human_approve')
        .length,
      metadataSlots: targets.reduce((total, target) => total + target.metadataSlots.length, 0),
      missingMetadataSlots: targets.reduce(
        (total, target) =>
          total + target.metadataSlots.filter((slot) => slot.status === 'audit_required').length,
        0,
      ),
      missingAccountLabels: targets.filter((target) =>
        target.missingRequiredFields.includes('account_label'),
      ).length,
      missingAuthPointers: targets.filter((target) =>
        target.missingRequiredFields.includes('auth_pointer'),
      ).length,
      missingEvidencePointers: targets.filter((target) =>
        target.missingRequiredFields.includes('evidence_pointer'),
      ).length,
      missingOutputPaths: targets.filter((target) =>
        target.missingRequiredFields.includes('default_export_path'),
      ).length,
      readyForCaptureTargets: targets.filter((target) => target.status === 'known_from_registry')
        .length,
      reviewedCaptureTargets: targets.filter(
        (target) => target.automationMode === 'reviewed_capture',
      ).length,
      visibleTargets: targets.filter((target) => target.visible).length,
      writesAllowed: liveContentOpsMap.summary.writesAllowed,
    },
    targets,
  };
};
