import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

const NS = 'PARTY';

export const updateRoomEditor = createAction(`${NS}/UPDATE_ROOM_EDITOR`);
export const fetchInboxMessages = createRoutine(`${NS}/FETCH_INBOX_MESSAGES`);
export const syncBroadcastMessages = createRoutine(
  `${NS}/SYNC_BROADCAST_MESSAGES`,
);
export const fetchArchiveMessages = createRoutine(
  `${NS}/FETCH_ARCHIVE_MESSAGES`,
);
export const roomMarkAsRead = createRoutine(`${NS}/ROOM_MARK_AS_READ`);

export const receiveMessage = createAction(`${NS}/RECEIVE_MESSAGE`);

export const setRoomTargetUser = createAction(`${NS}/SET_ROOM_TARGET_USER`);

export const getFeatUnreadCount = createRoutine(`${NS}/GET_FEAT_UNREAD_COUNT`);

// RENAME
export const initRenameGroup = createAction(`${NS}/INIT_RENAME_GROUP`);
export const cancelRenameGroup = createAction(`${NS}/CANCEL_RENAME_GROUP`);
export const confirmRenameGroup = createAction(`${NS}/CONFIRM_RENAME_GROUP`);

// RESET REACHEND
export const resetArchiveReachEnd = createAction(
  `${NS}/RESET_ARCHIVE_REACH_END`,
);

export const focusRoomEditor = createAction(`${NS}/FOCUS_ROOM_EDITOR`);
export const initMessageReply = createAction(`${NS}/INIT_MESSAGE_REPLY`);
export const initRoom = createAction(`${NS}/INIT_ROOM`);
export const updateFilter = createAction(`${NS}/UPDATE_FILTER`);

export const queryArchiveMessages = createRoutine(`${NS}/QUERY_ARCHIVE_MESSAGES`);
export const initArchiveQuery = createAction(`${NS}/INIT_ARCHIVE_QUERY`);
export const resetArchiveQuery = createAction(`${NS}/RESET_ARCHIVE_QUERY`);