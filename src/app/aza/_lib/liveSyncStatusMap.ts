import { stat } from 'node:fs/promises';
import path from 'node:path';

import { getAzaLiveVantaBrainCoverageMap } from './liveVantaBrainCoverageMap';

type SyncStatus = 'blocked' | 'manual_available' | 'not_configured' | 'partial' | 'ready';

export type AzaLiveSyncChannel = {
  blockedBy: string[];
  evidence: string[];
  id: 'notion' | 'vanta_brain';
  label: string;
  lastObservedAt: string | null;
  nextAction: string;
  status: SyncStatus;
};

export type AzaLiveSyncStatusMap = {
  channels: AzaLiveSyncChannel[];
  generatedAt: string;
  mode: 'read_only_sync_status_map';
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    blockedChannels: number;
    channels: number;
    manualAvailableChannels: number;
    notionConfigured: boolean;
    vantaBrainRootPresent: boolean;
    writesAllowed: false;
  };
};

const LOBEHUB_ROOT = '/Users/growthgod/lobehub';
const NOTION_APP_PATH = '/Applications/Notion.app';
const NOTION_ENV_KEYS = [
  'NOTION_API_KEY',
  'NOTION_TOKEN',
  'NOTION_INTEGRATION_TOKEN',
  'NOTION_DATABASE_ID',
  'NOTION_PAGE_ID',
] as const;

const exists = async (targetPath: string) => Boolean(await stat(targetPath).catch(() => null));

const buildNotionChannel = async (): Promise<AzaLiveSyncChannel> => {
  const [notionAppPresent, notionImportHookPresent, notionImportUiPresent] = await Promise.all([
    exists(NOTION_APP_PATH),
    exists(
      path.join(
        LOBEHUB_ROOT,
        'src/features/ResourceManager/components/Header/hooks/useNotionImport.ts',
      ),
    ),
    exists(path.join(LOBEHUB_ROOT, 'src/features/PageExplorer/PageExplorerPlaceholder.tsx')),
  ]);
  const presentEnvKeys = NOTION_ENV_KEYS.filter((key) => Boolean(process.env[key]));
  const liveConfigured = presentEnvKeys.length > 0;

  return {
    blockedBy: liveConfigured
      ? ['live Notion workspace sync still needs a read adapter proof']
      : ['no Notion live-sync environment reference is visible in this process'],
    evidence: [
      NOTION_APP_PATH,
      'src/features/ResourceManager/components/Header/hooks/useNotionImport.ts',
      'src/features/PageExplorer/PageExplorerPlaceholder.tsx',
      ...presentEnvKeys.map((key) => `env:${key}`),
    ],
    id: 'notion',
    label: 'Notion sync',
    lastObservedAt: null,
    nextAction: liveConfigured
      ? 'Verify a read-only Notion adapter before treating Notion as synced command-center context.'
      : 'Use the manual Notion import UI for exports; add only env-var references and adapter proof before live sync.',
    status: liveConfigured
      ? 'partial'
      : notionAppPresent || notionImportHookPresent || notionImportUiPresent
        ? 'manual_available'
        : 'not_configured',
  };
};

const buildVantaBrainChannel = async (): Promise<AzaLiveSyncChannel> => {
  const coverage = await getAzaLiveVantaBrainCoverageMap();
  const blockedBy = [
    ...(coverage.summary.rootPresent ? [] : ['projection root is not present']),
    ...(coverage.summary.projectionScanBlocked ? ['projection scan is blocked'] : []),
    ...(coverage.summary.projectionScanTimedOut ? ['projection scan timed out'] : []),
    'canonical AzA ids, redaction proof, and projection approval are still required',
  ];
  const structurallyCovered =
    coverage.summary.rootPresent &&
    coverage.summary.coveredTargets === coverage.summary.coverageTargets &&
    !coverage.summary.projectionScanBlocked &&
    !coverage.summary.projectionScanTimedOut;

  return {
    blockedBy,
    evidence: ['/aza/live-vanta-brain-coverage', coverage.projectionRoot.path],
    id: 'vanta_brain',
    label: 'VANTA-Brain projection sync',
    lastObservedAt: coverage.projectionRoot.modifiedAt,
    nextAction: structurallyCovered
      ? 'Keep writes blocked until AzA canonical records, redaction proof, and exact destination approval are present.'
      : 'Repair coverage gaps and verify canonical AzA records before enabling projection writes.',
    status: structurallyCovered ? 'partial' : 'blocked',
  };
};

export const getAzaLiveSyncStatusMap = async (): Promise<AzaLiveSyncStatusMap> => {
  const [notion, vantaBrain] = await Promise.all([buildNotionChannel(), buildVantaBrainChannel()]);
  const channels = [notion, vantaBrain];

  return {
    channels,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_sync_status_map',
    safety: {
      captured: [
        'Notion app path presence',
        'Notion import UI file presence',
        'Notion environment variable names present',
        'VANTA-Brain root presence',
        'VANTA-Brain coverage counts',
        'projection scan status',
      ],
      excluded: [
        'Notion workspace contents',
        'Notion export contents',
        'environment variable values',
        'raw VANTA-Brain markdown contents',
        'raw sessions',
        'secrets',
        'tokens',
        'cookies',
        'credentials',
        'writes',
      ],
      writesAllowed: false,
    },
    summary: {
      blockedChannels: channels.filter((channel) => channel.status === 'blocked').length,
      channels: channels.length,
      manualAvailableChannels: channels.filter((channel) => channel.status === 'manual_available')
        .length,
      notionConfigured: notion.status === 'partial' || notion.status === 'ready',
      vantaBrainRootPresent: !vantaBrain.blockedBy.includes('projection root is not present'),
      writesAllowed: false,
    },
  };
};
