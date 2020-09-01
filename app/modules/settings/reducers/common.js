import { handleActions } from 'redux-actions';
import { fetchUserInfo } from '../actions';

export const initialState = {
  onceFetched: false,
  fetchError: null,
}

export default handleActions({
  [fetchUserInfo.TRIGGER]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [fetchUserInfo.REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [fetchUserInfo.FAILURE]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [fetchUserInfo.FULFILL]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUserInfo.SUCCESS]: (state) => ({
    ...state,
    onceFetched: true,
  }),
}, initialState)