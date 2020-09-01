import { handleActions, combineActions } from 'redux-actions';
import { fetchOpenTimes } from '../actions/commerce';
import { fetchUserInfo } from '../actions';

export const initialState = {
  onceFetched: false,
  fetchError: null,
}

export default handleActions({
  [combineActions(fetchUserInfo.TRIGGER, fetchOpenTimes.TRIGGER)]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [combineActions(fetchUserInfo.REQUEST, fetchOpenTimes.REQUEST)]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(fetchUserInfo.FAILURE, fetchOpenTimes.FAILURE)]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [combineActions(fetchUserInfo.FULFILL, fetchOpenTimes.FULFILL)]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUserInfo.SUCCESS]: (state) => ({
    ...state,
    onceFetched: true,
  }),
}, initialState)