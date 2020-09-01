import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchOrderInfo } from '../actions/order';

export const initialFetchState = {
  fetchedAt: null,
  onceFetched: false,
  fetching: false,
};

const reducer = mapHandleActions(
  {
    [fetchOrderInfo.TRIGGER]: (state, action) => ({
      ...state,
      order: action.payload.orderId,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchOrderInfo.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [fetchOrderInfo.SUCCESS]: (state, action) => ({
      ...state,
      order: action.payload.orderId,
      fetchedAt: action.payload.fetchedAt,
    }),
    [fetchOrderInfo.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchOrderInfo.FULFILL]: (state) => ({
      ...state,
      fetching: false,
    }),
  },
  initialFetchState,
  (action) => action.payload.orderId,
);

export default reducer;
