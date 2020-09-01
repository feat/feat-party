import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, select, take, fork } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import uniqBy from 'lodash/uniqBy';

import {
  serviceOrder as serviceOrderSchema,
  serviceDemand as serviceDemandSchema,
} from '@/schema';

import { selectCurrentUser } from '@/modules/auth/selectors';

import { joinExcChannel } from '../actions/common';
import { orderUpdated, orderSignal } from '../actions/order';
import {
  newParticipant,
  newBid,
  newLeading,
  demandStatusUpdated,
  participantQuit,
} from '../actions/demand';
import { transactionSocket, serviceSocket } from '../socket';
import { selectOrderInfo } from '../selectors';

// let joined;

function excChannel(userId) {
  transactionSocket.open();
  return eventChannel((emitter) => {
    transactionSocket.private(`transaction-${userId}`);
    transactionSocket.on('update-state', (_, message) => {
      // eslint-disable-next-line
      message.isPurchase = userId === message.consumer.uid;
      emitter(orderSignal(message));
    });
    return () => {
      transactionSocket.emit('leave_room', `private-transaction-${userId}`);
    };
  });
}

function* handleOrderSignal(action) {
  const { payload: message } = action;
  const orderInfo = yield select(selectOrderInfo, message.id);
  if (
    orderInfo &&
    new Date(orderInfo.last_modified) > new Date(message.last_modified)
  ) {
    return;
  }
  const { action: orderAction, task_id, isPurchase, ...order } = message;
  const normalized = normalize(order, serviceOrderSchema);

  yield put(
    orderUpdated({
      orderId: message.id,
      data: order,
      info: {
        action: orderAction,
      },
      isPurchase,
      entities: normalized.entities,
    }),
  );
}

function* watchCommerceChannel() {
  // if (joined) {
  //   console.log('joined before');
  //   return;
  // }
  // joined = true;
  const user = yield select(selectCurrentUser);
  const channel = yield call(excChannel, user.uid);
  try {
    while (true) {
      const action = yield take(channel);
      switch (action.type) {
        case orderSignal.toString():
          yield call(handleOrderSignal, action);
          break;
        default:
          logging.warn('Not Handled Exc Signal', action);
      }
    }
  } finally {
    channel.close();
  }
}

function getDemandId(room) {
  const matched = /(?:demand|opportunity)-(\d*)$/.exec(room);
  if (!matched) {
    logging.warn('No room Id Matched', {
      room,
    });
    return undefined;
  }
  const roomId = parseInt(matched[1], 10);
  if (!roomId) {
    logging.warn('Invalid roomId', roomId);
  }
  return roomId;
}

function updateDemandStatus(data) {
  return demandStatusUpdated({
    demandId: data.demand_id,
    entityMutators: [
      {
        [serviceDemandSchema.key]: {
          [data.demand_id]: {
            status: {
              $set: data.status,
            },
          },
        },
      },
    ],
  });
}

function participantSort(a, b) {
  if ((a.hasQuit && b.hasQuit) || (!a.hasQuit && !b.hasQuit)) {
    return parseInt(a.current_bid, 10) - parseInt(b.current_bid, 10);
  }
  return a.hasQuit ? 1 : -1;
}

function* listenDemandSocket() {
  const channel = eventChannel((emitter) => {
    serviceSocket.connect();
    // demand
    serviceSocket.on('service.demand.new-participant', (room, message) => {
      const demandId = getDemandId(room);
      if (!demandId) {
        return;
      }
      emitter(
        newParticipant({
          demandId,
          data: message,
          entityMutators: [
            {
              [serviceDemandSchema.key]: {
                [demandId]: {
                  activeBids: (list = []) =>
                    uniqBy([...list, message], (item) => item.user.uid).sort(
                      participantSort,
                    ),
                },
              },
            },
          ],
        }),
      );
    });
    serviceSocket.on('service.demand.new-bid', (room, message) => {
      const demandId = getDemandId(room);
      if (!demandId) {
        return;
      }
      emitter(
        newBid({
          demandId,
          data: message,
          entityMutators: [
            {
              [serviceDemandSchema.key]: {
                [demandId]: {
                  activeBids: (list = []) =>
                    list
                      .map(
                        (item) =>
                          item.user.uid === message.user.uid ? message : item,
                      )
                      .sort(participantSort),
                },
              },
            },
          ],
        }),
      );
    });
    serviceSocket.on('service.demand.demand-abandon', (room, message) => {
      emitter(
        participantQuit({
          demandId: message.demand_id,
          user: message.user,
          entityMutators: [
            {
              [serviceDemandSchema.key]: {
                [message.demand_id]: {
                  activeBids: (list = []) =>
                    list
                      .map(
                        (item) =>
                          item.user.uid === message.user.uid
                            ? {
                              ...item,
                              hasQuit: true,
                            }
                            : item,
                      )
                      .sort(participantSort),
                },
              },
            },
          ],
        }),
      );
    });
    serviceSocket.on('service.demand.new-leading', (_, message) => {
      emitter(
        newLeading({
          demandId: message.demand_id,
          data: message,
          entityMutators: [
            {
              [serviceDemandSchema.key]: {
                [message.demand_id]: {
                  lead_bid: {
                    $set: message.lead_bid,
                  },
                },
              },
            },
          ],
        }),
      );
    });
    // opportunity
    // serviceSocket.on('service.demand.new-leading', (room, message) => {
    //   logging.debug(room, message);
    // });

    serviceSocket.on('service.demand.demand-cancelled', (_, message) => {
      emitter(updateDemandStatus(message));
    });

    serviceSocket.on('service.demand.demand-closed', (room, message) => {
      emitter(updateDemandStatus(message));
    });

    serviceSocket.on('service.demand.demand-completed', (room, message) => {
      emitter(updateDemandStatus(message));
    });
    return () => {
      serviceSocket.disconnect();
    };
  });

  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    channel.close();
  }
}

export default function* commonService() {
  yield takeEvery(joinExcChannel, watchCommerceChannel);
  yield fork(listenDemandSocket);
}
