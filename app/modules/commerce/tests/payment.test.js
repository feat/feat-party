import {
  initOrderPayment,
  exitOrderPayment,
  fetchWechatPayInfo,
  fetchAlipayInfo,
  postPayRequest,
  selectPayMethod,
  selectPayAccount,
  resetPayMethod,
  orderPayAccepted,
} from '../actions/payment';

import paymentReducer from '../reducers/payment';
import {
  PAY_METHOD_CREDIT_CARD,
  PAY_METHOD_ALIPAY,
  PAYMENT_STEP_PAID,
} from '../constants';

const ORDER_ID = 'ORDER_ID';

describe('Commerce Payment', () => {
  describe('basic ui flow', () => {
    let state;
    it('init payment', () => {
      const order = { id: ORDER_ID };
      const action = initOrderPayment({
        orderId: ORDER_ID,
        data: order,
      });
      state = paymentReducer(undefined, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState).toBeTruthy();
      expect(paymentState.isInitialized).toBe(true);
      expect(paymentState.orderId).toEqual(ORDER_ID);
      expect(paymentState.order).toBe(order);
    });

    it('select pay method', () => {
      const action = selectPayMethod({
        orderId: ORDER_ID,
        data: PAY_METHOD_ALIPAY,
      });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.payMethod).toEqual(PAY_METHOD_ALIPAY);
    });

    it('select pay account', () => {
      const account = {
        pay_method: PAY_METHOD_CREDIT_CARD,
      };
      const action = selectPayAccount({
        orderId: ORDER_ID,
        data: account,
      });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.payAccount).toEqual(account);
      expect(paymentState.payMethod).toEqual(PAY_METHOD_CREDIT_CARD);
    });

    it('orderPayAccepted', () => {
      const action = orderPayAccepted({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.step).toEqual(PAYMENT_STEP_PAID);
    });

    it('reset pay method', () => {
      const action = resetPayMethod({
        orderId: ORDER_ID,
      });
      const methodReseted = paymentReducer(state, action);
      const paymentState = methodReseted[ORDER_ID];
      expect(paymentState.payAccount).toBeFalsy();
      expect(paymentState.payMethod).toBeFalsy();
    });

    it('exit payment', () => {
      const action = exitOrderPayment({
        orderId: ORDER_ID,
      });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState).toBeFalsy();
    });
  });

  describe('fetch wechat pay info', () => {
    let state = paymentReducer(
      undefined,
      initOrderPayment({ orderId: ORDER_ID, data: {} }),
    );
    it('request', () => {
      const action = fetchWechatPayInfo.request({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.isFetchingWechatPayInfo).toBeTruthy();
    });
    it('success', () => {
      const paymentInfo = {};
      const action = fetchWechatPayInfo.success({
        orderId: ORDER_ID,
        data: paymentInfo,
      });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.wechatPayInfo).toBe(paymentInfo);
    });
    it('fulfill', () => {
      const action = fetchWechatPayInfo.fulfill({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.isFetchingWechatPayInfo).toBe(false);
    });
  });

  describe('fetch alipay info', () => {
    let state = paymentReducer(
      undefined,
      initOrderPayment({ orderId: ORDER_ID, data: {} }),
    );
    it('request', () => {
      const action = fetchAlipayInfo.request({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.isFetchingAlipayInfo).toBeTruthy();
    });
    it('success', () => {
      const paymentInfo = {};
      const action = fetchAlipayInfo.success({
        orderId: ORDER_ID,
        data: paymentInfo,
      });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.alipayInfo).toBe(paymentInfo);
    });
    it('failure', () => {
      const error = new Error('Failed to create order');
      const action = fetchAlipayInfo.failure({
        orderId: ORDER_ID,
        data: error,
      });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.alipayInfoError).toBe(error);
    });
    it('fulfill', () => {
      const action = fetchAlipayInfo.fulfill({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.isFetchingAlipayInfo).toBeFalsy();
    });
  });

  describe('Post pay request', () => {
    let state = paymentReducer(
      undefined,
      initOrderPayment({ orderId: ORDER_ID, data: {} }),
    );
    let failureState;

    it('request', () => {
      const action = postPayRequest.request({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.isPostingPay).toBeTruthy();
    });

    it('failure', () => {
      const error = new Error('Failed');
      const action = postPayRequest.failure({ orderId: ORDER_ID, data: error });
      failureState = paymentReducer(state, action);
      const paymentState = failureState[ORDER_ID];
      expect(paymentState.payRequestError).toBe(error);
    });

    it('fulfill', () => {
      const action = postPayRequest.fulfill({ orderId: ORDER_ID });
      state = paymentReducer(state, action);
      const paymentState = state[ORDER_ID];
      expect(paymentState.isPostingPay).toBeFalsy();
    });

    it('trigger, shoudld reset error', () => {
      const action = postPayRequest({ orderId: ORDER_ID });
      const restState = paymentReducer(failureState, action);
      const paymentState = restState[ORDER_ID];
      expect(paymentState.payRequestError).toBeNull();
    });
  });
});
