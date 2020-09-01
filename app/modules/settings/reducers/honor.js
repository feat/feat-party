import { handleActions, combineActions } from 'redux-actions';
import { fetchHonors } from '../actions/honor';
import { fetchUserInfo } from '../actions';

export const initialState = {
  onceFetched: false,
  fetchError: null,
}

export default handleActions({
  [combineActions(fetchUserInfo.TRIGGER, fetchHonors.TRIGGER)]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [combineActions(fetchUserInfo.REQUEST, fetchHonors.REQUEST)]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(fetchUserInfo.FAILURE, fetchHonors.FAILURE)]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [combineActions(fetchUserInfo.FULFILL, fetchHonors.FULFILL)]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUserInfo.SUCCESS]: (state) => ({
    ...state,
    onceFetched: true,
  }),
}, initialState)