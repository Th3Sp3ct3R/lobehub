import {
  type AzaLiveContentAppAuditMap,
  type ContentAppAuditField,
  type ContentAppAuditTarget,
  getAzaLiveContentAppAuditMap,
} from './liveContentAppAuditMap';

type AccessCapabilityStatus =
  | 'approval_required'
  | 'audit_required'
  | 'blocked'
  | 'draft_ready'
  | 'read_only_ready'
  | 'reviewed_capture_ready';

export type AccessCapabilitySurface = {
  accountLabelStatus: ContentAppAuditField['status'];
  app: string;
  authPointerStatus: ContentAppAuditField['status'];
  automationMode: ContentAppAuditTarget['automationMode'];
  blockedActions: string[];
  capabilitiesAfterLogin: string[];
  category: string;
  evidence: string[];
  evidencePointerStatus: ContentAppAuditField['status'];
  outputPathStatus: ContentAppAuditField['status'];
  requiredBeforeAction: string[];
  requiredBeforeCapture: string[];
  status: AccessCapabilityStatus;
  visible: boolean;
};

export type AccessCapabilityLane = {
  appExamples: string[];
  id: string;
  label: string;
  nextAction: string;
  status: AccessCapabilityStatus | 'not_applicable';
  surfaceCount: number;
};

export type AzaLiveAccessCapabilityMap = {
  generatedAt: string;
  lanes: AccessCapabilityLane[];
  mode: 'read_only_access_capability_map';
  recommendation: {
    loginRule: string;
    projectionRule: string;
    useRule: string;
  };
  safety: {
    captured: string[];
    excluded: string[];
    writesAllowed: false;
  };
  summary: {
    accountLabelsKnown: number;
    approvalRequiredSurfaces: number;
    auditRequiredSurfaces: number;
    authPointersKnown: number;
    blockedSurfaces: number;
    browserSurfaces: number;
    draftReadySurfaces: number;
    readyReadOnlySurfaces: number;
    reviewedCaptureReadySurfaces: number;
    surfaces: number;
    visibleSurfaces: number;
    writesAllowed: false;
  };
  surfaces: AccessCapabilitySurface[];
};

const fieldStatus = (target: ContentAppAuditTarget, id: string): ContentAppAuditField['status'] =>
  target.fieldStatuses.find((field) => field.id === id)?.status ?? 'audit_required';

const capabilityStatusFor = (target: ContentAppAuditTarget): AccessCapabilityStatus => {
  if (target.status === 'blocked') return 'blocked';
  if (target.status === 'approval_required') return 'approval_required';
  if (target.missingRequiredFields.length > 0) return 'audit_required';
  if (target.automationMode === 'reviewed_capture') return 'reviewed_capture_ready';
  if (target.automationMode === 'draft_only') return 'draft_ready';

  return 'read_only_ready';
};

const capabilityLabelsFor = (target: ContentAppAuditTarget): string[] => {
  const labels = new Set<string>();
  const context = `${target.category} ${target.registryRole ?? ''} ${target.name}`;

  labels.add('Confirm safe account label and auth-store pointer without copying login material.');
  labels.add('Attach redacted evidence pointers before any AzA record or campaign use.');

  if (/browser|webapp|chrome|brave|comet|atlas/i.test(context)) {
    labels.add('Capture approved page state, screenshots, or exports after tab scope is approved.');
    labels.add('Use isolated browser-profile adapters for approved conversation or document sync.');
  }

  if (/ai_generation|kimi|claude|gemini|qwen|minimax|openhuman|cluely|coven/i.test(context)) {
    labels.add('Generate drafts, prompts, scripts, images, videos, code, or analysis artifacts.');
  }

  if (/voice_or_media|descript|voice|whisper|wispr|willow|vlc/i.test(context)) {
    labels.add('Capture reviewed audio, video, transcript, and editing artifacts.');
  }

  if (/communication|telegram|discord|slack|whatsapp/i.test(context)) {
    labels.add('Prepare outbound drafts; final send or post requires explicit approval.');
  }

  if (/device_or_network_ops|duoplus|geelark|vmos|anydesk|tailscale/i.test(context)) {
    labels.add(
      'Capture device status, screenshots, and logs; device/account actions need approval.',
    );
  }

  if (
    /knowledge_or_publishing|notion|obsidian|docs|sheets|slides|drive|tango|outline/i.test(context)
  ) {
    labels.add('Draft, organize, and export reviewed docs or knowledge artifacts.');
  }

  if (/coding_or_agent_tool|codex|cursor|code|copilot|devin|opencode|replit|cmux/i.test(context)) {
    labels.add('Open approved repo work and hand off implementation evidence to Codex lanes.');
  }

  if (labels.size === 2) {
    labels.add('Stay inventory-only until role, output path, risk, and owner are classified.');
  }

  return [...labels].sort((a, b) => a.localeCompare(b));
};

const blockedActionsFor = (target: ContentAppAuditTarget): string[] =>
  [
    ...target.blockedActions,
    'read cookies, tokens, passwords, or browser profile secrets',
    'read private tabs, documents, generated media, or messages without approval',
    'send, publish, post, follow, buy, or change accounts without explicit approval',
  ].sort((a, b) => a.localeCompare(b));

const requiredBeforeCaptureFor = (target: ContentAppAuditTarget): string[] =>
  [
    ...new Set([
      ...target.missingRequiredFields,
      'target tab or app scope',
      'redaction rule',
      'evidence pointer',
    ]),
  ].sort((a, b) => a.localeCompare(b));

const requiredBeforeActionFor = (target: ContentAppAuditTarget): string[] =>
  [
    ...new Set([
      ...target.requiredGates,
      'operator approval',
      'action class',
      'rollback or undo plan',
      'post-action evidence',
    ]),
  ].sort((a, b) => a.localeCompare(b));

const buildSurface = (target: ContentAppAuditTarget): AccessCapabilitySurface => ({
  accountLabelStatus: fieldStatus(target, 'account_label'),
  app: target.name,
  authPointerStatus: fieldStatus(target, 'auth_pointer'),
  automationMode: target.automationMode,
  blockedActions: blockedActionsFor(target),
  capabilitiesAfterLogin: capabilityLabelsFor(target),
  category: target.category,
  evidence: ['/aza/live-app-map', '/aza/live-content-app-audit'],
  evidencePointerStatus: fieldStatus(target, 'evidence_pointer'),
  outputPathStatus: fieldStatus(target, 'default_export_path'),
  requiredBeforeAction: requiredBeforeActionFor(target),
  requiredBeforeCapture: requiredBeforeCaptureFor(target),
  status: capabilityStatusFor(target),
  visible: target.visible,
});

const lane = ({
  id,
  label,
  nextAction,
  status,
  surfaces,
}: {
  id: string;
  label: string;
  nextAction: string;
  status: AccessCapabilityLane['status'];
  surfaces: AccessCapabilitySurface[];
}): AccessCapabilityLane => ({
  appExamples: surfaces
    .map((surface) => surface.app)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 18),
  id,
  label,
  nextAction,
  status,
  surfaceCount: surfaces.length,
});

const buildLanes = (surfaces: AccessCapabilitySurface[]): AccessCapabilityLane[] => {
  const identityAudit = surfaces.filter(
    (surface) =>
      surface.accountLabelStatus !== 'known_from_registry' ||
      surface.authPointerStatus !== 'known_from_registry',
  );
  const exportAudit = surfaces.filter(
    (surface) =>
      surface.outputPathStatus !== 'known_from_registry' ||
      surface.evidencePointerStatus !== 'known_from_registry',
  );
  const readyCapture = surfaces.filter((surface) =>
    ['draft_ready', 'read_only_ready', 'reviewed_capture_ready'].includes(surface.status),
  );
  const approvalRequired = surfaces.filter((surface) => surface.status === 'approval_required');
  const blocked = surfaces.filter((surface) => surface.status === 'blocked');

  return [
    lane({
      id: 'identity_and_auth_pointer_audit',
      label: 'Login identity and auth pointer audit',
      nextAction:
        'Assign safe account labels and auth-store pointers before any app-backed capture or sync.',
      status: identityAudit.length > 0 ? 'audit_required' : 'read_only_ready',
      surfaces: identityAudit,
    }),
    lane({
      id: 'export_and_evidence_audit',
      label: 'Export path and evidence audit',
      nextAction:
        'Map output folders, output kinds, and evidence pointers before assets enter AzA records.',
      status: exportAudit.length > 0 ? 'audit_required' : 'reviewed_capture_ready',
      surfaces: exportAudit,
    }),
    lane({
      id: 'approved_capture_ready',
      label: 'Approved read or capture ready',
      nextAction:
        'Use only for scoped read-only capture or draft generation until canonical AzA write gates pass.',
      status: readyCapture.length > 0 ? 'read_only_ready' : 'not_applicable',
      surfaces: readyCapture,
    }),
    lane({
      id: 'human_approval_actions',
      label: 'Human approval actions',
      nextAction:
        'Require explicit approval for every publish, send, post, device, purchase, or account-changing action.',
      status: approvalRequired.length > 0 ? 'approval_required' : 'not_applicable',
      surfaces: approvalRequired,
    }),
    lane({
      id: 'blocked_or_unclassified_surfaces',
      label: 'Blocked or unclassified surfaces',
      nextAction:
        'Classify role, account boundary, output path, risk, and owner before capture or automation.',
      status: blocked.length > 0 ? 'blocked' : 'not_applicable',
      surfaces: blocked,
    }),
  ];
};

export const getAzaLiveAccessCapabilityMap = async ({
  contentAppAuditMap,
}: {
  contentAppAuditMap?: AzaLiveContentAppAuditMap;
} = {}): Promise<AzaLiveAccessCapabilityMap> => {
  const liveContentAppAuditMap = contentAppAuditMap ?? (await getAzaLiveContentAppAuditMap());
  const surfaces = liveContentAppAuditMap.targets
    .map(buildSurface)
    .sort((a, b) => a.app.localeCompare(b.app));
  const lanes = buildLanes(surfaces);

  return {
    generatedAt: new Date().toISOString(),
    lanes,
    mode: 'read_only_access_capability_map',
    recommendation: {
      loginRule:
        'A logged-in app gives the harness a possible access surface, not permission to read private content or act. Use account labels and auth pointers only.',
      projectionRule:
        'Artifacts from logged-in surfaces become AzA records only after redaction, evidence, schema, canonical-store, and approval gates pass.',
      useRule:
        'Read-only capture, draft generation, export registration, publishing, messaging, and device actions are separate capability classes with separate approvals.',
    },
    safety: {
      captured: [
        'app names',
        'app categories',
        'automation modes',
        'field status labels',
        'capability class labels',
        'required gate labels',
        'blocked action labels',
        'visible app booleans',
      ],
      excluded: [
        'actual login state',
        'browser tabs',
        'window titles',
        'window contents',
        'documents',
        'messages',
        'cookies',
        'tokens',
        'passwords',
        'API keys',
        'browser profile contents',
        'generated media contents',
        'exported file contents',
      ],
      writesAllowed: false,
    },
    summary: {
      accountLabelsKnown: surfaces.filter(
        (surface) => surface.accountLabelStatus === 'known_from_registry',
      ).length,
      approvalRequiredSurfaces: surfaces.filter((surface) => surface.status === 'approval_required')
        .length,
      auditRequiredSurfaces: surfaces.filter((surface) => surface.status === 'audit_required')
        .length,
      authPointersKnown: surfaces.filter(
        (surface) => surface.authPointerStatus === 'known_from_registry',
      ).length,
      blockedSurfaces: surfaces.filter((surface) => surface.status === 'blocked').length,
      browserSurfaces: surfaces.filter((surface) => /browser|webapp/i.test(surface.category))
        .length,
      draftReadySurfaces: surfaces.filter((surface) => surface.status === 'draft_ready').length,
      readyReadOnlySurfaces: surfaces.filter((surface) => surface.status === 'read_only_ready')
        .length,
      reviewedCaptureReadySurfaces: surfaces.filter(
        (surface) => surface.status === 'reviewed_capture_ready',
      ).length,
      surfaces: surfaces.length,
      visibleSurfaces: surfaces.filter((surface) => surface.visible).length,
      writesAllowed: false,
    },
    surfaces,
  };
};
