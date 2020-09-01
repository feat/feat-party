import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';
// Contact
// ------------------
const NS = 'PARTY';

export const postFriendRequest = createRoutine(`${NS}/SEND_FRIEND_REQUEST`);
export const acceptFriendRequest = createRoutine(`${NS}/ACCEPT_FRIEND_REQUEST`);
export const rejectFriendRequest = createRoutine(`${NS}/REJECT_FRIEND_REQUEST`);
export const recallFriendRequest = createRoutine(`${NS}/RECALL_FRIEND_REQUEST`);

export const getInboxContacts = createRoutine(`${NS}/FETCH_INBOX_CONTACTS`);
export const getArchiveContacts = createRoutine(`${NS}/FETCH_ARCHIVE_CONTACTS`);

export const blackUser = createRoutine(`${NS}/BLACK_USER`);
export const unblackUser = createRoutine(`${NS}/UNBLACK_USER`);

export const moveContactToInbox = createAction(`${NS}/MOVE_CONTACT_TO_INBOX`);
export const addTempContact = createAction(`${NS}/ADD_TEMP_CONTACT`);
export const addContact = createAction(`${NS}/ADD_CONTACT`);
export const updateContactTime = createAction(`${NS}/UPDATE_CONTACT_TIME`);
export const replaceContact = createAction(`${NS}/REPLACE_CONTACT`);
export const updateContact = createAction(`${NS}/UPDATE_CONTACT`);

export const receiveFirendRequestInfo = createAction(
  `${NS}/RECEIVE_FRIEND_REQUEST_INFO`,
);
export const receiveAcceptFirendRequestInfo = createAction(
  `${NS}/RECEIVE_ACCEPT_FRIEND_REQUEST_INFO`,
);
export const receiveRejectFirendRequestInfo = createAction(
  `${NS}/RECEIVE_REJECT_FRIEND_REQUEST_INFO`,
);
export const receiveRecallFriendRequestInfo = createAction(
  `${NS}/RECEIVE_RECALL_FRIEND_REQUEST_INFO`,
);
export const resetUnreadCount = createAction(`${NS}/RESET_UNREAD_COUNT`);
export const tryToSendFriendRequest = createAction(
  `${NS}/TRY_TO_SEND_FRIEND_REQUEST`,
);
