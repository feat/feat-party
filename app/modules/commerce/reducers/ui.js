import { handleActions } from 'redux-actions';

import { initOrderCreation, exitOrderCreation } from '../actions/creation';
import { initOrderPayment, exitOrderPayment } from '../actions/payment';
import {
  initDemandCreation,
  exitDemandCreation,
} from '../actions/demand-creation';

const initialUiState = {
  isOrderCreationPanelOpened: false,
  isOrderPaymentPanelOpened: false,
};

const reducer = handleActions(
  {
    [initOrderCreation]: (state, action) => ({
      ...state,
      isOrderCreationPanelOpened: true,
      creationExpertiseId: action.payload.expertiseId,
      creationServiceType: action.payload.serviceType,
    }),
    [exitOrderCreation]: (state) => ({
      ...state,
      isOrderCreationPanelOpened: false,
      creationExpertiseId: undefined,
      creationServiceType: undefined,
    }),
    [initOrderPayment]: (state, action) => ({
      ...state,
      isOrderCreationPanelOpened: false,
      creationExpertiseId: undefined,
      creationServiceType: undefined,
      isOrderPaymentPanelOpened: true,
      orderPaymentTarget: action.payload.orderId,
    }),
    [exitOrderPayment]: (state) => ({
      ...state,
      isOrderPaymentPanelOpened: false,
      orderPaymentTarget: undefined,
    }),
    [initDemandCreation]: (state) => ({
      ...state,
      isDemandCreationPanelOpened: true,
    }),
    [exitDemandCreation]: (state) => ({
      ...state,
      isDemandCreationPanelOpened: false,
    }),
  },
  initialUiState,
);

export default reducer;
