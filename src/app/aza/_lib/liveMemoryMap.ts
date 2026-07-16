import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import { scanDirectoryBounded } from './boundedDirectoryScan';

type RootKind =
  | 'agent-definitions'
  | 'codex-memory'
  | 'hermes-memory'
  | 'projection-vault'
  | 'sessions'
  | 'skills';

type RootStatus = 'missing' | 'present';

type MemoryRootDefinition = {
  azARecordType: 'agent' | 'memory_source' | 'projection' | 'session' | 'skill';
  id: string;
  indexPolicy: string;
  kind: RootKind;
  path: string;
  role: string;
};

export type LiveMemoryRoot = MemoryRootDefinition & {
  counts: {
    directDirectories: number;
    directFiles: number;
    directoriesModifiedLast7Days: number;
    filesModifiedLast7Days: number;
    memoryFiles: number;
    sessionFiles: number;
    skillMarkdownFiles: number;
    totalDirectories: number;
    totalFiles: number;
  };
  lastModifiedAt: string | null;
  representativeDirectories: string[];
  representativeFiles: string[];
  scanIssue: string | null;
  scanState: 'blocked' | 'capped' | 'completed' | 'missing';
  scanCapped: boolean;
  status: RootStatus;
};

export type AzaLiveMemoryMap = {
  generatedAt: string;
  mode: 'read_only_live_memory_map';
  promotionModel: {
    canonicalBrain: string;
    decision: string;
    granularOverlays: string;
    projectionVault: string;
  };
  roots: LiveMemoryRoot[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    agentRootsPresent: number;
    codexMemoryFiles: number;
    hermesSessionFiles: number;
    projectionVaultFiles: number;
    rootsPresent: number;
    rootsTotal: number;
    skillMarkdownFiles: number;
    totalDirectories: number;
    totalFiles: number;
    writesAllowed: false;
  };
};

type ScanCounts = LiveMemoryRoot['counts'];

const MEMORY_ROOTS: MemoryRootDefinition[] = [
  {
    azARecordType: 'skill',
    id: 'agent-skills',
    indexPolicy:
      'Index metadata, capability, owner, source path, version, and allowed agents. Do not inline full skill bodies without approval.',
    kind: 'skills',
    path: '/Users/growthgod/.agents/skills',
    role: 'Large external and local skill catalog for specialized agent capabilities.',
  },
  {
    azARecordType: 'skill',
    id: 'codex-skills',
    indexPolicy:
      'Index entrypoints, invocation metadata, and source roots for the Codex coding executor lane.',
    kind: 'skills',
    path: '/Users/growthgod/.codex/skills',
    role: 'Codex-local skill catalog and system skills.',
  },
  {
    azARecordType: 'memory_source',
    id: 'codex-memories',
    indexPolicy:
      'Index summaries, rollout identifiers, current-goal relevance, and evidence pointers. Treat as coding-agent memory, not the whole brain.',
    kind: 'codex-memory',
    path: '/Users/growthgod/.codex/memories',
    role: 'Codex memory summary, rollout summaries, skill memory, and ad-hoc memory extensions.',
  },
  {
    azARecordType: 'agent',
    id: 'hermes-agents',
    indexPolicy:
      'Index agent identity, role, allowed tools, memory scope, task lane, and source path.',
    kind: 'agent-definitions',
    path: '/Users/growthgod/.hermes/agents',
    role: 'Hermes agent fleet runtime definitions.',
  },
  {
    azARecordType: 'skill',
    id: 'hermes-skills',
    indexPolicy:
      'Index skill metadata and domain lane; keep execution files in Hermes until promoted.',
    kind: 'skills',
    path: '/Users/growthgod/.hermes/skills',
    role: 'Hermes reusable skills and domain-specific procedures.',
  },
  {
    azARecordType: 'session',
    id: 'hermes-sessions',
    indexPolicy:
      'Index session metadata, summaries, decisions, artifacts, and promoted facts. Avoid dumping raw sessions into global memory.',
    kind: 'sessions',
    path: '/Users/growthgod/.hermes/sessions',
    role: 'Hermes session archive and runtime evidence.',
  },
  {
    azARecordType: 'memory_source',
    id: 'hermes-memories',
    indexPolicy:
      'Index memory file metadata and conflict state first; promote verified durable facts into AzA records.',
    kind: 'hermes-memory',
    path: '/Users/growthgod/.hermes/memories',
    role: 'Hermes memory files and backups.',
  },
  {
    azARecordType: 'projection',
    id: 'vanta-brain',
    indexPolicy:
      'Read-only projection inventory. Treat as reviewed markdown output, not canonical raw runtime memory.',
    kind: 'projection-vault',
    path: '/Users/growthgod/Documents/VANTA-Brain',
    role: 'Human-readable VANTA-Brain projection vault.',
  },
];

const ZERO_COUNTS: ScanCounts = {
  directDirectories: 0,
  directFiles: 0,
  directoriesModifiedLast7Days: 0,
  filesModifiedLast7Days: 0,
  memoryFiles: 0,
  sessionFiles: 0,
  skillMarkdownFiles: 0,
  totalDirectories: 0,
  totalFiles: 0,
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_CHILD_DIRECTORIES_TO_SCAN = 2500;

const cloneCounts = (): ScanCounts => ({ ...ZERO_COUNTS });

const isSessionFile = (name: string) => /\.(?:json|jsonl|md|txt)$/i.test(name);

const isMemoryFile = (name: string) => /\.(?:json|jsonl|md|txt|yaml|yml)$/i.test(name);

const sampleNames = (names: string[]) =>
  names
    .filter((name) => !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 16);

const scanRoot = async (definition: MemoryRootDefinition): Promise<LiveMemoryRoot> => {
  const counts = cloneCounts();
  const representativeDirectories: string[] = [];
  const representativeFiles: string[] = [];
  const modifiedSince = Date.now() - SEVEN_DAYS_MS;
  let scanCapped = false;

  try {
    const rootStats = await stat(definition.path);
    let lastModifiedAt = rootStats.mtime.toISOString();

    if (definition.id === 'vanta-brain') {
      const scan = await scanDirectoryBounded({
        maxEntries: 220,
        root: definition.path,
        timeoutMs: 1500,
      });

      if (scan.timedOut || scan.error) {
        return {
          ...definition,
          counts,
          lastModifiedAt,
          representativeDirectories,
          representativeFiles,
          scanCapped: true,
          scanIssue: scan.error,
          scanState: 'blocked',
          status: 'present',
        };
      }

      counts.directDirectories = scan.entries.filter((entry) => entry.kind === 'directory').length;
      counts.directFiles = scan.entries.filter((entry) => entry.kind === 'file').length;
      counts.totalDirectories = counts.directDirectories;
      counts.totalFiles = counts.directFiles;
      scanCapped = scan.entries.length >= 220;

      for (const entry of scan.entries) {
        if (entry.modifiedAt && entry.modifiedAt > lastModifiedAt) {
          lastModifiedAt = entry.modifiedAt;
        }

        if (entry.modifiedAt && new Date(entry.modifiedAt).getTime() >= modifiedSince) {
          if (entry.kind === 'directory') counts.directoriesModifiedLast7Days += 1;
          if (entry.kind === 'file') counts.filesModifiedLast7Days += 1;
        }
      }

      representativeDirectories.push(
        ...sampleNames(
          scan.entries.filter((entry) => entry.kind === 'directory').map((entry) => entry.name),
        ),
      );
      representativeFiles.push(
        ...sampleNames(
          scan.entries.filter((entry) => entry.kind === 'file').map((entry) => entry.name),
        ),
      );

      return {
        ...definition,
        counts,
        lastModifiedAt,
        representativeDirectories,
        representativeFiles,
        scanCapped,
        scanIssue: null,
        scanState: scanCapped ? 'capped' : 'completed',
        status: 'present',
      };
    }

    const directEntries = await readdir(definition.path, { withFileTypes: true });
    counts.directDirectories = directEntries.filter((entry) => entry.isDirectory()).length;
    counts.directFiles = directEntries.filter((entry) => entry.isFile()).length;
    await Promise.all(
      directEntries.map(async (entry) => {
        const entryStats = await stat(path.join(definition.path, entry.name)).catch(() => null);
        if (!entryStats) return;

        if (entryStats.mtime.toISOString() > lastModifiedAt) {
          lastModifiedAt = entryStats.mtime.toISOString();
        }

        if (entryStats.mtime.getTime() >= modifiedSince) {
          if (entry.isDirectory()) counts.directoriesModifiedLast7Days += 1;
          if (entry.isFile()) counts.filesModifiedLast7Days += 1;
        }
      }),
    );
    representativeDirectories.push(
      ...sampleNames(
        directEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name),
      ),
    );
    representativeFiles.push(
      ...sampleNames(directEntries.filter((entry) => entry.isFile()).map((entry) => entry.name)),
    );
    counts.totalDirectories = counts.directDirectories;
    counts.totalFiles = counts.directFiles;

    for (const entry of directEntries) {
      if (!entry.isFile()) continue;

      if (entry.name === 'SKILL.md') counts.skillMarkdownFiles += 1;
      if (definition.kind === 'sessions' && isSessionFile(entry.name)) counts.sessionFiles += 1;
      if (
        (definition.kind === 'codex-memory' || definition.kind === 'hermes-memory') &&
        isMemoryFile(entry.name)
      ) {
        counts.memoryFiles += 1;
      }
    }

    const childDirectories = directEntries
      .filter((entry) => entry.isDirectory())
      .filter((entry) => entry.name !== 'node_modules' && entry.name !== '.git');
    const childDirectoriesToScan = childDirectories.slice(0, MAX_CHILD_DIRECTORIES_TO_SCAN);
    scanCapped = childDirectories.length > childDirectoriesToScan.length;

    await Promise.all(
      childDirectoriesToScan.map(async (directory) => {
        const childEntries = await readdir(path.join(definition.path, directory.name), {
          withFileTypes: true,
        }).catch(() => []);

        for (const entry of childEntries) {
          if (entry.name === 'node_modules' || entry.name === '.git') continue;

          if (entry.isDirectory()) {
            counts.totalDirectories += 1;
            continue;
          }

          if (!entry.isFile()) continue;

          counts.totalFiles += 1;
          if (entry.name === 'SKILL.md') counts.skillMarkdownFiles += 1;
          if (definition.kind === 'sessions' && isSessionFile(entry.name)) counts.sessionFiles += 1;
          if (
            (definition.kind === 'codex-memory' || definition.kind === 'hermes-memory') &&
            isMemoryFile(entry.name)
          ) {
            counts.memoryFiles += 1;
          }
        }
      }),
    );

    return {
      ...definition,
      counts,
      lastModifiedAt,
      representativeDirectories,
      representativeFiles,
      scanCapped,
      scanIssue: null,
      scanState: scanCapped ? 'capped' : 'completed',
      status: 'present',
    };
  } catch {
    return {
      ...definition,
      counts,
      lastModifiedAt: null,
      representativeDirectories,
      representativeFiles,
      scanCapped,
      scanIssue: 'root path is not accessible',
      scanState: 'missing',
      status: 'missing',
    };
  }
};

export const getAzaLiveMemoryMap = async (): Promise<AzaLiveMemoryMap> => {
  const roots = await Promise.all(MEMORY_ROOTS.map(scanRoot));

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_memory_map',
    promotionModel: {
      canonicalBrain:
        'AzA should hold durable typed records, provenance, access labels, search indexes, MCP retrieval, and projection history.',
      decision: 'Use one canonical AzA brain with granular agent overlays.',
      granularOverlays:
        'Codex, Hermes, and specialized agents keep local skills, raw sessions, prompts, tools, and working memory.',
      projectionVault:
        'VANTA-Brain remains a reviewed markdown projection vault and is read-only during this pass.',
    },
    roots,
    safety: {
      captured: [
        'root paths',
        'directory counts',
        'file counts',
        'one-level child directory counts',
        'SKILL.md counts',
        'session file counts',
        'memory file counts',
        'root and direct-child modified-time windows',
        'representative names',
        'scan timeout status',
      ],
      excluded: [
        'raw skill bodies',
        'raw memory contents',
        'raw session transcripts',
        'secrets',
        'tokens',
        'cookies',
        'private messages',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      agentRootsPresent: roots.filter((root) => root.status === 'present').length,
      codexMemoryFiles: roots.find((root) => root.id === 'codex-memories')?.counts.memoryFiles ?? 0,
      hermesSessionFiles:
        roots.find((root) => root.id === 'hermes-sessions')?.counts.sessionFiles ?? 0,
      projectionVaultFiles: roots.find((root) => root.id === 'vanta-brain')?.counts.totalFiles ?? 0,
      rootsPresent: roots.filter((root) => root.status === 'present').length,
      rootsTotal: roots.length,
      skillMarkdownFiles: roots.reduce((total, root) => total + root.counts.skillMarkdownFiles, 0),
      totalDirectories: roots.reduce((total, root) => total + root.counts.totalDirectories, 0),
      totalFiles: roots.reduce((total, root) => total + root.counts.totalFiles, 0),
      writesAllowed: false,
    },
  };
};
