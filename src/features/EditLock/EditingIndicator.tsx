'use client';

import { Flexbox, Icon, Text, Tooltip } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { PencilIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthorInfo } from '@/business/client/hooks/useAuthorInfo';

interface EditingIndicatorProps {
  /** The member currently holding the edit lock, or null/undefined when free. */
  holderId?: string | null;
}

/**
 * Subtle "someone else is editing" badge for any locked editable resource.
 * Renders nothing when no one else holds the lock.
 */
const EditingIndicator = memo<EditingIndicatorProps>(({ holderId }) => {
  const { t } = useTranslation('file');
  const holder = useAuthorInfo(holderId ?? undefined);

  if (!holderId) return null;

  const label = holder?.fullName
    ? t('pageEditor.editMode.lockedByOther', { name: holder.fullName })
    : t('pageEditor.editMode.lockedBySomeone');

  return (
    <Tooltip title={label}>
      <Flexbox horizontal align={'center'} gap={4} style={{ color: cssVar.colorTextTertiary }}>
        <Icon icon={PencilIcon} size={14} />
        <Text ellipsis style={{ color: 'inherit', fontSize: 12, maxWidth: 200 }}>
          {label}
        </Text>
      </Flexbox>
    </Tooltip>
  );
});

export default EditingIndicator;
