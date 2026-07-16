import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { promisify } from 'node:util';

import { getAzaLiveOperatingRecordsMap } from './liveOperatingRecordsMap';

type CheckStatus = 'approval_required' | 'blocked' | 'not_attempted' | 'ready';
type JsonRecord = Record<string, unknown>;

type BrowserOperatingSessionCheck = {
  detail: string;
  evidence: string[];
  id: string;
  nextAction: string;
  status: CheckStatus;
};

export type AzaLiveBrowserOperatingSessionReadinessMap = {
  checks: BrowserOperatingSessionCheck[];
  contentSurfaces: Array<{
    automationBoundary: string;
    category: string;
    name: string;
    status: string;
  }>;
  generatedAt: string;
  mode: 'read_only_browser_operating_session_readiness';
  probes: {
    chromeCdp: {
      browser: string | null;
      endpoint: string;
      error: string | null | undefined;
      httpAvailable: boolean;
      lsofAvailable: boolean;
      portListening: boolean;
      protocolVersion: string | null;
      socketListening: boolean;
      status: string;
    };
    computerUse: {
      helperPath: string;
      helperPresent: boolean;
      runningProcesses: number;
    };
    processInventory: {
      chromeProcesses: number;
      codexComputerUseProcesses: number;
      electronProcesses: number;
      ok: boolean;
      processCount: number;
    };
  };
  recommendation: {
    browserSessions: string;
    contentApps: string;
    fallback: string;
    memory: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceArtifacts: string[];
  summary: {
    blockedChecks: number;
    browserOperatingSessionReady: boolean;
    chromeCdpHttpAvailable: boolean;
    chromeCdpPortListening: boolean;
    chromeProcesses: number;
    computerUseHelperPresent: boolean;
    contentCandidateApps: number;
    contentSurfaces: number;
    currentObservedApps: number;
    liveOperatingRecordProof: boolean;
    liveOperatingRecordTypesExpected: number;
    liveOperatingRecordTypesFound: number;
    manualVisibleBrowserAvailable: boolean;
    writesAllowed: false;
  };
};

const execFileAsync = promisify(execFile);

const CHROME_CDP_PORT = 9223;
const COMMAND_TIMEOUT_MS = 5000;
const HTTP_TIMEOUT_MS = 2000;
const PORT_TIMEOUT_MS = 1000;
const COMPUTER_USE_HELPER_PATH = '/Users/growthgod/.codex/computer-use/Codex Computer Use.app';

const artifactPath = (name: string) => path.join(process.cwd(), 'public', 'aza', name);

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

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

const readJson = async (name: string): Promise<JsonRecord> => {
  const raw = await readFile(artifactPath(name), 'utf8').catch(() => '{}');
  const parsed: unknown = JSON.parse(raw);

  return asRecord(parsed);
};

const pathExists = async (targetPath: string) => Boolean(await stat(targetPath).catch(() => null));

const runCommand = async (command: string, args: string[]) => {
  try {
    const result = await execFileAsync(command, args, {
      timeout: COMMAND_TIMEOUT_MS,
      windowsHide: true,
    });

    return { ok: true, output: result.stdout };
  } catch (error) {
    const err = error as Error & { stdout?: string };

    return { error: err.message, ok: false, output: err.stdout ?? '' };
  }
};

const probePort = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    const close = (listening: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(listening);
    };

    socket.setTimeout(PORT_TIMEOUT_MS);
    socket.once('connect', () => close(true));
    socket.once('error', () => close(false));
    socket.once('timeout', () => close(false));
  });

const probeChromeCdp = async () => {
  const endpoint = `http://127.0.0.1:${CHROME_CDP_PORT}/json/version`;
  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    const data = asRecord(await response.json().catch(() => ({})));

    return {
      browser: text(data.Browser),
      elapsedMs: Date.now() - startedAt,
      endpoint,
      ok: response.ok,
      protocolVersion: text(data['Protocol-Version']),
      status: response.ok ? 'ok' : 'error',
    };
  } catch (error) {
    return {
      elapsedMs: Date.now() - startedAt,
      endpoint,
      error: error instanceof Error ? error.message : 'unknown_cdp_error',
      ok: false,
      status: 'unavailable',
    };
  } finally {
    clearTimeout(timeout);
  }
};

const processInventory = async () => {
  const result = await runCommand('/bin/ps', ['-axo', 'pid=,comm=']);
  const lines = result.output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    chromeProcesses: lines.filter((line) => line.includes('Google Chrome')).length,
    codexComputerUseProcesses: lines.filter((line) => line.includes('Codex Computer Use')).length,
    electronProcesses: lines.filter((line) => /Electron|LobeHub|Discord|Notion|MiniMax/i.test(line))
      .length,
    ok: result.ok,
    processCount: lines.length,
  };
};

const check = ({
  detail,
  evidence,
  id,
  nextAction,
  status,
}: BrowserOperatingSessionCheck): BrowserOperatingSessionCheck => ({
  detail,
  evidence,
  id,
  nextAction,
  status,
});

export const getAzaLiveBrowserOperatingSessionReadinessMap =
  async (): Promise<AzaLiveBrowserOperatingSessionReadinessMap> => {
    const [
      appInventory,
      contentRegistry,
      operatingRecords,
      processes,
      cdpSocketListening,
      cdpLsof,
      cdpHttp,
      helperPresent,
    ] = await Promise.all([
      readJson('app-surface-inventory.json'),
      readJson('content-generation-app-registry.json'),
      getAzaLiveOperatingRecordsMap(),
      processInventory(),
      probePort(CHROME_CDP_PORT),
      runCommand('/usr/sbin/lsof', ['-nP', `-iTCP:${CHROME_CDP_PORT}`, '-sTCP:LISTEN']),
      probeChromeCdp(),
      pathExists(COMPUTER_USE_HELPER_PATH),
    ]);

    const apps = recordArray(appInventory.apps);
    const contentCandidates = stringArray(contentRegistry.candidateAppsPendingVerification);
    const currentObservedApps =
      stringArray(contentRegistry.currentObservedApps).length > 0
        ? stringArray(contentRegistry.currentObservedApps)
        : recordArray(contentRegistry.currentObservedApps)
            .map((app) => text(app.name))
            .filter(Boolean);
    const cdpPortListening =
      cdpSocketListening || (cdpLsof.ok && cdpLsof.output.includes(`:${CHROME_CDP_PORT}`));
    const contentSurfaces = apps
      .filter((app) =>
        /browser|ai|generation|voice|audio|communication|device|knowledge/i.test(
          `${text(app.category)} ${text(app.automationBoundary)}`,
        ),
      )
      .slice(0, 20)
      .map((app) => ({
        automationBoundary: text(app.automationBoundary),
        category: text(app.category),
        name: text(app.name),
        status: text(app.status),
      }));

    const checks = [
      check({
        detail:
          processes.chromeProcesses > 0
            ? `${processes.chromeProcesses} Chrome process entries are visible.`
            : 'No Chrome process entries are visible.',
        evidence: ['/bin/ps -axo pid=,comm='],
        id: 'chrome_process_visible',
        nextAction:
          processes.chromeProcesses > 0
            ? 'Treat Chrome as a visible/manual browser operating surface.'
            : 'Open Chrome before relying on browser operating sessions.',
        status: processes.chromeProcesses > 0 ? 'ready' : 'blocked',
      }),
      check({
        detail: cdpPortListening
          ? `Chrome CDP port ${CHROME_CDP_PORT} is listening.`
          : `Chrome CDP port ${CHROME_CDP_PORT} is not listening.`,
        evidence: [`127.0.0.1:${CHROME_CDP_PORT}`],
        id: 'chrome_cdp_port',
        nextAction: cdpPortListening
          ? 'Probe CDP HTTP before using endpoint capture.'
          : 'Restart Chrome with the intended debug port before CDP capture.',
        status: cdpPortListening ? 'ready' : 'blocked',
      }),
      check({
        detail: cdpHttp.ok
          ? 'Chrome CDP /json/version responds.'
          : 'Chrome CDP /json/version does not respond within the timeout.',
        evidence: [cdpHttp.endpoint],
        id: 'chrome_cdp_http',
        nextAction: cdpHttp.ok
          ? 'CDP can be considered for approved endpoint capture.'
          : 'Use manual visible-window capture or repair the Chrome debug profile.',
        status: cdpHttp.ok ? 'ready' : 'blocked',
      }),
      check({
        detail: helperPresent
          ? 'Computer Use helper bundle is present on disk, but runtime launch is not verified by this route.'
          : 'Computer Use helper bundle is missing from the expected Codex path.',
        evidence: [COMPUTER_USE_HELPER_PATH],
        id: 'computer_use_helper',
        nextAction: helperPresent
          ? 'Verify helper launch in the Codex app before treating Computer Use as available.'
          : 'Repair or reinstall the Computer Use helper before using visual fallback.',
        status: helperPresent ? 'not_attempted' : 'blocked',
      }),
      check({
        detail:
          'Computer Use runtime requires a successful Codex tool call before it can be used for browser visual fallback.',
        evidence: ['mcp__computer_use.get_app_state'],
        id: 'computer_use_runtime',
        nextAction:
          'Run get_app_state against the target app and require success before UI navigation.',
        status: 'blocked',
      }),
      check({
        detail: `${apps.length} app surfaces are present in the static app inventory.`,
        evidence: ['/aza/app-surface-inventory.json'],
        id: 'content_app_inventory',
        nextAction:
          'Use app metadata as routing hints only; do not infer login state from app presence.',
        status: apps.length > 0 ? 'ready' : 'blocked',
      }),
      check({
        detail: operatingRecords.summary.operatingRecordProof
          ? `AzA operating-record feed has ${operatingRecords.summary.expectedRecordTypesFound}/${operatingRecords.summary.expectedRecordTypes} required record types.`
          : 'AzA operating-record feed is not ready for browser input/output attachment.',
        evidence: ['/aza/live-operating-records'],
        id: 'aza_operating_record_feed',
        nextAction: operatingRecords.summary.operatingRecordProof
          ? 'Attach browser-session inputs and outputs to sanitized AzA operating records after approval.'
          : 'Repair the AzA operating-record feed before treating browser sessions as durable workflow inputs.',
        status: operatingRecords.summary.operatingRecordProof ? 'ready' : 'blocked',
      }),
      check({
        detail:
          'Publishing, messaging, buying, device, and account-changing actions remain approval-required.',
        evidence: ['/aza/aza-read-write-contract.json', '/aza/live-command-gates'],
        id: 'browser_action_approval_gate',
        nextAction:
          'Capture drafts and evidence first; request explicit approval before account-changing actions.',
        status: 'approval_required',
      }),
    ];

    const blockedChecks = checks.filter((item) => item.status === 'blocked').length;

    return {
      checks,
      contentSurfaces,
      generatedAt: new Date().toISOString(),
      mode: 'read_only_browser_operating_session_readiness',
      probes: {
        chromeCdp: {
          browser: cdpHttp.browser ?? null,
          endpoint: cdpHttp.endpoint,
          error: cdpHttp.ok ? null : cdpHttp.error,
          httpAvailable: cdpHttp.ok,
          lsofAvailable: cdpLsof.ok,
          portListening: cdpPortListening,
          protocolVersion: cdpHttp.protocolVersion ?? null,
          socketListening: cdpSocketListening,
          status: cdpHttp.status,
        },
        computerUse: {
          helperPath: COMPUTER_USE_HELPER_PATH,
          helperPresent,
          runningProcesses: processes.codexComputerUseProcesses,
        },
        processInventory: processes,
      },
      recommendation: {
        browserSessions:
          'Use browser sessions as authenticated input/output adapters; keep durable state in AzA.',
        contentApps:
          'Register prompts, outputs, export paths, evidence pointers, and account labels before automation.',
        fallback: cdpHttp.ok
          ? 'CDP can be used only after explicit endpoint-capture approval.'
          : 'Use visible-window/manual capture until CDP or Computer Use is repaired.',
        memory:
          'Promote only redacted summaries, source paths, timestamps, account labels, output paths, and evidence pointers into typed AzA operating records.',
      },
      safety: {
        captured: [
          'process counts',
          'Chrome CDP port status',
          'Chrome CDP version response metadata',
          'Computer Use helper path presence',
          'static app inventory names',
          'static app categories',
          'static app automation boundaries',
          'content registry counts',
          'operating record counts',
          'operating record type labels',
        ],
        excluded: [
          'browser tabs',
          'window titles',
          'page contents',
          'screenshots',
          'cookies',
          'OAuth tokens',
          'authorization headers',
          'passwords',
          'private messages',
          'exported file contents',
          'VANTA-Brain file contents',
        ],
        writesAllowed: false,
      },
      sourceArtifacts: [
        '/aza/app-surface-inventory.json',
        '/aza/content-generation-app-registry.json',
        '/aza/live-browser-task-tooling-map',
        '/aza/live-command-gates',
        '/aza/live-operating-records',
      ],
      summary: {
        blockedChecks,
        browserOperatingSessionReady: processes.chromeProcesses > 0 && blockedChecks === 0,
        chromeCdpHttpAvailable: cdpHttp.ok,
        chromeCdpPortListening: cdpPortListening,
        chromeProcesses: processes.chromeProcesses,
        computerUseHelperPresent: helperPresent,
        contentCandidateApps: contentCandidates.length,
        contentSurfaces: contentSurfaces.length,
        currentObservedApps: currentObservedApps.length,
        liveOperatingRecordProof: operatingRecords.summary.operatingRecordProof,
        liveOperatingRecordTypesExpected: operatingRecords.summary.expectedRecordTypes,
        liveOperatingRecordTypesFound: operatingRecords.summary.expectedRecordTypesFound,
        manualVisibleBrowserAvailable: processes.chromeProcesses > 0,
        writesAllowed: false,
      },
    };
  };
