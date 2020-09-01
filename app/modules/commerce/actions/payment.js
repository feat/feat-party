import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

const NS = `COMMERCE/PAYMENT`;

export const initOrderPayment = createAction(`${NS}/INIT_PAYMENT`);
export const exitOrderPayment = createAction(`${NS}/EXIT_PAYMENT`);

export const selectPayMethod = createAction(`${NS}/SELECT_PAY_METHOD`);
export const selectPayAccount = createAction(`${NS}/SELECT_PAY_ACCOUNT`);
export const selectAdPayMethod = createAction(`${NS}/SELECT_AD_PAY_METHOD`);
export const resetPayMethod = createAction(`${NS}/RESET_PAY_METHOD`);
export const fetchAdWeChatPayInfo = createAction(
  `${NS}/FETCH_AD_WECHAT_PAY_INFO`,
);
export const fetchAdAlipayInfo = createAction(`${NS}/FETCH_AD_ALIPAY_INFO`);

export const fetchWechatPayInfo = createRoutine(
  `${NS}/FETCH_WECHAT_PAYMENT_INFO`,
);
export const fetchAlipayInfo = createRoutine(`${NS}/FETCH_ALIPAY_INFO`);

export const refreshPaymentOrderStatus = createRoutine(
  `${NS}/CHECK_PAYMENT_ORDER_STATUS`,
);

export const orderPaid = createAction(`${NS}/ORDER_PAIED`);
export const orderPayAccepted = createAction(`${NS}/ORDER_PAY_ACCEPTED`);
export const postPayRequest = createRoutine(`${NS}/POST_PAY_REQUEST`);
export const setStep = createAction(`${NS}/SET_STEP`);
export const resetPayRequestError = createAction(`${NS}/RESET_PAY_REQUEST_ERROR`);
