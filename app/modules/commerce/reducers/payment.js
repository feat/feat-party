import { combineActions } from 'redux-actions';

import { mapHandleActions } from '@/utils/reducerCreators';

import {
  initOrderPayment,
  exitOrderPayment,
  fetchWechatPayInfo,
  selectPayMethod,
  selectPayAccount,
  selectAdPayMethod,
  fetchAlipayInfo,
  orderPaid,
  postPayRequest,
  resetPayRequestError,
  resetPayMethod,
  setStep,
  orderPayAccepted,
  fetchAdWeChatPayInfo,
  fetchAdAlipayInfo,
} from '../actions/payment';
import {
  // PAY_METHOD_CREDIT_CARD,
  // PAY_METHOD_WECHAT,
  PAYMENT_STEP_REVIEW,
  PAYMENT_STEP_PAID,
} from '../constants';

export const initialPaymentState = {
  step: PAYMENT_STEP_REVIEW,
  order: null,
  payMethod: undefined, // PAY_METHOD_WECHAT
  payAccount: null,
  isPostingPay: false,
  isFetchingWechatPayInfo: false,
  wechatPayInfo: null,
  input: {},
  payRequestError: null,

  isFetchingUnionpayNrdVcode: false,

  isFetchingAlipayInfo: false,
  isInitialized: false,
};

const reducer = mapHandleActions(
  {
    [initOrderPayment]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        orderId: payload.orderId,
        order: payload.data,
        isInitialized: true,
      };
    },

    [exitOrderPayment]: () => undefined,

    [selectPayMethod]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        payMethod: payload.data,
      };
    },

    [selectPayAccount]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        payAccount: payload.data,
        payMethod: payload.data.pay_method,
      };
    },

    [selectAdPayMethod]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        payMethod: payload.data.pay_method,
        isFetchingWechatPayInfo: payload.data.isFetchingWechatPayInfo,
        isFetchingAlipayInfo: payload.data.isFetchingAlipayInfo,
      };
    },

    [fetchAdWeChatPayInfo]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        isFetchingWechatPayInfo: false,
        wechatPayInfo: payload.data.wechatPayInfo,
      };
    },

    [fetchAdAlipayInfo]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        isFetchingAlipayInfo: false,
        alipayInfo: payload.data.alipayInfo,
      };
    },

    [resetPayMethod]: (paymentState) => ({
      ...paymentState,
      payAccount: null,
      payMethod: undefined,
      wechatPayInfo: null,
      input: {},
    }),

    [fetchWechatPayInfo.TRIGGER]: (paymentState) => ({
      ...paymentState,
      wechatPayInfoError: null,
    }),

    [fetchWechatPayInfo.REQUEST]: (paymentState) => ({
      ...paymentState,
      isFetchingWechatPayInfo: true,
    }),

    [fetchWechatPayInfo.SUCCESS]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        wechatPayInfo: payload.data,
      };
    },

    [fetchWechatPayInfo.FAILURE]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        wechatPayInfoError: payload.data,
      };
    },

    [fetchWechatPayInfo.FULFILL]: (paymentState) => ({
      ...paymentState,
      isFetchingWechatPayInfo: false,
    }),

    [fetchAlipayInfo.REQUEST]: (paymentState) => ({
      ...paymentState,
      isFetchingAlipayInfo: true,
    }),

    [fetchAlipayInfo.SUCCESS]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        alipayInfo: payload.data,
      };
    },

    [fetchAlipayInfo.FAILURE]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        alipayInfoError: payload.data,
      };
    },

    [fetchAlipayInfo.FULFILL]: (paymentState) => ({
      ...paymentState,
      isFetchingAlipayInfo: false,
    }),

    [postPayRequest.TRIGGER]: (paymentState) => ({
      ...paymentState,
      payRequestError: null,
    }),

    [postPayRequest.REQUEST]: (paymentState) => ({
      ...paymentState,
      isPostingPay: true,
    }),

    [postPayRequest.FAILURE]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        payRequestError: payload.data,
      };
    },

    [postPayRequest.FULFILL]: (paymentState) => ({
      ...paymentState,
      isPostingPay: false,
    }),

    [setStep]: (paymentState, action) => {
      const { payload } = action;
      return {
        ...paymentState,
        step: payload.data,
      };
    },

    [resetPayRequestError]: (paymentState) => ({
      ...paymentState,
      payRequestError: null,
    }),

    [combineActions(orderPaid, orderPayAccepted)]: (paymentState) => {
      if (paymentState === initialPaymentState) {
        return undefined;
      }
      return {
        ...paymentState,
        step: PAYMENT_STEP_PAID,
      };
    },
  },
  initialPaymentState,
  (action) => action.payload && action.payload.orderId,
);

export default reducer;
