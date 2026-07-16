import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { type AzaLiveOperatingBoard, getAzaLiveOperatingBoard } from './liveOperatingBoard';

type JsonRecord = Record<string, unknown>;

type GtmRecordType = {
  description: string;
  name: string;
  requiredFields: string[];
  statuses: string[];
};

type GtmLane = {
  cadence: string;
  id: string;
  name: string;
  objective: string;
  ownerRole: string;
  records: string[];
};

type GtmBoard = {
  name: string;
  records: string[];
  view: string;
};

type GtmRole = {
  name: string;
  responsibility: string;
  role: string;
};

type GtmWorkflowStep = {
  rule: string;
  step: string;
};

export type AzaLiveGtmMap = {
  boards: GtmBoard[];
  generatedAt: string;
  lanes: GtmLane[];
  mode: 'read_only_live_gtm_map';
  operatingBoard: {
    blockedCards: number;
    cardsByOwner: Array<{ count: number; owner: string }>;
    cardsByStatus: Array<{ count: number; status: string }>;
    totalCards: number;
    writesAllowed: false;
  };
  privacyAndApproval: {
    approvalRequiredFor: string[];
    blockedData: string[];
    defaultMode: string;
  };
  recordTypes: GtmRecordType[];
  roleMap: GtmRole[];
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    approvalGates: number;
    boards: number;
    lanes: number;
    recordTypes: number;
    requiredFields: number;
    roleCount: number;
    workflowSteps: number;
    writesAllowed: false;
  };
  workflow: GtmWorkflowStep[];
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

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const countBy = <T>(items: T[], keyFor: (item: T) => string) => {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = keyFor(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([key, count]) => ({ count, key }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
};

const buildBoards = (gtmModel: JsonRecord): GtmBoard[] =>
  recordArray(gtmModel.firstBoards).map((board) => ({
    name: text(board.name, 'Unnamed board'),
    records: stringArray(board.records),
    view: text(board.view, 'No view documented'),
  }));

const buildLanes = (gtmModel: JsonRecord): GtmLane[] =>
  recordArray(gtmModel.operatingLanes).map((lane) => ({
    cadence: text(lane.cadence, 'unspecified'),
    id: text(lane.id, 'unknown'),
    name: text(lane.name, 'Unnamed lane'),
    objective: text(lane.objective, 'No objective documented'),
    ownerRole: text(lane.ownerRole, 'Unassigned'),
    records: stringArray(lane.records),
  }));

const buildRecordTypes = (gtmModel: JsonRecord): GtmRecordType[] =>
  Object.entries(getRecord(gtmModel.recordTypes))
    .map(([name, value]) => {
      const record = getRecord(value);

      return {
        description: text(record.description, 'No description documented'),
        name,
        requiredFields: stringArray(record.requiredFields),
        statuses: stringArray(record.status),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

const buildRoles = (gtmModel: JsonRecord): GtmRole[] =>
  recordArray(gtmModel.roleMap).map((role) => ({
    name: text(role.name, 'Unnamed role'),
    responsibility: text(role.responsibility, 'No responsibility documented'),
    role: text(role.role, 'unknown'),
  }));

const buildWorkflow = (gtmModel: JsonRecord): GtmWorkflowStep[] =>
  recordArray(gtmModel.lobeHubHarnessWorkflow).map((step) => ({
    rule: text(step.rule, 'No rule documented'),
    step: text(step.step, 'unknown'),
  }));

export const getAzaLiveGtmMap = async (board?: AzaLiveOperatingBoard): Promise<AzaLiveGtmMap> => {
  const [gtmModel, liveBoard] = await Promise.all([
    readJson('gtm-team-operating-model.json'),
    board ?? getAzaLiveOperatingBoard(),
  ]);
  const cards = liveBoard.lanes.flatMap((lane) => lane.cards);
  const recordTypes = buildRecordTypes(gtmModel);
  const privacy = getRecord(gtmModel.privacyAndApproval);

  return {
    boards: buildBoards(gtmModel),
    generatedAt: new Date().toISOString(),
    lanes: buildLanes(gtmModel),
    mode: 'read_only_live_gtm_map',
    operatingBoard: {
      blockedCards: liveBoard.summary.blockedCards,
      cardsByOwner: countBy(cards, (card) => card.owner).map(({ count, key }) => ({
        count,
        owner: key,
      })),
      cardsByStatus: countBy(cards, (card) => card.status).map(({ count, key }) => ({
        count,
        status: key,
      })),
      totalCards: liveBoard.summary.totalCards,
      writesAllowed: false,
    },
    privacyAndApproval: {
      approvalRequiredFor: stringArray(privacy.approvalRequiredFor),
      blockedData: stringArray(privacy.blockedData),
      defaultMode: text(privacy.defaultMode, 'read-only inventory and reviewed summaries'),
    },
    recordTypes,
    roleMap: buildRoles(gtmModel),
    safety: {
      captured: [
        'GTM lane metadata',
        'record type schemas',
        'required field names',
        'status values',
        'role map',
        'approval rules',
        'derived board status counts',
      ],
      excluded: [
        'customer private data',
        'raw lead contact details',
        'private messages',
        'credentials',
        'tokens',
        'cookies',
        'unapproved browser contents',
      ],
      writesAllowed: false,
    },
    sourceArtifacts: [
      '/aza/gtm-team-operating-model.json',
      '/aza/live-operating-board',
      '/aza/aza-read-write-contract.json',
    ],
    summary: {
      approvalGates: stringArray(privacy.approvalRequiredFor).length,
      boards: buildBoards(gtmModel).length,
      lanes: recordArray(gtmModel.operatingLanes).length,
      recordTypes: recordTypes.length,
      requiredFields: recordTypes.reduce(
        (total, recordType) => total + recordType.requiredFields.length,
        0,
      ),
      roleCount: recordArray(gtmModel.roleMap).length,
      workflowSteps: recordArray(gtmModel.lobeHubHarnessWorkflow).length,
      writesAllowed: false,
    },
    workflow: buildWorkflow(gtmModel),
  };
};
