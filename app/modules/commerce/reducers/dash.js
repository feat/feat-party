import { handleActions } from 'redux-actions';
import update from 'immutability-helper'
import { 
  fetchDashBriefInfo,
} from '../actions/common';
import {
  markSalesOrderUpdateAsRead,
} from '../actions/sales'
import {
  markPurchaseOrderUpdateAsRead,
} from '../actions/purchase';

const initialState = {
  fetchedAt: undefined,
};

const reducer = handleActions({
  [fetchDashBriefInfo.REQUEST]: (state) => ({
    ...state,
    fetching: true,
  }),
  [fetchDashBriefInfo.SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
  [markSalesOrderUpdateAsRead.SUCCESS]: (state) => update(state, {
    data: (data) => {
      if (!data) {
        return data;
      }
      return {
        ...data,
        sales_update_num: Math.max(data.sales_update_num - 1, 0),
      }
    },
  }),
  [markPurchaseOrderUpdateAsRead.SUCCESS]: (state) => update(state, {
    data: (data) => {
      if (!data) {
        return data;
      }
      return {
        ...data,
        purchase_update_num: Math.max(data.purchase_update_num - 1, 0),
      }
    },
  }),
}, initialState)

export default reducer;