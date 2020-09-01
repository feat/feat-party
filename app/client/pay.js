import request from '@/utils/request';

export const getPaymentSetting = () =>
  request({
    url: '/api/pay/payment/',
  });

export const updatePaymentSetting = (data) =>
  request({
    url: `/api/pay/payment/`,
    method: 'PATCH',
    data,
  });

export const changePaymentPassword = (data) =>
  request({
    url: '/api/pay/payment/change-password/',
    method: 'POST',
    data,
  });

export const wtzOpenQuery = (data) =>
  request({
    url: `/api/pay/account/open_query/`,
    method: 'POST',
    data,
  });

export const wtzGetOpenTemplate = (data) =>
  request({
    url: `/api/pay/account/open_card_front/`,
    method: 'POST',
    data,
  });

export const wtzSendConsumeCode = ({ sn, ...data }) =>
  request({
    url: `/api/pay/order/${sn}/send_vcode/`,
    method: 'POST',
    data,
  });

export const wtzConsume = (sn, data) =>
  request({
    url: `/api/pay/order/${sn}/unpay/`,
    method: 'POST',
    data,
  });

export const refreshPaymentOrderStatus = (data) =>
  request({
    url: `/api/pay/order/${data.sn}/refresh_order_status/`,
    method: 'POST',
  });

export const fetchPayMethodInfo = (data) =>
  request({
    url: `/api/pay/order/${data.sn}/pay/`,
    method: 'POST',
    data: {
      pay_method: data.payMethod,
      end_type: 0,
    },
  });

export const payOrder = (sn, data) =>
  request({
    url: `/api/pay/order/${sn}/pay/`,
    method: 'POST',
    data,
  });
