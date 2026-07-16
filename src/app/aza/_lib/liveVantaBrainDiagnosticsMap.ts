import { execFile } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';

import { getAzaLiveVantaBrainCoverageMap } from './liveVantaBrainCoverageMap';

type DiagnosticStatus = 'blocked' | 'ready' | 'warning';

type DiagnosticCheck = {
  detail: string;
  evidence: string[];
  id: string;
  nextAction: string;
  status: DiagnosticStatus;
};

type CommandProbe = {
  command: string;
  error: string | null;
  ok: boolean;
  outputPreview: string[];
  timedOut: boolean;
};

export type AzaLiveVantaBrainDiagnosticsMap = {
  checks: DiagnosticCheck[];
  generatedAt: string;
  mode: 'read_only_vanta_brain_diagnostics';
  probes: {
    directoryListing: CommandProbe;
    metadata: {
      birthtime: string | null;
      ctime: string | null;
      dev: number | null;
      gid: number | null;
      ino: number | null;
      mode: number | null;
      mtime: string | null;
      nlink: number | null;
      size: number | null;
      uid: number | null;
    };
    spotlightMetadata: CommandProbe;
  };
  repairRunbook: Array<{
    id: string;
    operatorAction: string;
    proofNeeded: string;
    risk: string;
  }>;
  root: {
    path: string;
    present: boolean;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    coverageTargetsVerified: number;
    directScanBlocked: boolean;
    directScanTimedOut: boolean;
    rootPresent: boolean;
    writesAllowed: false;
  };
};

const execFileAsync = promisify(execFile);
const VANTA_BRAIN_ROOT = '/Users/growthgod/Documents/VANTA-Brain';
const COMMAND_TIMEOUT_MS = 1500;

const runCommand = async (command: string, args: string[]): Promise<CommandProbe> => {
  try {
    const result = await execFileAsync(command, args, {
      timeout: COMMAND_TIMEOUT_MS,
      windowsHide: true,
    });

    return {
      command: [command, ...args].join(' '),
      error: null,
      ok: true,
      outputPreview: `${result.stdout}${result.stderr}`.split('\n').filter(Boolean).slice(0, 8),
      timedOut: false,
    };
  } catch (error) {
    const err = error as Error & {
      killed?: boolean;
      signal?: string;
      stderr?: string;
      stdout?: string;
    };

    return {
      command: [command, ...args].join(' '),
      error: err.message,
      ok: false,
      outputPreview: `${err.stdout ?? ''}${err.stderr ?? ''}`
        .split('\n')
        .filter(Boolean)
        .slice(0, 8),
      timedOut: Boolean(err.killed || err.signal),
    };
  }
};

const check = ({ detail, evidence, id, nextAction, status }: DiagnosticCheck): DiagnosticCheck => ({
  detail,
  evidence,
  id,
  nextAction,
  status,
});

export const getAzaLiveVantaBrainDiagnosticsMap =
  async (): Promise<AzaLiveVantaBrainDiagnosticsMap> => {
    const [rootStats, coverage, directoryListing, spotlightMetadata] = await Promise.all([
      stat(VANTA_BRAIN_ROOT).catch(() => null),
      getAzaLiveVantaBrainCoverageMap(),
      runCommand('/bin/ls', ['-ldeO@', VANTA_BRAIN_ROOT]),
      runCommand('/usr/bin/mdls', [
        '-name',
        'kMDItemFSName',
        '-name',
        'kMDItemContentType',
        VANTA_BRAIN_ROOT,
      ]),
    ]);
    const rootPresent = Boolean(rootStats);
    const directScanBlocked = coverage.summary.projectionScanBlocked;
    const directScanTimedOut = coverage.summary.projectionScanTimedOut;

    const checks = [
      check({
        detail: rootPresent
          ? 'The configured VANTA-Brain path exists as a filesystem directory.'
          : 'The configured VANTA-Brain path is not accessible.',
        evidence: [VANTA_BRAIN_ROOT],
        id: 'root_path_present',
        nextAction: rootPresent
          ? 'Keep treating this path as the projection target, but do not trust coverage until enumeration works.'
          : 'Pick the real projection root before wiring command-center reads.',
        status: rootPresent ? 'ready' : 'blocked',
      }),
      check({
        detail: directoryListing.ok
          ? 'Basic directory metadata listing completed within the timeout.'
          : 'Basic directory metadata listing did not complete within the timeout.',
        evidence: [directoryListing.command],
        id: 'directory_metadata_listing',
        nextAction: directoryListing.ok
          ? 'Use bounded metadata scans only; continue excluding raw file contents.'
          : 'Repair the folder with Finder/Disk Utility, or move the projection vault to a clean local folder after approval.',
        status: directoryListing.ok ? 'ready' : 'blocked',
      }),
      check({
        detail: directScanBlocked
          ? 'The live coverage scanner cannot enumerate direct projection entries.'
          : 'The live coverage scanner can enumerate direct projection entries.',
        evidence: ['/aza/live-vanta-brain-coverage'],
        id: 'coverage_scan',
        nextAction: directScanBlocked
          ? 'Do not use VANTA-Brain as command-center context until this scan is repaired.'
          : 'Compare projection folders against source roots and freshness rules.',
        status: directScanBlocked ? 'blocked' : 'ready',
      }),
      check({
        detail: spotlightMetadata.ok
          ? 'Spotlight metadata lookup returned basic filesystem metadata.'
          : 'Spotlight metadata lookup did not return cleanly within the timeout.',
        evidence: [spotlightMetadata.command],
        id: 'spotlight_metadata',
        nextAction: spotlightMetadata.ok
          ? 'Use Spotlight metadata only as supporting evidence, not as canonical memory.'
          : 'Do not rely on Spotlight to recover vault coverage.',
        status: spotlightMetadata.ok ? 'ready' : 'warning',
      }),
    ];

    return {
      checks,
      generatedAt: new Date().toISOString(),
      mode: 'read_only_vanta_brain_diagnostics',
      probes: {
        directoryListing,
        metadata: {
          birthtime: rootStats?.birthtime.toISOString() ?? null,
          ctime: rootStats?.ctime.toISOString() ?? null,
          dev: rootStats?.dev ?? null,
          gid: rootStats?.gid ?? null,
          ino: rootStats?.ino ?? null,
          mode: rootStats?.mode ?? null,
          mtime: rootStats?.mtime.toISOString() ?? null,
          nlink: rootStats?.nlink ?? null,
          size: rootStats?.size ?? null,
          uid: rootStats?.uid ?? null,
        },
        spotlightMetadata,
      },
      repairRunbook: [
        {
          id: 'confirm_no_direct_writes',
          operatorAction:
            'Keep VANTA-Brain read-only until AzA has canonical records and this folder enumerates reliably.',
          proofNeeded: 'The diagnostics route continues to report writesAllowed=false.',
          risk: 'Writing projections into a folder that cannot be enumerated can hide or duplicate context.',
        },
        {
          id: 'repair_or_relocate_projection_root',
          operatorAction:
            'Use Finder/Disk Utility/iCloud status outside Codex, or approve a clean replacement projection path.',
          proofNeeded:
            'A bounded direct scan returns top-level entries without timeout and coverage targets stop reporting unverified.',
          risk: 'Moving the vault without a source-of-truth map can split the brain across two projection roots.',
        },
        {
          id: 'recheck_coverage_before_sync',
          operatorAction:
            'Run /aza/live-vanta-brain-coverage and /aza/live-goal-completion-audit after repair.',
          proofNeeded:
            'Coverage route reports projectionScanBlocked=false before any future projection writer is enabled.',
          risk: 'Static artifacts may be stale if used without live coverage proof.',
        },
        {
          id: 'project_only_from_aza',
          operatorAction:
            'After approval, project reviewed AzA summaries into VANTA-Brain with source ids, sensitivity, owner, and timestamp.',
          proofNeeded: 'AzA API, MCP, and durable store are healthy before projection writes.',
          risk: 'Direct markdown dumping bypasses access control and provenance.',
        },
      ],
      root: {
        path: VANTA_BRAIN_ROOT,
        present: rootPresent,
      },
      safety: {
        captured: [
          'root path presence',
          'root stat metadata',
          'bounded command timeout status',
          'metadata command output previews',
          'coverage scan status',
          'repair runbook labels',
        ],
        excluded: [
          'raw markdown contents',
          'raw session transcripts',
          'raw skill bodies',
          'directory tree contents beyond short command previews',
          'secrets',
          'tokens',
          'cookies',
          'credentials',
          'VANTA-Brain writes',
        ],
        writesAllowed: false,
      },
      summary: {
        coverageTargetsVerified: coverage.summary.coveredTargets,
        directScanBlocked,
        directScanTimedOut,
        rootPresent,
        writesAllowed: false,
      },
    };
  };
