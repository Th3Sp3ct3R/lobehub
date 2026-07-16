import { type AzaLiveBrainTopologyMap, getAzaLiveBrainTopologyMap } from './liveBrainTopologyMap';
import {
  type AzaLiveBrowserTaskToolingMap,
  getAzaLiveBrowserTaskToolingMap,
} from './liveBrowserTaskToolingMap';
import {
  type AzaLiveDailyCommandWorkflowMap,
  getAzaLiveDailyCommandWorkflowMap,
} from './liveDailyCommandWorkflowMap';
import {
  type AzaLiveDeliveryRoadmapMap,
  getAzaLiveDeliveryRoadmapMap,
} from './liveDeliveryRoadmapMap';
import { type AzaLiveMcpToolingMap, getAzaLiveMcpToolingMap } from './liveMcpToolingMap';

type RecommendationPlanStatus =
  | 'adopt_now_read_only'
  | 'approval_required'
  | 'blocked_until_runtime_proof'
  | 'defer_until_canonical_ids'
  | 'planned_after_runtime';

type RecommendationPlanLane =
  | 'browser'
  | 'command'
  | 'implementation'
  | 'memory'
  | 'mcp'
  | 'projection';

export type AzaToolingRecommendationDecision = {
  decision: string;
  evidence: string[];
  id: string;
  lane: RecommendationPlanLane;
  rationale: string;
  status: RecommendationPlanStatus;
};

export type AzaToolingRecommendationPhase = {
  blockedBy: string[];
  evidence: string[];
  id: string;
  lane: RecommendationPlanLane;
  memoryRule: string;
  nextAction: string;
  order: number;
  owner: string;
  status: RecommendationPlanStatus;
  title: string;
  toolIds: string[];
};

export type AzaLiveToolingRecommendationPlanMap = {
  decisions: AzaToolingRecommendationDecision[];
  generatedAt: string;
  memorySourceOfTruth: {
    canonical: string;
    granular: string;
    projection: string;
    rule: string;
  };
  mode: 'read_only_tooling_recommendation_plan_map';
  phases: AzaToolingRecommendationPhase[];
  recommendation: {
    browserPlugin: string;
    firstBuild: string;
    mcp: string;
    memory: string;
    operatingPlan: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    adoptedNowReadOnly: number;
    approvalRequired: number;
    blockedUntilRuntimeProof: number;
    decisions: number;
    deferredUntilCanonicalIds: number;
    phases: number;
    plannedAfterRuntime: number;
    writesAllowed: false;
  };
};

const blockersForTool = (map: AzaLiveBrowserTaskToolingMap, toolId: string) =>
  map.tools.find((tool) => tool.id === toolId)?.blockedBy ?? [`${toolId} is not mapped`];

const buildDecisions = ({
  browserTaskToolingMap,
  mcpToolingMap,
}: {
  browserTaskToolingMap: AzaLiveBrowserTaskToolingMap;
  mcpToolingMap: AzaLiveMcpToolingMap;
}): AzaToolingRecommendationDecision[] => [
  {
    decision: 'Adopt Browser Plugin as the preferred authenticated browser input/output surface.',
    evidence: ['/aza/live-browser-task-tooling-map', '/aza/live-access-capability-map'],
    id: 'adopt_browser_plugin_for_browser_io',
    lane: 'browser',
    rationale:
      'It is the cleanest way to work from visible logged-in pages, but it must capture task-scoped metadata and approved outputs only.',
    status: 'adopt_now_read_only',
  },
  {
    decision: 'Use Computer Use only as a visual fallback and operator-assist layer.',
    evidence: ['/aza/live-browser-task-tooling-map'],
    id: 'limit_computer_use_to_visual_fallback',
    lane: 'browser',
    rationale:
      'Screenshots and visual navigation help when Browser Plugin cannot expose enough context, but visual control is too broad to be the default data path.',
    status: 'adopt_now_read_only',
  },
  {
    decision: 'Require approval before Chrome CDP or Electron RPC endpoint capture.',
    evidence: ['/aza/live-browser-task-tooling-map', '/aza/live-content-app-audit'],
    id: 'gate_cdp_and_electron_rpc',
    lane: 'browser',
    rationale:
      'Endpoint discovery can expose session-adjacent state, so it should capture network shape and metadata only after an explicit app/account/session approval.',
    status: 'approval_required',
  },
  {
    decision: 'Treat MCP as the structured retrieval/tool plane, not the browser visibility layer.',
    evidence: ['/aza/live-mcp-tooling-map'],
    id: 'use_mcp_for_structured_retrieval',
    lane: 'mcp',
    rationale: `MCP config metadata is visible and ${mcpToolingMap.summary.implementedTools} AzA tools are implemented, but AzA MCP health still controls whether this becomes live retrieval.`,
    status: mcpToolingMap.summary.azaMcpHealthy
      ? 'adopt_now_read_only'
      : 'blocked_until_runtime_proof',
  },
  {
    decision: 'Keep Codex as the implementation and validation executor.',
    evidence: ['/aza/live-codex-harness', '/aza/live-daily-command-workflow'],
    id: 'codex_executes_repo_work',
    lane: 'implementation',
    rationale:
      'Codex is the right surface for repo edits, commands, validation, and evidence receipts; it should receive browser/task context rather than own canonical memory.',
    status: 'adopt_now_read_only',
  },
  {
    decision: 'Keep AzA typed records as the durable memory source of truth.',
    evidence: ['/aza/live-brain-topology', '/aza/live-memory-intake-funnel'],
    id: 'aza_is_memory_source_of_truth',
    lane: 'memory',
    rationale: browserTaskToolingMap.memorySourceOfTruth.canonical,
    status: 'blocked_until_runtime_proof',
  },
  {
    decision: 'Project to VANTA-Brain only after canonical AzA IDs and redaction proof exist.',
    evidence: ['/aza/live-vanta-brain-coverage', '/aza/live-command-gates'],
    id: 'defer_vanta_brain_projection',
    lane: 'projection',
    rationale:
      'VANTA-Brain should stay a reviewed human-readable projection vault, not the raw runtime memory store.',
    status: 'defer_until_canonical_ids',
  },
];

const buildPhases = ({
  brainTopologyMap,
  browserTaskToolingMap,
  dailyCommandWorkflowMap,
  deliveryRoadmapMap,
  mcpToolingMap,
}: {
  brainTopologyMap: AzaLiveBrainTopologyMap;
  browserTaskToolingMap: AzaLiveBrowserTaskToolingMap;
  dailyCommandWorkflowMap: AzaLiveDailyCommandWorkflowMap;
  deliveryRoadmapMap: AzaLiveDeliveryRoadmapMap;
  mcpToolingMap: AzaLiveMcpToolingMap;
}): AzaToolingRecommendationPhase[] => [
  {
    blockedBy: [],
    evidence: ['/aza/live-daily-command-workflow', '/aza/live-delivery-roadmap'],
    id: 'keep_lobehub_as_command_plan_surface',
    lane: 'command',
    memoryRule: dailyCommandWorkflowMap.recommendation.memoryRule,
    nextAction: dailyCommandWorkflowMap.recommendation.currentLoop,
    order: 1,
    owner: 'Command lead',
    status: 'adopt_now_read_only',
    title: 'Use LobeHub as the plan and command-context surface',
    toolIds: ['lobehub_harness', 'codex_executor'],
  },
  {
    blockedBy: blockersForTool(browserTaskToolingMap, 'browser_plugin'),
    evidence: ['/aza/live-browser-task-tooling-map'],
    id: 'browser_plugin_context_intake',
    lane: 'browser',
    memoryRule:
      'Capture task-scoped page metadata, selected text, screenshots, and operator notes first; promote durable claims only with provenance.',
    nextAction:
      'Add a browser-session intake record type after canonical AzA write gates pass, then map Browser Plugin outputs into it.',
    order: 2,
    owner: 'Command lead',
    status: 'adopt_now_read_only',
    title: 'Route authenticated browser context through Browser Plugin',
    toolIds: ['browser_plugin', 'computer_use'],
  },
  {
    blockedBy: blockersForTool(browserTaskToolingMap, 'chrome_cdp_or_electron_rpc'),
    evidence: ['/aza/live-content-app-audit', '/aza/live-approval-packet'],
    id: 'approve_endpoint_capture',
    lane: 'browser',
    memoryRule: 'Store endpoint inventory and redaction proof, never cookies or session material.',
    nextAction:
      'Ask for a narrow approval packet before CDP/RPC endpoint capture for any specific app/account/session.',
    order: 3,
    owner: 'Human operator',
    status: 'approval_required',
    title: 'Gate Chrome CDP and Electron RPC endpoint capture',
    toolIds: ['chrome_cdp_or_electron_rpc'],
  },
  {
    blockedBy: mcpToolingMap.summary.azaMcpHealthy ? [] : ['AzA MCP is not verified healthy'],
    evidence: ['/aza/live-mcp-tooling-map', '/aza/live-aza-verification-runbook'],
    id: 'verify_mcp_retrieval_tools',
    lane: 'mcp',
    memoryRule:
      'Use MCP for structured retrieval and tool calls after health proof; keep placeholders unavailable.',
    nextAction:
      'After runtime approval, list MCP tools and call only safe retrieval tools with evidence receipts.',
    order: 4,
    owner: 'Knowledge lead',
    status: mcpToolingMap.summary.azaMcpHealthy
      ? 'adopt_now_read_only'
      : 'blocked_until_runtime_proof',
    title: 'Verify MCP retrieval before relying on it',
    toolIds: ['mcp_tools'],
  },
  {
    blockedBy:
      deliveryRoadmapMap.summary.blockedByRuntimeMilestones > 0
        ? [
            `${deliveryRoadmapMap.summary.blockedByRuntimeMilestones} roadmap milestones are runtime-blocked`,
          ]
        : [],
    evidence: ['/aza/live-codex-harness', '/aza/live-command-record-schema'],
    id: 'codex_execution_with_evidence',
    lane: 'implementation',
    memoryRule:
      'Store files changed, validation commands, output, blockers, and rollback labels as AzA records after canonical write gates pass.',
    nextAction:
      'Keep using Codex for implementation and validation while LobeHub remains the operator command context.',
    order: 5,
    owner: 'Engineering lead',
    status: 'adopt_now_read_only',
    title: 'Keep Codex as implementation executor with evidence',
    toolIds: ['codex_executor'],
  },
  {
    blockedBy: brainTopologyMap.summary.canonicalWritesAllowed
      ? []
      : ['canonical AzA writes are not allowed yet'],
    evidence: ['/aza/live-brain-topology', '/aza/live-memory-intake-funnel'],
    id: 'promote_to_aza_memory',
    lane: 'memory',
    memoryRule: brainTopologyMap.recommendedModel.promotionRule,
    nextAction:
      'Enable durable promotion only after service, store, MCP, schema, redaction, and approval gates pass.',
    order: 6,
    owner: 'Knowledge lead',
    status: brainTopologyMap.summary.canonicalWritesAllowed
      ? 'planned_after_runtime'
      : 'blocked_until_runtime_proof',
    title: 'Promote verified facts into canonical AzA memory',
    toolIds: ['aza_memory', 'mcp_tools', 'codex_executor'],
  },
  {
    blockedBy: brainTopologyMap.summary.projectionWritesAllowed
      ? []
      : ['VANTA-Brain projection writes are not allowed yet'],
    evidence: ['/aza/live-vanta-brain-coverage', '/aza/aza-read-write-contract.json'],
    id: 'project_reviewed_summaries_to_vanta_brain',
    lane: 'projection',
    memoryRule: 'Project reviewed, redacted summaries only after canonical AzA IDs exist.',
    nextAction:
      'Keep VANTA-Brain read-only until canonical IDs, redaction proof, and exact destination approval exist.',
    order: 7,
    owner: 'Human operator',
    status: 'defer_until_canonical_ids',
    title: 'Defer VANTA-Brain projection until canonical proof',
    toolIds: ['aza_memory', 'vanta_brain_projection'],
  },
];

export const getAzaLiveToolingRecommendationPlanMap = async ({
  brainTopologyMap,
  browserTaskToolingMap,
  dailyCommandWorkflowMap,
  deliveryRoadmapMap,
  mcpToolingMap,
}: {
  brainTopologyMap?: AzaLiveBrainTopologyMap;
  browserTaskToolingMap?: AzaLiveBrowserTaskToolingMap;
  dailyCommandWorkflowMap?: AzaLiveDailyCommandWorkflowMap;
  deliveryRoadmapMap?: AzaLiveDeliveryRoadmapMap;
  mcpToolingMap?: AzaLiveMcpToolingMap;
} = {}): Promise<AzaLiveToolingRecommendationPlanMap> => {
  const liveBrainTopologyMap = brainTopologyMap ?? (await getAzaLiveBrainTopologyMap());
  const liveMcpToolingMap = mcpToolingMap ?? (await getAzaLiveMcpToolingMap());
  const liveBrowserTaskToolingMap =
    browserTaskToolingMap ?? (await getAzaLiveBrowserTaskToolingMap());
  const liveDailyCommandWorkflowMap =
    dailyCommandWorkflowMap ?? (await getAzaLiveDailyCommandWorkflowMap());
  const liveDeliveryRoadmapMap = deliveryRoadmapMap ?? (await getAzaLiveDeliveryRoadmapMap());
  const decisions = buildDecisions({
    browserTaskToolingMap: liveBrowserTaskToolingMap,
    mcpToolingMap: liveMcpToolingMap,
  });
  const phases = buildPhases({
    brainTopologyMap: liveBrainTopologyMap,
    browserTaskToolingMap: liveBrowserTaskToolingMap,
    dailyCommandWorkflowMap: liveDailyCommandWorkflowMap,
    deliveryRoadmapMap: liveDeliveryRoadmapMap,
    mcpToolingMap: liveMcpToolingMap,
  });

  return {
    decisions,
    generatedAt: new Date().toISOString(),
    memorySourceOfTruth: {
      canonical: liveBrowserTaskToolingMap.memorySourceOfTruth.canonical,
      granular: liveBrowserTaskToolingMap.memorySourceOfTruth.granular,
      projection: liveBrowserTaskToolingMap.memorySourceOfTruth.projection,
      rule: liveBrainTopologyMap.recommendedModel.promotionRule,
    },
    mode: 'read_only_tooling_recommendation_plan_map',
    phases,
    recommendation: {
      browserPlugin:
        'Use Browser Plugin first for authenticated browser context; use Computer Use only when visual confirmation is needed.',
      firstBuild:
        'The next build artifact is a browser-session intake record type, but it waits behind canonical AzA write gates.',
      mcp: liveMcpToolingMap.summary.azaMcpHealthy
        ? 'MCP can be treated as ready for structured retrieval proof.'
        : 'MCP remains planned for structured retrieval until AzA MCP health is verified.',
      memory:
        'AzA typed records are the durable source of truth; granular tool and agent sessions are working context until promoted.',
      operatingPlan:
        'Keep LobeHub as plan surface, Codex as executor, Browser Plugin as browser IO, MCP as structured retrieval, AzA as canonical memory, and VANTA-Brain as reviewed projection.',
    },
    safety: {
      captured: [
        'decision labels',
        'phase labels',
        'tool ids',
        'status labels',
        'owner labels',
        'evidence route pointers',
        'memory policy text',
        'blocked-by labels',
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
        'raw skill bodies',
        'raw tool payloads',
        'state-changing browser actions',
        'VAN writes',
        'VANTA-Brain writes',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/live-browser-task-tooling-map',
      '/aza/live-mcp-tooling-map',
      '/aza/live-daily-command-workflow',
      '/aza/live-delivery-roadmap',
      '/aza/live-brain-topology',
      '/aza/live-memory-intake-funnel',
      '/aza/live-vanta-brain-coverage',
      '/aza/aza-read-write-contract.json',
    ],
    summary: {
      adoptedNowReadOnly: phases.filter((phase) => phase.status === 'adopt_now_read_only').length,
      approvalRequired: phases.filter((phase) => phase.status === 'approval_required').length,
      blockedUntilRuntimeProof: phases.filter(
        (phase) => phase.status === 'blocked_until_runtime_proof',
      ).length,
      decisions: decisions.length,
      deferredUntilCanonicalIds: phases.filter(
        (phase) => phase.status === 'defer_until_canonical_ids',
      ).length,
      phases: phases.length,
      plannedAfterRuntime: phases.filter((phase) => phase.status === 'planned_after_runtime')
        .length,
      writesAllowed: false,
    },
  };
};
