'use client';

import { useEffect, useRef, useState } from 'react';

import { DOCUMENT_LOCK_HEARTBEAT_MS } from '@/const/documentLock';
import { usePermission } from '@/hooks/usePermission';
import { mutate } from '@/libs/swr';
import { documentService } from '@/services/document';
import { documentSWRKeys } from '@/services/document/swrKeys';
import { useDocumentStore } from '@/store/document';
import { editorSelectors } from '@/store/document/slices/editor';

import { usePageEditorStore } from './store';

/**
 * Drives the collaborative edit lock for workspace pages.
 *
 * The page behaves like a personal page — open and type — with two additions:
 * - on open we *peek* the lock so a page another member is already editing is
 *   read-only from the start (no "type then get bounced");
 * - the lock is acquired implicitly on the user's first edit and refreshed on a
 *   heartbeat, then released on unmount. Realtime events ({@link useResourceEvents})
 *   keep the lock state live between these.
 *
 * Two members starting to type on the same free page within the peek window race
 * on the server CAS; the loser is bounced to read-only via the save-conflict path.
 */
export const useDocumentLock = () => {
  const { allowed: canEdit } = usePermission('edit_own_content');
  const documentId = usePageEditorStore((s) => s.documentId);
  const isWorkspacePage = usePageEditorStore((s) => s.isWorkspacePage);
  const setLockState = usePageEditorStore((s) => s.setLockState);
  const isDirty = useDocumentStore((s) =>
    documentId ? editorSelectors.isDirty(documentId)(s) : false,
  );
  const saveBlockedByLock = useDocumentStore((s) =>
    documentId ? editorSelectors.saveBlockedByLock(documentId)(s) : false,
  );
  const wasLockedByOtherRef = useRef(false);

  const workspacePage = Boolean(documentId && canEdit && isWorkspacePage);

  // Edit-intent latch: the lock is acquired on the first real edit and held for
  // the rest of the session on this page (so it isn't churned between autosaves).
  const [editIntent, setEditIntent] = useState(false);
  // Reset synchronously when the open page changes (React "adjust state during
  // render" pattern) so the heartbeat never engages on the new page's first frame.
  const intentDocRef = useRef(documentId);
  if (intentDocRef.current !== documentId) {
    intentDocRef.current = documentId;
    setEditIntent(false);
  }
  useEffect(() => {
    if (workspacePage && isDirty) setEditIntent(true);
  }, [workspacePage, isDirty]);

  const engaged = workspacePage && editIntent;

  // Peek the current lock on open so an already-edited page is read-only up
  // front. Only while not yet editing — once engaged the heartbeat owns it.
  useEffect(() => {
    if (!workspacePage || !documentId || editIntent) return;
    let cancelled = false;
    documentService
      .getDocumentLock(documentId)
      .then((lock) => {
        if (cancelled) return;
        setLockState({ holderId: lock.holderId, lockedByOther: lock.lockedByOther });
      })
      .catch(() => {
        // Best-effort; the page stays editable and the save guard is the backstop.
      });
    return () => {
      cancelled = true;
    };
  }, [workspacePage, documentId, editIntent, setLockState]);

  // Heartbeat: acquire/refresh the lock while the user is editing.
  useEffect(() => {
    if (!engaged || !documentId) {
      wasLockedByOtherRef.current = false;
      return;
    }

    let cancelled = false;
    wasLockedByOtherRef.current = false;

    const tick = async () => {
      try {
        const result = await documentService.acquireDocumentLock(documentId);
        if (cancelled) return;
        setLockState({ holderId: result.holderId, lockedByOther: result.lockedByOther });

        const tookOver = wasLockedByOtherRef.current && !result.lockedByOther;
        wasLockedByOtherRef.current = result.lockedByOther;
        if (result.lockedByOther || tookOver) {
          void mutate(documentSWRKeys.editor(documentId));
        }
      } catch {
        // Network hiccup — keep the current state rather than wrongly toggling.
      }
    };

    tick();
    const timer = setInterval(tick, DOCUMENT_LOCK_HEARTBEAT_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
      setLockState({ holderId: null, lockedByOther: false });
      documentService.releaseDocumentLock(documentId).catch(() => {});
    };
  }, [engaged, documentId, setLockState]);

  // A save rejected because someone else holds the lock — flip to read-only now.
  useEffect(() => {
    if (workspacePage && saveBlockedByLock) {
      setLockState({ holderId: null, lockedByOther: true });
    }
  }, [workspacePage, saveBlockedByLock, setLockState]);
};
