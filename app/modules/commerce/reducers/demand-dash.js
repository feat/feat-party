import { combineReducers } from 'redux';
import { stringify } from 'query-string';
import uniq from 'lodash/uniq';
import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchDemands } from '../actions/demand-dash';
import { confirmDemandCreation } from '../actions/demand-creation';

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
    [fetchDemands.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchDemands.REQUEST]: (state) => ({
      ...state,
      isFetching: true,
    }),
    [fetchDemands.SUCCESS]: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        items: uniq([...state.items, ...data.list]),
        next: data.next,
        count: data.total_count,
      };
    },
    [fetchDemands.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchDemands.FULFILL]: (state) => ({
      ...state,
      isFetching: false,
    }),
    [confirmDemandCreation.SUCCESS]: (state, action) => {
      if (!state) {
        return state;
      }
      return {
        ...state,
        items: [
          action.payload.demandId,
          ...state.items,
        ],
      }
    },
  },
  initialListState,
  (action) => getListKey(action.payload)
);

export default combineReducers({
  lists: listReducer,
})

