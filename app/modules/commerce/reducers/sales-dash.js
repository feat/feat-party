import { combineReducers } from 'redux'
import { stringify } from 'query-string';
import uniq from 'lodash/uniq';

import { mapHandleActions } from '@/utils/reducerCreators';

import {
  fetchSalesOrders,
} from '../actions/sales';

import { orderUpdated } from '../actions/order';
import { ORDER_STATUS_PAID } from '../constants';

export const getListKey = ({ search = '', sortField = 'id', order = 'desc' } = {}) =>
  stringify({ search, sortField, order });

export const initialListState = {
  items: [],
  next: null,
  count: null,
  isFetching: false,
  fetchError: null,
  onceFetched: false,
};

const listReducer = mapHandleActions(
  {
    [fetchSalesOrders.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchSalesOrders.REQUEST]: (state) => ({
      ...state,
      isFetching: true,
    }),
    [fetchSalesOrders.SUCCESS]: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        items: uniq([...state.items, ...data.list]),
        next: data.next,
        count: data.total_count,
      };
    },
    [fetchSalesOrders.FULFILL]: (state) => ({
      ...state,
      isFetching: false,
    }),
    [orderUpdated]: (state, action) => {
      const { orderId, isPurchase } = action.payload;
      const { payload } = action;
      if (isPurchase || !state) {
        return state;
      }

      const isNewOrder =
        (payload.info && payload.info.action === 'create') ||
        (payload.data.status === ORDER_STATUS_PAID &&
          state.items &&
          (state.items.length === 0 ||
            state.items.some((id) => id < payload.orderId)));

      
      if (!isNewOrder) {
        return state;
      }
      return {
        ...state,
        items: uniq([orderId, ...state.items]).sort((a, b) => b - a),
      }
    },
  },
  initialListState, 
  (action) => getListKey(action.payload)
)

export default combineReducers({
  lists: listReducer,
});

