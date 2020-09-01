import { handleActions } from 'redux-actions';
import { 
  fetchUserSecurityInfo, 
  updateUserSecurityInfo,
} from '../actions/security';

export const initialState = {
  onceFetched: false,
  fetchError: null,
}

export default handleActions({
  [fetchUserSecurityInfo.TRIGGER]: (state) => ({
    ...state,
    onceFetched: true,
    fetchError: false,
  }),
  [fetchUserSecurityInfo.REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [fetchUserSecurityInfo.SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
  [fetchUserSecurityInfo.FAILURE]: (state, action) => ({
    ...state,
    fetchError: action.payload,
  }),
  [fetchUserSecurityInfo.FULFILL]: (state) => ({
    ...state,
    loading: false,
  }),
  [updateUserSecurityInfo.SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
}, initialState)