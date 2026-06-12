'use client';

import { Alert } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthorInfo } from '@/business/client/hooks/useAuthorInfo';
import { useDocumentStore } from '@/store/document';
import { editorSelectors } from '@/store/document/slices/editor';

import { usePageEditorStore } from './store';

/**
 * Warns the user that their unsaved changes can't be saved because another
 * member took the edit lock. Shown ONLY when the user actually has blocked
 * changes (they were editing and got bounced) — never to passive readers, who
 * are told via the disabled "Edit" toggle + its tooltip instead.
 */
const LockBanner = memo(() => {
  const { t } = useTranslation('file');
  const documentId = usePageEditorStore((s) => s.documentId);
  const lockHolderId = usePageEditorStore((s) => s.lockHolderId);
  const saveBlockedByLock = useDocumentStore((s) =>
    documentId ? editorSelectors.saveBlockedByLock(documentId)(s) : false,
  );
  const holder = useAuthorInfo(lockHolderId ?? undefined);

  if (!saveBlockedByLock) return null;

  const message = holder?.fullName
    ? t('pageEditor.lock.editingByOther', { name: holder.fullName })
    : t('pageEditor.lock.editingBySomeone');

  return <Alert showIcon message={message} style={{ marginBlockEnd: 8 }} type="warning" />;
});

export default LockBanner;
