import { createAction } from 'redux-actions';
import { createRoutine, promisifyRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';
import { expertise as expertiseSchema } from '@/schema';

import notification from '@feat/feat-ui/lib/notification';

import ApiError from '@/errors/ApiError';

import {
  fetchUserAddresses as fetchUserAddressesRequest,
  getExpertises as getExpertisesRequest,
  // postUserAddress as postUserAddressRequest,
  // deleteUserAddress as deleteUserAddressRequest,
} from '@/client/user';

import { fetchUserPaymentSettings as fetchUserPaymentSettingsRequest } from '@/client/commerce';

import { selectUserCommerceInfo } from '../selectors';

const NS = `COMMERCE/USER`;

export const fetchUserAddresses = createRoutine(`${NS}/FETCH_USER_ADDRESSES`);
export const postUserAddress = createRoutine(`${NS}/POST_USER_ADDRESS`);
export const postUserAddressPromiseCreator = promisifyRoutine(postUserAddress);
export const deleteUserAddress = createRoutine(`${NS}/DELETE_USER_ADDRESS`);
export const setDefaultAddress = createRoutine(`${NS}/SET_DEFAULT_ADDRESS`);

export const getCurrentLocation = createRoutine(`${NS}/GET_CURRENT_LOCATION`);
export const setGeoLocation = createAction(`${NS}/SET_GEO_LOCATION`);
export const fetchGeocode = createRoutine(`${NS}/FETCH_GEO_CODE`);
export const fetchGeocodePromiseCreator = promisifyRoutine(fetchGeocode);
export const fetchUserPaymentSettings = createRoutine(
  `${NS}/FETCH_PAYMENT_SETTINGS`,
);
export const fetchUserExpertises = createRoutine(`${NS}/FETCH_USER_EXPERTISES`);
export const userInfoForBidding = createRoutine(`${NS}/USER_INFO_FOR_BIDDING`);

export const asyncFetchUserAddresses = () => async (dispatch, getState) => {
  const userCommerceInfo = selectUserCommerceInfo(getState());
  if (userCommerceInfo.isFetchingUserAddresses) {
    return;
  }
  try {
    dispatch(fetchUserAddresses.request());
    // const addresses = demoAddresses;
    const { data: addresses } = await fetchUserAddressesRequest();
    dispatch(fetchUserAddresses.success(addresses));
  } catch (err) {
    dispatch(
      fetchUserAddresses.failure({
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchUserAddresses.fulfill());
  }
};

export const asyncFetchUserExpertises = () => async (dispatch, getState) => {
  const userCommerceInfo = selectUserCommerceInfo(getState());
  if (userCommerceInfo.isFetchingUserExpertises) {
    return;
  }
  try {
    dispatch(fetchUserExpertises.request());
    // const addresses = demoAddresses;
    const { data } = await getExpertisesRequest();
    const normalized = normalize(data, [expertiseSchema]);
    dispatch(
      fetchUserExpertises.success({
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchUserExpertises.failure({
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchUserExpertises.fulfill());
  }
};

export const asyncUserInfoForBidding = () => async (dispatch, getState) => {
  const userCommerceInfo = selectUserCommerceInfo(getState());

  try {
    // fetch addresses
    if (!userCommerceInfo.addresses) {
      await dispatch(asyncFetchUserAddresses());
    }

    // fetch expertises
    if (!userCommerceInfo.expertises) {
      await dispatch(asyncFetchUserExpertises());
    }
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    notification.error({
      message: 'Error',
      description: err.message,
    });
  }
};

export const asyncFetchUserPaymentSettings = () => async (
  dispatch,
  // getState,
) => {
  // const userCommerceInfo = selectUserCommerceInfo(getState());
  try {
    const { data } = await fetchUserPaymentSettingsRequest();
    dispatch(fetchUserPaymentSettings.success(data));
  } catch (err) {
    logging.error(err);
    dispatch(fetchUserPaymentSettings.failure(err));
  } finally {
    dispatch(fetchUserPaymentSettings.fulfill());
  }
};
