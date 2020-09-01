import { takeEvery, call, put, select, take } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import ApiError from '@/errors/ApiError';

import {
  contact as contactSchema,
  inboxMessage as inboxMessageSchema,
  archiveMessage as archiveMessageSchema,
} from '@/schema';

import {
  getHistoryMessages as getHistoryMessagesRequest,
  getArchiveMessages as getArchiveMessagesRequest,
  markAsRead as markAsReadRequest,
  featMarkAsRead as featMarkAsReadRequest,
  getFeatUnreadCount as getFeatUnreadCountRequest,
} from '@/client/party';

import notification from '@feat/feat-ui/lib/notification';

import { selectCurrentUser } from '@/modules/auth/selectors';

import {
  GLOBAL_ROOM,
  FEAT_CONTACT_ID,
  CONTACT_TYPE_GROUP,
  CONTACT_TYPE_USER,
  CONTACT_TYPE_FEAT,
} from '../constants';
import {
  selectRoomInfo,
  selectRoomInbox,
  selectRoomArchive,
  selectRoomArchiveQuery,
  selectInboxContactList,
} from '../selectors';

import {
  changeRoom,
  fetchInboxMessages,
  fetchArchiveMessages,
  queryArchiveMessages,
  roomMarkAsRead,
  getFeatUnreadCount,
  updateContact,
  syncBroadcastMessages,
  getInboxContacts,
} from '../actions';
import {
  getGroupInboxMessageTypes,
  getUserInboxMessageTypes,
  getFeatInboxMessageTypes,
  getGlobalInboxMessageTypes,
  getGroupArchiveMessageTypes,
  getUserArchiveMessageTypes,
  getFeatArchiveMessageTypes,
  getGlobalArchiveMessageTypes,
} from '../utils/getMessageTypes';
import { getMaxId, getMinId } from '../utils/message';

const DEFAULT_HISTORY_FECTH_COUNT = 20;

const isGlobal = (roomInfo) => !roomInfo.contactType;

const getInboxFetchOptions = (roomInfo) => {
  const fetchOption = {
    order: 'desc',
    count: DEFAULT_HISTORY_FECTH_COUNT,
    is_archive: false,
  };
  switch (roomInfo.contactType) {
    case CONTACT_TYPE_GROUP:
      fetchOption.message_type = getGroupInboxMessageTypes();
      fetchOption.group = roomInfo.entityId;
      break;
    case CONTACT_TYPE_USER:
      fetchOption.message_type = getUserInboxMessageTypes();
      fetchOption.user = roomInfo.entityId;
      break;
    case CONTACT_TYPE_FEAT:
      fetchOption.message_type = getFeatInboxMessageTypes();
      break;
    default:
      fetchOption.message_type = getGlobalInboxMessageTypes();
  }
  return fetchOption;
};

const getArchiveFetchOptions = (roomInfo) => {
  const fetchOption = {
    order: 'asc',
    count: DEFAULT_HISTORY_FECTH_COUNT,
    is_archive: true,
  };
  switch (roomInfo.contactType) {
    case CONTACT_TYPE_GROUP:
      fetchOption.message_type = getGroupArchiveMessageTypes();
      fetchOption.group = roomInfo.entityId;
      break;
    case CONTACT_TYPE_USER:
      fetchOption.message_type = getUserArchiveMessageTypes();
      fetchOption.user = roomInfo.entityId;
      break;
    case CONTACT_TYPE_FEAT:
      fetchOption.message_type = getFeatArchiveMessageTypes();
      break;
    default:
      fetchOption.message_type = getGlobalArchiveMessageTypes();
  }
  return fetchOption;
};

function* fetchInboxMessagesAsync(action) {
  const { payload } = action;
  try {
    const { roomId } = action.payload;
    const roomInbox = yield select((state) => selectRoomInbox(state, payload));
    if (roomInbox && roomInbox.fetching) {
      return;
    }
    yield put(
      fetchInboxMessages.request({
        roomId: payload.roomId,
      }),
    );
    // select room info
    const roomInfo = yield select((state) => selectRoomInfo(state, payload));

    const options = getInboxFetchOptions(roomInfo);

    if (isGlobal(roomInfo)) {
      const currentUser = yield select(selectCurrentUser);
      options.user = currentUser.uid;
    }

    options.max_id = roomInbox ? getMinId(roomInbox.messages) : undefined;

    const { data: messages } = yield call(getHistoryMessagesRequest, options);

    if (!messages.length) {
      yield put(
        fetchInboxMessages.success({
          roomId,
          hasMore: false,
          list: [],
        }),
      );
    } else {
      const normalized = normalize(messages, [inboxMessageSchema]);
      yield put(
        fetchInboxMessages.success({
          roomId,
          hasMore: messages.length === DEFAULT_HISTORY_FECTH_COUNT,
          list: normalized.result.reverse(),
          entities: normalized.entities,
        }),
      );
    }
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    notification.error({
      message: 'Error',
      description: err.message,
    });
    yield put(
      fetchInboxMessages.failure({ roomId: payload.roomId, error: err }),
    );
  } finally {
    yield put(fetchInboxMessages.fulfill({ roomId: payload.roomId }));
  }
}

function* syncBroadcastMessagesAsync(action) {
  const { payload } = action;
  try {
    const { roomId } = payload;
    const roomInbox = yield select((state) => selectRoomInbox(state, payload));
    if (roomInbox.fetchingBroadcastMessage) {
      return;
    }
    yield put(
      syncBroadcastMessages.request({
        roomId: payload.roomId,
      }),
    );
    // select room info
    const roomInfo = yield select((state) => selectRoomInfo(state, payload));

    const options = getInboxFetchOptions(roomInfo);
    options.since = roomInbox ? getMaxId(roomInbox.messages) : undefined;
    options.order = 'asc';
    const { data: messages } = yield call(getHistoryMessagesRequest, options);
    const normalized = normalize(messages, [inboxMessageSchema]);
    yield put(
      syncBroadcastMessages.success({
        roomId,
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    notification.error({
      message: 'Error',
      description: err.message,
    });
  } finally {
    yield put(
      syncBroadcastMessages.fulfill({
        roomId: payload.roomId,
      }),
    );
  }
}

function* fetchArchiveMessagesAsync(action) {
  const { payload } = action;
  try {
    const { roomId } = action.payload;
    const roomArchive = yield select((state) =>
      selectRoomArchive(state, payload),
    );
    if (roomArchive && roomArchive.fetching) {
      return;
    }
    yield put(fetchArchiveMessages.request({ roomId }));
    const roomInfo = yield select((state) => selectRoomInfo(state, payload));
    const options = getArchiveFetchOptions(roomInfo);
    options.since = roomArchive ? getMaxId(roomArchive.messages) : undefined;

    const { data: messages } = yield call(getArchiveMessagesRequest, options);

    if (!messages.length) {
      yield put(
        fetchArchiveMessages.success({
          roomId,
          hasMore: false,
          list: [],
        }),
      );
    } else {
      const normalized = normalize(messages, [archiveMessageSchema]);
      yield put(
        fetchArchiveMessages.success({
          roomId,
          hasMore: messages.length === DEFAULT_HISTORY_FECTH_COUNT,
          list: normalized.result,
          entities: normalized.entities,
        }),
      );
    }
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    notification.error({
      message: 'Error',
      description: err.message,
    });
    yield put(
      fetchArchiveMessages.failure({
        roomId: payload.roomId,
        error: err,
      }),
    );
  } finally {
    yield put(
      fetchArchiveMessages.fulfill({
        roomId: payload.roomId,
      }),
    );
  }
}

function* queryArchiveMessagesAsync(action) {
  const { payload } = action;
  try {
    const { roomId, filter } = payload;
    const queryArchive = yield select((state) => selectRoomArchiveQuery(state, payload));
    if (queryArchive.fetching) {
      return;
    }
    yield put(queryArchiveMessages.request({ roomId, filter }))
    const roomInfo = yield select((state) => selectRoomInfo(state, payload));
    const options = getArchiveFetchOptions(roomInfo);
    options.since = queryArchive ? getMaxId(queryArchive.messages) : undefined;
    
    const { data: messages } = yield call(getArchiveMessagesRequest, {
      ...filter,
      ...options,
    });

    if (!messages.length) {
      yield put(
        queryArchiveMessages.success({
          roomId,
          filter,
          hasMore: false,
          list: [],
        }),
      );
    } else {
      const normalized = normalize(messages, [archiveMessageSchema]);
      yield put(
        queryArchiveMessages.success({
          roomId,
          filter,
          hasMore: messages.length === DEFAULT_HISTORY_FECTH_COUNT,
          list: normalized.result,
          entities: normalized.entities,
        }),
      );
    }
  } catch (err) {
    yield put(
      queryArchiveMessages.failure({
        roomId: payload.roomId,
        filter: payload.filter,
        error: err,
      }),
    );
  } finally {
    yield put(
      queryArchiveMessages.fulfill({
        roomId: payload.roomId,
        filter: payload.filter,
      })
    )
  }
}

function* roomMarkAsReadAsync(action) {
  const { payload } = action;
  const roomInfo = yield select((state) => selectRoomInfo(state, payload));
  if (!roomInfo.isInitialized) {
    return;
  }
  try {
    if (roomInfo.contactType === CONTACT_TYPE_FEAT) {
      yield call(featMarkAsReadRequest);
    } else {
      yield call(
        markAsReadRequest,
        roomInfo.contactType === CONTACT_TYPE_GROUP
          ? { toGroup: [roomInfo.entityId] }
          : { fromUser: [roomInfo.entityId] },
      );
    }
    yield put(
      roomMarkAsRead.success({
        roomId: payload.roomId,
        entityMutators: [
          {
            [contactSchema.key]: {
              [roomInfo.contactId]: {
                unread_count: {
                  $set: 0,
                },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    notification.error({
      message: 'Error',
      description: err.message,
    });
    yield put(
      roomMarkAsRead.failure({
        roomId: payload.roomId,
        error: err,
      }),
    );
  }
}

function* getFeatUnreadCountAsync() {
  // TODO check if has fetched
  try {
    const { data } = yield call(getFeatUnreadCountRequest);
    const inboxContact = yield select(selectInboxContactList);

    if (!inboxContact.length) {
      yield take(getInboxContacts.SUCCESS);
    }

    yield put(
      updateContact({
        entityMutators: [
          {
            [contactSchema.key]: {
              [FEAT_CONTACT_ID]: {
                unread_count: {
                  $set: data.count,
                },
              },
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
  }
}

export default function* roomSaga() {
  const globalRoom = yield select((state) =>
    selectRoomInfo(state, GLOBAL_ROOM),
  );
  if (!globalRoom) {
    yield put(
      changeRoom({
        roomId: GLOBAL_ROOM,
      }),
    );
  }

  yield takeEvery(fetchInboxMessages, fetchInboxMessagesAsync);
  yield takeEvery(syncBroadcastMessages, syncBroadcastMessagesAsync);
  yield takeEvery(fetchArchiveMessages, fetchArchiveMessagesAsync);
  yield takeEvery(queryArchiveMessages, queryArchiveMessagesAsync);
  yield takeEvery(roomMarkAsRead, roomMarkAsReadAsync);
  yield takeEvery(getFeatUnreadCount, getFeatUnreadCountAsync);
}
