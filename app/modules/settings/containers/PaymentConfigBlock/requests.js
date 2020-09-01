import request from '@/utils/request';

export const uniBindAccount = (data) =>
  request({
    url: '/api/pay/account/bind-unpay-account/',
    method: 'POST',
    data,
  });

export const uniBindAccountSentVCode = (data) =>
  request({
    url: '/api/pay/account/bind-unpay-account/send-vcode/',
    method: 'POST',
    data,
  });

export const alipayInfo = () =>
  request({
    url: '/api/user/profile/alipay-info/',
    method: 'GET',
  });
