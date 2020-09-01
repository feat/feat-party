import { handleActions, combineActions } from 'redux-actions';
import { fetchEducations } from '../actions/education';
import { fetchUserInfo } from '../actions';

export const initialState = {
  onceFetched: false,
  fetchError: null,
}

export default handleActions({
  [combineActions(fetchUserInfo.TRIGGER, fetchEducations.TRIGGER)]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [combineActions(fetchUserInfo.REQUEST, fetchEducations.REQUEST)]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(fetchUserInfo.FAILURE, fetchEducations.FAILURE)]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [combineActions(fetchUserInfo.FULFILL, fetchEducations.FULFILL)]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUserInfo.SUCCESS]: (state) => ({
    ...state,
    onceFetched: true,
  }),
}, initialState)