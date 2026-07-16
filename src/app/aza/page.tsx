import {
  type AzaLiveAccessCapabilityMap,
  getAzaLiveAccessCapabilityMap,
} from './_lib/liveAccessCapabilityMap';
import {
  type AzaLiveAgentAccessMatrixMap,
  getAzaLiveAgentAccessMatrixMap,
} from './_lib/liveAgentAccessMatrixMap';
import { type AzaLiveAgentFleetMap, getAzaLiveAgentFleetMap } from './_lib/liveAgentFleetMap';
import { type AzaLiveAppMap, getAzaLiveAppMap } from './_lib/liveAppMap';
import {
  type AzaLiveApprovalPacketMap,
  getAzaLiveApprovalPacketMap,
} from './_lib/liveApprovalPacketMap';
import {
  type AzaLiveArchitectureDataFlowMap,
  getAzaLiveArchitectureDataFlowMap,
} from './_lib/liveArchitectureDataFlowMap';
import {
  type AzaLiveAzaImplementationMap,
  getAzaLiveAzaImplementationMap,
} from './_lib/liveAzaImplementationMap';
import {
  type AzaLiveVerificationRunbookMap,
  getAzaLiveVerificationRunbookMap,
} from './_lib/liveAzaVerificationRunbookMap';
import {
  type AzaLiveBrainTopologyMap,
  getAzaLiveBrainTopologyMap,
} from './_lib/liveBrainTopologyMap';
import {
  type AzaLiveBrowserTaskToolingMap,
  getAzaLiveBrowserTaskToolingMap,
} from './_lib/liveBrowserTaskToolingMap';
import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './_lib/liveCanonicalStoreMap';
import { type AzaLiveCodexHarnessMap, getAzaLiveCodexHarnessMap } from './_lib/liveCodexHarnessMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './_lib/liveCommandGateMap';
import {
  type AzaLiveCommandRecordSchemaMap,
  getAzaLiveCommandRecordSchemaMap,
} from './_lib/liveCommandRecordSchemaMap';
import {
  type AzaLiveCommunicationProtocolMap,
  getAzaLiveCommunicationProtocolMap,
} from './_lib/liveCommunicationProtocolMap';
import {
  type AzaLiveContentAppAuditMap,
  getAzaLiveContentAppAuditMap,
} from './_lib/liveContentAppAuditMap';
import {
  type AzaLiveContentAppMetadataCollectionPlanMap,
  getAzaLiveContentAppMetadataCollectionPlanMap,
} from './_lib/liveContentAppMetadataCollectionPlanMap';
import { type AzaLiveContentOpsMap, getAzaLiveContentOpsMap } from './_lib/liveContentOpsMap';
import {
  type AzaLiveCurrentGoalStatusReportMap,
  getAzaLiveCurrentGoalStatusReportMap,
} from './_lib/liveCurrentGoalStatusReportMap';
import {
  type AzaLiveDailyCommandWorkflowMap,
  getAzaLiveDailyCommandWorkflowMap,
} from './_lib/liveDailyCommandWorkflowMap';
import {
  type AzaLiveDeliveryRoadmapMap,
  getAzaLiveDeliveryRoadmapMap,
} from './_lib/liveDeliveryRoadmapMap';
import {
  type AzaLiveExecutionSequenceMap,
  getAzaLiveExecutionSequenceMap,
} from './_lib/liveExecutionSequenceMap';
import {
  type AzaLiveGoalCompletionAuditMap,
  getAzaLiveGoalCompletionAuditMap,
} from './_lib/liveGoalCompletionAuditMap';
import { type AzaLiveGtmMap, getAzaLiveGtmMap } from './_lib/liveGtmMap';
import {
  type AzaLiveGtmTeamOperatingStatusMap,
  getAzaLiveGtmTeamOperatingStatusMap,
} from './_lib/liveGtmTeamOperatingStatusMap';
import {
  type AzaLiveImplementationProofMap,
  getAzaLiveImplementationProofMap,
} from './_lib/liveImplementationProofMap';
import { type AzaLiveMcpToolingMap, getAzaLiveMcpToolingMap } from './_lib/liveMcpToolingMap';
import {
  type AzaLiveMemoryIntakeFunnelMap,
  getAzaLiveMemoryIntakeFunnelMap,
} from './_lib/liveMemoryIntakeFunnelMap';
import { type AzaLiveMemoryMap, getAzaLiveMemoryMap } from './_lib/liveMemoryMap';
import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './_lib/liveOperatingBoard';
import {
  type AzaLiveOwnershipResolutionMap,
  getAzaLiveOwnershipResolutionMap,
} from './_lib/liveOwnershipResolutionMap';
import { type AzaLiveProjectMap, getAzaLiveProjectMap } from './_lib/liveProjectMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './_lib/liveReadiness';
import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './_lib/liveServiceMap';
import { type AzaLiveSyncStatusMap, getAzaLiveSyncStatusMap } from './_lib/liveSyncStatusMap';
import { type AzaLiveSystemMap, getAzaLiveSystemMap } from './_lib/liveSystemMap';
import {
  type AzaLiveTeamDataRoutingMap,
  getAzaLiveTeamDataRoutingMap,
} from './_lib/liveTeamDataRoutingMap';
import {
  type AzaLiveToolingRecommendationPlanMap,
  getAzaLiveToolingRecommendationPlanMap,
} from './_lib/liveToolingRecommendationPlanMap';
import {
  type AzaLiveVantaBrainCoverageMap,
  getAzaLiveVantaBrainCoverageMap,
} from './_lib/liveVantaBrainCoverageMap';
import {
  type AzaLiveWorkspaceRootReconciliationMap,
  getAzaLiveWorkspaceRootReconciliationMap,
} from './_lib/liveWorkspaceRootReconciliationMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const roots = [
  {
    detail:
      'Active project and runtime root for AzA, InstaGrowth, Suno, Engine, Hermes UI, and device adapters.',
    label: '/Users/growthgod/VAN',
    meta: 'Project root',
  },
  {
    detail:
      'Canonical AzA memory system for capture, normalization, search, MCP retrieval, and projection.',
    label: '/Users/growthgod/VAN/aza_memory',
    meta: 'Brain service',
  },
  {
    detail:
      'Command-center harness fork on branch AzA. This page is the first read-only operator surface.',
    label: '/Users/growthgod/lobehub',
    meta: 'Command harness',
  },
  {
    detail:
      'Readable Obsidian vault for decisions, projections, session exports, and pointers. Not a runtime source.',
    label: '/Users/growthgod/Documents/VANTA-Brain',
    meta: 'Projection vault',
  },
];

const memory = [
  [
    'AzA Postgres and MCP',
    'Canonical target',
    'Planned canonical store. Postgres-backed implementation has started, but current validation is not green.',
  ],
  [
    'Codex local state',
    '~/.codex',
    'Goals, logs, rollout summaries, skills, plugins, worktrees, and local execution state.',
  ],
  [
    'Hermes runtime',
    '~/.hermes',
    'Agents, skills, sessions, kanban, response store, and verification evidence.',
  ],
  [
    'LobeHub cloud plus local storage',
    'Connected app state',
    'Cloud sync is active; local app state is not canonical memory.',
  ],
];

const harnessRoles = [
  [
    'LobeHub',
    'Harness / command surface',
    'Owns the operator UI, approvals, boards, routed intents, and command context for AzA.',
  ],
  [
    'Codex',
    'Coding agent / executor',
    'Executes codebase inspection, implementation, terminal commands, validation, browser checks, and evidence capture inside the harness.',
  ],
  [
    'AzA',
    'Canonical brain',
    'Stores durable typed records, provenance, permissions, indexes, verification status, and projection history.',
  ],
  [
    'VANTA-Brain',
    'Projection vault',
    'Receives reviewed markdown summaries and decisions after AzA has canonical records and evidence.',
  ],
  [
    'Computer adapters',
    'Desktop access layer',
    'Expose running apps, browser surfaces, and device controls to the harness under read-only and approval-first rules.',
  ],
];

const commandCenterPlacement = [
  [
    'Current route',
    '/aza',
    'The Next command index and SPA route are both currently registered at /aza. This remains the live operator entrypoint.',
  ],
  [
    'Operations target',
    'not found',
    'Current router, route directory, and locale searches show operations as task/content lane language, not as a concrete route group to move under.',
  ],
  [
    'Metatron target',
    'not found',
    'Metatron appears as an agent/command lane reference, but there is no Metatron route or page container in the current LobeHub route surface.',
  ],
  [
    'Placement decision',
    'keep /aza',
    'Do not invent a new Operations or Metatron destination. Move the command center only after that target route exists and is explicitly owned.',
  ],
];

const machineSurfaces = [
  [
    'Human operator shell',
    '/Users/growthgod',
    'The desktop account owns the repo roots, app configs, browser profiles, agent runtimes, local databases, and generated artifacts.',
  ],
  [
    'Application layer',
    '/Applications and ~/Applications',
    'Electron, native macOS, browser, voice, content, coding, and device-control apps are tools that produce or consume artifacts.',
  ],
  [
    'Code and service layer',
    'Repo roots and ports',
    'VAN projects, LobeHub, Hermes UI, AzA services, local Next servers, Express APIs, and MCP servers communicate through HTTP, files, DBs, and CLIs.',
  ],
  [
    'Agent runtime layer',
    '~/.codex, ~/.agents, ~/.hermes',
    'Codex, skills, Hermes agents, sessions, kanban, and verification stores are execution state and evidence sources, not all canonical memory.',
  ],
  [
    'Knowledge projection layer',
    'VANTA-Brain',
    'Obsidian-readable markdown should be a curated projection from verified sources, not the place where raw app state or secrets are stored.',
  ],
  [
    'Device and browser layer',
    'Chrome, Electron, DuoPlus, GeeLark, VMOSCloud',
    'Logged-in sessions and cloud devices are controlled access surfaces. They need explicit boundaries before automation writes, posts, or changes accounts.',
  ],
];

const brainModel = [
  [
    'Hybrid brain model',
    'Recommended',
    'Use one canonical AzA brain for durable memory, plus scoped per-agent skills, prompts, tools, and session overlays.',
  ],
  [
    'Unified knowledge base',
    'Global layer',
    'Shared facts, architecture decisions, source inventories, GTM strategy, customer evidence, and verification results.',
  ],
  [
    'Agent-specific memory',
    'Scoped layer',
    'Each agent keeps role-specific skills and working context, but durable facts are promoted back into AzA with provenance.',
  ],
  [
    'Access segmentation',
    'Control layer',
    'Organize records by agent, project, session, source, sensitivity, and allowed readers instead of copying separate brains.',
  ],
];

const communicationPaths = [
  [
    'Codex coding agent to filesystem',
    'Read, edit, validate',
    'Codex executes repo inspection, edits, shell commands, screenshots, and validation from inside the LobeHub harness, then writes only to approved paths.',
  ],
  [
    'LobeHub harness to AzA',
    'Command surface to memory API',
    'The target flow is LobeHub reads indexed architecture from AzA and submits approved write intents through explicit adapters.',
  ],
  [
    'AzA to VANTA-Brain',
    'Canonical to projection',
    'AzA should emit reviewed markdown summaries, indexes, and decisions into the vault after evidence exists and sensitivity is checked.',
  ],
  [
    'Hermes to AzA',
    'Runtime to durable knowledge',
    'Hermes sessions, agent outputs, kanban events, and verification evidence should promote durable facts into AzA with agent and session provenance.',
  ],
  [
    'Content apps to artifacts',
    'Generation to registry',
    'Browser and Electron apps export images, video, audio, docs, transcripts, and screenshots that AzA should register with source app and campaign context.',
  ],
  [
    'Device adapters to evidence',
    'Automation to audit trail',
    'DuoPlus, GeeLark, VMOSCloud, and browser automation should write screenshots, logs, and status records before any campaign or account-changing action.',
  ],
];

const storageBoundaries = [
  [
    'Process memory',
    'Volatile',
    'Runtime RAM, model context, browser tabs, terminals, and agent working state vanish or drift. Promote only verified facts into durable records.',
  ],
  [
    'Filesystem',
    'Durable but scattered',
    'Repos, app configs, downloads, exports, logs, screenshots, and local notes are authoritative only for their own path and timestamp.',
  ],
  [
    'Local databases',
    'Operational state',
    'SQLite, Postgres, browser stores, and app databases may hold tasks, sessions, chats, and indexes. They need schema-aware adapters instead of ad hoc copying.',
  ],
  [
    'Canonical memory',
    'AzA target',
    'AzA should own typed memory records, provenance, permissions, embeddings, graph links, verification status, and projection history.',
  ],
  [
    'Search indexes',
    'Derived state',
    'Vector, graph, codebase-memory, and app indexes should be reproducible from canonical sources or clearly labeled as cached snapshots.',
  ],
  [
    'Secrets and auth',
    'Pointer-only',
    'Keys, cookies, OAuth tokens, passwords, and raw credentials stay in existing auth stores or env vars. AzA stores labels and rotation metadata only.',
  ],
];

const dataFlow = [
  [
    'Capture',
    'Inputs',
    'Codex sessions, Hermes logs, app exports, project docs, meeting notes, GTM docs, device evidence, and manual decisions.',
  ],
  [
    'Normalize',
    'AzA ingest',
    'Convert sources into typed records: project, agent, session, artifact, credential pointer, decision, task, evidence.',
  ],
  [
    'Index',
    'Brain store',
    'Store canonical records in AzA Postgres/vector/MCP with source path, timestamp, owner, sensitivity, and retrieval tags.',
  ],
  [
    'Project',
    'Readable vault',
    'Emit curated markdown projections into VANTA-Brain only after validation; keep secrets and raw tokens out.',
  ],
  [
    'Command',
    'LobeHub harness',
    'Use LobeHub as the AzA command harness to browse architecture, ask routed questions, approve writes, and trigger verified workflows.',
  ],
  [
    'Verify',
    'Codex coding agent',
    'Codex is the coding executor: inspect real paths, run checks, update implementation, and attach evidence before claims.',
  ],
];

const writeControls = [
  [
    'Read-only first',
    'Default posture',
    'Every new adapter starts by reading and reporting current state before it can write, sync, post, message, buy, delete, or modify accounts.',
  ],
  [
    'Path approval',
    'Filesystem guard',
    'Writes to VAN, LobeHub, VANTA-Brain, auth stores, browser profiles, and app data should show destination, reason, rollback, and evidence first.',
  ],
  [
    'Credential safety',
    'Secret guard',
    'Never print, paste, index, commit, or project raw tokens, cookies, API keys, OAuth credentials, recovery codes, or customer credentials.',
  ],
  [
    'Browser and device consent',
    'Action guard',
    'Logged-in browser and device sessions can inspect state, but posting, following, messaging, purchasing, or changing accounts requires explicit approval.',
  ],
  [
    'Promotion review',
    'Memory guard',
    'Agent session details become global knowledge only after dedupe, source attribution, sensitivity labeling, and conflict checks.',
  ],
  [
    'Verification required',
    'Evidence guard',
    'A record is current only if there is recent command output, file evidence, screenshot, health response, database row, or API response behind it.',
  ],
];

const sourceTruth = [
  [
    'Code and runtimes',
    '/Users/growthgod/VAN',
    'Primary location for active services, product repos, agents, device adapters, and backend implementation work.',
  ],
  [
    'Command layer',
    '/Users/growthgod/lobehub',
    'AzA operator harness and final command context. It should read status first and write only through explicit approved actions.',
  ],
  [
    'Brain layer',
    '/Users/growthgod/VAN/aza_memory',
    'Canonical memory and retrieval system. This should own durable indexing, graph lookup, and MCP access control.',
  ],
  [
    'Human-readable layer',
    '/Users/growthgod/Documents/VANTA-Brain',
    'Projection vault for reviewed notes, decisions, docs, and exports. It should not be the raw runtime memory database.',
  ],
  [
    'Agent runtime',
    '~/.hermes',
    'Operational agent fleet, skills, sessions, kanban, and runtime logs. Promote durable knowledge into AzA instead of relying on logs.',
  ],
  [
    'Coding agent state',
    '~/.codex',
    'Codex goals, worktrees, skills, rollout summaries, and verification traces. Treat this as coding-agent evidence and local execution state.',
  ],
];

const health = [
  [
    'LobeHub daemon',
    'ok',
    'Daemon status previously reported connected to the official device gateway.',
  ],
  [
    'Lobe export path',
    'blocked',
    'The CLI package exists, but no lobehub binary is available on PATH.',
  ],
  ['AzA services', 'warn', 'Planned ports 8786-8790 were not listening during inspection.'],
  [
    'VANTA-Brain sync',
    'warn',
    'Sync scripts exist, but logs showed rebase failures and stale Desktop/VAN pointers.',
  ],
  [
    'Local preview',
    'warn',
    'Root LobeHub pages still require KEY_VAULTS_SECRET and database env in this shell.',
  ],
];

const teamLanes = [
  [
    'CEO / command',
    'LobeHub harness + Metatron',
    'Route tasks, decide ownership, approve writes, preserve evidence, and keep the command-center map current. Codex executes coding tasks inside this flow.',
  ],
  [
    'Engineering',
    'Codex coding agent + repo agents',
    'Build AzA memory, LobeHub command surfaces, backend services, MCP tools, and validation harnesses.',
  ],
  [
    'Growth and GTM',
    'Strategy + sales agents',
    'Own emergency agency revenue, paid pilot cohort, offer testing, lead lists, outreach, and customer proof.',
  ],
  [
    'Content production',
    'Generation apps',
    'Coordinate AI writing, image/video generation, editing, transcription, publishing, and asset provenance.',
  ],
  [
    'Fleet operations',
    'Hermes + device lane',
    'Manage DuoPlus, GeeLark, VMOSCloud, accounts, device evidence, automation boundaries, and safety approvals.',
  ],
  [
    'Knowledge operations',
    'AzA + VANTA-Brain',
    'Review what gets promoted into canonical memory, what gets projected to markdown, and what remains private runtime state.',
  ],
];

const lanes = [
  [
    'Generation',
    'AI apps',
    'ChatGPT Atlas, Gemini, Claude, Kimi, MiniMax Hub, Qwen, OpenHuman, Ollama.',
  ],
  [
    'Editing and publishing',
    'Content tools',
    'Descript, CapCut Web, VLC, Google Slides, Google Docs.',
  ],
  [
    'Voice and transcription',
    'Audio tools',
    'PPQ Whisper, VoiceInk, Wispr Flow, Willow Voice, Voice Memos.',
  ],
  [
    'Device and operations',
    'Execution lane',
    'DuoPlus, GeeLark, VMOSCloud, Telegram, Discord, Slack, WhatsApp, Notion, Linear.',
  ],
];

const nextGates = [
  [
    'Make source inventory live',
    'Next build step',
    'Replace static cards with read-only status adapters that inspect paths, services, launch agents, and sync health.',
  ],
  [
    'Repair AzA validation',
    'Brain gate',
    'Fix AzA typecheck and start API/MCP services before letting LobeHub write or query the canonical memory store.',
  ],
  [
    'Reconcile VANTA-Brain sync',
    'Vault gate',
    'Fix stale Desktop/VAN pointers and rebase failures before trusting vault projections as current.',
  ],
  [
    'Define write approvals',
    'Safety gate',
    'Every command-center write should show target path, record type, sensitivity, and rollback plan before execution.',
  ],
  [
    'Create GTM operating board',
    'Revenue gate',
    'Turn the agency revenue, paid pilot, and SaaS funnel tracks into owners, evidence requirements, and daily tasks.',
  ],
  [
    'Connect content app registry',
    'Production gate',
    'Inventory each web/Electron content app by role, login state, output folder, export path, and automation boundary.',
  ],
];

const gtm = [
  [
    'Emergency agency revenue',
    'Cash track',
    'Sell done-for-you Instagram growth first: current clients, creators, agencies, local businesses.',
  ],
  [
    'Paid pilot cohort',
    'Validation track',
    'Validate 10-20 paid pilots, account survival, delivered outcomes, retention, and NPS.',
  ],
  [
    'SaaS funnel',
    'Product track',
    'Build toward audit or trial profile, paid pilot, subscription, and expansion across more profiles.',
  ],
];

const diagramArtifacts = [
  [
    'PC architecture diagram',
    '/aza/aza-pc-architecture.html',
    'Archify HTML showing the current command harness, executor, runtime workspace, agent overlays, AzA target, GTM/content surfaces, and projection vault.',
  ],
  [
    'PC architecture source JSON',
    '/aza/aza-pc-architecture.architecture.json',
    'Renderer input for regenerating the PC-wide architecture diagram.',
  ],
  [
    'PC architecture preview image',
    '/aza/aza-pc-architecture.png',
    'PNG snapshot of the current PC architecture diagram for quick inspection and sharing.',
  ],
  [
    'Interactive architecture diagram',
    '/aza/vanta-aza-architecture.html',
    'Archify HTML with theme toggle and exports.',
  ],
  [
    'Architecture source JSON',
    '/aza/vanta-aza-architecture.architecture.json',
    'Renderer input for regenerating the diagram.',
  ],
  [
    'Static preview image',
    '/aza/vanta-aza-architecture.png',
    'PNG snapshot for fast inspection and sharing.',
  ],
  [
    'App surface inventory JSON',
    '/aza/app-surface-inventory.json',
    'Privacy-safe manifest of running command, content, browser, communication, voice, and device apps.',
  ],
  [
    'Content generation app registry JSON',
    '/aza/content-generation-app-registry.json',
    'Operating registry for webapps, Electron apps, voice tools, browser surfaces, publishing channels, approval modes, and AzA write-back records.',
  ],
  [
    'VANTA-Brain read-only audit JSON',
    '/aza/vanta-brain-readonly-audit.json',
    'Evidence-backed vault audit covering file counts, sync scripts, launchd status, coverage gaps, and next actions.',
  ],
  [
    'AzA live VANTA-Brain coverage endpoint',
    '/aza/live-vanta-brain-coverage',
    'Dynamic read-only LobeHub route that compares VANTA-Brain projection folders against Codex, Hermes, agent skill, session, memory, and docs roots using metadata only.',
  ],
  [
    'AzA live VANTA-Brain diagnostics endpoint',
    '/aza/live-vanta-brain-diagnostics',
    'Dynamic read-only LobeHub route that explains why VANTA-Brain is blocked, captures bounded metadata probes, and gives the safe repair runbook before projection can be trusted.',
  ],
  [
    'GTM and team operating model JSON',
    '/aza/gtm-team-operating-model.json',
    'First typed operating model for offers, leads, pilots, content campaigns, tasks, daily command logs, and evidence.',
  ],
  [
    'AzA live GTM map endpoint',
    '/aza/live-gtm-map',
    'Dynamic read-only LobeHub route that derives GTM lanes, boards, record types, role ownership, approval rules, and operating-board status from current artifacts.',
  ],
  [
    'AzA live team data routing endpoint',
    '/aza/live-team-data-routing',
    'Dynamic read-only LobeHub route that maps team lanes, record types, handoffs, storage boundaries, owners, and blockers for GTM, product, content, operations, and knowledge data.',
  ],
  [
    'AzA live canonical store endpoint',
    '/aza/live-canonical-store',
    'Dynamic read-only LobeHub route that checks canonical-store prerequisites, required environment presence, supported database driver, and proof tasks without exposing secrets or touching database contents.',
  ],
  [
    'AzA live Codex harness endpoint',
    '/aza/live-codex-harness',
    'Dynamic read-only LobeHub route that maps the LobeHub harness, Codex executor, task/runtime primitives, approval lanes, and evidence handoff without creating tasks or running commands.',
  ],
  [
    'AzA live command record schema endpoint',
    '/aza/live-command-record-schema',
    'Dynamic read-only LobeHub route that defines the command, approval, Codex run, evidence, GTM, content, memory, and projection records needed before durable AzA writes.',
  ],
  [
    'AzA live communication protocols endpoint',
    '/aza/live-communication-protocols',
    'Dynamic read-only LobeHub route that maps how the operator, LobeHub, Codex, VAN, AzA API, MCP, Postgres, agent runtimes, content apps, local services, and VANTA-Brain talk to each other.',
  ],
  [
    'AzA live architecture data-flow endpoint',
    '/aza/live-architecture-data-flow',
    'Dynamic read-only LobeHub route that turns the live communication, workspace-root, brain topology, memory intake, GTM, and content maps into one node-and-edge view of how the PC architecture exchanges data.',
  ],
  [
    'AzA live implementation inventory endpoint',
    '/aza/live-aza-implementation',
    'Dynamic read-only LobeHub route that inspects /Users/growthgod/VAN/aza_memory implementation metadata, service entrypoints, package scripts, env variable names, schema table names, API capabilities, and MCP tool names without returning raw source, env values, database contents, or secrets.',
  ],
  [
    'AzA live memory intake funnel endpoint',
    '/aza/live-memory-intake-funnel',
    'Dynamic read-only LobeHub route that maps how granular agent, session, project, app, GTM, and projection sources feed the unified AzA brain through approval and evidence gates.',
  ],
  [
    'AzA live command gates endpoint',
    '/aza/live-command-gates',
    'Dynamic read-only LobeHub route that combines all live maps into explicit read gates, blocked writes, approval-required actions, and next proof steps.',
  ],
  [
    'AzA live implementation proof endpoint',
    '/aza/live-implementation-proof',
    'Dynamic read-only LobeHub route that turns the current blockers into ordered proof gates before canonical writes, durable boards, or VANTA-Brain projection.',
  ],
  [
    'AzA live verification runbook endpoint',
    '/aza/live-aza-verification-runbook',
    'Dynamic read-only LobeHub route that turns AzA service, MCP, Postgres, and projection blockers into exact probe steps, approval-required VAN commands, expected evidence, and safety boundaries.',
  ],
  [
    'AzA live brain topology endpoint',
    '/aza/live-brain-topology',
    'Dynamic read-only LobeHub route that models the hybrid AzA brain, granular agent/session namespaces, access profiles, and promotion pipeline.',
  ],
  [
    'AzA live agent access matrix endpoint',
    '/aza/live-agent-access-matrix',
    'Dynamic read-only LobeHub route that maps agents and runtime roles to readable namespaces, writable lanes, session scopes, and approval requirements.',
  ],
  [
    'AzA live agent fleet map endpoint',
    '/aza/live-agent-fleet-map',
    'Dynamic read-only LobeHub route that inventories Hermes agents, skill roots, manifest presence, namespace routes, and agent categories without reading raw agent files, skill bodies, sessions, or memories.',
  ],
  [
    'AzA live content operations endpoint',
    '/aza/live-content-ops',
    'Dynamic read-only LobeHub route that maps content apps into production stages, approval queues, registry gaps, and future AzA write-back records.',
  ],
  [
    'AzA live content app audit endpoint',
    '/aza/live-content-app-audit',
    'Dynamic read-only LobeHub route that shows which browser, Electron, voice, publishing, and device apps still need account labels, auth pointers, output paths, output kinds, and evidence before capture or publishing.',
  ],
  [
    'AzA live access capability endpoint',
    '/aza/live-access-capability-map',
    'Dynamic read-only LobeHub route that explains what browser, Electron, content, communication, coding, and device apps can safely do after login, and which captures or actions remain blocked or approval-required.',
  ],
  [
    'AzA live ownership resolution endpoint',
    '/aza/live-ownership-resolution',
    'Dynamic read-only LobeHub route that resolves source-of-truth ownership, ambiguous roots, write lanes, and approval policies.',
  ],
  [
    'Agent memory and skill inventory JSON',
    '/aza/agent-memory-skill-inventory.json',
    'Safe inventory of agent roots, skill roots, session stores, memory sources, and AzA indexing policy.',
  ],
  [
    'VAN project root inventory JSON',
    '/aza/van-project-root-inventory.json',
    'Safe top-level inventory of the active VAN workspace, grouped by memory, product, agent, device, UI, content, docs, and uncategorized lanes.',
  ],
  [
    'AzA live project map endpoint',
    '/aza/live-project-map',
    'Dynamic read-only LobeHub route that refreshes VAN, LobeHub, and Desktop/VAN top-level project roots, categories, and safe marker existence without reading file contents or git remotes.',
  ],
  [
    'AzA live workspace root reconciliation endpoint',
    '/aza/live-workspace-root-reconciliation',
    'Dynamic read-only LobeHub route that reconciles LobeHub, VAN, AzA memory, VANTA-Brain, Desktop/VAN, Codex, Hermes, and agent skill roots using markers, branch names, listener counts, and ownership policy.',
  ],
  [
    'Local service and port inventory JSON',
    '/aza/local-service-port-inventory.json',
    'Read-only live listener snapshot for LobeHub, Hermes/Odysseus, Suno, Engine, databases, Ollama, and planned AzA ports.',
  ],
  [
    'AzA read/write contract JSON',
    '/aza/aza-read-write-contract.json',
    'Explicit contract for what LobeHub can read, what Codex may execute, which writes are blocked, and which gates must be green first.',
  ],
  [
    'AzA source-of-truth map JSON',
    '/aza/aza-source-of-truth-map.json',
    'Consolidated master map for source ownership, memory architecture, artifact catalog, adapter build order, completion gaps, and write policies.',
  ],
  [
    'AzA brain readiness audit JSON',
    '/aza/aza-brain-readiness-audit.json',
    'Read-only audit of the actual AzA memory implementation, service ports, API/MCP/sync/worker surfaces, durable-store gaps, and canonical-write blockers.',
  ],
  [
    'AzA goal completion audit JSON',
    '/aza/aza-goal-completion-audit.json',
    'Requirement-by-requirement audit showing which original goal items are proven, partial, blocked, or still missing before completion.',
  ],
  [
    'AzA live goal completion audit endpoint',
    '/aza/live-goal-completion-audit',
    'Dynamic read-only LobeHub route that derives current requirement status for the active AzA architecture goal from live map summaries.',
  ],
  [
    'AzA live execution sequence endpoint',
    '/aza/live-execution-sequence',
    'Dynamic read-only LobeHub route that orders the next approval, service, store, MCP, adapter, GTM, content, and projection steps without executing them.',
  ],
  [
    'AzA live approval packet endpoint',
    '/aza/live-approval-packet',
    'Dynamic read-only LobeHub route that turns the current approval-gated runtime, content app, and projection blockers into exact approval text, boundaries, command classes, evidence rules, and rollback labels without executing them.',
  ],
  [
    'AzA live delivery roadmap endpoint',
    '/aza/live-delivery-roadmap',
    'Dynamic read-only LobeHub route that composes operating board, GTM, team data, implementation proof, and approval packet evidence into build milestones and workstreams without executing them.',
  ],
  [
    'AzA live browser task tooling endpoint',
    '/aza/live-browser-task-tooling-map',
    'Dynamic read-only LobeHub route that recommends Browser Plugin, Computer Use, CDP/RPC, MCP, and Codex routing by task class while preserving AzA as the memory source of truth.',
  ],
  [
    'AzA live tooling recommendation plan endpoint',
    '/aza/live-tooling-recommendation-plan',
    'Dynamic read-only LobeHub route that turns the Browser Plugin, MCP, Codex, AzA memory, and VANTA-Brain source-of-truth recommendation into an ordered operator plan.',
  ],
  [
    'AzA live readiness endpoint',
    '/aza/live-readiness',
    'Dynamic read-only LobeHub route that verifies command-center artifacts and probes AzA localhost service ports without writing to VAN or VANTA-Brain.',
  ],
  [
    'AzA live operating board endpoint',
    '/aza/live-operating-board',
    'Dynamic read-only LobeHub route that derives Daily Command, Memory Intake, GTM Pipeline, Content Factory, and Product Delivery cards from current artifacts and readiness.',
  ],
  [
    'AzA live daily command workflow endpoint',
    '/aza/live-daily-command-workflow',
    'Dynamic read-only LobeHub route that maps the current manual operator-to-LobeHub-to-Codex loop, team cadences, handoffs, evidence rules, and blockers before durable AzA writes.',
  ],
  [
    'AzA live app map endpoint',
    '/aza/live-app-map',
    'Dynamic read-only LobeHub route that inventories installed app bundles, visible desktop apps, content roles, stages, and automation modes without reading windows, tabs, documents, messages, or login state.',
  ],
  [
    'AzA live memory map endpoint',
    '/aza/live-memory-map',
    'Dynamic read-only LobeHub route that counts Codex, Hermes, agent skill, session, memory, and VANTA-Brain projection roots without reading raw contents.',
  ],
  [
    'AzA live service map endpoint',
    '/aza/live-service-map',
    'Dynamic read-only LobeHub route that inventories current TCP listeners, expected services, process cwd ownership, and unknown local listeners without reading secrets or command arguments.',
  ],
  [
    'AzA live system map endpoint',
    '/aza/live-system-map',
    'Dynamic read-only LobeHub route that combines root checks, service readiness, board state, app inventory, memory ownership, and communication edges into one machine map.',
  ],
];

const observedInventory = [
  [
    'Installed app surface',
    '70 .app bundles',
    'Observed under /Applications and /Users/growthgod/Applications on 2026-07-02 16:29 EDT.',
  ],
  [
    'VAN working root',
    '76 top-level directories',
    'Includes aza_memory, instagrowth-saas, hermesUI, hermes-core, openclaw, Engine, Suno, Oracle, and device/fleet repos.',
  ],
  [
    'VANTA-Brain projection vault',
    '9,053 files',
    'Contains Memory, Agents, 02-agents, 04-sessions, odysseus, Projects, Architecture, logs, and _system. It is not yet proven canonical.',
  ],
  [
    'Agent and skill surfaces',
    '2,028 agent skill dirs',
    'Strict directory count observed 2,028 ~/.agents/skills, 37 ~/.codex/skills, 34 Hermes agents, 65 Hermes skills, 3,996 Hermes session files, 106 Codex memory files, and 30 Hermes memory files.',
  ],
  [
    'Command preview',
    'Verified via webpack',
    'LobeHub /aza and Archify artifacts return 200 OK on localhost:3010 with the webpack Next preview path. Turbopack still stalls in instrumentation.',
  ],
  [
    'AzA brain service',
    'Planned canonical layer',
    'The command page can describe the target architecture, but AzA memory service validation and live MCP/API wiring still need a green check.',
  ],
];

const vanProjectInventory = [
  [
    'Mixed project/runtime root',
    '/Users/growthgod/VAN',
    'VAN has 76 top-level directories. It is the active implementation workspace, not the final harness or canonical memory database.',
  ],
  [
    'Memory and brain lane',
    '5 directories',
    'AzaZal, aZa, aza_memory, aza_tgbot, and memory. AzA should make aza_memory canonical only after services and validation are green.',
  ],
  [
    'Product repo lane',
    '11 directories',
    'Engine, Oracle, InstaGrowth, Suno, Instagram, OSINT, and growth-related repos sit here as active product surfaces.',
  ],
  [
    'Agent runtime lane',
    '13 directories',
    'Hermes, OpenClaw, SeekerClaw, psi-claw, vanta-agent-kit, and related agent/runtime roots need agent and session indexing.',
  ],
  [
    'Device/content/UI lanes',
    '8 directories',
    'Device ops, UI apps, and content/media tools include duoplus, mattclone-duo, vanta-command-center, content-pipeline, paperclip-hub, and pocket-studio.',
  ],
  [
    'Needs classification',
    '30 directories',
    'Workspace-or-uncategorized folders need a second pass before automation can route tasks or decide what to archive, index, or promote.',
  ],
];

const vanIndexPlan = [
  [
    'Project record',
    'AzA index target',
    'Every top-level VAN directory should become a candidate project/workspace record with path, category, status, owner, safe markers, and verification timestamp.',
  ],
  [
    'Repo metadata',
    'Secret-safe only',
    'Git branch and remote data should be inspected only through a sanitizer before storing anything, because remotes can theoretically contain credentials.',
  ],
  [
    'Service markers',
    'Read-only adapter',
    'package.json, pnpm-workspace.yaml, Dockerfile, docker-compose.yml, pyproject.toml, Makefile, AGENTS.md, and CLAUDE.md identify runnable or instruction-bearing projects.',
  ],
  [
    'Ownership links',
    'Routing requirement',
    'Each project should link to relevant agents, skills, sessions, apps, GTM records, memory sources, and evidence artifacts.',
  ],
  [
    'Projection rule',
    'VANTA-Brain second',
    'Only project summaries that have current AzA records and evidence should be projected to VANTA-Brain markdown.',
  ],
];

const localServiceInventory = [
  [
    'LobeHub harness live',
    '3010',
    'Next server from /Users/growthgod/lobehub returns 200 OK for /aza. This is the current command-center preview path.',
  ],
  [
    'Legacy Desktop/VAN runtime live',
    '7001',
    'A Python service is listening from /Users/growthgod/Desktop/VAN/odysseus. Desktop/VAN is still part of the actual runtime graph and needs reconciliation.',
  ],
  [
    'Product services live',
    '3003, 3005, 3006, 3110',
    'Engine, Suno engine, Suno web, and paperclip-hub related Node services are listening based on process cwd evidence.',
  ],
  [
    'Local data/model services live',
    '5432, 6379, 11434',
    'Postgres, Redis, and Ollama are listening locally. This does not yet prove AzA is wired to them.',
  ],
  [
    'AzA planned ports missing',
    '8786-8790',
    'The planned AzA API/MCP service ports are not listening, so LobeHub should stay read-only for canonical memory writes.',
  ],
  [
    'Unknown listeners need verification',
    '18789, 18791, 49632, 50274',
    'Unknown Node/Python loopback services need cwd, health route, and owner verification before any routing or automation.',
  ],
];

const serviceRoutingPlan = [
  [
    'Health route first',
    'Adapter rule',
    'Each listener needs a known owner, cwd, expected port, health URL, last checked timestamp, and current response before LobeHub routes work to it.',
  ],
  [
    'No identity from port alone',
    'Safety rule',
    'Process name and port are not enough. AzA should verify repo path and service owner before writing records or triggering actions.',
  ],
  [
    'Databases are dependencies',
    'Memory rule',
    'Postgres and Redis are available, but AzA must prove schema and connection ownership before treating either as canonical memory infrastructure.',
  ],
  [
    'Desktop/VAN reconciliation',
    'Path rule',
    'The live /Users/growthgod/Desktop/VAN/odysseus service should be compared against /Users/growthgod/VAN before the command center treats VAN as the only runtime root.',
  ],
  [
    'Unknown listeners read-only',
    'Approval rule',
    'Unknown loopback listeners stay inventory-only until a user-approved adapter can classify them safely.',
  ],
];

const sourceTruthMasterMap = [
  [
    '/Users/growthgod/lobehub',
    'Harness command surface',
    'Owns the AzA operator UI, approval display, routed context, artifact catalog, and command boards. Scoped LobeHub writes are allowed after organization is explained.',
  ],
  [
    '/Users/growthgod/VAN',
    'Active runtime workspace',
    'Owns product repos, agent repos, AzA implementation, device adapters, and service code. Writes require explicit target, reason, rollback, and approval.',
  ],
  [
    '/Users/growthgod/VAN/aza_memory',
    'Canonical brain target',
    'Should own typed records, search indexes, MCP access, and projection history once health, schema, and validation are live.',
  ],
  [
    '/Users/growthgod/Documents/VANTA-Brain',
    'Projection vault',
    'Stores reviewed markdown summaries, decisions, and safe indexes. It stays read-only during this pass and is not proven canonical.',
  ],
  [
    '~/.codex, ~/.agents, ~/.hermes',
    'Agent runtime state',
    'Codex, agent skills, Hermes agents, sessions, kanban, logs, and local memories stay runtime-native; durable facts promote into AzA with provenance.',
  ],
  [
    '/Applications and browser surfaces',
    'App and content layer',
    'Generation, voice, browser, publishing, and device tools are organized by role, output path, account label, automation mode, and approval boundary.',
  ],
];

const memoryArchitectureDecision = [
  [
    'Hybrid unified brain',
    'Decision',
    'Use AzA as the single canonical brain for durable memory, access control, search, and projection history while keeping per-agent skills and sessions granular.',
  ],
  [
    'Unified layer',
    'Shared facts',
    'Projects, services, GTM records, architecture decisions, promoted facts, artifacts, evidence, and customer learning belong in AzA.',
  ],
  [
    'Granular layer',
    'Agent overlays',
    'Codex, Hermes, and specialized agents keep local skills, prompts, tools, working context, and raw sessions in their native runtimes.',
  ],
  [
    'Promotion path',
    'Evidence first',
    'Agent facts become global only after source path, agent, session, sensitivity, allowed readers, and verification evidence are attached.',
  ],
  [
    'Why not flat vault',
    'Risk',
    'A single flat markdown vault would blur permissions, stale runtime state, raw logs, and secrets, making source ownership hard to trust.',
  ],
  [
    'Why not separate brains',
    'Risk',
    'Fully separate agent brains fragment GTM, product, customer, and architecture knowledge; the command center needs one canonical graph.',
  ],
];

const adapterBuildSequence = [
  [
    'Artifact catalog',
    'Started',
    'Keep the architecture, app, agent, service, GTM, contract, content, and source-truth artifacts discoverable from LobeHub.',
  ],
  [
    'Service health adapter',
    'Needed',
    'Convert local port snapshots into read-only health records with owner, cwd, health URL, last check, and evidence.',
  ],
  [
    'Agent and skill index',
    'Needed',
    'Index Codex, Hermes, and agent skill roots as metadata first, then promote session summaries only after sensitivity review.',
  ],
  [
    'App content registry',
    'Started',
    'Classify browser, Electron, voice, content, publishing, and device apps by role, output path, account label, and automation mode.',
  ],
  [
    'GTM team boards',
    'Modeled',
    'Build Daily Command, GTM Pipeline, Content Factory, Product Delivery, and Memory Intake from typed records.',
  ],
  [
    'Canonical AzA write API',
    'Blocked',
    'Enable approved writes only after AzA API/MCP health, schema validation, redaction, rollback, and evidence gates are green.',
  ],
  [
    'VANTA-Brain projection worker',
    'Blocked',
    'Project reviewed markdown from AzA to VANTA-Brain only after canonical records exist and you approve the projection.',
  ],
  [
    'Browser and device action adapter',
    'Blocked',
    'Permit browser or device actions only after read-only capture, account labels, risk labels, explicit approval, and evidence logging.',
  ],
];

const completionGaps = [
  [
    'AzA API and MCP not live',
    'Hard blocker',
    'Planned ports 8786-8790 were not listening, so LobeHub must stay read-only for canonical memory writes.',
  ],
  [
    'VANTA-Brain not proven complete',
    'Coverage gap',
    'The read-only audit found stale sync evidence and partial session/skill coverage, so the vault is useful but not canonical.',
  ],
  [
    'VAN uncategorized roots',
    'Classification gap',
    'The VAN inventory found 30 workspace or uncategorized top-level directories that need owner, status, and safety classification.',
  ],
  [
    'Legacy Desktop/VAN runtime',
    'Path gap',
    'A Python service on port 7001 still runs from /Users/growthgod/Desktop/VAN/odysseus, so the runtime graph needs reconciliation.',
  ],
  [
    'Browser login state unaudited',
    'Privacy gap',
    'Computer Use safely listed apps but excluded tabs, messages, documents, cookies, tokens, and raw login state.',
  ],
  [
    'Live adapters are minimal',
    'Implementation gap',
    'The command center now has a read-only live readiness route, but live memory records, boards, app registry state, and write adapters still need implementation.',
  ],
];

const liveReadinessAdapter = [
  [
    '/aza/live-readiness',
    'Dynamic read-only route',
    'Checks whether expected command-center artifacts exist and probes AzA localhost ports 8786-8790 from inside the LobeHub server.',
  ],
  [
    'Artifact catalog',
    'Live file check',
    'Verifies the presence, modified time, size, and public href for architecture, inventory, contract, readiness, GTM, content, and completion-audit artifacts.',
  ],
  [
    'AzA service probes',
    'Live port check',
    'Attempts localhost TCP and /health checks for gateway, API, MCP, sync, and worker without sending secrets or writing data.',
  ],
  [
    'Canonical writes',
    'Still blocked',
    'The route always reports canonicalWritesAllowed=false because service health alone is not enough; schema, store, redaction, approval, and projection gates remain.',
  ],
  [
    'VANTA-Brain projection',
    'Still blocked',
    'The route always reports projectionToVantaBrainAllowed=false because this pass keeps VANTA-Brain read-only.',
  ],
  [
    'Next live step',
    'Read adapter',
    'Once AzA services are running, LobeHub can use this endpoint as the first health source before building boards or memory retrieval views.',
  ],
];

const goalCoverageAudit = [
  [
    'Define PC architecture',
    'Partial',
    'The source map, Archify diagram, VAN inventory, app inventory, service ports, and readiness audits explain the current organization, but live adapters are still static snapshots.',
  ],
  [
    'Respect no-write boundaries',
    'Complete this pass',
    'VANTA-Brain stayed read-only, VAN was inspected read-only, and all implementation writes were scoped to LobeHub command-center artifacts.',
  ],
  [
    'Audit VANTA-Brain coverage',
    'Partial',
    'The vault has useful coverage, but session, skill, and sync gaps mean it is not proven complete or canonical.',
  ],
  [
    'Choose brain model',
    'Design complete',
    'The command center now records the hybrid decision: AzA as canonical unified memory with granular per-agent skills, sessions, and working overlays.',
  ],
  [
    'Organize AzA read/write plan',
    'Partial',
    'The read/write contract and source map define the plan, but AzA ports 8786-8790 are not live, so canonical writes are blocked.',
  ],
  [
    'Represent LobeHub and Codex roles',
    'Current artifacts complete',
    'LobeHub is consistently modeled as the harness and AzA command surface; Codex is the coding executor inside that flow.',
  ],
  [
    'Organize GTM and team data',
    'Partial',
    'GTM lanes, record types, boards, and content workflows are modeled, but live boards and durable records are not implemented yet.',
  ],
  [
    'Organize webapps and Electron apps',
    'Partial',
    'The app registry maps content roles and approval modes, but login state, tabs, private content, and export folders need approval-first audits.',
  ],
];

const liveCompletionBlockers = [
  [
    'AzA services not listening',
    'Hard blocker',
    'No live listeners were found on 8786, 8787, 8788, 8789, or 8790, so LobeHub cannot verify live AzA reads or writes.',
  ],
  [
    'Durable store wiring not proven',
    'Storage blocker',
    'Postgres schema and store exist, but API defaults to in-memory and shared durable-store wiring is not verified across API and MCP.',
  ],
  [
    'Sync and worker partial',
    'Pipeline blocker',
    'Consumer sync lacks a configured authenticated profile client, and the worker has many declared queues but only narrow processor coverage.',
  ],
  [
    'VANTA-Brain projection blocked',
    'User boundary',
    'Projection is designed but prohibited during this pass. It must remain blocked until canonical AzA writes and explicit approval exist.',
  ],
  [
    'Record and board adapters missing',
    'Harness blocker',
    'The command center now has a live health/artifact probe, but it does not yet read live AzA memory records, boards, or app registry state.',
  ],
];

const nextProofGates = [
  [
    'Start and verify AzA services',
    'Proof needed',
    'Gateway, API, MCP, sync, and worker need /health and /ready responses on 127.0.0.1 ports 8786-8790.',
  ],
  [
    'Verify Postgres canonical store',
    'Proof needed',
    'Migrations, pgvector, expected tables, and shared API/MCP durable-store usage need live verification.',
  ],
  [
    'Verify MCP tools',
    'Proof needed',
    'MCP initialize, tool listing, implemented retrieval calls, and placeholder labels need to pass against the live service.',
  ],
  [
    'Extend LobeHub read adapter',
    'Proof needed',
    'LobeHub should read live AzA memory, board, and app registry records after service health, schema, durable-store, and MCP gates pass.',
  ],
  [
    'Build first live board',
    'Proof needed',
    'Daily Command or Memory Intake should read typed records and show owner, status, evidence, and next action.',
  ],
  [
    'Approve first projection',
    'Proof needed',
    'A VANTA-Brain projection requires canonical AzA write, redaction verification, and explicit destination approval.',
  ],
];

const azaBrainReadiness = [
  [
    'Service code exists',
    'Implemented shape',
    'AzA memory has gateway, API, MCP, sync, worker, auth, redaction, events, schemas, database, knowledge, search, and observability packages.',
  ],
  [
    'Ports are not live',
    'Blocked',
    'Read-only lsof showed no listeners on 8786, 8787, 8788, 8789, or 8790, so LobeHub cannot read or write live AzA yet.',
  ],
  [
    'Durable store is partial',
    'Partial',
    'Postgres schema and PostgresAzAStore exist, but the API currently defaults to InMemoryAzAStore unless durable wiring is explicitly connected.',
  ],
  [
    'MCP retrieval is partial',
    'Partial',
    'MCP has implemented conversation listing, retrieval, search, and project context tools; advanced memory tools are reserved placeholders.',
  ],
  [
    'Consumer sync is blocked',
    'Blocked',
    'ChatGPT and Claude sync provider contracts exist, but the inspected authenticated fetch client is not configured for isolated browser profiles.',
  ],
  [
    'Projection is blocked',
    'Blocked',
    'Worker declares a project.obsidian queue, but VANTA-Brain writes are prohibited for this pass and projection is not verified live.',
  ],
];

const azaServiceSurfaces = [
  [
    'Gateway',
    '8786',
    'Health, ready, model listing, chat completions, responses, messages, and embeddings proxy through 9Router while emitting redacted events.',
  ],
  [
    'API',
    '8787',
    'Health, ready, ingestion events, ingestion conversations, conversation retrieval, search, project context, and internal 9Router events exist.',
  ],
  [
    'MCP',
    '8788',
    'Streamable HTTP MCP server exposes core conversation retrieval tools and reserves advanced memory, analysis, and mutation tools as placeholders.',
  ],
  [
    'Sync',
    '8789',
    'Health, ready, provider list, and full-sync endpoints exist for ChatGPT and Claude contracts, but authenticated profile access is not configured.',
  ],
  [
    'Worker',
    '8790',
    'Health, ready, queue listing, and an extract.knowledge processor exist; persistence, embeddings, memory proposals, projection, and indexing need processors.',
  ],
];

const azaCanonicalWriteGates = [
  [
    'Start services',
    'First gate',
    'All five AzA ports need /health and /ready checks from localhost before LobeHub can treat AzA as a live read target.',
  ],
  [
    'Verify Postgres',
    'Storage gate',
    'Run migrations against the intended local Postgres, verify pgvector and tables, and ensure API/MCP use the same durable store.',
  ],
  [
    'Verify MCP tools',
    'Retrieval gate',
    'Initialize MCP, list tools, call implemented retrieval tools, and label placeholder tools as unavailable in the harness.',
  ],
  [
    'Wire sync safely',
    'Provider gate',
    'Connect isolated authenticated profile clients without exposing cookies, tokens, OAuth data, or browser profile secrets.',
  ],
  [
    'Complete worker pipeline',
    'Processing gate',
    'Implement and verify persistence, embeddings, relationships, conflicts, memory proposals, search indexing, audit events, and projection processors.',
  ],
  [
    'Keep projection approval-first',
    'Vault gate',
    'Do not write VANTA-Brain until canonical AzA records exist, redaction passes, and you approve the specific projection destination.',
  ],
];

const vantaBrainAudit = [
  [
    'Partial projection, not canonical',
    'Vault verdict',
    'VANTA-Brain has 9,053 files and substantial session/docs coverage, but current evidence does not prove it fully logs all agent memories, skills, sessions, or LobeHub topics.',
  ],
  [
    'Session gap',
    'Coverage check',
    'Observed 3,996 Hermes session files versus 3,329 VANTA-Brain session files. Treat session coverage as useful but incomplete until reconciled.',
  ],
  [
    'Skill gap',
    'Coverage check',
    'Observed 2,028 ~/.agents/skills directories versus 122 skill-named files in VANTA-Brain. Skills need their own AzA index adapter.',
  ],
  [
    'Sync is stale or uncertain',
    'Sync check',
    'Last Lobe/Hermes sync stamps are June 23, the documented com.vanta.brain.sync launchd job was not found, and the installed com.growthgod.vanta-sync job reports no runs.',
  ],
  [
    'Export scope is narrow',
    'Script check',
    'Hermes export currently targets cron output markdown, Lobe export depends on a missing CLI, and OpenClaw export reads OpenClaw workspace/conversation data.',
  ],
  [
    'AzA should own canonical memory',
    'Architecture decision',
    'Use VANTA-Brain as a reviewed projection vault. Promote durable facts into AzA typed records first, then project safe summaries to markdown.',
  ],
];

const agentMemoryInventory = [
  [
    'Hybrid brain is required',
    'Design verdict',
    'Use AzA as the canonical typed memory layer, while keeping per-agent skills, prompts, sessions, and working memory in their native runtimes.',
  ],
  [
    '~/.agents/skills',
    'Skill root',
    'Observed 2,028 skill directories and 2,023 SKILL.md files. AzA should index metadata and capability, not blindly copy every skill body.',
  ],
  [
    '~/.codex',
    'Coding-agent root',
    'Observed 37 Codex skill directories, 40 Codex SKILL.md files, and 106 Codex memory files. Treat this as Codex executor memory and evidence.',
  ],
  [
    '~/.hermes',
    'Agent runtime root',
    'Observed 34 Hermes agent directories, 65 Hermes skill directories, 3,996 session files, and 30 Hermes memory files.',
  ],
  [
    'Sessions promote summaries',
    'Memory rule',
    'Raw sessions stay runtime evidence. AzA stores metadata, summaries, decisions, artifacts, promoted facts, sensitivity, and verification status.',
  ],
  [
    'Permissions follow source',
    'Access rule',
    'Every record needs agent, project, session, source path, sensitivity, allowed readers, allowed actions, and last verification timestamp.',
  ],
];

const brainIndexPlan = [
  [
    'Agent',
    'AzA table or record',
    'Identity, runtime, role, source path, skill roots, session roots, memory roots, tools, readers, approval level, and status.',
  ],
  [
    'Skill',
    'AzA table or record',
    'Name, runtime, entrypoint, capability, owner agent, allowed agents/projects, sensitivity, version, and verification timestamp.',
  ],
  [
    'Session',
    'AzA table or record',
    'Runtime, source path, time window, agents, projects, summary, decisions, artifacts, promoted facts, sensitivity, and verification status.',
  ],
  [
    'Memory source',
    'AzA table or record',
    'Source kind, owner agent, path, record count, modified time, conflict state, promotion policy, and projection policy.',
  ],
  [
    'Promoted fact',
    'AzA table or record',
    'Durable claim, source evidence, confidence, owner, allowed readers, supersession status, and VANTA-Brain projection link.',
  ],
  [
    'Artifact',
    'AzA table or record',
    'Generated output, screenshot, diagram, export, report, or validation proof linked to agent, project, session, app, and task.',
  ],
];

const contentAppRegistry = [
  [
    'AI generation desktop apps',
    'Content source lane',
    'ChatGPT Atlas, Claude, Gemini, Kimi, Qwen, MiniMax Hub, MiniMax Code, OpenHuman, Ollama, LobeHub, Pinokio.',
  ],
  [
    'Coding and agent builders',
    'Build lane',
    'Codex, CodexBar, Cursor, Devin, GitHub Copilot, OpenCode, Replit, cmux, Visual Studio Code.',
  ],
  [
    'Audio, voice, and transcription',
    'Media input lane',
    'Descript, Descript Screen Recorder, PPQ Whisper, VoiceInk, Wispr Flow, Willow Voice, VLC.',
  ],
  [
    'Docs and publishing',
    'Knowledge output lane',
    'Google Docs, Google Slides, Google Sheets, Google Drive, Notion, Obsidian, Outline, Tango Desktop.',
  ],
  [
    'Browser and web surfaces',
    'Webapp lane',
    'Google Chrome, Brave Browser, Comet, iTermBrowserPlugin. Browser tabs and login state still need a Computer-driven audit.',
  ],
  [
    'Device and distribution',
    'Operations lane',
    'DuoPlus, GeeLark, VMOSCloud, Discord, Slack, Telegram, WhatsApp 2, Linear, Tailscale, AnyDesk.',
  ],
  [
    'Unknown or classify next',
    'Triage lane',
    'Cluely, CovenCave, Cradle Hub, CastCodes, Lookup, Usage for Claude, and CC Switch need role, login, export path, and automation-boundary checks.',
  ],
];

const contentProductionStages = [
  [
    'Research',
    'Source gathering',
    'Chrome, Comet, Kimi, Gemini, Claude, and approved webapps gather sources. Store source pointers, timestamps, owner, and sensitivity labels.',
  ],
  [
    'Strategy',
    'Offer and prompt design',
    'LobeHub should connect the GTM offer, audience, angle, prompt, target platform, and approval state before generation starts.',
  ],
  [
    'Generation',
    'Text, image, audio, video',
    'Kimi, Gemini, MiniMax Hub, voice tools, and other generation apps create drafts or assets that become AzA asset and generation_run records.',
  ],
  [
    'Editing',
    'Packaging and review',
    'Generated assets need input path, output path, reviewer, revision summary, and campaign link before publishing.',
  ],
  [
    'Publishing',
    'Human-approved distribution',
    'Discord, Telegram, browser sessions, DuoPlus, and future social apps require explicit approval before posts, messages, or account-changing actions.',
  ],
  [
    'Measurement',
    'Analytics snapshot',
    'Metrics should write back as time-bounded analytics snapshots tied to the campaign, channel, asset, and next decision.',
  ],
  [
    'Projection',
    'Memory publication',
    'Only reviewed campaign summaries, decisions, and learning records project to VANTA-Brain after canonical AzA records exist.',
  ],
];

const contentAppOperatingModes = [
  [
    'Read-only',
    'Browser and unknown surfaces',
    'Chrome, unknown webapps, and unclassified tools can be inventoried, but tabs, account state, messages, and private content stay untouched without approval.',
  ],
  [
    'Draft-only',
    'AI generation apps',
    'Kimi, Gemini, Claude, MiniMax, and similar tools can draft scripts, prompts, captions, and concepts, but they cannot publish or store private context blindly.',
  ],
  [
    'Reviewed capture',
    'Media and transcript apps',
    'Wispr Flow, Willow Voice, Voice Memos, MiniMax Hub, screenshots, and exports become artifacts only after the operator reviews the capture and destination.',
  ],
  [
    'Human-approve',
    'Publishing and device apps',
    'Discord, Telegram, DuoPlus, VMOSCloud, GeeLark, and browser sessions require explicit approval for messages, posts, follows, purchases, or account changes.',
  ],
  [
    'Blocked',
    'Unclassified apps',
    'Cluely, CovenCave, CastCodes, AutoClaw, and any translocated or unknown app stay inventory-only until purpose, output path, owner, and risk are classified.',
  ],
];

const contentWriteBackRecords = [
  [
    'app_surface',
    'App registry',
    'Stores safe metadata: name, bundle id, install path, surface type, role, owner, automation mode, blocked actions, and evidence pointer.',
  ],
  [
    'content_campaign',
    'GTM content object',
    'Connects offer, audience, goal, source apps, prompt set, asset list, publish target, owner, approval state, and analytics snapshots.',
  ],
  [
    'asset',
    'Generated output',
    'Represents media, transcript, screenshot, document, export, or draft with source app, output path, version, reviewer, and campaign link.',
  ],
  [
    'publish_event',
    'Distribution record',
    'Captures target channel, account label, scheduled time, approval, final status, and post-publication evidence.',
  ],
  [
    'analytics_snapshot',
    'Measurement record',
    'Stores metric source, time window, result, experiment link, decision, and next action without scraping private data.',
  ],
  [
    'projection',
    'Human-readable summary',
    'Projects only redacted, reviewed campaign learning into VANTA-Brain after the AzA canonical record and evidence are present.',
  ],
];

const liveAppSurface = [
  [
    'Primary harness and executor',
    'Running now',
    'LobeHub is the harness. Codex, Hermes, iTerm2, Terminal, VS Code, Cursor, and MiniMax Code are active execution, coding, and orchestration surfaces.',
  ],
  [
    'Research and generation',
    'Running now',
    'Google Chrome, Comet, Kimi, Gemini, MiniMax Hub, and Cluely are active research or AI-generation surfaces that should be inventoried by account and export path.',
  ],
  [
    'Communication and handoff',
    'Running now',
    'Messages, Discord, Telegram, Notion, Calendar, and Preview are active coordination or review surfaces. They should write summaries, not raw private message data.',
  ],
  [
    'Device and network operations',
    'Running now',
    'DuoPlus, Tailscale, AutoClaw, Activity Monitor, and System Settings are active infrastructure or device-control surfaces with stricter action approvals.',
  ],
  [
    'Voice and media capture',
    'Running now',
    'Wispr Flow, Willow Voice, Voice Memos, Spotify, and CastCodes are active voice, media, or creative tooling surfaces that need output-folder mapping.',
  ],
  [
    'Browser login audit',
    'Pending',
    'The app list proves browser and Electron surfaces are running, but account login state and active tabs still need a separate privacy-safe browser audit.',
  ],
];

const appInventoryFields = [
  [
    'Identity',
    'Required field group',
    'App name, bundle id, install path, app type, owner, primary account label, and whether it is desktop, browser, webapp, CLI, or device adapter.',
  ],
  [
    'Purpose',
    'Required field group',
    'Command lane, content role, project owner, related agent, main use case, and whether it is source, processor, publisher, monitor, or archive.',
  ],
  [
    'Auth boundary',
    'Required field group',
    'Login status label, account label, auth-store pointer, permission level, renewal risk, and explicit no-secrets rule.',
  ],
  [
    'Input and output',
    'Required field group',
    'Import folders, export folders, screenshot locations, download paths, generated artifact types, and naming rules.',
  ],
  [
    'Automation mode',
    'Required field group',
    'Allowed actions should be labeled read-only, draft-only, human-approve, scheduled, or blocked. Account-changing actions require explicit approval.',
  ],
  [
    'Evidence',
    'Required field group',
    'Last verified date, verification method, screenshot path, command output, health check, error state, and next audit action.',
  ],
];

const inventoryActions = [
  [
    'App registry adapter',
    'Next inventory task',
    'Add a read-only adapter that records bundle path, bundle id, version, category, login owner, export folder, and allowed automation mode.',
  ],
  [
    'Agent memory index',
    'Next brain task',
    'Index ~/.agents/skills, ~/.codex/skills, ~/.hermes/agents, ~/.hermes/skills, and Hermes sessions with source path and owner metadata.',
  ],
  [
    'Vault reconciliation',
    'Next safety task',
    'Compare VANTA-Brain Memory, Agents, 02-agents, odysseus, and logs against AzA and Hermes before trusting any projection as current.',
  ],
  [
    'GTM operating board',
    'Next revenue task',
    'Turn GTM lanes into named owners, daily tasks, evidence requirements, offer tests, lead lists, and paid-pilot status.',
  ],
];

const canonicalRecords = [
  [
    'Project',
    'Canonical AzA record',
    'One row per repo, product, app, or workspace with path, owner, status, command entry, validation command, and linked agents.',
  ],
  [
    'Agent',
    'Canonical AzA record',
    'One row per human or software agent with role, skill roots, allowed tools, memory scope, approval level, and active tasks.',
  ],
  [
    'Skill',
    'Scoped agent asset',
    'Keep skill source in ~/.agents, ~/.codex, or Hermes, then index metadata into AzA with capability, owner, version, and allowed agent access.',
  ],
  [
    'Session',
    'Evidence record',
    'Codex, Hermes, browser, and device sessions should store source path, summary, decisions, artifacts, and promoted facts separately.',
  ],
  [
    'Artifact',
    'Output record',
    'Content, screenshots, diagrams, exports, docs, generated media, and deployment evidence should link back to project, agent, session, and source app.',
  ],
  [
    'Decision',
    'Governance record',
    'Architecture, GTM, pricing, workflow, and safety decisions should carry date, owner, rationale, affected paths, and supersession status.',
  ],
  [
    'Credential pointer',
    'Secret-safe record',
    'Store only env var names, auth-store path labels, provider names, and rotation status. Never copy raw tokens or keys into AzA or VANTA-Brain.',
  ],
  [
    'Customer or lead',
    'GTM record',
    'Pipeline records need source, offer, segment, contact status, evidence, next action, and conversion outcome.',
  ],
];

const memoryRoutingPolicy = [
  [
    'Write to AzA first',
    'Canonical rule',
    'Durable facts should land in AzA memory with provenance before being projected into VANTA-Brain markdown.',
  ],
  [
    'Project to VANTA-Brain second',
    'Projection rule',
    'VANTA-Brain should receive reviewed summaries, decisions, architecture notes, and indexes, not raw logs, raw secrets, or unverified claims.',
  ],
  [
    'Keep agent overlays local',
    'Granular rule',
    'Agents can keep specialized working memory and skills locally, but cross-agent facts must be promoted to AzA with source and access labels.',
  ],
  [
    'Segment by access',
    'Permission rule',
    'Every memory record should include project, agent, session, sensitivity, allowed readers, and whether it can be used for routing.',
  ],
  [
    'Attach evidence',
    'Verification rule',
    'Claims about paths, ports, sync, browser state, GTM metrics, or app login state need command output, screenshot, file path, or API result.',
  ],
  [
    'Approve writes',
    'Safety rule',
    'LobeHub should show target path, record type, owner, sensitivity, and rollback before writing to VAN, AzA, or VANTA-Brain.',
  ],
];

const gtmOperatingData = [
  [
    'Offer',
    'GTM object',
    'Name the productized service, promise, proof, price, target customer, delivery scope, and fulfillment owner.',
  ],
  [
    'Lead list',
    'GTM object',
    'Track source, segment, contact channel, fit score, last touch, next action, blocker, and owner.',
  ],
  [
    'Pilot',
    'GTM object',
    'Track customer, account/profile, campaign goal, start date, baseline, deliverables, evidence, status, and renewal risk.',
  ],
  [
    'Content campaign',
    'Content object',
    'Connect scripts, prompts, generated media, publishing app, calendar slot, output folder, and performance evidence.',
  ],
  [
    'Experiment',
    'Learning object',
    'Store hypothesis, segment, variant, metric, result, decision, and whether the lesson is promoted to global knowledge.',
  ],
  [
    'Daily command log',
    'Operating object',
    'Record what was shipped, what was sold, what was learned, what is blocked, and which agent owns the next action.',
  ],
];

const gtmTeamBoards = [
  [
    'Daily Command',
    'First board',
    'LobeHub should show today by owner, lane, blocked state, next action, and evidence. Codex executes coding work items from this board.',
  ],
  [
    'GTM Pipeline',
    'First board',
    'Track offers, segments, leads, outreach touches, pilots, proof, renewal risk, and conversion outcomes.',
  ],
  [
    'Content Factory',
    'First board',
    'Track campaign goal, source app, prompt, script, generated asset, edit status, publish target, and analytics snapshot.',
  ],
  [
    'Product Delivery',
    'First board',
    'Track customer problem, feature, task, target repo, validation command, release gate, and owner.',
  ],
  [
    'Memory Intake',
    'First board',
    'Track source, canonical AzA record, sensitivity label, verification status, conflict state, and VANTA-Brain projection.',
  ],
];

const commandCenterWorkflow = [
  [
    'Read',
    'Default mode',
    'Inspect current paths, services, app state, browser state, and memory roots without changing them.',
  ],
  [
    'Plan',
    'Approval mode',
    'Show proposed record type, destination, owner, sensitivity, and rollback before a write or automation run.',
  ],
  [
    'Write',
    'Controlled mode',
    'Write through approved adapters only: AzA API, project repo edits, generated artifacts, or reviewed VANTA-Brain projections.',
  ],
  [
    'Verify',
    'Evidence mode',
    'Run the narrowest useful checks, attach artifacts, and mark each result as verified, warning, blocked, or stale.',
  ],
  [
    'Project',
    'Publishing mode',
    'Emit human-readable summaries into the vault only after canonical AzA storage and verification are complete.',
  ],
];

const readWriteContract = [
  [
    'LobeHub',
    'Harness',
    'Owns the operator surface, routed context, approvals, boards, artifact links, and command history for AzA.',
  ],
  [
    'Codex',
    'Coding executor',
    'Executes inspection, implementation, terminal commands, validation, browser smoke checks, and evidence capture inside the LobeHub flow.',
  ],
  [
    'Current command mode',
    'Read-only',
    'The command center can show static inventories and evidence artifacts, but it should not write canonical memory while AzA services are not live.',
  ],
  [
    'Future write path',
    'Approved adapter flow',
    'LobeHub approval UI should submit typed write intents to AzA API or MCP, then AzA can project reviewed markdown to VANTA-Brain.',
  ],
  [
    'Canonical target',
    'AzA memory',
    'Durable facts belong in AzA records with provenance, sensitivity, allowed readers, verification status, and projection policy.',
  ],
  [
    'Projection target',
    'VANTA-Brain',
    'The vault receives reviewed summaries only after canonical AzA storage, redaction, and explicit approval for this pass.',
  ],
];

const adapterStatus = [
  [
    'Read adapters',
    'Available as artifacts',
    'App inventory, VANTA-Brain audit, GTM model, agent memory inventory, VAN project inventory, and local service ports are available as JSON snapshots.',
  ],
  [
    'AzA canonical writes',
    'Blocked',
    'Planned AzA API and MCP ports were not listening, so canonical memory writes stay disabled until health, schema, and ownership are verified.',
  ],
  [
    'VANTA-Brain writes',
    'Blocked',
    'The vault is read-only for this pass. No markdown projections should be written there until you approve the projection step.',
  ],
  [
    'VAN writes',
    'Approval required',
    'VAN is the active implementation and runtime workspace. Writes need a destination, reason, rollback, and explicit approval.',
  ],
  [
    'Browser and device actions',
    'Approval required',
    'Inspecting state can be read-only. Posting, messaging, following, buying, account changes, and device actions need explicit approval.',
  ],
  [
    'Secrets and credentials',
    'Never store raw values',
    'AzA should store only credential pointers, env var labels, provider names, rotation status, and evidence that the secret remained out of artifacts.',
  ],
];

const approvalGates = [
  [
    'AzA health live',
    'Service gate',
    'Known API and MCP health routes, expected ports, current cwd, and service ownership must be green before canonical writes.',
  ],
  [
    'Schema verified',
    'Memory gate',
    'Record type, required fields, sensitivity, allowed readers, and projection rules must be validated before storing memory.',
  ],
  [
    'Redaction complete',
    'Safety gate',
    'Raw tokens, cookies, passwords, API keys, private messages, customer credentials, and recovery codes must be excluded.',
  ],
  [
    'Source and rollback shown',
    'Filesystem gate',
    'Every write shows source path, destination path, owner, record type, sensitivity, rollback plan, and validation command.',
  ],
  [
    'Evidence attached',
    'Verification gate',
    'Claims about paths, ports, services, apps, sync, login state, or GTM status need a file, command, screenshot, health route, or API result.',
  ],
  [
    'Projection approved',
    'Vault gate',
    'VANTA-Brain projections happen only after canonical AzA storage and explicit approval for the reviewed markdown output.',
  ],
];

const cardStyle = {
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid rgba(148,163,184,0.32)',
  borderRadius: 8,
  boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
  padding: 16,
};

const sectionStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
};

const toneColor: Record<string, string> = {
  blocked: '#be123c',
  ok: '#047857',
  warn: '#b45309',
};

const Card = ({ detail, label, meta }: { detail: string; label: string; meta: string }) => (
  <article style={cardStyle}>
    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}>
      {meta}
    </div>
    <h3 style={{ fontSize: 16, margin: '0 0 10px', overflowWrap: 'anywhere' }}>{label}</h3>
    <p style={{ color: '#475569', lineHeight: 1.55, margin: 0 }}>{detail}</p>
  </article>
);

type SectionItem = string[] | { detail: string; label: string; meta: string };

const Section = ({
  eyebrow,
  items,
  title,
}: {
  eyebrow: string;
  items: SectionItem[];
  title: string;
}) => (
  <section style={{ display: 'grid', gap: 12 }}>
    <div>
      <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>{eyebrow}</div>
      <h2 style={{ fontSize: 22, margin: '4px 0 0' }}>{title}</h2>
    </div>
    <div style={sectionStyle}>
      {items.map((item, index) =>
        Array.isArray(item) ? (
          <Card
            detail={item[2] ?? ''}
            key={`${item[0] ?? 'item'}-${index}`}
            label={item[0] ?? 'Untitled'}
            meta={item[1] ?? 'Status'}
          />
        ) : (
          <Card
            detail={item.detail}
            key={`${item.label}-${index}`}
            label={item.label}
            meta={item.meta}
          />
        ),
      )}
    </div>
  </section>
);

const StatusSection = () => (
  <section style={{ display: 'grid', gap: 12 }}>
    <div>
      <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
        Integration health
      </div>
      <h2 style={{ fontSize: 22, margin: '4px 0 0' }}>Current blockers and verified connections</h2>
    </div>
    <div style={sectionStyle}>
      {health.map(([label, tone, detail]) => (
        <article key={label} style={cardStyle}>
          <div
            style={{
              color: toneColor[tone],
              fontSize: 12,
              marginBottom: 6,
              textTransform: 'uppercase',
            }}
          >
            {tone}
          </div>
          <h3 style={{ color: toneColor[tone], fontSize: 16, margin: '0 0 10px' }}>{label}</h3>
          <p style={{ color: '#475569', lineHeight: 1.55, margin: 0 }}>{detail}</p>
        </article>
      ))}
    </div>
  </section>
);

const DiagramSection = () => (
  <section style={{ display: 'grid', gap: 12 }}>
    <div>
      <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Archify map</div>
      <h2 style={{ fontSize: 22, margin: '4px 0 0' }}>Visual command architecture</h2>
    </div>
    <div style={sectionStyle}>
      {diagramArtifacts.map(([label, href, detail]) => (
        <article key={href} style={cardStyle}>
          <div
            style={{ color: '#64748b', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}
          >
            Generated artifact
          </div>
          <h3 style={{ fontSize: 16, margin: '0 0 10px', overflowWrap: 'anywhere' }}>
            <a
              href={href}
              rel="noreferrer"
              style={{ color: '#155e75', textDecoration: 'none' }}
              target="_blank"
            >
              {label}
            </a>
          </h3>
          <p style={{ color: '#475569', lineHeight: 1.55, margin: 0 }}>{detail}</p>
        </article>
      ))}
    </div>
  </section>
);

const LiveReadinessStatusSection = ({ readiness }: { readiness: AzaLiveReadiness }) => {
  const artifactsPresent = readiness.artifacts.filter((artifact) => artifact.exists).length;
  const servicesListening = readiness.services.filter((service) => service.listening).length;
  const servicesHealthy = readiness.services.filter((service) => service.health === 'ok').length;
  const serviceSummary = readiness.services
    .map((service) => {
      const state = service.listening ? service.health : 'not listening';
      return `${service.label} ${service.port}: ${state}`;
    })
    .join('; ');

  const items: Array<[string, string, string]> = [
    [
      'Artifact catalog',
      `${artifactsPresent}/${readiness.artifacts.length} present`,
      'The LobeHub server checked the expected public AzA artifacts by file path, modified time, size, and public href.',
    ],
    ['AzA services', `${servicesHealthy}/${readiness.services.length} healthy`, serviceSummary],
    [
      'Live AzA read',
      readiness.summary.liveAzAReadAvailable ? 'available' : 'blocked',
      readiness.summary.liveAzAReadAvailable
        ? 'The AzA API health route is currently reachable.'
        : 'The AzA API health route is not reachable, so live memory reads remain blocked.',
    ],
    [
      'Live MCP read',
      readiness.summary.liveMcpAvailable ? 'available' : 'blocked',
      readiness.summary.liveMcpAvailable
        ? 'The AzA MCP health route is currently reachable.'
        : 'The AzA MCP health route is not reachable, so agent retrieval remains blocked.',
    ],
    [
      'Canonical writes',
      readiness.summary.canonicalWritesAllowed ? 'allowed' : 'blocked',
      readiness.summary.reason,
    ],
    [
      'VANTA-Brain projection',
      readiness.summary.projectionToVantaBrainAllowed ? 'allowed' : 'blocked',
      'Projection stays disabled until canonical AzA records exist, redaction passes, and you approve the VANTA-Brain destination.',
    ],
    ['Generated at', 'Live probe', readiness.generatedAt],
    [
      'Listening ports',
      `${servicesListening}/${readiness.services.length} listening`,
      'This is a localhost-only probe from the LobeHub server. It does not read secrets, browser profiles, VAN contents, or VANTA-Brain contents.',
    ],
  ];

  return (
    <Section
      eyebrow={'Current live readiness'}
      items={items}
      title={'What the LobeHub harness can verify right now'}
    />
  );
};

const LiveCurrentGoalStatusReportSection = ({
  report,
}: {
  report: AzaLiveCurrentGoalStatusReportMap;
}) => {
  const items: Array<[string, string, string]> = [
    [
      'Goal status',
      `${report.requirementAudit.blockedRuntimeRequirements} requirement blocked / ${report.strictAggregate.blockedSignals} operating blockers`,
      `${report.answer.conclusion} Evidence: ${report.sourceArtifacts.join(', ')}.`,
    ],
    ['Brain model', 'hybrid unified', report.answer.brainRecommendation],
    [
      'Browser operating sessions',
      `${report.summary.browserAssistedCollectionPackets} browser-assisted packets`,
      report.answer.browserSessionRecommendation,
    ],
    ['Information boundary', 'source of truth', report.answer.organizationBoundary],
    [
      'AzA service proof',
      `API ${report.serviceProof.liveAzAReadAvailable ? 'live' : 'blocked'} / MCP ${report.serviceProof.liveMcpAvailable ? 'live' : 'blocked'} / ${report.serviceProof.apiReadyStoreMode}`,
      `${report.serviceProof.serviceProofConclusion} Store mode: ${report.serviceProof.apiReadyStoreMode}. API records: ${report.serviceProof.durableRecordProof.projectRecords} projects, ${report.serviceProof.durableRecordProof.taskRecords} tasks, ${report.serviceProof.durableRecordProof.operatingRecords} operating, ${report.serviceProof.durableRecordProof.handoffRecords} handoffs, ${report.serviceProof.durableRecordProof.evidenceRecords} evidence. MCP tools: ${report.serviceProof.mcpToolProof.implementedTools}/${report.serviceProof.mcpToolProof.totalTools} implemented; MCP records: ${report.serviceProof.mcpToolProof.projectRecords} projects, ${report.serviceProof.mcpToolProof.taskRecords} tasks, ${report.serviceProof.mcpToolProof.operatingRecords} operating, ${report.serviceProof.mcpToolProof.handoffRecords} handoffs, ${report.serviceProof.mcpToolProof.evidenceRecords} evidence, ${report.serviceProof.mcpToolProof.listConversationRecords} conversations. LobeHub read binding: ${report.serviceProof.lobeHubNativeReadProof.operatingRecordsVisible} operating records, ${report.serviceProof.lobeHubNativeReadProof.operatingRecordTypesFound}/${report.serviceProof.lobeHubNativeReadProof.operatingRecordTypesExpected} record types. Canonical store blockers: ${report.serviceProof.canonicalStoreBlockedChecks}. Env: ${report.serviceProof.canonicalStoreRequiredEnvPresent}/${report.serviceProof.canonicalStoreRequiredEnvTotal}.`,
    ],
    [
      'Native approval adapter',
      `${report.nativeApprovalAdapter.summary.liveOperatingRecordReadBinding ? 'read bound' : 'read blocked'} / ${report.nativeApprovalAdapter.summary.writeAdapterReady ? 'write ready' : 'writes blocked'}`,
      `Capabilities blocked: ${report.nativeApprovalAdapter.summary.blockedCapabilities}. Approval packets: ${report.nativeApprovalAdapter.summary.approvalRequiredPackets}. Command schemas: ${report.nativeApprovalAdapter.summary.commandRecordSchemas}. Operating records: ${report.nativeApprovalAdapter.summary.operatingRecordsVisible}, types ${report.nativeApprovalAdapter.summary.operatingRecordTypesFound}/${report.nativeApprovalAdapter.summary.operatingRecordTypesExpected}. Evidence: ${report.nativeApprovalAdapter.sourceArtifacts.join(', ')}.`,
    ],
    [
      'Completion matrix',
      `${report.completionMatrix.length} requirements`,
      `Complete: ${report.completionMatrix.filter((item) => item.verdict === 'complete').length}. Partial: ${report.completionMatrix.filter((item) => item.verdict === 'partial').length}. Blocked: ${report.completionMatrix.filter((item) => item.verdict === 'blocked').length}.`,
    ],
    [
      'Proof queue',
      `${report.proofQueue.length} open proof items`,
      `Approval required: ${report.proofQueue.filter((item) => item.approvalRequired).length}. First owner: ${report.proofQueue[0]?.owner ?? 'none'}.`,
    ],
    ...report.proofQueue
      .slice(0, 5)
      .map((item): [string, string, string] => [
        item.title,
        `${item.owner} / ${item.approvalRequired ? 'approval required' : 'read-only proof'}`,
        `Priority ${item.priority}. Collect: ${item.proofToCollect}. Blocked by: ${item.blockedBy.join('; ')}. Evidence: ${item.evidence.join(', ')}.`,
      ]),
    ...report.completionMatrix
      .filter((item) => item.verdict !== 'complete')
      .slice(0, 6)
      .map((item): [string, string, string] => [
        item.requirement,
        item.status,
        `Missing proof: ${item.missingProof.join('; ')}. Next: ${item.nextProof}. Evidence: ${item.primaryEvidence.join(', ')}${item.evidenceCount > item.primaryEvidence.length ? `, plus ${item.evidenceCount - item.primaryEvidence.length} more routes` : ''}.`,
      ]),
    ...report.statusCards.map((card): [string, string, string] => [
      card.label,
      card.status,
      `${card.detail} Next: ${card.nextAction} Evidence: ${card.evidence.join(', ')}.`,
    ]),
  ];

  return (
    <Section
      eyebrow={'Current goal report'}
      items={items}
      title={'What is organized, what is blocked, and how browser sessions should fit'}
    />
  );
};

const LiveSyncStatusSection = ({ syncStatus }: { syncStatus: AzaLiveSyncStatusMap }) => {
  const channelItems = syncStatus.channels.map((channel): [string, string, string] => [
    channel.label,
    channel.status,
    `Blocked by: ${
      channel.blockedBy.length > 0 ? channel.blockedBy.join(', ') : 'none'
    }. Evidence: ${channel.evidence.join(', ')}. Last observed: ${
      channel.lastObservedAt ?? 'not available'
    }. Next: ${channel.nextAction}`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Sync summary',
      `${syncStatus.summary.blockedChannels}/${syncStatus.summary.channels} blocked`,
      `Manual channels: ${syncStatus.summary.manualAvailableChannels}. Notion configured: ${
        syncStatus.summary.notionConfigured ? 'yes' : 'no'
      }. VANTA-Brain root present: ${
        syncStatus.summary.vantaBrainRootPresent ? 'yes' : 'no'
      }. Writes allowed: ${syncStatus.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${syncStatus.safety.captured.join(', ')}. Excluded: ${syncStatus.safety.excluded.join(', ')}.`,
    ],
    ...channelItems,
  ];

  return (
    <Section
      eyebrow={'Live sync status'}
      items={items}
      title={'Notion and VANTA-Brain sync state'}
    />
  );
};

const LiveOperatingBoardSection = ({ board }: { board: AzaLiveOperatingBoard }) => {
  const items: Array<[string, string, string]> = [
    [
      'Board summary',
      `${board.summary.blockedCards}/${board.summary.totalCards} blocked`,
      `Generated ${board.generatedAt}. Writes allowed: ${board.summary.writesAllowed ? 'yes' : 'no'}. Source artifacts: ${board.sourceArtifacts.join(', ')}.`,
    ],
    ...board.lanes.flatMap((lane) =>
      lane.cards.map((card): [string, string, string] => [
        card.title,
        `${lane.name} / ${card.status}`,
        `Owner: ${card.owner}. Agent: ${card.agent}. Approval: ${card.approvalMode}. Next: ${card.nextAction}. Evidence: ${card.evidence.join(', ')}.`,
      ]),
    ),
  ];
  const records = board.operatingRecords.records;
  const tableCellStyle = {
    borderBottom: '1px solid rgba(148,163,184,0.28)',
    fontSize: 13,
    padding: '10px 8px',
    textAlign: 'left',
    verticalAlign: 'top',
  } as const;
  const tableHeadStyle = {
    ...tableCellStyle,
    color: '#334155',
    fontSize: 12,
    textTransform: 'uppercase',
  } as const;

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div>
        <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
          Live operating board
        </div>
        <h2 style={{ fontSize: 22, margin: '4px 0 0' }}>
          Daily Command, GTM, content, memory, and product work
        </h2>
      </div>
      <div style={sectionStyle}>
        {items.map((item, index) => (
          <Card detail={item[2]} key={`${item[0]}-${index}`} label={item[0]} meta={item[1]} />
        ))}
      </div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <div
          style={{ color: '#64748b', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}
        >
          Sanitized live AzA records
        </div>
        <h3 style={{ fontSize: 16, margin: '0 0 10px' }}>
          {board.summary.liveOperatingRecordTypesFound}/
          {board.summary.liveOperatingRecordTypesExpected} record types live
        </h3>
        <table style={{ borderCollapse: 'collapse', minWidth: 860, width: '100%' }}>
          <thead>
            <tr>
              <th style={tableHeadStyle}>Record</th>
              <th style={tableHeadStyle}>Lane</th>
              <th style={tableHeadStyle}>Owner</th>
              <th style={tableHeadStyle}>Status</th>
              <th style={tableHeadStyle}>Evidence</th>
              <th style={tableHeadStyle}>Metadata</th>
              <th style={tableHeadStyle}>Project</th>
              <th style={tableHeadStyle}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id ?? `${record.recordType ?? 'record'}-${index}`}>
                <td style={tableCellStyle}>{record.recordType ?? 'unknown'}</td>
                <td style={tableCellStyle}>{record.lane ?? 'unassigned'}</td>
                <td style={tableCellStyle}>{record.owner ?? 'unassigned'}</td>
                <td style={tableCellStyle}>{record.status ?? 'unknown'}</td>
                <td style={tableCellStyle}>{record.evidenceCount}</td>
                <td style={tableCellStyle}>{record.hasMetadata ? 'present' : 'missing'}</td>
                <td style={tableCellStyle}>{record.projectId ?? 'none'}</td>
                <td style={tableCellStyle}>{record.updatedAt ?? 'unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const LiveDailyCommandWorkflowSection = ({
  workflow,
}: {
  workflow: AzaLiveDailyCommandWorkflowMap;
}) => {
  const stageItems = workflow.stages.map((stage): [string, string, string] => [
    stage.label,
    `${stage.from} -> ${stage.to} / ${stage.status}`,
    `Owner: ${stage.owner}. Approval: ${stage.approval}. Records: ${stage.recordTypes.join(', ')}. Input: ${stage.input}. Output: ${stage.output}. Blocked by: ${stage.blockedBy.length > 0 ? stage.blockedBy.join(', ') : 'none'}. Next: ${stage.nextAction}. Evidence: ${stage.evidence.join(', ')}.`,
  ]);
  const cadenceItems = workflow.cadences.map((cadence): [string, string, string] => [
    cadence.board,
    `${cadence.source} / ${cadence.status}`,
    `Owner: ${cadence.owner}. Cadence: ${cadence.cadence}. Records: ${cadence.recordTypes.join(', ')}. Next: ${cadence.nextAction}. Evidence: ${cadence.evidence.join(', ')}.`,
  ]);
  const handoffItems = workflow.handoffs
    .slice(0, 14)
    .map((handoff): [string, string, string] => [
      handoff.label,
      `${handoff.from} -> ${handoff.to} / ${handoff.status}`,
      `Approval: ${handoff.approval}. Records: ${handoff.recordTypes.join(', ')}. Blocked by: ${handoff.blockedBy.length > 0 ? handoff.blockedBy.join(', ') : 'none'}. Evidence: ${handoff.evidence.join(', ')}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Daily command workflow summary',
      `${workflow.summary.stages} stages / ${workflow.summary.blockedStages} blocked`,
      `Active manual: ${workflow.summary.activeManualStages}. Active read-only: ${workflow.summary.activeReadOnlyStages}. Approval required: ${workflow.summary.approvalRequiredStages}. Planned: ${workflow.summary.plannedStages}. Board cards: ${workflow.summary.boardCards}. Durable handoff ready: ${workflow.summary.durableHandoffReady ? 'yes' : 'no'}. Durable board ready: ${workflow.summary.durableBoardReady ? 'yes' : 'no'}. Canonical write ready: ${workflow.summary.canonicalWriteReady ? 'yes' : 'no'}. Writes allowed: ${workflow.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Current loop',
      'LobeHub harness plus Codex executor',
      `${workflow.recommendation.currentLoop} ${workflow.recommendation.evidenceRule}`,
    ],
    [
      'Durable loop',
      'blocked until AzA gates pass',
      `${workflow.recommendation.durableLoop} ${workflow.recommendation.memoryRule}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${workflow.safety.captured.join(', ')}. Excluded: ${workflow.safety.excluded.join(', ')}.`,
    ],
    ...stageItems,
    ...cadenceItems,
    ...handoffItems,
  ];

  return (
    <Section
      eyebrow={'Live daily command workflow'}
      items={items}
      title={'How operator intent moves through LobeHub, Codex, team lanes, evidence, and memory'}
    />
  );
};

const LiveMemoryMapSection = ({ memoryMap }: { memoryMap: AzaLiveMemoryMap }) => {
  const rootItems = memoryMap.roots.map((root): [string, string, string] => [
    root.id,
    `${root.status} / ${root.azARecordType}`,
    `Path: ${root.path}. Role: ${root.role}. Shallow scanned files: ${root.counts.totalFiles}. Shallow scanned directories: ${root.counts.totalDirectories}. SKILL.md: ${root.counts.skillMarkdownFiles}. Sessions: ${root.counts.sessionFiles}. Memories: ${root.counts.memoryFiles}. Direct entries modified last 7 days: ${root.counts.filesModifiedLast7Days} files and ${root.counts.directoriesModifiedLast7Days} directories. Policy: ${root.indexPolicy}`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Live memory summary',
      `${memoryMap.summary.rootsPresent}/${memoryMap.summary.rootsTotal} roots present`,
      `Shallow scanned files: ${memoryMap.summary.totalFiles}. Shallow scanned directories: ${memoryMap.summary.totalDirectories}. Skill manifests: ${memoryMap.summary.skillMarkdownFiles}. Hermes session files: ${memoryMap.summary.hermesSessionFiles}. Codex memory files: ${memoryMap.summary.codexMemoryFiles}. VANTA-Brain projection files: ${memoryMap.summary.projectionVaultFiles}. Writes allowed: ${memoryMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Promotion model',
      memoryMap.promotionModel.decision,
      `${memoryMap.promotionModel.canonicalBrain} ${memoryMap.promotionModel.granularOverlays} ${memoryMap.promotionModel.projectionVault}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${memoryMap.safety.captured.join(', ')}. Excluded: ${memoryMap.safety.excluded.join(', ')}.`,
    ],
    ...rootItems,
  ];

  return (
    <Section
      eyebrow={'Live memory map'}
      items={items}
      title={'Agent skills, sessions, memories, and VANTA-Brain projection coverage'}
    />
  );
};

const LiveVantaBrainCoverageSection = ({
  coverage,
}: {
  coverage: AzaLiveVantaBrainCoverageMap;
}) => {
  const targetItems = coverage.coverageTargets.map((target): [string, string, string] => [
    target.label,
    `${target.status} / ${target.recordTypes.join(', ')}`,
    `Matched projection signals: ${
      target.matchedProjectionSignals.length > 0
        ? target.matchedProjectionSignals.join(', ')
        : 'none'
    }. Expected source roots: ${target.expectedSourceRoots
      .map((root) => `${root.id}:${root.present ? 'present' : 'missing'}`)
      .join(', ')}. Gap: ${target.gap} Next: ${target.nextAction}`,
  ]);
  const gapItems = coverage.gaps.map((gap): [string, string, string] => [
    gap.label,
    `${gap.severity} severity`,
    `Blocked by: ${gap.blockedBy.join(', ')}. Evidence: ${gap.evidence.join(', ')}. Next: ${gap.nextAction}`,
  ]);
  const projectionItems = coverage.projectionEntries
    .filter((entry) => !entry.name.startsWith('.'))
    .slice(0, 24)
    .map((entry): [string, string, string] => [
      entry.name,
      `${entry.kind} / modified ${entry.modifiedAt ?? 'unknown'}`,
      `Path: ${entry.path}. Direct child directories: ${entry.childDirectoryCount}. Direct child files: ${entry.childFileCount}. Representative children: ${
        entry.representativeChildren.length > 0 ? entry.representativeChildren.join(', ') : 'none'
      }.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'VANTA-Brain coverage summary',
      `${coverage.summary.coveredTargets}/${coverage.summary.coverageTargets} covered, ${coverage.summary.partialTargets} partial, ${coverage.summary.staleTargets} stale`,
      `${coverage.answer.conclusion} Root present: ${
        coverage.summary.rootPresent ? 'yes' : 'no'
      }. Source roots present: ${coverage.summary.sourceRootsPresent}/${coverage.summary.sourceRootsTotal}. Direct projection entries: ${coverage.summary.projectionEntryCount}. Writes allowed: ${
        coverage.summary.writesAllowed ? 'yes' : 'no'
      }.`,
    ],
    [
      'Harness interpretation',
      coverage.answer.coverageTruth,
      coverage.answer.harnessInterpretation,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${coverage.safety.captured.join(', ')}. Excluded: ${coverage.safety.excluded.join(', ')}.`,
    ],
    ...targetItems,
    ...gapItems,
    ...projectionItems,
  ];

  return (
    <Section
      eyebrow={'Live VANTA-Brain coverage'}
      items={items}
      title={'Whether VANTA-Brain covers docs, agents, skills, sessions, and memories'}
    />
  );
};

const LiveAppMapSection = ({ appMap }: { appMap: AzaLiveAppMap }) => {
  const contentApps = appMap.installedApps
    .filter(
      (app) =>
        app.visible ||
        app.registryRole ||
        app.category !== 'unclassified_app' ||
        app.automationMode === 'blocked',
    )
    .slice(0, 40)
    .map((app): [string, string, string] => [
      app.name,
      `${app.category} / ${app.automationMode}${app.visible ? ' / visible' : ''}`,
      `Path: ${app.path ?? 'not resolved from bundle scan'}. Source root: ${app.sourceRoot ?? 'not resolved'}. Bundle: ${app.bundleId ?? 'unknown'}. Version: ${app.bundleVersion ?? 'unknown'}. Stages: ${app.contentStages.length > 0 ? app.contentStages.join(', ') : 'not assigned'}. Installed: ${app.installed ? 'yes' : 'no'}. Registry role: ${app.registryRole ?? 'none'}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Live app summary',
      `${appMap.summary.installedAppCount} installed / ${appMap.summary.visibleAppCount} visible`,
      `Bundle metadata: ${appMap.summary.bundleMetadataApps}. Chrome/webapp wrappers: ${appMap.summary.browserWebAppWrappers}. Registry matches: ${appMap.summary.registryMatchedApps}. Pending verification candidates: ${appMap.summary.contentCandidateCount}. Unclassified: ${appMap.summary.unclassifiedApps}. Translocated: ${appMap.summary.translocatedApps}. Modes: ${appMap.summary.draftOnlyApps} draft-only, ${appMap.summary.reviewedCaptureApps} reviewed-capture, ${appMap.summary.humanApproveApps} human-approve, ${appMap.summary.blockedApps} blocked. Writes allowed: ${appMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    ['Visible apps', 'desktop process names only', appMap.visibleApps.join(', ')],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${appMap.safety.captured.join(', ')}. Excluded: ${appMap.safety.excluded.join(', ')}.`,
    ],
    ...contentApps,
  ];

  return (
    <Section
      eyebrow={'Live app map'}
      items={items}
      title={'Installed apps, visible app surfaces, content roles, and automation modes'}
    />
  );
};

const LiveContentOpsSection = ({ contentOps }: { contentOps: AzaLiveContentOpsMap }) => {
  const stageItems = contentOps.stages.map((stage): [string, string, string] => [
    stage.name,
    `${stage.appCount} apps / ${stage.recordTypes.length} record types`,
    `Stage id: ${stage.id}. Apps: ${stage.appExamples.length > 0 ? stage.appExamples.join(', ') : 'none assigned yet'}. Records: ${stage.recordTypes.join(', ')}. Evidence required: ${stage.requiredEvidence.join(', ')}.`,
  ]);
  const modeItems = contentOps.automationModes.map((mode): [string, string, string] => [
    mode.mode,
    `${mode.count} apps`,
    `${mode.description} Examples: ${mode.appExamples.length > 0 ? mode.appExamples.join(', ') : 'none'}.`,
  ]);
  const approvalItems = contentOps.approvalQueue
    .slice(0, 24)
    .map((item): [string, string, string] => [
      item.app,
      `${item.mode} / ${item.status}`,
      `Reason: ${item.reason}. Required before: ${item.requiredBefore.join(', ')}.`,
    ]);
  const writeBackItems = contentOps.writeBackPlan.map((step): [string, string, string] => [
    step.step,
    `${step.targetRecord} / ${step.status}`,
    step.rule,
  ]);
  const gapItems = contentOps.gaps.map((gap): [string, string, string] => [
    gap.id,
    gap.status,
    `Examples: ${gap.examples.length > 0 ? gap.examples.join(', ') : 'none'}. Next: ${gap.nextAction}`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Live content operations summary',
      `${contentOps.summary.contentStages} stages / ${contentOps.summary.writeBackSteps} write-back steps`,
      `Installed apps: ${contentOps.summary.installedApps}. Visible apps: ${contentOps.summary.visibleApps}. Registry matches: ${contentOps.summary.registryMatchedApps}. Pending verification: ${contentOps.summary.pendingVerificationApps}. Approval queue: ${contentOps.summary.appsNeedingApproval}. Writes allowed: ${contentOps.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Automation modes',
      `${contentOps.summary.draftOnlyApps} draft / ${contentOps.summary.reviewedCaptureApps} reviewed / ${contentOps.summary.humanApproveApps} approval / ${contentOps.summary.blockedApps} blocked`,
      'Publishing, messaging, account-changing, device, and filesystem actions remain approval-first or blocked until command gates pass.',
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${contentOps.safety.captured.join(', ')}. Excluded: ${contentOps.safety.excluded.join(', ')}.`,
    ],
    ...stageItems,
    ...modeItems,
    ...approvalItems,
    ...writeBackItems,
    ...gapItems,
  ];

  return (
    <Section
      eyebrow={'Live content operations'}
      items={items}
      title={'Content app stages, approval queue, registry gaps, and AzA write-back plan'}
    />
  );
};

const LiveContentAppAuditSection = ({ audit }: { audit: AzaLiveContentAppAuditMap }) => {
  const metadataTargets = audit.targets.slice(0, 48);
  const metadataSlot = (target: AzaLiveContentAppAuditMap['targets'][number], id: string) =>
    target.metadataSlots.find((slot) => slot.id === id);
  const metadataCell = (target: AzaLiveContentAppAuditMap['targets'][number], id: string) => {
    const slot = metadataSlot(target, id);

    return slot ? `${slot.status} / ${slot.valueSource}` : 'not_applicable';
  };
  const tableCellStyle = {
    borderBottom: '1px solid rgba(148,163,184,0.28)',
    fontSize: 13,
    padding: '10px 8px',
    textAlign: 'left',
    verticalAlign: 'top',
  } as const;
  const tableHeadStyle = {
    ...tableCellStyle,
    color: '#334155',
    fontSize: 12,
    textTransform: 'uppercase',
  } as const;
  const laneItems = audit.lanes.map((lane): [string, string, string] => [
    lane.label,
    `${lane.gate} / ${lane.status}`,
    `Apps: ${lane.appNames.length > 0 ? lane.appNames.join(', ') : 'none'}. Next: ${lane.nextAction}`,
  ]);
  const fieldItems = audit.auditFields.map((field): [string, string, string] => [
    field.label,
    `${field.id} / ${field.status}`,
    `Required before: ${field.requiredBefore.join(', ')}. Source: ${field.valueSource}. Safety: ${field.safetyRule}`,
  ]);
  const targetItems = audit.targets
    .slice(0, 48)
    .map((target): [string, string, string] => [
      target.name,
      `${target.category} / ${target.automationMode} / ${target.status}`,
      `Visible: ${target.visible ? 'yes' : 'no'}. Path: ${target.path ?? 'not resolved'}. Role: ${target.registryRole ?? 'none'}. Stages: ${target.contentStages.length > 0 ? target.contentStages.join(', ') : 'not assigned'}. Missing fields: ${target.missingRequiredFields.length > 0 ? target.missingRequiredFields.join(', ') : 'none'}. Gates: ${target.requiredGates.length > 0 ? target.requiredGates.join(', ') : 'none'}. Next: ${target.nextAction}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Content app audit summary',
      `${audit.summary.contentTargets} targets / ${audit.summary.readyForCaptureTargets} ready for capture`,
      `Visible targets: ${audit.summary.visibleTargets}. Browser/web targets: ${audit.summary.browserSurfaceTargets}. Draft-only: ${audit.summary.draftOnlyTargets}. Reviewed-capture: ${audit.summary.reviewedCaptureTargets}. Human-approve: ${audit.summary.humanApproveTargets}. Audit-required: ${audit.summary.auditRequiredTargets}. Approval-required: ${audit.summary.approvalRequiredTargets}. Blocked: ${audit.summary.blockedTargets}. Metadata slots: ${audit.summary.metadataSlots}. Missing slots: ${audit.summary.missingMetadataSlots}. Missing account labels: ${audit.summary.missingAccountLabels}. Missing auth pointers: ${audit.summary.missingAuthPointers}. Missing output paths: ${audit.summary.missingOutputPaths}. Writes allowed: ${audit.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Audit rule',
      'metadata before capture',
      `${audit.recommendation.auditRule} ${audit.recommendation.contentRule} ${audit.recommendation.publishRule} ${audit.recommendation.storageRule}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${audit.safety.captured.join(', ')}. Excluded: ${audit.safety.excluded.join(', ')}.`,
    ],
    ...laneItems,
    ...fieldItems,
    ...targetItems,
  ];

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <Section
        eyebrow={'Live content app audit'}
        items={items}
        title={'Account labels, output paths, auth pointers, evidence, and approval gates'}
      />
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <div
          style={{ color: '#64748b', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}
        >
          Metadata collection slots
        </div>
        <h3 style={{ fontSize: 16, margin: '0 0 10px' }}>
          {audit.summary.metadataSlots - audit.summary.missingMetadataSlots}/
          {audit.summary.metadataSlots} slots known
        </h3>
        <table style={{ borderCollapse: 'collapse', minWidth: 1040, width: '100%' }}>
          <thead>
            <tr>
              <th style={tableHeadStyle}>App</th>
              <th style={tableHeadStyle}>Status</th>
              <th style={tableHeadStyle}>Account label</th>
              <th style={tableHeadStyle}>Auth pointer</th>
              <th style={tableHeadStyle}>Export path</th>
              <th style={tableHeadStyle}>Output kinds</th>
              <th style={tableHeadStyle}>Evidence pointer</th>
              <th style={tableHeadStyle}>Next action</th>
            </tr>
          </thead>
          <tbody>
            {metadataTargets.map((target) => (
              <tr key={target.name}>
                <td style={tableCellStyle}>{target.name}</td>
                <td style={tableCellStyle}>{target.status}</td>
                <td style={tableCellStyle}>{metadataCell(target, 'account_label')}</td>
                <td style={tableCellStyle}>{metadataCell(target, 'auth_pointer')}</td>
                <td style={tableCellStyle}>{metadataCell(target, 'default_export_path')}</td>
                <td style={tableCellStyle}>{metadataCell(target, 'output_kinds')}</td>
                <td style={tableCellStyle}>{metadataCell(target, 'evidence_pointer')}</td>
                <td style={tableCellStyle}>{target.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const LiveGtmTeamOperatingStatusSection = ({
  status,
}: {
  status: AzaLiveGtmTeamOperatingStatusMap;
}) => {
  const laneItems = status.laneStatus.map((lane): [string, string, string] => [
    lane.name,
    `${lane.status} / ${lane.ownerRole}`,
    `Cadence: ${lane.cadence}. Cards: ${lane.totalCards}, blocked: ${lane.blockedCards}. Records: ${lane.recordTypes.length > 0 ? lane.recordTypes.join(', ') : 'none'}. Target: ${lane.durableTarget}. Next: ${lane.nextAction}`,
  ]);
  const loopItems = status.operatingLoop.map((loop): [string, string, string] => [
    loop.id,
    `${loop.status} / ${loop.owner}`,
    `${loop.rule} Evidence: ${loop.evidence.join(', ')}.`,
  ]);
  const focusItems = status.focusItems
    .slice(0, 24)
    .map((item): [string, string, string] => [
      item.title,
      `${item.status} / ${item.owner}`,
      `Lane: ${item.lane}. Records: ${item.recordTypes.length > 0 ? item.recordTypes.join(', ') : 'none'}. Blocked by: ${item.blockedBy.length > 0 ? item.blockedBy.join(', ') : 'none'}. Next: ${item.nextAction}. Evidence: ${item.evidence.join(', ')}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'GTM/team status summary',
      `${status.summary.gtmLanes} lanes / ${status.summary.gtmRecordTypes} record types`,
      `Board cards: ${status.summary.operatingBoardCards}. Blocked cards: ${status.summary.blockedBoardCards}. Team record routes: ${status.summary.teamRecordRoutes}. Blocked record routes: ${status.summary.blockedRecordRoutes}. Workflow stages: ${status.summary.workflowStages}. Blocked stages: ${status.summary.blockedWorkflowStages}. Approval-required stages: ${status.summary.approvalRequiredWorkflowStages}. Canonical write ready: ${status.summary.canonicalWriteReady ? 'yes' : 'no'}. Durable board ready: ${status.summary.durableBoardReady ? 'yes' : 'no'}. Durable handoff ready: ${status.summary.durableHandoffReady ? 'yes' : 'no'}. Writes allowed: ${status.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Operating rules',
      'read-only command status',
      `${status.recommendation.commandRule} ${status.recommendation.gtmRule} ${status.recommendation.memoryRule} ${status.recommendation.writeRule}`,
    ],
    [
      'Safety boundary',
      'labels and route pointers only',
      `Captured: ${status.safety.captured.join(', ')}. Excluded: ${status.safety.excluded.join(', ')}.`,
    ],
    ...laneItems,
    ...loopItems,
    ...focusItems,
  ];

  return (
    <Section
      eyebrow={'GTM and team operating status'}
      items={items}
      title={'Daily command, GTM lanes, team record routes, blockers, and next actions'}
    />
  );
};

const LiveContentAppMetadataCollectionPlanSection = ({
  plan,
}: {
  plan: AzaLiveContentAppMetadataCollectionPlanMap;
}) => {
  const packetItems = plan.packets
    .slice(0, 36)
    .map((packet): [string, string, string] => [
      packet.app,
      `${packet.status} / ${packet.automationMode}`,
      `Missing: ${packet.missingFields.length > 0 ? packet.missingFields.join(', ') : 'none'}. Methods: ${[
        ...new Set(packet.collectionFields.map((field) => field.method)),
      ].join(', ')}. Records: ${packet.recordTargets.join(', ')}. Next: ${packet.nextAction}`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Collection plan summary',
      `${plan.summary.packets} packets / ${plan.summary.missingCollectionFields} fields missing`,
      `Browser-assisted: ${plan.summary.browserAssistedPackets}. Manual: ${plan.summary.manualPackets}. Known: ${plan.summary.knownPackets}. Blocked: ${plan.summary.blockedPackets}. Collection fields: ${plan.summary.collectionFields}. Writes allowed: ${plan.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Browser session rule',
      'input/output adapter only',
      `${plan.recommendation.browserSessionRule} ${plan.recommendation.collectionRule}`,
    ],
    [
      'Promotion rule',
      'AzA before projection',
      `${plan.recommendation.promotionRule} ${plan.recommendation.writeRule}`,
    ],
    [
      'Safety boundary',
      'labels and pointers only',
      `Captured: ${plan.safety.captured.join(', ')}. Excluded: ${plan.safety.excluded.join(', ')}.`,
    ],
    ...packetItems,
  ];

  return (
    <Section
      eyebrow={'Metadata collection plan'}
      items={items}
      title={'Browser and Electron session input/output packets for the next audit pass'}
    />
  );
};

const LiveAccessCapabilitySection = ({ access }: { access: AzaLiveAccessCapabilityMap }) => {
  const laneItems = access.lanes.map((lane): [string, string, string] => [
    lane.label,
    `${lane.surfaceCount} surfaces / ${lane.status}`,
    `Apps: ${lane.appExamples.length > 0 ? lane.appExamples.join(', ') : 'none'}. Next: ${lane.nextAction}`,
  ]);
  const surfaceItems = access.surfaces
    .slice(0, 48)
    .map((surface): [string, string, string] => [
      surface.app,
      `${surface.category} / ${surface.automationMode} / ${surface.status}`,
      `Visible: ${surface.visible ? 'yes' : 'no'}. Account label: ${surface.accountLabelStatus}. Auth pointer: ${surface.authPointerStatus}. Output path: ${surface.outputPathStatus}. Evidence: ${surface.evidencePointerStatus}. Possible after login: ${surface.capabilitiesAfterLogin.join(' ')} Required before capture: ${surface.requiredBeforeCapture.join(', ')}. Required before action: ${surface.requiredBeforeAction.join(', ')}. Blocked: ${surface.blockedActions.join(', ')}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Access capability summary',
      `${access.summary.surfaces} surfaces / ${access.summary.visibleSurfaces} visible`,
      `Account labels known: ${access.summary.accountLabelsKnown}. Auth pointers known: ${access.summary.authPointersKnown}. Browser/web surfaces: ${access.summary.browserSurfaces}. Read-only ready: ${access.summary.readyReadOnlySurfaces}. Draft ready: ${access.summary.draftReadySurfaces}. Reviewed capture ready: ${access.summary.reviewedCaptureReadySurfaces}. Audit required: ${access.summary.auditRequiredSurfaces}. Approval required: ${access.summary.approvalRequiredSurfaces}. Blocked: ${access.summary.blockedSurfaces}. Writes allowed: ${access.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Login rule',
      'access is not consent',
      `${access.recommendation.loginRule} ${access.recommendation.useRule} ${access.recommendation.projectionRule}`,
    ],
    [
      'Safety boundary',
      'capability labels only',
      `Captured: ${access.safety.captured.join(', ')}. Excluded: ${access.safety.excluded.join(', ')}.`,
    ],
    ...laneItems,
    ...surfaceItems,
  ];

  return (
    <Section
      eyebrow={'Live access capability map'}
      items={items}
      title={'What becomes possible after login, and what still requires approval'}
    />
  );
};

const LiveProjectMapSection = ({ projectMap }: { projectMap: AzaLiveProjectMap }) => {
  const rootItems = projectMap.roots.map((root): [string, string, string] => [
    root.id,
    `${root.exists ? 'present' : 'missing'} / ${root.summary.topLevelDirectories} top-level directories`,
    `Path: ${root.path}. Role: ${root.role}. Git repos: ${root.summary.gitRepositories}. package.json projects: ${root.summary.packageJsonProjects}. pnpm workspaces: ${root.summary.pnpmWorkspaces}. AGENTS.md: ${root.summary.agentInstructionFiles}. CLAUDE.md: ${root.summary.claudeInstructionFiles}.`,
  ]);
  const keyEntries = projectMap.roots
    .flatMap((root) => root.entries)
    .filter(
      (entry) =>
        entry.category !== 'workspace-or-uncategorized' ||
        entry.hasGit ||
        entry.hasPackageJson ||
        entry.hasAgentInstructions,
    )
    .slice(0, 36)
    .map((entry): [string, string, string] => [
      entry.name,
      `${entry.category}${entry.hasGit ? ' / git' : ''}${entry.hasPackageJson ? ' / package' : ''}`,
      `Path: ${entry.path}. Markers: ${
        entry.markers
          .filter((marker) => marker.exists)
          .map((marker) => marker.name)
          .join(', ') || 'none'
      }. Modified: ${entry.modifiedAt ?? 'unknown'}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Live project summary',
      `${projectMap.summary.rootsPresent}/${projectMap.summary.rootsTotal} roots present`,
      `Top-level directories: ${projectMap.summary.topLevelDirectories}. Git repos: ${projectMap.summary.gitRepositories}. package.json projects: ${projectMap.summary.packageJsonProjects}. pnpm workspaces: ${projectMap.summary.pnpmWorkspaces}. AGENTS.md: ${projectMap.summary.agentInstructionFiles}. CLAUDE.md: ${projectMap.summary.claudeInstructionFiles}. Writes allowed: ${projectMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Category counts',
      'live workspace categories',
      Object.entries(projectMap.categoryCounts)
        .map(([category, count]) => `${category}: ${count}`)
        .join(', '),
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${projectMap.safety.captured.join(', ')}. Excluded: ${projectMap.safety.excluded.join(', ')}.`,
    ],
    ...rootItems,
    ...keyEntries,
  ];

  return (
    <Section
      eyebrow={'Live project map'}
      items={items}
      title={'VAN, LobeHub, and Desktop/VAN project roots with safe markers'}
    />
  );
};

const LiveWorkspaceRootReconciliationSection = ({
  reconciliation,
}: {
  reconciliation: AzaLiveWorkspaceRootReconciliationMap;
}) => {
  const rootItems = reconciliation.rootStates.map((root): [string, string, string] => [
    root.expectedOwner,
    `${root.layer} / ${root.status}`,
    `Path: ${root.path}. Branch: ${root.git.branch ?? 'none'}. Git: ${root.git.gitPresent ? root.git.mode : 'missing'}. Directories: ${root.directDirectories}. Files: ${root.directFiles}. Project entries: ${root.projectEntries}. Listeners: ${root.serviceListenerCount}. Markers: ${
      root.markers
        .filter((marker) => marker.exists)
        .map((marker) => marker.name)
        .join(', ') || 'none'
    }. Write policy: ${root.writePolicy}.`,
  ]);
  const decisionItems = reconciliation.decisions.map((decision): [string, string, string] => [
    decision.owner,
    `${decision.rootId} / ${decision.status}`,
    `Next: ${decision.nextAction}. Evidence: ${decision.evidence.join(', ')}.`,
  ]);
  const pathItems = reconciliation.communicationPaths.map((route): [string, string, string] => [
    `${route.from} -> ${route.to}`,
    `${route.channel} / ${route.status}`,
    `Approval: ${route.approval}. Evidence: ${route.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Workspace root reconciliation summary',
      `${reconciliation.summary.rootsPresent}/${reconciliation.summary.rootsTotal} roots present`,
      `Command harness present: ${reconciliation.summary.commandHarnessPresent ? 'yes' : 'no'}. Legacy root present: ${reconciliation.summary.legacyRootPresent ? 'yes' : 'no'}. VAN listeners: ${reconciliation.summary.vanListenerCount}. Desktop/VAN listeners: ${reconciliation.summary.desktopVanListenerCount}. Decisions needing reconciliation: ${reconciliation.summary.decisionsNeedingReconciliation}. Writes allowed: ${reconciliation.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Root policy',
      'where everything sits',
      `${reconciliation.recommendation.commandHarness} ${reconciliation.recommendation.runtimeWorkspace} ${reconciliation.recommendation.azaTarget} ${reconciliation.recommendation.projectionRule} ${reconciliation.recommendation.legacyRule}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${reconciliation.safety.captured.join(', ')}. Excluded: ${reconciliation.safety.excluded.join(', ')}.`,
    ],
    ...rootItems,
    ...decisionItems,
    ...pathItems,
  ];

  return (
    <Section
      eyebrow={'Live workspace root reconciliation'}
      items={items}
      title={'Where LobeHub, VAN, AzA, VANTA-Brain, Codex, Hermes, and legacy roots sit'}
    />
  );
};

const LiveArchitectureDataFlowSection = ({
  dataFlow,
}: {
  dataFlow: AzaLiveArchitectureDataFlowMap;
}) => {
  const nodeItems = dataFlow.nodes.map((node): [string, string, string] => [
    node.label,
    `${node.layer} / ${node.status}`,
    `Surface: ${node.pathOrSurface}. Owner: ${node.owner}. Role: ${node.role}. Read policy: ${node.readPolicy}. Write policy: ${node.writePolicy}. Evidence: ${node.evidence.join(', ')}.`,
  ]);
  const edgeItems = dataFlow.edges.map((edge): [string, string, string] => [
    `${edge.from} -> ${edge.to}`,
    `${edge.channel} / ${edge.status}`,
    `Payloads: ${edge.payloads.join(', ')}. Approval: ${edge.approval}. Blocked by: ${
      edge.blockedBy.length > 0 ? edge.blockedBy.join(', ') : 'none'
    }. Evidence: ${edge.evidence.join(', ')}.`,
  ]);
  const gateItems = dataFlow.gates.map((gate): [string, string, string] => [
    gate.label,
    `${gate.id} / ${gate.status}`,
    `Next proof: ${gate.nextProof}. Evidence: ${gate.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Architecture data-flow summary',
      `${dataFlow.summary.nodes} nodes / ${dataFlow.summary.edges} edges`,
      `Active read-only edges: ${dataFlow.summary.activeReadOnlyEdges}. Active manual edges: ${dataFlow.summary.activeManualEdges}. Approval-required edges: ${dataFlow.summary.approvalRequiredEdges}. Blocked edges: ${dataFlow.summary.blockedEdges}. Planned edges: ${dataFlow.summary.plannedEdges}. Memory sources: ${dataFlow.summary.memorySources}. Content stages: ${dataFlow.summary.contentStages}. Team record routes: ${dataFlow.summary.teamRecordRoutes}. Workspace decisions needing reconciliation: ${dataFlow.summary.workspaceDecisionsNeedingReconciliation}. Writes allowed: ${dataFlow.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Brain model decision',
      'Hybrid brain model',
      `${dataFlow.recommendation.commandModel} ${dataFlow.recommendation.unifiedModel} ${dataFlow.recommendation.granularModel} ${dataFlow.recommendation.projectionModel}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${dataFlow.safety.captured.join(', ')}. Excluded: ${dataFlow.safety.excluded.join(', ')}.`,
    ],
    ...nodeItems,
    ...edgeItems,
    ...gateItems,
  ];

  return (
    <Section
      eyebrow={'Live architecture data flow'}
      items={items}
      title={
        'How LobeHub, Codex, VAN, agents, AzA, GTM, content apps, and VANTA-Brain exchange data'
      }
    />
  );
};

const LiveAzaImplementationSection = ({
  implementation,
}: {
  implementation: AzaLiveAzaImplementationMap;
}) => {
  const serviceItems = implementation.services.map((service): [string, string, string] => [
    service.label,
    `${service.port} / ${service.status}`,
    `Entrypoint: ${service.entrypoint}. Listener visible: ${
      service.listenerVisible ? 'yes' : 'no'
    }. Role: ${service.role}.`,
  ]);
  const capabilityItems = implementation.apiCapabilities.map(
    (capability): [string, string, string] => [
      capability.label,
      `${capability.id} / ${capability.status}`,
      `${capability.notes}. Evidence: ${capability.evidence.join(', ')}.`,
    ],
  );
  const packageItems = implementation.packages.map((packageGroup): [string, string, string] => [
    packageGroup.id,
    packageGroup.present ? 'present' : 'missing',
    `Path: ${packageGroup.path}. Role: ${packageGroup.role}.`,
  ]);
  const composeItems: Array<[string, string, string]> = [
    [
      'Compose topology',
      `${implementation.compose.services.length} services / ${implementation.compose.portBindings.length} localhost ports`,
      `Services: ${implementation.compose.services.join(', ') || 'none'}. Healthchecks: ${
        implementation.compose.healthcheckServices.join(', ') || 'none'
      }. Ports: ${implementation.compose.portBindings.join(', ') || 'none'}. Init SQL mounts: ${
        implementation.compose.initSqlMounts.join(', ') || 'none'
      }. Volumes: ${implementation.compose.volumes.join(', ') || 'none'}.`,
    ],
  ];
  const migrationItems = implementation.migrations.map((migration): [string, string, string] => [
    'Migration',
    `${migration.sizeBytes} bytes / ${migration.tableStatements.length} table statements`,
    `Path: ${migration.path}. Modified: ${migration.modifiedAt ?? 'unknown'}. Tables: ${
      migration.tableStatements.join(', ') || 'none'
    }.`,
  ]);
  const fileItems = implementation.files.map((file): [string, string, string] => [
    file.id,
    file.kind,
    `Path: ${file.path}. Role: ${file.role}. Size: ${file.sizeBytes ?? 'n/a'}. Modified: ${
      file.modifiedAt ?? 'unknown'
    }.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'AzA implementation summary',
      `${implementation.summary.filesPresent}/${implementation.summary.filesTotal} files present`,
      `Services running: ${implementation.summary.runningServices}/${implementation.summary.servicesTotal}. Compose services: ${implementation.summary.servicesInCompose}. Healthchecks: ${implementation.summary.healthcheckServices}. Localhost port bindings: ${implementation.summary.portBindings}. Migration files: ${implementation.summary.migrationFiles}. Init SQL mounts: ${implementation.summary.initSqlMounts}. Package groups: ${implementation.summary.packageGroupsPresent}/${implementation.summary.packageGroupsTotal}. API capabilities: ${implementation.summary.apiCapabilities}. MCP tools implemented: ${implementation.summary.implementedMcpTools}. MCP placeholders: ${implementation.summary.placeholderMcpTools}. Database tables: ${implementation.summary.databaseTables}. Env names: ${implementation.summary.envNames}. Writes allowed: ${implementation.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Implementation status',
      'current proof state',
      `${implementation.recommendation.status} Next proof: ${implementation.recommendation.nextProof.join(' ')}`,
    ],
    [
      'Manifest',
      implementation.packageManifest.packageManager ?? 'package manager unknown',
      `Scripts: ${implementation.packageManifest.scripts.join(', ') || 'none'}. Dependencies: ${
        implementation.packageManifest.dependencyNames.join(', ') || 'none'
      }. Dev dependencies: ${implementation.packageManifest.devDependencyNames.join(', ') || 'none'}.`,
    ],
    [
      'MCP tool split',
      `${implementation.mcpTools.implemented.length} implemented / ${implementation.mcpTools.placeholder.length} placeholder`,
      `Implemented: ${
        implementation.mcpTools.implemented.join(', ') || 'none'
      }. Placeholder: ${implementation.mcpTools.placeholder.join(', ') || 'none'}.`,
    ],
    [
      'Database schema surface',
      `${implementation.databaseTables.length} tables`,
      implementation.databaseTables.join(', ') || 'No table exports detected.',
    ],
    [
      'Environment names',
      `${implementation.envNames.length} names from .env.example`,
      implementation.envNames.join(', ') || 'No env names detected.',
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${implementation.safety.captured.join(', ')}. Excluded: ${implementation.safety.excluded.join(', ')}.`,
    ],
    ...composeItems,
    ...migrationItems,
    ...serviceItems,
    ...capabilityItems,
    ...packageItems,
    ...fileItems,
  ];

  return (
    <Section
      eyebrow={'Live AzA implementation inventory'}
      items={items}
      title={'What exists under /Users/growthgod/VAN/aza_memory and what is still blocked'}
    />
  );
};

const LiveGtmMapSection = ({ gtmMap }: { gtmMap: AzaLiveGtmMap }) => {
  const laneItems = gtmMap.lanes.map((lane): [string, string, string] => [
    lane.name,
    `${lane.ownerRole} / ${lane.cadence}`,
    `Objective: ${lane.objective}. Records: ${lane.records.join(', ')}.`,
  ]);
  const recordItems = gtmMap.recordTypes.map((recordType): [string, string, string] => [
    recordType.name,
    `${recordType.requiredFields.length} fields / ${recordType.statuses.length} statuses`,
    `${recordType.description}. Required: ${recordType.requiredFields.join(', ')}. Statuses: ${recordType.statuses.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Live GTM summary',
      `${gtmMap.summary.lanes} lanes / ${gtmMap.summary.recordTypes} record types`,
      `Boards: ${gtmMap.summary.boards}. Required fields: ${gtmMap.summary.requiredFields}. Role count: ${gtmMap.summary.roleCount}. Workflow steps: ${gtmMap.summary.workflowSteps}. Approval gates: ${gtmMap.summary.approvalGates}. Writes allowed: ${gtmMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Operating board status',
      `${gtmMap.operatingBoard.blockedCards}/${gtmMap.operatingBoard.totalCards} blocked`,
      `By status: ${gtmMap.operatingBoard.cardsByStatus.map((item) => `${item.status}: ${item.count}`).join(', ')}. By owner: ${gtmMap.operatingBoard.cardsByOwner.map((item) => `${item.owner}: ${item.count}`).join(', ')}.`,
    ],
    [
      'Approval boundary',
      gtmMap.privacyAndApproval.defaultMode,
      `Approval required for: ${gtmMap.privacyAndApproval.approvalRequiredFor.join(', ')}. Blocked data: ${gtmMap.privacyAndApproval.blockedData.join(', ')}.`,
    ],
    [
      'Safety boundary',
      'metadata and schemas only',
      `Captured: ${gtmMap.safety.captured.join(', ')}. Excluded: ${gtmMap.safety.excluded.join(', ')}.`,
    ],
    ...laneItems,
    ...recordItems,
  ];

  return (
    <Section
      eyebrow={'Live GTM map'}
      items={items}
      title={'GTM lanes, team ownership, record schemas, and operating-board status'}
    />
  );
};

const LiveTeamDataRoutingSection = ({ routing }: { routing: AzaLiveTeamDataRoutingMap }) => {
  const laneItems = routing.lanes.map((lane): [string, string, string] => [
    lane.name,
    `${lane.ownerRole} / ${lane.status}`,
    `Board: ${lane.board}. Cadence: ${lane.cadence}. Records: ${lane.records.join(', ')}. Current store: ${lane.currentStore}. Durable target: ${lane.durableTarget}. Gate: ${lane.writeGate}. Next: ${lane.nextAction}. Evidence: ${lane.evidence.join(', ')}.`,
  ]);
  const recordItems = routing.recordRoutes.map((record): [string, string, string] => [
    record.recordType,
    `${record.ownerRoles.join(', ')} / ${record.status}`,
    `Lanes: ${record.laneIds.length > 0 ? record.laneIds.join(', ') : 'not lane-bound'}. Current store: ${record.currentStore}. Canonical target: ${record.canonicalTarget}. Projection: ${record.projectionTarget}. Required fields: ${record.requiredFields.join(', ')}. Required before write: ${record.requiredBeforeWrite.join(', ')}. Blocked by: ${record.blockedBy.length > 0 ? record.blockedBy.join(' ') : 'none'}.`,
  ]);
  const handoffItems = routing.handoffs.map((handoff): [string, string, string] => [
    `${handoff.from} -> ${handoff.to}`,
    `${handoff.channel} / ${handoff.status}`,
    `Records: ${handoff.recordTypes.join(', ')}. Approval: ${handoff.approval}. Blocked by: ${handoff.blockedBy.length > 0 ? handoff.blockedBy.join(' ') : 'none'}. Evidence: ${handoff.evidence.join(', ')}.`,
  ]);
  const storageItems = routing.storageBoundaries.map((boundary): [string, string, string] => [
    boundary.layer,
    `${boundary.pathOrSurface} / ${boundary.status}`,
    `Records: ${boundary.recordTypes.join(', ')}. Read: ${boundary.readPolicy}. Write: ${boundary.writePolicy}`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Team data routing summary',
      `${routing.summary.lanes} lanes / ${routing.summary.recordRoutes} record routes / ${routing.handoffs.length} handoffs`,
      `Owners: ${routing.summary.teamOwners}. Blocked record routes: ${routing.summary.blockedRecordRoutes}. Active read-only handoffs: ${routing.summary.activeReadOnlyHandoffs}. Approval-required handoffs: ${routing.summary.approvalRequiredHandoffs}. Blocked handoffs: ${routing.summary.blockedHandoffs}. Canonical write ready: ${routing.summary.canonicalWriteReady ? 'yes' : 'no'}. Durable board ready: ${routing.summary.durableBoardReady ? 'yes' : 'no'}. Writes allowed: ${routing.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Routing rule',
      'LobeHub command context first',
      `${routing.recommendation.commandRule} ${routing.recommendation.dataRule} ${routing.recommendation.projectionRule} ${routing.recommendation.storageRule}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${routing.safety.captured.join(', ')}. Excluded: ${routing.safety.excluded.join(', ')}.`,
    ],
    ...laneItems,
    ...recordItems,
    ...handoffItems,
    ...storageItems,
  ];

  return (
    <Section
      eyebrow={'Live team data routing'}
      items={items}
      title={'Team lanes, record routes, handoffs, storage boundaries, and blockers'}
    />
  );
};

const LiveCommandGateSection = ({ gateMap }: { gateMap: AzaLiveCommandGateMap }) => {
  const gateItems = gateMap.gates.map((gate): [string, string, string] => [
    gate.label,
    gate.status,
    `Owner: ${gate.owner}. Reason: ${gate.reason}. Next: ${gate.nextAction}. Required before: ${gate.requiredBefore.join(', ')}. Evidence: ${gate.evidence.join(', ')}.`,
  ]);
  const blockedWriteItems = gateMap.blockedWrites.map((write): [string, string, string] => [
    write.target,
    write.status,
    write.reason,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Live command gate summary',
      `${gateMap.summary.passedGates}/${gateMap.summary.totalGates} passed`,
      `Blocked: ${gateMap.summary.blockedGates}. Approval required: ${gateMap.summary.approvalRequiredGates}. Read adapters: ${gateMap.summary.readAdapters}. Canonical writes allowed: ${gateMap.summary.canonicalWritesAllowed ? 'yes' : 'no'}. Writes allowed: ${gateMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'gate labels only',
      `Captured: ${gateMap.safety.captured.join(', ')}. Excluded: ${gateMap.safety.excluded.join(', ')}.`,
    ],
    ...gateItems,
    ...blockedWriteItems,
  ];

  return (
    <Section
      eyebrow={'Live command gates'}
      items={items}
      title={'Read gates, blocked writes, approval-required actions, and next proof steps'}
    />
  );
};

const LiveImplementationProofSection = ({
  proofMap,
}: {
  proofMap: AzaLiveImplementationProofMap;
}) => {
  const phaseItems = proofMap.phases.map((phase): [string, string, string] => [
    phase.label,
    phase.status,
    `Outcome: ${phase.outcome}. Gates: ${phase.gates.join(', ')}.`,
  ]);
  const gateItems = proofMap.gates.map((gate): [string, string, string] => [
    gate.title,
    `${gate.owner} / ${gate.status}`,
    `Proof needed: ${gate.proofNeeded}. Blockers: ${gate.blockers.length > 0 ? gate.blockers.join(' ') : 'none'}. Next: ${gate.nextAction}. Evidence: ${gate.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Implementation proof summary',
      `${proofMap.summary.passedGates}/${proofMap.summary.totalGates} passed`,
      `Blocked: ${proofMap.summary.blockedGates}. Partial: ${proofMap.summary.partialGates}. Planned: ${proofMap.summary.plannedGates}. Approval required: ${proofMap.summary.approvalRequiredGates}. Writes allowed: ${proofMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'proof labels only',
      `Captured: ${proofMap.safety.captured.join(', ')}. Excluded: ${proofMap.safety.excluded.join(', ')}.`,
    ],
    ...phaseItems,
    ...gateItems,
  ];

  return (
    <Section
      eyebrow={'Live implementation proof'}
      items={items}
      title={'Ordered proof gates before canonical writes, durable boards, and projection'}
    />
  );
};

const LiveAzaVerificationRunbookSection = ({
  runbook,
}: {
  runbook: AzaLiveVerificationRunbookMap;
}) => {
  const serviceItems = runbook.serviceContracts.map((service): [string, string, string] => [
    service.label,
    `${service.port} / ${service.listening ? 'listening' : 'not listening'}`,
    `Health: ${service.healthUrl}. Ready: ${service.readyUrl}. Required for: ${service.requiredFor.join(', ')}.`,
  ]);
  const stepItems = runbook.steps.map((step): [string, string, string] => [
    step.title,
    `${step.phase} / ${step.status} / ${step.commandKind}`,
    `Cwd: ${step.cwd}. Command preview: ${step.commandPreview}. Approval: ${step.approval}. Blocked by: ${step.blockedBy.length > 0 ? step.blockedBy.join(' ') : 'none'}. Expected evidence: ${step.expectedEvidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Verification runbook summary',
      `${runbook.summary.passedSteps}/${runbook.summary.steps} steps passed`,
      `Ready to probe: ${runbook.summary.readyToProbeSteps}. Approval required: ${runbook.summary.approvalRequiredSteps}. Blocked: ${runbook.summary.blockedSteps}. VAN command steps: ${runbook.summary.vanCommandSteps}. Service contracts: ${runbook.summary.serviceContracts}. Writes allowed: ${runbook.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Runbook rule',
      'proof before writes',
      `${runbook.recommendation.firstAction} ${runbook.recommendation.proofRule} ${runbook.recommendation.writeRule}`,
    ],
    [
      'Safety boundary',
      'command previews only',
      `Captured: ${runbook.safety.captured.join(', ')}. Excluded: ${runbook.safety.excluded.join(', ')}.`,
    ],
    ...serviceItems,
    ...stepItems,
  ];

  return (
    <Section
      eyebrow={'Live AzA verification runbook'}
      items={items}
      title={'Exact probes and approvals needed before AzA can become the live brain'}
    />
  );
};

const LiveCanonicalStoreSection = ({ storeMap }: { storeMap: AzaLiveCanonicalStoreMap }) => {
  const envItems = storeMap.env.required.map((env): [string, string, string] => [
    env.id,
    env.present ? 'present' : 'missing',
    `${env.description} Required: ${env.required ? 'yes' : 'no'}. Source: ${env.source}.`,
  ]);
  const checkItems = storeMap.checks.map((check): [string, string, string] => [
    check.title,
    check.status,
    `Required before: ${check.requiredBefore.join(', ')}. Evidence: ${check.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Canonical store summary',
      `${storeMap.summary.readyChecks}/${storeMap.summary.totalChecks} ready`,
      `Required env present: ${storeMap.summary.requiredEnvPresent}/${storeMap.summary.requiredEnvTotal}. Blocked: ${storeMap.summary.blockedChecks}. Partial: ${storeMap.summary.partialChecks}. Connection attempted: ${storeMap.summary.connectionAttempted ? 'yes' : 'no'}. Writes allowed: ${storeMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Database driver',
      storeMap.env.driver.configured,
      `Supported: ${storeMap.env.driver.supported ? 'yes' : 'no'}. Defaulted: ${storeMap.env.driver.defaulted ? 'yes' : 'no'}. Supported values: ${storeMap.env.driver.supportedValues.join(', ')}.`,
    ],
    [
      'Safety boundary',
      'presence only',
      `Captured: ${storeMap.safety.captured.join(', ')}. Excluded: ${storeMap.safety.excluded.join(', ')}.`,
    ],
    ...envItems,
    ...checkItems,
  ];

  return (
    <Section
      eyebrow={'Live canonical store'}
      items={items}
      title={'Store prerequisites, driver support, and proof tasks without secret exposure'}
    />
  );
};

const LiveCodexHarnessSection = ({ harness }: { harness: AzaLiveCodexHarnessMap }) => {
  const primitiveItems = harness.primitives.map((primitive): [string, string, string] => [
    primitive.title,
    primitive.status,
    `Role: ${primitive.role}. Evidence: ${primitive.evidence.join(', ')}.`,
  ]);
  const laneItems = harness.lanes.map((lane): [string, string, string] => [
    lane.label,
    `${lane.executor} / ${lane.status}`,
    `Input: ${lane.input}. Output: ${lane.output}. Approval: ${lane.approval}. Next: ${lane.nextAction}. Evidence: ${lane.evidence.join(', ')}.`,
  ]);
  const handoffItems = harness.handoffSteps.map((step): [string, string, string] => [
    step.label,
    `${step.from} -> ${step.to} / ${step.status}`,
    `Contract: ${step.contract}. Evidence: ${step.evidence.join(', ')}.`,
  ]);
  const pathItems = harness.pathProbes.map((probe): [string, string, string] => [
    probe.id,
    probe.present ? 'present' : 'missing',
    probe.path,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Codex harness summary',
      `${harness.summary.activeManualLanes}/${harness.summary.lanes} manual-active lanes`,
      `Primitives: ${harness.summary.primitives}. Blocked lanes: ${harness.summary.blockedLanes}. Approval-required lanes: ${harness.summary.approvalRequiredLanes}. Durable handoff ready: ${harness.summary.durableHandoffReady ? 'yes' : 'no'}. Codex app: ${harness.summary.codexAppPresent ? 'present' : 'missing'}. Codex state: ${harness.summary.codexStatePresent ? 'present' : 'missing'}. Writes allowed: ${harness.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'bridge metadata only',
      `Captured: ${harness.safety.captured.join(', ')}. Excluded: ${harness.safety.excluded.join(', ')}.`,
    ],
    ...pathItems,
    ...primitiveItems,
    ...laneItems,
    ...handoffItems,
  ];

  return (
    <Section
      eyebrow={'Live Codex harness'}
      items={items}
      title={'LobeHub command surface, Codex executor lanes, approvals, and evidence handoff'}
    />
  );
};

const LiveCommandRecordSchemaSection = ({
  schemaMap,
}: {
  schemaMap: AzaLiveCommandRecordSchemaMap;
}) => {
  const recordItems = schemaMap.recordSchemas.map((record): [string, string, string] => [
    record.title,
    `${record.writer} / ${record.status}`,
    `Owner: ${record.owner}. Gate: ${record.writeGate}. Sensitivity: ${record.sensitivityDefault}. Readers: ${record.readers.join(', ')}. Required fields: ${record.requiredFields.join(', ')}. Blocked by: ${record.blockedBy.length > 0 ? record.blockedBy.join(', ') : 'none'}. Evidence: ${record.evidence.join(', ')}.`,
  ]);
  const lifecycleItems = schemaMap.lifecycle.map((step): [string, string, string] => [
    step.label,
    `${step.from} -> ${step.to} / ${step.status}`,
    `Output record: ${step.outputRecord}. Evidence: ${step.evidence.join(', ')}.`,
  ]);
  const fieldItems = schemaMap.fieldCatalog.map((field): [string, string, string] => [
    field.id,
    field.requiredFor.join(', '),
    `${field.description} Safety: ${field.safetyRule}`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Command record schema summary',
      `${schemaMap.summary.recordTypes} record types / ${schemaMap.summary.requiredFields} unique required fields`,
      `Blocked: ${schemaMap.summary.blockedRecords}. Planned: ${schemaMap.summary.plannedRecords}. Approval required: ${schemaMap.summary.approvalRequiredRecords}. Modeled: ${schemaMap.summary.modeledRecords}. Durable write ready: ${schemaMap.summary.durableWriteReady ? 'yes' : 'no'}. Writes allowed: ${schemaMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'schema labels only',
      `Captured: ${schemaMap.safety.captured.join(', ')}. Excluded: ${schemaMap.safety.excluded.join(', ')}.`,
    ],
    ...recordItems,
    ...lifecycleItems,
    ...fieldItems,
  ];

  return (
    <Section
      eyebrow={'Live command record schema'}
      items={items}
      title={
        'Typed command, approval, execution, evidence, GTM, content, memory, and projection records'
      }
    />
  );
};

const LiveCommunicationProtocolSection = ({
  protocolMap,
}: {
  protocolMap: AzaLiveCommunicationProtocolMap;
}) => {
  const protocolItems = protocolMap.protocols.map((protocol): [string, string, string] => [
    `${protocol.from} -> ${protocol.to}`,
    `${protocol.transport} / ${protocol.status}`,
    `Purpose: ${protocol.purpose}. Approval: ${protocol.approval}. Blocked by: ${protocol.blockedBy.length > 0 ? protocol.blockedBy.join(', ') : 'none'}. Next proof: ${protocol.nextProof}. Evidence: ${protocol.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Communication protocol summary',
      `${protocolMap.summary.protocolCount} protocols`,
      `Active: ${protocolMap.summary.activeProtocols}. Manual-active: ${protocolMap.summary.activeManualProtocols}. Snapshot: ${protocolMap.summary.snapshotProtocols}. Planned: ${protocolMap.summary.plannedProtocols}. Approval required: ${protocolMap.summary.approvalRequiredProtocols}. Blocked: ${protocolMap.summary.blockedProtocols}. AzA API: ${protocolMap.summary.liveAzAApiAvailable ? 'available' : 'blocked'}. MCP: ${protocolMap.summary.liveMcpAvailable ? 'available' : 'blocked'}. Writes allowed: ${protocolMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'protocol metadata only',
      `Captured: ${protocolMap.safety.captured.join(', ')}. Excluded: ${protocolMap.safety.excluded.join(', ')}.`,
    ],
    ...protocolItems,
  ];

  return (
    <Section
      eyebrow={'Live communication protocols'}
      items={items}
      title={'How LobeHub, Codex, VAN, AzA, MCP, Postgres, agents, apps, and VANTA-Brain talk'}
    />
  );
};

const LiveMcpToolingSection = ({ toolingMap }: { toolingMap: AzaLiveMcpToolingMap }) => {
  const configItems = toolingMap.clientConfigs.map((config): [string, string, string] => [
    config.label,
    `${config.owner} / ${config.present ? config.kind : 'missing'} / ${config.parseStatus}`,
    `Path: ${config.path}. Servers: ${
      config.serverNames.length > 0 ? config.serverNames.join(', ') : 'none detected'
    }. Size: ${config.sizeBytes ?? 'unknown'} bytes. Modified: ${
      config.modifiedAt ?? 'unknown'
    }. Role: ${config.role}`,
  ]);
  const channelItems = toolingMap.toolingChannels.map((channel): [string, string, string] => [
    `${channel.from} -> ${channel.to}`,
    `${channel.transport} / ${channel.status}`,
    `Approval: ${channel.approval}. Evidence: ${channel.evidence.join(', ')}.`,
  ]);
  const proofItems = toolingMap.proofSteps.map((step): [string, string, string] => [
    step.title,
    step.status,
    `Evidence needed: ${step.evidenceNeeded.join(', ')}.`,
  ]);
  const toolItems = toolingMap.tools
    .slice(0, 36)
    .map((tool): [string, string, string] => [
      tool.name,
      tool.status,
      `${tool.role} Evidence: ${tool.evidence.join(', ')}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'MCP tooling summary',
      `${toolingMap.summary.clientConfigsPresent}/${toolingMap.summary.clientConfigFiles} client configs present`,
      `Configured server names: ${toolingMap.summary.configuredServerNames}. AzA MCP healthy: ${toolingMap.summary.azaMcpHealthy ? 'yes' : 'no'}. Implemented tools: ${toolingMap.summary.implementedTools}. Placeholder tools: ${toolingMap.summary.placeholderTools}. Channels: ${toolingMap.summary.toolingChannels}. Ready-to-probe steps: ${toolingMap.summary.readyToProbeSteps}. Blocked proof steps: ${toolingMap.summary.blockedProofSteps}. Writes allowed: ${toolingMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${toolingMap.safety.captured.join(', ')}. Excluded: ${toolingMap.safety.excluded.join(', ')}.`,
    ],
    ...configItems,
    ...channelItems,
    ...proofItems,
    ...toolItems,
  ];

  return (
    <Section
      eyebrow={'Live MCP tooling map'}
      items={items}
      title={'MCP client configs, AzA MCP tools, channels, and proof gates'}
    />
  );
};

const LiveBrowserTaskToolingSection = ({
  toolingMap,
}: {
  toolingMap: AzaLiveBrowserTaskToolingMap;
}) => {
  const toolItems = toolingMap.tools.map((tool): [string, string, string] => [
    tool.name,
    tool.status,
    `Best for: ${tool.bestFor.join(', ')}. Recommendation: ${tool.recommendation} Limits: ${tool.limits.join(', ')}. Blocked by: ${tool.blockedBy.length > 0 ? tool.blockedBy.join(', ') : 'none'}. Evidence: ${tool.evidence.join(', ')}.`,
  ]);
  const routeItems = toolingMap.routes.map((route): [string, string, string] => [
    route.id,
    route.taskClass,
    `Input: ${route.inputSurface}. Output: ${route.outputSurface}. Tools: ${route.preferredToolIds.join(', ')}. Capture: ${route.capturePolicy} Memory: ${route.memoryRule}`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Browser and task tooling summary',
      `${toolingMap.summary.tools} tools / ${toolingMap.summary.routeCount} task routes`,
      `Primary recommendations: ${toolingMap.summary.recommendedPrimaryTools}. Approval-required tools: ${toolingMap.summary.approvalRequiredTools}. Memory write ready: ${toolingMap.summary.memoryWriteReady ? 'yes' : 'no'}. Writes allowed: ${toolingMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Browser Plugin recommendation',
      'preferred browser IO',
      `${toolingMap.recommendation.browserPlugin} ${toolingMap.recommendation.taskRouting}`,
    ],
    [
      'Memory source of truth',
      toolingMap.memorySourceOfTruth.canonical,
      `${toolingMap.recommendation.memory} Granular: ${toolingMap.memorySourceOfTruth.granular} Projection: ${toolingMap.memorySourceOfTruth.projection} Rule: ${toolingMap.memorySourceOfTruth.rule}`,
    ],
    ['Next plan step', 'browser session intake schema', toolingMap.recommendation.nextPlanStep],
    [
      'Safety boundary',
      'recommendation metadata only',
      `Captured: ${toolingMap.safety.captured.join(', ')}. Excluded: ${toolingMap.safety.excluded.join(', ')}.`,
    ],
    ...toolItems,
    ...routeItems,
  ];

  return (
    <Section
      eyebrow={'Live browser task tooling map'}
      items={items}
      title={'Browser Plugin, Computer Use, CDP/RPC, MCP, Codex, and memory routing recommendation'}
    />
  );
};

const LiveToolingRecommendationPlanSection = ({
  plan,
}: {
  plan: AzaLiveToolingRecommendationPlanMap;
}) => {
  const decisionItems = plan.decisions.map((decision): [string, string, string] => [
    decision.decision,
    `${decision.lane} / ${decision.status}`,
    `Rationale: ${decision.rationale} Evidence: ${decision.evidence.join(', ')}.`,
  ]);
  const phaseItems = plan.phases.map((phase): [string, string, string] => [
    `${phase.order}. ${phase.title}`,
    `${phase.lane} / ${phase.status} / ${phase.owner}`,
    `Tools: ${phase.toolIds.join(', ')}. Next: ${phase.nextAction} Memory: ${phase.memoryRule} Blocked by: ${
      phase.blockedBy.length > 0 ? phase.blockedBy.join(', ') : 'none'
    }. Evidence: ${phase.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Recommendation plan summary',
      `${plan.summary.decisions} decisions / ${plan.summary.phases} phases`,
      `Adopt now read-only: ${plan.summary.adoptedNowReadOnly}. Approval required: ${plan.summary.approvalRequired}. Runtime-blocked: ${plan.summary.blockedUntilRuntimeProof}. Deferred until canonical IDs: ${plan.summary.deferredUntilCanonicalIds}. Planned after runtime: ${plan.summary.plannedAfterRuntime}. Writes allowed: ${plan.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Operating plan',
      'tool routing',
      `${plan.recommendation.operatingPlan} ${plan.recommendation.browserPlugin} ${plan.recommendation.mcp}`,
    ],
    [
      'Memory source of truth',
      plan.memorySourceOfTruth.canonical,
      `${plan.recommendation.memory} Granular: ${plan.memorySourceOfTruth.granular} Projection: ${plan.memorySourceOfTruth.projection} Rule: ${plan.memorySourceOfTruth.rule}`,
    ],
    ['First build', 'after write gates', plan.recommendation.firstBuild],
    [
      'Safety boundary',
      'recommendation metadata only',
      `Captured: ${plan.safety.captured.join(', ')}. Excluded: ${plan.safety.excluded.join(', ')}.`,
    ],
    ...decisionItems,
    ...phaseItems,
  ];

  return (
    <Section
      eyebrow={'Live tooling recommendation plan'}
      items={items}
      title={'Ordered plan for Browser Plugin, MCP, Codex, AzA memory, and VANTA-Brain'}
    />
  );
};

const LiveGoalCompletionAuditSection = ({ audit }: { audit: AzaLiveGoalCompletionAuditMap }) => {
  const requirementItems = audit.requirements.map((requirement): [string, string, string] => [
    requirement.requirement,
    `${requirement.status} / ${requirement.id}`,
    `Current proof: ${requirement.currentProof} Remaining blockers: ${
      requirement.remainingBlockers.length > 0 ? requirement.remainingBlockers.join(', ') : 'none'
    }. Next proof: ${requirement.nextProof}. Evidence: ${requirement.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Live goal status',
      audit.overallStatus,
      `Requirements: ${audit.summary.requirements}. Complete boundary: ${audit.summary.completeBoundaryRequirements}. Complete design: ${audit.summary.completeDesignRequirements}. Partial: ${audit.summary.partialRequirements}. Runtime-blocked: ${audit.summary.blockedRuntimeRequirements}. Goal complete: ${audit.summary.goalComplete ? 'yes' : 'no'}. Writes allowed: ${audit.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'live counts and route evidence only',
      `Captured: ${audit.safety.captured.join(', ')}. Excluded: ${audit.safety.excluded.join(', ')}.`,
    ],
    ...requirementItems,
  ];

  return (
    <Section
      eyebrow={'Live goal completion audit'}
      items={items}
      title={'Requirement-by-requirement status for the active AzA architecture goal'}
    />
  );
};

const LiveExecutionSequenceSection = ({ sequence }: { sequence: AzaLiveExecutionSequenceMap }) => {
  const stepItems = sequence.steps.map((step): [string, string, string] => [
    `${step.order}. ${step.title}`,
    `${step.lane} / ${step.status} / ${step.executor}`,
    `Next: ${step.nextAction} Approval target: ${
      step.approvalTarget ?? 'none'
    }. Output record: ${step.outputRecord}. Blocked by: ${
      step.blockedBy.length > 0 ? step.blockedBy.join(', ') : 'none'
    }. Evidence: ${step.currentEvidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Execution sequence summary',
      `${sequence.summary.steps} ordered steps`,
      `Current read-only: ${sequence.summary.currentReadOnlySteps}. Ready read-only: ${sequence.summary.readyReadOnlySteps}. Approval required: ${sequence.summary.approvalRequiredSteps}. Blocked by approval: ${sequence.summary.blockedByApprovalSteps}. Blocked by runtime: ${sequence.summary.blockedByRuntimeSteps}. Planned after runtime: ${sequence.summary.plannedAfterRuntimeSteps}. Writes allowed: ${sequence.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Recommendation',
      'safe first action',
      `${sequence.recommendation.firstSafeAction} ${sequence.recommendation.firstApprovalRequest} ${sequence.recommendation.firstRuntimeProof} ${sequence.recommendation.writeRule}`,
    ],
    [
      'Safety boundary',
      'no execution from this map',
      `Captured: ${sequence.safety.captured.join(', ')}. Excluded: ${sequence.safety.excluded.join(', ')}.`,
    ],
    ...stepItems,
  ];

  return (
    <Section
      eyebrow={'Live execution sequence'}
      items={items}
      title={'Ordered next steps from read-only command center to live AzA brain'}
    />
  );
};

const LiveApprovalPacketSection = ({ packet }: { packet: AzaLiveApprovalPacketMap }) => {
  const approvalItems = packet.packets.map((item): [string, string, string] => [
    item.title,
    `${item.kind} / ${item.status}`,
    `Target: ${item.target}. Approval text: ${item.approvalText} Allowed: ${item.allowedCommandClasses.join(', ')}. Blocked: ${item.blockedCommandClasses.join(', ')}. Evidence before: ${item.evidenceBefore.join(', ')}. Evidence after: ${item.evidenceAfter.join(', ')}. Rollback: ${item.rollbackPlan.join(', ')}. Source steps: ${item.sourceStepIds.join(', ')}.`,
  ]);
  const commandItems = packet.commandPreviews.map((preview): [string, string, string] => [
    preview.title,
    `${preview.phase} / ${preview.status} / ${preview.commandKind}`,
    `Cwd: ${preview.cwd}. Preview: ${preview.commandPreview}. Expected evidence: ${preview.expectedEvidence.join(', ')}. Blocked by: ${preview.blockedBy.length > 0 ? preview.blockedBy.join(', ') : 'none'}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Approval packet summary',
      `${packet.summary.approvalRequiredPackets} approval-required packets`,
      `Blocked by runtime: ${packet.summary.blockedByRuntimePackets}. Current read-only: ${packet.summary.currentReadOnlyPackets}. Command previews: ${packet.summary.commandPreviews}. VAN command previews: ${packet.summary.vanCommandPreviews}. Execution approval steps: ${packet.summary.executionApprovalSteps}. Runbook approval steps: ${packet.summary.runbookApprovalSteps}. Writes allowed: ${packet.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    ['First approval text', 'operator copy', packet.recommendation.firstApprovalText],
    [
      'Recommendation',
      'approval-gated',
      `${packet.recommendation.firstSafeAction} ${packet.recommendation.nextIfApproved} ${packet.recommendation.nextIfDenied}`,
    ],
    [
      'Safety boundary',
      'no execution from this packet',
      `Captured: ${packet.safety.captured.join(', ')}. Excluded: ${packet.safety.excluded.join(', ')}.`,
    ],
    ...approvalItems,
    ...commandItems,
  ];

  return (
    <Section
      eyebrow={'Live approval packet'}
      items={items}
      title={'Exact approval boundaries before any AzA runtime, content app, or projection action'}
    />
  );
};

const LiveDeliveryRoadmapSection = ({ roadmap }: { roadmap: AzaLiveDeliveryRoadmapMap }) => {
  const workstreamItems = roadmap.workstreams.map((workstream): [string, string, string] => [
    workstream.name,
    `${workstream.status} / ${workstream.owner}`,
    `Current: ${workstream.currentState} Next proof: ${workstream.nextProof}. Milestones: ${workstream.milestoneIds.join(', ')}.`,
  ]);
  const milestoneItems = roadmap.milestones.map((milestone): [string, string, string] => [
    milestone.title,
    `${milestone.lane} / ${milestone.status} / ${milestone.owner}`,
    `Deliverable: ${milestone.deliverable} Next: ${milestone.nextAction} Records: ${milestone.recordTypes.join(', ')}. Blocked by: ${milestone.blockedBy.length > 0 ? milestone.blockedBy.join(', ') : 'none'}. Evidence: ${milestone.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Delivery roadmap summary',
      `${roadmap.summary.milestones} milestones / ${roadmap.summary.workstreams} workstreams`,
      `Complete read-only: ${roadmap.summary.completeReadOnlyMilestones}. Modeled read-only: ${roadmap.summary.modeledReadOnlyMilestones}. Approval required: ${roadmap.summary.approvalRequiredMilestones}. Blocked by runtime: ${roadmap.summary.blockedByRuntimeMilestones}. Planned after runtime: ${roadmap.summary.plannedAfterRuntimeMilestones}. Writes allowed: ${roadmap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Current focus',
      'operator roadmap',
      `${roadmap.recommendation.currentFocus} ${roadmap.recommendation.nextApproval} ${roadmap.recommendation.nextBuild} ${roadmap.recommendation.writeRule}`,
    ],
    [
      'Safety boundary',
      'read-only roadmap',
      `Captured: ${roadmap.safety.captured.join(', ')}. Excluded: ${roadmap.safety.excluded.join(', ')}.`,
    ],
    ...workstreamItems,
    ...milestoneItems,
  ];

  return (
    <Section
      eyebrow={'Live delivery roadmap'}
      items={items}
      title={'Build order for AzA command center, canonical brain, GTM, team data, and content ops'}
    />
  );
};

const LiveBrainTopologySection = ({ topology }: { topology: AzaLiveBrainTopologyMap }) => {
  const namespaceItems = topology.namespaces.map((namespace): [string, string, string] => [
    namespace.label,
    namespace.status,
    `Scope: ${namespace.scope}. Backing sources: ${namespace.backingSources.join(', ')}. Default readers: ${namespace.defaultReaders.join(', ')}. Promotion: ${namespace.promotionRule}. Write policy: ${namespace.writePolicy}.`,
  ]);
  const accessProfileItems = topology.accessProfiles.map((profile): [string, string, string] => [
    profile.label,
    profile.id,
    `Reads: ${profile.canRead.join(', ')}. Writes: ${profile.canWrite.join(', ')}. Allowed records: ${profile.allowedRecords.join(', ')}. Approval required for: ${profile.requiresApprovalFor.join(', ')}. Denied: ${profile.denied.join(', ')}.`,
  ]);
  const promotionItems = topology.promotionPipeline.map((step): [string, string, string] => [
    step.label,
    step.status,
    `Owner: ${step.owner}. Gate: ${step.gate}. Input: ${step.input}. Output: ${step.output}. Evidence: ${step.evidence.join(', ')}.`,
  ]);
  const sourceRootItems = topology.sourceRoots.map((root): [string, string, string] => [
    root.id,
    `${root.namespace} / ${root.status}`,
    `Path: ${root.path}. Record type: ${root.recordType}. Role: ${root.role}. Index policy: ${root.indexPolicy}. Write policy: ${root.writePolicy}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Brain topology summary',
      `${topology.summary.namespaces} namespaces / ${topology.summary.accessProfiles} access profiles`,
      `Promotion steps: ${topology.summary.promotionSteps}. Passed: ${topology.summary.passedSteps}. Blocked: ${topology.summary.blockedSteps}. Approval required: ${topology.summary.approvalRequiredSteps}. Memory roots: ${topology.summary.memoryRootsPresent}/${topology.summary.memoryRootsTotal}. Canonical writes allowed: ${topology.summary.canonicalWritesAllowed ? 'yes' : 'no'}. Projection writes allowed: ${topology.summary.projectionWritesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Recommended model',
      topology.recommendedModel.decision,
      `${topology.recommendedModel.unifiedLayer} ${topology.recommendedModel.granularLayer} ${topology.recommendedModel.projectionLayer} ${topology.recommendedModel.promotionRule}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${topology.safety.captured.join(', ')}. Excluded: ${topology.safety.excluded.join(', ')}. Writes allowed: ${topology.safety.writesAllowed ? 'yes' : 'no'}.`,
    ],
    ...namespaceItems,
    ...accessProfileItems,
    ...promotionItems,
    ...sourceRootItems,
  ];

  return (
    <Section
      eyebrow={'Live brain topology'}
      items={items}
      title={
        'Unified AzA brain, granular agent namespaces, access profiles, and promotion pipeline'
      }
    />
  );
};

const LiveAgentAccessMatrixSection = ({
  accessMatrix,
}: {
  accessMatrix: AzaLiveAgentAccessMatrixMap;
}) => {
  const matrixItems = accessMatrix.matrix.map((row): [string, string, string] => [
    row.label,
    `${row.id} / ${row.status}`,
    `Reads: ${row.canRead.join(', ')}. Writes: ${row.canWrite.join(', ')}. Records: ${row.allowedRecords.join(', ')}. Memory roots: ${row.memoryRoots.length > 0 ? row.memoryRoots.join(', ') : 'none mapped'}. Session scope: ${row.sessionScope}. Approval required for: ${row.requiresApprovalFor.join(', ')}. Denied: ${row.denied.join(', ')}. Evidence: ${row.evidenceRequired.join(', ')}.`,
  ]);
  const namespaceItems = accessMatrix.namespaces.map((namespace): [string, string, string] => [
    namespace.label,
    `${namespace.id} / ${namespace.status}`,
    `Readers: ${namespace.readers.length > 0 ? namespace.readers.join(', ') : 'none mapped'}. Default readers: ${namespace.defaultReaders.join(', ')}. Write policy: ${namespace.writePolicy}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Agent access summary',
      `${accessMatrix.summary.accessRows} access rows / ${accessMatrix.summary.namespaces} namespaces`,
      `Active read-only: ${accessMatrix.summary.activeReadOnlyRows}. Approval-required: ${accessMatrix.summary.approvalRequiredRows}. Planned: ${accessMatrix.summary.plannedRows}. Blocked: ${accessMatrix.summary.blockedRows}. Session-backed rows: ${accessMatrix.summary.sessionBackedRows}. Memory roots present: ${accessMatrix.summary.memoryRootsPresent}. Writes allowed: ${accessMatrix.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${accessMatrix.safety.captured.join(', ')}. Excluded: ${accessMatrix.safety.excluded.join(', ')}.`,
    ],
    ...matrixItems,
    ...namespaceItems,
  ];

  return (
    <Section
      eyebrow={'Live agent access matrix'}
      items={items}
      title={'Agent roles, readable namespaces, session scopes, and approval requirements'}
    />
  );
};

const LiveAgentFleetSection = ({ fleet }: { fleet: AzaLiveAgentFleetMap }) => {
  const sourceItems = fleet.sources.map((source): [string, string, string] => [
    source.id,
    `${source.kind} / ${source.status}`,
    `Path: ${source.path}. Namespace: ${source.namespace}. Directories: ${source.directDirectories}. Files: ${source.directFiles}. SKILL.md manifests: ${source.skillManifestFiles}. Manifest counts: ${
      Object.entries(source.manifestCounts)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => `${name}:${count}`)
        .join(', ') || 'none'
    }. Role: ${source.role}. Write policy: ${source.writePolicy}.`,
  ]);
  const agentItems = fleet.agents
    .slice(0, 60)
    .map((agent): [string, string, string] => [
      agent.name,
      `${agent.category} / ${agent.status}`,
      `Path: ${agent.path}. Manifests: ${agent.manifestSignals.length > 0 ? agent.manifestSignals.join(', ') : 'none'}. Namespace: ${agent.defaultMemoryNamespace}. Session scope: ${agent.sessionScope}. Next: ${agent.nextAction}`,
    ]);
  const routeItems = fleet.namespaceRoutes.map((route): [string, string, string] => [
    route.label,
    `${route.namespace} / ${route.status}`,
    `Sources: ${route.fromSourceIds.join(', ')}. Profiles: ${route.accessProfiles.join(', ')}. Records: ${route.recordTypes.join(', ')}. Next: ${route.nextAction}. Evidence: ${route.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Agent fleet summary',
      `${fleet.summary.hermesAgents} Hermes agents / ${fleet.summary.skillRootDirectories} skill directories`,
      `Sources present: ${fleet.summary.sourcesPresent}/${fleet.summary.sources}. Skill manifests: ${fleet.summary.skillManifestFiles}. Archangels: ${fleet.summary.archangelAgents}. Ghost/fleet agents: ${fleet.summary.ghostFleetAgents}. Codex pipeline agents: ${fleet.summary.codexPipelineAgents}. Domain specialists: ${fleet.summary.domainSpecialistAgents}. Namespace routes: ${fleet.summary.namespaceRoutes}. Writes allowed: ${fleet.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Fleet memory model',
      fleet.recommendation.brainModel,
      `${fleet.recommendation.agentRecordRule} ${fleet.recommendation.skillRule} ${fleet.recommendation.sessionRule}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${fleet.safety.captured.join(', ')}. Excluded: ${fleet.safety.excluded.join(', ')}.`,
    ],
    ...sourceItems,
    ...routeItems,
    ...agentItems,
  ];

  return (
    <Section
      eyebrow={'Live agent fleet map'}
      items={items}
      title={'Installed agent definitions, skill roots, manifests, and namespace routes'}
    />
  );
};

const LiveMemoryIntakeFunnelSection = ({ funnel }: { funnel: AzaLiveMemoryIntakeFunnelMap }) => {
  const sourceItems = funnel.sources.map((source): [string, string, string] => [
    source.label,
    `${source.namespace} / ${source.status}`,
    `Path: ${source.sourcePath}. Records: ${source.recordTypes.join(', ')}. Readers: ${source.defaultReaders.join(', ')}. Write policy: ${source.writePolicy}. Next: ${source.nextAction}. Evidence: ${source.evidence.join(', ')}.`,
  ]);
  const stageItems = funnel.stages.map((stage): [string, string, string] => [
    stage.label,
    `${stage.from} -> ${stage.to} / ${stage.status}`,
    `Gate: ${stage.gate}. Owner: ${stage.owner}. Input: ${stage.input}. Output: ${stage.output}. Blocked by: ${stage.blockedBy.length > 0 ? stage.blockedBy.join(' ') : 'none'}. Evidence: ${stage.evidence.join(', ')}.`,
  ]);
  const routeItems = funnel.namespaceRoutes.map((route): [string, string, string] => [
    route.label,
    `${route.namespace} / ${route.status}`,
    `Sources: ${route.sourceIds.join(', ')}. Profiles: ${route.accessProfileIds.join(', ')}. Readers: ${route.allowedReaders.length > 0 ? route.allowedReaders.join(', ') : 'none mapped'}. Denied: ${route.denied.join(', ')}. Projection: ${route.projectionPolicy}. Evidence: ${route.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Memory intake funnel summary',
      `${funnel.summary.sources} sources / ${funnel.summary.stages} stages / ${funnel.summary.namespaceRoutes} namespace routes`,
      `Active read-only sources: ${funnel.summary.activeReadOnlySources}. Approval-required sources: ${funnel.summary.approvalRequiredSources}. Blocked sources: ${funnel.summary.blockedSources}. Active read-only stages: ${funnel.summary.activeReadOnlyStages}. Approval-required stages: ${funnel.summary.approvalRequiredStages}. Blocked stages: ${funnel.summary.blockedStages}. Canonical write ready: ${funnel.summary.canonicalWriteReady ? 'yes' : 'no'}. Projection ready: ${funnel.summary.projectionReady ? 'yes' : 'no'}. Writes allowed: ${funnel.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Recommended model',
      funnel.recommendation.decision,
      `${funnel.recommendation.unifiedLayer} ${funnel.recommendation.granularLayer} ${funnel.recommendation.intakeRule} ${funnel.recommendation.projectionLayer}`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${funnel.safety.captured.join(', ')}. Excluded: ${funnel.safety.excluded.join(', ')}.`,
    ],
    ...sourceItems,
    ...stageItems,
    ...routeItems,
  ];

  return (
    <Section
      eyebrow={'Live memory intake funnel'}
      items={items}
      title={'Granular agent, session, project, app, GTM, and projection sources into AzA'}
    />
  );
};

const LiveOwnershipResolutionSection = ({
  ownership,
}: {
  ownership: AzaLiveOwnershipResolutionMap;
}) => {
  const decisionItems = ownership.decisions.map((decision): [string, string, string] => [
    decision.id,
    `${decision.layer} / ${decision.status}`,
    `Path: ${decision.path}. Owner: ${decision.canonicalOwner}. Role: ${decision.role}. Read: ${decision.readPolicy}. Write: ${decision.writePolicy}. Next: ${decision.nextAction}. Evidence: ${decision.evidence.join(', ')}.`,
  ]);
  const conflictItems = ownership.conflicts.map((conflict): [string, string, string] => [
    conflict.id,
    conflict.status,
    `Decision: ${conflict.decision}. Next: ${conflict.nextAction}. Evidence: ${conflict.evidence.join(', ')}.`,
  ]);
  const writeLaneItems = ownership.writeLanes.map((lane): [string, string, string] => [
    lane.id,
    lane.allowedNow ? 'allowed now' : 'blocked or approval required',
    `Target: ${lane.target}. Approval: ${lane.approval}. Evidence: ${lane.evidence.join(', ')}.`,
  ]);
  const items: Array<[string, string, string]> = [
    [
      'Ownership resolution summary',
      `${ownership.summary.rootDecisions} root decisions / ${ownership.summary.conflicts} conflicts`,
      `Source-of-truth roots: ${ownership.summary.sourceOfTruthRoots}. Runtime-native roots: ${ownership.summary.runtimeNativeRoots}. Canonical targets: ${ownership.summary.canonicalTargets}. Projection read-only roots: ${ownership.summary.projectionReadOnlyRoots}. Approval-required decisions: ${ownership.summary.approvalRequiredDecisions}. Blocked decisions: ${ownership.summary.blockedDecisions}. Write lanes: ${ownership.summary.writeLanes}. Writes allowed: ${ownership.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Safety boundary',
      'metadata only',
      `Captured: ${ownership.safety.captured.join(', ')}. Excluded: ${ownership.safety.excluded.join(', ')}.`,
    ],
    ...decisionItems,
    ...conflictItems,
    ...writeLaneItems,
  ];

  return (
    <Section
      eyebrow={'Live ownership resolution'}
      items={items}
      title={'Source-of-truth ownership, ambiguous roots, write lanes, and approval policies'}
    />
  );
};

const LiveServiceMapSection = ({ serviceMap }: { serviceMap: AzaLiveServiceMap }) => {
  const expectedItems = serviceMap.expectedServices.map((service): [string, string, string] => [
    service.label,
    `${service.port} / ${service.status}`,
    `Role: ${service.expectedRole}. Channel: ${service.channel}. Category: ${service.category}. PIDs: ${service.listenerPids.length > 0 ? service.listenerPids.join(', ') : 'none'}. CWDs: ${service.matchedCwds.length > 0 ? service.matchedCwds.join(', ') : 'none'}.`,
  ]);
  const unknownListeners = serviceMap.listeners
    .filter((listener) => listener.category === 'unknown-local-listener')
    .slice(0, 12)
    .map((listener): [string, string, string] => [
      `${listener.process} ${listener.pid}`,
      `${listener.bind}:${listener.port}`,
      `CWD: ${listener.cwd ?? 'unknown'}. Interpretation: ${listener.interpretation}. Confidence: ${listener.confidence}.`,
    ]);
  const items: Array<[string, string, string]> = [
    [
      'Live listener summary',
      `${serviceMap.summary.listenerCount} listeners / ${serviceMap.summary.uniqueProcessCount} processes`,
      `Expected services: ${serviceMap.summary.expectedListening} listening and ${serviceMap.summary.expectedMissing} missing. AzA ports: ${serviceMap.summary.azaPortsListening} listening and ${serviceMap.summary.azaPortsMissing} missing. Writes allowed: ${serviceMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Runtime ownership',
      `${serviceMap.summary.vanListenerCount} VAN / ${serviceMap.summary.desktopVanListenerCount} Desktop-VAN / ${serviceMap.summary.unknownListenerCount} unknown`,
      'Listeners are classified by expected port, cwd ownership, and process family. Unknown listeners stay inventory-only until owner and health route are verified.',
    ],
    [
      'Safety boundary',
      'read-only lsof',
      `Captured: ${serviceMap.safety.captured.join(', ')}. Excluded: ${serviceMap.safety.excluded.join(', ')}.`,
    ],
    ...expectedItems,
    ...unknownListeners,
  ];

  return (
    <Section
      eyebrow={'Live service map'}
      items={items}
      title={'Actual TCP listeners, expected services, cwd ownership, and blocked AzA ports'}
    />
  );
};

const LiveSystemMapSection = ({ systemMap }: { systemMap: AzaLiveSystemMap }) => {
  const items: Array<[string, string, string]> = [
    [
      'System map summary',
      `${systemMap.summary.rootsPresent}/${systemMap.summary.rootsTotal} roots present`,
      `Generated ${systemMap.generatedAt}. Static artifacts present: ${systemMap.summary.staticArtifactsPresent ? 'yes' : 'no'}. Writes allowed: ${systemMap.summary.writesAllowed ? 'yes' : 'no'}.`,
    ],
    [
      'Services and boards',
      `${systemMap.summary.listeningPortCount} listeners / ${systemMap.summary.expectedAzAPortsMissing} AzA ports missing`,
      `Board status: ${systemMap.summary.boardBlockedCards}/${systemMap.summary.boardTotalCards} blocked. Live AzA read: ${systemMap.summary.liveAzAReadAvailable ? 'available' : 'blocked'}. Live MCP: ${systemMap.summary.liveMcpAvailable ? 'available' : 'blocked'}.`,
    ],
    [
      'Command gates',
      `${systemMap.summary.commandPassedGates}/${systemMap.summary.commandTotalGates} passed`,
      `Blocked: ${systemMap.summary.commandBlockedGates}. Approval required: ${systemMap.summary.commandApprovalRequiredGates}. Writes remain disabled until AzA service, schema, store, redaction, and approval gates pass.`,
    ],
    [
      'AzA verification runbook',
      `${systemMap.summary.azaVerificationPassedSteps}/${systemMap.summary.azaVerificationSteps} steps passed`,
      `Ready to probe: ${systemMap.summary.azaVerificationReadyToProbeSteps}. Approval required: ${systemMap.summary.azaVerificationApprovalRequiredSteps}. Blocked: ${systemMap.summary.azaVerificationBlockedSteps}. VAN command steps: ${systemMap.summary.azaVerificationVanCommandSteps}. Service contracts: ${systemMap.summary.azaVerificationServiceContracts}.`,
    ],
    [
      'Command record schema',
      `${systemMap.summary.commandRecordRecordTypes} record types / ${systemMap.summary.commandRecordRequiredFields} required fields`,
      `Blocked records: ${systemMap.summary.commandRecordBlockedRecords}. Approval-required records: ${systemMap.summary.commandRecordApprovalRequiredRecords}. Durable write ready: ${systemMap.summary.commandRecordDurableWriteReady ? 'yes' : 'no'}.`,
    ],
    [
      'Communication protocols',
      `${systemMap.summary.communicationProtocolCount} protocols`,
      `Manual-active: ${systemMap.summary.communicationActiveManualProtocols}. Snapshot: ${systemMap.summary.communicationSnapshotProtocols}. Approval required: ${systemMap.summary.communicationApprovalRequiredProtocols}. Blocked: ${systemMap.summary.communicationBlockedProtocols}. AzA API: ${systemMap.summary.communicationLiveAzAApiAvailable ? 'available' : 'blocked'}. MCP: ${systemMap.summary.communicationLiveMcpAvailable ? 'available' : 'blocked'}.`,
    ],
    [
      'Brain topology',
      `${systemMap.summary.brainNamespaces} namespaces / ${systemMap.summary.brainAccessProfiles} access profiles`,
      `Promotion steps: ${systemMap.summary.brainPromotionSteps}. Blocked promotion steps: ${systemMap.summary.brainBlockedPromotionSteps}. Source roots present: ${systemMap.summary.brainSourceRootsPresent}. The topology keeps AzA unified while Codex, Hermes, and specialized agents retain granular overlays.`,
    ],
    [
      'Memory intake funnel',
      `${systemMap.summary.memoryIntakeSources} sources / ${systemMap.summary.memoryIntakeStages} stages`,
      `Namespace routes: ${systemMap.summary.memoryIntakeNamespaceRoutes}. Blocked stages: ${systemMap.summary.memoryIntakeBlockedStages}. Approval-required stages: ${systemMap.summary.memoryIntakeApprovalRequiredStages}. Canonical write ready: ${systemMap.summary.memoryIntakeCanonicalWriteReady ? 'yes' : 'no'}. Projection ready: ${systemMap.summary.memoryIntakeProjectionReady ? 'yes' : 'no'}.`,
    ],
    [
      'Memory roots',
      `${systemMap.summary.memoryRootsPresent}/${systemMap.summary.memoryRootsTotal} roots present`,
      `Skill manifests: ${systemMap.summary.skillMarkdownFiles}. VANTA-Brain projection files: ${systemMap.summary.projectedVaultFiles}. The live system map uses metadata only and still blocks canonical writes.`,
    ],
    [
      'MCP tooling',
      `${systemMap.summary.mcpClientConfigsPresent}/${systemMap.summary.mcpClientConfigFiles} client configs present`,
      `Configured server names: ${systemMap.summary.mcpConfiguredServerNames}. AzA MCP healthy: ${systemMap.summary.mcpAzaHealthy ? 'yes' : 'no'}. Implemented tools: ${systemMap.summary.mcpImplementedTools}. Placeholder tools: ${systemMap.summary.mcpPlaceholderTools}. Channels: ${systemMap.summary.mcpToolingChannels}. Ready-to-probe steps: ${systemMap.summary.mcpReadyToProbeSteps}. Blocked proof steps: ${systemMap.summary.mcpBlockedProofSteps}.`,
    ],
    [
      'Project roots',
      `${systemMap.summary.projectTopLevelDirectories} directories / ${systemMap.summary.projectGitRepositories} git repos`,
      `Project roots present: ${systemMap.summary.projectRootsPresent}. package.json projects: ${systemMap.summary.projectPackageJsonProjects}. This is marker existence only; file contents, env files, and git remotes stay excluded.`,
    ],
    [
      'GTM operating model',
      `${systemMap.summary.gtmLanes} lanes / ${systemMap.summary.gtmRecordTypes} record types`,
      `Boards: ${systemMap.summary.gtmBoards}. Required fields: ${systemMap.summary.gtmRequiredFields}. This is schema and operating status only; customer private data and lead contact details stay excluded.`,
    ],
    [
      'Team data routing',
      `${systemMap.summary.teamDataLanes} lanes / ${systemMap.summary.teamDataRecordRoutes} record routes`,
      `Owners: ${systemMap.summary.teamDataTeamOwners}. Handoffs: ${systemMap.summary.teamDataHandoffs}. Blocked handoffs: ${systemMap.summary.teamDataBlockedHandoffs}. Blocked record routes: ${systemMap.summary.teamDataBlockedRecordRoutes}. Canonical write ready: ${systemMap.summary.teamDataCanonicalWriteReady ? 'yes' : 'no'}. Durable board ready: ${systemMap.summary.teamDataDurableBoardReady ? 'yes' : 'no'}.`,
    ],
    [
      'Content operations',
      `${systemMap.summary.contentOpsStages} stages / ${systemMap.summary.contentWriteBackSteps} write-back steps`,
      `Approval queue: ${systemMap.summary.contentApprovalQueue}. Pending verification apps: ${systemMap.summary.contentCandidateApps}. Content apps remain read-only, draft-only, reviewed-capture, approval-first, or blocked until command gates pass.`,
    ],
    [
      'Content app audit',
      `${systemMap.summary.contentAppAuditTargets} targets / ${systemMap.summary.contentAppAuditReadyForCaptureTargets} ready`,
      `Missing account labels: ${systemMap.summary.contentAppAuditMissingAccountLabels}. Missing output paths: ${systemMap.summary.contentAppAuditMissingOutputPaths}. Approval required: ${systemMap.summary.contentAppAuditApprovalRequiredTargets}. Blocked: ${systemMap.summary.contentAppAuditBlockedTargets}.`,
    ],
    [
      'Access capability map',
      `${systemMap.summary.accessCapabilitySurfaces} surfaces / ${systemMap.summary.accessCapabilityReadySurfaces} ready`,
      `Visible: ${systemMap.summary.accessCapabilityVisibleSurfaces}. Browser/web: ${systemMap.summary.accessCapabilityBrowserSurfaces}. Account labels known: ${systemMap.summary.accessCapabilityAccountLabelsKnown}. Auth pointers known: ${systemMap.summary.accessCapabilityAuthPointersKnown}. Audit required: ${systemMap.summary.accessCapabilityAuditRequiredSurfaces}. Approval required: ${systemMap.summary.accessCapabilityApprovalRequiredSurfaces}. Blocked: ${systemMap.summary.accessCapabilityBlockedSurfaces}.`,
    ],
    [
      'App and content inventory',
      `${systemMap.appAndContent.installedAppCount} installed / ${systemMap.appAndContent.visibleAppCount} visible / ${systemMap.appAndContent.contentStageCount} stages`,
      `Bundle metadata: ${systemMap.summary.contentAppBundleMetadataApps}. Chrome/webapp wrappers: ${systemMap.summary.contentAppChromeWebAppWrappers}. Unclassified: ${systemMap.summary.contentAppUnclassifiedApps}. Translocated: ${systemMap.summary.contentAppTranslocatedApps}. Tracked fields: ${systemMap.appAndContent.appInventoryFields.join(', ')}. Excluded private data: ${systemMap.appAndContent.privacyExcluded.join(', ')}.`,
    ],
    [
      'Memory decision',
      systemMap.memoryDecision.decision,
      `${systemMap.memoryDecision.canonicalLayer} ${systemMap.memoryDecision.granularLayer} ${systemMap.memoryDecision.promotionRule}`,
    ],
    ...systemMap.layers.map((layer): [string, string, string] => [
      layer.name,
      layer.status,
      `Role: ${layer.role}. Owns: ${layer.owns.join(', ')}. Reads from: ${layer.readsFrom.join(', ')}. Writes to: ${layer.writesTo.join(', ')}. Evidence: ${layer.evidence.join(', ')}.`,
    ]),
    ...systemMap.links.map((link): [string, string, string] => [
      `${link.from} -> ${link.to}`,
      `${link.channel} / ${link.status}`,
      `Approval: ${link.approval}. Evidence: ${link.evidence.join(', ')}.`,
    ]),
  ];

  return (
    <Section
      eyebrow={'Live system map'}
      items={items}
      title={'Root checks, memory ownership, service links, and communication edges'}
    />
  );
};

const _AzaStaticPage = async () => {
  const [liveReadiness, liveServiceMap, liveMemoryMap, liveAppMap, liveProjectMap] =
    await Promise.all([
      getAzaLiveReadiness(),
      getAzaLiveServiceMap(),
      getAzaLiveMemoryMap(),
      getAzaLiveAppMap(),
      getAzaLiveProjectMap(),
    ]);
  const liveOperatingBoard = await getAzaLiveOperatingBoard(liveReadiness);
  const liveGtmMap = await getAzaLiveGtmMap(liveOperatingBoard);
  const liveCommandGateMap = await getAzaLiveCommandGateMap({
    appMap: liveAppMap,
    board: liveOperatingBoard,
    gtmMap: liveGtmMap,
    memoryMap: liveMemoryMap,
    projectMap: liveProjectMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });
  const liveCanonicalStoreMap = await getAzaLiveCanonicalStoreMap();
  const liveCodexHarnessMap = await getAzaLiveCodexHarnessMap({
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
  });
  const liveCommandRecordSchemaMap = await getAzaLiveCommandRecordSchemaMap({
    canonicalStoreMap: liveCanonicalStoreMap,
    codexHarnessMap: liveCodexHarnessMap,
    commandGateMap: liveCommandGateMap,
  });
  const liveCommunicationProtocolMap = await getAzaLiveCommunicationProtocolMap({
    canonicalStoreMap: liveCanonicalStoreMap,
    codexHarnessMap: liveCodexHarnessMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });
  const liveImplementationProofMap = await getAzaLiveImplementationProofMap({
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });
  const liveBrainTopologyMap = await getAzaLiveBrainTopologyMap({
    commandGateMap: liveCommandGateMap,
    memoryMap: liveMemoryMap,
    readiness: liveReadiness,
  });
  const liveAgentAccessMatrixMap = await getAzaLiveAgentAccessMatrixMap({
    memoryMap: liveMemoryMap,
    topology: liveBrainTopologyMap,
  });
  const liveAgentFleetMap = await getAzaLiveAgentFleetMap({
    accessMatrix: liveAgentAccessMatrixMap,
    memoryMap: liveMemoryMap,
    topology: liveBrainTopologyMap,
  });
  const liveContentOpsMap = await getAzaLiveContentOpsMap({
    appMap: liveAppMap,
    commandGateMap: liveCommandGateMap,
  });
  const liveContentAppAuditMap = await getAzaLiveContentAppAuditMap({
    appMap: liveAppMap,
    commandGateMap: liveCommandGateMap,
    contentOpsMap: liveContentOpsMap,
  });
  const liveAccessCapabilityMap = await getAzaLiveAccessCapabilityMap({
    contentAppAuditMap: liveContentAppAuditMap,
  });
  const liveMemoryIntakeFunnelMap = await getAzaLiveMemoryIntakeFunnelMap({
    accessMatrix: liveAgentAccessMatrixMap,
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    communicationProtocolMap: liveCommunicationProtocolMap,
    memoryMap: liveMemoryMap,
    topology: liveBrainTopologyMap,
  });
  const liveVantaBrainCoverageMap = await getAzaLiveVantaBrainCoverageMap({
    memoryMap: liveMemoryMap,
  });
  const liveTeamDataRoutingMap = await getAzaLiveTeamDataRoutingMap({
    board: liveOperatingBoard,
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    contentAppAuditMap: liveContentAppAuditMap,
    gtmMap: liveGtmMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
  });
  const liveDailyCommandWorkflowMap = await getAzaLiveDailyCommandWorkflowMap({
    board: liveOperatingBoard,
    canonicalStoreMap: liveCanonicalStoreMap,
    codexHarnessMap: liveCodexHarnessMap,
    commandGateMap: liveCommandGateMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    contentAppAuditMap: liveContentAppAuditMap,
    gtmMap: liveGtmMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
    readiness: liveReadiness,
    teamDataRoutingMap: liveTeamDataRoutingMap,
    vantaBrainCoverageMap: liveVantaBrainCoverageMap,
  });
  const liveWorkspaceRootReconciliationMap = await getAzaLiveWorkspaceRootReconciliationMap({
    commandGateMap: liveCommandGateMap,
    projectMap: liveProjectMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });
  const liveArchitectureDataFlowMap = await getAzaLiveArchitectureDataFlowMap({
    brainTopologyMap: liveBrainTopologyMap,
    communicationProtocolMap: liveCommunicationProtocolMap,
    contentOpsMap: liveContentOpsMap,
    memoryIntakeFunnelMap: liveMemoryIntakeFunnelMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
    workspaceRootReconciliationMap: liveWorkspaceRootReconciliationMap,
  });
  const liveAzaImplementationMap = await getAzaLiveAzaImplementationMap({
    serviceMap: liveServiceMap,
  });
  const liveAzaVerificationRunbookMap = await getAzaLiveVerificationRunbookMap({
    canonicalStoreMap: liveCanonicalStoreMap,
    implementationMap: liveAzaImplementationMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });
  const liveMcpToolingMap = await getAzaLiveMcpToolingMap({
    implementationMap: liveAzaImplementationMap,
    readiness: liveReadiness,
  });
  const liveBrowserTaskToolingMap = await getAzaLiveBrowserTaskToolingMap({
    accessCapabilityMap: liveAccessCapabilityMap,
    brainTopologyMap: liveBrainTopologyMap,
    codexHarnessMap: liveCodexHarnessMap,
    contentAppAuditMap: liveContentAppAuditMap,
    mcpToolingMap: liveMcpToolingMap,
  });
  const liveSystemMap = await getAzaLiveSystemMap(
    liveReadiness,
    liveOperatingBoard,
    liveServiceMap,
    liveMemoryMap,
    liveAppMap,
    liveProjectMap,
    liveGtmMap,
    liveCommandGateMap,
    liveCanonicalStoreMap,
    liveCodexHarnessMap,
    liveCommandRecordSchemaMap,
    liveCommunicationProtocolMap,
    liveBrainTopologyMap,
    liveMemoryIntakeFunnelMap,
    liveContentOpsMap,
    liveContentAppAuditMap,
    liveAccessCapabilityMap,
    liveTeamDataRoutingMap,
    liveVantaBrainCoverageMap,
    liveDailyCommandWorkflowMap,
    liveAgentFleetMap,
    liveWorkspaceRootReconciliationMap,
    liveArchitectureDataFlowMap,
    liveAzaImplementationMap,
    liveAzaVerificationRunbookMap,
    liveMcpToolingMap,
  );
  const liveGoalCompletionAuditMap = await getAzaLiveGoalCompletionAuditMap({
    systemMap: liveSystemMap,
  });
  const liveExecutionSequenceMap = await getAzaLiveExecutionSequenceMap({
    audit: liveGoalCompletionAuditMap,
    systemMap: liveSystemMap,
  });
  const liveApprovalPacketMap = await getAzaLiveApprovalPacketMap({
    executionSequence: liveExecutionSequenceMap,
    runbook: liveAzaVerificationRunbookMap,
  });
  const liveDeliveryRoadmapMap = await getAzaLiveDeliveryRoadmapMap({
    approvalPacket: liveApprovalPacketMap,
    board: liveOperatingBoard,
    gtmMap: liveGtmMap,
    proofMap: liveImplementationProofMap,
    teamDataRoutingMap: liveTeamDataRoutingMap,
  });
  const liveToolingRecommendationPlanMap = await getAzaLiveToolingRecommendationPlanMap({
    brainTopologyMap: liveBrainTopologyMap,
    browserTaskToolingMap: liveBrowserTaskToolingMap,
    dailyCommandWorkflowMap: liveDailyCommandWorkflowMap,
    deliveryRoadmapMap: liveDeliveryRoadmapMap,
    mcpToolingMap: liveMcpToolingMap,
  });
  const liveOwnershipResolutionMap = await getAzaLiveOwnershipResolutionMap({
    commandGateMap: liveCommandGateMap,
    systemMap: liveSystemMap,
  });

  return (
    <main
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 34%)',
        color: '#0f172a',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        minHeight: '100vh',
        padding: '40px 16px 64px',
      }}
    >
      <div style={{ display: 'grid', gap: 32, margin: '0 auto', maxWidth: 1180 }}>
        <header style={{ display: 'grid', gap: 10 }}>
          <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
            AzA command center
          </div>
          <h1 style={{ fontSize: 34, letterSpacing: 0, lineHeight: 1.15, margin: 0 }}>
            Architecture, memory, agents, GTM, and integration health
          </h1>
          <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: 880 }}>
            This is the read-only operator map for the current machine. AzA is the target canonical
            memory plane, LobeHub is the command harness, Codex is the coding executor, and
            VANTA-Brain is the human-readable projection vault.
          </p>
        </header>

        <Section eyebrow={'System roots'} items={roots} title={'Where the active layers live'} />
        <Section
          eyebrow={'Harness roles'}
          items={harnessRoles}
          title={'LobeHub is the harness; Codex is the coding executor'}
        />
        <DiagramSection />
        <Section
          eyebrow={'Observed inventory'}
          items={observedInventory}
          title={'Current machine snapshot from read-only scans'}
        />
        <Section
          eyebrow={'VAN project root'}
          items={vanProjectInventory}
          title={'Where active projects, agents, memory services, and tools sit'}
        />
        <LiveProjectMapSection projectMap={liveProjectMap} />
        <LiveWorkspaceRootReconciliationSection
          reconciliation={liveWorkspaceRootReconciliationMap}
        />
        <LiveArchitectureDataFlowSection dataFlow={liveArchitectureDataFlowMap} />
        <LiveAzaImplementationSection implementation={liveAzaImplementationMap} />
        <Section
          eyebrow={'VAN index plan'}
          items={vanIndexPlan}
          title={'How AzA should turn VAN directories into queryable project records'}
        />
        <Section
          eyebrow={'VANTA-Brain audit'}
          items={vantaBrainAudit}
          title={'Whether the vault is current enough to be trusted as memory'}
        />
        <Section
          eyebrow={'PC surface map'}
          items={machineSurfaces}
          title={'How the desktop is layered from user account to devices'}
        />
        <Section
          eyebrow={'Memory map'}
          items={memory}
          title={'What should be indexed and what remains runtime state'}
        />
        <Section
          eyebrow={'Brain design'}
          items={brainModel}
          title={'Unified knowledge with scoped agent overlays'}
        />
        <Section
          eyebrow={'Agent memory inventory'}
          items={agentMemoryInventory}
          title={'Which agent, skill, session, and memory roots AzA should index'}
        />
        <LiveMemoryMapSection memoryMap={liveMemoryMap} />
        <LiveVantaBrainCoverageSection coverage={liveVantaBrainCoverageMap} />
        <Section
          eyebrow={'Canonical records'}
          items={canonicalRecords}
          title={'What AzA should store as durable memory'}
        />
        <Section
          eyebrow={'Brain index plan'}
          items={brainIndexPlan}
          title={'Typed records needed for the hybrid unified and granular brain'}
        />
        <Section
          eyebrow={'Memory routing policy'}
          items={memoryRoutingPolicy}
          title={'How unified brain and granular agent memory should coexist'}
        />
        <Section
          eyebrow={'Storage boundaries'}
          items={storageBoundaries}
          title={'How memory is mapped across volatile, durable, canonical, and secret stores'}
        />
        <Section
          eyebrow={'Data flow'}
          items={dataFlow}
          title={'How information should move through the system'}
        />
        <Section
          eyebrow={'Communication paths'}
          items={communicationPaths}
          title={'How LobeHub, Codex, AzA, Hermes, apps, and devices talk to each other'}
        />
        <Section
          eyebrow={'Live service ports'}
          items={localServiceInventory}
          title={'Which local services are actually listening right now'}
        />
        <LiveServiceMapSection serviceMap={liveServiceMap} />
        <Section
          eyebrow={'Live readiness adapter'}
          items={liveReadinessAdapter}
          title={'First dynamic read-only bridge from LobeHub into current system health'}
        />
        <LiveReadinessStatusSection readiness={liveReadiness} />
        <LiveOperatingBoardSection board={liveOperatingBoard} />
        <LiveDailyCommandWorkflowSection workflow={liveDailyCommandWorkflowMap} />
        <LiveGtmMapSection gtmMap={liveGtmMap} />
        <LiveTeamDataRoutingSection routing={liveTeamDataRoutingMap} />
        <LiveCommandGateSection gateMap={liveCommandGateMap} />
        <LiveCanonicalStoreSection storeMap={liveCanonicalStoreMap} />
        <LiveCodexHarnessSection harness={liveCodexHarnessMap} />
        <LiveCommandRecordSchemaSection schemaMap={liveCommandRecordSchemaMap} />
        <LiveCommunicationProtocolSection protocolMap={liveCommunicationProtocolMap} />
        <LiveMcpToolingSection toolingMap={liveMcpToolingMap} />
        <LiveBrowserTaskToolingSection toolingMap={liveBrowserTaskToolingMap} />
        <LiveToolingRecommendationPlanSection plan={liveToolingRecommendationPlanMap} />
        <LiveImplementationProofSection proofMap={liveImplementationProofMap} />
        <LiveAzaVerificationRunbookSection runbook={liveAzaVerificationRunbookMap} />
        <LiveBrainTopologySection topology={liveBrainTopologyMap} />
        <LiveAgentAccessMatrixSection accessMatrix={liveAgentAccessMatrixMap} />
        <LiveAgentFleetSection fleet={liveAgentFleetMap} />
        <LiveMemoryIntakeFunnelSection funnel={liveMemoryIntakeFunnelMap} />
        <LiveSystemMapSection systemMap={liveSystemMap} />
        <LiveGoalCompletionAuditSection audit={liveGoalCompletionAuditMap} />
        <LiveExecutionSequenceSection sequence={liveExecutionSequenceMap} />
        <LiveApprovalPacketSection packet={liveApprovalPacketMap} />
        <LiveDeliveryRoadmapSection roadmap={liveDeliveryRoadmapMap} />
        <LiveOwnershipResolutionSection ownership={liveOwnershipResolutionMap} />
        <Section
          eyebrow={'AzA brain readiness'}
          items={azaBrainReadiness}
          title={'What exists in the canonical brain repo and what is still blocked'}
        />
        <Section
          eyebrow={'AzA service surfaces'}
          items={azaServiceSurfaces}
          title={'Gateway, API, MCP, sync, and worker responsibilities'}
        />
        <Section
          eyebrow={'Canonical write gates'}
          items={azaCanonicalWriteGates}
          title={'Checks required before LobeHub can write to AzA memory'}
        />
        <Section
          eyebrow={'Service routing plan'}
          items={serviceRoutingPlan}
          title={'How LobeHub should safely route to live services'}
        />
        <Section
          eyebrow={'Master source map'}
          items={sourceTruthMasterMap}
          title={'Which layer owns each part of the PC architecture'}
        />
        <Section
          eyebrow={'Memory architecture decision'}
          items={memoryArchitectureDecision}
          title={'Single canonical AzA brain with granular agent overlays'}
        />
        <Section
          eyebrow={'Adapter build order'}
          items={adapterBuildSequence}
          title={'How static inventories become live command-center adapters'}
        />
        <Section
          eyebrow={'Completion gaps'}
          items={completionGaps}
          title={'What still prevents the goal from being fully complete'}
        />
        <Section
          eyebrow={'Goal coverage audit'}
          items={goalCoverageAudit}
          title={'Which original requirements are proven, partial, or still blocked'}
        />
        <Section
          eyebrow={'Live completion blockers'}
          items={liveCompletionBlockers}
          title={'Why the full objective cannot be marked complete yet'}
        />
        <Section
          eyebrow={'Next proof gates'}
          items={nextProofGates}
          title={'Evidence needed to turn the static command center into live AzA'}
        />
        <Section
          eyebrow={'Read/write contract'}
          items={readWriteContract}
          title={'What the LobeHub harness can read and when it may write'}
        />
        <Section
          eyebrow={'Adapter status'}
          items={adapterStatus}
          title={'Which surfaces are read-only, approval-first, blocked, or never stored'}
        />
        <Section
          eyebrow={'Approval gates'}
          items={approvalGates}
          title={'Checks required before AzA, VAN, VANTA-Brain, browser, or device writes'}
        />
        <Section
          eyebrow={'Source of truth'}
          items={sourceTruth}
          title={'Which layer owns each kind of information'}
        />
        <Section
          eyebrow={'Write controls'}
          items={writeControls}
          title={'Rules before any app, browser, memory, or filesystem write'}
        />
        <StatusSection />
        <Section
          eyebrow={'Team data lanes'}
          items={teamLanes}
          title={'How agents and teams should organize their work'}
        />
        <Section
          eyebrow={'Content lanes'}
          items={contentAppRegistry}
          title={'Installed generation, webapp, and operations apps to organize'}
        />
        <LiveAppMapSection appMap={liveAppMap} />
        <LiveContentOpsSection contentOps={liveContentOpsMap} />
        <LiveContentAppAuditSection audit={liveContentAppAuditMap} />
        <LiveAccessCapabilitySection access={liveAccessCapabilityMap} />
        <Section
          eyebrow={'Content production stages'}
          items={contentProductionStages}
          title={'How webapps and Electron apps should move content from source to measurement'}
        />
        <Section
          eyebrow={'Content app operating modes'}
          items={contentAppOperatingModes}
          title={'Which apps are read-only, draft-only, reviewed, approval-first, or blocked'}
        />
        <Section
          eyebrow={'Content write-back records'}
          items={contentWriteBackRecords}
          title={
            'How content work should become AzA campaign, asset, publishing, and analytics records'
          }
        />
        <Section
          eyebrow={'Live app surface'}
          items={liveAppSurface}
          title={'Running apps observed through Computer use'}
        />
        <Section
          eyebrow={'App inventory schema'}
          items={appInventoryFields}
          title={'Fields AzA needs for each browser, Electron, content, and device app'}
        />
        <Section
          eyebrow={'Inventory actions'}
          items={inventoryActions}
          title={'What must become queryable next'}
        />
        <Section
          eyebrow={'GTM data model'}
          items={gtmOperatingData}
          title={'How revenue and content work should write back to AzA'}
        />
        <Section
          eyebrow={'Team operating boards'}
          items={gtmTeamBoards}
          title={'First LobeHub boards for GTM, product, content, memory, and execution'}
        />
        <Section
          eyebrow={'Command workflow'}
          items={commandCenterWorkflow}
          title={'How the LobeHub harness and Codex coding agent should operate together'}
        />
        <Section eyebrow={'Legacy content lanes'} items={lanes} title={'Original lane summary'} />
        <Section eyebrow={'GTM'} items={gtm} title={'Business execution tracks'} />
        <Section eyebrow={'Next gates'} items={nextGates} title={'What must become live next'} />
      </div>
    </main>
  );
};

const liveMapLinks: [string, string, string][] = [
  [
    'Readiness',
    '/aza/live-readiness',
    'Fast health check for command-center artifacts and AzA service ports.',
  ],
  [
    'AzA API snapshot',
    '/aza/live-aza-api-snapshot',
    'Read-only probe of the local AzA API, store readiness, MCP health, and redacted conversation metadata.',
  ],
  [
    'Durable store',
    '/aza/live-aza-durable-store-readiness',
    'Read-only proof gates for Docker, native Postgres, pgvector, UID lookup, and AzA API postgres readiness.',
  ],
  [
    'Goal audit',
    '/aza/live-goal-completion-audit',
    'Requirement-by-requirement status for the current architecture goal.',
  ],
  [
    'Current goal status report',
    '/aza/live-current-goal-status-report',
    'Compact operator report for current organization, blockers, GTM/team data, browser-session IO, and VANTA-Brain boundary.',
  ],
  [
    'Sync status',
    '/aza/live-sync-status',
    'Read-only status for Notion import/live config and VANTA-Brain projection coverage gates.',
  ],
  [
    'System map',
    '/aza/live-system-map',
    'Full machine map across roots, services, apps, memory, agents, and protocols.',
  ],
  [
    'GTM/team operating status',
    '/aza/live-gtm-team-operating-status',
    'Daily command, GTM lanes, team record routes, blockers, and next actions.',
  ],
  [
    'Browser tooling',
    '/aza/live-browser-task-tooling-map',
    'Operating-session tooling map for Browser Plugin, Computer Use, MCP, and Codex.',
  ],
  [
    'Browser sessions',
    '/aza/live-browser-operating-sessions',
    'Live read-only checks for Chrome/CDP, Computer Use helper, and content app operating-session readiness.',
  ],
  [
    'Metadata collection plan',
    '/aza/live-content-app-metadata-collection-plan',
    'Read-only collection packets for safe account labels, auth pointers, export paths, output kinds, and evidence pointers.',
  ],
  [
    'Delivery roadmap',
    '/aza/live-delivery-roadmap',
    'Build milestones and approval-gated workstreams.',
  ],
  [
    'App map',
    '/aza/live-app-map',
    'Installed and visible app metadata for content-generation surfaces.',
  ],
];

const LiveLinkSection = () => (
  <Section
    eyebrow={'Live map index'}
    title={'Open heavier maps on demand'}
    items={liveMapLinks.map(([label, href, detail]) => [
      label,
      href,
      `${detail} Opens as a separate endpoint so the command index stays responsive.`,
    ])}
  />
);

const AzaCommandIndexPage = async () => {
  const [readiness, liveContentAppAuditMap, liveGtmTeamOperatingStatus] = await Promise.all([
    getAzaLiveReadiness(),
    getAzaLiveContentAppAuditMap(),
    getAzaLiveGtmTeamOperatingStatusMap({ depth: 'summary' }),
  ]);
  const liveContentAppMetadataCollectionPlan = await getAzaLiveContentAppMetadataCollectionPlanMap({
    contentAppAuditMap: liveContentAppAuditMap,
  });
  const liveCurrentGoalStatusReport = await getAzaLiveCurrentGoalStatusReportMap({
    contentAppMetadataCollectionPlan: liveContentAppMetadataCollectionPlan,
    gtmTeamOperatingStatus: liveGtmTeamOperatingStatus,
  });
  const liveSyncStatusMap = await getAzaLiveSyncStatusMap();
  const readinessItems: [string, string, string][] = [
    [
      'Command-center artifacts',
      readiness.summary.artifactsPresent ? 'present' : 'missing',
      `${readiness.artifacts.filter((artifact) => artifact.exists).length}/${readiness.artifacts.length} expected artifacts are present.`,
    ],
    [
      'AzA API read',
      readiness.summary.liveAzAReadAvailable ? 'available' : 'offline',
      'Canonical read/write remains disabled until AzA services and store health are verified.',
    ],
    [
      'AzA MCP',
      readiness.summary.liveMcpAvailable ? 'available' : 'offline',
      'MCP retrieval remains blocked until the AzA MCP service is live and healthy.',
    ],
    [
      'VANTA-Brain projection',
      readiness.summary.projectionToVantaBrainAllowed ? 'allowed' : 'blocked',
      'Projection writes stay disabled until canonical IDs, redaction, and approval gates are proven.',
    ],
  ];

  return (
    <main
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 34%)',
        color: '#0f172a',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        minHeight: '100vh',
        padding: '40px 16px 64px',
      }}
    >
      <div style={{ display: 'grid', gap: 32, margin: '0 auto', maxWidth: 1180 }}>
        <header style={{ display: 'grid', gap: 10 }}>
          <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>
            AzA command center
          </div>
          <h1 style={{ fontSize: 34, letterSpacing: 0, lineHeight: 1.15, margin: 0 }}>
            Architecture, memory, agents, GTM, and integration health
          </h1>
          <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: 880 }}>
            Lightweight command index. LobeHub is the harness, Codex is the executor, AzA is the
            canonical brain target, and VANTA-Brain remains a read-only capture/projection vault
            until approval gates are green.
          </p>
        </header>

        <Section eyebrow={'System roots'} items={roots} title={'Where the active layers live'} />
        <Section
          eyebrow={'Harness roles'}
          items={harnessRoles}
          title={'LobeHub is the harness; Codex is the coding executor'}
        />
        <Section
          eyebrow={'Placement'}
          items={commandCenterPlacement}
          title={'Where the AzA command center lives now'}
        />
        <Section
          eyebrow={'Live readiness'}
          items={readinessItems}
          title={'Current service and write-gate status'}
        />
        <LiveCurrentGoalStatusReportSection report={liveCurrentGoalStatusReport} />
        <LiveSyncStatusSection syncStatus={liveSyncStatusMap} />
        <LiveLinkSection />
        <Section
          eyebrow={'Brain model'}
          items={brainModel}
          title={'Hybrid unified brain with granular agent memory'}
        />
        <Section
          eyebrow={'Source of truth'}
          items={sourceTruth}
          title={'Which layer owns each kind of information'}
        />
        <Section
          eyebrow={'Write controls'}
          items={writeControls}
          title={'Rules before any app, browser, memory, or filesystem write'}
        />
        <Section
          eyebrow={'Command workflow'}
          items={commandCenterWorkflow}
          title={'How the LobeHub harness and Codex executor should operate together'}
        />
        <LiveGtmTeamOperatingStatusSection status={liveGtmTeamOperatingStatus} />
        <Section
          eyebrow={'Content lanes'}
          items={contentAppRegistry}
          title={'Installed generation, webapp, and operations apps to organize'}
        />
        <LiveContentAppAuditSection audit={liveContentAppAuditMap} />
        <LiveContentAppMetadataCollectionPlanSection plan={liveContentAppMetadataCollectionPlan} />
        <Section eyebrow={'Next gates'} items={nextGates} title={'What must become live next'} />
      </div>
    </main>
  );
};

export default AzaCommandIndexPage;
