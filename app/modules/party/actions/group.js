import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

const NS = 'PARTY';

export const createGroup = createRoutine(`${NS}/CREATE_GROUP`);
export const addGroupMembers = createRoutine(`${NS}/ADD_GROUP_MEMBERS`);
export const removeGroupMember = createRoutine(`${NS}/REMOVE_GROUP_MEMBER`);
export const getGroupMembers = createRoutine(`${NS}/FETCH_GROUP_MEMBERS`);
export const blackGroup = createRoutine(`${NS}/BLACK_GROUP`);
export const unblackGroup = createRoutine(`${NS}/UNBLACK_GROUP`);
export const dismissGroup = createRoutine(`${NS}/DISMISS_GROUP`);
export const restoreGroup = createRoutine(`${NS}/RESTORE_GROUP`);
export const renameGroup = createRoutine(`${NS}/RENAME_GROUP`);
export const fetchGroupAvatar = createRoutine(`${NS}/FETCH_GROUP_AVATAR`);

export const receiveDismissGroupInfo = createAction(
  `${NS}/RECEIVE_DISMISS_GROUP_INFO`,
);
export const receiveRestoreGroupInfo = createAction(
  `${NS}/RECEIVE_RESTORE_GROUP_INFO`,
);

// Group Merge Related.
export const postGroupMerge = createRoutine(`${NS}/POST_MERGE_GROUP`);
export const acceptGroupMerge = createRoutine(`${NS}/ACCEPT_GROUP_MERGE`);
export const rejectGroupMerge = createRoutine(`${NS}/REJECT_GROUP_MERGE`);

export const receiveGroupMergeInfo = createAction(
  `${NS}/RECEIVE_GROUP_MERGE_INFO`,
);
export const receiveRejectGroupMergeInfo = createAction(
  `${NS}/RECEIVE_REJECT_GROUP_MERGE_INFO`,
);
export const receiveAcceptGroupMergeInfo = createAction(
  `${NS}/RECEIVE_GROUP_MERGE_REQUEST_INFO`,
);
export const receiveInvalidatedGroupMergeInfo = createAction(
  `${NS}/RECEIVE_INVALIDATED_GROUP_MREGE_INFO`,
);
