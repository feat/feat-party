import { initOrderCreation, exitOrderCreation } from '../actions/creation';
import { initOrderPayment, exitOrderPayment } from '../actions/payment';

import uiReducer from '../reducers/ui';

describe('Commerce UI', () => {
  describe('Order creation', () => {
    let state;
    it('init', () => {
      const action = initOrderCreation({
        expertiseId: 1,
        serviceType: 200,
      });
      state = uiReducer(undefined, action);
      expect(state.isOrderCreationPanelOpened).toBe(true);
      expect(state.creationExpertiseId).toEqual(1);
      expect(state.creationServiceType).toEqual(200);
    });
    it('exit', () => {
      const action = exitOrderCreation({
        expertiseId: 1,
        serviceType: 200,
      });
      const exitState = uiReducer(state, action);
      expect(exitState.isOrderCreationPanelOpened).toBe(false);
      expect(exitState.creationExpertiseId).toBeFalsy();
      expect(exitState.creationServiceType).toBeFalsy();
    });
    it('init order payment', () => {
      const action = initOrderPayment({
        expertiseId: 1,
        serviceType: 200,
        orderId: 1,
      });
      const initPaymentState = uiReducer(state, action);
      expect(initPaymentState.isOrderCreationPanelOpened).toBe(false);

      expect(initPaymentState.creationExpertiseId).toBeFalsy();
      expect(initPaymentState.creationServiceType).toBeFalsy();

      expect(initPaymentState.isOrderPaymentPanelOpened).toBe(true);
      expect(initPaymentState.orderPaymentTarget).toBe(1);
    });
  });

  describe('payment', () => {
    let state;
    const ORDER_ID = 'ORDER_ID';

    it('init payment', () => {
      const order = { id: ORDER_ID };
      const action = initOrderPayment({
        orderId: ORDER_ID,
        data: order,
        trigger: 'payment',
      });
      state = uiReducer(state, action);
      expect(state.isOrderPaymentPanelOpened).toBe(true);
      expect(state.orderPaymentTarget).toEqual(ORDER_ID);
    });

    it('exit payment', () => {
      const action = exitOrderPayment({
        orderId: ORDER_ID,
      });
      state = uiReducer(state, action);
      expect(state.isOrderPaymentPanelOpened).toBe(false);
      expect(state.orderPaymentTarget).toBeFalsy();
    });
  });
});
