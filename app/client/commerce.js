import request from '@/utils/request';

/**
 *
 * @param {provider: string, page_size: integer } params
 */
export const fetchSalesOrders = (params) =>
  request({
    url: `/api/user/sales/`,
    method: 'GET',
    params,
  });

export const fetchPurchaseOrders = (params) =>
  request({
    url: `/api/user/purchase/`,
    method: 'GET',
    params,
  });

export const createOrder = (data) =>
  request({
    url: '/api/user/demand/',
    method: 'POST',
    data,
  });

export const createReviewOrder = (data) =>
  request({
    // url: '/api/user/demand/',
    url: '/api/user/demand/pre-order/',
    method: 'POST',
    data,
  });

export const updateOrderStatus = (id, data) =>
  request({
    url: `/api/user/demand/${id}/update_status/`,
    method: 'POST',
    data,
  });

export const fetchUserAddresses = (params) =>
  request({
    url: '/api/geo/user_address/',
    method: 'GET',
    params,
  });

export const fetchFreePeriods = (params) =>
  request({
    url: '/api/service/free-periods/',
    method: 'GET',
    params,
  });

export const fetchOrderInfo = (orderId) =>
  request({
    url: `/api/user/demand/${orderId}/`,
    method: 'GET',
  });

export const applyTransition = (orderId, data) =>
  request({
    url: `/api/user/demand/${orderId}/update_status/`,
    method: 'POST',
    data: {
      action: data.action.replace('-', '_'),
    },
  });

export const fetchUserPaymentSettings = () =>
  request({
    url: `/api/pay/account/`,
    method: 'GET',
  });

export const addPaymentAccount = (data) =>
  request({
    url: '/api/pay/account/',
    method: 'POST',
    data,
  });

export const deletePaymentAccount = (id) =>
  request({
    url: `/api/pay/account/${id}/`,
    method: 'DELETE',
  });

export const setDefaultReceiptAccount = (data) =>
  request({
    url: '/api/pay/account/default_receipt/',
    method: 'POST',
    data,
  });

export const setDefaultPaymentAccount = (data) =>
  request({
    url: '/api/pay/account/default_payment/',
    method: 'POST',
    data,
  });

export const markOrderUpdateAsRead = (id) =>
  request({
    url: `/api/user/order/${id}/read/`,
    method: 'POST',
  });

export const getBriefInfo = () =>
  request({
    url: `/api/user/order/info/`,
    method: 'GET',
  });

export const createServiceDemand = (data) =>
  request({
    url: '/api/service/demand/',
    method: 'POST',
    data,
  });

export const patchServiceDemand = (id, data) =>
  request({
    url: `/api/service/demand/${id}/`,
    method: 'PATCH',
    data,
  });

export const updateServiceDemand = (id, data) =>
  request({
    url: `/api/service/demand/${id}/`,
    method: 'PUT',
    data,
  });

export const setServiceDemandTags = (id, data) =>
  request({
    url: `/api/service/demand/${id}/set-tags/`,
    method: 'POST',
    data,
  });

export const addDemandImage = (id, file) => {
  const formData = new FormData();
  formData.append('demand', id);
  // formData.append('big_photo', file);
  // formData.append('small_photo', file);
  formData.append('image', file);
  return request({
    url: '/api/service/demand-image/',
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const publishServiceDemand = (id) =>
  request({
    url: `/api/service/demand/${id}/publish/`,
    method: 'POST',
  });

export const scheduleDemands = () =>
  request({
    url: '/api/user/demand/schedule/',
    method: 'GET',
  });
