'use client';

import { Flexbox, Icon, Text, Tooltip } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { PencilIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthorInfo } from '@/business/client/hooks/useAuthorInfo';

import { usePageEditorStore } from '../store';

/**
 * Subtle "someone else is editing" badge for workspace pages. Only appears while
 * another member holds the edit lock — otherwise the header looks exactly like a
 * personal page (no edit-mode controls).
 */
const EditingIndicator = memo(() => {
  const { t } = useTranslation('file');
  const isWorkspacePage = usePageEditorStore((s) => s.isWorkspacePage);
  const isLockedByOther = usePageEditorStore((s) => s.isLockedByOther);
  const lockHolderId = usePageEditorStore((s) => s.lockHolderId);
  const holder = useAuthorInfo(lockHolderId ?? undefined);

  if (!isWorkspacePage || !isLockedByOther) return null;

  const label = holder?.fullName
    ? t('pageEditor.editMode.lockedByOther', { name: holder.fullName })
    : t('pageEditor.editMode.lockedBySomeone');

  return (
    <Tooltip title={label}>
      <Flexbox horizontal align={'center'} gap={4} style={{ color: cssVar.colorTextTertiary }}>
        <Icon icon={PencilIcon} size={14} />
        <Text ellipsis style={{ color: 'inherit', fontSize: 12, maxWidth: 160 }}>
          {label}
        </Text>
      </Flexbox>
    </Tooltip>
  );
});

export default EditingIndicator;
