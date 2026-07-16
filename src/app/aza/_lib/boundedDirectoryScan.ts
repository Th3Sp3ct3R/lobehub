import { execFile } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type BoundedDirectoryEntryKind = 'directory' | 'file' | 'other';

export type BoundedDirectoryEntry = {
  kind: BoundedDirectoryEntryKind;
  modifiedAt: string | null;
  name: string;
  path: string;
};

export type BoundedDirectoryScan = {
  entries: BoundedDirectoryEntry[];
  error: string | null;
  rootExists: boolean;
  rootModifiedAt: string | null;
  timedOut: boolean;
};

const SCAN_SCRIPT = String.raw`
root=$1
limit=$2
count=0

/usr/bin/find "$root" -mindepth 1 -maxdepth 1 -print0 2>/dev/null | while IFS= read -r -d '' entry; do
  count=$((count + 1))
  if [ "$count" -gt "$limit" ]; then
    break
  fi

  kind="other"
  if [ -d "$entry" ]; then
    kind="directory"
  elif [ -f "$entry" ]; then
    kind="file"
  fi

  mtime=$(/usr/bin/stat -f '%m' "$entry" 2>/dev/null || true)
  printf '%s\t%s\t%s\n' "$kind" "$mtime" "\${entry:t}"
done
`;

const parseModifiedAt = (epochSeconds: string) => {
  const epoch = Number(epochSeconds);

  if (!Number.isFinite(epoch) || epoch <= 0) return null;

  return new Date(epoch * 1000).toISOString();
};

const errorMessage = (error: unknown) => {
  if (error && typeof error === 'object') {
    const maybeError = error as {
      code?: unknown;
      killed?: unknown;
      message?: unknown;
      signal?: unknown;
    };

    if (maybeError.killed || maybeError.signal) {
      return `bounded directory scan was killed after timeout (${String(
        maybeError.signal ?? maybeError.code ?? 'unknown',
      )})`;
    }

    if (typeof maybeError.message === 'string') return maybeError.message;
  }

  return 'bounded directory scan failed';
};

export const scanDirectoryBounded = async ({
  maxEntries = 220,
  root,
  timeoutMs = 1500,
}: {
  maxEntries?: number;
  root: string;
  timeoutMs?: number;
}): Promise<BoundedDirectoryScan> => {
  const rootStats = await stat(root).catch(() => null);

  if (!rootStats) {
    return {
      entries: [],
      error: 'root path is not accessible',
      rootExists: false,
      rootModifiedAt: null,
      timedOut: false,
    };
  }

  try {
    const { stdout } = await execFileAsync(
      '/bin/zsh',
      ['-lc', SCAN_SCRIPT, 'aza-bounded-directory-scan', root, String(maxEntries)],
      {
        killSignal: 'SIGKILL',
        maxBuffer: 1024 * 1024,
        timeout: timeoutMs,
      },
    );
    const entries = stdout
      .split('\n')
      .filter(Boolean)
      .map((line): BoundedDirectoryEntry | null => {
        const [kind, modifiedAtEpoch, name] = line.split('\t');

        if (!name) return null;

        return {
          kind: kind === 'directory' || kind === 'file' || kind === 'other' ? kind : 'other',
          modifiedAt: parseModifiedAt(modifiedAtEpoch ?? ''),
          name,
          path: `${root}/${name}`,
        };
      })
      .filter((entry): entry is BoundedDirectoryEntry => Boolean(entry));

    return {
      entries,
      error: null,
      rootExists: true,
      rootModifiedAt: rootStats.mtime.toISOString(),
      timedOut: false,
    };
  } catch (error) {
    return {
      entries: [],
      error: errorMessage(error),
      rootExists: true,
      rootModifiedAt: rootStats.mtime.toISOString(),
      timedOut: true,
    };
  }
};
