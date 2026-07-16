import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { promisify } from 'node:util';

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CheckStatus = 'blocked' | 'not_attempted' | 'ready';
type JsonRecord = Record<string, unknown>;

const execFileAsync = promisify(execFile);

const AZA_API_BASE_URL = process.env.AZA_API_BASE_URL ?? 'http://127.0.0.1:8787';
const PROBE_TIMEOUT_MS = 1000;
const COMMAND_TIMEOUT_MS = 2500;

const AZA_MIGRATION_PATH =
  '/Users/growthgod/VAN/aza_memory/packages/database/migrations/0000_initial.sql';

const POSTGRES_BIN_CANDIDATES = [
  '/opt/homebrew/opt/postgresql@16/bin/postgres',
  '/opt/homebrew/bin/postgres',
];

const INITDB_CANDIDATES = [
  '/opt/homebrew/opt/postgresql@16/bin/initdb',
  '/opt/homebrew/bin/initdb',
];

const PGVECTOR_CONTROL_CANDIDATES = [
  '/opt/homebrew/opt/postgresql@16/share/postgresql@16/extension/vector.control',
  '/opt/homebrew/share/postgresql@16/extension/vector.control',
  '/opt/homebrew/share/postgresql/extension/vector.control',
];

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const text = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const fileExists = async (path: string) => Boolean(await stat(path).catch(() => null));

const firstExistingPath = async (paths: string[]) => {
  for (const path of paths) {
    if (await fileExists(path)) return path;
  }

  return null;
};

const runCommand = async (command: string, args: string[]) => {
  try {
    const result = await execFileAsync(command, args, {
      timeout: COMMAND_TIMEOUT_MS,
      windowsHide: true,
    });

    return {
      ok: true,
      output: `${result.stdout}${result.stderr}`.trim(),
    };
  } catch (error) {
    const err = error as Error & { stderr?: string; stdout?: string };

    return {
      error: err.message,
      ok: false,
      output: `${err.stdout ?? ''}${err.stderr ?? ''}`.trim(),
    };
  }
};

const probeJson = async (baseUrl: string, path: string) => {
  const endpoint = `${baseUrl}${path}`;
  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? ((await response.json()) as unknown)
      : ({ nonJsonBody: true } satisfies JsonRecord);

    return {
      data,
      elapsedMs: Date.now() - startedAt,
      endpoint,
      httpStatus: response.status,
      ok: response.ok,
      status: response.ok ? 'ok' : 'error',
    };
  } catch (error) {
    return {
      elapsedMs: Date.now() - startedAt,
      endpoint,
      error: error instanceof Error ? error.message : 'unknown_probe_error',
      ok: false,
      status: 'unavailable',
    };
  } finally {
    clearTimeout(timeout);
  }
};

const check = ({
  detail,
  evidence,
  id,
  nextAction,
  status,
}: {
  detail: string;
  evidence: string[];
  id: string;
  nextAction: string;
  status: CheckStatus;
}) => ({ detail, evidence, id, nextAction, status });

const readUserInfo = () => {
  try {
    return { ok: true, username: userInfo().username };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'unknown_user_lookup_error',
      ok: false,
      username: null,
    };
  }
};

export async function GET() {
  const [postgresBin, initdbBin, pgvectorControl, migrationText, apiReady, dockerProbe] =
    await Promise.all([
      firstExistingPath(POSTGRES_BIN_CANDIDATES),
      firstExistingPath(INITDB_CANDIDATES),
      firstExistingPath(PGVECTOR_CONTROL_CANDIDATES),
      readFile(AZA_MIGRATION_PATH, 'utf8').catch(() => ''),
      probeJson(AZA_API_BASE_URL, '/ready'),
      runCommand('docker', ['info', '--format', '{{.ServerVersion}}']),
    ]);

  const readyData = asRecord(apiReady.data);
  const storeMode = text(readyData.mode);
  const apiReportsPostgres = apiReady.ok && readyData.ok === true && storeMode === 'postgres';
  const migrationRequiresVector =
    migrationText.includes('CREATE EXTENSION IF NOT EXISTS "vector"') &&
    migrationText.includes('embedding vector');
  const effectiveUid = typeof process.getuid === 'function' ? process.getuid() : null;
  const userLookup = await runCommand('/usr/bin/id', ['-un']);
  const nodeUserInfo = readUserInfo();
  const uidHasUserEntry =
    userLookup.ok && !userLookup.output.includes('no such user') && nodeUserInfo.ok;

  const checks = [
    check({
      detail: dockerProbe.ok
        ? 'Docker daemon is reachable for pgvector container startup.'
        : 'Docker daemon is not reachable from this Codex environment.',
      evidence: ['docker info --format {{.ServerVersion}}'],
      id: 'docker_daemon',
      nextAction: dockerProbe.ok
        ? 'Use docker compose postgres when a durable AzA stack is needed.'
        : 'Start Docker Desktop or use a native Postgres path with pgvector installed.',
      status: dockerProbe.ok ? 'ready' : 'blocked',
    }),
    check({
      detail: postgresBin
        ? `Native postgres binary present at ${postgresBin}.`
        : 'Native postgres server binary was not found in known Homebrew paths.',
      evidence: POSTGRES_BIN_CANDIDATES,
      id: 'native_postgres_binary',
      nextAction: postgresBin
        ? 'Use the native binary for local checks.'
        : 'Install or expose postgres.',
      status: postgresBin ? 'ready' : 'blocked',
    }),
    check({
      detail: initdbBin
        ? `Native initdb binary present at ${initdbBin}.`
        : 'Native initdb binary was not found in known Homebrew paths.',
      evidence: INITDB_CANDIDATES,
      id: 'native_initdb_binary',
      nextAction: initdbBin
        ? 'Use initdb only after UID/user lookup works.'
        : 'Install or expose initdb.',
      status: initdbBin ? 'ready' : 'blocked',
    }),
    check({
      detail: uidHasUserEntry
        ? `Current UID ${effectiveUid ?? 'unknown'} resolves to ${nodeUserInfo.username}.`
        : `Current UID ${effectiveUid ?? 'unknown'} does not fully resolve through Node/libuv here.`,
      evidence: ['/usr/bin/id -un', 'node:os userInfo()'],
      id: 'postgres_uid_lookup',
      nextAction: uidHasUserEntry
        ? 'Native initdb can be attempted.'
        : 'Fix local user lookup or use Docker; initdb fails without a passwd entry.',
      status: uidHasUserEntry ? 'ready' : 'blocked',
    }),
    check({
      detail: pgvectorControl
        ? `pgvector control file present at ${pgvectorControl}.`
        : 'pgvector control file was not found in known Homebrew extension paths.',
      evidence: PGVECTOR_CONTROL_CANDIDATES,
      id: 'pgvector_extension',
      nextAction: pgvectorControl
        ? 'Run the full AzA migration against Postgres.'
        : 'Install pgvector for native Postgres or use the Docker pgvector image.',
      status: pgvectorControl ? 'ready' : 'blocked',
    }),
    check({
      detail: migrationRequiresVector
        ? 'AzA migration requires pgvector for embedding_chunks.'
        : 'AzA migration did not expose the expected pgvector requirement.',
      evidence: [AZA_MIGRATION_PATH],
      id: 'migration_vector_requirement',
      nextAction: migrationRequiresVector
        ? 'Keep durable store blocked until pgvector is available.'
        : 'Review the migration before treating the schema gate as known.',
      status: migrationRequiresVector ? 'ready' : 'blocked',
    }),
    check({
      detail: apiReportsPostgres
        ? 'AzA API /ready reports a healthy postgres store.'
        : `AzA API /ready does not report healthy postgres; current mode is ${storeMode ?? 'unavailable'}.`,
      evidence: [`${AZA_API_BASE_URL}/ready`],
      id: 'aza_api_postgres_ready',
      nextAction: apiReportsPostgres
        ? 'Proceed to schema and write-path proof.'
        : 'Start AzA API with DATABASE_URL after a usable Postgres runtime exists.',
      status: apiReportsPostgres ? 'ready' : 'blocked',
    }),
  ];

  const blockedChecks = checks.filter((item) => item.status === 'blocked').length;

  return NextResponse.json({
    checks,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_aza_durable_store_readiness',
    probes: {
      apiReady: {
        elapsedMs: apiReady.elapsedMs,
        endpoint: apiReady.endpoint,
        httpStatus: apiReady.httpStatus ?? null,
        ok: apiReady.ok,
        status: apiReady.status,
        store: {
          mode: storeMode,
          ok: readyData.ok === true,
        },
      },
      docker: {
        ok: dockerProbe.ok,
        output: dockerProbe.ok ? dockerProbe.output : null,
        error: dockerProbe.ok ? null : dockerProbe.error,
      },
      userLookup: {
        idCommandOk: userLookup.ok,
        nodeUserInfoError: nodeUserInfo.ok ? null : nodeUserInfo.error,
        nodeUserInfoOk: nodeUserInfo.ok,
      },
    },
    safety: {
      captured: [
        'Docker daemon availability',
        'Postgres binary path presence',
        'initdb binary path presence',
        'current UID lookup status',
        'Node/libuv user lookup status',
        'pgvector control file path presence',
        'AzA migration pgvector requirement presence',
        'AzA API readiness mode',
      ],
      excluded: [
        'DATABASE_URL value',
        'database contents',
        'migration output bodies',
        'raw environment variables',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'VANTA-Brain file contents',
      ],
      writesAllowed: false,
    },
    summary: {
      blockedChecks,
      dockerAvailable: dockerProbe.ok,
      durableStoreReady: blockedChecks === 0,
      nativePostgresAvailable: Boolean(postgresBin && initdbBin),
      pgvectorAvailable: Boolean(pgvectorControl),
      uidHasUserEntry,
      writesAllowed: false,
    },
  });
}
