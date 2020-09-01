import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';

import {
  serviceOrder as serviceOrderSchema,
  serviceDemand as serviceDemandSchema,
  expertise as expertiseSchema,
} from '@/schema';
import { selectEntities } from '@/modules/entity/selectors';

import tryToGetKey from '@/utils/tryToGetKey';

import { REDUCER_KEY } from './reducers';
import { getBlockKey, initialCreationState } from './reducers/creation';
import { initialPaymentState } from './reducers/payment';
import { initialFetchState as initialDemandFetchState } from './reducers/demand';
import { initialFetchState as initialOrderFetchState } from './reducers/order';

import { getListKey as getPurchaseListKey } from './reducers/purchase-dash';
import { getListKey as getSalesListKey } from './reducers/sales-dash';
import { getListKey as getDemandListKey } from './reducers/demand-dash';
import { getListKey as getOpportunityListKey } from './reducers/opportunity-dash';

export const selectCommerceUiState = (state) => get(state, [REDUCER_KEY, 'ui']);

export const selectOrderCreationState = (state, props) => {
  const blockKey = getBlockKey(props);
  return get(state, [REDUCER_KEY, 'creation', blockKey], initialCreationState);
};

export const selectOrderPaymentState = (state, props) =>
  get(
    state,
    [REDUCER_KEY, 'payment', String(props.orderId)],
    initialPaymentState,
  );

export const selectUserCommerceInfo = (state) =>
  get(state, [REDUCER_KEY, 'user']);

export const selectUserCommerceInfoState = createSelector(
  selectUserCommerceInfo,
  selectEntities,
  (state, entityMap) =>
    denormalize(
      state,
      {
        expertises: [expertiseSchema],
      },
      entityMap,
    ),
);

export const selectPostedAddress = (state) => {
  const userInfo = selectUserCommerceInfo(state);
  return userInfo.postedAddress;
};


export const selectPurchaseList = createSelector(
  (state, props) => {
    const listKey = getPurchaseListKey(props);
    return get(state, [REDUCER_KEY, 'purchaseDash', 'lists', listKey]);
  },
  selectEntities,
  (state, entityMap) => {
    if (!state) {
      return state;
    }
    const items = denormalize(state.items, [serviceOrderSchema], entityMap);
    return {
      ...state,
      items,
    };
  },
);

export const selectSalesList = createSelector(
  (state, props) => {
    const listKey = getSalesListKey(props);
    return get(state, [REDUCER_KEY, 'salesDash', 'lists', listKey])
  },
  selectEntities,
  (state, entityMap) => {
    if (!state) {
      return state;
    }
    const items = denormalize(state.items, [serviceOrderSchema], entityMap);
    return {
      ...state,
      items,
    };
  },
);

/**
 * Demand Dash
 */
export const selectDemandList = createSelector(
  (state, props) => {
    const listKey = getDemandListKey(props);
    return get(state, [REDUCER_KEY, 'demandDash', 'lists', listKey]);
  },
  selectEntities,
  (state, entityMap) => {
    if (!state) {
      return state;
    }
    const items = denormalize(state.items, [serviceDemandSchema], entityMap);
    return {
      ...state,
      items,
    };
  },
);

/**
 * Opportunity Dash
 */
export const selectOpportunityList = createSelector(
  (state, props) => {
    const listKey = getOpportunityListKey(props);
    return get(state, [REDUCER_KEY, 'opportunityDash', 'lists', listKey]);
  },
  selectEntities,
  (state, entityMap) => {
    if (!state) {
      return state;
    }
    const items = denormalize(state.items, [serviceDemandSchema], entityMap);
    return {
      ...state,
      items,
    };
  },
);

export const selectOrderInfo = (state, orderId) =>
  get(state, ['entities', serviceOrderSchema.key, String(orderId)]);

export const selectUserExpertises = createSelector(
  (state) => selectUserCommerceInfo(state).expertises,
  selectEntities,
  (list, entityMap) => {
    if (!list) {
      return {
        expertises: list,
      };
    }
    return {
      expertises: denormalize(list, [expertiseSchema], entityMap),
    };
  },
);

export const selectDemandDetailState = createSelector(
  (state, props) => {
    const demandId = tryToGetKey(props, 'demandId');
    return get(
      state,
      [REDUCER_KEY, 'demand', demandId],
      initialDemandFetchState,
    );
  },
  selectEntities,
  (subState, entityMap) =>
    denormalize(subState, { demand: serviceDemandSchema }, entityMap),
);

export const selectOrderDetailState = createSelector(
  (state, props) => {
    const orderId = tryToGetKey(props, 'orderId');
    return get(state, [REDUCER_KEY, 'order', orderId], initialOrderFetchState);
  },
  selectEntities,
  (subState, entityMap) =>
    denormalize(subState, { order: serviceOrderSchema }, entityMap),
);

export const selectDashState = (state) => get(state, [REDUCER_KEY, 'dash'])