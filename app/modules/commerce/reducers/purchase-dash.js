import { combineReducers } from 'redux'
import { stringify } from 'query-string';
import uniq from 'lodash/uniq';

import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchPurchaseOrders } from '../actions/purchase';
import { orderUpdated } from '../actions/order';

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
    [fetchPurchaseOrders.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchPurchaseOrders.REQUEST]: (state) => ({
      ...state,
      isFetching: true,
    }),
    [fetchPurchaseOrders.SUCCESS]: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        items: uniq([...state.items, ...data.list]),
        next: data.next,
        count: data.total_count,
      };
    },
    [fetchPurchaseOrders.FULFILL]: (state) => ({
      ...state,
      isFetching: false,
    }),
    [orderUpdated]: (state, action) => {
      const { orderId, isPurchase } = action.payload;
      if (!isPurchase || !state) {
        return state;
      }
      return {
        ...state,
        items: uniq([orderId, ...state.items]).sort((a, b) => b - a), // 最新的订单在前
      };
    },
  },
  initialListState,
  (action) => {
    const { search, sortField, order } = action.payload;
    return getListKey({ search, sortField, order });
  },
);

export default combineReducers({
  lists: listReducer,
})

// export const initialState = {
//   brief: {},
//   isFetchingBriefInfo: false,
//   ui: {
//     pageSize: 15,
//     page: 1,
//     search: '',
//     sortField: 'id',
//     order: 'asc',
//   },
//   lists: {}, // [queryKey]: { items: [], next, count }
// };

// const reducer = handleActions(
//   {
//     [fetchPurchaseOrders.TRIGGER]: (state, action) => {
//       const { payload } = action;
//       const listKey = getListKey(payload);
//       return update(state, {
//         lists: {
//           [listKey]: {
//             $apply: (listState = initialListState) => ({
//               ...listState,
//               onceFetched: true,
//               fetchError: null,
//             }),
//           },
//         },
//       });
//     },
//     [fetchPurchaseOrders.REQUEST]: (state, action) => {
//       const { payload } = action;
//       const listKey = getListKey(payload);
//       return update(state, {
//         lists: {
//           [listKey]: {
//             $apply: (listState = initialListState) => ({
//               ...listState,
//               isFetching: true,
//             }),
//           },
//         },
//       });
//     },
//     [fetchPurchaseOrders.SUCCESS]: (state, action) => {
//       const {
//         payload: { data, params },
//       } = action;
//       const listKey = getListKey(params);
//       return update(state, {
//         lists: {
//           [listKey]: {
//             $apply: (listState = initialListState) => ({
//               items: uniq([...listState.items, ...data.list]),
//               next: data.next,
//               count: data.total_count,
//             }),
//           },
//         },
//       });
//     },
//     [fetchPurchaseOrders.FULFILL]: (state, action) => {
//       const { payload } = action;
//       const listKey = getListKey(payload);
//       return update(state, {
//         lists: {
//           [listKey]: {
//             $apply: (listState = initialListState) => ({
//               ...listState,
//               isFetching: false,
//             }),
//           },
//         },
//       });
//     },
//     [fetchPurchaseBriefInfo.REQUEST]: (state) => ({
//       ...state,
//       isFetchingBriefInfo: true,
//     }),

//     [fetchPurchaseBriefInfo.SUCCESS]: (state, action) => ({
//       ...state,
//       brief: action.payload,
//     }),

//     [fetchPurchaseBriefInfo.FULFILL]: (state) => ({
//       ...state,
//       isFetchingBriefInfo: false,
//     }),

//     [markPurchaseOrderUpdateAsRead.SUCCESS]: (state) => ({
//       ...state,
//       brief: {
//         ...state.brief,
//         updateCount: Math.max(state.brief.updateCount - 1, 0),
//       },
//     }),

//     [fetchDashBriefInfo.SUCCESS]: (state, action) => ({
//       ...state,
//       brief: {
//         ...state.brief,
//         updateCount: action.payload.updatedPurchaseOrders,
//       },
//     }),
//     [orderUpdated]: (state, action) => {
//       const { payload } = action;
//       const listKey = getListKey(initialState.ui);
//       if (!payload.isPurchase) {
//         return state;
//       }
//       const listState = state.lists[listKey];
//       if (!listState) {
//         return state;
//       }

//       return update(state, {
//         lists: {
//           [listKey]: {
//             items: {
//               $apply: (list) =>
//                 uniq([payload.orderId, ...list].sort((a, b) => b - a)),
//             },
//           },
//         },
//       });
//     },
//   },
//   initialState,
// );

// export default reducer;
