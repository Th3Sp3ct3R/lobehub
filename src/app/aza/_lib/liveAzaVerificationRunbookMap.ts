import {
  type AzaLiveAzaImplementationMap,
  getAzaLiveAzaImplementationMap,
} from './liveAzaImplementationMap';
import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { AZA_SERVICES, type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './liveServiceMap';

type VerificationStepStatus =
  | 'approval_required'
  | 'blocked'
  | 'not_attempted'
  | 'passed'
  | 'ready_to_probe';

type VerificationCommandKind =
  | 'approval_required_van_command'
  | 'lobehub_read_only_probe'
  | 'manual_approval'
  | 'not_run_here';

export type AzaVerificationServiceContract = {
  healthUrl: string;
  id: string;
  label: string;
  listening: boolean;
  port: number;
  readyUrl: string;
  requiredFor: string[];
};

export type AzaVerificationStep = {
  approval: string;
  blockedBy: string[];
  commandKind: VerificationCommandKind;
  commandPreview: string;
  cwd: string;
  expectedEvidence: string[];
  id: string;
  phase: string;
  status: VerificationStepStatus;
  title: string;
};

export type AzaLiveVerificationRunbookMap = {
  generatedAt: string;
  mode: 'read_only_aza_verification_runbook_map';
  recommendation: {
    firstAction: string;
    proofRule: string;
    writeRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  serviceContracts: AzaVerificationServiceContract[];
  steps: AzaVerificationStep[];
  summary: {
    approvalRequiredSteps: number;
    blockedSteps: number;
    notAttemptedSteps: number;
    passedSteps: number;
    readyToProbeSteps: number;
    serviceContracts: number;
    steps: number;
    vanCommandSteps: number;
    writesAllowed: false;
  };
};

const AZA_ROOT = '/Users/growthgod/VAN/aza_memory';
const LOBEHUB_ROOT = '/Users/growthgod/lobehub';

const serviceHealth = (readiness: AzaLiveReadiness, id: string) =>
  readiness.services.find((service) => service.id === id);

const serviceIsHealthy = (readiness: AzaLiveReadiness, id: string) =>
  serviceHealth(readiness, id)?.health === 'ok';

const allServicesHealthy = (readiness: AzaLiveReadiness) =>
  AZA_SERVICES.every((service) => serviceIsHealthy(readiness, service.id));

const buildServiceContracts = (readiness: AzaLiveReadiness): AzaVerificationServiceContract[] =>
  AZA_SERVICES.map((service) => {
    const live = serviceHealth(readiness, service.id);
    const requiredFor: string[] =
      service.id === 'aza-gateway'
        ? ['provider proxy', 'capture event intake', 'redaction boundary']
        : service.id === 'aza-api'
          ? ['canonical record reads', 'ingestion', 'search', 'memory proposals']
          : service.id === 'aza-mcp'
            ? ['agent retrieval', 'MCP tool access', 'Codex/Hermes brain reads']
            : service.id === 'aza-sync'
              ? ['ChatGPT sync', 'Claude sync', 'conversation imports']
              : ['normalization', 'extraction', 'embedding', 'projection work'];

    return {
      healthUrl: `http://127.0.0.1:${service.port}/health`,
      id: service.id,
      label: service.label,
      listening: Boolean(live?.listening),
      port: service.port,
      readyUrl: `http://127.0.0.1:${service.port}/ready`,
      requiredFor,
    };
  });

const step = ({
  approval,
  blockedBy = [],
  commandKind,
  commandPreview,
  cwd,
  expectedEvidence,
  id,
  phase,
  status,
  title,
}: AzaVerificationStep): AzaVerificationStep => ({
  approval,
  blockedBy,
  commandKind,
  commandPreview,
  cwd,
  expectedEvidence,
  id,
  phase,
  status,
  title,
});

const buildSteps = ({
  implementationMap,
  canonicalStoreMap,
  readiness,
  serviceMap,
}: {
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  implementationMap: AzaLiveAzaImplementationMap;
  readiness: AzaLiveReadiness;
  serviceMap: AzaLiveServiceMap;
}): AzaVerificationStep[] => {
  const serviceBlocker =
    serviceMap.summary.azaPortsMissing > 0
      ? [`${serviceMap.summary.azaPortsMissing} AzA service ports are not listening.`]
      : [];
  const storeEnvReady =
    canonicalStoreMap.summary.requiredEnvPresent === canonicalStoreMap.summary.requiredEnvTotal &&
    canonicalStoreMap.summary.supportedDriver;
  const migrationKnown = implementationMap.summary.migrationFiles > 0;
  const composeKnown = implementationMap.summary.servicesInCompose > 0;

  return [
    step({
      approval: 'none; LobeHub route probe only',
      blockedBy: readiness.summary.artifactsPresent
        ? []
        : ['Required command-center artifacts missing.'],
      commandKind: 'lobehub_read_only_probe',
      commandPreview: "fetch('http://localhost:3010/aza/live-system-map').then((r) => r.status)",
      cwd: LOBEHUB_ROOT,
      expectedEvidence: ['HTTP 200 from /aza/live-system-map', 'writesAllowed false'],
      id: 'confirm_lobehub_command_center',
      phase: 'phase_0_lobehub',
      status: readiness.summary.artifactsPresent ? 'passed' : 'blocked',
      title: 'Confirm LobeHub command center is observable',
    }),
    step({
      approval: 'explicit user approval required before running VAN commands',
      blockedBy: composeKnown
        ? []
        : ['docker-compose metadata not visible from implementation map.'],
      commandKind: 'manual_approval',
      commandPreview:
        'Ask operator for approval to run read-only/startup checks in /Users/growthgod/VAN/aza_memory.',
      cwd: AZA_ROOT,
      expectedEvidence: [
        'approved target path',
        'approved command class',
        'rollback/stop plan',
        'no secret printing',
      ],
      id: 'request_van_runtime_approval',
      phase: 'phase_1_approval',
      status: 'approval_required',
      title: 'Request approval for AzA runtime verification',
    }),
    step({
      approval: 'approval required; starts local containers/services and may touch local volumes',
      blockedBy: composeKnown ? [] : ['Compose service topology is not known.'],
      commandKind: 'approval_required_van_command',
      commandPreview:
        'docker compose up -d postgres redis 9router aza-gateway aza-api aza-worker aza-mcp aza-sync',
      cwd: AZA_ROOT,
      expectedEvidence: [
        'compose service ids',
        'container status',
        'localhost bindings for 8786-8790 and 20127',
      ],
      id: 'start_aza_compose_services',
      phase: 'phase_2_services',
      status: allServicesHealthy(readiness) ? 'passed' : 'approval_required',
      title: 'Start AzA compose services',
    }),
    ...AZA_SERVICES.map((service) =>
      step({
        approval: 'none after services are started; HTTP health/ready probe only',
        blockedBy: serviceIsHealthy(readiness, service.id)
          ? []
          : [`${service.label} is not currently healthy on ${service.port}.`],
        commandKind: 'lobehub_read_only_probe',
        commandPreview: `curl -fsS http://127.0.0.1:${service.port}/health && curl -fsS http://127.0.0.1:${service.port}/ready`,
        cwd: LOBEHUB_ROOT,
        expectedEvidence: [
          `${service.label} /health returns success`,
          `${service.label} /ready returns success`,
          'response bodies contain no secrets',
        ],
        id: `probe_${service.id}`,
        phase: 'phase_2_services',
        status: serviceIsHealthy(readiness, service.id) ? 'passed' : 'blocked',
        title: `Probe ${service.label} health and readiness`,
      }),
    ),
    step({
      approval:
        'approval required; database connection probe but no row contents should be printed',
      blockedBy: [
        ...(storeEnvReady ? [] : ['Required store environment is missing or unsupported.']),
        ...(migrationKnown ? [] : ['Migration metadata is not visible.']),
        ...serviceBlocker,
      ],
      commandKind: 'approval_required_van_command',
      commandPreview:
        'docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "select extname from pg_extension where extname = \'vector\';"',
      cwd: AZA_ROOT,
      expectedEvidence: [
        'database connection succeeds',
        'pgvector extension exists',
        `${implementationMap.summary.databaseTables} expected table names are present`,
        'no row contents or secrets printed',
      ],
      id: 'verify_postgres_pgvector_and_tables',
      phase: 'phase_3_store',
      status:
        storeEnvReady && migrationKnown && serviceBlocker.length === 0
          ? 'ready_to_probe'
          : 'blocked',
      title: 'Verify Postgres, pgvector, and migrations',
    }),
    step({
      approval: 'none after MCP service is healthy; initialize/list/call safe retrieval tools only',
      blockedBy: readiness.summary.liveMcpAvailable
        ? []
        : ['AzA MCP health is not reachable from LobeHub.'],
      commandKind: 'not_run_here',
      commandPreview:
        'MCP initialize -> tools/list -> call list_conversations/search_conversations/get_project_context with safe arguments.',
      cwd: LOBEHUB_ROOT,
      expectedEvidence: [
        `${implementationMap.summary.implementedMcpTools} implemented MCP tools listed`,
        `${implementationMap.summary.placeholderMcpTools} placeholder tools marked unavailable`,
        'retrieval responses contain structured metadata only',
      ],
      id: 'verify_mcp_tool_contract',
      phase: 'phase_4_mcp',
      status: readiness.summary.liveMcpAvailable ? 'ready_to_probe' : 'blocked',
      title: 'Verify MCP tool contract',
    }),
    step({
      approval:
        'approval required; writes a disposable test record only after canonical write gates pass',
      blockedBy: [
        ...(readiness.summary.liveAzAReadAvailable ? [] : ['AzA API read health is unavailable.']),
        ...(readiness.summary.liveMcpAvailable ? [] : ['AzA MCP health is unavailable.']),
        ...(storeEnvReady ? [] : ['Canonical store prerequisites are not ready.']),
      ],
      commandKind: 'approval_required_van_command',
      commandPreview:
        'Create disposable test conversation via API, read it through API and MCP, then delete/archive according to approved rollback.',
      cwd: AZA_ROOT,
      expectedEvidence: [
        'single canonical record id visible through API',
        'same record retrievable through MCP',
        'rollback/archive evidence',
      ],
      id: 'verify_api_mcp_shared_store',
      phase: 'phase_5_end_to_end',
      status:
        readiness.summary.liveAzAReadAvailable &&
        readiness.summary.liveMcpAvailable &&
        storeEnvReady
          ? 'approval_required'
          : 'blocked',
      title: 'Verify API and MCP share the same durable store',
    }),
    step({
      approval: 'approval required for exact VANTA-Brain destination; no write during this pass',
      blockedBy: ['User prohibited VANTA-Brain writes during this goal pass.'],
      commandKind: 'manual_approval',
      commandPreview:
        'Select one canonical AzA record and one projection destination, then request explicit projection approval.',
      cwd: '/Users/growthgod/Documents/VANTA-Brain',
      expectedEvidence: [
        'canonical AzA id',
        'redaction result',
        'approved destination path',
        'projection rollback plan',
      ],
      id: 'approve_first_vanta_brain_projection',
      phase: 'phase_6_projection',
      status: 'approval_required',
      title: 'Approve first VANTA-Brain projection',
    }),
  ];
};

export const getAzaLiveVerificationRunbookMap = async ({
  canonicalStoreMap,
  implementationMap,
  readiness,
  serviceMap,
}: {
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  implementationMap?: AzaLiveAzaImplementationMap;
  readiness?: AzaLiveReadiness;
  serviceMap?: AzaLiveServiceMap;
} = {}): Promise<AzaLiveVerificationRunbookMap> => {
  const [liveReadiness, liveServiceMap, liveCanonicalStoreMap] = await Promise.all([
    readiness ?? getAzaLiveReadiness(),
    serviceMap ?? getAzaLiveServiceMap(),
    canonicalStoreMap ?? getAzaLiveCanonicalStoreMap(),
  ]);
  const liveImplementationMap =
    implementationMap ??
    (await getAzaLiveAzaImplementationMap({
      serviceMap: liveServiceMap,
    }));
  const serviceContracts = buildServiceContracts(liveReadiness);
  const steps = buildSteps({
    canonicalStoreMap: liveCanonicalStoreMap,
    implementationMap: liveImplementationMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_aza_verification_runbook_map',
    recommendation: {
      firstAction:
        'Keep using LobeHub read-only probes until the operator explicitly approves VAN runtime commands.',
      proofRule:
        'Every promotion from planned to ready needs HTTP, database, MCP, or screenshot evidence tied to a route, path, or service id.',
      writeRule:
        'No canonical writes, VANTA-Brain projection, browser actions, or database mutations happen from this runbook.',
    },
    safety: {
      captured: [
        'service ids',
        'localhost health and ready URLs',
        'step ids',
        'phase labels',
        'command previews',
        'approval labels',
        'expected evidence labels',
        'blocker labels',
      ],
      excluded: [
        'raw environment values',
        'API keys',
        'OAuth tokens',
        'cookies',
        'passwords',
        'database rows',
        'raw conversations',
        'private messages',
        'browser tabs',
        'generated media contents',
      ],
      writesAllowed: false,
    },
    serviceContracts,
    steps,
    summary: {
      approvalRequiredSteps: steps.filter((candidate) => candidate.status === 'approval_required')
        .length,
      blockedSteps: steps.filter((candidate) => candidate.status === 'blocked').length,
      notAttemptedSteps: steps.filter((candidate) => candidate.status === 'not_attempted').length,
      passedSteps: steps.filter((candidate) => candidate.status === 'passed').length,
      readyToProbeSteps: steps.filter((candidate) => candidate.status === 'ready_to_probe').length,
      serviceContracts: serviceContracts.length,
      steps: steps.length,
      vanCommandSteps: steps.filter(
        (candidate) => candidate.commandKind === 'approval_required_van_command',
      ).length,
      writesAllowed: false,
    },
  };
};
