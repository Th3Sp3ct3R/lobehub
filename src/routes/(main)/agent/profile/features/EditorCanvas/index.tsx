'use client';

import { ReactMentionPlugin, ReactTablePlugin, ReactToolbarPlugin } from '@lobehub/editor';
import { Editor } from '@lobehub/editor/react';
import isEqual from 'fast-deep-equal';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createChatInputRichPlugins } from '@/features/ChatInput/InputEditor/plugins';
import { EditingIndicator, type EditLockClient, useEditLock } from '@/features/EditLock';
import { usePermission } from '@/hooks/usePermission';
import { EMPTY_EDITOR_STATE } from '@/libs/editor/constants';
import { lambdaClient } from '@/libs/trpc/client';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

import { useMentionOptions } from '../ProfileEditor/MentionList';
import { useProfileStore } from '../store';
import TypoBar from './TypoBar';
import { useSlashItems } from './useSlashItems';

// Stable lock RPC binding for the agent resource.
const agentLockClient: EditLockClient = {
  acquire: (id) => lambdaClient.agent.acquireAgentLock.mutate({ agentId: id }),
  peek: (id) => lambdaClient.agent.getAgentLock.query({ agentId: id }),
  release: async (id) => {
    await lambdaClient.agent.releaseAgentLock.mutate({ agentId: id });
  },
};

const EditorCanvas = memo(() => {
  const { t } = useTranslation('setting');
  const { allowed: canEdit } = usePermission('edit_own_content');
  const [editorInit, setEditorInit] = useState(false);
  const [contentInit, setContentInit] = useState(false);
  const agentId = useAgentStore((s) => s.activeAgentId);
  const config = useAgentStore(agentSelectors.currentAgentConfig, isEqual);
  const editorData = config?.editorData;
  const systemRole = config?.systemRole;
  const updateConfig = useAgentStore((s) => s.updateAgentConfig);
  const [initialLoad] = useState(
    editorData === undefined || editorData?.root === undefined ? EMPTY_EDITOR_STATE : editorData,
  );
  const mentionOptions = useMentionOptions();
  const editor = useProfileStore((s) => s.editor);
  const handleContentChange = useProfileStore((s) => s.handleContentChange);
  const slashItems = useSlashItems();

  // Streaming state from AgentStore
  const streamingSystemRole = useAgentStore((s) => s.streamingSystemRole);
  const streamingInProgress = useAgentStore((s) => s.streamingSystemRoleInProgress);
  const prevStreamingRef = useRef<string | undefined>(undefined);
  const wasStreamingRef = useRef(false);

  // Collaborative edit lock for workspace agents (same model as pages): read-only
  // when another member is editing; acquired implicitly on the first real edit.
  // Streaming systemRole writes are programmatic, so they never latch edit-intent.
  const [edited, setEdited] = useState(false);
  const agentIdRef = useRef(agentId);
  if (agentIdRef.current !== agentId) {
    agentIdRef.current = agentId;
    setEdited(false);
  }
  const lock = useEditLock({
    client: agentLockClient,
    // Server no-ops the lock for personal (non-workspace) agents.
    enabled: Boolean(agentId && canEdit),
    isDirty: edited,
    resourceId: agentId ?? undefined,
  });
  const editable = canEdit && !lock.lockedByOther;

  // Wrap handleContentChange with updateConfig
  const handleChange = useCallback(() => {
    if (!editable) return;
    // Don't trigger save during streaming
    if (streamingInProgress) return;
    setEdited(true);
    handleContentChange(updateConfig);
  }, [editable, handleContentChange, updateConfig, streamingInProgress]);

  // Handle streaming updates - update editor with streaming content
  useEffect(() => {
    if (!editor || !editorInit) return;
    if (!streamingInProgress) {
      prevStreamingRef.current = undefined;
      return;
    }

    // Only update if content has changed
    if (streamingSystemRole !== prevStreamingRef.current) {
      prevStreamingRef.current = streamingSystemRole;
      try {
        editor.setDocument('markdown', streamingSystemRole || '');
      } catch {
        // Ignore errors during streaming updates
      }
    }
  }, [editor, editorInit, streamingSystemRole, streamingInProgress]);

  // Trigger save when streaming ends
  useEffect(() => {
    if (wasStreamingRef.current && !streamingInProgress && editor && editorInit) {
      if (!editable) return;

      // Streaming just ended, wait for editor to update its internal state then save
      // This ensures editorData (json) is properly updated from the markdown content
      const timer = setTimeout(() => {
        handleContentChange(updateConfig);
      }, 100);
      return () => clearTimeout(timer);
    }
    wasStreamingRef.current = !!streamingInProgress;
  }, [editable, streamingInProgress, editor, editorInit, handleContentChange, updateConfig]);

  useEffect(() => {
    if (!editorInit || !editor || contentInit) return;
    // Don't init if streaming is in progress
    if (streamingInProgress) return;
    try {
      if (editorData && editorData?.root !== undefined) {
        editor.setDocument('json', editorData);
      } else if (systemRole) {
        editor.setDocument('markdown', systemRole);
      }
      // If no editorData and no systemRole, leave editor empty to show placeholder
      setContentInit(true);
    } catch (error) {
      console.error('[EditorCanvas] Failed to init editor content:', error);
    }
  }, [editorInit, contentInit, editor, editorData, systemRole, streamingInProgress]);

  return (
    <div
      style={editable ? undefined : { cursor: 'not-allowed', opacity: 0.65, pointerEvents: 'none' }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <EditingIndicator holderId={lock.lockedByOther ? lock.holderId : null} />
      <Editor
        content={initialLoad}
        editable={editable}
        editor={editor!}
        lineEmptyPlaceholder={t('settingAgent.prompt.placeholder')}
        mentionOption={mentionOptions}
        placeholder={t('settingAgent.prompt.templatePlaceholder')}
        plugins={[
          ...createChatInputRichPlugins(),
          ReactTablePlugin,
          ReactMentionPlugin,
          Editor.withProps(ReactToolbarPlugin, {
            children: <TypoBar />,
          }),
        ]}
        slashOption={{
          items: slashItems,
        }}
        style={{
          paddingBottom: 64,
        }}
        onInit={() => setEditorInit(true)}
        onTextChange={handleChange}
      />
    </div>
  );
});

export default EditorCanvas;
