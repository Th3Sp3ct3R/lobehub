import {
  type AzaLiveAccessCapabilityMap,
  getAzaLiveAccessCapabilityMap,
} from './liveAccessCapabilityMap';
import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import { type AzaLiveCodexHarnessMap, getAzaLiveCodexHarnessMap } from './liveCodexHarnessMap';
import {
  type AzaLiveContentAppAuditMap,
  getAzaLiveContentAppAuditMap,
} from './liveContentAppAuditMap';
import { type AzaLiveMcpToolingMap, getAzaLiveMcpToolingMap } from './liveMcpToolingMap';

type ToolingStatus =
  | 'approval_required'
  | 'blocked_until_runtime_proof'
  | 'recommended_primary'
  | 'recommended_secondary'
  | 'use_only_for_visual_fallback';

type TaskClass =
  | 'authenticated_web_research'
  | 'browser_session_io'
  | 'device_or_electron_endpoint_capture'
  | 'durable_memory_write'
  | 'file_or_repo_task'
  | 'visual_ui_confirmation';

export type BrowserTaskTool = {
  blockedBy: string[];
  bestFor: TaskClass[];
  evidence: string[];
  id: string;
  limits: string[];
  name: string;
  recommendation: string;
  status: ToolingStatus;
};

export type BrowserTaskRoute = {
  capturePolicy: string;
  id: string;
  inputSurface: string;
  memoryRule: string;
  outputSurface: string;
  preferredToolIds: string[];
  taskClass: TaskClass;
};

export type AzaLiveBrowserTaskToolingMap = {
  generatedAt: string;
  memorySourceOfTruth: {
    canonical: string;
    granular: string;
    projection: string;
    rule: string;
  };
  mode: 'read_only_browser_task_tooling_map';
  recommendation: {
    browserPlugin: string;
    memory: string;
    nextPlanStep: string;
    taskRouting: string;
  };
  routes: BrowserTaskRoute[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    approvalRequiredTools: number;
    memoryWriteReady: false;
    recommendedPrimaryTools: number;
    routeCount: number;
    tools: number;
    writesAllowed: false;
  };
  tools: BrowserTaskTool[];
};

const buildTools = ({
  accessCapabilityMap,
  codexHarnessMap,
  contentAppAuditMap,
  mcpToolingMap,
}: {
  accessCapabilityMap: AzaLiveAccessCapabilityMap;
  codexHarnessMap: AzaLiveCodexHarnessMap;
  contentAppAuditMap: AzaLiveContentAppAuditMap;
  mcpToolingMap: AzaLiveMcpToolingMap;
}): BrowserTaskTool[] => [
  {
    bestFor: ['authenticated_web_research', 'browser_session_io', 'visual_ui_confirmation'],
    blockedBy: [
      'must avoid collecting cookies, raw credentials, private message contents, or account secrets',
      'must capture only task-scoped page metadata and user-approved outputs',
    ],
    evidence: ['/aza/live-access-capability-map', '/aza/live-content-app-audit'],
    id: 'browser_plugin',
    limits: [
      'best for visible web workflows and interactive browser context',
      'not the canonical memory store',
      'not enough for durable task state without AzA records',
    ],
    name: 'Browser Plugin',
    recommendation:
      'Use as the primary browser-session input/output surface when the user wants to operate from authenticated web pages, but route durable facts into AzA records after approval.',
    status: 'recommended_primary',
  },
  {
    bestFor: ['visual_ui_confirmation', 'browser_session_io'],
    blockedBy:
      accessCapabilityMap.summary.approvalRequiredSurfaces > 0
        ? [
            `${accessCapabilityMap.summary.approvalRequiredSurfaces} browser/app surfaces require approval`,
          ]
        : [],
    evidence: ['/aza/live-access-capability-map'],
    id: 'computer_use',
    limits: [
      'use for visual confirmation and UI navigation',
      'avoid raw credential extraction',
      'requires screenshots or structured evidence before promotion',
    ],
    name: 'Computer Use',
    recommendation:
      'Use as a visual fallback or operator-assist layer when Browser Plugin cannot expose the right context.',
    status: 'use_only_for_visual_fallback',
  },
  {
    bestFor: ['device_or_electron_endpoint_capture', 'browser_session_io'],
    blockedBy:
      contentAppAuditMap.summary.approvalRequiredTargets > 0
        ? [
            `${contentAppAuditMap.summary.approvalRequiredTargets} content app targets require approval`,
          ]
        : [],
    evidence: ['/aza/live-content-app-audit'],
    id: 'chrome_cdp_or_electron_rpc',
    limits: [
      'requires explicit approval per app/account/session',
      'captures network shape and endpoint metadata only unless a narrower approval is given',
      'must redact cookies, bearer tokens, and account secrets',
    ],
    name: 'Chrome CDP / Electron RPC',
    recommendation:
      'Use for endpoint discovery and session-associated app workflows after approval; do not make it the default memory path.',
    status: 'approval_required',
  },
  {
    bestFor: ['file_or_repo_task', 'durable_memory_write'],
    blockedBy: mcpToolingMap.summary.azaMcpHealthy ? [] : ['AzA MCP is not verified healthy'],
    evidence: ['/aza/live-mcp-tooling-map'],
    id: 'mcp_tools',
    limits: [
      'excellent for structured retrieval and tool calls',
      'not a browser visibility layer',
      'canonical writes wait for AzA runtime and store proof',
    ],
    name: 'MCP Tools',
    recommendation:
      'Use MCP as the structured tool and retrieval plane; prefer AzA MCP for memory retrieval once healthy.',
    status: mcpToolingMap.summary.azaMcpHealthy
      ? 'recommended_primary'
      : 'blocked_until_runtime_proof',
  },
  {
    bestFor: ['file_or_repo_task', 'durable_memory_write'],
    blockedBy: codexHarnessMap.summary.durableHandoffReady
      ? []
      : ['durable LobeHub-to-Codex handoff records are not ready'],
    evidence: ['/aza/live-codex-harness', '/aza/live-command-record-schema'],
    id: 'codex_executor',
    limits: [
      'best for repo/file edits, command execution, validation, and evidence capture',
      'should receive browser/task context from LobeHub or approved browser sessions',
      'must not become the only memory source',
    ],
    name: 'Codex Executor',
    recommendation:
      'Use Codex for implementation and validation; store outcomes as typed AzA records when canonical writes are enabled.',
    status: 'recommended_primary',
  },
];

const buildRoutes = (): BrowserTaskRoute[] => [
  {
    capturePolicy:
      'Capture page title, URL class, task prompt, selected text, screenshots, and operator notes only after user intent is clear.',
    id: 'browser_to_command_context',
    inputSurface: 'Browser Plugin or manual browser session',
    memoryRule:
      'Draft context first; promote durable facts to AzA only with provenance and sensitivity labels.',
    outputSurface: 'LobeHub command context and Codex task prompt',
    preferredToolIds: ['browser_plugin', 'computer_use', 'codex_executor'],
    taskClass: 'browser_session_io',
  },
  {
    capturePolicy:
      'Prefer first-party API/MCP calls when available; use Browser Plugin only when the authenticated UI is the actual source.',
    id: 'web_research_to_evidence',
    inputSurface: 'Browser Plugin plus MCP/search tools',
    memoryRule: 'Store source URL, retrieval time, claim, confidence, and evidence pointer in AzA.',
    outputSurface: 'Evidence receipt and research note',
    preferredToolIds: ['browser_plugin', 'mcp_tools'],
    taskClass: 'authenticated_web_research',
  },
  {
    capturePolicy:
      'Collect endpoint names, request classes, response shape, and screenshots; redact tokens and avoid state-changing actions.',
    id: 'app_endpoint_capture',
    inputSurface: 'Chrome CDP or Electron RPC after approval',
    memoryRule: 'Store endpoint inventory and redaction proof, not session material.',
    outputSurface: 'App capability record and approval packet',
    preferredToolIds: ['chrome_cdp_or_electron_rpc', 'computer_use'],
    taskClass: 'device_or_electron_endpoint_capture',
  },
  {
    capturePolicy: 'Use repo commands, tests, diffs, and static analysis as primary evidence.',
    id: 'repo_task_execution',
    inputSurface: 'LobeHub task plus Codex executor',
    memoryRule:
      'Store files changed, validation commands, result, blockers, and rollback path as AzA records.',
    outputSurface: 'Codex run, implementation evidence, and delivery roadmap update',
    preferredToolIds: ['codex_executor', 'mcp_tools'],
    taskClass: 'file_or_repo_task',
  },
  {
    capturePolicy:
      'Wait for AzA service, store, MCP, and approval gates before enabling durable writes.',
    id: 'canonical_memory_promotion',
    inputSurface: 'Approved evidence packet',
    memoryRule: 'AzA is canonical; VANTA-Brain receives reviewed projections only.',
    outputSurface:
      'Typed AzA memory, projection request, and VANTA-Brain projection after approval',
    preferredToolIds: ['mcp_tools', 'codex_executor'],
    taskClass: 'durable_memory_write',
  },
];

export const getAzaLiveBrowserTaskToolingMap = async ({
  accessCapabilityMap,
  brainTopologyMap,
  codexHarnessMap,
  contentAppAuditMap,
  mcpToolingMap,
}: {
  accessCapabilityMap?: AzaLiveAccessCapabilityMap;
  brainTopologyMap?: AzaLiveBrainTopologyMap;
  codexHarnessMap?: AzaLiveCodexHarnessMap;
  contentAppAuditMap?: AzaLiveContentAppAuditMap;
  mcpToolingMap?: AzaLiveMcpToolingMap;
} = {}): Promise<AzaLiveBrowserTaskToolingMap> => {
  const [
    liveAccessCapabilityMap,
    liveBrainTopologyMap,
    liveCodexHarnessMap,
    liveContentAppAuditMap,
    liveMcpToolingMap,
  ] = await Promise.all([
    accessCapabilityMap ?? getAzaLiveAccessCapabilityMap(),
    brainTopologyMap ?? getAzaLiveBrainTopologyMap(),
    codexHarnessMap ?? getAzaLiveCodexHarnessMap(),
    contentAppAuditMap ?? getAzaLiveContentAppAuditMap(),
    mcpToolingMap ?? getAzaLiveMcpToolingMap(),
  ]);
  const tools = buildTools({
    accessCapabilityMap: liveAccessCapabilityMap,
    codexHarnessMap: liveCodexHarnessMap,
    contentAppAuditMap: liveContentAppAuditMap,
    mcpToolingMap: liveMcpToolingMap,
  });
  const routes = buildRoutes();

  return {
    generatedAt: new Date().toISOString(),
    memorySourceOfTruth: {
      canonical: 'AzA typed records after service, store, MCP, redaction, and approval gates pass.',
      granular:
        'Codex, Hermes, browser sessions, agents, apps, and MCP clients keep task-local working context.',
      projection:
        'VANTA-Brain receives reviewed, redacted projections after canonical AzA ids exist.',
      rule: liveBrainTopologyMap.recommendedModel.promotionRule,
    },
    mode: 'read_only_browser_task_tooling_map',
    recommendation: {
      browserPlugin:
        'Use Browser Plugin as the preferred authenticated browser input/output surface, not as the memory database.',
      memory:
        'Keep AzA as source of truth for durable memory; keep granular agent/browser/tool context as working state until promoted.',
      nextPlanStep:
        'Add a browser-session intake record type after canonical AzA write gates pass, then map Browser Plugin outputs into that schema.',
      taskRouting:
        'Route browser-visible tasks through Browser Plugin, visual fallbacks through Computer Use, endpoint capture through approved CDP/RPC, implementation through Codex, and durable retrieval through MCP/AzA.',
    },
    routes,
    safety: {
      captured: [
        'tool names',
        'task class labels',
        'recommendation text',
        'status labels',
        'blocked-by labels',
        'evidence route pointers',
        'memory routing rules',
      ],
      excluded: [
        'browser cookies',
        'authorization headers',
        'OAuth tokens',
        'passwords',
        'private page contents',
        'raw screenshots unless separately approved',
        'raw database rows',
        'raw memories',
        'raw sessions',
        'state-changing browser actions',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-access-capability-map',
      '/aza/live-content-app-audit',
      '/aza/live-mcp-tooling-map',
      '/aza/live-codex-harness',
      '/aza/live-brain-topology',
      '/aza/aza-source-of-truth-map.json',
      '/aza/aza-read-write-contract.json',
    ],
    summary: {
      approvalRequiredTools: tools.filter((tool) => tool.status === 'approval_required').length,
      memoryWriteReady: false,
      recommendedPrimaryTools: tools.filter((tool) => tool.status === 'recommended_primary').length,
      routeCount: routes.length,
      tools: tools.length,
      writesAllowed: false,
    },
    tools,
  };
};
