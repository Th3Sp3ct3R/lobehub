'use client';

import { usePermission } from '@/hooks/usePermission';

import { usePageEditorStore } from './store';

/**
 * Whether the current user can type into the page right now.
 *
 * Workspace pages behave like personal pages — open and type — except that the
 * page becomes read-only while another member holds the edit lock. The lock is
 * acquired implicitly on the first edit; a peek on open (see {@link useDocumentLock})
 * surfaces an existing holder so the page is read-only up front.
 */
export const usePageEditable = (): boolean => {
  const { allowed: hasEditPermission } = usePermission('edit_own_content');
  const isLockedByOther = usePageEditorStore((s) => s.isLockedByOther);

  return hasEditPermission && !isLockedByOther;
};
