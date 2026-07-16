import {
  type AzaLiveCanonicalStoreMap,
  getAzaLiveCanonicalStoreMap,
} from './liveCanonicalStoreMap';
import { type AzaLiveCodexHarnessMap, getAzaLiveCodexHarnessMap } from './liveCodexHarnessMap';
import {
  type AzaLiveCommandRecordSchemaMap,
  getAzaLiveCommandRecordSchemaMap,
} from './liveCommandRecordSchemaMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';
import { type AzaLiveServiceMap, getAzaLiveServiceMap } from './liveServiceMap';

type ProtocolStatus =
  | 'active'
  | 'active_manual'
  | 'approval_required'
  | 'blocked'
  | 'planned'
  | 'snapshot';

export type CommunicationProtocol = {
  approval: string;
  blockedBy: string[];
  evidence: string[];
  from: string;
  id: string;
  nextProof: string;
  purpose: string;
  status: ProtocolStatus;
  to: string;
  transport: string;
};

export type AzaLiveCommunicationProtocolMap = {
  generatedAt: string;
  mode: 'read_only_communication_protocol_map';
  protocols: CommunicationProtocol[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    activeManualProtocols: number;
    activeProtocols: number;
    approvalRequiredProtocols: number;
    blockedProtocols: number;
    liveAzAApiAvailable: boolean;
    liveMcpAvailable: boolean;
    plannedProtocols: number;
    protocolCount: number;
    snapshotProtocols: number;
    writesAllowed: false;
  };
};

const firstMissingServiceReason = (serviceMap: AzaLiveServiceMap) =>
  serviceMap.summary.azaPortsMissing > 0
    ? `${serviceMap.summary.azaPortsMissing} planned AzA service ports are missing.`
    : 'Planned AzA service ownership still needs proof.';

const buildProtocols = ({
  canonicalStoreMap,
  codexHarnessMap,
  commandRecordSchemaMap,
  readiness,
  serviceMap,
}: {
  canonicalStoreMap: AzaLiveCanonicalStoreMap;
  codexHarnessMap: AzaLiveCodexHarnessMap;
  commandRecordSchemaMap: AzaLiveCommandRecordSchemaMap;
  readiness: AzaLiveReadiness;
  serviceMap: AzaLiveServiceMap;
}): CommunicationProtocol[] => {
  const serviceBlocker = firstMissingServiceReason(serviceMap);
  const canonicalStoreBlocked =
    canonicalStoreMap.summary.blockedChecks > 0 || canonicalStoreMap.summary.partialChecks > 0;
  const durableRecordsBlocked = !commandRecordSchemaMap.summary.durableWriteReady;

  return [
    {
      approval: 'none for read-only inspection',
      blockedBy: readiness.summary.artifactsPresent ? [] : ['command-center artifacts missing'],
      evidence: ['/aza', '/aza/live-readiness'],
      from: 'human_operator',
      id: 'operator_to_lobehub_next_route',
      nextProof: 'Keep /aza rendering and artifact checks green as more live maps are added.',
      purpose: 'Operator reads the AzA command-center dashboard in the LobeHub harness.',
      status: readiness.summary.artifactsPresent ? 'active' : 'blocked',
      to: 'lobehub_harness',
      transport: 'Next.js route and public AzA artifacts',
    },
    {
      approval: 'LobeHub-scoped edits are allowed only after the organization is explained.',
      blockedBy:
        codexHarnessMap.summary.codexAppPresent && codexHarnessMap.summary.codexStatePresent
          ? []
          : ['Codex app or Codex local state is missing.'],
      evidence: ['/aza/live-codex-harness', 'current Codex desktop thread'],
      from: 'lobehub_harness',
      id: 'lobehub_to_codex_manual_execution',
      nextProof:
        'Keep attaching validation evidence before treating any manual Codex result as durable.',
      purpose:
        'LobeHub command context is executed manually by Codex in the current desktop thread.',
      status:
        codexHarnessMap.summary.codexAppPresent && codexHarnessMap.summary.codexStatePresent
          ? 'active_manual'
          : 'blocked',
      to: 'codex_executor',
      transport: 'Codex desktop app, terminal, code graph, filesystem reads, and browser checks',
    },
    {
      approval: 'approval required before writing to /Users/growthgod/VAN',
      blockedBy: ['VAN is the active runtime workspace and remains approval-first.'],
      evidence: ['/aza/live-project-map', '/aza/aza-read-write-contract.json'],
      from: 'codex_executor',
      id: 'codex_to_van_workspace',
      nextProof:
        'Ask for exact target path, reason, rollback, and validation before any VAN write.',
      purpose: 'Codex can inspect VAN metadata now, but runtime workspace writes require approval.',
      status: 'approval_required',
      to: 'van_runtime_workspace',
      transport: 'filesystem metadata and future approved repo edits',
    },
    {
      approval: 'blocked until AzA API health and schema gates pass',
      blockedBy: readiness.summary.liveAzAReadAvailable ? [] : [serviceBlocker],
      evidence: ['/aza/live-readiness', '/aza/live-service-map'],
      from: 'lobehub_harness',
      id: 'lobehub_to_aza_http_api',
      nextProof:
        'Start and verify AzA API health only after approval to work inside VAN/aza_memory.',
      purpose: 'LobeHub should read and submit approved AzA command/memory records over HTTP.',
      status: readiness.summary.liveAzAReadAvailable ? 'planned' : 'blocked',
      to: 'aza_api',
      transport: 'planned localhost HTTP API',
    },
    {
      approval: 'blocked until MCP initialize and retrieval tools are verified',
      blockedBy: readiness.summary.liveMcpAvailable ? [] : [serviceBlocker],
      evidence: ['/aza/live-readiness', '/aza/live-implementation-proof'],
      from: 'lobehub_harness',
      id: 'lobehub_to_aza_mcp',
      nextProof: 'Initialize MCP, list tools, and verify implemented retrieval tools.',
      purpose: 'LobeHub and agents should query AzA memory through MCP once service health passes.',
      status: readiness.summary.liveMcpAvailable ? 'planned' : 'blocked',
      to: 'aza_mcp_server',
      transport: 'planned MCP JSON-RPC session',
    },
    {
      approval: 'requires required env, live DB connection, migrations, pgvector, and schema proof',
      blockedBy: canonicalStoreBlocked
        ? [
            `${canonicalStoreMap.summary.blockedChecks} store checks blocked.`,
            `${canonicalStoreMap.summary.partialChecks} store checks partial or not attempted.`,
          ]
        : [],
      evidence: ['/aza/live-canonical-store'],
      from: 'aza_api_and_mcp',
      id: 'aza_to_postgres_canonical_store',
      nextProof:
        'Verify database connection, migrations, pgvector, tables, and shared API/MCP store.',
      purpose: 'AzA durable records should land in one canonical Postgres-backed store.',
      status: canonicalStoreBlocked ? 'blocked' : 'planned',
      to: 'canonical_postgres_store',
      transport: 'Postgres and pgvector',
    },
    {
      approval:
        'requires command schema, canonical store, write gates, rollback, and redaction proof',
      blockedBy: durableRecordsBlocked ? ['durable command record writes are not ready'] : [],
      evidence: ['/aza/live-command-record-schema', '/aza/live-codex-harness'],
      from: 'lobehub_harness',
      id: 'lobehub_to_durable_command_records',
      nextProof:
        'Implement only after live AzA API, DB, schema validation, approval, and evidence gates pass.',
      purpose: 'LobeHub should persist command, approval, Codex run, and evidence records.',
      status: durableRecordsBlocked ? 'blocked' : 'planned',
      to: 'aza_command_records',
      transport: 'future typed AzA record adapter',
    },
    {
      approval: 'sensitivity review required before promotion',
      blockedBy: readiness.summary.canonicalWritesAllowed
        ? []
        : ['canonical writes are disabled by readiness and write contract'],
      evidence: ['/aza/live-brain-topology', '/aza/live-agent-access-matrix'],
      from: 'codex_hermes_agent_runtimes',
      id: 'agent_runtime_to_aza_memory_promotion',
      nextProof:
        'Attach agent id, session id, source path, sensitivity, allowed readers, and evidence.',
      purpose:
        'Granular agent/session memory should promote reviewed facts into the unified AzA brain.',
      status: readiness.summary.canonicalWritesAllowed ? 'planned' : 'blocked',
      to: 'aza_memory_namespaces',
      transport: 'future memory promotion adapter',
    },
    {
      approval:
        'human approval required for publishing, account, browser, device, or customer actions',
      blockedBy: [
        'account labels, output folders, and action classes still need approval-first audits',
      ],
      evidence: ['/aza/live-content-ops', '/aza/live-app-map'],
      from: 'content_webapps_and_electron_apps',
      id: 'content_apps_to_aza_asset_registry',
      nextProof: 'Verify app role, output folder, account label, action class, and evidence path.',
      purpose:
        'Content tools should create draft artifacts and safe asset/event records for campaigns.',
      status: 'approval_required',
      to: 'aza_asset_and_content_records',
      transport: 'reviewed exports, screenshots, files, and future asset records',
    },
    {
      approval: 'explicit projection approval required',
      blockedBy: readiness.summary.projectionToVantaBrainAllowed
        ? []
        : ['VANTA-Brain projection is disabled for this pass'],
      evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/live-command-gates'],
      from: 'aza_canonical_brain',
      id: 'aza_to_vanta_brain_projection',
      nextProof:
        'Only project reviewed markdown after canonical record id, redaction, template, and destination approval.',
      purpose: 'AzA should project safe human-readable summaries into VANTA-Brain.',
      status: readiness.summary.projectionToVantaBrainAllowed ? 'planned' : 'blocked',
      to: 'vanta_brain_projection_vault',
      transport: 'future projection worker writing reviewed markdown',
    },
    {
      approval: 'route only after service owner and cwd verification',
      blockedBy:
        serviceMap.summary.listenerCount > 0
          ? []
          : ['no local TCP listeners were visible to the service map'],
      evidence: ['/aza/live-service-map', '/aza/local-service-port-inventory.json'],
      from: 'local_services',
      id: 'local_services_to_lobehub_inventory',
      nextProof:
        'Classify unknown listeners and attach owner, cwd, role, health route, and expected port.',
      purpose: 'LobeHub should understand running local services before routing work through them.',
      status: serviceMap.summary.listenerCount > 0 ? 'snapshot' : 'blocked',
      to: 'lobehub_harness',
      transport: 'read-only TCP listener and process cwd inventory',
    },
  ];
};

export const getAzaLiveCommunicationProtocolMap = async ({
  canonicalStoreMap,
  codexHarnessMap,
  commandRecordSchemaMap,
  readiness,
  serviceMap,
}: {
  canonicalStoreMap?: AzaLiveCanonicalStoreMap;
  codexHarnessMap?: AzaLiveCodexHarnessMap;
  commandRecordSchemaMap?: AzaLiveCommandRecordSchemaMap;
  readiness?: AzaLiveReadiness;
  serviceMap?: AzaLiveServiceMap;
} = {}): Promise<AzaLiveCommunicationProtocolMap> => {
  const [liveReadiness, liveServiceMap, liveCanonicalStoreMap] = await Promise.all([
    readiness ?? getAzaLiveReadiness(),
    serviceMap ?? getAzaLiveServiceMap(),
    canonicalStoreMap ?? getAzaLiveCanonicalStoreMap(),
  ]);
  const liveCodexHarnessMap =
    codexHarnessMap ??
    (await getAzaLiveCodexHarnessMap({
      canonicalStoreMap: liveCanonicalStoreMap,
    }));
  const liveCommandRecordSchemaMap =
    commandRecordSchemaMap ??
    (await getAzaLiveCommandRecordSchemaMap({
      canonicalStoreMap: liveCanonicalStoreMap,
      codexHarnessMap: liveCodexHarnessMap,
    }));
  const protocols = buildProtocols({
    canonicalStoreMap: liveCanonicalStoreMap,
    codexHarnessMap: liveCodexHarnessMap,
    commandRecordSchemaMap: liveCommandRecordSchemaMap,
    readiness: liveReadiness,
    serviceMap: liveServiceMap,
  });

  return {
    generatedAt: new Date().toISOString(),
    mode: 'read_only_communication_protocol_map',
    protocols,
    safety: {
      captured: [
        'protocol labels',
        'transport labels',
        'endpoint roles',
        'approval labels',
        'status labels',
        'blocker labels',
        'evidence links',
      ],
      excluded: [
        'request bodies',
        'database contents',
        'raw memory contents',
        'raw task contents',
        'browser tabs',
        'private messages',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
        'command arguments',
      ],
      writesAllowed: false,
    },
    summary: {
      activeManualProtocols: protocols.filter((protocol) => protocol.status === 'active_manual')
        .length,
      activeProtocols: protocols.filter((protocol) => protocol.status === 'active').length,
      approvalRequiredProtocols: protocols.filter(
        (protocol) => protocol.status === 'approval_required',
      ).length,
      blockedProtocols: protocols.filter((protocol) => protocol.status === 'blocked').length,
      liveAzAApiAvailable: liveReadiness.summary.liveAzAReadAvailable,
      liveMcpAvailable: liveReadiness.summary.liveMcpAvailable,
      plannedProtocols: protocols.filter((protocol) => protocol.status === 'planned').length,
      protocolCount: protocols.length,
      snapshotProtocols: protocols.filter((protocol) => protocol.status === 'snapshot').length,
      writesAllowed: false,
    },
  };
};
