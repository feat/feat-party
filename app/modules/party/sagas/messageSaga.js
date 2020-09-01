import { takeEvery, call, put, fork } from 'redux-saga/effects';

import { normalize } from 'normalizr';

import { inboxMessage as inboxMessageSchema } from '@/schema';
import ApiError from '@/errors/ApiError';
import {
  sendMessage as sendMessageRequest,
  sendBroadcastMessage as sendBroadcastMessageRequest,
} from '@/client/party';

import notification from '@feat/feat-ui/lib/notification';
import { sendMessage } from '../actions';

import { updateContactTimeSaga } from './contactSaga';
import { GLOBAL_ROOM } from '../constants';

function* sendMessageAsync(action) {
  const { payload } = action;
  try {
    // payload: { roomId, tempMessageId  data, }
    const tmpNormalized = normalize(payload.data, inboxMessageSchema);
    yield put(
      sendMessage.request({
        roomId: payload.roomId,
        tempMessageId: payload.tempMessageId,
        entities: tmpNormalized.entities,
      }),
    );
    const isBroadcast = payload.roomId === GLOBAL_ROOM;
    const request = isBroadcast
      ? sendBroadcastMessageRequest
      : sendMessageRequest;
    const { data: msg } = yield call(request, payload.data);
    if (!isBroadcast) {
      yield fork(updateContactTimeSaga, payload);
    }

    const normalized = normalize(msg, inboxMessageSchema);
    yield put(
      sendMessage.success({
        roomId: payload.roomId,
        messageId: normalized.result,
        tempMessageId: payload.data.id,
        isBroadcast,
        entities: normalized.entities,
        entityMutators: [
          {
            [inboxMessageSchema.key]: (messages) => {
              const newMessages = { ...messages };
              delete newMessages[payload.tempMessageId];
              return newMessages;
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
    yield put(
      sendMessage.failure({
        roomId: action.payload.roomId,
        tempMessageId: payload.tempMessageId,
        entityMutators: [
          {
            [inboxMessageSchema.key]: {
              [payload.tempMessageId]: {
                error: { $set: err },
              },
            },
          },
        ],
      }),
    );
  } finally {
    yield put(
      sendMessage.fulfill({
        roomId: action.payload.roomId,
      }),
    );
  }
}

// function* broadcastMessageAsync(action) {
//   try {
//     const { data: msg } = yield call(
//       sendBroadcastMessageRequest,
//       action.payload,
//     );
//     const normalized = normalize(msg, inboxMessageSchema);
//     yield put(
//       broadcastMessage.success({
//         roomId: GLOBAL_ROOM,
//         messageId: normalized.result,
//         entities: normalized.entities,
//       }),
//     );
//   } catch (err) {
//     message.error(err.message);
//     yield put(broadcastMessage.failure(err));
//   } finally {
//     yield put(broadcastMessage.fulfill());
//   }
// }

export default function* messageSaga() {
  yield takeEvery(sendMessage, sendMessageAsync);
}
