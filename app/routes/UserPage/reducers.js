import { handleActions, combineActions } from 'redux-actions';

import { fetchuserLists } from './actions';

export const initialState = {
  userList: undefined,
};

export const REDUCER_KEY = 'userpages';

export default handleActions(
  {
    [fetchuserLists.SUCCESS]: (state, action) => {
      return {
        ...state,
        userList: action.payload.list,
      };
    },
  },
  initialState,
);
