import {
  takeEvery,
  put,
  call,
  select,
  take,
  fork,
  cancel,
  delay,
  race,
} from 'redux-saga/effects';
import { normalize } from 'normalizr';
import Router from 'next/router';

import notification from '@feat/feat-ui/lib/notification';

import { formatMessage } from '@/services/intl';

import {
  fetchOrderInfo as fetchOrderInfoRequest,
  // payOrder as payOrderRequest,
} from '@/client/commerce';
import {
  fetchPayMethodInfo as fetchPayMethodInfoRequest,
  refreshPaymentOrderStatus as refreshPaymentOrderStatusRequest,
  wtzConsume as wtzConsumeRequest,
} from '@/client/pay';

import { serviceOrder as serviceOrderSchema } from '@/schema';
import { selectCurrentUserId } from '@/modules/auth/selectors';
import { getAppLink } from '@/utils/user';

import {
  exitOrderPayment,
  selectPayMethod,
  fetchWechatPayInfo,
  fetchAlipayInfo,
  orderPayAccepted,
  orderPaid,
  postPayRequest,
  resetPayMethod,
} from '../actions/payment';

import { fetchOrderInfo } from '../actions/order';

import {
  PAY_METHOD_WECHAT,
  ORDER_STATUS_PAID,
  PAY_METHOD_ALIPAY,
  PAYMENT_STATUS_PAID,
  PAY_METHOD_UNIONPAY_WTZ,
} from '../constants';
import intlMessages from '../messages';

import { selectOrderPaymentState } from '../selectors';

function* checkPaymentStatus(data) {
  const { orderId } = data;
  let errorCount = 0;
  try {
    while (true) {
      const { exit } = yield race({
        delay: delay(5000),
        exit: take(exitOrderPayment),
      });
      if (exit) {
        break;
      }
      try {
        const { data: result } = yield call(
          refreshPaymentOrderStatusRequest,
          data,
        );
        if (result.status === PAYMENT_STATUS_PAID) {
          const { data: orderInfo } = yield call(
            fetchOrderInfoRequest,
            orderId,
          );
          const normalized = normalize(orderInfo, serviceOrderSchema);
          yield put(
            orderPaid({
              orderId,
              entities: normalized.entities,
            }),
          );
        }
      } catch (err) {
        notification.error({
          message: 'Error',
          description: err.message,
        });
        errorCount += 1;
        if (errorCount > 5) {
          throw err;
        }
      }
    }
  } finally {
    logging.debug('watcher finished');
  }
}

function* wechatPayFlow(action) {
  const { payload } = action;
  const paymentState = yield select((state) =>
    selectOrderPaymentState(state, payload),
  );
  const { sn } = paymentState.order.order;
  if (!paymentState.wechatPayInfo && !paymentState.isFetchingWechatInfo) {
    yield fork(
      fetchWechatPayInfoAsync,
      fetchWechatPayInfo({
        orderId: payload.orderId,
        data: {
          sn,
        },
      }),
    );
  }
  if (!paymentState.wechatPayInfo) {
    const { failure, reset } = yield race({
      success: take(fetchWechatPayInfo.SUCCESS),
      failure: take(fetchWechatPayInfo.FAILURE),
      reset: take(resetPayMethod),
    });
    if (failure || reset) {
      return;
    }
  }
  const watcher = yield fork(checkPaymentStatus, {
    orderId: payload.orderId,
    sn,
  });
  yield race({
    paid: take(orderPaid),
    reset: take(resetPayMethod),
  });
  yield cancel(watcher);
}

function* alipayFlow(action) {
  const { payload } = action;
  const paymentState = yield select((state) =>
    selectOrderPaymentState(state, payload),
  );
  const { sn } = paymentState.order.order;
  if (!paymentState.alipayInfo && !paymentState.isFetchingAlipayInfo) {
    yield fork(
      fetchAlipayInfoAsync,
      fetchAlipayInfo({
        orderId: payload.orderId,
        data: {
          sn,
        }, // sn ...
      }),
    );
  }
  // let { alipayInfo } = paymentState;
  if (!paymentState.alipayInfo) {
    const { failure, reset } = yield race({
      success: take(fetchAlipayInfo.SUCCESS),
      failure: take(fetchAlipayInfo.FAILURE),
      reset: take(resetPayMethod),
    });
    if (failure || reset) {
      return;
    }
    // alipayInfo = success.payload.data;
  }
  const watcher = yield fork(checkPaymentStatus, {
    orderId: payload.orderId,
    sn,
  });
  yield race({
    paid: take(orderPaid),
    reset: take(resetPayMethod),
  });
  yield cancel(watcher);
}

function* unionPayWtzFlow(action) {
  const {
    payload: { orderId, data },
  } = action;
  const { data: result } = yield call(wtzConsumeRequest, data.sn, {
    pay_method: data.payMethod,
    account_no: data.accountNo,
    account_id: data.accountId,
    vcode: data.vcode,
    end_type: 0, // web
  });

  logging.debug(result);

  yield put(
    orderPayAccepted({
      orderId,
    }),
  );
  const watcher = yield fork(checkPaymentStatus, {
    orderId,
    sn: data.sn,
  });
  yield race({
    paid: take(orderPaid),
    reset: take(resetPayMethod),
  });
  yield cancel(watcher);
}

function* selectPayMethodFlow(action) {
  const { payload } = action;

  if (payload.data === PAY_METHOD_WECHAT) {
    yield fork(wechatPayFlow, action);
  }
  if (payload.data === PAY_METHOD_ALIPAY) {
    yield fork(alipayFlow, action);
  }
}

function* fetchAlipayInfoAsync(action) {
  const { payload } = action;
  try {
    yield put(fetchAlipayInfo.request(payload));
    const { data } = yield call(fetchPayMethodInfoRequest, {
      sn: payload.data.sn,
      payMethod: PAY_METHOD_ALIPAY,
    });
    // yield delay(1000);
    // const data = {
    //   info: {
    //     template: '<h1>alipay</h1>',
    //   },
    // };
    yield put(
      fetchAlipayInfo.success({
        orderId: payload.orderId,
        params: payload.data,
        data: {
          info: data,
        },
      }),
    );
  } catch (err) {
    yield put(
      fetchAlipayInfo.failure({
        orderId: payload.orderId,
        params: payload.data,
        data: err,
      }),
    );
    notification.error({
      message: 'Error',
      description: err.message,
    });
    // throw err;
  } finally {
    yield put(fetchAlipayInfo.fulfill(payload));
  }
}

function* fetchWechatPayInfoAsync(action) {
  const { payload } = action;
  try {
    yield put(fetchWechatPayInfo.request(payload));
    const { data } = yield call(fetchPayMethodInfoRequest, {
      sn: payload.data.sn,
      payMethod: PAY_METHOD_WECHAT,
    });
    // yield delay(1000);
    // const data = { id: '123123', info: { code_url: 'wechat://123123?kjf' } };
    yield put(
      fetchWechatPayInfo.success({
        orderId: payload.orderId,
        data: {
          info: data,
        },
      }),
    );
  } catch (err) {
    yield put(
      fetchWechatPayInfo.failure({
        orderId: payload.orderId,
        data: err,
      }),
    );
    notification.error({
      message: 'Error',
      description: err.message,
    });
    // throw err;
  } finally {
    yield put(fetchWechatPayInfo.fulfill(payload));
  }
}

function* tryToExitPaymentFlow(action) {
  const {
    payload: { data, trigger, orderId },
  } = action;
  if (trigger === 'payment' && data && data.status === ORDER_STATUS_PAID) {
    yield put(exitOrderPayment({ orderId }));
  }
}

function* postPayRequestFlow(action) {
  const { payload } = action;
  try {
    yield put(postPayRequest.request(payload));
    // yield delay(3000);
    // yield put(
    //   orderPaid({
    //     orderId: payload.orderId,
    //   }),
    // );
    switch (payload.data.payMethod) {
      case PAY_METHOD_UNIONPAY_WTZ:
        yield call(unionPayWtzFlow, action);
        break;
      default:
        logging.warn('Not Handled Pay Method', payload.data.payMethod);
    }
  } catch (err) {
    yield put(
      postPayRequest.failure({
        orderId: payload.orderId,
        params: payload.data,
        data: err,
      }),
    );
    notification.error({
      message: 'Error',
      description: formatMessage(intlMessages.failedToProcessPayment),
    });
    // throw err;
  } finally {
    yield put(postPayRequest.fulfill(payload));
  }
}

function* exitOrderPaymentFlow(action) {
  if (action.payload.shouldRedirect) {
    const currentUserId = yield select(selectCurrentUserId);
    const url = getAppLink(currentUserId);
    Router.push(
      {
        pathname: '/user-profile',
        query: {
          userId: currentUserId,
          dashTab: 'purchase',
        },
      },
      `${url}?dashTab=purchase`,
    );
  }
}

export default function* paymentService() {
  yield takeEvery(selectPayMethod, selectPayMethodFlow);
  yield takeEvery(fetchWechatPayInfo, fetchWechatPayInfoAsync);
  yield takeEvery(fetchOrderInfo.SUCCESS, tryToExitPaymentFlow);
  yield takeEvery(postPayRequest, postPayRequestFlow);
  yield takeEvery(exitOrderPayment, exitOrderPaymentFlow);
}
