import { readFile, stat } from 'node:fs/promises';

import { type AzaLiveAzaImplementationMap } from './liveAzaImplementationMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';

type JsonRecord = Record<string, unknown>;

type McpStatus =
  | 'blocked'
  | 'configured_metadata_only'
  | 'metadata_only'
  | 'not_present'
  | 'planned'
  | 'ready_to_probe';

type ConfigKind = 'directory' | 'file' | 'missing' | 'other';

type ConfigParser = 'json' | 'json_registry' | 'toml_mcp_servers';

type LiveMcpProtocolProbe = {
  callListConversationsOk: boolean;
  conversationCount: number | null;
  error: string | null;
  implementedToolCalls: LiveMcpToolCallProbe[];
  implementedToolCallsOk: boolean;
  implementedToolCallsTotal: number;
  implementedToolCallsVerified: number;
  implementedToolsPresent: number;
  initialized: boolean;
  placeholderProbeOk: boolean;
  placeholderToolCall: LiveMcpToolCallProbe | null;
  placeholderToolsPresent: number;
  protocolVersion: string | null;
  serverName: string | null;
  sessionIdPresent: boolean;
  toolsListOk: boolean;
  toolsTotal: number;
};

type McpToolResultKind =
  | 'data'
  | 'empty'
  | 'not_found'
  | 'placeholder'
  | 'transport_error'
  | 'unknown';

type LiveMcpToolCallProbe = {
  isError: boolean;
  name: string;
  ok: boolean;
  recordCount: number | null;
  resultKind: McpToolResultKind;
  structured: boolean;
  transportOk: boolean;
};

export type McpClientConfig = {
  id: string;
  kind: ConfigKind;
  label: string;
  modifiedAt: string | null;
  owner: string;
  parseStatus: 'directory_metadata_only' | 'not_present' | 'parsed' | 'skipped' | 'unparsed';
  parser: ConfigParser;
  path: string;
  present: boolean;
  role: string;
  serverCount: number;
  serverNames: string[];
  sizeBytes: number | null;
};

export type McpToolContract = {
  evidence: string[];
  name: string;
  role: string;
  status: 'blocked_placeholder' | 'implemented_not_verified';
};

export type McpToolingChannel = {
  approval: string;
  evidence: string[];
  from: string;
  id: string;
  status: McpStatus;
  to: string;
  transport: string;
};

export type McpProofStep = {
  evidenceNeeded: string[];
  id: string;
  status: McpStatus;
  title: string;
};

export type AzaLiveMcpToolingMap = {
  clientConfigs: McpClientConfig[];
  generatedAt: string;
  mode: 'read_only_mcp_tooling_map';
  proofSteps: McpProofStep[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    azaMcpHealthy: boolean;
    blockedProofSteps: number;
    implementedToolCallsTotal: number;
    implementedToolCallsVerified: number;
    liveImplementedToolCallOk: boolean;
    liveImplementedToolCoverageOk: boolean;
    liveMcpInitialized: boolean;
    livePlaceholderProbeOk: boolean;
    liveToolsListOk: boolean;
    liveToolsTotal: number;
    clientConfigFiles: number;
    clientConfigsPresent: number;
    configuredServerNames: number;
    implementedTools: number;
    placeholderTools: number;
    readyToProbeSteps: number;
    toolingChannels: number;
    writesAllowed: false;
  };
  protocolProbe: LiveMcpProtocolProbe;
  toolingChannels: McpToolingChannel[];
  tools: McpToolContract[];
};

type McpToolInventory = {
  implemented: string[];
  placeholder: string[];
};

const AZA_MCP_ENTRYPOINT = '/Users/growthgod/VAN/aza_memory/apps/mcp/src/index.ts';
const AZA_MCP_ENDPOINT = 'http://127.0.0.1:8788/mcp';

const CLIENT_CONFIGS: Array<{
  id: string;
  label: string;
  owner: string;
  parser: ConfigParser;
  path: string;
  role: string;
}> = [
  {
    id: 'codex-global-config',
    label: 'Codex MCP client config',
    owner: 'Codex harness',
    parser: 'toml_mcp_servers',
    path: '/Users/growthgod/.codex/config.toml',
    role: 'MCP servers available to Codex coding sessions and the current executor surface.',
  },
  {
    id: 'codex-artifact-registry',
    label: 'Codex MCP artifact registry',
    owner: 'Codex harness',
    parser: 'json_registry',
    path: '/Users/growthgod/.codex/mcp-artifact-registry.json',
    role: 'Local Codex registry of MCP-related artifacts and metadata.',
  },
  {
    id: 'home-mcp-json',
    label: 'Home MCP config',
    owner: 'User account',
    parser: 'json',
    path: '/Users/growthgod/.mcp.json',
    role: 'Machine-level MCP server declarations used by compatible desktop and CLI clients.',
  },
  {
    id: 'cursor-mcp-json',
    label: 'Cursor MCP config',
    owner: 'Cursor',
    parser: 'json',
    path: '/Users/growthgod/.cursor/mcp.json',
    role: 'Cursor MCP server declarations.',
  },
  {
    id: 'gemini-mcp-config',
    label: 'Gemini MCP config',
    owner: 'Gemini',
    parser: 'json',
    path: '/Users/growthgod/.gemini/config/mcp_config.json',
    role: 'Gemini MCP server declarations.',
  },
  {
    id: 'minimax-mcp-config',
    label: 'MiniMax MCP config',
    owner: 'MiniMax',
    parser: 'json',
    path: '/Users/growthgod/.minimax/mcp/mcp.json',
    role: 'MiniMax MCP server declarations.',
  },
  {
    id: 'hermes-mcp-registry',
    label: 'Hermes MCP registry',
    owner: 'Hermes',
    parser: 'json_registry',
    path: '/Users/growthgod/.local/state/hermes/mcp-registry.json',
    role: 'Hermes MCP registry for tool and server routing.',
  },
  {
    id: 'van-mcp-json',
    label: 'VAN MCP config',
    owner: 'VAN workspace',
    parser: 'json',
    path: '/Users/growthgod/VAN/.mcp.json',
    role: 'Workspace-level MCP declarations for VAN projects; metadata only, no edits.',
  },
  {
    id: 'vanta-agent-kit-cursor-mcp',
    label: 'Vanta Agent Kit Cursor MCP preset',
    owner: 'VANTA agent kit',
    parser: 'json',
    path: '/Users/growthgod/VAN/vanta-agent-kit/mcp/cursor-mcp.json',
    role: 'Project preset for Cursor-compatible MCP setup; metadata only, no edits.',
  },
  {
    id: 'vanta-agent-kit-kimi-mcp',
    label: 'Vanta Agent Kit Kimi MCP preset',
    owner: 'VANTA agent kit',
    parser: 'json',
    path: '/Users/growthgod/VAN/vanta-agent-kit/mcp/kimi-mcp.json',
    role: 'Project preset for Kimi-compatible MCP setup; metadata only, no edits.',
  },
];

const IMPLEMENTED_TOOL_ROLES = new Map<string, string>([
  ['list_conversations', 'List normalized conversation records.'],
  ['get_conversation', 'Read one normalized conversation record.'],
  ['get_conversation_with_messages', 'Read one conversation with its message records.'],
  ['search_messages', 'Keyword search across normalized messages.'],
  ['search_conversations', 'Keyword search across normalized conversations.'],
  ['get_project_context', 'Assemble project context from normalized AzA records.'],
  ['list_projects', 'List AzA project records.'],
  ['list_tasks', 'List AzA task records.'],
  ['list_operating_records', 'List AzA GTM and content operating records.'],
  ['list_handoffs', 'List AzA Codex handoff records.'],
  ['list_evidence', 'List AzA evidence records.'],
]);

const IMPLEMENTED_TOOL_PROBE_ARGUMENTS = new Map<string, JsonRecord>([
  ['list_conversations', { limit: 1 }],
  ['get_conversation', { id: '__aza_probe_missing_conversation__' }],
  ['get_conversation_with_messages', { id: '__aza_probe_missing_conversation__' }],
  ['search_messages', { limit: 1, query: '__aza_probe_no_results__' }],
  ['search_conversations', { limit: 1, query: '__aza_probe_no_results__' }],
  ['get_project_context', { limit: 1, projectId: '__aza_probe_missing_project__' }],
  ['list_projects', { limit: 1, offset: 0 }],
  ['list_tasks', { limit: 1, offset: 0 }],
  ['list_operating_records', { limit: 1, offset: 0 }],
  ['list_handoffs', { limit: 1, offset: 0 }],
  ['list_evidence', { limit: 1, offset: 0 }],
]);

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const recordArray = (value: unknown): JsonRecord[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is JsonRecord =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

const text = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const safeName = (name: string) => name.replaceAll(/[^\w@./:-]+/g, '_').slice(0, 96);

const uniqueSorted = (values: string[]) =>
  [...new Set(values.filter(Boolean).map(safeName))].sort((a, b) => a.localeCompare(b));

const parseJsonRecord = (raw: string): JsonRecord | null => {
  try {
    return getRecord(JSON.parse(raw));
  } catch {
    return null;
  }
};

const objectKeys = (value: unknown) => Object.keys(getRecord(value));

const extractServerNamesFromJson = (record: JsonRecord) => {
  const directKeys = [
    ...objectKeys(record.mcpServers),
    ...objectKeys(record.mcp_servers),
    ...objectKeys(record.servers),
  ];

  if (directKeys.length > 0) return uniqueSorted(directKeys);

  const reserved = new Set(['$schema', 'description', 'metadata', 'name', 'presets', 'version']);
  const topLevelServerKeys = Object.entries(record)
    .filter(([key, value]) => !reserved.has(key) && typeof value === 'object' && value !== null)
    .map(([key]) => key);

  return uniqueSorted(topLevelServerKeys);
};

const extractServerNamesFromToml = (raw: string) =>
  uniqueSorted(
    [...raw.matchAll(/^\[mcp_servers\.([^\]\s.]+)(?:\.[^\]\s]+)?\]/gm)]
      .map((match) => match[1])
      .filter((name): name is string => Boolean(name)),
  );

const readClientConfig = async (
  config: (typeof CLIENT_CONFIGS)[number],
): Promise<McpClientConfig> => {
  const stats = await stat(config.path).catch(() => null);

  if (!stats) {
    return {
      ...config,
      kind: 'missing',
      modifiedAt: null,
      parseStatus: 'not_present',
      present: false,
      serverCount: 0,
      serverNames: [],
      sizeBytes: null,
    };
  }

  const kind: ConfigKind = stats.isDirectory() ? 'directory' : stats.isFile() ? 'file' : 'other';

  if (!stats.isFile()) {
    return {
      ...config,
      kind,
      modifiedAt: stats.mtime.toISOString(),
      parseStatus: stats.isDirectory() ? 'directory_metadata_only' : 'skipped',
      present: true,
      serverCount: 0,
      serverNames: [],
      sizeBytes: stats.isFile() ? stats.size : null,
    };
  }

  if (stats.size > 1024 * 1024) {
    return {
      ...config,
      kind,
      modifiedAt: stats.mtime.toISOString(),
      parseStatus: 'skipped',
      present: true,
      serverCount: 0,
      serverNames: [],
      sizeBytes: stats.size,
    };
  }

  const raw = await readFile(config.path, 'utf8').catch(() => '');
  const serverNames =
    config.parser === 'toml_mcp_servers'
      ? extractServerNamesFromToml(raw)
      : extractServerNamesFromJson(parseJsonRecord(raw) ?? {});

  return {
    ...config,
    kind,
    modifiedAt: stats.mtime.toISOString(),
    parseStatus: raw ? 'parsed' : 'unparsed',
    present: true,
    serverCount: serverNames.length,
    serverNames,
    sizeBytes: stats.size,
  };
};

const extractAzaMcpTools = async (): Promise<McpToolInventory> => {
  const raw = await readFile(AZA_MCP_ENTRYPOINT, 'utf8').catch(() => '');
  const tools = [...raw.matchAll(/server\.registerTool\(\s*'([^']+)'/g)]
    .map((match) => match[1])
    .filter((name): name is string => Boolean(name));
  const placeholderBlock = raw.match(/const placeholderTools = \[([\s\S]*?)\]/)?.[1] ?? '';
  const placeholder = [...placeholderBlock.matchAll(/'([^']+)'/g)]
    .map((match) => match[1])
    .filter((name): name is string => Boolean(name));
  const placeholderSet = new Set(placeholder);

  return {
    implemented: tools.filter((tool) => !placeholderSet.has(tool)),
    placeholder,
  };
};

const getToolInventory = (implementationMap?: AzaLiveAzaImplementationMap) =>
  implementationMap
    ? {
        implemented: implementationMap.mcpTools.implemented,
        placeholder: implementationMap.mcpTools.placeholder,
      }
    : extractAzaMcpTools();

const parseSseJson = (raw: string): JsonRecord => {
  const dataLine = raw.split('\n').find((line) => line.startsWith('data: '));

  if (!dataLine) return {};

  try {
    return getRecord(JSON.parse(dataLine.slice(6)));
  } catch {
    return {};
  }
};

const parseToolText = (result: JsonRecord) => {
  const content = recordArray(result.content);
  const firstText = text(content[0]?.text);

  return firstText ? parseJsonRecord(firstText) : null;
};

const arrayCount = (value: unknown) => (Array.isArray(value) ? value.length : null);

const classifyToolResult = ({
  name,
  parsed,
}: {
  name: string;
  parsed: JsonRecord | null;
}): { recordCount: number | null; resultKind: McpToolResultKind } => {
  if (!parsed) return { recordCount: null, resultKind: 'unknown' };
  if (parsed.status === 'not_implemented_yet') return { recordCount: 0, resultKind: 'placeholder' };
  if (parsed.error === 'not_found') return { recordCount: null, resultKind: 'not_found' };

  if (name === 'search_messages') {
    const count = arrayCount(parsed.messages);

    return { recordCount: count, resultKind: count === 0 ? 'empty' : 'data' };
  }

  if (name === 'search_conversations') {
    const conversationCount = arrayCount(parsed.conversations);
    const messageCount = arrayCount(parsed.messages);
    const count = conversationCount ?? messageCount;

    return { recordCount: count, resultKind: count === 0 ? 'empty' : 'data' };
  }

  const listResultKeys = new Map<string, string>([
    ['list_conversations', 'conversations'],
    ['get_project_context', 'conversations'],
    ['list_projects', 'projects'],
    ['list_tasks', 'tasks'],
    ['list_operating_records', 'records'],
    ['list_handoffs', 'handoffs'],
    ['list_evidence', 'evidence'],
  ]);
  const listResultKey = listResultKeys.get(name);

  if (listResultKey) {
    const count = arrayCount(parsed[listResultKey]);

    return { recordCount: count, resultKind: count === 0 ? 'empty' : 'data' };
  }

  if (parsed.conversation) return { recordCount: 1, resultKind: 'data' };

  return { recordCount: null, resultKind: 'unknown' };
};

const callMcpToolProbe = async ({
  id,
  name,
  sessionId,
}: {
  id: number;
  name: string;
  sessionId: string;
}): Promise<LiveMcpToolCallProbe> => {
  try {
    const call = await postMcp({
      body: {
        id,
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { arguments: IMPLEMENTED_TOOL_PROBE_ARGUMENTS.get(name) ?? {}, name },
      },
      sessionId,
    });
    const toolResult = getRecord(call.json.result);
    const parsed = parseToolText(toolResult);
    const classified = classifyToolResult({ name, parsed });
    const structured = Boolean(parsed);

    return {
      isError: toolResult.isError === true,
      name,
      ok: call.ok && structured,
      recordCount: classified.recordCount,
      resultKind: classified.resultKind,
      structured,
      transportOk: call.ok,
    };
  } catch {
    return {
      isError: false,
      name,
      ok: false,
      recordCount: null,
      resultKind: 'transport_error',
      structured: false,
      transportOk: false,
    };
  }
};

const postMcp = async ({ body, sessionId }: { body: JsonRecord; sessionId?: string }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(AZA_MCP_ENDPOINT, {
      body: JSON.stringify(body),
      cache: 'no-store',
      headers: {
        'accept': 'application/json, text/event-stream',
        'content-type': 'application/json',
        ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
      },
      method: 'POST',
      signal: controller.signal,
    });
    const raw = await response.text();

    return {
      json: parseSseJson(raw),
      ok: response.ok,
      sessionId: response.headers.get('mcp-session-id'),
      status: response.status,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const probeAzaMcpProtocol = async (
  toolInventory: McpToolInventory,
): Promise<LiveMcpProtocolProbe> => {
  try {
    const initialize = await postMcp({
      body: {
        id: 1,
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          capabilities: {},
          clientInfo: { name: 'lobe-aza-readonly-probe', version: '0.0.0' },
          protocolVersion: '2025-03-26',
        },
      },
    });
    const initializeResult = getRecord(initialize.json.result);
    const sessionId = initialize.sessionId ?? undefined;

    if (!initialize.ok || !sessionId) {
      return {
        callListConversationsOk: false,
        conversationCount: null,
        error: 'initialize_failed',
        implementedToolCalls: [],
        implementedToolCallsOk: false,
        implementedToolCallsTotal: toolInventory.implemented.length,
        implementedToolCallsVerified: 0,
        implementedToolsPresent: 0,
        initialized: false,
        placeholderProbeOk: false,
        placeholderToolCall: null,
        placeholderToolsPresent: 0,
        protocolVersion: text(initializeResult.protocolVersion),
        serverName: text(getRecord(initializeResult.serverInfo).name),
        sessionIdPresent: Boolean(sessionId),
        toolsListOk: false,
        toolsTotal: 0,
      };
    }

    await postMcp({
      body: { jsonrpc: '2.0', method: 'notifications/initialized', params: {} },
      sessionId,
    });

    const toolsList = await postMcp({
      body: { id: 2, jsonrpc: '2.0', method: 'tools/list', params: {} },
      sessionId,
    });
    const tools = recordArray(getRecord(toolsList.json.result).tools);
    const toolNames = tools
      .map((tool) => text(tool.name))
      .filter((name): name is string => Boolean(name));
    const implementedSet = new Set(toolInventory.implemented);
    const placeholderSet = new Set(toolInventory.placeholder);
    const implementedToolCalls: LiveMcpToolCallProbe[] = [];
    let nextToolCallId = 3;

    for (const name of toolInventory.implemented) {
      implementedToolCalls.push(
        await callMcpToolProbe({
          id: nextToolCallId,
          name,
          sessionId,
        }),
      );
      nextToolCallId += 1;
    }

    const listConversationsProbe = implementedToolCalls.find(
      (probe) => probe.name === 'list_conversations',
    );
    const placeholderName = toolInventory.placeholder[0];
    const placeholderToolCall = placeholderName
      ? await callMcpToolProbe({
          id: nextToolCallId,
          name: placeholderName,
          sessionId,
        })
      : null;
    const implementedToolCallsVerified = implementedToolCalls.filter((probe) => probe.ok).length;
    const implementedToolCallsOk =
      implementedToolCalls.length === toolInventory.implemented.length &&
      implementedToolCalls.every((probe) => probe.ok);
    const placeholderProbeOk = placeholderToolCall
      ? placeholderToolCall.resultKind === 'placeholder'
      : false;

    return {
      callListConversationsOk: Boolean(listConversationsProbe?.ok),
      conversationCount: listConversationsProbe?.recordCount ?? null,
      error: null,
      implementedToolCalls,
      implementedToolCallsOk,
      implementedToolCallsTotal: toolInventory.implemented.length,
      implementedToolCallsVerified,
      implementedToolsPresent: toolNames.filter((name) => implementedSet.has(name)).length,
      initialized: initialize.ok,
      placeholderProbeOk,
      placeholderToolCall,
      placeholderToolsPresent: toolNames.filter((name) => placeholderSet.has(name)).length,
      protocolVersion: text(initializeResult.protocolVersion),
      serverName: text(getRecord(initializeResult.serverInfo).name),
      sessionIdPresent: true,
      toolsListOk: toolsList.ok,
      toolsTotal: toolNames.length,
    };
  } catch (error) {
    return {
      callListConversationsOk: false,
      conversationCount: null,
      error: error instanceof Error ? error.message : 'unknown_mcp_probe_error',
      implementedToolCalls: [],
      implementedToolCallsOk: false,
      implementedToolCallsTotal: toolInventory.implemented.length,
      implementedToolCallsVerified: 0,
      implementedToolsPresent: 0,
      initialized: false,
      placeholderProbeOk: false,
      placeholderToolCall: null,
      placeholderToolsPresent: 0,
      protocolVersion: null,
      serverName: null,
      sessionIdPresent: false,
      toolsListOk: false,
      toolsTotal: 0,
    };
  }
};

const buildTools = (toolInventory: McpToolInventory): McpToolContract[] => [
  ...toolInventory.implemented.map((name) => ({
    evidence: [AZA_MCP_ENTRYPOINT],
    name,
    role: IMPLEMENTED_TOOL_ROLES.get(name) ?? 'Implemented AzA MCP retrieval tool.',
    status: 'implemented_not_verified' as const,
  })),
  ...toolInventory.placeholder.map((name) => ({
    evidence: [AZA_MCP_ENTRYPOINT],
    name,
    role: 'Reserved tool name in the AzA MCP source; unavailable until implementation proof passes.',
    status: 'blocked_placeholder' as const,
  })),
];

const buildChannels = ({
  clientConfigs,
  readiness,
}: {
  clientConfigs: McpClientConfig[];
  readiness: AzaLiveReadiness;
}): McpToolingChannel[] => {
  const anyClientConfigPresent = clientConfigs.some((config) => config.present);

  return [
    {
      approval: 'Allowed as metadata-only route discovery; tool invocation stays in Codex session.',
      evidence: ['/Users/growthgod/.codex/config.toml', 'current Codex MCP tool namespace'],
      from: 'Codex executor',
      id: 'codex-to-local-mcp-tools',
      status: clientConfigs.some((config) => config.id === 'codex-global-config' && config.present)
        ? 'configured_metadata_only'
        : 'not_present',
      to: 'local MCP servers',
      transport: 'Codex-managed MCP client',
    },
    {
      approval: 'Blocked until AzA MCP is listening and its session initialize/list-tools pass.',
      evidence: ['/aza/live-readiness', '/aza/live-aza-implementation'],
      from: 'LobeHub harness',
      id: 'lobehub-to-aza-mcp',
      status: readiness.summary.liveMcpAvailable ? 'ready_to_probe' : 'blocked',
      to: 'AzA MCP service',
      transport: 'planned HTTP MCP at 127.0.0.1:8788/mcp',
    },
    {
      approval: 'Blocked until API, MCP, and worker prove shared durable store usage.',
      evidence: ['/aza/live-canonical-store', '/aza/live-aza-verification-runbook'],
      from: 'AzA MCP service',
      id: 'aza-mcp-to-canonical-store',
      status: 'blocked',
      to: 'AzA Postgres canonical store',
      transport: 'Postgres store adapter',
    },
    {
      approval: 'Configured clients can be cataloged, but secrets and command args stay excluded.',
      evidence: clientConfigs.filter((config) => config.present).map((config) => config.path),
      from: 'desktop and CLI MCP clients',
      id: 'desktop-clients-to-mcp-presets',
      status: anyClientConfigPresent ? 'metadata_only' : 'not_present',
      to: 'MCP server presets',
      transport: 'client-specific config files',
    },
  ];
};

const buildProofSteps = ({
  clientConfigs,
  readiness,
  toolInventory,
}: {
  clientConfigs: McpClientConfig[];
  readiness: AzaLiveReadiness;
  toolInventory: McpToolInventory;
}): McpProofStep[] => [
  {
    evidenceNeeded: ['Codex-side tool list', 'server names from safe config metadata'],
    id: 'catalog_codex_mcp_clients',
    status: clientConfigs.some((config) => config.id === 'codex-global-config' && config.present)
      ? 'metadata_only'
      : 'not_present',
    title: 'Catalog Codex-visible MCP clients without exposing config values',
  },
  {
    evidenceNeeded: ['GET /health on 127.0.0.1:8788', 'GET /ready on 127.0.0.1:8788'],
    id: 'verify_aza_mcp_health',
    status: readiness.summary.liveMcpAvailable ? 'ready_to_probe' : 'blocked',
    title: 'Verify AzA MCP service health',
  },
  {
    evidenceNeeded: ['MCP initialize response', 'MCP session id', 'tool list response'],
    id: 'verify_aza_mcp_session',
    status: readiness.summary.liveMcpAvailable ? 'ready_to_probe' : 'blocked',
    title: 'Initialize the AzA MCP session and list tools',
  },
  {
    evidenceNeeded: toolInventory.implemented.map((tool) => `call ${tool}`),
    id: 'verify_implemented_retrieval_tools',
    status: readiness.summary.liveMcpAvailable ? 'ready_to_probe' : 'blocked',
    title: 'Call each implemented AzA MCP retrieval tool',
  },
  {
    evidenceNeeded: toolInventory.placeholder.map((tool) => `prove ${tool} unavailable`),
    id: 'verify_placeholders_blocked',
    status: 'planned',
    title: 'Prove placeholder MCP tools remain unavailable',
  },
  {
    evidenceNeeded: [
      'API record visible through MCP',
      'MCP record visible through API',
      'same durable Postgres store evidence',
    ],
    id: 'verify_api_mcp_shared_store',
    status: 'blocked',
    title: 'Verify API and MCP use the same canonical store',
  },
];

export const getAzaLiveMcpToolingMap = async ({
  implementationMap,
  readiness,
}: {
  implementationMap?: AzaLiveAzaImplementationMap;
  readiness?: AzaLiveReadiness;
} = {}): Promise<AzaLiveMcpToolingMap> => {
  const [liveReadiness, toolInventory, clientConfigs] = await Promise.all([
    readiness ?? getAzaLiveReadiness(),
    getToolInventory(implementationMap),
    Promise.all(CLIENT_CONFIGS.map(readClientConfig)),
  ]);
  const protocolProbe = liveReadiness.summary.liveMcpAvailable
    ? await probeAzaMcpProtocol(toolInventory)
    : {
        callListConversationsOk: false,
        conversationCount: null,
        error: 'aza_mcp_not_healthy',
        implementedToolCalls: [],
        implementedToolCallsOk: false,
        implementedToolCallsTotal: toolInventory.implemented.length,
        implementedToolCallsVerified: 0,
        implementedToolsPresent: 0,
        initialized: false,
        placeholderProbeOk: false,
        placeholderToolCall: null,
        placeholderToolsPresent: 0,
        protocolVersion: null,
        serverName: null,
        sessionIdPresent: false,
        toolsListOk: false,
        toolsTotal: 0,
      };
  const tools = buildTools(toolInventory);
  const toolingChannels = buildChannels({
    clientConfigs,
    readiness: liveReadiness,
  });
  const proofSteps = buildProofSteps({
    clientConfigs,
    readiness: liveReadiness,
    toolInventory,
  });
  const configuredServerNames = uniqueSorted(clientConfigs.flatMap((config) => config.serverNames));

  return {
    clientConfigs,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_mcp_tooling_map',
    proofSteps,
    safety: {
      captured: [
        'MCP config path existence',
        'MCP config file sizes',
        'MCP config modified times',
        'top-level MCP server names',
        'AzA MCP expected service metadata',
        'AzA MCP implemented tool names',
        'AzA MCP placeholder tool names',
        'MCP proof step labels',
        'MCP channel labels',
        'AzA MCP initialize status',
        'AzA MCP tools/list status',
        'AzA MCP tool counts',
        'AzA MCP per-tool structured status',
        'AzA MCP implemented retrieval coverage counts',
        'AzA MCP placeholder status',
        'AzA MCP list_conversations result count',
      ],
      excluded: [
        'MCP command strings',
        'MCP command arguments',
        'environment variable values',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'database contents',
        'tool call payloads',
        'conversation contents',
        'conversation titles',
        'conversation messages',
        'private browser or app contents',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-readiness',
      '/aza/live-aza-implementation',
      '/aza/live-canonical-store',
      '/aza/live-aza-verification-runbook',
      'http://127.0.0.1:8788/mcp',
    ],
    summary: {
      azaMcpHealthy: liveReadiness.summary.liveMcpAvailable,
      blockedProofSteps: proofSteps.filter((step) => step.status === 'blocked').length,
      implementedToolCallsTotal: protocolProbe.implementedToolCallsTotal,
      implementedToolCallsVerified: protocolProbe.implementedToolCallsVerified,
      liveImplementedToolCallOk: protocolProbe.implementedToolCallsOk,
      liveImplementedToolCoverageOk: protocolProbe.implementedToolCallsOk,
      liveMcpInitialized: protocolProbe.initialized && protocolProbe.sessionIdPresent,
      livePlaceholderProbeOk: protocolProbe.placeholderProbeOk,
      liveToolsListOk: protocolProbe.toolsListOk,
      liveToolsTotal: protocolProbe.toolsTotal,
      clientConfigFiles: clientConfigs.length,
      clientConfigsPresent: clientConfigs.filter((config) => config.present).length,
      configuredServerNames: configuredServerNames.length,
      implementedTools: toolInventory.implemented.length,
      placeholderTools: toolInventory.placeholder.length,
      readyToProbeSteps: proofSteps.filter((step) => step.status === 'ready_to_probe').length,
      toolingChannels: toolingChannels.length,
      writesAllowed: false,
    },
    protocolProbe,
    toolingChannels,
    tools,
  };
};
