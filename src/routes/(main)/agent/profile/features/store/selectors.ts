import { type Store } from './action';

export const selectors = {
  editor: (s: Store) => s.editor,
  editorState: (s: Store) => s.editorState,
  hasEdited: (s: Store) => Boolean(s.hasEdited),
  lockHolderId: (s: Store) => s.lockState.holderId,
  lockedByOther: (s: Store) => s.lockState.lockedByOther,
};
