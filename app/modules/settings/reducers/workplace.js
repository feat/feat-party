import { handleActions, combineActions } from 'redux-actions';
import { fetchWorkplace } from '../actions/commerce';
import { fetchUserInfo } from '../actions';

export const initialState = {
  onceFetched: false,
  fetchError: null,
  loading: false,
}

export default handleActions({
  [combineActions(fetchUserInfo.TRIGGER, fetchWorkplace.TRIGGER)]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [combineActions(fetchUserInfo.REQUEST, fetchWorkplace.REQUEST)]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(fetchUserInfo.FAILURE, fetchWorkplace.FAILURE)]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [combineActions(fetchUserInfo.FULFILL, fetchWorkplace.FULFILL)]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUserInfo.SUCCESS]: (state) => ({
    ...state,
    onceFetched: true,
  }),
}, initialState)