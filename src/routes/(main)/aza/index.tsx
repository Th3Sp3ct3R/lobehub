'use client';

import { Flexbox, Text } from '@lobehub/ui';
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  Network,
  ShieldAlert,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react';
import { memo, type ReactNode } from 'react';

import NavHeader from '@/features/NavHeader';
import WideScreenContainer from '@/features/WideScreenContainer';
import WideScreenButton from '@/features/WideScreenContainer/WideScreenButton';

type Tone = 'blocked' | 'ok' | 'planned' | 'warn';

interface StatusItem {
  detail: string;
  label: string;
  tone: Tone;
}

interface SectionItem {
  detail: string;
  icon: ReactNode;
  label: string;
  meta: string;
}

const toneStyles: Record<Tone, { background: string; border: string; color: string }> = {
  blocked: { background: '#fff1f2', border: '#fecdd3', color: '#be123c' },
  ok: { background: '#ecfdf5', border: '#bbf7d0', color: '#047857' },
  planned: { background: '#f8fafc', border: '#cbd5e1', color: '#475569' },
  warn: { background: '#fffbeb', border: '#fde68a', color: '#b45309' },
};

const shellStyle = {
  background: 'linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,1) 30%)',
  minHeight: '100%',
};

const panelStyle = {
  background: 'rgba(255,255,255,0.86)',
  border: '1px solid rgba(148,163,184,0.28)',
  borderRadius: 8,
  boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
  padding: 16,
};

const gridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
};

const systemRoots: SectionItem[] = [
  {
    detail:
      'Active project and runtime root for AzA, InstaGrowth, Suno, Engine, Hermes UI, and device adapters.',
    icon: <HardDrive size={18} />,
    label: '/Users/growthgod/VAN',
    meta: 'Project root',
  },
  {
    detail:
      'Canonical AzA memory system for capture, normalization, search, MCP retrieval, and projection.',
    icon: <BrainCircuit size={18} />,
    label: '/Users/growthgod/VAN/aza_memory',
    meta: 'Brain service',
  },
  {
    detail:
      'Command-center UI fork on branch AzA. This page is the first read-only operator surface.',
    icon: <Network size={18} />,
    label: '/Users/growthgod/lobehub',
    meta: 'Command UI',
  },
  {
    detail:
      'Readable Obsidian vault for decisions, projections, session exports, and pointers. Not a runtime source.',
    icon: <FileText size={18} />,
    label: '/Users/growthgod/Documents/VANTA-Brain',
    meta: 'Projection vault',
  },
];

const memoryStores: SectionItem[] = [
  {
    detail:
      'Planned canonical store. Postgres-backed implementation has started, but current typecheck is failing.',
    icon: <Database size={18} />,
    label: 'AzA Postgres and MCP',
    meta: 'Canonical target',
  },
  {
    detail:
      'Codex goals, logs, state, memories, rollout summaries, skills, plugins, and worktrees.',
    icon: <Terminal size={18} />,
    label: 'Codex local state',
    meta: '~/.codex',
  },
  {
    detail:
      'Hermes agents, skills, sessions, kanban, state, response store, and verification evidence.',
    icon: <Workflow size={18} />,
    label: 'Hermes runtime',
    meta: '~/.hermes',
  },
  {
    detail:
      'Cloud sync is active. Local storage is small and should be treated as app/runtime state, not canonical memory.',
    icon: <Sparkles size={18} />,
    label: 'LobeHub cloud plus local storage',
    meta: 'Connected',
  },
];

const integrationHealth: StatusItem[] = [
  {
    detail: 'Daemon status reports connected to the official device gateway.',
    label: 'LobeHub daemon',
    tone: 'ok',
  },
  {
    detail:
      'The CLI package exists, but no lobehub binary is available on PATH and workspace invocation did not return promptly.',
    label: 'Lobe export path',
    tone: 'blocked',
  },
  {
    detail: 'Planned ports 8786-8790 are not listening in the current session.',
    label: 'AzA services',
    tone: 'warn',
  },
  {
    detail:
      'No-emit TypeScript validation currently fails in AzA, including strict optional and importer errors.',
    label: 'AzA typecheck',
    tone: 'blocked',
  },
  {
    detail:
      'Vault sync scripts exist, but logs include repeated rebase failures and stale Desktop/VAN symlinks.',
    label: 'VANTA-Brain sync',
    tone: 'warn',
  },
  {
    detail: 'Several MCP configs and one LaunchAgent still point at /Users/growthgod/Desktop/VAN.',
    label: 'Path reconciliation',
    tone: 'warn',
  },
];

const contentLanes: SectionItem[] = [
  {
    detail: 'ChatGPT Atlas, Gemini, Claude, Kimi, MiniMax Hub, Qwen, OpenHuman, Ollama.',
    icon: <Sparkles size={18} />,
    label: 'Generation',
    meta: 'AI apps',
  },
  {
    detail: 'Descript, Descript Screen Recorder, CapCut Web, VLC, Google Slides, Google Docs.',
    icon: <FileText size={18} />,
    label: 'Editing and publishing',
    meta: 'Content tools',
  },
  {
    detail: 'PPQ Whisper, VoiceInk, Wispr Flow, Willow Voice, Voice Memos.',
    icon: <Network size={18} />,
    label: 'Voice and transcription',
    meta: 'Audio tools',
  },
  {
    detail: 'DuoPlus, GeeLark, VMOSCloud, Telegram, Discord, Slack, WhatsApp, Notion, Linear.',
    icon: <GitBranch size={18} />,
    label: 'Device and operations',
    meta: 'Execution lane',
  },
];

const gtmTracks: SectionItem[] = [
  {
    detail:
      'Sell done-for-you Instagram growth first: current clients, creators, agencies, local businesses.',
    icon: <CheckCircle2 size={18} />,
    label: 'Emergency agency revenue',
    meta: 'Cash track',
  },
  {
    detail:
      'Validate 10-20 paid pilots, account survival, delivered follower/DM/traffic outcomes, retention, and NPS.',
    icon: <Workflow size={18} />,
    label: 'Paid pilot cohort',
    meta: 'Validation track',
  },
  {
    detail:
      'Build toward audit or trial profile, paid pilot, subscription, and expansion across more profiles.',
    icon: <Network size={18} />,
    label: 'SaaS funnel',
    meta: 'Product track',
  },
];

const nextGates: StatusItem[] = [
  {
    detail: 'This read-only page is the first LobeHub surface for the architecture map.',
    label: 'Static command center',
    tone: 'ok',
  },
  {
    detail: 'Repair AzA compile errors before treating its API or MCP as reliable.',
    label: 'AzA validation',
    tone: 'planned',
  },
  {
    detail: 'Start API and MCP, then verify /health, /ready, and MCP list/search tools.',
    label: 'Service startup',
    tone: 'planned',
  },
  {
    detail: 'Wire panels to live AzA and LobeHub status only after validation passes.',
    label: 'Live integration',
    tone: 'planned',
  },
];

const SectionCard = memo<{ item: SectionItem }>(({ item }) => (
  <Flexbox gap={10} style={panelStyle}>
    <Flexbox horizontal align={'center'} gap={10}>
      <Flexbox
        align={'center'}
        justify={'center'}
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 8,
          color: '#1d4ed8',
          height: 34,
          minWidth: 34,
          width: 34,
        }}
      >
        {item.icon}
      </Flexbox>
      <Flexbox style={{ minWidth: 0 }}>
        <Text strong style={{ overflowWrap: 'anywhere' }}>
          {item.label}
        </Text>
        <Text fontSize={12} type={'secondary'}>
          {item.meta}
        </Text>
      </Flexbox>
    </Flexbox>
    <Text style={{ lineHeight: 1.55 }} type={'secondary'}>
      {item.detail}
    </Text>
  </Flexbox>
));

SectionCard.displayName = 'SectionCard';

const StatusRow = memo<{ item: StatusItem }>(({ item }) => {
  const tone = toneStyles[item.tone];

  return (
    <Flexbox
      gap={8}
      style={{
        ...panelStyle,
        background: tone.background,
        border: `1px solid ${tone.border}`,
      }}
    >
      <Flexbox horizontal align={'center'} gap={8}>
        {item.tone === 'ok' ? <CheckCircle2 color={tone.color} size={16} /> : null}
        {item.tone === 'warn' ? <AlertTriangle color={tone.color} size={16} /> : null}
        {item.tone === 'blocked' ? <ShieldAlert color={tone.color} size={16} /> : null}
        {item.tone === 'planned' ? <BrainCircuit color={tone.color} size={16} /> : null}
        <Text strong style={{ color: tone.color }}>
          {item.label}
        </Text>
      </Flexbox>
      <Text style={{ color: tone.color, lineHeight: 1.55 }}>{item.detail}</Text>
    </Flexbox>
  );
});

StatusRow.displayName = 'StatusRow';

const Section = memo<{ children: ReactNode; eyebrow: string; title: string }>(
  ({ children, eyebrow, title }) => (
    <Flexbox gap={12}>
      <Flexbox gap={4}>
        <Text fontSize={12} style={{ textTransform: 'uppercase' }} type={'secondary'}>
          {eyebrow}
        </Text>
        <Text strong as={'h2'} fontSize={20} style={{ margin: 0 }}>
          {title}
        </Text>
      </Flexbox>
      {children}
    </Flexbox>
  ),
);

Section.displayName = 'Section';

const AzaPage = memo(() => (
  <Flexbox height={'100%'} style={shellStyle}>
    <NavHeader right={<WideScreenButton />} />
    <Flexbox height={'100%'} style={{ overflowY: 'auto' }} width={'100%'}>
      <WideScreenContainer gap={32} paddingBlock={40} wrapperStyle={{ minHeight: '100%' }}>
        <Flexbox gap={10}>
          <Text fontSize={12} style={{ textTransform: 'uppercase' }} type={'secondary'}>
            AzA command center
          </Text>
          <Text strong as={'h1'} fontSize={28} style={{ margin: 0 }}>
            Architecture, memory, agents, GTM, and integration health
          </Text>
          <Text style={{ lineHeight: 1.6, maxWidth: 900 }} type={'secondary'}>
            This is the read-only operator map for the current machine. AzA is the target canonical
            memory plane, LobeHub is the command UI, and VANTA-Brain is the human-readable
            projection vault.
          </Text>
        </Flexbox>

        <Section eyebrow={'System roots'} title={'Where the active layers live'}>
          <div style={gridStyle}>
            {systemRoots.map((item) => (
              <SectionCard item={item} key={item.label} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow={'Memory map'}
          title={'What should be indexed and what remains runtime state'}
        >
          <div style={gridStyle}>
            {memoryStores.map((item) => (
              <SectionCard item={item} key={item.label} />
            ))}
          </div>
        </Section>

        <Section eyebrow={'Integration health'} title={'Current blockers and verified connections'}>
          <div style={gridStyle}>
            {integrationHealth.map((item) => (
              <StatusRow item={item} key={item.label} />
            ))}
          </div>
        </Section>

        <Section eyebrow={'Content lanes'} title={'Generation and operations apps to organize'}>
          <div style={gridStyle}>
            {contentLanes.map((item) => (
              <SectionCard item={item} key={item.label} />
            ))}
          </div>
        </Section>

        <Section eyebrow={'GTM'} title={'Business execution tracks'}>
          <div style={gridStyle}>
            {gtmTracks.map((item) => (
              <SectionCard item={item} key={item.label} />
            ))}
          </div>
        </Section>

        <Section eyebrow={'Next gates'} title={'Implementation sequence'}>
          <div style={gridStyle}>
            {nextGates.map((item) => (
              <StatusRow item={item} key={item.label} />
            ))}
          </div>
        </Section>
      </WideScreenContainer>
    </Flexbox>
  </Flexbox>
));

AzaPage.displayName = 'AzaPage';

export default AzaPage;
