import { takeEvery, put, call } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import { serviceOrder as serviceOrderSchema } from '@/schema';


import {
  applyTransition as applyTransitionRequest,
  fetchOrderInfo as fetchOrderInfoRequest,
} from '@/client/commerce';

import notification from '@feat/feat-ui/lib/notification';

import { fetchOrderInfo, applyTransition } from '../actions/order';

function* fetchOrderInfoAsync(action) {
  const { payload } = action;
  try {
    yield put(fetchOrderInfo.request(payload));
    logging.debug('fetch payload order info');
    const { data } = yield call(fetchOrderInfoRequest, payload.orderId);
    const normalized = normalize(data, serviceOrderSchema);
    // TODO: make bundle entities.
    yield put(
      fetchOrderInfo.success({
        orderId: payload.orderId,
        data,
        entities: normalized.entities,
        fetchedAt: Date.now(),
      }),
    );
  } catch (err) {
    yield put(fetchOrderInfo.failure(payload));
    notification.error({
      message: 'Error',
      description: err.message,
    });
    throw err;
  } finally {
    yield put(fetchOrderInfo.fulfill(payload));
  }
}

function* applyTransitionAsync(action) {
  const { payload } = action;
  const { orderId } = payload;

  try {
    yield put(applyTransition.request(action.payload));
    const { data } = yield call(applyTransitionRequest, orderId, payload.data);
    const normalized = normalize(data, serviceOrderSchema);
    yield put(
      applyTransition.success({
        orderId,
        data: payload.data,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    yield put(applyTransition.failure(payload));
    notification.error({
      message: 'Error',
      description: err.message,
    });
    throw err;
  } finally {
    yield put(applyTransition.fulfill(payload));
  }
}

export default function* orderService() {
  yield takeEvery(fetchOrderInfo, fetchOrderInfoAsync);
  yield takeEvery(applyTransition, applyTransitionAsync);
}
