import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

type ProjectCategory =
  | 'agent-runtime'
  | 'command-harness'
  | 'content-media'
  | 'device-ops'
  | 'docs-archive'
  | 'legacy-runtime'
  | 'memory-brain'
  | 'product-repo'
  | 'root-config-or-cache'
  | 'ui-app'
  | 'workspace-or-uncategorized';

type ProjectRootDefinition = {
  id: string;
  path: string;
  role: string;
};

export type ProjectMarker = {
  exists: boolean;
  name: string;
};

export type LiveProjectEntry = {
  category: ProjectCategory;
  hasAgentInstructions: boolean;
  hasClaudeInstructions: boolean;
  hasGit: boolean;
  hasPackageJson: boolean;
  hasPnpmWorkspace: boolean;
  markers: ProjectMarker[];
  modifiedAt: string | null;
  name: string;
  path: string;
};

export type LiveProjectRoot = ProjectRootDefinition & {
  entries: LiveProjectEntry[];
  exists: boolean;
  modifiedAt: string | null;
  role: string;
  summary: {
    agentInstructionFiles: number;
    claudeInstructionFiles: number;
    gitRepositories: number;
    packageJsonProjects: number;
    pnpmWorkspaces: number;
    topLevelDirectories: number;
  };
};

export type AzaLiveProjectMap = {
  categoryCounts: Record<ProjectCategory, number>;
  generatedAt: string;
  mode: 'read_only_live_project_map';
  roots: LiveProjectRoot[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    agentInstructionFiles: number;
    claudeInstructionFiles: number;
    gitRepositories: number;
    packageJsonProjects: number;
    pnpmWorkspaces: number;
    rootsPresent: number;
    rootsTotal: number;
    topLevelDirectories: number;
    writesAllowed: false;
  };
};

const PROJECT_ROOTS: ProjectRootDefinition[] = [
  {
    id: 'van',
    path: '/Users/growthgod/VAN',
    role: 'Active project and runtime workspace for AzA, product repos, agents, devices, content tools, and experiments.',
  },
  {
    id: 'lobehub',
    path: '/Users/growthgod/lobehub',
    role: 'AzA command harness and final operator surface.',
  },
  {
    id: 'desktop-van',
    path: '/Users/growthgod/Desktop/VAN',
    role: 'Legacy or alternate VANTA runtime root that still appears in live process ownership.',
  },
];

const MARKERS = [
  '.git',
  'AGENTS.md',
  'CLAUDE.md',
  'Dockerfile',
  'Makefile',
  'README.md',
  'docker-compose.yml',
  'next.config.js',
  'next.config.mjs',
  'next.config.ts',
  'package.json',
  'pnpm-workspace.yaml',
  'pyproject.toml',
] as const;

const CATEGORY_LOOKUP: Record<ProjectCategory, string[]> = {
  'root-config-or-cache': ['.claude', '.git', '.gstack', '.playwright-mcp', '.tmp'],
  'memory-brain': ['AzaZal', 'aZa', 'aza_memory', 'aza_tgbot', 'memory'],
  'product-repo': [
    'Engine',
    'Oracle',
    'etymology-engine',
    'growthgod-landing',
    'instagram-id-scraper',
    'instagram-php-main',
    'instagram-service',
    'instagrowth-legacy',
    'instagrowth-saas',
    'osint-wiki-frontend 3',
    'suno-engine',
  ],
  'agent-runtime': [
    'Osint-Agent',
    'SeekerClaw',
    'VantaLABs_gg-agent-logging',
    'agents',
    'hermes-agent',
    'hermes-core',
    'hermes-voice-agent',
    'hermesUI',
    'openclaw',
    'openclaw-v2',
    'psi-claw',
    'upwork-agent',
    'vanta-agent-kit',
  ],
  'device-ops': ['duoplus', 'mattclone-duo'],
  'ui-app': ['business builders', 'vanta-command-center'],
  'content-media': ['brand-lookbook', 'content-pipeline', 'paperclip-hub', 'pocket-studio'],
  'docs-archive': ['daily-reports', 'docs', 'documents', 'reports'],
  'workspace-or-uncategorized': [],
  'command-harness': ['lobehub'],
  'legacy-runtime': ['Desktop/VAN'],
};

const categoryByName = (name: string, rootId: string): ProjectCategory => {
  if (rootId === 'lobehub') return 'command-harness';
  if (rootId === 'desktop-van') return 'legacy-runtime';

  for (const [category, names] of Object.entries(CATEGORY_LOOKUP) as Array<
    [ProjectCategory, string[]]
  >) {
    if (names.includes(name)) return category;
  }

  return 'workspace-or-uncategorized';
};

const markerStatus = async (entryPath: string): Promise<ProjectMarker[]> => {
  const entries = await readdir(entryPath, { withFileTypes: true }).catch(() => []);
  const names = new Set(entries.map((entry) => entry.name));

  return MARKERS.map((name) => ({
    exists: names.has(name),
    name,
  }));
};

const scanRoot = async (root: ProjectRootDefinition): Promise<LiveProjectRoot> => {
  const rootStats = await stat(root.path).catch(() => null);

  if (!rootStats) {
    return {
      ...root,
      entries: [],
      exists: false,
      modifiedAt: null,
      summary: {
        agentInstructionFiles: 0,
        claudeInstructionFiles: 0,
        gitRepositories: 0,
        packageJsonProjects: 0,
        pnpmWorkspaces: 0,
        topLevelDirectories: 0,
      },
    };
  }

  const directEntries = await readdir(root.path, { withFileTypes: true }).catch(() => []);
  const directories = directEntries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith('.DS_Store'))
    .sort((a, b) => a.name.localeCompare(b.name));
  const entries = await Promise.all(
    directories.map(async (entry): Promise<LiveProjectEntry> => {
      const entryPath = path.join(root.path, entry.name);
      const [stats, markers] = await Promise.all([
        stat(entryPath).catch(() => null),
        markerStatus(entryPath),
      ]);

      const hasMarker = (name: string) =>
        markers.some((marker) => marker.name === name && marker.exists);

      return {
        category: categoryByName(entry.name, root.id),
        hasAgentInstructions: hasMarker('AGENTS.md'),
        hasClaudeInstructions: hasMarker('CLAUDE.md'),
        hasGit: hasMarker('.git'),
        hasPackageJson: hasMarker('package.json'),
        hasPnpmWorkspace: hasMarker('pnpm-workspace.yaml'),
        markers,
        modifiedAt: stats?.mtime.toISOString() ?? null,
        name: entry.name,
        path: entryPath,
      };
    }),
  );

  return {
    ...root,
    entries,
    exists: true,
    modifiedAt: rootStats.mtime.toISOString(),
    summary: {
      agentInstructionFiles: entries.filter((entry) => entry.hasAgentInstructions).length,
      claudeInstructionFiles: entries.filter((entry) => entry.hasClaudeInstructions).length,
      gitRepositories: entries.filter((entry) => entry.hasGit).length,
      packageJsonProjects: entries.filter((entry) => entry.hasPackageJson).length,
      pnpmWorkspaces: entries.filter((entry) => entry.hasPnpmWorkspace).length,
      topLevelDirectories: entries.length,
    },
  };
};

const emptyCategoryCounts = (): Record<ProjectCategory, number> => ({
  'agent-runtime': 0,
  'command-harness': 0,
  'content-media': 0,
  'device-ops': 0,
  'docs-archive': 0,
  'legacy-runtime': 0,
  'memory-brain': 0,
  'product-repo': 0,
  'root-config-or-cache': 0,
  'ui-app': 0,
  'workspace-or-uncategorized': 0,
});

export const getAzaLiveProjectMap = async (): Promise<AzaLiveProjectMap> => {
  const roots = await Promise.all(PROJECT_ROOTS.map(scanRoot));
  const categoryCounts = roots
    .flatMap((root) => root.entries)
    .reduce((counts, entry) => {
      counts[entry.category] += 1;
      return counts;
    }, emptyCategoryCounts());

  return {
    categoryCounts,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_project_map',
    roots,
    safety: {
      captured: [
        'top-level directory names',
        'top-level directory paths',
        'directory modified time',
        'safe marker existence',
        'broad category labels',
      ],
      excluded: [
        'file contents',
        'env files',
        'raw secrets',
        'tokens',
        'cookies',
        'git remotes',
        'private messages',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      agentInstructionFiles: roots.reduce(
        (total, root) => total + root.summary.agentInstructionFiles,
        0,
      ),
      claudeInstructionFiles: roots.reduce(
        (total, root) => total + root.summary.claudeInstructionFiles,
        0,
      ),
      gitRepositories: roots.reduce((total, root) => total + root.summary.gitRepositories, 0),
      packageJsonProjects: roots.reduce(
        (total, root) => total + root.summary.packageJsonProjects,
        0,
      ),
      pnpmWorkspaces: roots.reduce((total, root) => total + root.summary.pnpmWorkspaces, 0),
      rootsPresent: roots.filter((root) => root.exists).length,
      rootsTotal: roots.length,
      topLevelDirectories: roots.reduce(
        (total, root) => total + root.summary.topLevelDirectories,
        0,
      ),
      writesAllowed: false,
    },
  };
};
