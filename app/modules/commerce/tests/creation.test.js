import {
  initOrderCreation,
  exitOrderCreation,
  setOrderReservation,
  createOrder,
  fetchFreePeriods,
  setOrderAddress,
  submitAddressForm,
} from '../actions/creation';

import { initOrderPayment } from '../actions/payment';

import creationReducer, { getBlockKey } from '../reducers/creation';

import {
  SERVICE_TYPE_ONLINE,
  SERVICE_TYPE_ON_SITE,
  // SERVICE_TYPE_WORKPLACE,
  ORDER_STEP_SELECT_TIME,
  // ORDER_STEP_REVIEW_INFO,
  // ORDER_STEP_CREATED,
  // ORDER_STEP_PAID,
  ORDER_STEP_SELECT_ADDRESS,
} from '../constants';

// state: { expertise, serviceItem, isRequestingFreePeriod, freePeriods, isCreatingPreviewOrder, isCreatingOrder, previewOrderParams }
const EXPERTISE_ID = 1;
const SERVICE_ITEM_ID = 2;

describe('Exc -- Order Creation', () => {
  describe('Online flow', () => {
    let state;

    it('init order creation', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
        expertise: { id: EXPERTISE_ID, name: 'Expertise' },
        serviceItem: {
          id: SERVICE_ITEM_ID,
          type: SERVICE_TYPE_ONLINE,
          price: 200,
          unit: 0,
        },
      };
      const action = initOrderCreation(payload);
      state = creationReducer(undefined, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState).toBeTruthy();
      expect(blockState.expertiseId).toEqual(EXPERTISE_ID);
      expect(blockState.serviceType).toEqual(SERVICE_TYPE_ONLINE);
      expect(blockState.expertise).toEqual({
        id: EXPERTISE_ID,
        name: 'Expertise',
      });
      expect(blockState.serviceItem).toEqual({
        id: SERVICE_ITEM_ID,
        type: SERVICE_TYPE_ONLINE,
        price: 200,
        unit: 0,
      });
      expect(blockState.step).toEqual(ORDER_STEP_SELECT_TIME);
    });

    describe('select reservation', () => {
      it('trigger', () => {
        const period = { a: 1, b: 2 };
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
          data: period,
        };
        const action = setOrderReservation(payload);
        state = creationReducer(undefined, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.reservation).toBe(period);
      });

      it('request', () => {
        const period = { a: 1, b: 2 };
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
          data: period,
        };
        const action = setOrderReservation.request(payload);
        state = creationReducer(undefined, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.isCreatingReservation).toBe(true);
      });

      it('fulfill', () => {
        const period = { a: 1, b: 2 };
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
          data: period,
        };
        const action = setOrderReservation.fulfill(payload);
        state = creationReducer(undefined, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.isCreatingReservation).toBe(false);
      });
    });

    describe('create order', () => {
      it('request', () => {
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
          data: {
            expertise_id: EXPERTISE_ID,
            service_item_id: SERVICE_ITEM_ID,
            start_time: 1,
            end_timd: 1,
          },
        };
        const action = createOrder.request(payload);
        state = creationReducer(state, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.isCreatingOrder).toBe(true);
      });
      it('success', () => {
        const order = {};
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
          data: order,
        };
        const action = createOrder.success(payload);
        state = creationReducer(undefined, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.order).toBe(order);
      });
      it('failure', () => {
        const error = new Error('Failed to Create review Order');
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
          data: error,
        };
        const action = createOrder.failure(payload);
        const failureState = creationReducer(state, action);
        const blockKey = getBlockKey(payload);
        const blockState = failureState[blockKey];
        expect(blockState.createOrderError).toBe(error);
      });
      it('fulfill', () => {
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ONLINE,
        };
        const action = createOrder.failure(payload);
        state = creationReducer(state, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.isCreatingOrder).toBe(false);
      });
    });

    it('exit order creation', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
      };
      const action = exitOrderCreation(payload);
      const exitState = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = exitState[blockKey];
      expect(blockState).toBeFalsy();
    });

    it('init payment', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
      };
      const action = initOrderPayment(payload);
      const initPaymentState = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = initPaymentState[blockKey];
      expect(blockState).toBeFalsy();
    });
  });

  describe('Onsite Flow', () => {
    let state;
    it('init order creation', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ON_SITE,
      };
      const action = initOrderCreation(payload);
      state = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.step).toBe(ORDER_STEP_SELECT_ADDRESS);
    });

    describe('select address', () => {
      it('request', () => {
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ON_SITE,
        };
        const action = setOrderAddress.request(payload);
        state = creationReducer(state, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.isSettingAddress).toBe(true);
      });
      it('success', () => {
        const address = {};
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ON_SITE,
          data: address,
        };
        const action = setOrderAddress.success(payload);
        state = creationReducer(state, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.address).toBe(address);
      });
      it('fulfill', () => {
        const payload = {
          expertiseId: EXPERTISE_ID,
          serviceType: SERVICE_TYPE_ON_SITE,
        };
        const action = setOrderAddress.fulfill(payload);
        state = creationReducer(state, action);
        const blockKey = getBlockKey(payload);
        const blockState = state[blockKey];
        expect(blockState.isSettingAddress).toBe(false);
      });
    });

    it('select reservation', () => {});

    describe('create preivew order', () => {});

    describe('create order', () => {});
  });

  describe('fetch free periods', () => {
    let state;
    state = creationReducer(
      undefined,
      initOrderCreation({
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
      }),
    );
    it('request', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
        data: {
          rangeStart: 0,
          rangeEnd: 100,
        },
      };
      const action = fetchFreePeriods.request(payload);
      state = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isFetchingFreePeriods).toBe(true);
    });

    it('success', () => {
      const periods = [{ start: 123, end: 123 }];
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
        params: {
          rangeStart: 0,
          rangeEnd: 100,
        },
        data: periods,
      };
      const action = fetchFreePeriods.success(payload);
      state = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.freePeriods).toEqual(periods);
    });

    // failure should handle globally.

    it('fulfill', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ONLINE,
        data: {
          rangeStart: 0,
          rangeEnd: 100,
        },
      };
      const action = fetchFreePeriods.fulfill(payload);
      state = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isFetchingFreePeriods).toBe(false);
    });
  });

  describe('Submit Address Form', () => {
    let state;
    const initAction = initOrderCreation({
      expertiseId: EXPERTISE_ID,
      serviceType: SERVICE_TYPE_ON_SITE,
    });
    state = creationReducer(state, initAction);
    it('request', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ON_SITE,
      };
      const action = submitAddressForm.request(payload);
      state = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isSubmittingAddressForm).toBe(true);
    });
    it('fulfill', () => {
      const payload = {
        expertiseId: EXPERTISE_ID,
        serviceType: SERVICE_TYPE_ON_SITE,
      };
      const action = submitAddressForm.fulfill(payload);
      state = creationReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isSubmittingAddressForm).toBe(false);
    });
  });
});
