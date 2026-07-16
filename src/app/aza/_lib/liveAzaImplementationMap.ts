import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './liveServiceMap';

type ImplementationStatus =
  | 'blocked'
  | 'implemented_not_running'
  | 'missing'
  | 'modeled'
  | 'placeholder'
  | 'running_read_only';

type FileKind = 'directory' | 'file' | 'missing' | 'other';

export type AzaImplementationFile = {
  id: string;
  kind: FileKind;
  modifiedAt: string | null;
  path: string;
  role: string;
  sizeBytes: number | null;
};

export type AzaImplementationService = {
  entrypoint: string;
  id: string;
  label: string;
  listenerVisible: boolean;
  port: number;
  role: string;
  status: ImplementationStatus;
};

export type AzaImplementationCapability = {
  evidence: string[];
  id: string;
  label: string;
  notes: string;
  status: ImplementationStatus;
};

export type AzaImplementationPackage = {
  id: string;
  path: string;
  present: boolean;
  role: string;
};

export type AzaImplementationMigration = {
  modifiedAt: string | null;
  path: string;
  sizeBytes: number;
  tableStatements: string[];
};

export type AzaImplementationCompose = {
  healthcheckServices: string[];
  initSqlMounts: string[];
  portBindings: string[];
  services: string[];
  volumes: string[];
};

export type AzaLiveAzaImplementationMap = {
  apiCapabilities: AzaImplementationCapability[];
  compose: AzaImplementationCompose;
  databaseTables: string[];
  envNames: string[];
  files: AzaImplementationFile[];
  generatedAt: string;
  mcpTools: {
    implemented: string[];
    placeholder: string[];
    total: number;
  };
  migrations: AzaImplementationMigration[];
  mode: 'read_only_aza_implementation_map';
  packages: AzaImplementationPackage[];
  packageManifest: {
    dependencyNames: string[];
    devDependencyNames: string[];
    packageManager: string | null;
    scripts: string[];
  };
  recommendation: {
    nextProof: string[];
    status: string;
  };
  root: string;
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  services: AzaImplementationService[];
  summary: {
    apiCapabilities: number;
    databaseTables: number;
    envNames: number;
    filesPresent: number;
    filesTotal: number;
    healthcheckServices: number;
    implementedMcpTools: number;
    initSqlMounts: number;
    migrationFiles: number;
    packageGroupsPresent: number;
    packageGroupsTotal: number;
    placeholderMcpTools: number;
    portBindings: number;
    runningServices: number;
    servicesInCompose: number;
    servicesTotal: number;
    volumes: number;
    writesAllowed: false;
  };
};

const AZA_ROOT = '/Users/growthgod/VAN/aza_memory';

const FILES = [
  ['agents', 'AGENTS.md', 'Repository-specific AzA working rules.'],
  ['readme', 'README.md', 'High-level AzA architecture and quick start.'],
  ['manifest', 'package.json', 'npm workspace scripts, dependency names, and package manager.'],
  [
    'env-example',
    '.env.example',
    'Environment variable names and local service defaults without values.',
  ],
  ['compose', 'docker-compose.yml', 'Local service composition and healthcheck metadata.'],
  ['drizzle', 'drizzle.config.ts', 'Drizzle migration configuration.'],
  [
    'initial-migration',
    'packages/database/migrations/0000_initial.sql',
    'Initial PostgreSQL and pgvector migration mounted by docker compose.',
  ],
  ['openapi', 'openapi.yaml', 'HTTP API contract.'],
  ['api-entry', 'apps/api/src/index.ts', 'AzA API entrypoint.'],
  ['gateway-entry', 'apps/gateway/src/index.ts', 'AzA Gateway entrypoint.'],
  ['mcp-entry', 'apps/mcp/src/index.ts', 'AzA MCP HTTP entrypoint and tool registration.'],
  ['sync-entry', 'apps/sync/src/index.ts', 'AzA Sync entrypoint.'],
  ['worker-entry', 'apps/worker/src/index.ts', 'AzA Worker entrypoint.'],
  ['schema', 'packages/database/src/schema.ts', 'Drizzle schema and memory tables.'],
] as const;

const SERVICES = [
  {
    entrypoint: 'apps/gateway/src/index.ts',
    id: 'aza-gateway',
    label: 'AzA Gateway',
    port: 8786,
    role: 'Identity, capture, redaction, session ids, and proxying to 9Router.',
  },
  {
    entrypoint: 'apps/api/src/index.ts',
    id: 'aza-api',
    label: 'AzA API',
    port: 8787,
    role: 'Ingestion, normalized conversation storage, search, and memory mutation API.',
  },
  {
    entrypoint: 'apps/mcp/src/index.ts',
    id: 'aza-mcp',
    label: 'AzA MCP',
    port: 8788,
    role: 'Local-first MCP retrieval and memory tools.',
  },
  {
    entrypoint: 'apps/sync/src/index.ts',
    id: 'aza-sync',
    label: 'AzA Sync',
    port: 8789,
    role: 'Native ChatGPT and Claude conversation synchronization adapters.',
  },
  {
    entrypoint: 'apps/worker/src/index.ts',
    id: 'aza-worker',
    label: 'AzA Worker',
    port: 8790,
    role: 'Async normalization, extraction, embedding, reconciliation, and projection.',
  },
] as const;

const PACKAGES = [
  ['auth', 'packages/auth', 'Bearer, loopback, and browser-CORS trust boundary.'],
  ['database', 'packages/database', 'Store interface, in-memory bootstrap, and Drizzle schema.'],
  ['events', 'packages/events', 'Event envelope creation and typed telemetry.'],
  ['knowledge', 'packages/knowledge', 'Rule-based extraction and memory version helpers.'],
  ['normalization', 'packages/normalization', 'Conversation and message normalization.'],
  ['observability', 'packages/observability', 'Redacted logging helpers.'],
  ['providers', 'packages/providers', 'Provider adapter boundary.'],
  ['redaction', 'packages/redaction', 'Recursive redaction and secret guards.'],
  ['schemas', 'packages/schemas', 'Shared trust-boundary schemas.'],
  ['search', 'packages/search', 'Hybrid scoring and search helpers.'],
  ['shared', 'packages/shared', 'Ids, hashes, env parsing, and common utilities.'],
] as const;

const API_CAPABILITIES: AzaImplementationCapability[] = [
  {
    evidence: ['apps/api/src/index.ts', 'openapi.yaml'],
    id: 'health_ready',
    label: 'Health and readiness',
    notes: '/health and /ready are implemented; readiness uses the active store health.',
    status: 'modeled',
  },
  {
    evidence: ['apps/api/src/index.ts'],
    id: 'ingestion',
    label: 'Conversation and event ingestion',
    notes: '/v1/ingestion/events and /v1/ingestion/conversations accept typed payloads.',
    status: 'modeled',
  },
  {
    evidence: ['apps/api/src/index.ts', 'packages/database/src/index.ts'],
    id: 'conversation_search',
    label: 'Conversation listing, lookup, and search',
    notes:
      'Conversation list/get/messages and phrase search are wired through the store interface.',
    status: 'modeled',
  },
  {
    evidence: ['apps/api/src/index.ts'],
    id: 'semantic_search_placeholder',
    label: 'Semantic search',
    notes:
      'Endpoint exists but reports placeholder status until embedding generation and pgvector ranking are connected.',
    status: 'placeholder',
  },
  {
    evidence: ['apps/api/src/index.ts'],
    id: 'memory_mutation_scaffold',
    label: 'Memory proposal and mutation scaffold',
    notes:
      'Proposal/approve/reject/supersede endpoints return accepted scaffold responses, not durable verified memory writes.',
    status: 'placeholder',
  },
];

const readJsonFile = async (targetPath: string): Promise<Record<string, unknown>> => {
  const raw = await readFile(targetPath, 'utf8').catch(() => '');
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);

  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
};

const stringRecord = (value: unknown): Record<string, string> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(
        Object.entries(value as Record<string, unknown>).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        ),
      )
    : {};

const checkFile = async (
  id: string,
  relativePath: string,
  role: string,
): Promise<AzaImplementationFile> => {
  const targetPath = path.join(AZA_ROOT, relativePath);
  const stats = await stat(targetPath).catch(() => null);
  const kind: FileKind = !stats
    ? 'missing'
    : stats.isDirectory()
      ? 'directory'
      : stats.isFile()
        ? 'file'
        : 'other';

  return {
    id,
    kind,
    modifiedAt: stats?.mtime.toISOString() ?? null,
    path: targetPath,
    role,
    sizeBytes: stats?.isFile() ? stats.size : null,
  };
};

const extractEnvNames = async () => {
  const raw = await readFile(path.join(AZA_ROOT, '.env.example'), 'utf8').catch(() => '');

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => line.split('=', 1)[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b));
};

const extractDatabaseTables = async () => {
  const raw = await readFile(path.join(AZA_ROOT, 'packages/database/src/schema.ts'), 'utf8').catch(
    () => '',
  );
  const tables = [...raw.matchAll(/export const (\w+) = pgTable/g)].map((match) => match[1]);

  return [...new Set(tables)].sort((a, b) => a.localeCompare(b));
};

const extractMigrationFiles = async (): Promise<AzaImplementationMigration[]> => {
  const migrationsPath = path.join(AZA_ROOT, 'packages/database/migrations');
  const entries = await readdir(migrationsPath, { withFileTypes: true }).catch(() => []);

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(async (entry) => {
        const migrationPath = path.join(migrationsPath, entry.name);
        const [stats, raw] = await Promise.all([
          stat(migrationPath),
          readFile(migrationPath, 'utf8').catch(() => ''),
        ]);
        const tableStatements = [
          ...new Set(
            [...raw.matchAll(/CREATE TABLE(?: IF NOT EXISTS)? "?(\w+)"?/gi)]
              .map((match) => match[1])
              .filter((table): table is string => Boolean(table)),
          ),
        ].sort((a, b) => a.localeCompare(b));

        return {
          modifiedAt: stats.mtime.toISOString(),
          path: migrationPath,
          sizeBytes: stats.size,
          tableStatements,
        };
      }),
  );
};

const extractComposeMetadata = async (): Promise<AzaImplementationCompose> => {
  const raw = await readFile(path.join(AZA_ROOT, 'docker-compose.yml'), 'utf8').catch(() => '');
  const services: string[] = [];
  const healthcheckServices = new Set<string>();
  const initSqlMounts: string[] = [];
  const portBindings: string[] = [];
  const volumes: string[] = [];
  let section: 'services' | 'volumes' | null = null;
  let currentService: string | null = null;

  for (const line of raw.split(/\r?\n/)) {
    if (line === 'services:') {
      section = 'services';
      currentService = null;
      continue;
    }

    if (line === 'volumes:') {
      section = 'volumes';
      currentService = null;
      continue;
    }

    const sectionItem = line.match(/^ {2}([\w.-]+):\s*$/)?.[1];

    if (section === 'services' && sectionItem) {
      currentService = sectionItem;
      services.push(sectionItem);
      continue;
    }

    if (section === 'volumes' && sectionItem) {
      volumes.push(sectionItem);
      continue;
    }

    if (section !== 'services' || !currentService) continue;

    const trimmed = line.trim();
    if (trimmed === 'healthcheck:') healthcheckServices.add(currentService);
    if (trimmed.startsWith('- "') && trimmed.includes('127.0.0.1:')) {
      portBindings.push(`${currentService}:${trimmed.replaceAll('"', '').slice(2)}`);
    }
    if (trimmed.startsWith('- ./') && trimmed.includes('/docker-entrypoint-initdb.d/')) {
      initSqlMounts.push(`${currentService}:${trimmed.slice(2)}`);
    }
  }

  return {
    healthcheckServices: [...healthcheckServices].sort((a, b) => a.localeCompare(b)),
    initSqlMounts: initSqlMounts.sort((a, b) => a.localeCompare(b)),
    portBindings: portBindings.sort((a, b) => a.localeCompare(b)),
    services: services.sort((a, b) => a.localeCompare(b)),
    volumes: volumes.sort((a, b) => a.localeCompare(b)),
  };
};

const extractMcpTools = async () => {
  const raw = await readFile(path.join(AZA_ROOT, 'apps/mcp/src/index.ts'), 'utf8').catch(() => '');
  const tools = [...raw.matchAll(/server\.registerTool\(\s*'([^']+)'/g)].map((match) => match[1]);
  const placeholderBlock = raw.match(/const placeholderTools = \[([\s\S]*?)\]/)?.[1] ?? '';
  const placeholder = [...placeholderBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const placeholderSet = new Set(placeholder);
  const implemented = tools.filter((tool) => !placeholderSet.has(tool));

  return {
    implemented,
    placeholder,
    total: tools.length,
  };
};

export const getAzaLiveAzaImplementationMap = async ({
  serviceMap,
}: {
  serviceMap?: AzaLiveServiceMap;
} = {}): Promise<AzaLiveAzaImplementationMap> => {
  const [
    files,
    liveServiceMap,
    manifest,
    envNames,
    databaseTables,
    migrations,
    compose,
    mcpTools,
    packageEntries,
  ] = await Promise.all([
    Promise.all(FILES.map(([id, filePath, role]) => checkFile(id, filePath, role))),
    serviceMap ?? getAzaLiveServiceMap(),
    readJsonFile(path.join(AZA_ROOT, 'package.json')),
    extractEnvNames(),
    extractDatabaseTables(),
    extractMigrationFiles(),
    extractComposeMetadata(),
    extractMcpTools(),
    Promise.all(
      PACKAGES.map(async ([id, packagePath, role]) => ({
        id,
        path: path.join(AZA_ROOT, packagePath),
        present: Boolean(await stat(path.join(AZA_ROOT, packagePath)).catch(() => null)),
        role,
      })),
    ),
  ]);
  const listenerPorts = new Set(liveServiceMap.listeners.map((listener) => listener.port));
  const scripts = Object.keys(stringRecord(manifest.scripts)).sort((a, b) => a.localeCompare(b));
  const dependencyNames = Object.keys(stringRecord(manifest.dependencies)).sort((a, b) =>
    a.localeCompare(b),
  );
  const devDependencyNames = Object.keys(stringRecord(manifest.devDependencies)).sort((a, b) =>
    a.localeCompare(b),
  );
  const services: AzaImplementationService[] = SERVICES.map((service) => {
    const entrypointPresent = files.some(
      (file) => file.path === path.join(AZA_ROOT, service.entrypoint) && file.kind === 'file',
    );
    const listenerVisible = listenerPorts.has(service.port);

    const status: ImplementationStatus = listenerVisible
      ? 'running_read_only'
      : entrypointPresent
        ? 'implemented_not_running'
        : 'missing';

    return {
      ...service,
      entrypoint: path.join(AZA_ROOT, service.entrypoint),
      listenerVisible,
      status,
    };
  });
  const filesPresent = files.filter((file) => file.kind !== 'missing').length;
  const packageGroupsPresent = packageEntries.filter((entry) => entry.present).length;

  return {
    apiCapabilities: API_CAPABILITIES,
    compose,
    databaseTables,
    envNames,
    files,
    generatedAt: new Date().toISOString(),
    mcpTools,
    migrations,
    mode: 'read_only_aza_implementation_map',
    packageManifest: {
      dependencyNames,
      devDependencyNames,
      packageManager: typeof manifest.packageManager === 'string' ? manifest.packageManager : null,
      scripts,
    },
    packages: packageEntries,
    recommendation: {
      nextProof: [
        'Run typecheck and tests in /Users/growthgod/VAN/aza_memory only after explicit approval for VAN commands.',
        'Start API and MCP services only after approval, then verify /health, /ready, MCP initialize, and implemented retrieval tools.',
        'Verify Postgres, migrations, pgvector, and durable store wiring before enabling canonical AzA writes.',
        'Keep VANTA-Brain projection blocked until canonical ids, redaction, templates, and destination approval are verified.',
      ],
      status:
        services.some((service) => service.status === 'running_read_only') &&
        mcpTools.implemented.length > 0
          ? 'Implementation exists, but live canonical memory is not verified end to end.'
          : 'Implementation files exist, but services are not visible as live verified AzA endpoints.',
    },
    root: AZA_ROOT,
    safety: {
      captured: [
        'file presence',
        'file sizes',
        'modified times',
        'service entrypoint paths',
        'expected localhost ports',
        'listener presence by port',
        'package script names',
        'dependency names',
        'environment variable names from .env.example',
        'database table export names',
        'compose service names',
        'compose healthcheck service names',
        'localhost port bindings',
        'init SQL mount paths',
        'migration file metadata',
        'migration table statement names',
        'MCP tool names',
        'API capability labels',
      ],
      excluded: [
        'raw source contents',
        'raw docker-compose contents',
        'raw migration SQL contents',
        'raw .env files',
        'environment values',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'browser profiles',
        'database contents',
        'raw conversations',
        'private messages',
      ],
      writesAllowed: false,
    },
    services,
    summary: {
      apiCapabilities: API_CAPABILITIES.length,
      databaseTables: databaseTables.length,
      envNames: envNames.length,
      filesPresent,
      filesTotal: files.length,
      healthcheckServices: compose.healthcheckServices.length,
      implementedMcpTools: mcpTools.implemented.length,
      initSqlMounts: compose.initSqlMounts.length,
      migrationFiles: migrations.length,
      packageGroupsPresent,
      packageGroupsTotal: packageEntries.length,
      placeholderMcpTools: mcpTools.placeholder.length,
      portBindings: compose.portBindings.length,
      runningServices: services.filter((service) => service.status === 'running_read_only').length,
      servicesInCompose: compose.services.length,
      servicesTotal: services.length,
      volumes: compose.volumes.length,
      writesAllowed: false,
    },
  };
};
