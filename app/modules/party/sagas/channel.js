import { select, take, put, call, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { normalize } from 'normalizr';
import Notify from 'notifyjs';
import get from 'lodash/get';

import ApiError from '@/errors/ApiError';
import {
  inboxMessage as inboxMessageSchema,
  archiveMessage as archiveMessageSchema,
  contact as contactSchema,
  group as groupSchema,
} from '@/schema';

import { formatMessage } from '@/services/intl';
import { getContact as getContactRequest } from '@/client/party';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { getUsername } from '@/utils/user';
import { getConfirmedText } from '../utils/content.js';

import notification from '@feat/feat-ui/lib/notification';

import {
  ORDER_STATUS_CREATED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_TO_START,
  ORDER_STATUS_FOR_PROVIDER_TO_START,
  ORDER_STATUS_FOR_CONSUMER_TO_START,
  ORDER_STATUS_ON_AIR,
  ORDER_STATUS_PAUSE,
  ORDER_STATUS_FINISHED,
  ORDER_STATUS_WAITING_FOR_REFUND,
  ORDER_STATUS_WAITING_FOR_ARBITRATION,
  ORDER_STATUS_REFUNDING,
  ORDER_STATUS_FUNDING,
  ORDER_STATUS_FULFILL,
} from '@/modules/commerce/constants';

import {
  getFeatInboxMessageTypes,
  getUserInboxMessageTypes,
  getGroupInboxMessageTypes,
  getRoomInboxMessageTypes,
  getFeatArchiveMessageTypes,
} from '../utils/getMessageTypes';

import { shouldNotify } from '../utils/message';

import partySocket from '../socket';

import {
  receiveMessage,
  addContact,
  receiveDismissGroupInfo,
  receiveRestoreGroupInfo,
  receiveGroupMergeInfo,
  receiveRejectGroupMergeInfo,
  receiveAcceptGroupMergeInfo,
  receiveFirendRequestInfo,
  receiveAcceptFirendRequestInfo,
  receiveRejectFirendRequestInfo,
  receiveRecallFriendRequestInfo,
  receiveInvalidatedGroupMergeInfo,
  resetArchiveReachEnd,
  replaceContact,
  roomMarkAsRead,
  getGroupMembers,
  setRoomTargetUser,
} from '../actions';

import {
  selectContactByRoomId,
  selectInboxMessageById,
  selectArchiveMessageById,
  selectPartyIsOpened,
  selectCurrentRoomId,
  selectContactByUserId,
  selectContactByGroupId,
  selectContactIdByGroupId,
  selectRoomInfo,
  selectGroupMembers,
} from '../selectors';

import {
  CONTACT_TYPE_FEAT,
  CONTACT_TYPE_USER,
  CONTACT_TYPE_GROUP,
  FEAT_CONTACT_ID,
  GROUP_STATUS_CHECKING_MERGE,
  GROUP_STATUS_CREATED,
  GROUP_STATUS_DISMISS,
  GROUP_STATUS_REQUESTING_MERGE,
  CONTACT_LIST_STATUS_STRANGER,
  CONTACT_LIST_STATUS_BLACK,
  CONTACT_LIST_STATUS_APPLYING,
  CONTACT_LIST_STATUS_CREATED,
  CONTACT_LIST_STATUS_REJECTED,
  GROUP_MERGE_REQUEST_STATUS_INVALID,
  MESSAGE_TYPE_FRIEND_APPLY,
  MESSAGE_TYPE_FRIEND_ACCEPT,
  MESSAGE_TYPE_FRIEND_REJECT,
  MESSAGE_TYPE_FRIEND_RECALL,
  MESSAGE_TYPE_GROUP_RENAME,
  MESSAGE_TYPE_GROUP_MERGE_REQUEST,
  MESSAGE_TYPE_GROUP_MERGE_REQUEST_REJECT,
  MESSAGE_TYPE_GROUP_MERGE_REQUEST_INVALID,
  MESSAGE_TYPE_GROUP_MERGED,
  MESSAGE_TYPE_GROUP_DISMISS,
  MESSAGE_TYPE_GROUP_RESTORE,
  MESSAGE_TYPE_DEMAND,
  // MESSAGE_TYPE_FRIEND_IM,
  MESSAGE_TYPE_BROADCAST,
  MESSAGE_TYPE_GROUP_PM,
  MESSAGE_TYPE_GROUP_IM,
  MESSAGE_TYPE_GROUP_NEW,
  MESSAGE_TYPE_GROUP_NEW_MEMBER,
  MESSAGE_TYPE_GROUP_BLACK,
  MESSAGE_TYPE_GROUP_UNBLACK,
  MESSAGE_TYPE_DZ_REWORDING_AUDIT,
  MESSAGE_TYPE_DZ_REWORDING_SUBMIT,
  MESSAGE_TYPE_DZ_REWORDING_COMMENT,
  MESSAGE_TYPE_DZ_REWORDING_LIKE,
  MESSAGE_TYPE_DZ_COLLABORATOR_CHANGE,
  MESSAGE_TYPE_ORDER_ERROR,
  MESSAGE_TYPE_RECEIVING_ACCOUNT_MISSING,
  MESSAGE_TYPE_DZ_COLLABORATOR_JOIN,
  //
  GLOBAL_ROOM,
} from '../constants';

import { notification as notiMessages, role as roleMessage } from '../messages';

import { updateContactTimeSaga } from './contactSaga';
import {
  getContactAvatar,
  getContactName,
  isTempContact,
} from '../utils/contact';
import { getRoomId } from '../utils/room';

let inAppNotification = false;

function partyChannel(userId) {
  partySocket.open();
  return eventChannel((emitter) => {
    partySocket.private(`party-chat-${userId}`);
    partySocket.on('party.chat', (_, message) => {
      emitter(message);
    });
    // TEMP
    partySocket.on('wx-attension', (_, message) => {
      const evt = new CustomEvent('WxAttension', {
        detail: message,
      });
      window.dispatchEvent(evt);
    });

    return () => {
      partySocket.leave(`party-chat-${userId}`);
    };
  });
}

function* getGroupContactbyId(groupId) {
  const contact = yield select((state) =>
    selectContactByGroupId(state, groupId),
  );
  if (!contact) {
    const { data: fromRemote } = yield call(getContactRequest, {
      group: groupId,
    });
    return fromRemote;
  }
  return contact;
}

function getRoomIdFromMessage(message, currentUser) {
  let roomId;
  if (message.to_group) {
    roomId = `${CONTACT_TYPE_GROUP}_${message.to_group}`;
  } else if (message.from_user && message.from_user !== currentUser.uid) {
    roomId = `${CONTACT_TYPE_USER}_${message.from_user}`;
  } else {
    roomId = `${CONTACT_TYPE_USER}_${message.to_user}`;
  }
  return roomId;
}

function isSyncMessage(message, currentUser) {
  return message.from_user === currentUser.uid;
}

function isSystemMessage(message, currentUser) {
  return (
    !message.to_group &&
    !message.from_user &&
    message.to_user === currentUser.uid
  );
}

function* prepareContactForMessage(message, currentUser) {
  const roomId = getRoomIdFromMessage(message, currentUser);
  if (
    roomId === `${CONTACT_TYPE_USER}_${currentUser.uid}` ||
    roomId === GLOBAL_ROOM
  ) {
    return undefined;
  }
  const contact = yield select((state) => selectContactByRoomId(state, roomId));
  const tempContact = contact && isTempContact(contact);
  if (!contact || tempContact) {
    let query;
    try {
      query = message.to_group
        ? { group: message.to_group }
        : {
            user:
              message.from_user === currentUser.uid
                ? message.to_user
                : message.from_user,
          };
      const { data: newContact } = yield call(getContactRequest, query);
      if (!newContact) {
        logging.warn('FAILED_TO_FETCH_CONTACT: ', query);
      }
      newContact.unread_count = 0; // reset unread_count; 1 --> 0;
      const normalized = normalize(newContact, contactSchema);
      if (tempContact) {
        // replace contact
        yield put(
          replaceContact({
            originContactId: contact.id,
            contactId: normalized.result,
            entities: normalized.entities,
          }),
        );
      } else {
        yield put(
          addContact({
            contactId: normalized.result,
            entities: normalized.entities,
          }),
        );
      }
      return newContact;
    } catch (err) {
      if (err.code && err.code === 'NOT_FOUND') {
        logging.error(err, {
          currentUser: currentUser.uid,
          query,
        });
      } else {
        notification.error({
          message: 'Error',
          description: err.message,
        });
        if (!(err instanceof ApiError)) {
          logging.error(err);
        }
      }
    }
  }
  return contact;
}

function* groupMemberSideEffects(message) {
  if (
    message.message_type === MESSAGE_TYPE_DZ_COLLABORATOR_CHANGE &&
    !get(message, 'detail.is_deleted')
  ) {
    return;
  }
  const { to_group: groupId } = message;
  const group = yield select((state) =>
    get(state, ['entities', groupSchema.key, groupId]),
  );
  if (group && group.members) {
    yield put(
      getGroupMembers({
        groupId,
        roomId: `${CONTACT_TYPE_GROUP}_${groupId}`,
      }),
    );
  }
}

function* groupMergeRequestSideEffects(message) {
  yield put(
    receiveGroupMergeInfo({
      entityMutators: [
        {
          [groupSchema.key]: {
            [message.to_group]: {
              status: {
                $set: GROUP_STATUS_CHECKING_MERGE,
              },
            },
          },
        },
      ],
    }),
  );
}

function* groupMergeRequestRejectSideEffects(message) {
  yield put(
    receiveRejectGroupMergeInfo({
      entityMutators: [
        {
          [groupSchema.key]: {
            [message.detail.target_group]: {
              status: { $set: GROUP_STATUS_CREATED },
            },
            [message.detail.source_group]: {
              status: { $set: GROUP_STATUS_CREATED },
            },
          },
        },
      ],
    }),
  );
}

function* groupMergedSideEffects(message) {
  const sourceGroupId = message.detail.source_group;
  const targetGroupId = message.detail.target_group;
  const sourceGroupContactId = yield select((state) =>
    selectContactIdByGroupId(state, sourceGroupId),
  );
  yield put(
    receiveAcceptGroupMergeInfo({
      sourceGroupId,
      targetGroupId,
      sourceGroupContactId,
      entityMutators: [
        {
          [groupSchema.key]: {
            [sourceGroupId]: (g) => {
              if (!g) {
                return undefined;
              }
              return {
                ...g,
                status: GROUP_STATUS_DISMISS,
                is_valid: false,
              };
            },
            [targetGroupId]: (g) => {
              if (!g) {
                return undefined;
              }
              return {
                ...g,
                status: GROUP_STATUS_CREATED,
                members: undefined,
              };
            },
          },
        },
      ],
    }),
  );
}

function* groupMergeInvalidSideEffects(message) {
  const sourceGroupId = message.detail.source_group;
  const targetGroupId = message.detail.target_group;
  const entityMutators = [
    {
      [groupSchema.key]: {
        [sourceGroupId]: (g) => {
          if (!g) {
            return undefined;
          }
          if (g.status !== GROUP_STATUS_REQUESTING_MERGE) {
            return g;
          }
          return {
            ...g,
            status: GROUP_STATUS_CREATED,
          };
        },
        [targetGroupId]: (g) => {
          if (!g) {
            return undefined;
          }
          if (g.status !== GROUP_STATUS_CHECKING_MERGE) {
            return g;
          }
          return {
            ...g,
            status: GROUP_STATUS_CREATED,
          };
        },
      },
    },
  ];
  if (message.detail.apply_msg_id) {
    entityMutators.push({
      [inboxMessageSchema.key]: {
        [String(message.detail.apply_msg_id)]: {
          detail: (d) => ({
            ...d,
            is_handled: true,
            request_status: GROUP_MERGE_REQUEST_STATUS_INVALID,
          }),
        },
      },
    });
  }
  yield put(
    receiveInvalidatedGroupMergeInfo({
      entityMutators,
    }),
  );
}

function* groupDismissSideEffects(message) {
  const contact = yield call(getGroupContactbyId, message.to_group);
  yield put(
    receiveDismissGroupInfo({
      groupId: message.to_group,
      contactId: contact && contact.id,
      entityMutators: [
        {
          [groupSchema.key]: {
            [message.to_group]: (g) => ({
              ...g,
              status: GROUP_STATUS_DISMISS,
            }),
          },
        },
      ],
    }),
  );
}

function* groupRestoreSideEffects(message) {
  const contact = yield call(getGroupContactbyId, message.to_group);
  yield put(
    receiveRestoreGroupInfo({
      groupId: message.to_group,
      contactId:
        contact.status !== CONTACT_LIST_STATUS_BLACK ? contact.id : false,
      entityMutators: [
        {
          [groupSchema.key]: {
            [message.to_group]: (g) => ({
              ...g,
              status: GROUP_STATUS_CREATED,
            }),
          },
        },
      ],
    }),
  );
}

function* friendRequestSideEffects(message) {
  const contact = yield select((state) =>
    selectContactByUserId(state, message.from_user),
  );
  if (contact) {
    yield put(
      receiveFirendRequestInfo({
        userId: message.from_user,
        contactId: contact.id,
        entityMutators: [
          {
            [contactSchema.key]: {
              [contact.id]: {
                status: {
                  $set: CONTACT_LIST_STATUS_APPLYING,
                },
              },
            },
          },
        ],
      }),
    );
  }
}

function* friendRequestAcceptedSideEffects(message) {
  const contact = yield select((state) =>
    selectContactByUserId(state, message.from_user),
  );
  if (contact) {
    yield put(
      receiveAcceptFirendRequestInfo({
        userId: message.from_user,
        contactId: contact.id,
        entityMutators: [
          {
            [contactSchema.key]: {
              [contact.id]: {
                status: {
                  $set: CONTACT_LIST_STATUS_CREATED,
                },
              },
            },
          },
        ],
      }),
    );
  }
}

function* friendRequestRejectedSideEffects(message) {
  const contact = yield select((state) =>
    selectContactByUserId(state, message.from_user),
  );
  if (contact) {
    yield put(
      receiveRejectFirendRequestInfo({
        userId: message.from_user,
        contactId: contact.id,
        entityMutators: [
          {
            [contactSchema.key]: {
              [contact.id]: {
                status: {
                  $set: CONTACT_LIST_STATUS_REJECTED,
                },
              },
            },
          },
        ],
      }),
    );
  }
}

function* friendRequestRecalledSideEffects(message) {
  const contact = yield select((state) =>
    selectContactByUserId(state, message.from_user),
  );
  const relatedMessage = yield select((state) =>
    selectInboxMessageById(state, message.detail.apply_msg_id),
  );
  const relatedArchiveMessage = yield select((state) =>
    selectArchiveMessageById(state, message.detail.archived_apply_msg_id),
  );
  if (!relatedMessage && !contact && !relatedArchiveMessage) {
    return;
  }

  const entityMutators = [];
  if (relatedMessage) {
    entityMutators.push({
      [inboxMessageSchema.key]: {
        [relatedMessage.id]: {
          detail: (d = {}) => ({
            ...d,
            is_handled: true,
            action: 'recall',
          }),
        },
      },
    });
  }
  if (relatedArchiveMessage) {
    entityMutators.push({
      [archiveMessageSchema.key]: {
        [relatedArchiveMessage.id]: {
          detail: (d = {}) => ({
            ...d,
            is_handled: true,
            action: 'recall',
          }),
        },
      },
    });
  }
  if (contact) {
    entityMutators.push({
      [contactSchema.key]: {
        [contact.id]: (c) => ({
          ...c,
          status: CONTACT_LIST_STATUS_STRANGER,
        }),
      },
    });
  }
  yield put(
    receiveRecallFriendRequestInfo({
      userId: message.from_user,
      messageId: message.detail.apply_message,
      entityMutators,
    }),
  );
}

function* groupRenameSideEffects(message) {
  yield put({
    type: 'UPDATE_GROUP_NAME',
    payload: {
      entityMutators: [
        {
          [groupSchema.key]: {
            [message.to_group]: {
              name: {
                $set: message.detail.group_name,
              },
            },
          },
        },
      ],
    },
  });
}

function* groupMemberLeftSideEffects(message) {
  const {
    to_group: toGroup,
    detail: { uid },
  } = message;
  yield put({
    type: 'UPDATE_GROUP_MEMBER_STATUS',
    payload: {
      entityMutators: [
        {
          [groupSchema.key]: {
            [toGroup]: {
              members: (list) =>
                list.map(
                  (item) =>
                    item.user === uid
                      ? {
                          ...item,
                          status: CONTACT_LIST_STATUS_BLACK,
                        }
                      : item,
                ),
            },
          },
        },
      ],
    },
  });
}

function* groupMemberRejoinSideEffects(message) {
  const {
    to_group: toGroup,
    detail: { uid },
  } = message;
  yield put({
    type: 'UPDATE_GROUP_MEMBER_STATUS',
    payload: {
      entityMutators: [
        {
          [groupSchema.key]: {
            [toGroup]: {
              members: (list) =>
                list.map(
                  (item) =>
                    item.user === uid
                      ? {
                          ...item,
                          status: CONTACT_LIST_STATUS_CREATED,
                        }
                      : item,
                ),
            },
          },
        },
      ],
    },
  });
}

function* handleMessageMeta(message) {
  switch (message.message_type) {
    case MESSAGE_TYPE_GROUP_NEW_MEMBER:
    case MESSAGE_TYPE_DZ_COLLABORATOR_JOIN:
    case MESSAGE_TYPE_DZ_COLLABORATOR_CHANGE:
      yield call(groupMemberSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_MERGE_REQUEST:
      yield call(groupMergeRequestSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_MERGE_REQUEST_REJECT: // eslint-disable-line
      yield call(groupMergeRequestRejectSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_MERGED:
      yield call(groupMergedSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_MERGE_REQUEST_INVALID:
      yield call(groupMergeInvalidSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_DISMISS:
      yield call(groupDismissSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_RESTORE:
      yield call(groupRestoreSideEffects, message);
      break;
    case MESSAGE_TYPE_FRIEND_APPLY:
      yield call(friendRequestSideEffects, message);
      break;
    case MESSAGE_TYPE_FRIEND_ACCEPT:
      yield call(friendRequestAcceptedSideEffects, message);
      break;
    case MESSAGE_TYPE_FRIEND_REJECT:
      yield call(friendRequestRejectedSideEffects, message);
      break;
    case MESSAGE_TYPE_FRIEND_RECALL:
      yield call(friendRequestRecalledSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_RENAME:
      yield call(groupRenameSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_BLACK:
      yield call(groupMemberLeftSideEffects, message);
      break;
    case MESSAGE_TYPE_GROUP_UNBLACK:
      yield call(groupMemberRejoinSideEffects, message);
      break;
    default:
      logging.debug('NO SIDE EFFECTS: ', message.message_type);
  }
}

const orderNotifyMap = new Proxy(
  {
    [ORDER_STATUS_CREATED]: 'orderCreated',
    [ORDER_STATUS_PAID]: 'orderPaid',
    [ORDER_STATUS_CANCELLING]: 'orderCancelling',
    [ORDER_STATUS_CANCELED]: 'orderCanceled',
    [ORDER_STATUS_CONFIRMED]: 'orderAccepted',
    [ORDER_STATUS_TO_START]: 'orderToStart',
    [ORDER_STATUS_FOR_PROVIDER_TO_START]: 'orderStartTriggered',
    [ORDER_STATUS_FOR_CONSUMER_TO_START]: 'orderStartTriggered',
    [ORDER_STATUS_ON_AIR]: 'orderStartConfirmed',
    [ORDER_STATUS_PAUSE]: 'orderPause',
    [ORDER_STATUS_FINISHED]: 'orderFinished',
    [ORDER_STATUS_WAITING_FOR_REFUND]: 'orderRefundRequested',
    [ORDER_STATUS_WAITING_FOR_ARBITRATION]: 'orderRefundRejected',
    [ORDER_STATUS_REFUNDING]: 'orderRefundConfirmed',
    [ORDER_STATUS_FUNDING]: 'orderFund',
    [ORDER_STATUS_FULFILL]: 'orderFulfilled',
    fallback: 'orderStatusUpdated',
  },
  {
    get(obj, prop) {
      if (!(prop in obj)) {
        logging.error(`not defined order notice message: ${prop}`);
        return obj.fallback;
      }
      return obj[prop];
    },
  },
);

function* notifyMessage(message, contact) {
  let title;
  let body;
  const { message_type: messageType } = message;
  const featInboxMessageTypes = getFeatInboxMessageTypes();
  const userInboxMessageTypes = getUserInboxMessageTypes();
  const groupInboxMessageTypes = getGroupInboxMessageTypes();

  if (featInboxMessageTypes.includes(messageType)) {
    title = formatMessage(notiMessages.siteName);
  } else if (userInboxMessageTypes.includes(messageType)) {
    title = getContactName(contact);
  } else if (groupInboxMessageTypes.includes(messageType)) {
    title = getContactName(contact);
  } else {
    title = formatMessage(notiMessages.generalTitle);
  }
  switch (messageType) {
    case MESSAGE_TYPE_BROADCAST:
      title = message.from_name || `${message.from_user}`;
      body = formatMessage(notiMessages.broadcast, {
        username: message.from_name || `${message.from_user}`,
        content: message.content,
      });
      break;
    case MESSAGE_TYPE_FRIEND_APPLY:
      body = formatMessage(notiMessages.friendRequest, {
        username: message.from_name || `${message.from_user}`,
      });
      break;
    case MESSAGE_TYPE_FRIEND_ACCEPT:
      body = formatMessage(notiMessages.friendRequestAccepted, {
        username: message.from_name || `${message.from_user}`,
      });
      break;
    case MESSAGE_TYPE_FRIEND_REJECT:
      body = formatMessage(notiMessages.friendRequestRejected, {
        username: message.from_name || `${message.from_user}`,
      });
      break;
    case MESSAGE_TYPE_FRIEND_RECALL:
      body = formatMessage(notiMessages.friendRequestRecalled, {
        username: message.from_name || `${message.from_user}`,
      });
      break;
    case MESSAGE_TYPE_GROUP_IM:
      body = formatMessage(notiMessages.groupIm, {
        fromUsername: message.from_name || `${message.from_user}`,
        content: message.content,
      });
      break;
    case MESSAGE_TYPE_GROUP_PM:
      body = formatMessage(notiMessages.groupPm, {
        fromUsername: message.from_name || `${message.from_user}`,
        toUsername: message.to_name || `${message.to_user}`,
        content: message.content,
      });
      break;
    case MESSAGE_TYPE_GROUP_NEW:
      body = formatMessage(notiMessages.newGroup, {
        groupName: message.detail.group_name,
      });
      break;
    case MESSAGE_TYPE_GROUP_RENAME:
      body = formatMessage(notiMessages.groupRenamed, {
        groupName: message.detail.group_name,
      });
      break;
    case MESSAGE_TYPE_GROUP_NEW_MEMBER:
      body = formatMessage(notiMessages.newGroupMembers, {
        members: message.detail.new_member
          .map((item) => item.username || item.uid)
          .join(', '),
      });
      break;
    case MESSAGE_TYPE_GROUP_BLACK:
      body = formatMessage(notiMessages.groupMemberLeft, {
        username: message.detail.username || message.detail.uid,
      });
      break;
    case MESSAGE_TYPE_GROUP_UNBLACK:
      body = formatMessage(notiMessages.groupMemberRejoined, {
        username: message.detail.username || message.detail.uid,
      });
      break;
    case MESSAGE_TYPE_GROUP_DISMISS:
      body = formatMessage(notiMessages.groupDismissed, {
        groupName: message.detail.group_name,
      });
      break;
    case MESSAGE_TYPE_GROUP_RESTORE:
      body = formatMessage(notiMessages.groupRestored, {
        groupName: message.detail.group_name,
      });
      break;
    case MESSAGE_TYPE_GROUP_MERGE_REQUEST:
      body = formatMessage(notiMessages.groupMergeRequest, {
        sourceGroupCreator:
          message.detail.source_group_creator_name ||
          message.detail.source_group_creator_uid,
        sourceGroup: message.detail.source_group_name,
        targetGroup: message.detail.target_group_name,
      });
      break;
    case MESSAGE_TYPE_DEMAND:
      if (!message.detail.status) {
        return;
      }
      body = formatMessage(
        notiMessages[orderNotifyMap[message.detail.status]],
        {
          orderName: message.detail.title,
          provider:
            message.detail.provider.username ||
            `${message.detail.provider.uid}`,
          consumer:
            message.detail.consumer.username ||
            `${message.detail.consumer.uid}`,
        },
      );
      break;
    case MESSAGE_TYPE_DZ_REWORDING_AUDIT:
      if (message.detail && message.detail.action === 'elect') {
        body = formatMessage(notiMessages.rewordingElected, {
          content: getConfirmedText(message.detail.reword.html_content),
        });
      } else if (message.detail && message.detail.action === 'reject') {
        body = formatMessage(notiMessages.rewordingRejected, {
          content: getConfirmedText(message.detail.reword.html_content),
        });
      }
      break;
    case MESSAGE_TYPE_DZ_REWORDING_SUBMIT:
      body = formatMessage(notiMessages.rewordingSubmitted, {
        content: getConfirmedText(message.detail.reword.html_content),
      });
      break;
    case MESSAGE_TYPE_DZ_REWORDING_COMMENT:
      body = formatMessage(notiMessages.rewordingCommented, {
        username: getUsername(get(message, 'detail.comment_data.user')),
      });
      break;
    case MESSAGE_TYPE_DZ_REWORDING_LIKE:
      body = formatMessage(notiMessages.rewordingLiked, {
        username: getUsername(get(message, 'detail.like_data.user')),
      });
      break;
    case MESSAGE_TYPE_DZ_COLLABORATOR_JOIN:
      body = formatMessage(notiMessages.collaboratorJoin, {
        username: getUsername(get(message, 'detail.user')),
        identity: formatMessage(roleMessage[message.detail.role]),
      });
      break;
    case MESSAGE_TYPE_DZ_COLLABORATOR_CHANGE:
      if (message.detail.is_deleted) {
        body = formatMessage(notiMessages.collaboratorRemoved, {
          username: getUsername(get(message, 'detail.user')),
        });
      } else {
        body = formatMessage(notiMessages.collaboratorChange, {
          username: getUsername(get(message, 'detail.user')),
          identity: formatMessage(roleMessage[message.detail.role]),
        });
      }

      break;
    case MESSAGE_TYPE_ORDER_ERROR:
      body = formatMessage(notiMessages.orderError);
      break;
    case MESSAGE_TYPE_RECEIVING_ACCOUNT_MISSING:
      body = formatMessage(notiMessages.receivingAccountMissing);
      break;
    default:
      body = message.content || `Type: ${message.message_type}`;
  }

  if (!title) {
    logging.warn('notify title missing', message);
  }

  if (inAppNotification) {
    notification.open({
      message: title,
      description: body,
    });
  }

  try {
    const notice = new Notify(title || 'message', {
      body,
      icon: contact ? getContactAvatar(contact) : undefined,
      notifyClick: () => {
        const event = new CustomEvent('party-message-clicked', {
          detail: {
            message,
            contact,
          },
        });
        global.parent.focus();
        window.focus();
        window.dispatchEvent(event);
        notice.close();
      },
    });
    notice.show();
  } catch (err) {
    logging.error(err);
  }
}

function* handleRoomMessage(message, currentUser, contact) {
  const normalized = normalize(message, inboxMessageSchema);
  let roomId;
  if (
    message.message_type === MESSAGE_TYPE_BROADCAST &&
    message.to_user === message.from_user
  ) {
    roomId = GLOBAL_ROOM;
  } else {
    roomId = getRoomId(contact);
  }
  const currentRoomId = yield select(selectCurrentRoomId);
  const partyIsOpened = yield select(selectPartyIsOpened);
  const shouldUpdateUnreadCount =
    !isSyncMessage(message, currentUser) &&
    shouldNotify(message.message_type) && // TODO: isInboxMessage(message)
    (!document.hasFocus() || !partyIsOpened || currentRoomId !== roomId);
  if (roomId !== GLOBAL_ROOM) {
    yield fork(updateContactTimeSaga, {
      roomId,
      unreadCount: shouldUpdateUnreadCount,
    });
  }
  yield put(
    receiveMessage({
      roomId,
      contact,
      messageId: normalized.result,
      entities: normalized.entities,
    }),
  );
  if (!shouldUpdateUnreadCount) {
    yield put(roomMarkAsRead({ roomId }));
  }
}

function* handleSystemMessage(message) {
  const normalized = normalize(message, inboxMessageSchema);
  const roomId = `${CONTACT_TYPE_FEAT}_${FEAT_CONTACT_ID}`;
  const currentRoomId = yield select(selectCurrentRoomId);
  const partyIsOpened = yield select(selectPartyIsOpened);

  // handle broadcast message
  if (message.message_type === MESSAGE_TYPE_BROADCAST) {
    return;
  }

  const shouldUpdateUnreadCount =
    !document.hasFocus() || !partyIsOpened || currentRoomId !== roomId;

  yield fork(updateContactTimeSaga, {
    roomId,
    unreadCount: shouldUpdateUnreadCount,
  });
  yield put(
    receiveMessage({
      roomId,
      messageId: normalized.result,
      entities: normalized.entities,
    }),
  );
  if (!shouldUpdateUnreadCount) {
    yield put(roomMarkAsRead({ roomId }));
  }
}

function* tryToSetTargetUser(message, currentUser, contact) {
  // get roomInfo
  const roomId = getRoomIdFromMessage(message, currentUser);
  const roomInfo = yield select((state) => selectRoomInfo(state, { roomId }));

  // user has input in current room
  if (roomInfo.editorState.getCurrentContent().hasText()) {
    return;
  }

  // message is not direct to current user
  if (currentUser.uid !== message.to_user) {
    return;
  }

  if (!roomInfo.memberFetched) {
    //   yield put(getGroupMembers({
    //     roomId,
    //     groupId: contact.group.id,
    //   }))
    yield take(getGroupMembers.SUCCESS);
  }
  const groupMembers = yield select((state) =>
    selectGroupMembers(state, message.to_group),
  );
  const member =
    groupMembers && groupMembers.find((m) => m.user === message.from_user);

  if (member) {
    yield put(
      setRoomTargetUser({
        roomId,
        groupId: contact.group.id,
        member,
      }),
    );
  }
}

function* uiEnhanceUpdate(message, currentUser, contact) {
  switch (message.message_type) {
    case MESSAGE_TYPE_GROUP_PM:
      yield call(tryToSetTargetUser, message, currentUser, contact);
      break;
    default:
  }
}

function* channelSaga() {
  console.log('$$$$$$$$$$$$$$$$$$');
  // query user channel info;
  logging.debug('Party Websocket Channel Init');
  const currentUser = yield select(selectCurrentUser);
  const chan = yield call(partyChannel, currentUser.uid);
  if (Notify.needsPermission && Notify.isSupported()) {
    Notify.requestPermission(undefined, () => {
      inAppNotification = true;
    });
  }
  try {
    while (true) {
      const message = yield take(chan);
      logging.debug(message);
      let contact;
      const isSync = isSyncMessage(message, currentUser);
      if (
        (message.to_user || message.from_user || message.to_group) &&
        !isSystemMessage(message, currentUser)
      ) {
        contact = yield call(prepareContactForMessage, message, currentUser);
      }
      // handle data side effects
      yield call(handleMessageMeta, message);

      // handle feat messages
      const featInboxMessageTypes = getFeatInboxMessageTypes();
      const featArchiveMessageTypes = getFeatArchiveMessageTypes();
      if (featInboxMessageTypes.indexOf(message.message_type) > -1) {
        yield fork(handleSystemMessage, message);
      }
      if (featArchiveMessageTypes.indexOf(message.message_type) > -1) {
        yield put(
          resetArchiveReachEnd({
            roomId: `${CONTACT_TYPE_FEAT}_${FEAT_CONTACT_ID}`,
          }),
        );
      }

      // handle room messages
      const roomInboxMessageTypes = getRoomInboxMessageTypes();
      if (roomInboxMessageTypes.indexOf(message.message_type) > -1) {
        yield call(handleRoomMessage, message, currentUser, contact);
      }

      // notification
      if (shouldNotify(message.message_type) && !isSync) {
        yield fork(notifyMessage, message, contact);
      }

      // handle ui effects
      yield fork(uiEnhanceUpdate, message, currentUser, contact);
    }
  } catch (err) {
    logging.error(err);
  } finally {
    logging.debug('Party Websocket Channel Terminated');
    chan.close();
  }
}

export default channelSaga;
