import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

type ExecError = Error & {
  stdout?: Buffer | string;
};

type ExpectedServiceCategory =
  | 'aza-memory-service'
  | 'command-harness'
  | 'legacy-runtime'
  | 'local-cache'
  | 'local-database'
  | 'local-model-runtime'
  | 'product-runtime';

type LiveServiceCategory =
  | ExpectedServiceCategory
  | 'app-internal-listener'
  | 'browser-automation-runtime'
  | 'browser-internal-listener'
  | 'hermes-runtime'
  | 'local-router-runtime'
  | 'system-internal-listener'
  | 'unknown-local-listener'
  | 'van-runtime';

type ExpectedService = {
  category: ExpectedServiceCategory;
  channel: string;
  expectedRole: string;
  id: string;
  label: string;
  port: number;
};

export type LiveServiceListener = {
  bind: string;
  category: LiveServiceCategory;
  confidence: 'high' | 'low' | 'medium';
  cwd: string | null;
  expectedServiceId: string | null;
  id: string;
  interpretation: string;
  pid: number;
  port: number;
  process: string;
  protocol: 'tcp';
  user: string | null;
};

export type ExpectedServiceStatus = ExpectedService & {
  listenerIds: string[];
  listenerPids: number[];
  matchedCwds: string[];
  status: 'listening' | 'missing';
};

export type AzaLiveServiceMap = {
  expectedServices: ExpectedServiceStatus[];
  generatedAt: string;
  listeners: LiveServiceListener[];
  mode: 'read_only_live_service_map';
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    azaPortsListening: number;
    azaPortsMissing: number;
    desktopVanListenerCount: number;
    expectedListening: number;
    expectedMissing: number;
    listenerCount: number;
    uniqueProcessCount: number;
    unknownListenerCount: number;
    vanListenerCount: number;
    writesAllowed: false;
  };
};

type ProcessRecord = {
  command: string;
  listeners: Array<{ bind: string; port: number }>;
  pid: number;
  user: string | null;
};

const EXPECTED_SERVICES: ExpectedService[] = [
  {
    category: 'command-harness',
    channel: 'HTTP',
    expectedRole: 'LobeHub AzA command-center preview',
    id: 'lobehub-aza-preview',
    label: 'LobeHub AzA preview',
    port: 3010,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'InstaGrowth backend or product service from earlier catalog',
    id: 'instagrowth-backend',
    label: 'InstaGrowth backend',
    port: 3001,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'Engine service',
    id: 'engine-service',
    label: 'Engine',
    port: 3003,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'Suno engine root service',
    id: 'suno-engine',
    label: 'Suno Engine',
    port: 3005,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'Suno web surface',
    id: 'suno-web',
    label: 'Suno Web',
    port: 3006,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'Paperclip hub service',
    id: 'paperclip-hub',
    label: 'Paperclip Hub',
    port: 3110,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'Hermes UI dashboard from earlier catalog',
    id: 'hermes-ui',
    label: 'Hermes UI',
    port: 3200,
  },
  {
    category: 'product-runtime',
    channel: 'HTTP',
    expectedRole: 'Hermes dispatch API from earlier catalog',
    id: 'hermes-dispatch',
    label: 'Hermes Dispatch',
    port: 3201,
  },
  {
    category: 'legacy-runtime',
    channel: 'HTTP',
    expectedRole: 'Legacy or alternate Desktop/VAN Odysseus runtime',
    id: 'desktop-van-odysseus',
    label: 'Desktop/VAN Odysseus',
    port: 7001,
  },
  {
    category: 'aza-memory-service',
    channel: 'HTTP',
    expectedRole: 'AzA gateway',
    id: 'aza-gateway',
    label: 'AzA Gateway',
    port: 8786,
  },
  {
    category: 'aza-memory-service',
    channel: 'HTTP',
    expectedRole: 'AzA API',
    id: 'aza-api',
    label: 'AzA API',
    port: 8787,
  },
  {
    category: 'aza-memory-service',
    channel: 'HTTP/MCP',
    expectedRole: 'AzA MCP server',
    id: 'aza-mcp',
    label: 'AzA MCP',
    port: 8788,
  },
  {
    category: 'aza-memory-service',
    channel: 'HTTP',
    expectedRole: 'AzA sync service',
    id: 'aza-sync',
    label: 'AzA Sync',
    port: 8789,
  },
  {
    category: 'aza-memory-service',
    channel: 'HTTP',
    expectedRole: 'AzA worker service',
    id: 'aza-worker',
    label: 'AzA Worker',
    port: 8790,
  },
  {
    category: 'local-database',
    channel: 'Postgres',
    expectedRole: 'Local PostgreSQL database',
    id: 'postgres',
    label: 'Postgres',
    port: 5432,
  },
  {
    category: 'local-cache',
    channel: 'Redis',
    expectedRole: 'Local Redis cache',
    id: 'redis',
    label: 'Redis',
    port: 6379,
  },
  {
    category: 'local-model-runtime',
    channel: 'HTTP',
    expectedRole: 'Ollama local model runtime',
    id: 'ollama',
    label: 'Ollama',
    port: 11434,
  },
];

const runLsof = async (args: string[]): Promise<string> => {
  try {
    const { stdout } = await execFileAsync('/usr/sbin/lsof', args, {
      maxBuffer: 1024 * 1024,
      timeout: 5000,
    });

    return stdout.toString();
  } catch (error) {
    const execError = error as ExecError;

    return execError.stdout ? execError.stdout.toString() : '';
  }
};

const parseEndpoint = (rawEndpoint: string): { bind: string; port: number } | null => {
  const match = rawEndpoint.match(/:(\d+)$/);

  if (!match || match.index === undefined) return null;

  const port = Number(match[1]);
  const bind = rawEndpoint.slice(0, match.index) || '*';

  return Number.isFinite(port) ? { bind, port } : null;
};

const parseListenOutput = (output: string): ProcessRecord[] => {
  const processes = new Map<number, ProcessRecord>();
  let current: ProcessRecord | null = null;

  for (const line of output.split('\n')) {
    if (!line) continue;

    const prefix = line[0];
    const value = line.slice(1);

    if (prefix === 'p') {
      const pid = Number(value);
      if (!Number.isFinite(pid)) {
        current = null;
        continue;
      }

      current = processes.get(pid) ?? {
        command: 'unknown',
        listeners: [],
        pid,
        user: null,
      };
      processes.set(pid, current);
      continue;
    }

    if (!current) continue;

    if (prefix === 'c') {
      current.command = value || 'unknown';
      continue;
    }

    if (prefix === 'L') {
      current.user = value || null;
      continue;
    }

    if (prefix === 'n') {
      const endpoint = parseEndpoint(value);
      if (endpoint) current.listeners.push(endpoint);
    }
  }

  return Array.from(processes.values()).filter((process) => process.listeners.length > 0);
};

const parseCwdOutput = (output: string): Map<number, string> => {
  const cwdByPid = new Map<number, string>();
  let currentPid: number | null = null;

  for (const line of output.split('\n')) {
    if (!line) continue;

    const prefix = line[0];
    const value = line.slice(1);

    if (prefix === 'p') {
      const pid = Number(value);
      currentPid = Number.isFinite(pid) ? pid : null;
      continue;
    }

    if (prefix === 'n' && currentPid !== null) cwdByPid.set(currentPid, value);
  }

  return cwdByPid;
};

const loadCwdByPid = async (pids: number[]): Promise<Map<number, string>> => {
  if (pids.length === 0) return new Map();

  const chunks: number[][] = [];
  for (let index = 0; index < pids.length; index += 80) {
    chunks.push(pids.slice(index, index + 80));
  }

  const maps = await Promise.all(
    chunks.map(async (chunk) =>
      parseCwdOutput(await runLsof(['-a', '-p', chunk.join(','), '-d', 'cwd', '-Fn'])),
    ),
  );

  return maps.reduce((merged, map) => {
    for (const [pid, cwd] of map) merged.set(pid, cwd);
    return merged;
  }, new Map<number, string>());
};

const expectedByPort = new Map(EXPECTED_SERVICES.map((service) => [service.port, service]));

const categorize = ({
  command,
  cwd,
  port,
}: {
  command: string;
  cwd: string | null;
  port: number;
}): Pick<
  LiveServiceListener,
  'category' | 'confidence' | 'expectedServiceId' | 'interpretation'
> => {
  const expected = expectedByPort.get(port);

  if (expected) {
    return {
      category: expected.category,
      confidence: 'high',
      expectedServiceId: expected.id,
      interpretation: expected.expectedRole,
    };
  }

  if (cwd?.startsWith('/Users/growthgod/lobehub')) {
    return {
      category: 'command-harness',
      confidence: 'high',
      expectedServiceId: null,
      interpretation: 'LobeHub command-harness process listener.',
    };
  }

  if (cwd?.startsWith('/Users/growthgod/VAN')) {
    return {
      category: 'van-runtime',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Listener owned by a VAN runtime path.',
    };
  }

  if (cwd?.startsWith('/Users/growthgod/Desktop/VAN')) {
    return {
      category: 'legacy-runtime',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Listener owned by the legacy Desktop/VAN runtime path.',
    };
  }

  if (cwd?.startsWith('/Users/growthgod/.hermes')) {
    return {
      category: 'hermes-runtime',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Listener owned by Hermes runtime state.',
    };
  }

  if (cwd?.includes('/9router/')) {
    return {
      category: 'local-router-runtime',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Listener owned by local 9router runtime.',
    };
  }

  if (cwd?.includes('/camofox-browser')) {
    return {
      category: 'browser-automation-runtime',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Listener owned by browser automation tooling.',
    };
  }

  if (/Google|Chrome|Brave|Comet/i.test(command)) {
    return {
      category: 'browser-internal-listener',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Browser or browser-adjacent internal listener.',
    };
  }

  if (/Discord|Spotify|LobeHub|Code Helper|Kimi|Gemini|MiniMax|Claude|Notion/i.test(command)) {
    return {
      category: 'app-internal-listener',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'Desktop app internal listener.',
    };
  }

  if (/rapportd|ControlCenter|IPNExtension/i.test(command)) {
    return {
      category: 'system-internal-listener',
      confidence: 'medium',
      expectedServiceId: null,
      interpretation: 'macOS or network utility internal listener.',
    };
  }

  return {
    category: 'unknown-local-listener',
    confidence: 'low',
    expectedServiceId: null,
    interpretation:
      'Unknown listener. Keep inventory-only until owner, cwd, and expected role are verified.',
  };
};

const buildListeners = (
  processes: ProcessRecord[],
  cwdByPid: Map<number, string>,
): LiveServiceListener[] => {
  const seen = new Set<string>();
  const listeners: LiveServiceListener[] = [];

  for (const process of processes) {
    const cwd = cwdByPid.get(process.pid) ?? null;

    for (const listener of process.listeners) {
      const key = `${process.pid}:${listener.bind}:${listener.port}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const category = categorize({
        command: process.command,
        cwd,
        port: listener.port,
      });

      listeners.push({
        ...category,
        bind: listener.bind,
        cwd,
        id: `${process.pid}-${listener.bind.replaceAll(/[^a-z\d]+/gi, '_')}-${listener.port}`,
        pid: process.pid,
        port: listener.port,
        process: process.command,
        protocol: 'tcp',
        user: process.user,
      });
    }
  }

  return listeners.sort((a, b) => a.port - b.port || a.process.localeCompare(b.process));
};

const buildExpectedServices = (listeners: LiveServiceListener[]): ExpectedServiceStatus[] =>
  EXPECTED_SERVICES.map((service) => {
    const matches = listeners.filter((listener) => listener.port === service.port);
    const matchedCwds = Array.from(
      new Set(matches.map((listener) => listener.cwd).filter((cwd): cwd is string => Boolean(cwd))),
    ).sort();

    return {
      ...service,
      listenerIds: matches.map((listener) => listener.id),
      listenerPids: Array.from(new Set(matches.map((listener) => listener.pid))).sort(
        (a, b) => a - b,
      ),
      matchedCwds,
      status: matches.length > 0 ? 'listening' : 'missing',
    };
  });

export const getAzaLiveServiceMap = async (): Promise<AzaLiveServiceMap> => {
  const listenOutput = await runLsof(['-nP', '-iTCP', '-sTCP:LISTEN', '-FnPcLn']);
  const processes = parseListenOutput(listenOutput);
  const cwdByPid = await loadCwdByPid(processes.map((process) => process.pid));
  const listeners = buildListeners(processes, cwdByPid);
  const expectedServices = buildExpectedServices(listeners);
  const azaServices = expectedServices.filter(
    (service) => service.category === 'aza-memory-service',
  );

  return {
    expectedServices,
    generatedAt: new Date().toISOString(),
    listeners,
    mode: 'read_only_live_service_map',
    safety: {
      captured: ['pid', 'process name', 'user', 'bind address', 'tcp port', 'cwd path'],
      excluded: [
        'command arguments',
        'environment variables',
        'open file names beyond cwd',
        'request bodies',
        'database contents',
        'browser tabs',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
      ],
      writesAllowed: false,
    },
    summary: {
      azaPortsListening: azaServices.filter((service) => service.status === 'listening').length,
      azaPortsMissing: azaServices.filter((service) => service.status === 'missing').length,
      desktopVanListenerCount: listeners.filter((listener) =>
        listener.cwd?.startsWith('/Users/growthgod/Desktop/VAN'),
      ).length,
      expectedListening: expectedServices.filter((service) => service.status === 'listening')
        .length,
      expectedMissing: expectedServices.filter((service) => service.status === 'missing').length,
      listenerCount: listeners.length,
      uniqueProcessCount: new Set(listeners.map((listener) => listener.pid)).size,
      unknownListenerCount: listeners.filter(
        (listener) => listener.category === 'unknown-local-listener',
      ).length,
      vanListenerCount: listeners.filter((listener) =>
        listener.cwd?.startsWith('/Users/growthgod/VAN'),
      ).length,
      writesAllowed: false,
    },
  };
};
