import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type JsonRecord = Record<string, unknown>;

type ProbeStatus = 'ok' | 'error' | 'unavailable';

type JsonProbe = {
  elapsedMs: number;
  endpoint: string;
  ok: boolean;
  status: ProbeStatus;
  data?: unknown;
  error?: string;
  httpStatus?: number;
};

const AZA_API_BASE_URL = process.env.AZA_API_BASE_URL ?? 'http://127.0.0.1:8787';
const AZA_MCP_BASE_URL = process.env.AZA_MCP_BASE_URL ?? 'http://127.0.0.1:8788';
const PROBE_TIMEOUT_MS = 1000;

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const asRecordArray = (value: unknown): JsonRecord[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is JsonRecord =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

const text = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const probeJson = async (baseUrl: string, path: string): Promise<JsonProbe> => {
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

const summarizeProbe = (probe: JsonProbe) => ({
  elapsedMs: probe.elapsedMs,
  endpoint: probe.endpoint,
  ok: probe.ok,
  ...(typeof probe.httpStatus === 'number' ? { httpStatus: probe.httpStatus } : {}),
  ...(probe.error ? { error: probe.error } : {}),
  status: probe.status,
});

const summarizeStoreHealth = (probe: JsonProbe) => {
  const data = asRecord(probe.data);

  return {
    ...summarizeProbe(probe),
    store: {
      mode: text(data.mode),
      ok: data.ok === true,
    },
  };
};

const summarizeConversations = (probe: JsonProbe) => {
  const data = asRecord(probe.data);
  const conversations = asRecordArray(data.conversations);
  const sample = conversations.slice(0, 5).map((conversation) => ({
    hasTitle: Boolean(text(conversation.title)),
    id: text(conversation.id),
    privacyClass: text(conversation.privacyClass ?? conversation.privacy_class),
    projectId: text(conversation.projectId ?? conversation.project_id),
    source: text(conversation.source),
    syncedAt: text(conversation.syncedAt ?? conversation.synced_at),
    updatedAt: text(conversation.updatedAt ?? conversation.updated_at),
  }));

  return {
    count: conversations.length,
    probe: summarizeProbe(probe),
    sample,
  };
};

export async function GET() {
  const [apiHealth, apiReady, apiConversations, mcpHealth] = await Promise.all([
    probeJson(AZA_API_BASE_URL, '/health'),
    probeJson(AZA_API_BASE_URL, '/ready'),
    probeJson(AZA_API_BASE_URL, '/v1/conversations?limit=5'),
    probeJson(AZA_MCP_BASE_URL, '/health'),
  ]);

  const conversations = summarizeConversations(apiConversations);

  return NextResponse.json({
    api: {
      conversations,
      health: summarizeProbe(apiHealth),
      ready: summarizeStoreHealth(apiReady),
    },
    generatedAt: new Date().toISOString(),
    mcp: {
      health: summarizeProbe(mcpHealth),
    },
    mode: 'read_only_aza_api_snapshot',
    safety: {
      captured: [
        'AzA API health status',
        'AzA API store readiness mode',
        'conversation count',
        'conversation ids',
        'conversation source',
        'conversation project id',
        'conversation privacy class',
        'conversation sync timestamps',
        'MCP health status',
      ],
      excluded: [
        'message bodies',
        'conversation titles',
        'source conversation ids',
        'request bodies',
        'environment variables',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'raw database rows',
        'VANTA-Brain file contents',
      ],
      writesAllowed: false,
    },
    summary: {
      conversationCount: conversations.count,
      liveAzAReadAvailable: apiHealth.ok && apiReady.ok && apiConversations.ok,
      liveMcpAvailable: mcpHealth.ok,
      storeMode: summarizeStoreHealth(apiReady).store.mode,
      writesAllowed: false,
    },
  });
}
