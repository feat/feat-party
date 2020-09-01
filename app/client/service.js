import request from '@/utils/request';

export const fetchDemands = (params) =>
  request({
    url: '/api/service/demand/',
    method: 'GET',
    params,
  });

export const fetchDemand = (id) =>
  request({
    url: `/api/service/demand/${id}/`,
    method: 'GET',
  });

export const createDemands = (data) =>
  request({
    url: '/api/service/demand/',
    method: 'POST',
    data,
  });

export const fetchOpportunities = (params) =>
  request({
    url: '/api/service/demand/opportunity/',
    method: 'GET',
    params,
  });
export const demandOpportunities = (params) =>
  request({
    url: '/api/service/demand/participated-list/',
    method: 'GET',
    params,
  });

export const getDemandBids = (id, params) =>
  request({
    url: `/api/service/demand/${id}/participants/`,
    method: 'GET',
    params,
  });

export const updateDemandStatus = (id, data) =>
  request({
    url: `/api/service/demand/${id}/update-status/`,
    method: 'POST',
    data,
  });

export const selectDemandWinner = (id, data) =>
  request({
    url: `/api/service/demand/${id}/select-winner/`,
    method: 'POST',
    data,
  });

export const createDemandBids = (id, data) =>
  request({
    url: `/api/service/demand/${id}/submit-bid/`,
    method: 'POST',
    data,
  });

export const selectDemandBid = selectDemandWinner;

export const blackUser = () => {
  logging.debug('// TODO');
};

export const responseDemand = (id, data) =>
  request({
    url: `/api/service/demand/${id}/response/`,
    method: 'POST',
    data,
  });

export const ignoreDemand = (id) => responseDemand(id, { action: 'ignore' });

export const abandonDemand = (id) => responseDemand(id, { action: 'abandon' });
