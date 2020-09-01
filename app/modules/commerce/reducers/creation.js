import { combineActions } from 'redux-actions';

import { mapHandleActions } from '@/utils/reducerCreators';

import {
  initOrderCreation,
  exitOrderCreation,
  setOrderReservation,
  createReviewOrder,
  fetchFreePeriods,
  createOrder,
  setCreationStep,
  setOrderAddress,
  submitAddressForm,
} from '../actions/creation';

import { initOrderPayment } from '../actions/payment';

import {
  SERVICE_TYPE_ON_SITE,
  ORDER_STEP_SELECT_TIME,
  ORDER_STEP_SELECT_ADDRESS,
} from '../constants';

export const initialCreationState = {
  expertiseId: undefined,
  serviceType: undefined,

  expertise: null,
  serviceItem: null,

  step: undefined,

  isFetchingFreePeriods: false,
  freePeriods: [],

  isCreatingReservation: false,
  reservation: null,

  isFetchingAddresses: false,
  address: null,

  isCreatingReviewOrder: false,
  reviewOrder: null,
  reviewOrderParams: null,
  createReviewOrderError: null,

  isCreatingOrder: false,
};

export function getBlockKey(payload) {
  const { expertiseId, serviceType } = payload;
  return `${expertiseId}-${serviceType}`;
}

const reducer = mapHandleActions(
  {
    [initOrderCreation]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        expertiseId: payload.expertiseId,
        serviceType: payload.serviceType,
        expertise: payload.expertise,
        serviceItem: payload.serviceItem,
        step:
          payload.serviceType === SERVICE_TYPE_ON_SITE
            ? ORDER_STEP_SELECT_ADDRESS
            : ORDER_STEP_SELECT_TIME,
      };
    },

    [setCreationStep]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        step: payload.data,
      };
    },

    [fetchFreePeriods.REQUEST]: (creationState) => ({
      ...creationState,
      isFetchingFreePeriods: true,
    }),

    [fetchFreePeriods.SUCCESS]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        freePeriods: payload.data,
      };
    },

    [fetchFreePeriods.FULFILL]: (creationState) => ({
      ...creationState,
      isFetchingFreePeriods: false,
    }),

    [setOrderAddress.REQUEST]: (creationState) => ({
      ...creationState,
      isSettingAddress: true,
    }),

    [setOrderAddress.SUCCESS]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        address: payload.data,
      };
    },

    [setOrderAddress.FULFILL]: (creationState) => ({
      ...creationState,
      isSettingAddress: false,
    }),

    [setOrderReservation]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        reservation: payload.data,
      };
    },
    [setOrderReservation.REQUEST]: (creationState) => ({
      ...creationState,
      isCreatingReservation: true,
    }),
    [setOrderReservation.FULFILL]: (creationState) => ({
      ...creationState,
      isCreatingReservation: false,
    }),
    [createReviewOrder.REQUEST]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        isCreatingReviewOrder: true,
        reviewOrderParams: payload.data,
        createReviewOrderError: null, // reset error
      };
    },

    [createReviewOrder.SUCCESS]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        reviewOrder: payload.data,
      };
    },

    [createReviewOrder.FAILURE]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        createReviewOrderError: payload.data,
      };
    },

    [createReviewOrder.FULFILL]: (creationState) => ({
      ...creationState,
      isCreatingReviewOrder: false,
    }),

    [createOrder.TRIGGER]: (creationState) => ({
      ...creationState,
      createOrderError: null,
    }),

    [createOrder.REQUEST]: (creationState) => ({
      ...creationState,
      isCreatingOrder: true,
    }),

    [createOrder.SUCCESS]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        order: payload.data,
      };
    },

    [createOrder.FAILURE]: (creationState, action) => {
      const { payload } = action;
      return {
        ...creationState,
        createOrderError: payload.data,
      };
    },

    [createOrder.FULFILL]: (creationState) => ({
      ...creationState,
      isCreatingOrder: false,
    }),

    [combineActions(exitOrderCreation, initOrderPayment)]: () => undefined,

    [submitAddressForm.REQUEST]: (creationState) => ({
      ...creationState,
      isSubmittingAddressForm: true,
    }),

    [submitAddressForm.FULFILL]: (creationState) => ({
      ...creationState,
      isSubmittingAddressForm: false,
    }),
  },
  initialCreationState,
  (action) => getBlockKey(action.payload),
);

export default reducer;
