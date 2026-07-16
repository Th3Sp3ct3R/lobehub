import { execFile } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

type JsonRecord = Record<string, unknown>;

type AutomationMode = 'blocked' | 'draft_only' | 'human_approve' | 'read_only' | 'reviewed_capture';

export type LiveAppSurface = {
  automationMode: AutomationMode;
  bundleId: string | null;
  bundleVersion: string | null;
  category: string;
  contentStages: string[];
  installed: boolean;
  name: string;
  path: string | null;
  registryRole: string | null;
  sourceRoot: string | null;
  source: 'installed_bundle' | 'registry_only' | 'visible_process';
  visible: boolean;
};

export type AzaLiveAppMap = {
  generatedAt: string;
  installedApps: LiveAppSurface[];
  mode: 'read_only_live_app_map';
  registry: {
    automationModes: Record<string, string>;
    candidateAppsPendingVerification: string[];
    contentStageCount: number;
    currentObservedApps: number;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    blockedApps: number;
    browserWebAppWrappers: number;
    bundleMetadataApps: number;
    contentCandidateCount: number;
    draftOnlyApps: number;
    humanApproveApps: number;
    installedAppCount: number;
    registryMatchedApps: number;
    reviewedCaptureApps: number;
    translocatedApps: number;
    unclassifiedApps: number;
    visibleAppCount: number;
    writesAllowed: false;
  };
  visibleApps: string[];
};

const APP_ROOTS = ['/Applications', '/Users/growthgod/Applications'] as const;
const MAX_APP_SCAN_DEPTH = 3;

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

const optionalText = (value: unknown) => (typeof value === 'string' ? value : null);

const getRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};

const parseJsonRecord = (raw: string): JsonRecord => {
  try {
    return getRecord(JSON.parse(raw));
  } catch {
    return {};
  }
};

const normalizeName = (name: string) =>
  name
    .replace(/\.app$/i, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const appNameFromPath = (appPath: string) => path.basename(appPath).replace(/\.app$/i, '');

const isChromeWebAppBundle = (bundleId: string | null) =>
  Boolean(bundleId?.startsWith('com.google.Chrome.app.'));

const categorizeApp = (
  name: string,
  registryRole: string | null,
  bundleId: string | null,
): string => {
  if (registryRole) return registryRole;
  if (/grok|chatgpt|kimi|claude|gemini|qwen|minimax|openhuman|ollama|cluely|coven/i.test(name)) {
    return 'ai_generation';
  }
  if (isChromeWebAppBundle(bundleId)) return 'browser_webapp_surface';
  if (/chrome|brave|comet|atlas/i.test(name)) return 'browser_webapp_surface';
  if (/codex|cursor|code|copilot|devin|opencode|replit|cmux/i.test(name)) {
    return 'coding_or_agent_tool';
  }
  if (/wispr|willow|voice|whisper|descript|vlc/i.test(name)) return 'voice_or_media';
  if (/telegram|discord|slack|whatsapp|messages/i.test(name)) return 'communication';
  if (/duoplus|geelark|vmos|anydesk|tailscale/i.test(name)) return 'device_or_network_ops';
  if (/notion|obsidian|docs|sheets|slides|drive|tango|outline/i.test(name)) {
    return 'knowledge_or_publishing';
  }
  return 'unclassified_app';
};

const defaultAutomationMode = (name: string, category: string): AutomationMode => {
  if (/cluely|coven|cradle|castcodes|usage for claude|cc switch/i.test(name)) return 'blocked';
  if (category === 'browser_webapp_surface') return 'read_only';
  if (category === 'ai_generation') return 'draft_only';
  if (category === 'voice_or_media') return 'reviewed_capture';
  if (category === 'communication' || category === 'device_or_network_ops') return 'human_approve';
  if (category === 'coding_or_agent_tool') return 'human_approve';
  return 'read_only';
};

const parseAutomationMode = (value: unknown, fallback: AutomationMode): AutomationMode => {
  if (
    value === 'blocked' ||
    value === 'draft_only' ||
    value === 'human_approve' ||
    value === 'read_only' ||
    value === 'reviewed_capture'
  ) {
    return value;
  }

  return fallback;
};

const findAppBundles = async (
  root: string,
  depth = 0,
): Promise<Array<{ path: string; sourceRoot: string }>> => {
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const appBundles: Array<{ path: string; sourceRoot: string }> = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    const entryPath = path.join(root, entry.name);

    if (entry.name.endsWith('.app')) {
      appBundles.push({ path: entryPath, sourceRoot: root });
      continue;
    }

    if (depth < MAX_APP_SCAN_DEPTH) {
      appBundles.push(...(await findAppBundles(entryPath, depth + 1)));
    }
  }

  return appBundles;
};

const getVisibleApps = async (): Promise<string[]> => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const { stdout } = await execFileAsync(
        '/usr/bin/osascript',
        [
          '-e',
          'tell application "System Events" to get name of every process whose background only is false',
        ],
        {
          maxBuffer: 1024 * 128,
          timeout: 5000,
        },
      );

      return stdout
        .toString()
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return [];
};

const decodeXmlValue = (value: string) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");

const plistStringValue = (raw: string, key: string) => {
  const escapedKey = key.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`<key>${escapedKey}</key>\\s*<string>([^<]*)</string>`));

  return match?.[1] ? decodeXmlValue(match[1]).trim() : null;
};

const readBundleMetadata = async (appPath: string) => {
  const plistPath = path.join(appPath, 'Contents', 'Info.plist');
  const raw = await readFile(plistPath, 'utf8').catch(() => '');
  const xmlBundleId = plistStringValue(raw, 'CFBundleIdentifier');
  const xmlBundleVersion = plistStringValue(raw, 'CFBundleShortVersionString');

  if (xmlBundleId || xmlBundleVersion) {
    return {
      bundleId: xmlBundleId,
      bundleVersion: xmlBundleVersion,
    };
  }

  const { stdout } = await execFileAsync(
    '/usr/bin/plutil',
    ['-convert', 'json', '-o', '-', plistPath],
    {
      maxBuffer: 1024 * 512,
      timeout: 2000,
    },
  ).catch(() => ({ stdout: '' }));
  const record = stdout ? parseJsonRecord(stdout.toString()) : {};

  return {
    bundleId: optionalText(record.CFBundleIdentifier),
    bundleVersion: optionalText(record.CFBundleShortVersionString),
  };
};

const mapWithConcurrency = async <Input, Output>(
  items: Input[],
  limit: number,
  mapper: (item: Input, index: number) => Promise<Output>,
): Promise<Output[]> => {
  const results: Output[] = [];
  results.length = items.length;
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        const item = items[currentIndex];

        if (item === undefined) continue;

        results[currentIndex] = await mapper(item, currentIndex);
      }
    }),
  );

  return results;
};

const buildRegistryLookup = (registry: JsonRecord) => {
  const currentObservedApps = recordArray(registry.currentObservedApps);
  const lookup = new Map<string, JsonRecord>();

  for (const app of currentObservedApps) {
    const name = text(app.name);
    if (name) lookup.set(normalizeName(name), app);
  }

  return lookup;
};

export const getAzaLiveAppMap = async (): Promise<AzaLiveAppMap> => {
  const [contentRegistry, visibleApps, appBundlesByRoot] = await Promise.all([
    readJson('content-generation-app-registry.json'),
    getVisibleApps(),
    Promise.all(APP_ROOTS.map((root) => findAppBundles(root))),
  ]);
  const appBundles = appBundlesByRoot.flat();
  const visibleLookup = new Set(visibleApps.map(normalizeName));
  const registryLookup = buildRegistryLookup(contentRegistry);
  const automationModes = getRecord(contentRegistry.automationModes);
  const candidateAppsPendingVerification = stringArray(
    contentRegistry.candidateAppsPendingVerification,
  );
  const contentStageCount = recordArray(contentRegistry.contentStages).length;

  const installedApps: LiveAppSurface[] = (
    await mapWithConcurrency(appBundles, 8, async (bundle) => {
      const name = appNameFromPath(bundle.path);
      const normalizedName = normalizeName(name);
      const registryRecord = registryLookup.get(normalizedName) ?? {};
      const registryRole = optionalText(registryRecord.role);
      const metadata = await readBundleMetadata(bundle.path);
      const bundleId = optionalText(registryRecord.bundleId) ?? metadata.bundleId;
      const category = categorizeApp(name, registryRole, bundleId);
      const automationMode = parseAutomationMode(
        registryRecord.automationMode,
        defaultAutomationMode(name, category),
      );

      return {
        automationMode,
        bundleId,
        bundleVersion: metadata.bundleVersion,
        category,
        contentStages: stringArray(registryRecord.contentStage),
        installed: true,
        name,
        path: bundle.path,
        registryRole,
        sourceRoot: bundle.sourceRoot,
        source: 'installed_bundle' as const,
        visible: visibleLookup.has(normalizedName),
      };
    })
  ).sort((a, b) => a.name.localeCompare(b.name));

  const installedLookup = new Set(installedApps.map((app) => normalizeName(app.name)));
  const visibleRegistryOnly: LiveAppSurface[] = visibleApps
    .filter((name) => !installedLookup.has(normalizeName(name)))
    .map((name) => {
      const registryRecord = registryLookup.get(normalizeName(name)) ?? {};
      const registryRole = optionalText(registryRecord.role);
      const bundleId = optionalText(registryRecord.bundleId);
      const category = categorizeApp(name, registryRole, bundleId);

      return {
        automationMode: parseAutomationMode(
          registryRecord.automationMode,
          defaultAutomationMode(name, category),
        ),
        bundleId,
        bundleVersion: null,
        category,
        contentStages: stringArray(registryRecord.contentStage),
        installed: false,
        name,
        path: null,
        registryRole,
        sourceRoot: null,
        source: 'visible_process' as const,
        visible: true,
      };
    });
  const surfaces = [...installedApps, ...visibleRegistryOnly];

  return {
    generatedAt: new Date().toISOString(),
    installedApps: surfaces,
    mode: 'read_only_live_app_map',
    registry: {
      automationModes: Object.fromEntries(
        Object.entries(automationModes).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        ),
      ),
      candidateAppsPendingVerification,
      contentStageCount,
      currentObservedApps: registryLookup.size,
    },
    safety: {
      captured: [
        'installed .app names',
        'installed .app paths',
        'app source roots',
        'bundle ids from Info.plist',
        'bundle versions from Info.plist',
        'visible app names',
        'content registry role',
        'content stages',
        'automation mode',
      ],
      excluded: [
        'window titles',
        'window contents',
        'browser tabs',
        'messages',
        'documents',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
        'raw login state',
      ],
      writesAllowed: false,
    },
    summary: {
      blockedApps: surfaces.filter((app) => app.automationMode === 'blocked').length,
      browserWebAppWrappers: surfaces.filter((app) => isChromeWebAppBundle(app.bundleId)).length,
      bundleMetadataApps: surfaces.filter((app) => Boolean(app.bundleId)).length,
      contentCandidateCount: candidateAppsPendingVerification.length,
      draftOnlyApps: surfaces.filter((app) => app.automationMode === 'draft_only').length,
      humanApproveApps: surfaces.filter((app) => app.automationMode === 'human_approve').length,
      installedAppCount: installedApps.length,
      registryMatchedApps: surfaces.filter((app) => registryLookup.has(normalizeName(app.name)))
        .length,
      reviewedCaptureApps: surfaces.filter((app) => app.automationMode === 'reviewed_capture')
        .length,
      translocatedApps: surfaces.filter((app) => app.path?.includes('/AppTranslocation/')).length,
      unclassifiedApps: surfaces.filter((app) => app.category === 'unclassified_app').length,
      visibleAppCount: visibleApps.length,
      writesAllowed: false,
    },
    visibleApps,
  };
};
