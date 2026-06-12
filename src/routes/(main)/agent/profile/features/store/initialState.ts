import { type IEditor } from '@lobehub/editor';
import { type EditorState } from '@lobehub/editor/react';

export interface EditLockState {
  holderId: string | null;
  lockedByOther: boolean;
}

export interface PublicState {}

export interface State extends PublicState {
  editor?: IEditor;
  editorState?: EditorState; // EditorState from useEditorState hook
  /**
   * Edit-intent latch: flips true on the user's first real edit so the lock
   * driver acquires the lock implicitly. Reset when the open agent changes.
   */
  hasEdited?: boolean;
  /**
   * Collaborative edit-lock state, driven by the always-mounted lock host so it
   * is resolved before the (loading-gated) editor renders.
   */
  lockState: EditLockState;
  /**
   * Content being streamed from AI
   */
  streamingContent?: string;
  /**
   * Whether streaming is in progress
   */
  streamingInProgress?: boolean;
}

export const initialState: State = {
  hasEdited: false,
  lockState: { holderId: null, lockedByOther: false },
  streamingContent: undefined,
  streamingInProgress: false,
};
