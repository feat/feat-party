import {
  takeEvery,
  put,
  call,
  select,
  race,
  take,
  fork,
} from 'redux-saga/effects';

import ApiError from '@/errors/ApiError';

import {
  createOrder as createOrderRequest,
  fetchFreePeriods as fetchFreePeriodsRequest,
} from '@/client/commerce';

import notification from '@feat/feat-ui/lib/notification';

import {
  initOrderCreation,
  setOrderReservation,
  createOrder,
  fetchFreePeriods,
  setCreationStep,
  setOrderAddress,
} from '../actions/creation';

import { selectOrderCreationState } from '../selectors';

import { ORDER_STEP_SELECT_TIME } from '../constants';

import { postUserAddress } from '../actions/user';
import { initOrderPayment } from '../actions/payment';

function mapAddressInfo(obj) {
  if (!obj) {
    return obj;
  }
  const keys = [
    'address',
    'country_code',
    'level_1',
    'level_2',
    'level_3',
    'level_4',
    'level_5',
    'phone',
    'contact_name',
    'lat',
    'lng',
  ];
  const output = {};
  keys.forEach((key) => {
    if (obj[key]) {
      output[key] = obj[key];
    }
  });
  return output;
}

function* fetchFreePeriodsAsync(action) {
  const { payload } = action;
  yield put(fetchFreePeriods.request(payload));
  try {
    const { data } = yield call(fetchFreePeriodsRequest, {
      user_id: payload.data.userId,
      start_time: payload.data.startTime,
      end_time: payload.data.endTime,
    });
    yield put(
      fetchFreePeriods.success({
        ...payload,
        params: payload.data,
        data,
      }),
    );
  } catch (err) {
    yield put(
      fetchFreePeriods.failure({
        ...payload,
        data: err,
      }),
    );
    notification.error({
      message: 'Error',
      description: err.message,
    });
    // throw err;
  } finally {
    yield put(fetchFreePeriods.fulfill(payload));
  }
}

function* setOrderReservationAsync(action) {
  const { payload } = action;

  try {
    yield put(setOrderReservation.request(payload));
    // const { data } = yield call()
    yield put(setOrderReservation.success(payload));
  } catch (err) {
    yield put(
      setOrderReservation.fulfill({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(setOrderReservation.fulfill(payload));
  }
}

function* createOrderAsync(action) {
  const { payload } = action;

  try {
    const data = {
      expertise: payload.expertiseId,
      // service_item_id: payload.serviceItemId,
      service_type: payload.serviceType,
      start_time: payload.period.startTime,
      end_time: payload.period.endTime,
      address: mapAddressInfo(payload.address),
    };
    yield put(createOrder.request(payload));

    const { data: order } = yield call(createOrderRequest, data);
    // yield delay(1000);
    // const order = demoData;

    yield put(
      createOrder.success({
        ...payload,
        data: order,
      }),
    );
    yield fork(
      initPaymentFlowAfterFullfill,
      initOrderPayment({
        expertiseId: payload.expertiseId,
        serviceType: payload.serviceType,
        orderId: order.id,
        data: order,
      }),
    );
  } catch (err) {
    let message;
    if (err.data && err.data.non_field_errors) {
      message = err.data.non_field_errors[0];
    } else {
      message = err.message;
    }
    notification.error({
      message: 'Error',
      description: message,
    });
    // const failurePayload = {
    //   ...payload,
    //   data: err,
    // }
    // yield put(
    //   createOrder.failure(failurePayload),
    // );
    // throw failurePayload;
  } finally {
    yield put(createOrder.fulfill(payload));
  }
}

function* afterReservationFlow(action) {
  const { payload } = action;
  const creationState = yield select((state) =>
    selectOrderCreationState(state, payload),
  );

  const createOrderAction = createOrder({
    expertiseId: creationState.expertiseId,
    serviceType: creationState.serviceType,
    serviceItemId: creationState.serviceItem.id,
    period: creationState.reservation,
    address: creationState.address,
  });
  yield fork(createOrderAsync, createOrderAction);
}

function* afterAddressFlow(action) {
  const { payload } = action;
  const creationState = yield select((state) =>
    selectOrderCreationState(state, payload),
  );
  if (creationState.address) {
    yield put(
      setCreationStep({
        expertiseId: payload.expertiseId,
        serviceType: payload.serviceType,
        data: ORDER_STEP_SELECT_TIME,
      }),
    );
  }
}

function* initOrderCreationFlow(action) {
  const { payload } = action;
  const { expertiseId, serviceType, expertise } = payload;

  // fetch free periods;
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1);
  const endTime = new Date(startTime);
  endTime.setDate(startTime.getDate() + 30);
  const fetchFreePreiodsAction = fetchFreePeriods({
    expertiseId,
    serviceType,
    data: {
      userId: expertise.user_id || expertise.user,
      startTime,
      endTime,
    },
  });

  yield fork(fetchFreePeriodsAsync, fetchFreePreiodsAction);
}

function* setOrderAddressFlow(action) {
  const { payload } = action;
  const { data } = payload;
  if (data && data.id && !data.is_update) {
    yield put(setOrderAddress.success(payload));
    yield put(setOrderAddress.fulfill(payload));
    return;
  }

  // TODO: may postUserAddress directly.
  try {
    yield put(setOrderAddress.request(payload));
    yield put(postUserAddress(payload.data));

    const { success, failure } = yield race({
      success: take(postUserAddress.SUCCESS),
      failure: take(postUserAddress.FAILURE),
    });
    if (success) {
      yield put(
        setOrderAddress.success({
          expertiseId: payload.expertiseId,
          serviceType: payload.serviceType,
          data: success.payload,
        }),
      );
    }
    if (failure) {
      notification.error({
        message: 'Error',
        description: failure.payload.message,
      });
    }
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      setOrderAddress.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(setOrderAddress.fulfill(payload));
  }
}

function* initPaymentFlowAfterFullfill(action) {
  yield take(createOrder.FULFILL);
  // logging.debug('should init payment flow');
  yield put(action);
}

export default function* creationService() {
  yield takeEvery(initOrderCreation, initOrderCreationFlow);
  yield takeEvery(setOrderReservation, setOrderReservationAsync);
  yield takeEvery(setOrderReservation.FULFILL, afterReservationFlow);
  yield takeEvery(setOrderAddress, setOrderAddressFlow);
  yield takeEvery(setOrderAddress.FULFILL, afterAddressFlow);

  // yield takeEvery(createReviewOrder, createReviewOrderAsync);
  yield takeEvery(createOrder, createOrderAsync);

  // yield takeEvery(addUserAddress, addUserAddressAsync);
}
