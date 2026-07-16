import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { getAzaLiveContentAppAuditMap } from '../_lib/liveContentAppAuditMap';
import { getAzaLiveMcpToolingMap } from '../_lib/liveMcpToolingMap';
import { getAzaLiveOperatingRecordsMap } from '../_lib/liveOperatingRecordsMap';
import { getAzaLiveReadiness } from '../_lib/liveReadiness';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type JsonRecord = Record<string, unknown>;

const SYSTEM_ROOTS = [
  {
    id: 'lobehub',
    label: 'LobeHub harness',
    path: '/Users/growthgod/lobehub',
    role: 'AzA command center, approval UI, operator board, and artifact catalog.',
    writePolicy: 'Scoped command-center writes only after organization is explained.',
  },
  {
    id: 'van',
    label: 'VAN active runtime workspace',
    path: '/Users/growthgod/VAN',
    role: 'Active product repos, agent repos, AzA implementation, device adapters, and service code.',
    writePolicy: 'No writes without explicit target, reason, rollback, and approval.',
  },
  {
    id: 'aza-memory',
    label: 'AzA canonical brain target',
    path: '/Users/growthgod/VAN/aza_memory',
    role: 'Typed memory records, search indexes, MCP access, events, and projection pipeline.',
    writePolicy: 'Blocked until AzA API, MCP, durable store, schema, and redaction gates pass.',
  },
  {
    id: 'vanta-brain',
    label: 'VANTA-Brain projection vault',
    path: '/Users/growthgod/Documents/VANTA-Brain',
    role: 'Human-readable reviewed summaries, decisions, indexes, and safe projections.',
    writePolicy: 'Read-only during this pass.',
  },
  {
    id: 'codex-state',
    label: 'Codex local state',
    path: '/Users/growthgod/.codex',
    role: 'Codex goals, worktrees, skills, memories, rollouts, plugins, and execution evidence.',
    writePolicy: 'Runtime-native; promote durable facts into AzA with provenance.',
  },
  {
    id: 'agents-state',
    label: 'Agent skills root',
    path: '/Users/growthgod/.agents',
    role: 'Shared agent skills, prompts, and capability packages.',
    writePolicy: 'Index metadata first; do not blindly copy skill bodies into canonical memory.',
  },
  {
    id: 'hermes-state',
    label: 'Hermes runtime',
    path: '/Users/growthgod/.hermes',
    role: 'Hermes agents, skills, sessions, kanban, logs, memories, and runtime evidence.',
    writePolicy: 'Promote reviewed session facts into AzA with agent and session provenance.',
  },
] as const;

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const readJson = async (name: string): Promise<JsonRecord> => {
  const raw = await readFile(artifactPath(name), 'utf8').catch(() => '{}');
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

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const numberValue = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const checkRoot = async (root: (typeof SYSTEM_ROOTS)[number]) => {
  const stats = await stat(root.path).catch(() => null);

  return {
    exists: Boolean(stats),
    id: root.id,
    kind: stats?.isDirectory()
      ? 'directory'
      : stats?.isFile()
        ? 'file'
        : stats
          ? 'other'
          : 'missing',
    label: root.label,
    modifiedAt: stats?.mtime.toISOString() ?? null,
    path: root.path,
    role: root.role,
    writePolicy: root.writePolicy,
  };
};

export async function GET() {
  const [
    readiness,
    mcpTooling,
    operatingRecords,
    contentAppAudit,
    appInventory,
    contentRegistry,
    agentInventory,
    gtmModel,
    rootChecks,
  ] = await Promise.all([
    getAzaLiveReadiness(),
    getAzaLiveMcpToolingMap().catch(() => null),
    getAzaLiveOperatingRecordsMap(),
    getAzaLiveContentAppAuditMap().catch(() => null),
    readJson('app-surface-inventory.json'),
    readJson('content-generation-app-registry.json'),
    readJson('agent-memory-skill-inventory.json'),
    readJson('gtm-team-operating-model.json'),
    Promise.all(SYSTEM_ROOTS.map(checkRoot)),
  ]);
  const apps = recordArray(appInventory.apps);
  const currentObservedApps = recordArray(contentRegistry.currentObservedApps);
  const candidateApps = stringArray(contentRegistry.candidateAppsPendingVerification);
  const observedCounts = getRecord(agentInventory.observedCounts);
  const gtmRecordTypes = getRecord(gtmModel.recordTypes);
  const services = readiness.services ?? [];

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    mode: 'read_only_system_map',
    rootChecks,
    sourceArtifacts: [
      '/aza/app-surface-inventory.json',
      '/aza/agent-memory-skill-inventory.json',
      '/aza/content-generation-app-registry.json',
      '/aza/gtm-team-operating-model.json',
      '/aza/live-mcp-tooling-map',
      '/aza/live-operating-records',
      '/aza/live-readiness',
    ],
    summary: {
      agentFleetAgents: numberValue(observedCounts.hermesAgents),
      agentFleetSkillManifestFiles:
        numberValue(observedCounts.agentSkills) +
        numberValue(observedCounts.codexSkills) +
        numberValue(observedCounts.hermesSkills),
      boardLiveOperatingRecordCount: operatingRecords.summary.recordCount,
      boardLiveOperatingRecordProof: operatingRecords.summary.operatingRecordProof,
      boardLiveOperatingRecordTypesExpected: operatingRecords.summary.expectedRecordTypes,
      boardLiveOperatingRecordTypesFound: operatingRecords.summary.expectedRecordTypesFound,
      brainAccessProfiles: 4,
      brainNamespaces: 5,
      contentAppAuditMetadataSlots: contentAppAudit?.summary.metadataSlots ?? 0,
      contentAppAuditMissingAuthPointers: contentAppAudit?.summary.missingAuthPointers ?? 0,
      contentAppAuditMissingEvidencePointers: contentAppAudit?.summary.missingEvidencePointers ?? 0,
      contentAppAuditMissingMetadataSlots: contentAppAudit?.summary.missingMetadataSlots ?? 0,
      contentAppAuditMissingOutputPaths: contentAppAudit?.summary.missingOutputPaths ?? 0,
      contentAppAuditTargets: contentAppAudit?.summary.contentTargets ?? 0,
      contentCandidateApps: candidateApps.length,
      expectedAzAPortsMissing: services.filter(
        (service) => !service.listening || service.health !== 'ok',
      ).length,
      gtmBoards: recordArray(gtmModel.firstBoards).length,
      gtmLanes: recordArray(gtmModel.operatingLanes).length,
      gtmRecordTypes: Object.keys(gtmRecordTypes).length,
      installedAppCount: apps.length,
      liveAzAReadAvailable: readiness.summary.liveAzAReadAvailable,
      liveMcpAvailable: readiness.summary.liveMcpAvailable,
      liveOperatingRecordCount: operatingRecords.summary.recordCount,
      liveOperatingRecordProof: operatingRecords.summary.operatingRecordProof,
      liveOperatingRecordTypesExpected: operatingRecords.summary.expectedRecordTypes,
      liveOperatingRecordTypesFound: operatingRecords.summary.expectedRecordTypesFound,
      listeningPortCount: services.filter((service) => service.listening).length,
      mcpImplementedToolCallsTotal: mcpTooling?.summary.implementedToolCallsTotal ?? 0,
      mcpImplementedToolCallsVerified: mcpTooling?.summary.implementedToolCallsVerified ?? 0,
      mcpLiveImplementedToolCallOk: mcpTooling?.summary.liveImplementedToolCallOk ?? false,
      mcpLiveImplementedToolCoverageOk: mcpTooling?.summary.liveImplementedToolCoverageOk ?? false,
      mcpLiveInitialized: mcpTooling?.summary.liveMcpInitialized ?? false,
      mcpLivePlaceholderProbeOk: mcpTooling?.summary.livePlaceholderProbeOk ?? false,
      mcpLiveToolsListOk: mcpTooling?.summary.liveToolsListOk ?? false,
      mcpLiveToolsTotal: mcpTooling?.summary.liveToolsTotal ?? 0,
      operatingRecordProofOk: operatingRecords.summary.operatingRecordProof,
      operatingRecordTypesFound: operatingRecords.summary.expectedRecordTypesFound,
      operatingRecordTypesTotal: operatingRecords.summary.expectedRecordTypes,
      rootsPresent: rootChecks.filter((root) => root.exists).length,
      rootsTotal: rootChecks.length,
      staticArtifactsPresent: readiness.summary.artifactsPresent,
      vantaBrainCoverageRootPresent: rootChecks.some(
        (root) => root.id === 'vanta-brain' && root.exists,
      ),
      visibleAppCount: currentObservedApps.length,
      writesAllowed: false,
    },
  });
}
