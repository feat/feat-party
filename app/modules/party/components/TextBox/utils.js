import {
  EditorState,
  CompositeDecorator,
  Modifier,
  SelectionState,
} from 'draft-js';

import getEntityTypeStrategy from '@feat/feat-editor/lib/utils/getEntityTypeStrategy';
import getEntityRangeInBlock from '@feat/feat-editor/lib/utils/getEntityRangeInBlock';
import Mention from './Mention';

const ENITTY_TYPE_MENTION = 'mention';

const decorator = new CompositeDecorator([
  {
    strategy: getEntityTypeStrategy(ENITTY_TYPE_MENTION),
    component: Mention,
  },
]);

export const getDisplayName = (member) =>
  member.fullname || String(member.user);
export const getMentionText = (member) => `@ ${getDisplayName(member)}`;

export function createEmpty() {
  return EditorState.createEmpty(decorator);
}

function insertMention(contentState, data) {
  const block = contentState.getFirstBlock();
  const entityCreated = contentState.createEntity(
    ENITTY_TYPE_MENTION,
    'IMMUTABLE',
    data,
  );
  const entityKey = entityCreated.getLastCreatedEntityKey();
  const text = getMentionText(data);
  const mentionInserted = Modifier.insertText(
    entityCreated,
    SelectionState.createEmpty(block.getKey()),
    text,
    undefined,
    entityKey,
  );
  const spaceInserted = Modifier.insertText(
    mentionInserted,
    mentionInserted.getSelectionAfter(),
    ' ',
  );
  return spaceInserted;
}

function removeMention(contentState) {
  const block = contentState.getFirstBlock();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return contentState;
  }

  const [startOffset, endOffset] = getEntityRangeInBlock(block, entityKey);
  const blockText = block.getText();
  const hasPendingWhiteSpace = blockText.substr(endOffset, 1) === ' ';

  const removeRange = new SelectionState({
    anchorKey: block.getKey(),
    anchorOffset: startOffset,
    focusKey: block.getKey(),
    focusOffset: hasPendingWhiteSpace ? endOffset + 1 : endOffset,
  });
  const entityRemoved = Modifier.removeRange(contentState, removeRange);
  return entityRemoved;
}

export function prependOrReplaceMention(contentState, data) {
  const removedContentState = removeMention(contentState);
  const insertedContentState = insertMention(removedContentState, data);
  return insertedContentState;
}

export function syncMention(editorState, member) {
  let contentState = editorState.getCurrentContent();
  if (!member) {
    contentState = removeMention(contentState);
    const newState = EditorState.push(
      editorState,
      contentState,
      'remove-mention',
    );
    return EditorState.forceSelection(
      newState,
      contentState.getSelectionAfter(),
    );
  }
  contentState = prependOrReplaceMention(contentState, member);
  const newState = EditorState.push(
    editorState,
    contentState,
    'update-mention',
  );
  return EditorState.forceSelection(newState, contentState.getSelectionAfter());
}

export function clearContent(editorState) {
  let contentState = editorState.getCurrentContent();
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();

  let anchorOffset = 0;
  while(firstBlock.getEntityAt(anchorOffset) && anchorOffset < firstBlock.getLength()) {
    anchorOffset +=1;
  }

  const allSelected = new SelectionState({
    anchorKey: firstBlock.getKey(),
    anchorOffset,
    focusKey: lastBlock.getKey(),
    focusOffset: lastBlock.getLength(),
    hasFocus: true,
  });
  contentState = Modifier.replaceText(contentState, allSelected, anchorOffset ? ' ' : '');
  const reset = EditorState.push(editorState, contentState, 'remove-range');
  return EditorState.forceSelection(reset, contentState.getSelectionAfter());
}

export function syncTarget(targetUser, editorState) {
  const contentState = editorState.getCurrentContent();
  const block = contentState.getFirstBlock();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return undefined;
  }
  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();
  return {
    uid: data.user,
    username: data.fullname,
  };
}

export function forceFocus(editorState) {
  return EditorState.moveFocusToEnd(editorState);
}
