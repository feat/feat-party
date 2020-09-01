import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchTerm } from './actions';

export const initialState = {
  onceFetched: false,
  fetching: false,
  data: null,
  fetchError: null,
};
const keyExtractor = (action) => action.payload.slug;

export const REDUCER_KEY = 'terms';

export default mapHandleActions(
  {
    [fetchTerm.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchTerm.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [fetchTerm.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
    }),
    [fetchTerm.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchTerm.FULFILL]: (state) => ({
      ...state,
      fetching: false,
    }),
  },
  initialState,
  keyExtractor,
);
