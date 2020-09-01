import { handleActions, combineActions } from 'redux-actions';
import { fetchCareers } from '../actions/career';
import { fetchUserInfo } from '../actions';

export const initialState = {
  onceFetched: false,
  fetchError: null,
}

export default handleActions({
  [combineActions(fetchUserInfo.TRIGGER, fetchCareers.TRIGGER)]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [combineActions(fetchUserInfo.REQUEST, fetchCareers.REQUEST)]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(fetchUserInfo.FAILURE, fetchCareers.FAILURE)]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [combineActions(fetchUserInfo.FULFILL, fetchCareers.FULFILL)]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUserInfo.SUCCESS]: (state) => ({
    ...state,
    onceFetched: true,
  }),
}, initialState)