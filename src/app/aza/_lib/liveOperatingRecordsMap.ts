export type JsonRecord = Record<string, unknown>;

export const EXPECTED_OPERATING_RECORD_TYPES = [
  'offer',
  'lead',
  'pilot',
  'task',
  'content',
  'publish',
  'measurement',
] as const;

export type SanitizedOperatingRecord = {
  evidenceCount: number;
  hasMetadata: boolean;
  id: string | null;
  lane: string | null;
  owner: string | null;
  projectId: string | null;
  recordType: string | null;
  source: string | null;
  status: string | null;
  titlePresent: boolean;
  updatedAt: string | null;
};

export type AzaLiveOperatingRecordsMap = {
  generatedAt: string;
  mode: 'read_only_live_operating_records';
  probe: {
    elapsedMs: number;
    endpoint: string;
    error?: string;
    httpStatus?: number;
    ok: boolean;
    status: string;
  };
  records: SanitizedOperatingRecord[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    expectedRecordTypes: number;
    expectedRecordTypesFound: number;
    liveAzAOperatingRecordsAvailable: boolean;
    operatingRecordProof: boolean;
    recordCount: number;
    recordTypesFound: string[];
    writesAllowed: false;
  };
};

const AZA_API_BASE_URL = process.env.AZA_API_BASE_URL ?? 'http://127.0.0.1:8787';
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

const probeOperatingRecords = async () => {
  const endpoint = `${AZA_API_BASE_URL}/v1/operating-records?status=active&limit=100`;
  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => ({}))) as unknown;
    const records = asRecordArray(asRecord(data).records);

    return {
      elapsedMs: Date.now() - startedAt,
      endpoint,
      httpStatus: response.status,
      ok: response.ok,
      records,
      status: response.ok ? 'ok' : 'error',
    };
  } catch (error) {
    return {
      elapsedMs: Date.now() - startedAt,
      endpoint,
      error: error instanceof Error ? error.message : 'unknown_probe_error',
      ok: false,
      records: [],
      status: 'unavailable',
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const getAzaLiveOperatingRecordsMap = async (): Promise<AzaLiveOperatingRecordsMap> => {
  const probe = await probeOperatingRecords();
  const recordTypesFound = [
    ...new Set(
      probe.records
        .map((record) => text(record.recordType))
        .filter((recordType): recordType is string => Boolean(recordType)),
    ),
  ];
  const expectedTypesFound = EXPECTED_OPERATING_RECORD_TYPES.filter((recordType) =>
    recordTypesFound.includes(recordType),
  );

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_operating_records',
    probe: {
      elapsedMs: probe.elapsedMs,
      endpoint: probe.endpoint,
      ...(typeof probe.httpStatus === 'number' ? { httpStatus: probe.httpStatus } : {}),
      ...(probe.error ? { error: probe.error } : {}),
      ok: probe.ok,
      status: probe.status,
    },
    records: probe.records.slice(0, 20).map((record) => ({
      evidenceCount: Array.isArray(record.evidenceIds) ? record.evidenceIds.length : 0,
      hasMetadata: Object.keys(asRecord(record.metadata)).length > 0,
      id: text(record.id),
      lane: text(record.lane),
      owner: text(record.owner),
      projectId: text(record.projectId),
      recordType: text(record.recordType),
      source: text(record.source),
      status: text(record.status),
      titlePresent: Boolean(text(record.title)),
      updatedAt: text(record.updatedAt),
    })),
    safety: {
      captured: [
        'operating record ids',
        'record type labels',
        'lane labels',
        'owner labels',
        'project ids',
        'source labels',
        'status labels',
        'evidence counts',
        'metadata presence',
        'updated timestamps',
      ],
      excluded: [
        'raw lead details',
        'customer private data',
        'raw content payloads',
        'private messages',
        'browser tab contents',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
        'database rows',
        'VANTA-Brain file contents',
      ],
      writesAllowed: false,
    },
    summary: {
      expectedRecordTypes: EXPECTED_OPERATING_RECORD_TYPES.length,
      expectedRecordTypesFound: expectedTypesFound.length,
      liveAzAOperatingRecordsAvailable: probe.ok,
      operatingRecordProof:
        probe.ok && expectedTypesFound.length === EXPECTED_OPERATING_RECORD_TYPES.length,
      recordCount: probe.records.length,
      recordTypesFound,
      writesAllowed: false,
    },
  };
};
