import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { type AzaLiveCommandGateMap, getAzaLiveCommandGateMap } from './liveCommandGateMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './liveServiceMap';

type JsonRecord = Record<string, unknown>;

type ProofStatus = 'approval_required' | 'blocked' | 'partial' | 'passed' | 'planned';

export type ImplementationProofGate = {
  blockers: string[];
  evidence: string[];
  id: string;
  nextAction: string;
  owner: string;
  proofNeeded: string;
  status: ProofStatus;
  title: string;
};

export type ImplementationPhase = {
  gates: string[];
  id: string;
  label: string;
  outcome: string;
  status: ProofStatus;
};

export type AzaLiveImplementationProofMap = {
  generatedAt: string;
  gates: ImplementationProofGate[];
  mode: 'read_only_live_implementation_proof_map';
  phases: ImplementationPhase[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    approvalRequiredGates: number;
    blockedGates: number;
    partialGates: number;
    passedGates: number;
    plannedGates: number;
    totalGates: number;
    writesAllowed: false;
  };
};

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const readJson = async (name: string): Promise<JsonRecord> => {
  const raw = await readFile(artifactPath(name), 'utf8');
  const parsed: unknown = JSON.parse(raw);

  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as JsonRecord)
    : {};
};

const recordArray = (value: unknown): JsonRecord[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is JsonRecord =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const auditGate = (audit: JsonRecord, id: string) =>
  recordArray(audit.gates).find((gate) => text(gate.id) === id);

const goalProofGate = (audit: JsonRecord, id: string) =>
  recordArray(audit.nextProofGates).find((gate) => text(gate.gate) === id);

const commandGateStatus = (
  commandGateMap: AzaLiveCommandGateMap,
  id: string,
  fallback: ProofStatus,
): ProofStatus => {
  const status = commandGateMap.gates.find((gate) => gate.id === id)?.status;

  if (!status) return fallback;
  if (status === 'approval_required') return 'approval_required';

  return status;
};

const buildProofGates = ({
  brainAudit,
  canonicalStoreMap,
  commandGateMap,
  goalAudit,
  readiness,
  serviceMap,
}: {
  brainAudit: JsonRecord;
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  commandGateMap: AzaLiveCommandGateMap;
  goalAudit: JsonRecord;
  readiness: AzaLiveReadiness;
  serviceMap: AzaLiveServiceMap;
}): ImplementationProofGate[] => {
  const servicesGate = goalProofGate(goalAudit, 'start_and_verify_aza_services');
  const storeGate = goalProofGate(goalAudit, 'verify_postgres_canonical_store');
  const mcpGate = goalProofGate(goalAudit, 'verify_mcp_tools');
  const adapterGate = goalProofGate(goalAudit, 'extend_lobehub_read_adapter_to_records');
  const boardGate = goalProofGate(goalAudit, 'build_first_durable_board');
  const projectionGate = goalProofGate(goalAudit, 'projection_approval');

  return [
    {
      blockers:
        serviceMap.summary.azaPortsMissing > 0
          ? [`${serviceMap.summary.azaPortsMissing} planned AzA service ports are missing.`]
          : [],
      evidence: ['/aza/live-readiness', '/aza/live-service-map'],
      id: 'start_and_verify_aza_services',
      nextAction:
        'Request approval to work inside /Users/growthgod/VAN/aza_memory, then start gateway, API, MCP, sync, and worker and verify /health plus /ready.',
      owner: 'Engineering lead',
      proofNeeded: text(
        servicesGate?.proofNeeded,
        'GET /health and /ready must succeed on AzA ports 8786-8790.',
      ),
      status: serviceMap.summary.azaPortsMissing === 0 ? 'passed' : 'blocked',
      title: 'Start and verify AzA services',
    },
    {
      blockers: [
        ...canonicalStoreMap.checks
          .filter((check) => check.status !== 'ready')
          .map((check) => check.title),
        text(
          auditGate(brainAudit, 'durable_store_wiring')?.evidence,
          'Durable store wiring still needs verification.',
        ),
      ],
      evidence: ['/aza/live-canonical-store', '/aza/aza-brain-readiness-audit.json'],
      id: 'verify_postgres_canonical_store',
      nextAction:
        canonicalStoreMap.summary.requiredEnvPresent === canonicalStoreMap.summary.requiredEnvTotal
          ? 'Next proof is a read-only database connection check, then migration, pgvector, table, API, MCP, and worker store verification.'
          : 'Set the required store environment in the LobeHub/AzA runtime without exposing secrets, then rerun the canonical store readiness map.',
      owner: 'Knowledge lead',
      proofNeeded: text(
        storeGate?.proofNeeded,
        'Migrations and canonical Postgres wiring must be verified.',
      ),
      status:
        canonicalStoreMap.summary.blockedChecks === 0 &&
        canonicalStoreMap.summary.partialChecks === 0
          ? 'passed'
          : canonicalStoreMap.summary.requiredEnvPresent ===
                canonicalStoreMap.summary.requiredEnvTotal &&
              canonicalStoreMap.summary.supportedDriver
            ? 'partial'
            : 'blocked',
      title: 'Verify durable canonical store',
    },
    {
      blockers: readiness.summary.liveMcpAvailable
        ? []
        : ['AzA MCP health is not reachable from LobeHub.'],
      evidence: ['/aza/live-readiness', '/aza/aza-brain-readiness-audit.json'],
      id: 'verify_mcp_tools',
      nextAction:
        'After MCP is live, initialize MCP session, list tools, call implemented retrieval tools, and mark placeholders unavailable.',
      owner: 'Knowledge lead',
      proofNeeded: text(mcpGate?.proofNeeded, 'MCP initialize and implemented tools must work.'),
      status: readiness.summary.liveMcpAvailable ? 'planned' : 'blocked',
      title: 'Verify MCP retrieval tools',
    },
    {
      blockers: readiness.summary.liveAzAReadAvailable
        ? []
        : ['AzA API health is not reachable, so LobeHub cannot read live canonical records.'],
      evidence: ['/aza/live-readiness', '/aza/live-system-map'],
      id: 'extend_lobehub_read_adapter_to_records',
      nextAction:
        'Once AzA API/MCP/store gates pass, replace static/derived boards with live typed records behind read-only LobeHub adapters.',
      owner: 'Product lead',
      proofNeeded: text(
        adapterGate?.proofNeeded,
        'LobeHub must read live AzA memory, board, and registry records.',
      ),
      status: readiness.summary.liveAzAReadAvailable ? 'planned' : 'blocked',
      title: 'Extend LobeHub read adapters to records',
    },
    {
      blockers: [
        commandGateMap.gates.find((gate) => gate.id === 'durable_operating_board')?.reason ??
          'Durable operating board records are not verified.',
      ],
      evidence: ['/aza/live-operating-board', '/aza/live-command-gates'],
      id: 'build_first_durable_board',
      nextAction:
        'After canonical writes are allowed, back Daily Command or Memory Intake with typed AzA records.',
      owner: 'Product lead',
      proofNeeded: text(
        boardGate?.proofNeeded,
        'A durable board must show owner, status, evidence, and next action from AzA records.',
      ),
      status: commandGateStatus(commandGateMap, 'durable_operating_board', 'blocked'),
      title: 'Build first durable operating board',
    },
    {
      blockers: [
        commandGateMap.gates.find((gate) => gate.id === 'vanta_brain_projection')?.reason ??
          'Projection remains blocked.',
      ],
      evidence: ['/aza/live-command-gates', '/aza/vanta-brain-readonly-audit.json'],
      id: 'projection_approval',
      nextAction:
        'Keep VANTA-Brain read-only until a canonical AzA record exists, redaction passes, and the exact destination is approved.',
      owner: 'Human operator',
      proofNeeded: text(
        projectionGate?.proofNeeded,
        'User must approve a specific VANTA-Brain projection target after canonical write verification.',
      ),
      status: 'approval_required',
      title: 'Approve first VANTA-Brain projection',
    },
  ];
};

const buildPhases = (gates: ImplementationProofGate[]): ImplementationPhase[] => [
  {
    gates: ['start_and_verify_aza_services'],
    id: 'phase_1_live_services',
    label: 'Phase 1: make AzA observable',
    outcome: 'Gateway, API, MCP, sync, and worker expose health/readiness from LobeHub.',
    status: gates.find((gate) => gate.id === 'start_and_verify_aza_services')?.status ?? 'blocked',
  },
  {
    gates: ['verify_postgres_canonical_store', 'verify_mcp_tools'],
    id: 'phase_2_canonical_backend',
    label: 'Phase 2: verify canonical backend',
    outcome: 'Durable Postgres and MCP retrieval become the source of live AzA records.',
    status: gates.some((gate) => gate.id === 'verify_mcp_tools' && gate.status === 'blocked')
      ? 'blocked'
      : 'partial',
  },
  {
    gates: ['extend_lobehub_read_adapter_to_records', 'build_first_durable_board'],
    id: 'phase_3_lobehub_records',
    label: 'Phase 3: connect LobeHub to live records',
    outcome:
      'Daily Command, Memory Intake, GTM, content, and evidence views read durable AzA records.',
    status: 'blocked',
  },
  {
    gates: ['projection_approval'],
    id: 'phase_4_projection',
    label: 'Phase 4: approved projection',
    outcome: 'Reviewed and redacted AzA records project into VANTA-Brain only after approval.',
    status: 'approval_required',
  },
];

export const getAzaLiveImplementationProofMap = async ({
  commandGateMap,
  canonicalStoreMap,
  readiness,
  serviceMap,
}: {
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  commandGateMap?: AzaLiveCommandGateMap;
  readiness?: AzaLiveReadiness;
  serviceMap?: AzaLiveServiceMap;
} = {}): Promise<AzaLiveImplementationProofMap> => {
  const [
    brainAudit,
    goalAudit,
    liveReadiness,
    liveServiceMap,
    liveCommandGateMap,
    liveCanonicalStoreMap,
  ] = await Promise.all([
    readJson('aza-brain-readiness-audit.json'),
    readJson('aza-goal-completion-audit.json'),
    readiness ?? getAzaLiveReadiness(),
    serviceMap ?? getAzaLiveServiceMap(),
    commandGateMap ?? getAzaLiveCommandGateMap(),
    canonicalStoreMap ?? getAzaLiveCanonicalStoreMap(),
  ]);
  const gates = buildProofGates({
    brainAudit,
    canonicalStoreMap: liveCanonicalStoreMap,
    commandGateMap: liveCommandGateMap,
    goalAudit,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });

  return {
    generatedAt: new Date().toISOString(),
    gates,
    mode: 'read_only_live_implementation_proof_map',
    phases: buildPhases(gates),
    safety: {
      captured: [
        'proof gate ids',
        'gate statuses',
        'blocker labels',
        'evidence links',
        'owner labels',
        'phase labels',
      ],
      excluded: [
        'raw secrets',
        'environment variables',
        'database contents',
        'raw memory contents',
        'raw session transcripts',
        'browser tabs',
        'private messages',
        'customer credentials',
      ],
      writesAllowed: false,
    },
    summary: {
      approvalRequiredGates: gates.filter((gate) => gate.status === 'approval_required').length,
      blockedGates: gates.filter((gate) => gate.status === 'blocked').length,
      partialGates: gates.filter((gate) => gate.status === 'partial').length,
      passedGates: gates.filter((gate) => gate.status === 'passed').length,
      plannedGates: gates.filter((gate) => gate.status === 'planned').length,
      totalGates: gates.length,
      writesAllowed: false,
    },
  };
};
