import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchDemand } from '../actions/demand';

export const initialFetchState = {
  fetchedAt: null,
  onceFetched: false,
  fetching: false,
};

const reducer = mapHandleActions(
  {
    [fetchDemand.TRIGGER]: (state, action) => ({
      ...state,
      demand: action.payload.demandId,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchDemand.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [fetchDemand.SUCCESS]: (state, action) => ({
      ...state,
      demand: action.payload.demandId,
      fetchedAt: action.payload.fetchedAt,
    }),
    [fetchDemand.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchDemand.FULFILL]: (state) => ({
      ...state,
      fetching: false,
    }),
  },
  initialFetchState,
  (action) => action.payload.demandId,
);

export default reducer;
