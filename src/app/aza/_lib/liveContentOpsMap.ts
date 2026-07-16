import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { type AzaLiveAppMap, getAzaLiveAppMap, type LiveAppSurface } from './liveAppMap';
import { type AzaLiveCommandGateMap } from './liveCommandGateMap';

type JsonRecord = Record<string, unknown>;

export type ContentStageOperation = {
  appCount: number;
  appExamples: string[];
  id: string;
  name: string;
  recordTypes: string[];
  requiredEvidence: string[];
};

export type ContentAutomationMode = {
  appExamples: string[];
  count: number;
  description: string;
  mode: LiveAppSurface['automationMode'];
};

export type ContentApprovalItem = {
  app: string;
  mode: LiveAppSurface['automationMode'];
  reason: string;
  requiredBefore: string[];
  status: 'approval_required' | 'blocked';
};

export type ContentWriteBackStep = {
  rule: string;
  status: 'blocked' | 'draft_schema_ready';
  step: string;
  targetRecord: string;
};

export type ContentRegistryGap = {
  examples: string[];
  id: string;
  nextAction: string;
  status: 'approval_required' | 'blocked' | 'needs_classification';
};

export type AzaLiveContentOpsMap = {
  approvalQueue: ContentApprovalItem[];
  automationModes: ContentAutomationMode[];
  generatedAt: string;
  gaps: ContentRegistryGap[];
  mode: 'read_only_live_content_ops_map';
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  stages: ContentStageOperation[];
  summary: {
    appsNeedingApproval: number;
    blockedApps: number;
    contentStages: number;
    draftOnlyApps: number;
    humanApproveApps: number;
    installedApps: number;
    pendingVerificationApps: number;
    registryMatchedApps: number;
    reviewedCaptureApps: number;
    visibleApps: number;
    writeBackSteps: number;
    writesAllowed: false;
  };
  writeBackPlan: ContentWriteBackStep[];
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

const modeOrder: LiveAppSurface['automationMode'][] = [
  'read_only',
  'draft_only',
  'reviewed_capture',
  'human_approve',
  'blocked',
];

const appsForStage = (apps: LiveAppSurface[], stageId: string) =>
  apps
    .filter((app) => app.contentStages.includes(stageId))
    .map((app) => app.name)
    .sort((a, b) => a.localeCompare(b));

const buildStages = (registry: JsonRecord, appMap: AzaLiveAppMap): ContentStageOperation[] =>
  recordArray(registry.contentStages).map((stage) => {
    const id = text(stage.id, 'unknown');
    const appNames = appsForStage(appMap.installedApps, id);

    return {
      appCount: appNames.length,
      appExamples: appNames.slice(0, 12),
      id,
      name: text(stage.name, id),
      recordTypes: stringArray(stage.recordTypes),
      requiredEvidence: stringArray(stage.requiredEvidence),
    };
  });

const buildAutomationModes = (
  registry: JsonRecord,
  appMap: AzaLiveAppMap,
): ContentAutomationMode[] => {
  const descriptions = registry.automationModes as JsonRecord | undefined;

  return modeOrder.map((mode) => {
    const apps = appMap.installedApps
      .filter((app) => app.automationMode === mode)
      .map((app) => app.name)
      .sort((a, b) => a.localeCompare(b));

    return {
      appExamples: apps.slice(0, 12),
      count: apps.length,
      description: text(descriptions?.[mode], 'No registry description available.'),
      mode,
    };
  });
};

const buildApprovalQueue = (
  appMap: AzaLiveAppMap,
  commandGateMap?: AzaLiveCommandGateMap,
): ContentApprovalItem[] => {
  const browserDeviceGate = commandGateMap?.gates.find(
    (gate) => gate.id === 'browser_device_actions',
  );
  const filesystemGate = commandGateMap?.gates.find((gate) => gate.id === 'van_filesystem_writes');

  return appMap.installedApps
    .filter((app) => app.automationMode === 'human_approve' || app.automationMode === 'blocked')
    .filter((app) => app.visible || app.registryRole || app.automationMode === 'blocked')
    .map(
      (app): ContentApprovalItem => ({
        app: app.name,
        mode: app.automationMode,
        reason:
          app.automationMode === 'blocked'
            ? 'App purpose, account boundary, output path, or risk classification is not ready.'
            : 'Final send, post, publish, purchase, account-changing, or device action requires explicit approval.',
        requiredBefore: [
          browserDeviceGate?.id ?? 'browser_device_actions',
          filesystemGate?.id ?? 'van_filesystem_writes',
        ],
        status: app.automationMode === 'blocked' ? 'blocked' : 'approval_required',
      }),
    )
    .sort((a, b) => a.app.localeCompare(b.app));
};

const buildWriteBackPlan = (registry: JsonRecord): ContentWriteBackStep[] =>
  recordArray(registry.writeBackPlan).map((step) => ({
    rule: text(step.rule, 'No rule documented.'),
    status: 'blocked',
    step: text(step.step, 'unknown'),
    targetRecord: text(step.targetRecord, 'unknown'),
  }));

const buildGaps = (registry: JsonRecord, appMap: AzaLiveAppMap): ContentRegistryGap[] => {
  const pendingVerification = stringArray(registry.candidateAppsPendingVerification);
  const unassignedInstalled = appMap.installedApps
    .filter((app) => app.category !== 'unclassified_app' && app.contentStages.length === 0)
    .map((app) => app.name)
    .slice(0, 20);
  const missingRegistry = appMap.installedApps
    .filter((app) => !app.registryRole && app.category !== 'unclassified_app')
    .map((app) => app.name)
    .slice(0, 20);

  return [
    {
      examples: pendingVerification.slice(0, 20),
      id: 'candidate_apps_pending_verification',
      nextAction:
        'Confirm role, account label, output folder, allowed action mode, related project, and evidence pointer for each candidate app.',
      status: pendingVerification.length > 0 ? 'needs_classification' : 'blocked',
    },
    {
      examples: unassignedInstalled,
      id: 'installed_apps_missing_content_stage',
      nextAction:
        'Attach each content-capable app to research, strategy, generation, editing, publishing, measurement, or projection.',
      status: unassignedInstalled.length > 0 ? 'needs_classification' : 'blocked',
    },
    {
      examples: missingRegistry,
      id: 'installed_apps_missing_registry_role',
      nextAction:
        'Create safe app_surface metadata before any app capture, publishing flow, or browser/device action.',
      status: missingRegistry.length > 0 ? 'needs_classification' : 'blocked',
    },
    {
      examples: ['content_campaign', 'asset', 'publish_event', 'analytics_snapshot'],
      id: 'durable_write_back_blocked',
      nextAction:
        'Enable only after AzA API/MCP health, schema validation, durable store, redaction, and approval gates pass.',
      status: 'blocked',
    },
  ];
};

export const getAzaLiveContentOpsMap = async ({
  appMap,
  commandGateMap,
}: {
  appMap?: AzaLiveAppMap;
  commandGateMap?: AzaLiveCommandGateMap;
} = {}): Promise<AzaLiveContentOpsMap> => {
  const [registry, liveAppMap] = await Promise.all([
    readJson('content-generation-app-registry.json'),
    appMap ?? getAzaLiveAppMap(),
  ]);
  const stages = buildStages(registry, liveAppMap);
  const automationModes = buildAutomationModes(registry, liveAppMap);
  const approvalQueue = buildApprovalQueue(liveAppMap, commandGateMap);
  const writeBackPlan = buildWriteBackPlan(registry);
  const gaps = buildGaps(registry, liveAppMap);

  return {
    approvalQueue,
    automationModes,
    gaps,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_content_ops_map',
    safety: {
      captured: [
        'app names',
        'bundle metadata from existing app map',
        'content stage labels',
        'automation mode labels',
        'approval queue labels',
        'write-back record type names',
        'registry gap labels',
      ],
      excluded: [
        'window contents',
        'browser tabs',
        'messages',
        'documents',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
        'raw login state',
        'generated media contents',
      ],
      writesAllowed: false,
    },
    stages,
    summary: {
      appsNeedingApproval: approvalQueue.length,
      blockedApps: liveAppMap.summary.blockedApps,
      contentStages: stages.length,
      draftOnlyApps: liveAppMap.summary.draftOnlyApps,
      humanApproveApps: liveAppMap.summary.humanApproveApps,
      installedApps: liveAppMap.summary.installedAppCount,
      pendingVerificationApps: liveAppMap.summary.contentCandidateCount,
      registryMatchedApps: liveAppMap.summary.registryMatchedApps,
      reviewedCaptureApps: liveAppMap.summary.reviewedCaptureApps,
      visibleApps: liveAppMap.summary.visibleAppCount,
      writeBackSteps: writeBackPlan.length,
      writesAllowed: false,
    },
    writeBackPlan,
  };
};
