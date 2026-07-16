import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  type AzaLiveOperatingRecordsMap,
  EXPECTED_OPERATING_RECORD_TYPES,
  getAzaLiveOperatingRecordsMap,
  type SanitizedOperatingRecord,
} from './liveOperatingRecordsMap';
import { type AzaLiveReadiness, getAzaLiveReadiness } from './liveReadiness';

type BoardStatus = 'blocked' | 'done' | 'next' | 'ready' | 'review';

export type OperatingBoardCard = {
  agent: string;
  approvalMode: string;
  evidence: string[];
  id: string;
  linkedRecordTypes?: string[];
  nextAction: string;
  owner: string;
  recordCount?: number;
  status: BoardStatus;
  title: string;
};

export type OperatingBoardLane = {
  cards: OperatingBoardCard[];
  description: string;
  id: string;
  name: string;
};

export type AzaLiveOperatingBoard = {
  firstBoards: Array<{ name: string; records: string[]; view: string }>;
  generatedAt: string;
  lanes: OperatingBoardLane[];
  mode: 'read_only_operating_board';
  operatingRecords: {
    missingRecordTypes: string[];
    proof: boolean;
    recordTypesFound: string[];
    records: SanitizedOperatingRecord[];
    source: '/aza/live-operating-records';
  };
  readiness: AzaLiveReadiness['summary'];
  sourceArtifacts: string[];
  summary: {
    blockedCards: number;
    liveOperatingRecordCount: number;
    liveOperatingRecordProof: boolean;
    liveOperatingRecordTypesExpected: number;
    liveOperatingRecordTypesFound: number;
    totalCards: number;
    writesAllowed: false;
  };
};

type JsonRecord = Record<string, unknown>;

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

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const buildFirstBoards = (gtmModel: JsonRecord): AzaLiveOperatingBoard['firstBoards'] =>
  recordArray(gtmModel.firstBoards).map((board) => ({
    name: text(board.name, 'Unnamed board'),
    records: stringArray(board.records),
    view: text(board.view, 'No view documented'),
  }));

const matchingRecordCount = (
  records: AzaLiveOperatingRecordsMap['records'],
  recordTypes: string[],
) =>
  records.filter((record) => record.recordType && recordTypes.includes(record.recordType)).length;

export const getAzaLiveOperatingBoard = async (
  readiness?: AzaLiveReadiness,
): Promise<AzaLiveOperatingBoard> => {
  const [liveReadiness, gtmModel, goalAudit, contentRegistry, operatingRecords] = await Promise.all(
    [
      readiness ?? getAzaLiveReadiness(),
      readJson('gtm-team-operating-model.json'),
      readJson('aza-goal-completion-audit.json'),
      readJson('content-generation-app-registry.json'),
      getAzaLiveOperatingRecordsMap(),
    ],
  );

  const nextProofGates = recordArray(goalAudit.nextProofGates);
  const liveBlockers = recordArray(goalAudit.liveBlockers);
  const contentStages = recordArray(contentRegistry.contentStages);
  const firstBoards = buildFirstBoards(gtmModel);
  const allServicesHealthy = liveReadiness.services.every((service) => service.health === 'ok');
  const recordTypesFound = new Set(operatingRecords.summary.recordTypesFound);
  const missingRecordTypes = EXPECTED_OPERATING_RECORD_TYPES.filter(
    (recordType) => !recordTypesFound.has(recordType),
  );
  const gtmRecordTypes = ['offer', 'lead', 'pilot', 'task', 'measurement'];
  const contentRecordTypes = ['content', 'publish'];
  const gtmRecordCount = matchingRecordCount(operatingRecords.records, gtmRecordTypes);
  const contentRecordCount = matchingRecordCount(operatingRecords.records, contentRecordTypes);

  const lanes: OperatingBoardLane[] = [
    {
      id: 'daily-command',
      name: 'Daily Command',
      description: 'Today by owner, blocked state, next action, and evidence.',
      cards: [
        {
          agent: 'Codex',
          approvalMode: 'approved LobeHub-only edits',
          evidence: ['/aza/live-readiness', '/aza/aza-goal-completion-audit.json'],
          id: 'daily-live-readiness',
          nextAction: 'Use the live readiness result as the preflight for future AzA service work.',
          owner: 'Engineering lead',
          status: liveReadiness.summary.artifactsPresent ? 'done' : 'blocked',
          title: 'Render current live readiness inside LobeHub',
        },
        {
          agent: 'Codex',
          approvalMode: 'approval required before VAN writes',
          evidence: ['/aza/aza-brain-readiness-audit.json', '/aza/live-readiness'],
          id: 'daily-start-aza-services',
          nextAction:
            'Start and verify AzA services only after approval to work in VAN/aza_memory.',
          owner: 'Engineering lead',
          status: allServicesHealthy ? 'review' : 'blocked',
          title: 'Clear AzA service health gate',
        },
      ],
    },
    {
      id: 'memory-intake',
      name: 'Memory Intake',
      description: 'Source to canonical AzA record to reviewed VANTA-Brain projection.',
      cards: [
        {
          agent: 'AzA',
          approvalMode: 'blocked until service and storage gates pass',
          evidence: ['/aza/aza-read-write-contract.json', '/aza/live-readiness'],
          id: 'memory-canonical-writes',
          nextAction:
            'Verify API, MCP, Postgres, schema, redaction, and approval before any canonical writes.',
          owner: 'Knowledge lead',
          status: liveReadiness.summary.canonicalWritesAllowed ? 'review' : 'blocked',
          title: 'Keep canonical AzA writes disabled',
        },
        {
          agent: 'AzA projection worker',
          approvalMode: 'explicit user approval required',
          evidence: ['/aza/vanta-brain-readonly-audit.json', '/aza/aza-read-write-contract.json'],
          id: 'memory-vanta-projection',
          nextAction:
            'Do not project markdown until canonical AzA records and projection approval exist.',
          owner: 'Knowledge lead',
          status: liveReadiness.summary.projectionToVantaBrainAllowed ? 'review' : 'blocked',
          title: 'Keep VANTA-Brain projection disabled',
        },
      ],
    },
    {
      id: 'gtm-pipeline',
      name: 'GTM Pipeline',
      description: 'Offer to lead to pilot to proof to renewal.',
      cards: [
        {
          agent: 'Growth lead',
          approvalMode: 'draft-only until customer-facing action',
          evidence: ['/aza/gtm-team-operating-model.json', '/aza/live-operating-records'],
          id: 'gtm-record-model',
          nextAction: operatingRecords.summary.operatingRecordProof
            ? 'Use live operating records as the board contract, then fill real GTM metadata through approved write lanes.'
            : 'Create live offer, lead, pilot, proof, and renewal records once AzA board storage exists.',
          linkedRecordTypes: gtmRecordTypes,
          owner: 'Growth lead',
          recordCount: gtmRecordCount,
          status: firstBoards.some((board) => board.name === 'GTM Pipeline') ? 'ready' : 'next',
          title: 'Use typed GTM records from the operating model',
        },
        {
          agent: 'Codex',
          approvalMode: 'LobeHub-only implementation',
          evidence: [
            '/aza/live-operating-records',
            ...nextProofGates.map((gate) => text(gate.gate)).filter(Boolean),
          ],
          id: 'gtm-live-board',
          nextAction: operatingRecords.summary.operatingRecordProof
            ? 'Bind visible LobeHub tables to these sanitized records and collect real account/output metadata with approval.'
            : 'Turn GTM Pipeline from a derived board into live records after AzA service gates pass.',
          linkedRecordTypes: gtmRecordTypes,
          owner: 'Product lead',
          recordCount: gtmRecordCount,
          status: operatingRecords.summary.operatingRecordProof ? 'ready' : 'next',
          title: 'Build first live GTM board after AzA read/write gates',
        },
      ],
    },
    {
      id: 'content-factory',
      name: 'Content Factory',
      description: 'Campaign, prompt, asset, publish event, analytics snapshot, and learning loop.',
      cards: [
        {
          agent: 'Content lead',
          approvalMode: 'draft-only and reviewed-capture',
          evidence: [
            '/aza/content-generation-app-registry.json',
            '/aza/app-surface-inventory.json',
            '/aza/live-operating-records',
          ],
          id: 'content-app-registry',
          nextAction:
            'Verify export folders and account labels app-by-app before any publishing automation.',
          linkedRecordTypes: contentRecordTypes,
          owner: 'Content lead',
          recordCount: contentRecordCount,
          status: contentStages.length > 0 ? 'ready' : 'next',
          title: 'Use the content app registry as the content production map',
        },
        {
          agent: 'Codex + Content lead',
          approvalMode: 'read-only until capture or publishing approval',
          evidence: [
            '/aza/live-operating-records',
            '/aza/live-content-ops',
            '/aza/live-content-app-audit',
          ],
          id: 'content-live-records',
          linkedRecordTypes: contentRecordTypes,
          nextAction:
            contentRecordCount === contentRecordTypes.length
              ? 'Attach app account labels, auth pointers, output paths, and evidence pointers through approval-gated capture.'
              : 'Create durable content and publish records before using browser or app sessions as inputs and outputs.',
          owner: 'Content lead',
          recordCount: contentRecordCount,
          status: contentRecordCount === contentRecordTypes.length ? 'review' : 'next',
          title: 'Connect content operating records to app sessions',
        },
      ],
    },
    {
      id: 'product-delivery',
      name: 'Product Delivery',
      description:
        'Application development tasks, validation commands, release gates, and evidence.',
      cards: [
        {
          agent: 'Codex',
          approvalMode: 'approved LobeHub-only edits',
          evidence: ['/aza/aza-source-of-truth-map.json', '/aza/aza-goal-completion-audit.json'],
          id: 'product-proof-gates',
          nextAction:
            'Work through the next proof gates without marking the full goal complete early.',
          owner: 'Engineering lead',
          status: liveBlockers.length > 0 ? 'blocked' : 'ready',
          title: 'Use completion audit blockers as product delivery gates',
        },
      ],
    },
  ];

  const cards = lanes.flatMap((lane) => lane.cards);

  return {
    firstBoards,
    generatedAt: new Date().toISOString(),
    lanes,
    mode: 'read_only_operating_board',
    operatingRecords: {
      missingRecordTypes,
      proof: operatingRecords.summary.operatingRecordProof,
      recordTypesFound: operatingRecords.summary.recordTypesFound,
      records: operatingRecords.records,
      source: '/aza/live-operating-records',
    },
    readiness: liveReadiness.summary,
    sourceArtifacts: [
      '/aza/gtm-team-operating-model.json',
      '/aza/aza-goal-completion-audit.json',
      '/aza/content-generation-app-registry.json',
      '/aza/live-readiness',
      '/aza/live-operating-records',
    ],
    summary: {
      blockedCards: cards.filter((card) => card.status === 'blocked').length,
      liveOperatingRecordCount: operatingRecords.summary.recordCount,
      liveOperatingRecordProof: operatingRecords.summary.operatingRecordProof,
      liveOperatingRecordTypesExpected: operatingRecords.summary.expectedRecordTypes,
      liveOperatingRecordTypesFound: operatingRecords.summary.expectedRecordTypesFound,
      totalCards: cards.length,
      writesAllowed: false,
    },
  };
};
