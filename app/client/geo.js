import { CancelToken } from 'axios';
import request from '@/utils/request';

export const fetchGeocode = (data, cancel) =>
  request({
    url: '/api/geo/address-to-coordinate/',
    method: 'POST',
    data,
    cancelToken: cancel ? new CancelToken(cancel) : undefined,
  });

export const reverseGeocode = (data) =>
  request({
    url: '/api/geo/coordinate-to-address/',
    method: 'POST',
    data,
  });

/**
 *
 * @param {Object} data
 * @param {} data.input
 * @param {} data.language
 */
export const autoComplete = (data) =>
  request({
    url: '/api/geo/auto-complete/',
    method: 'POST',
    data,
  });

/**
 *
 * @param {Object} data
 * @param {} data.origin_coordinate
 * @param {} data.to_coordinate
 * @param {} data.language
 */
export const distance = (data) =>
  request({
    url: '/api/geo/distance/',
    method: 'POST',
    data,
  });

/**
 *
 * @param {Object} params
 * @param {} params.address_type
 * @param {} params.page
 */
export const getUserAddresses = (params) =>
  request({
    url: '/api/geo/user-address/',
    method: 'GET',
    params,
  });

export const deleteAddress = (id) =>
  request({
    url: `/api/geo/user-address/${id}/`,
    method: 'DELETE',
  });

// address_line,
// street,
// district,
// city,
// state,
// country,
// phone,
// contact_name,
// address_type,
// lng,
// lat
export const updateAddress = (id, data) =>
  request({
    url: `/api/geo/user-address/${id}/`,
    method: 'PATCH',
    data,
  });

// address_line,
// street,
// district,
// city,
// state,
// country,
// phone,
// contact_name,
// address_type,
// lng,
// lat
export const addUserAddress = (data) =>
  request({
    url: '/api/geo/user-address/',
    method: 'POST',
    data,
  });

export const getAddressById = (id) =>
  request({
    url: `/api/geo/user-address/${id}/`,
    method: 'GET',
  });

export const getLocationOptions = (params) =>
  request({
    url: '/api/geo/location/',
    method: 'GET',
    params,
  });

export const queryLocationElements = (params) =>
  request({
    url: '/api/v1/location-elements',
    method: 'GET',
    params,
  });

export const fetchDirection = (params) =>
  request({
    url: '/api/geo/direction/',
    method: 'GET',
    params,
  });

export const fetchDivision = (params) =>
  request({
    url: '/api/geo/location/get-division-list/',
    method: 'GET',
    params,
  });
