import { createRoutine } from 'redux-saga-routines';
// import { normalize } from 'normalizr'

import {
  fetchUserPaymentSettings,
  deletePaymentAccount as deletePaymentAccountRequest,
  addPaymentAccount as addPaymentAccountRequest,
  setDefaultReceiptAccount as setDefaultReceiptAccountRequest,
  setDefaultPaymentAccount as setDefaultPaymentAccountRequest,
} from '@/client/commerce';

import { getPaymentSetting as getPaymentSettingRequest } from '@/client/pay';

export const NS = 'SETTINGS/PAYMENT';

export const fetchPaymentSettings = createRoutine(
  `${NS}/FETCH_PAYMENT_SETTINGS`,
);
export const fetchPaymentAccounts = createRoutine(
  `${NS}/FETCH_PAYMENT_ACCOUNTS`,
);
export const deletePaymentAccount = createRoutine(
  `${NS}/DELETE_PAYMENT_ACCOUNT`,
);
export const addPaymentAccount = createRoutine(`${NS}/ADD_PAYMENT_ACCOUNT`);
export const setDefaultReceiptAccount = createRoutine(
  `${NS}/SET_DEFAULT_RECEIPT_ACCOUNT`,
);
export const setDefaultPaymentAccount = createRoutine(
  `${NS}/SET_DEFAULT_PAYMENT_ACCOUNT`,
);

export const asyncFetchPaymentSettings = () => async (dispatch) => {
  dispatch(fetchPaymentSettings.trigger());
  try {
    dispatch(fetchPaymentSettings.request());
    const { data } = await getPaymentSettingRequest();
    dispatch(fetchPaymentSettings.success(data));
  } catch (err) {
    dispatch(fetchPaymentSettings.failure(err));
    throw err;
  } finally {
    dispatch(fetchPaymentSettings.fulfill());
  }
};

export const asyncFetchPaymentAccounts = () => async (dispatch) => {
  try {
    const { data } = await fetchUserPaymentSettings();
    dispatch(fetchPaymentAccounts.success(data));
  } catch (err) {
    dispatch(fetchPaymentAccounts.failure(err));
    throw err;
  } finally {
    dispatch(fetchPaymentAccounts.fulfill());
  }
};

export const asyncAddPaymentAccount = (payload) => async (dispatch) => {
  try {
    const { data } = await addPaymentAccountRequest(payload);
    dispatch(addPaymentAccount.success(data));
  } catch (err) {
    dispatch(addPaymentAccount.failure(err));
    throw err;
  } finally {
    dispatch(addPaymentAccount.fulfill());
  }
};

export const asyncDeletePaymentAccount = (payload) => async (dispatch) => {
  try {
    await deletePaymentAccountRequest(payload.id);
    // dispatch(addPaymentAccount.success(payload));
  } catch (err) {
    dispatch(addPaymentAccount.failure(err));

    throw err;
  } finally {
    dispatch(addPaymentAccount.fulfill());
  }
};

export const asyncSetDefaultReceiptAccount = (payload) => async (dispatch) => {
  try {
    const { data } = await setDefaultReceiptAccountRequest({
      account_id: payload.id,
    });
    dispatch(setDefaultReceiptAccount.success(data));
  } catch (err) {
    dispatch(setDefaultReceiptAccount.failure(err));

    throw err;
  } finally {
    dispatch(setDefaultReceiptAccount.fulfill());
  }
};

export const asyncSetDefaultPaymentAccount = (payload) => async (dispatch) => {
  try {
    const { data } = await setDefaultPaymentAccountRequest({
      account_id: payload.id,
    });
    dispatch(setDefaultPaymentAccount.success(data));
  } catch (err) {
    dispatch(setDefaultPaymentAccount.failure(err));

    throw err;
  } finally {
    dispatch(setDefaultPaymentAccount.fulfill());
  }
};
