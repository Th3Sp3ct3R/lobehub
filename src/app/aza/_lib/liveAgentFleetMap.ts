import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  type AzaLiveAgentAccessMatrixMap,
  getAzaLiveAgentAccessMatrixMap,
} from './liveAgentAccessMatrixMap';
import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './liveMemoryMap';

type FleetSourceKind =
  | 'agent_definition_root'
  | 'executor_memory_root'
  | 'executor_skill_root'
  | 'runtime_memory_root'
  | 'session_root'
  | 'skill_root';

type FleetSourceStatus = 'missing' | 'present';
type FleetRouteStatus = 'active_read_only' | 'blocked' | 'planned';
type FleetAgentCategory = 'archangel' | 'codex_pipeline' | 'domain_specialist' | 'ghost_fleet';

type AgentFleetSourceDefinition = {
  id: string;
  kind: FleetSourceKind;
  namespace: string;
  path: string;
  recordTypes: string[];
  role: string;
  writePolicy: string;
};

type FleetEntryDetail = {
  childDirectoryCount: number;
  childFileCount: number;
  kind: 'directory' | 'file' | 'other';
  manifestSignals: string[];
  modifiedAt: string | null;
  name: string;
  path: string;
};

export type AgentFleetSource = AgentFleetSourceDefinition & {
  directDirectories: number;
  directFiles: number;
  entryDetails: FleetEntryDetail[];
  manifestCounts: Record<string, number>;
  modifiedAt: string | null;
  representativeDirectories: string[];
  representativeFiles: string[];
  scanCapped: boolean;
  skillManifestFiles: number;
  status: FleetSourceStatus;
};

export type AgentFleetAgent = {
  category: FleetAgentCategory;
  defaultMemoryNamespace: string;
  evidence: string[];
  id: string;
  manifestSignals: string[];
  name: string;
  nextAction: string;
  path: string;
  recordTypes: string[];
  sessionScope: string;
  skillRoots: string[];
  sourceId: string;
  status: FleetRouteStatus;
};

export type AgentFleetNamespaceRoute = {
  accessProfiles: string[];
  evidence: string[];
  fromSourceIds: string[];
  id: string;
  label: string;
  namespace: string;
  nextAction: string;
  recordTypes: string[];
  status: FleetRouteStatus;
};

export type AzaLiveAgentFleetMap = {
  agents: AgentFleetAgent[];
  generatedAt: string;
  mode: 'read_only_live_agent_fleet_map';
  namespaceRoutes: AgentFleetNamespaceRoute[];
  recommendation: {
    agentRecordRule: string;
    brainModel: 'unified_aza_with_granular_agent_overlays';
    sessionRule: string;
    skillRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sources: AgentFleetSource[];
  summary: {
    agentDefinitionDirectories: number;
    archangelAgents: number;
    codexPipelineAgents: number;
    domainSpecialistAgents: number;
    ghostFleetAgents: number;
    hermesAgents: number;
    namespaceRoutes: number;
    skillManifestFiles: number;
    skillRootDirectories: number;
    sources: number;
    sourcesPresent: number;
    writesAllowed: false;
  };
};

const MAX_ENTRY_DETAILS = 180;
const MAX_MANIFEST_SCAN_DIRECTORIES = 2500;
const MANIFEST_NAMES = [
  'AGENTS.md',
  'CLAUDE.md',
  'DESCRIPTION.md',
  'REGISTRY.md',
  'ROUTING.md',
  'SKILL.md',
  'SOUL.md',
  'USER.md',
];

const ARCHANGELS = new Set([
  'azazel',
  'azrael',
  'cassiel',
  'gabriel',
  'jophiel',
  'metatron',
  'michael',
  'raphael',
  'raziel',
  's4m43l',
  'sandalphon',
  'solomon',
  'uriel',
  'zadkiel',
]);

const GHOST_FLEET = new Set([
  '4b4dd0n',
  '4shm3d41',
  'b33lz3b',
  'b3l14l',
  'h3l3l',
  'l1l1th',
  'l3v14th4n',
  'm0l0ch',
  'm3ph1st0',
  'm4mm0n',
  'm4st3m4',
  'p3n3mu3',
  'sh3dw',
  'sh3my4z4',
]);

const FLEET_SOURCES: AgentFleetSourceDefinition[] = [
  {
    id: 'hermes_agents',
    kind: 'agent_definition_root',
    namespace: 'agent_capability_overlays',
    path: '/Users/growthgod/.hermes/agents',
    recordTypes: ['agent', 'access_profile', 'memory_source'],
    role: 'Hermes runtime agent definitions and role manifests.',
    writePolicy: 'Runtime-native. Index metadata and promote reviewed facts into AzA.',
  },
  {
    id: 'hermes_skills',
    kind: 'skill_root',
    namespace: 'agent_capability_overlays',
    path: '/Users/growthgod/.hermes/skills',
    recordTypes: ['skill', 'capability'],
    role: 'Hermes reusable skills and domain capability packs.',
    writePolicy: 'Index skill metadata only; do not copy raw skill bodies without approval.',
  },
  {
    id: 'agent_skills',
    kind: 'skill_root',
    namespace: 'agent_capability_overlays',
    path: '/Users/growthgod/.agents/skills',
    recordTypes: ['skill', 'capability'],
    role: 'Large shared local and imported skill catalog.',
    writePolicy: 'Metadata-first. Skill edits require a specific target and validation plan.',
  },
  {
    id: 'codex_skills',
    kind: 'executor_skill_root',
    namespace: 'agent_capability_overlays',
    path: '/Users/growthgod/.codex/skills',
    recordTypes: ['skill', 'executor_capability'],
    role: 'Codex-local skills and system skills for the coding executor.',
    writePolicy: 'Runtime-native. Promote only verified capability metadata into AzA.',
  },
  {
    id: 'codex_memories',
    kind: 'executor_memory_root',
    namespace: 'session_and_working_memory',
    path: '/Users/growthgod/.codex/memories',
    recordTypes: ['memory_source', 'session_summary', 'evidence_receipt'],
    role: 'Codex memory summary, rollout summaries, and execution evidence.',
    writePolicy: 'Promote reviewed summaries and evidence pointers, not raw logs.',
  },
  {
    id: 'hermes_sessions',
    kind: 'session_root',
    namespace: 'session_and_working_memory',
    path: '/Users/growthgod/.hermes/sessions',
    recordTypes: ['session', 'session_summary', 'evidence_receipt'],
    role: 'Hermes runtime session archive.',
    writePolicy: 'Summarize and label sensitivity before AzA promotion.',
  },
  {
    id: 'hermes_memories',
    kind: 'runtime_memory_root',
    namespace: 'session_and_working_memory',
    path: '/Users/growthgod/.hermes/memories',
    recordTypes: ['memory_source', 'memory_summary'],
    role: 'Hermes memory files and backups.',
    writePolicy: 'Runtime-native. Canonical facts require review and evidence.',
  },
];

const emptyManifestCounts = () =>
  Object.fromEntries(MANIFEST_NAMES.map((name) => [name, 0])) as Record<string, number>;

const sampleNames = (names: string[]) =>
  names
    .filter((name) => !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 20);

const isEntryKind = (entry: { isDirectory: () => boolean; isFile: () => boolean }) => {
  if (entry.isDirectory()) return 'directory';
  if (entry.isFile()) return 'file';

  return 'other';
};

const entryManifestSignals = async (entryPath: string, isDirectory: boolean) => {
  if (!isDirectory) {
    const fileName = path.basename(entryPath);

    return MANIFEST_NAMES.includes(fileName) ? [fileName] : [];
  }

  const childEntries = await readdir(entryPath, { withFileTypes: true }).catch(() => []);
  const childNames = new Set(
    childEntries.filter((entry) => entry.isFile()).map((entry) => entry.name),
  );

  return MANIFEST_NAMES.filter((manifestName) => childNames.has(manifestName));
};

const scanEntryDetail = async (
  rootPath: string,
  entry: { isDirectory: () => boolean; isFile: () => boolean; name: string },
): Promise<FleetEntryDetail> => {
  const entryPath = path.join(rootPath, entry.name);
  const entryStats = await stat(entryPath).catch(() => null);
  const childEntries = entry.isDirectory()
    ? await readdir(entryPath, { withFileTypes: true }).catch(() => [])
    : [];

  return {
    childDirectoryCount: childEntries.filter((child) => child.isDirectory()).length,
    childFileCount: childEntries.filter((child) => child.isFile()).length,
    kind: isEntryKind(entry),
    manifestSignals: await entryManifestSignals(entryPath, entry.isDirectory()),
    modifiedAt: entryStats?.mtime.toISOString() ?? null,
    name: entry.name,
    path: entryPath,
  };
};

const scanSource = async (definition: AgentFleetSourceDefinition): Promise<AgentFleetSource> => {
  const manifestCounts = emptyManifestCounts();

  try {
    const rootStats = await stat(definition.path);
    const directEntries = await readdir(definition.path, { withFileTypes: true });
    const visibleEntries = directEntries.filter((entry) => !entry.name.startsWith('.'));
    const directDirectories = visibleEntries.filter((entry) => entry.isDirectory());
    const directFiles = visibleEntries.filter((entry) => entry.isFile());
    const detailEntries = visibleEntries
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, MAX_ENTRY_DETAILS);
    const entryDetails = await Promise.all(
      detailEntries.map((entry) => scanEntryDetail(definition.path, entry)),
    );
    const manifestScanEntries = directDirectories.slice(0, MAX_MANIFEST_SCAN_DIRECTORIES);
    const manifestSignals = await Promise.all(
      manifestScanEntries.map((entry) =>
        entryManifestSignals(path.join(definition.path, entry.name), true),
      ),
    );

    for (const file of directFiles) {
      if (MANIFEST_NAMES.includes(file.name)) manifestCounts[file.name] += 1;
    }

    for (const signals of manifestSignals) {
      for (const signal of signals) manifestCounts[signal] += 1;
    }

    return {
      ...definition,
      directDirectories: directDirectories.length,
      directFiles: directFiles.length,
      entryDetails,
      manifestCounts,
      modifiedAt: rootStats.mtime.toISOString(),
      representativeDirectories: sampleNames(directDirectories.map((entry) => entry.name)),
      representativeFiles: sampleNames(directFiles.map((entry) => entry.name)),
      scanCapped: directDirectories.length > manifestScanEntries.length,
      skillManifestFiles: manifestCounts['SKILL.md'] ?? 0,
      status: 'present',
    };
  } catch {
    return {
      ...definition,
      directDirectories: 0,
      directFiles: 0,
      entryDetails: [],
      manifestCounts,
      modifiedAt: null,
      representativeDirectories: [],
      representativeFiles: [],
      scanCapped: false,
      skillManifestFiles: 0,
      status: 'missing',
    };
  }
};

const agentCategory = (agentId: string): FleetAgentCategory => {
  if (agentId.startsWith('codex-')) return 'codex_pipeline';
  if (GHOST_FLEET.has(agentId)) return 'ghost_fleet';
  if (ARCHANGELS.has(agentId)) return 'archangel';

  return 'domain_specialist';
};

const agentNextAction = (category: FleetAgentCategory) => {
  if (category === 'codex_pipeline') {
    return 'Link Codex pipeline agents to content/video records, evidence receipts, and reviewed output artifacts.';
  }
  if (category === 'ghost_fleet') {
    return 'Keep growth, device, posting, and account actions approval-first with explicit evidence receipts.';
  }
  if (category === 'archangel') {
    return 'Index role, routing duty, allowed records, memory scope, and escalation rules into AzA agent records.';
  }

  return 'Attach owner, skill roots, session scope, allowed readers, and evidence rules before durable promotion.';
};

const buildAgents = (sources: AgentFleetSource[]): AgentFleetAgent[] => {
  const hermesAgents = sources.find((source) => source.id === 'hermes_agents');
  const skillRoots = sources
    .filter((source) => source.kind.includes('skill'))
    .filter((source) => source.status === 'present')
    .map((source) => source.path);

  if (!hermesAgents) return [];

  return hermesAgents.entryDetails
    .filter((entry) => entry.kind === 'directory')
    .map((entry) => {
      const category = agentCategory(entry.name);

      return {
        category,
        defaultMemoryNamespace: 'session_and_working_memory',
        evidence: ['/aza/live-agent-fleet-map', '/aza/live-agent-access-matrix'],
        id: entry.name,
        manifestSignals: entry.manifestSignals,
        name: entry.name,
        nextAction: agentNextAction(category),
        path: entry.path,
        recordTypes: ['agent', 'skill', 'session', 'memory_source', 'evidence'],
        sessionScope:
          'Agent may use its own Hermes session and memory overlays plus approved canonical AzA records.',
        skillRoots,
        sourceId: 'hermes_agents',
        status: hermesAgents.status === 'present' ? 'active_read_only' : 'blocked',
      };
    });
};

const buildNamespaceRoutes = ({
  accessMatrix,
  sources,
  topology,
}: {
  accessMatrix: AzaLiveAgentAccessMatrixMap;
  sources: AgentFleetSource[];
  topology: AzaLiveBrainTopologyMap;
}): AgentFleetNamespaceRoute[] => {
  const sourcePresent = (id: string) =>
    sources.find((source) => source.id === id)?.status === 'present';
  const agentProfile = accessMatrix.matrix.find((row) => row.id === 'agent_runtime');
  const codexProfile = accessMatrix.matrix.find((row) => row.id === 'codex_executor');
  const capabilityNamespace = topology.namespaces.find(
    (namespace) => namespace.id === 'agent_capability_overlays',
  );
  const sessionNamespace = topology.namespaces.find(
    (namespace) => namespace.id === 'session_and_working_memory',
  );

  return [
    {
      accessProfiles: ['agent_runtime', 'human_operator', 'codex_executor'],
      evidence: ['/aza/live-memory-map', '/aza/live-brain-topology'],
      fromSourceIds: ['hermes_agents'],
      id: 'agent_definitions_to_capability_overlays',
      label: 'Hermes agent definitions to capability overlays',
      namespace: capabilityNamespace?.id ?? 'agent_capability_overlays',
      nextAction:
        'Create metadata-only AzA agent records with role, source path, manifest signals, allowed readers, and session scope.',
      recordTypes: ['agent', 'access_profile'],
      status: sourcePresent('hermes_agents') ? 'active_read_only' : 'blocked',
    },
    {
      accessProfiles: ['agent_runtime', 'codex_executor', 'human_operator'],
      evidence: ['/aza/live-memory-map', '/aza/live-agent-access-matrix'],
      fromSourceIds: ['agent_skills', 'hermes_skills', 'codex_skills'],
      id: 'skill_roots_to_capability_overlays',
      label: 'Skill roots to capability overlays',
      namespace: capabilityNamespace?.id ?? 'agent_capability_overlays',
      nextAction:
        'Index skill metadata, path, manifest presence, version hints, and allowed agents; keep raw bodies native.',
      recordTypes: ['skill', 'capability'],
      status:
        sourcePresent('agent_skills') ||
        sourcePresent('hermes_skills') ||
        sourcePresent('codex_skills')
          ? 'active_read_only'
          : 'blocked',
    },
    {
      accessProfiles: [agentProfile?.id ?? 'agent_runtime', codexProfile?.id ?? 'codex_executor'],
      evidence: ['/aza/live-memory-map', '/aza/live-memory-intake-funnel'],
      fromSourceIds: ['hermes_sessions', 'hermes_memories', 'codex_memories'],
      id: 'sessions_to_working_memory_overlays',
      label: 'Sessions and memories to working-memory overlays',
      namespace: sessionNamespace?.id ?? 'session_and_working_memory',
      nextAction:
        'Summarize sessions and memories with agent id, session id, sensitivity, confidence, and evidence before canonical promotion.',
      recordTypes: ['session', 'session_summary', 'memory_source'],
      status:
        sourcePresent('hermes_sessions') || sourcePresent('codex_memories')
          ? 'active_read_only'
          : 'blocked',
    },
    {
      accessProfiles: ['codex_executor', 'human_operator'],
      evidence: ['/aza/live-codex-harness', '/aza/live-daily-command-workflow'],
      fromSourceIds: ['codex_skills', 'codex_memories'],
      id: 'codex_executor_to_command_context',
      label: 'Codex executor state to command context',
      namespace: 'command_context',
      nextAction:
        'Use Codex memory and skills as execution evidence while durable command records remain blocked.',
      recordTypes: ['codex_execution_run', 'evidence_receipt', 'decision'],
      status:
        sourcePresent('codex_skills') && sourcePresent('codex_memories')
          ? 'active_read_only'
          : 'blocked',
    },
  ];
};

export const getAzaLiveAgentFleetMap = async ({
  accessMatrix,
  memoryMap,
  topology,
}: {
  accessMatrix?: AzaLiveAgentAccessMatrixMap;
  memoryMap?: AzaLiveMemoryMap;
  topology?: AzaLiveBrainTopologyMap;
} = {}): Promise<AzaLiveAgentFleetMap> => {
  const [sources, liveMemoryMap] = await Promise.all([
    Promise.all(FLEET_SOURCES.map(scanSource)),
    memoryMap ?? getAzaLiveMemoryMap(),
  ]);
  const liveTopology = topology ?? (await getAzaLiveBrainTopologyMap({ memoryMap: liveMemoryMap }));
  const liveAccessMatrix =
    accessMatrix ??
    (await getAzaLiveAgentAccessMatrixMap({
      memoryMap: liveMemoryMap,
      topology: liveTopology,
    }));
  const agents = buildAgents(sources);
  const namespaceRoutes = buildNamespaceRoutes({
    accessMatrix: liveAccessMatrix,
    sources,
    topology: liveTopology,
  });
  const skillSources = sources.filter((source) => source.kind.includes('skill'));

  return {
    agents,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_agent_fleet_map',
    namespaceRoutes,
    recommendation: {
      agentRecordRule:
        'Represent each agent as metadata first: id, source path, category, manifest signals, allowed records, memory namespace, session scope, and approval requirements.',
      brainModel: 'unified_aza_with_granular_agent_overlays',
      sessionRule:
        'Keep raw sessions and raw memories in the owning runtime; promote only reviewed summaries with agent id, session id, sensitivity, allowed readers, and evidence.',
      skillRule:
        'Index skill metadata and manifest presence globally, but do not bulk-copy SKILL.md bodies into AzA without an explicit approved target.',
    },
    safety: {
      captured: [
        'source root paths',
        'source root directory and file counts',
        'manifest file presence counts',
        'direct entry names',
        'entry modified times',
        'agent ids',
        'agent categories',
        'namespace route labels',
        'record type names',
        'approval and write-policy labels',
      ],
      excluded: [
        'raw agent manifest contents',
        'raw SKILL.md bodies',
        'raw session transcripts',
        'raw memory contents',
        'database contents',
        'browser tabs',
        'private messages',
        'secrets',
        'tokens',
        'cookies',
        'credentials',
      ],
      writesAllowed: false,
    },
    sources,
    summary: {
      agentDefinitionDirectories:
        sources.find((source) => source.id === 'hermes_agents')?.directDirectories ?? 0,
      archangelAgents: agents.filter((agent) => agent.category === 'archangel').length,
      codexPipelineAgents: agents.filter((agent) => agent.category === 'codex_pipeline').length,
      domainSpecialistAgents: agents.filter((agent) => agent.category === 'domain_specialist')
        .length,
      ghostFleetAgents: agents.filter((agent) => agent.category === 'ghost_fleet').length,
      hermesAgents: agents.length,
      namespaceRoutes: namespaceRoutes.length,
      skillManifestFiles: skillSources.reduce(
        (total, source) => total + source.skillManifestFiles,
        0,
      ),
      skillRootDirectories: skillSources.reduce(
        (total, source) => total + source.directDirectories,
        0,
      ),
      sources: sources.length,
      sourcesPresent: sources.filter((source) => source.status === 'present').length,
      writesAllowed: false,
    },
  };
};
