import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { AzaLiveAppMap } from './liveAppMap';
import type { AzaLiveGtmMap } from './liveGtmMap';
import type { AzaLiveMemoryMap } from './liveMemoryMap';
import type { AzaLiveOperatingBoard } from './liveOperatingBoard';
import type { AzaLiveProjectMap } from './liveProjectMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import type { AzaLiveServiceMap } from './liveServiceMap';

type JsonRecord = Record<string, unknown>;

type GateStatus = 'approval_required' | 'blocked' | 'passed';

export type CommandGate = {
  evidence: string[];
  id: string;
  label: string;
  nextAction: string;
  owner: string;
  reason: string;
  requiredBefore: string[];
  status: GateStatus;
};

export type CommandAdapter = {
  artifact: string;
  mode: string;
  scope: string;
};

export type CommandWriteBoundary = {
  reason: string;
  status: string;
  target: string;
};

export type AzaLiveCommandGateMap = {
  blockedWrites: CommandWriteBoundary[];
  generatedAt: string;
  gates: CommandGate[];
  mode: 'read_only_live_command_gate_map';
  readAdapters: CommandAdapter[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    approvalRequiredGates: number;
    blockedGates: number;
    canonicalWritesAllowed: false;
    passedGates: number;
    readAdapters: number;
    totalGates: number;
    writesAllowed: false;
  };
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

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const numberValue = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const buildContractAdapters = (contract: JsonRecord): CommandAdapter[] =>
  recordArray(contract.readAdapters).map((adapter) => ({
    artifact: text(adapter.artifact, 'unknown'),
    mode: text(adapter.mode, 'unknown'),
    scope: text(adapter.scope, 'No scope documented'),
  }));

const buildBlockedWrites = (contract: JsonRecord): CommandWriteBoundary[] =>
  recordArray(contract.blockedWrites).map((write) => ({
    reason: text(write.reason, 'No reason documented'),
    status: text(write.status, 'unknown'),
    target: text(write.target, 'unknown'),
  }));

const gate = (gateInput: CommandGate): CommandGate => gateInput;

export const getAzaLiveCommandGateMap = async ({
  appMap,
  board,
  gtmMap,
  memoryMap,
  projectMap,
  readiness,
  serviceMap,
}: {
  appMap?: AzaLiveAppMap;
  board?: AzaLiveOperatingBoard;
  gtmMap?: AzaLiveGtmMap;
  memoryMap?: AzaLiveMemoryMap;
  projectMap?: AzaLiveProjectMap;
  readiness?: AzaLiveReadiness;
  serviceMap?: AzaLiveServiceMap;
} = {}): Promise<AzaLiveCommandGateMap> => {
  const [contract, liveReadiness, memoryInventory, appInventory, projectInventory, gtmModel] =
    await Promise.all([
      readJson('aza-read-write-contract.json'),
      readiness ?? getAzaLiveReadiness(),
      readJson('agent-memory-skill-inventory.json'),
      readJson('app-surface-inventory.json'),
      readJson('van-project-root-inventory.json'),
      readJson('gtm-team-operating-model.json'),
    ]);
  const services = liveReadiness.services ?? [];
  const memoryRoots = recordArray(memoryInventory.roots);
  const apps = recordArray(appInventory.apps);
  const projectCounts = getRecord(projectInventory.counts);
  const gtmRecordTypes = getRecord(gtmModel.recordTypes);
  const gtmLanes = recordArray(gtmModel.operatingLanes);
  const boardCards = board?.summary.totalCards ?? 0;
  const blockedBoardCards = board?.summary.blockedCards ?? boardCards;
  const missingAzAServices =
    serviceMap?.summary.azaPortsMissing ??
    services.filter((service) => !service.listening || service.health !== 'ok').length;
  const expectedListening =
    serviceMap?.summary.expectedListening ?? services.filter((service) => service.listening).length;
  const gitRepositories =
    projectMap?.summary.gitRepositories ?? numberValue(projectCounts.gitRepositories);
  const projectRootsPresentCount =
    projectMap?.summary.rootsPresent ?? numberValue(projectCounts.topLevelDirectories);
  const projectRootsTotal =
    projectMap?.summary.rootsTotal ?? numberValue(projectCounts.topLevelDirectories);
  const memoryRootsPresentCount = memoryMap?.summary.rootsPresent ?? memoryRoots.length;
  const memoryRootsTotal = memoryMap?.summary.rootsTotal ?? memoryRoots.length;
  const skillMarkdownFiles =
    memoryMap?.summary.skillMarkdownFiles ??
    memoryRoots.reduce((total, root) => total + numberValue(root.skillMarkdownFiles), 0);
  const installedAppCount = appMap?.summary.installedAppCount ?? apps.length;
  const allAzAServicesListening =
    serviceMap?.summary.azaPortsMissing === 0 ||
    (services.length > 0 &&
      services.every((service) => service.listening && service.health === 'ok'));
  const expectedServicesKnown =
    (serviceMap?.summary.expectedListening ?? 0) > 0 ||
    services.some((service) => service.listening);
  const projectRootsPresent =
    projectMap?.summary.rootsPresent === projectMap?.summary.rootsTotal ||
    numberValue(projectCounts.gitRepositories) > 0;
  const memoryRootsPresent =
    memoryMap?.summary.rootsPresent === memoryMap?.summary.rootsTotal || memoryRoots.length > 0;
  const appInventoryPresent = (appMap?.summary.installedAppCount ?? apps.length) > 0;
  const gtmModelPresent =
    (gtmMap?.summary.recordTypes ?? Object.keys(gtmRecordTypes).length) > 0 &&
    (gtmMap?.summary.lanes ?? gtmLanes.length) > 0;

  const gates = [
    gate({
      evidence: ['/aza/live-readiness'],
      id: 'artifact_catalog_ready',
      label: 'Command-center artifact catalog',
      nextAction: 'Keep artifact presence checks green as more live adapters are added.',
      owner: 'Codex',
      reason: liveReadiness.summary.artifactsPresent
        ? 'All expected command-center artifacts are present.'
        : 'One or more expected command-center artifacts are missing.',
      requiredBefore: ['operator_review', 'routing_decision'],
      status: liveReadiness.summary.artifactsPresent ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-service-map', '/aza/live-readiness'],
      id: 'aza_services_live',
      label: 'AzA API, MCP, gateway, sync, and worker health',
      nextAction:
        'Start and verify AzA services only after approval to work inside VAN/aza_memory.',
      owner: 'Engineering lead',
      reason: allAzAServicesListening
        ? 'All planned AzA service ports are listening.'
        : `${missingAzAServices} planned AzA service ports are missing.`,
      requiredBefore: ['canonical_memory_write', 'mcp_query_route', 'durable_board_records'],
      status: allAzAServicesListening ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-service-map'],
      id: 'known_service_ownership',
      label: 'Known local service ownership',
      nextAction:
        'Classify unknown listeners and attach service owner, cwd, health route, and expected role.',
      owner: 'Engineering lead',
      reason: expectedServicesKnown
        ? `${expectedListening} expected services are currently listening.`
        : 'No expected services are currently listening.',
      requiredBefore: ['safe_service_routing'],
      status: expectedServicesKnown ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-project-map'],
      id: 'project_roots_inventory',
      label: 'Project roots and safe markers',
      nextAction:
        'Use project marker metadata to decide where live adapters and future AzA records should point.',
      owner: 'Engineering lead',
      reason: `${projectRootsPresentCount}/${projectRootsTotal} project roots are present with ${gitRepositories} git repos detected.`,
      requiredBefore: ['project_routing', 'filesystem_write_plan'],
      status: projectRootsPresent ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-memory-map'],
      id: 'memory_roots_inventory',
      label: 'Agent, session, skill, memory, and projection roots',
      nextAction:
        'Promote only reviewed metadata and facts into AzA once canonical writes are enabled.',
      owner: 'Knowledge lead',
      reason: `${memoryRootsPresentCount}/${memoryRootsTotal} memory roots are present with ${skillMarkdownFiles} skill manifests detected.`,
      requiredBefore: ['agent_memory_routing', 'memory_promotion'],
      status: memoryRootsPresent ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-app-map'],
      id: 'app_surfaces_inventory',
      label: 'Content app and desktop surface inventory',
      nextAction:
        'Classify output folders, account labels, and approval modes before any publishing automation.',
      owner: 'Content lead',
      reason: appInventoryPresent
        ? `${installedAppCount} installed app surfaces are visible to the inventory.`
        : 'No installed app surfaces were found.',
      requiredBefore: ['content_generation_routing', 'browser_or_device_action'],
      status: appInventoryPresent ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-gtm-map'],
      id: 'gtm_schema_modeled',
      label: 'GTM and team operating schema',
      nextAction:
        'Create durable offer, lead, pilot, task, evidence, and daily command records after AzA write gates pass.',
      owner: 'Growth lead',
      reason: gtmModelPresent
        ? `${gtmMap?.summary.recordTypes ?? Object.keys(gtmRecordTypes).length} GTM record types and ${gtmMap?.summary.lanes ?? gtmLanes.length} lanes are modeled.`
        : 'GTM lanes or record types are missing.',
      requiredBefore: ['gtm_board_records', 'daily_command_records'],
      status: gtmModelPresent ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-operating-board', '/aza/live-gtm-map'],
      id: 'durable_operating_board',
      label: 'Durable operating board records',
      nextAction:
        'Keep using the derived board until AzA records can back Daily Command and Memory Intake.',
      owner: 'Product lead',
      reason: `${blockedBoardCards}/${boardCards} derived board cards are blocked; no durable AzA board records are verified.`,
      requiredBefore: ['daily_command_records', 'gtm_pipeline_records'],
      status: 'blocked',
    }),
    gate({
      evidence: [
        '/aza/live-readiness',
        '/aza/live-aza-durable-store-readiness',
        '/aza/aza-read-write-contract.json',
      ],
      id: 'canonical_aza_writes',
      label: 'Canonical AzA writes',
      nextAction:
        'Verify API, MCP, durable store, schema validation, redaction, rollback, and approval gates.',
      owner: 'Knowledge lead',
      reason: liveReadiness.summary.canonicalWritesAllowed
        ? 'Canonical writes are reported available.'
        : 'Canonical writes are disabled by the read/write contract and live readiness.',
      requiredBefore: ['memory_record_write', 'project_record_write', 'gtm_record_write'],
      status: liveReadiness.summary.canonicalWritesAllowed ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/aza-read-write-contract.json'],
      id: 'vanta_brain_projection',
      label: 'VANTA-Brain projection',
      nextAction:
        'Project only after canonical AzA records exist, redaction passes, and the destination is explicitly approved.',
      owner: 'Knowledge lead',
      reason: liveReadiness.summary.projectionToVantaBrainAllowed
        ? 'Projection is reported available.'
        : 'VANTA-Brain projection is disabled for this pass.',
      requiredBefore: ['projection_write'],
      status: liveReadiness.summary.projectionToVantaBrainAllowed ? 'passed' : 'blocked',
    }),
    gate({
      evidence: ['/aza/live-project-map', '/aza/aza-read-write-contract.json'],
      id: 'van_filesystem_writes',
      label: 'VAN filesystem writes',
      nextAction:
        'Require explicit target path, reason, rollback plan, and validation command before any VAN write.',
      owner: 'Human operator',
      reason: 'VAN is the active runtime workspace and remains approval-required.',
      requiredBefore: ['filesystem_write'],
      status: 'approval_required',
    }),
    gate({
      evidence: ['/aza/live-app-map', '/aza/aza-read-write-contract.json'],
      id: 'browser_device_actions',
      label: 'Browser, app, device, posting, and messaging actions',
      nextAction:
        'Require target account label, action class, approval, and evidence path before any account-changing action.',
      owner: 'Human operator',
      reason:
        'Browser, app, device, publishing, posting, messaging, buying, and account actions are approval-required.',
      requiredBefore: ['publish_event', 'device_action', 'outbound_message'],
      status: 'approval_required',
    }),
  ];

  return {
    blockedWrites: buildBlockedWrites(contract),
    generatedAt: new Date().toISOString(),
    gates,
    mode: 'read_only_live_command_gate_map',
    readAdapters: buildContractAdapters(contract),
    safety: {
      captured: [
        'adapter names',
        'gate status',
        'gate reasons',
        'required-before labels',
        'read/write boundary labels',
        'live summary counts',
      ],
      excluded: [
        'raw secrets',
        'tokens',
        'cookies',
        'passwords',
        'private messages',
        'customer credentials',
        'browser tab contents',
        'file contents',
      ],
      writesAllowed: false,
    },
    summary: {
      approvalRequiredGates: gates.filter((item) => item.status === 'approval_required').length,
      blockedGates: gates.filter((item) => item.status === 'blocked').length,
      canonicalWritesAllowed: false,
      passedGates: gates.filter((item) => item.status === 'passed').length,
      readAdapters: buildContractAdapters(contract).length,
      totalGates: gates.length,
      writesAllowed: false,
    },
  };
};
