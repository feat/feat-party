import { combineReducers } from 'redux';
import { stringify } from 'query-string';
import uniq from 'lodash/uniq';

import { mapHandleActions } from '@/utils/reducerCreators';
import {
  fetchOpportunities,
} from '../actions/opportunity-dash';
import { postBid } from '../actions/opportunity';

export const getListKey = ({ search, sortField, order, type }) =>
  stringify({ search, sortField, order, type });

export const initialListState = {
  items: [],
  next: null,
  count: null,
  isFetching: false,
  fetchError: null,
  onceFetched: true,
};

const listReducer = mapHandleActions(
  {
    [fetchOpportunities.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchOpportunities.REQUEST]: (state) => ({
      ...state,
      isFetching: true,
    }),
    [fetchOpportunities.SUCCESS]: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        items: uniq([...state.items, ...data.list]),
        next: data.next,
        count: data.total_count,
      }
    },
    [fetchOpportunities.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchOpportunities.FULFILL]: (state) => ({
      ...state,
      isFetching: false,
    }),
    [postBid.SUCCESS]: (state, action) => {
      if (!state) {
        return state;
      }
      return {
        ...state,
        items: uniq([action.payload.demandId, ...state.items]),
      }
    },
  },
  initialListState,
  (action) => {
    if (action.type === postBid.SUCCESS) {
      return getListKey({ type: 'participated' });
    }
    return getListKey(action.payload)
  }
);

export default combineReducers({
  lists: listReducer,
})

// const initialState = {
//   brief: null,
//   isFetchingBriefInfo: false,
//   ui: {
//     pageSize: 15,
//     page: 1,
//     search: '',
//     sortField: 'id',
//     order: 'asc',
//     type: 'new', // new | participated
//   },
//   lists: {}, // [queryKey]: { items: [], next, count }
//   meta: {}, // request info
// };

// const reducer = handleActions(
//   {
//     [fetchOpportunities.TRIGGER]: (state, action) => {
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
//     [fetchOpportunities.REQUEST]: (state, action) => {
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
//     [fetchOpportunities.SUCCESS]: (state, action) => {
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
//     [fetchOpportunities.FULFILL]: (state, action) => {
//       const { payload } = action;
//       const listKey = getListKey(payload);
//       return update(state, {
//         lists: {
//           [listKey]: {
//             $apply: (listState = initialListState) => ({
//               ...listState,
//               isFetching: false,
//               onceFetched: true,
//             }),
//           },
//         },
//       });
//     },
//     [fetchBriefInfo.REQUEST]: (state) => ({
//       ...state,
//       isFetchingBriefInfo: true,
//     }),

//     [fetchBriefInfo.SUCCESS]: (state, action) => ({
//       ...state,
//       brief: action.payload,
//     }),

//     [fetchBriefInfo.FULFILL]: (state) => ({
//       ...state,
//       isFetchingBriefInfo: false,
//     }),

//     [setListType]: (state, action) => ({
//       ...state,
//       ui: {
//         ...state.ui,
//         type: action.payload,
//       },
//     }),

//     [abandonDemand.REQUEST]: (state, action) =>
//       update(state, {
//         meta: {
//           [action.payload.demandId]: {
//             $apply: (meta = {}) => ({
//               ...meta,
//               isAbandoning: true,
//             }),
//           },
//         },
//       }),
//     [abandonDemand.SUCCESS]: (state, action) =>
//       update(state, {
//         meta: {
//           [action.payload.demandId]: {
//             $apply: (meta = {}) => ({
//               ...meta,
//               hasAbandoned: true,
//             }),
//           },
//         },
//       }),
//     [abandonDemand.FULFILL]: (state, action) =>
//       update(state, {
//         meta: {
//           [action.payload.demandId]: {
//             $apply: (meta = {}) => ({
//               ...meta,
//               isAbandoning: false,
//             }),
//           },
//         },
//       }),

//     [ignoreDemand.REQUEST]: (state, action) =>
//       update(state, {
//         meta: {
//           [action.payload.demandId]: {
//             $apply: (meta = {}) => ({
//               ...meta,
//               isIgnoring: true,
//             }),
//           },
//         },
//       }),
//     [ignoreDemand.SUCCESS]: (state, action) =>
//       update(state, {
//         meta: {
//           [action.payload.demandId]: {
//             $apply: (meta = {}) => ({
//               ...meta,
//               hasIgnored: true,
//             }),
//           },
//         },
//       }),
//     [ignoreDemand.FULFILL]: (state, action) =>
//       update(state, {
//         meta: {
//           [action.payload.demandId]: {
//             $apply: (meta = {}) => ({
//               ...meta,
//               isIgnoring: false,
//             }),
//           },
//         },
//       }),
//   },
//   initialState,
// );

// export default reducer;
