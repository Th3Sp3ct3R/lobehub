type StoreStatus = 'blocked' | 'not_attempted' | 'partial' | 'ready';

export type CanonicalStoreCheck = {
  evidence: string[];
  id: string;
  requiredBefore: string[];
  status: StoreStatus;
  title: string;
};

export type CanonicalStoreEnvCheck = {
  description: string;
  id: string;
  present: boolean;
  required: boolean;
  source: string;
};

export type AzaLiveCanonicalStoreMap = {
  checks: CanonicalStoreCheck[];
  env: {
    driver: {
      configured: string;
      defaulted: boolean;
      supported: boolean;
      supportedValues: string[];
    };
    required: CanonicalStoreEnvCheck[];
  };
  generatedAt: string;
  mode: 'read_only_canonical_store_readiness_map';
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  sourceFiles: string[];
  summary: {
    blockedChecks: number;
    connectionAttempted: false;
    partialChecks: number;
    readyChecks: number;
    requiredEnvPresent: number;
    requiredEnvTotal: number;
    supportedDriver: boolean;
    totalChecks: number;
    writesAllowed: false;
  };
};

const supportedDrivers = ['neon', 'node'];

const present = (value: string | undefined) => Boolean(value && value.trim().length > 0);

const requiredEnv = (): CanonicalStoreEnvCheck[] => [
  {
    description:
      'Postgres connection string used by the LobeHub server database adapter. Value is intentionally redacted.',
    id: 'DATABASE_URL',
    present: present(process.env.DATABASE_URL),
    required: true,
    source: 'packages/app-config/src/db.ts',
  },
  {
    description:
      'Secret required before LobeHub initializes encrypted server-side database state. Value is intentionally redacted.',
    id: 'KEY_VAULTS_SECRET',
    present: present(process.env.KEY_VAULTS_SECRET),
    required: true,
    source: 'packages/database/src/core/web-server.ts',
  },
];

const buildChecks = ({
  driverSupported,
  required,
}: {
  driverSupported: boolean;
  required: CanonicalStoreEnvCheck[];
}): CanonicalStoreCheck[] => {
  const requiredMissing = required.filter((env) => !env.present).map((env) => env.id);

  return [
    {
      evidence: ['process.env presence only', 'packages/app-config/src/db.ts'],
      id: 'store_env_prerequisites',
      requiredBefore: ['database_connection_check', 'canonical_memory_write'],
      status: requiredMissing.length === 0 && driverSupported ? 'ready' : 'blocked',
      title:
        requiredMissing.length === 0
          ? 'Required store environment is present'
          : `Missing required store environment: ${requiredMissing.join(', ')}`,
    },
    {
      evidence: ['packages/database/src/core/web-server.ts'],
      id: 'driver_supported',
      requiredBefore: ['database_connection_check'],
      status: driverSupported ? 'ready' : 'blocked',
      title: driverSupported
        ? 'Configured database driver is supported'
        : 'Configured database driver is not supported by LobeHub',
    },
    {
      evidence: ['not attempted by this read-only route'],
      id: 'database_connection_check',
      requiredBefore: ['migration_check', 'durable_operating_board'],
      status: 'not_attempted',
      title:
        'Live database connection was not attempted; this route avoids opening DB sessions or reading contents.',
    },
    {
      evidence: ['aza-goal-completion-audit.json', 'aza-brain-readiness-audit.json'],
      id: 'azA_canonical_schema_check',
      requiredBefore: ['canonical_memory_write', 'mcp_query_route', 'projection_write'],
      status: 'blocked',
      title:
        'AzA canonical tables, migrations, pgvector, and shared API/MCP store usage remain unverified.',
    },
  ];
};

export const getAzaLiveCanonicalStoreMap = async (): Promise<AzaLiveCanonicalStoreMap> => {
  const required = requiredEnv();
  const configuredDriver = process.env.DATABASE_DRIVER || 'neon';
  const driverSupported = supportedDrivers.includes(configuredDriver);
  const checks = buildChecks({ driverSupported, required });

  return {
    checks,
    env: {
      driver: {
        configured: configuredDriver,
        defaulted: !process.env.DATABASE_DRIVER,
        supported: driverSupported,
        supportedValues: supportedDrivers,
      },
      required,
    },
    generatedAt: new Date().toISOString(),
    mode: 'read_only_canonical_store_readiness_map',
    safety: {
      captured: [
        'environment variable presence',
        'database driver label',
        'source file pointers',
        'readiness statuses',
        'proof task labels',
      ],
      excluded: [
        'DATABASE_URL value',
        'KEY_VAULTS_SECRET value',
        'raw environment variables',
        'database contents',
        'database connection attempts',
        'migration execution',
        'secrets',
      ],
      writesAllowed: false,
    },
    sourceFiles: [
      'packages/app-config/src/db.ts',
      'packages/database/src/core/db-adaptor.ts',
      'packages/database/src/core/web-server.ts',
      'src/instrumentation.ts',
    ],
    summary: {
      blockedChecks: checks.filter((check) => check.status === 'blocked').length,
      connectionAttempted: false,
      partialChecks: checks.filter(
        (check) => check.status === 'partial' || check.status === 'not_attempted',
      ).length,
      readyChecks: checks.filter((check) => check.status === 'ready').length,
      requiredEnvPresent: required.filter((env) => env.present).length,
      requiredEnvTotal: required.length,
      supportedDriver: driverSupported,
      totalChecks: checks.length,
      writesAllowed: false,
    },
  };
};
