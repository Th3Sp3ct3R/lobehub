import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';

type HarnessStatus =
  | 'active'
  | 'active_manual'
  | 'approval_required'
  | 'available'
  | 'blocked'
  | 'planned';

type PathProbe = {
  id: string;
  path: string;
  present: boolean;
};

type JsonRecord = Record<string, unknown>;

export type HarnessPrimitive = {
  evidence: string[];
  id: string;
  role: string;
  status: HarnessStatus;
  title: string;
};

export type HarnessLane = {
  approval: string;
  evidence: string[];
  executor: string;
  id: string;
  input: string;
  label: string;
  nextAction: string;
  output: string;
  status: HarnessStatus;
};

export type HarnessHandoffStep = {
  contract: string;
  evidence: string[];
  from: string;
  id: string;
  label: string;
  status: HarnessStatus;
  to: string;
};

export type AzaLiveCodexHarnessMap = {
  generatedAt: string;
  handoffSteps: HarnessHandoffStep[];
  lanes: HarnessLane[];
  mode: 'read_only_codex_harness_bridge_map';
  pathProbes: PathProbe[];
  primitives: HarnessPrimitive[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    activeManualLanes: number;
    approvalRequiredLanes: number;
    blockedLanes: number;
    codexAppPresent: boolean;
    codexStatePresent: boolean;
    durableHandoffReady: boolean;
    lanes: number;
    primitives: number;
    writesAllowed: false;
  };
};

const pathExists = async (id: string, targetPath: string): Promise<PathProbe> => {
  try {
    await stat(targetPath);
    return { id, path: targetPath, present: true };
  } catch {
    return { id, path: targetPath, present: false };
  }
};

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const readDurableHandoffProof = async () => {
  try {
    const raw = await readFile(artifactPath('aza-goal-completion-audit.json'), 'utf8');
    const parsed = JSON.parse(raw) as JsonRecord;
    const handoff = getRecord(parsed.durableHandoffProof);
    const evidence = getRecord(parsed.durableEvidenceProof);

    return (
      text(handoff.status) === 'passed' &&
      handoff.handoffWriteOk === true &&
      handoff.handoffReadOk === true &&
      text(evidence.status) === 'passed' &&
      evidence.evidenceWriteOk === true &&
      evidence.evidenceReadOk === true
    );
  } catch {
    return false;
  }
};

const buildPrimitives = (): HarnessPrimitive[] => [
  {
    evidence: ['packages/database/src/models/task.ts', 'TaskModel'],
    id: 'lobehub_task_records',
    role: 'Durable task shape with status, config, context, docs, comments, dependencies, checkpoint, review config, and heartbeat.',
    status: 'available',
    title: 'LobeHub task records',
  },
  {
    evidence: ['apps/server/src/services/taskRunner/index.ts', 'TaskRunnerService.runTask'],
    id: 'lobehub_task_runner',
    role: 'Resolves a task, assigns an agent, builds the prompt, sets running status, invokes AiAgentService, and records topic lifecycle hooks.',
    status: 'available',
    title: 'LobeHub task runner',
  },
  {
    evidence: ['apps/server/src/services/aiAgent/index.ts', 'AiAgentService.execAgent'],
    id: 'heterogeneous_codex_runtime',
    role: 'Recognizes heterogeneous agent models including codex and routes execution through the hetero agent path.',
    status: 'available',
    title: 'Codex heterogeneous execution path',
  },
  {
    evidence: ['src/store/chat/utils/desktopNotification.ts'],
    id: 'human_approval_notification',
    role: 'Desktop notification surface for human approval-required tool execution.',
    status: 'available',
    title: 'Human approval notification',
  },
  {
    evidence: ['apps/server/src/services/verify/prompts.ts'],
    id: 'evidence_verifier',
    role: 'Verification prompt contract that defaults to uncertain when evidence is missing.',
    status: 'available',
    title: 'Evidence verifier contract',
  },
];

const buildLanes = ({
  canonicalStoreMap,
  commandGateMap,
  durableHandoffReady,
}: {
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  commandGateMap: AzaLiveCommandGateMap;
  durableHandoffReady: boolean;
}): HarnessLane[] => {
  const durableBlocked = !durableHandoffReady;

  return [
    {
      approval: 'none for read-only inspection',
      evidence: ['/aza', '/aza/live-system-map', '/aza/live-command-gates'],
      executor: 'Codex in current desktop thread',
      id: 'read_only_architecture_inventory',
      input: 'User architecture, memory, app, service, and GTM questions.',
      label: 'Read-only architecture inventory',
      nextAction:
        'Keep expanding live maps until the operator can answer path, memory, and ownership questions from LobeHub.',
      output: 'Rendered command-center sections, JSON maps, screenshots, and validation output.',
      status: 'active_manual',
    },
    {
      approval: 'LobeHub scoped code edits allowed after information organization is explained.',
      evidence: ['current Codex session', 'src/app/aza', 'public/aza'],
      executor: 'Codex coding executor',
      id: 'lobehub_scoped_code_execution',
      input: 'Approved LobeHub AzA command-center implementation work.',
      label: 'LobeHub-scoped code execution',
      nextAction:
        'Continue attaching validation evidence to every command-center layer before treating it as durable architecture.',
      output:
        'Local LobeHub files, live API endpoints, browser screenshots, and validation evidence.',
      status: 'active_manual',
    },
    {
      approval:
        'requires canonical store, command write gates, and explicit command-record schema approval',
      evidence: [
        '/aza/live-canonical-store',
        '/aza/live-command-gates',
        '/aza/live-command-record-schema',
      ],
      executor: 'LobeHub TaskModel -> TaskRunnerService -> AiAgentService codex hetero path',
      id: 'durable_lobehub_to_codex_handoff',
      input:
        'Typed command record with target path, allowed actions, approval state, rollback, and evidence requirements.',
      label: 'Durable LobeHub-to-Codex handoff',
      nextAction: durableBlocked
        ? canonicalStoreMap.summary.blockedChecks > 0 ||
          !commandGateMap.summary.canonicalWritesAllowed
          ? 'Keep this blocked until canonical store prerequisites, command write gates, and command record schema are verified.'
          : 'Create live handoff and evidence proof records in AzA.'
        : 'Implement a narrow command-record adapter that creates a LobeHub task for approved Codex execution.',
      output: 'Tracked task/topic/operation with Codex execution state and evidence receipts.',
      status: durableBlocked ? 'blocked' : 'planned',
    },
    {
      approval:
        'human approval required before account, browser, publishing, or customer-facing actions',
      evidence: ['/aza/live-content-ops', '/aza/live-agent-access-matrix'],
      executor: 'Codex plus approved app/browser/device adapter',
      id: 'content_and_growth_operations',
      input: 'Content campaign, app surface, target account label, action class, and risk label.',
      label: 'Content and growth operations',
      nextAction:
        'Keep as approval-required until account labels, output folders, and action classes are audited.',
      output: 'Draft assets, evidence records, and approved publish/action events.',
      status: 'approval_required',
    },
    {
      approval: 'explicit projection approval required',
      evidence: ['/aza/live-command-gates', '/aza/live-implementation-proof'],
      executor: 'Future AzA projection worker',
      id: 'vanta_brain_projection',
      input: 'Reviewed canonical AzA record with redaction and projection policy.',
      label: 'VANTA-Brain projection',
      nextAction:
        'Do not project until canonical records exist and the user approves the exact destination.',
      output: 'Reviewed markdown projection in VANTA-Brain.',
      status: 'blocked',
    },
  ];
};

const buildHandoffSteps = ({ durableReady }: { durableReady: boolean }): HarnessHandoffStep[] => [
  {
    contract:
      'Intent must include lane, target path, owner, action class, sensitivity, and evidence requirements.',
    evidence: ['/aza/live-command-gates'],
    from: 'operator',
    id: 'intent_to_command',
    label: 'Operator intent becomes a command card',
    status: 'active_manual',
    to: 'LobeHub harness',
  },
  {
    contract:
      'LobeHub classifies whether the command is read-only, LobeHub-scoped, VAN-scoped, browser/device, canonical write, or projection.',
    evidence: ['/aza/live-ownership-resolution', '/aza/live-agent-access-matrix'],
    from: 'LobeHub harness',
    id: 'approval_classification',
    label: 'Classify approval and write boundary',
    status: 'active_manual',
    to: 'command gates',
  },
  {
    contract:
      'Approved implementation work is executed by Codex with terminal, code graph, browser checks, and validation output.',
    evidence: ['current Codex desktop thread'],
    from: 'LobeHub harness',
    id: 'codex_execution',
    label: 'Codex executes approved work',
    status: 'active_manual',
    to: 'Codex executor',
  },
  {
    contract:
      'Every completion claim needs command output, HTTP response, screenshot, file reference, or verifier result.',
    evidence: ['apps/server/src/services/verify/prompts.ts', '/aza/live-implementation-proof'],
    from: 'Codex executor',
    id: 'evidence_capture',
    label: 'Attach evidence before done',
    status: 'active_manual',
    to: 'AzA command center',
  },
  {
    contract:
      'Durable record write waits for canonical store, schema, command write gate, rollback, and redaction proof.',
    evidence: [
      '/aza/live-canonical-store',
      '/aza/live-command-gates',
      '/aza/live-command-record-schema',
    ],
    from: 'AzA command center',
    id: 'durable_record_write',
    label: 'Persist command and evidence records',
    status: durableReady ? 'planned' : 'blocked',
    to: 'AzA canonical brain',
  },
];

export const getAzaLiveCodexHarnessMap = async ({
  canonicalStoreMap,
  commandGateMap,
}: {
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  commandGateMap?: AzaLiveCommandGateMap;
} = {}): Promise<AzaLiveCodexHarnessMap> => {
  const [codexApp, codexState, liveCanonicalStoreMap, liveCommandGateMap, proofReady] =
    await Promise.all([
      pathExists('codex_app', '/Applications/Codex.app'),
      pathExists('codex_state', '/Users/growthgod/.codex'),
      canonicalStoreMap ?? getAzaLiveCanonicalStoreMap(),
      commandGateMap ?? getAzaLiveCommandGateMap(),
      readDurableHandoffProof(),
    ]);
  const primitives = buildPrimitives();
  const durableHandoffReady =
    proofReady ||
    (liveCanonicalStoreMap.summary.blockedChecks === 0 &&
      liveCanonicalStoreMap.summary.partialChecks === 0 &&
      liveCommandGateMap.summary.canonicalWritesAllowed);
  const lanes = buildLanes({
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
    durableHandoffReady,
  });

  return {
    generatedAt: new Date().toISOString(),
    handoffSteps: buildHandoffSteps({ durableReady: durableHandoffReady }),
    lanes,
    mode: 'read_only_codex_harness_bridge_map',
    pathProbes: [codexApp, codexState],
    primitives,
    safety: {
      captured: [
        'harness primitive labels',
        'source file pointers',
        'lane statuses',
        'approval classes',
        'handoff step contracts',
        'Codex app path presence',
        'Codex state path presence',
      ],
      excluded: [
        'raw Codex logs',
        'raw memory contents',
        'raw task contents',
        'browser tabs',
        'private messages',
        'secrets',
        'database contents',
        'command execution',
      ],
      writesAllowed: false,
    },
    summary: {
      activeManualLanes: lanes.filter((lane) => lane.status === 'active_manual').length,
      approvalRequiredLanes: lanes.filter((lane) => lane.status === 'approval_required').length,
      blockedLanes: lanes.filter((lane) => lane.status === 'blocked').length,
      codexAppPresent: codexApp.present,
      codexStatePresent: codexState.present,
      durableHandoffReady,
      lanes: lanes.length,
      primitives: primitives.length,
      writesAllowed: false,
    },
  };
};
