import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import ApiError from '@/errors/ApiError';

import {
  postFriendRequest as postFriendRequestApi,
  acceptFriendRequest as acceptFriendRequestApi,
  rejectFriendRequest as rejectFriendRequestApi,
  getArchiveContacts as getArchiveContactsRequest,
  getInboxContacts as getInboxContactsRequest,
  recallFriendRequest as recallFriendRequestApi,
  blackUser as blackUserRequest,
  unblackUser as unblackUserRequest,
  getContact as getContactRequest,
} from '@/client/party';
import {
  contact as contactSchema,
  inboxMessage as inboxMessageSchema,
} from '@/schema';

import message from '@feat/feat-ui/lib/message';
import notification from '@feat/feat-ui/lib/notification';

import featLogo from '!url-loader!../images/feat.png';

import {
  FEAT_CONTACT_ID,
  CONTACT_TYPE_FEAT,
  CONTACT_TYPE_GROUP,
  TEMP_CONTACT_PREFIX,
  IM_TAB_ARCHIVE,
  // GLOBAL_ROOM
  MESSAGE_TYPE_FRIEND_APPLY,
  CONTACT_LIST_STATUS_BLACK,
  GROUP_STATUS_DISMISS,
} from '../constants';

import {
  changeTab,
  moveContactToInbox,
  postFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  recallFriendRequest,
  getInboxContacts,
  getArchiveContacts,
  blackUser,
  unblackUser,
  updateContactTime,
  replaceContact,
  tryToSendFriendRequest,
  // changeRoom
} from '../actions';

import {
  selectInboxContactByRoomId,
  selectInboxMessagesByRoomId,
  selectCurrentContact,
  selectInboxContactList,
  selectInboxContactFetched,
  selectContactByUserId,
  selectArchiveContactFetched,
} from '../selectors';
import { getRoomId } from '../utils/room';
import { getUserTempContactId } from '../utils/contact';

const FEAT_CONTACT = {
  id: FEAT_CONTACT_ID,
  type: CONTACT_TYPE_FEAT,
  logo: featLogo,
  name: 'Feat',
  stickToTop: true,
};

function* changeTabSaga(action) {
  if (action.payload === IM_TAB_ARCHIVE) {
    return;
  }
  const currentContact = yield select(selectCurrentContact);

  if (!currentContact) {
    return;
  }
  // check if contact in inbox list;
  const inboxContactList = yield select(selectInboxContactList);

  if (!inboxContactList.find((contactId) => contactId === currentContact.id)) {
    yield put(
      moveContactToInbox({
        contactId: currentContact.id,
      }),
    );
  }

  // if (contact.status === CONTACT_LIST_STATUS_BLACK) {
  //   yield put(changeRoom(GLOBAL_ROOM));
  // }
}

function* postFriendRequestAsync(action) {
  try {
    const { data: contact } = yield call(postFriendRequestApi, action.payload);
    const normalized = normalize(contact, contactSchema);
    const tempContactId = getUserTempContactId(action.payload.userId);
    yield put(
      postFriendRequest.success({
        contactId: normalized.result,
        originContactId: tempContactId,
        entities: normalized.entities,
        entityMutators: [
          {
            [contactSchema.key]: (contacts) => {
              const mapped = { ...contacts };
              delete mapped[tempContactId];
              return mapped;
            },
          },
        ],
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(postFriendRequest.failure(err));
  }
}

function* acceptFriendRequestAsync(action) {
  try {
    const { data: contact } = yield call(
      acceptFriendRequestApi,
      action.payload,
    );
    const normalized = normalize(contact, contactSchema);

    // update request message deatil;
    const featMessageList = yield select((state) =>
      selectInboxMessagesByRoomId(
        state,
        getRoomId({
          type: CONTACT_TYPE_FEAT,
          id: FEAT_CONTACT_ID,
        }),
      ),
    );
    const firendRequestMessage = featMessageList.find(
      (msg) =>
        msg.message_type === MESSAGE_TYPE_FRIEND_APPLY &&
        msg.from_user === action.payload.userId,
    );
    if (firendRequestMessage) {
      normalized.entityMutators = [
        {
          [inboxMessageSchema.key]: {
            [firendRequestMessage.id]: {
              detail: (d) => ({
                ...d,
                current_status: contact.status,
                is_handled: true,
                action: 'accept',
              }),
            },
          },
        },
      ];
    }
    yield put(acceptFriendRequest.success(normalized));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(acceptFriendRequest.failure(err));
  }
}

function* rejectFriendRequestAsync(action) {
  try {
    const { data: contact } = yield call(
      rejectFriendRequestApi,
      action.payload,
    );

    const normalized = normalize(contact, contactSchema);
    const payload = {
      contactId: normalized.result,
      entities: normalized.entities,
    };
    // update request message deatil;
    const featMessageList = yield select((state) =>
      selectInboxMessagesByRoomId(
        state,
        getRoomId({
          type: CONTACT_TYPE_FEAT,
          id: FEAT_CONTACT_ID,
        }),
      ),
    );
    const firendRequestMessage = featMessageList.find(
      (msg) =>
        msg.message_type === MESSAGE_TYPE_FRIEND_APPLY &&
        msg.from_user === action.payload.userId,
    );
    if (firendRequestMessage) {
      payload.entityMutators = [
        {
          [inboxMessageSchema.key]: {
            [firendRequestMessage.id]: {
              detail: (d) => ({
                ...(d || {}),
                current_status: contact.status,
                is_handled: true,
                action: 'reject',
              }),
            },
          },
        },
      ];
    }
    yield put(rejectFriendRequest.success(payload));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(rejectFriendRequest.failure(err));
  }
}

function* recallFriendRequestAsync(action) {
  try {
    const { data: contact } = yield call(
      recallFriendRequestApi,
      action.payload,
    );
    const normalized = normalize(contact, contactSchema);
    // TODO update related messages.
    yield put(
      recallFriendRequest.success({
        contactId: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(recallFriendRequest.failure(err));
  }
}

function* getInboxContactsAsync(action) {
  const forceRequest = action.payload;
  if (!forceRequest) {
    const inboxContactFetched = yield select(selectInboxContactFetched);
    if (inboxContactFetched) {
      return;
    }
  }
  try {
    yield put(getInboxContacts.request());
    const { data: contacts } = yield call(getInboxContactsRequest);
    const normalized = normalize(
      [
        // inject FeatContact
        FEAT_CONTACT,
        ...contacts,
      ],
      [contactSchema],
    );

    yield put(
      getInboxContacts.success({
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(getInboxContacts.failure(err));
  } finally {
    yield put(getInboxContacts.fulfill());
  }
}

function* getArchiveContactsAsync(action) {
  const forceRequest = action.payload;
  if (!forceRequest) {
    const fetched = yield select(selectArchiveContactFetched);
    if (fetched) {
      yield put(getArchiveContacts.fulfill());
      return;
    }
  }
  try {
    const { data: contacts } = yield call(getArchiveContactsRequest);
    const normalized = normalize(
      [
        // inject FeatContact
        FEAT_CONTACT,
        ...contacts,
      ],
      [contactSchema],
    );
    yield put(
      getArchiveContacts.success({
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(getArchiveContacts.failure(err));
  } finally {
    yield put(getArchiveContacts.fulfill());
  }
}

function* blackUserAsync(action) {
  try {
    const { data: contact } = yield call(blackUserRequest, action.payload);
    const normalized = normalize(contact, contactSchema);
    yield put(
      blackUser.success({
        userId: action.payload.userId,
        contactId: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      blackUser.failure({
        userId: action.payload.userId,
        error: err,
      }),
    );
  }
}

function* unblackUserAsync(action) {
  const { roomId, userId } = action.payload;
  try {
    const { data: contact } = yield call(unblackUserRequest, action.payload);
    const normalized = normalize(contact, contactSchema);
    yield put(
      unblackUser.success({
        contactId: normalized.result,
        userId: action.payload.userId,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      unblackUser.failure({
        roomId,
        userId,
        error: err,
      }),
    );
  }
}

export function* updateContactTimeSaga(data) {
  const { roomId, unreadCount } = data;
  const contact = yield select((state) =>
    selectInboxContactByRoomId(state, roomId),
  );
  if (!contact || String(contact.id).indexOf(TEMP_CONTACT_PREFIX) === 0) {
    const [type, id] = roomId.split('_');
    const query = type === CONTACT_TYPE_GROUP ? { group: id } : { user: id };
    try {
      const {
        data: newContact,
      } = yield call(getContactRequest, query);
      const normalized = normalize(newContact, contactSchema);
      logging.info('getContactRequest', newContact);
      // receive dismiss group message.
      if (
        newContact.group &&
        newContact.group.status === GROUP_STATUS_DISMISS
      ) {
        yield put({
          type: 'UPDATE_CONTACT',
          entities: normalized.entities,
        });
      } else {
        const entityMutators = [];
        const originContactId = contact ? contact.id : undefined;
        if (originContactId) {
          entityMutators.push({
            [contactSchema.key]: (contacts) => {
              const mapped = { ...contacts };
              delete mapped[contact.id];
              return mapped;
            },
          });
        }
        yield put(
          replaceContact({
            contactId: normalized.result,
            originContactId,
            entities: normalized.entities,
            entityMutators,
          }),
        );
      }
    } catch (err) {
      logging.error(err, {
        query,
      });
    }
  } else {
    const payload = {
      contactId: contact.id,
      entityMutators: [
        {
          [contactSchema.key]: {
            [contact.id]: (c) => ({
              ...c,
              contact_time: new Date().toISOString(),
              unread_count: unreadCount
                ? (c.unread_count || 0) + 1
                : c.unread_count,
            }),
          },
        },
      ],
    };

    yield put(updateContactTime(payload));
  }
}

function* tryToSendFriendRequestFlow(action) {
  // check if user exists in contact list;
  const { payload: userInfo } = action;
  const contact = yield select((state) =>
    selectContactByUserId(state, userInfo.uid),
  );
  // send friend request
  if (contact && contact.status === CONTACT_LIST_STATUS_BLACK) {
    message.error(
      'User has been blacked before. You may unblack target user first.',
    ); // TODO: intlMessage
    return;
  }
  yield put(postFriendRequest({ userId: userInfo.uid }));
}

export default function* contactSaga() {
  yield all([
    takeEvery(changeTab, changeTabSaga),
    takeEvery(getInboxContacts, getInboxContactsAsync),
    takeEvery(getArchiveContacts, getArchiveContactsAsync),
    takeEvery(postFriendRequest, postFriendRequestAsync),
    takeEvery(acceptFriendRequest, acceptFriendRequestAsync),
    takeEvery(rejectFriendRequest, rejectFriendRequestAsync),
    takeEvery(recallFriendRequest, recallFriendRequestAsync),
    takeEvery(blackUser, blackUserAsync),
    takeEvery(unblackUser, unblackUserAsync),
  ]);
  yield takeEvery(tryToSendFriendRequest, tryToSendFriendRequestFlow);
  yield put(getInboxContacts());
  yield put(getArchiveContacts());
}
