import { access, stat } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

export const AZA_ARTIFACTS = [
  'vanta-aza-architecture.html',
  'vanta-aza-architecture.architecture.json',
  'vanta-aza-architecture.png',
  'aza-pc-architecture.html',
  'aza-pc-architecture.architecture.json',
  'aza-pc-architecture.png',
  'app-surface-inventory.json',
  'content-generation-app-registry.json',
  'vanta-brain-readonly-audit.json',
  'gtm-team-operating-model.json',
  'agent-memory-skill-inventory.json',
  'van-project-root-inventory.json',
  'local-service-port-inventory.json',
  'aza-read-write-contract.json',
  'aza-source-of-truth-map.json',
  'aza-brain-readiness-audit.json',
  'aza-goal-completion-audit.json',
] as const;

export const AZA_SERVICES = [
  { id: 'aza-gateway', label: 'AzA Gateway', port: 8786 },
  { id: 'aza-api', label: 'AzA API', port: 8787 },
  { id: 'aza-mcp', label: 'AzA MCP', port: 8788 },
  { id: 'aza-sync', label: 'AzA Sync', port: 8789 },
  { id: 'aza-worker', label: 'AzA Worker', port: 8790 },
] as const;

export type ArtifactStatus = {
  exists: boolean;
  href: string;
  modifiedAt: string | null;
  name: string;
  sizeBytes: number | null;
};

export type ServiceStatus = {
  health: 'not_checked' | 'ok' | 'failed';
  healthBody: unknown;
  id: string;
  label: string;
  listening: boolean;
  port: number;
};

export type AzaLiveReadiness = {
  artifacts: ArtifactStatus[];
  generatedAt: string;
  mode: 'read_only_live_probe';
  services: ServiceStatus[];
  summary: {
    artifactsPresent: boolean;
    canonicalWritesAllowed: boolean;
    liveAzAReadAvailable: boolean;
    liveMcpAvailable: boolean;
    projectionToVantaBrainAllowed: boolean;
    reason: string;
  };
};

const checkArtifact = async (name: string): Promise<ArtifactStatus> => {
  const filePath = path.join(process.cwd(), 'public', 'aza', name);

  try {
    await access(filePath);
    const stats = await stat(filePath);

    return {
      exists: true,
      href: `/aza/${name}`,
      modifiedAt: stats.mtime.toISOString(),
      name,
      sizeBytes: stats.size,
    };
  } catch {
    return {
      exists: false,
      href: `/aza/${name}`,
      modifiedAt: null,
      name,
      sizeBytes: null,
    };
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

    socket.setTimeout(500);
    socket.once('connect', () => close(true));
    socket.once('error', () => close(false));
    socket.once('timeout', () => close(false));
  });

const fetchHealth = async (port: number): Promise<Pick<ServiceStatus, 'health' | 'healthBody'>> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 750);

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      health: response.ok ? 'ok' : 'failed',
      healthBody: body,
    };
  } catch {
    return {
      health: 'failed',
      healthBody: null,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const checkService = async (service: (typeof AZA_SERVICES)[number]): Promise<ServiceStatus> => {
  const listening = await probePort(service.port);

  if (!listening) {
    return {
      health: 'not_checked',
      healthBody: null,
      id: service.id,
      label: service.label,
      listening,
      port: service.port,
    };
  }

  const health = await fetchHealth(service.port);

  return {
    ...health,
    id: service.id,
    label: service.label,
    listening,
    port: service.port,
  };
};

export const getAzaLiveReadiness = async (): Promise<AzaLiveReadiness> => {
  const [artifacts, services] = await Promise.all([
    Promise.all(AZA_ARTIFACTS.map(checkArtifact)),
    Promise.all(AZA_SERVICES.map(checkService)),
  ]);

  const artifactsPresent = artifacts.every((artifact) => artifact.exists);
  const liveAzAReadAvailable = services.some(
    (service) => service.id === 'aza-api' && service.health === 'ok',
  );
  const liveMcpAvailable = services.some(
    (service) => service.id === 'aza-mcp' && service.health === 'ok',
  );
  const allServicesHealthy = services.every((service) => service.health === 'ok');

  return {
    artifacts,
    generatedAt: new Date().toISOString(),
    mode: 'read_only_live_probe',
    services,
    summary: {
      artifactsPresent,
      canonicalWritesAllowed: false,
      liveAzAReadAvailable,
      liveMcpAvailable,
      projectionToVantaBrainAllowed: false,
      reason:
        allServicesHealthy && artifactsPresent
          ? 'AzA service health is visible, but writes still require schema, store, redaction, approval, and projection gates.'
          : 'LobeHub has command-center artifacts, but live AzA service health is not fully verified.',
    },
  };
};
