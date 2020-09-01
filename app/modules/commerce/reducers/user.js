import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import {
  fetchUserAddresses,
  postUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  fetchUserPaymentSettings,
  getCurrentLocation,
  setGeoLocation,
  fetchUserExpertises,
} from '../actions/user';

export const initialUserState = {
  addresses: null,
  isFetchingUserAddresses: false,
  deletingAddress: {},
  expertises: null,
  isFetchingUserExpertises: false,
};

const reducer = handleActions(
  {
    [fetchUserAddresses.REQUEST]: (state) => ({
      ...state,
      isFetchingUserAddresses: true,
    }),
    [fetchUserAddresses.SUCCESS]: (state, action) => ({
      ...state,
      addresses: action.payload,
    }),
    [fetchUserAddresses.FULFILL]: (state) => ({
      ...state,
      isFetchingUserAddresses: false,
      userAddressesFetched: true,
    }),
    [postUserAddress.SUCCESS]: (state, action) => ({
      ...state,
      addresses: [...(state.addresses || []), action.payload],
      postedAddress: action.payload,
    }),
    [postUserAddress.FAILURE]: (state, action) => {
      const { payload } = action;
      if (payload.message === 'GEOCODING_FAILED') {
        return {
          ...state,
          shouldDisplayPinPanel: true,
          initialBounds: payload.data,
        };
      }
      return state;
    },
    [deleteUserAddress.REQUEST]: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        deletingAddress: {
          ...state.deletingAddress,
          [payload.addressId]: true,
        },
      };
    },
    [deleteUserAddress.SUCCESS]: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        addresses: state.addresses.filter(
          (item) => item.id !== payload.addressId,
        ),
      };
    },
    [deleteUserAddress.FULFILL]: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        deletingAddress: {
          ...state.deletingAddress,
          [payload.addressId]: false,
        },
      };
    },
    [setDefaultAddress.SUCCESS]: (state, action) => {
      const { payload } = action;
      return update(state, {
        addresses: (list) => list.map((item) => item.id === payload.id ? payload : {
          ...item,
          is_default: false,
        }),
      })
    },
    [fetchUserPaymentSettings.REQUEST]: (state) => ({
      ...state,
      isFetchingUserPaymentSettings: true,
    }),
    [fetchUserPaymentSettings.SUCCESS]: (state, action) => ({
      ...state,
      paymentSettings: action.payload,
    }),
    [fetchUserPaymentSettings.FULFILL]: (state) => ({
      ...state,
      isFetchingUserPaymentSettings: false,
    }),
    [getCurrentLocation.REQUEST]: (state) => ({
      ...state,
      isGettingCurrentLocation: true,
    }),
    [getCurrentLocation.TRIGGER]: (state) => ({
      ...state,
      getCurrentLocationError: null,
    }),
    [getCurrentLocation.SUCCESS]: (state, action) => ({
      ...state,
      currentLocation: action.payload,
    }),
    [getCurrentLocation.FAILURE]: (state, action) => ({
      ...state,
      getCurrentLocationError: action.payload,
    }),
    [getCurrentLocation.FULFILL]: (state) => ({
      ...state,
      isGettingCurrentLocation: false,
    }),
    [setGeoLocation]: (state, action) => ({
      ...state,
      geoLocation: action.payload,
    }),
    [fetchUserExpertises.REQUEST]: (state) => ({
      ...state,
      isFetchingUserExpertises: true,
    }),
    [fetchUserExpertises.SUCCESS]: (state, action) => ({
      ...state,
      expertises: action.payload.list,
    }),
    [fetchUserExpertises.FULFILL]: (state) => ({
      ...state,
      isFetchingUserExpertises: false,
    }),
  },
  initialUserState,
);

export default reducer;
