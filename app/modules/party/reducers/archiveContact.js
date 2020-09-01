import { handleActions, combineActions } from 'redux-actions';
import {
  getArchiveContacts,
  createGroup,
  addContact,
  blackUser,
  addTempContact,
} from '../actions';

const initialState = {
  initFetched: false,
  fetching: false,
  shouldRefresh: false,
  list: [],
  error: null,
};

const reducer = handleActions(
  {
    [getArchiveContacts.TRIGGER]: (state) => ({
      ...state,
      shouldRefresh: false,
      error: null,
    }),
    [getArchiveContacts.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [getArchiveContacts.SUCCESS]: (state, action) => ({
      ...state,
      list: action.payload.list,
    }),
    [getArchiveContacts.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload,
    }),
    [getArchiveContacts.FULFILL]: (state) => ({
      ...state,
      fetching: false,
      initFetched: true,
    }),
    [combineActions(
      createGroup.SUCCESS,
      blackUser.SUCCESS,
      addTempContact,
      addContact,
    )]: (state) => ({
      ...state,
      shouldRefresh: true,
    }),
  },
  initialState,
);

export default reducer;
