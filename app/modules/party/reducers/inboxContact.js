import { handleActions, combineActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import {
  getInboxContacts,
  blackUser,
  postFriendRequest,
  replaceContact,
  updateContactTime,
  receiveAcceptGroupMergeInfo,
  receiveRestoreGroupInfo,
  receiveDismissGroupInfo,
  postGroupMerge,
  moveContactToInbox,
  addTempContact,
  createGroup,
  addContact,
  unblackUser,
  unblackGroup,
  restoreGroup,
  dismissGroup,
  blackGroup,
} from '../actions';

const initialState = {
  initFetched: false,
  fetching: false,
  error: null,
  shouldRefresh: false,
  list: [],
};

const reducer = handleActions(
  {
    [getInboxContacts]: (state) => ({
      ...state,
      error: null,
      shouldRefresh: false,
    }),
    [getInboxContacts.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [getInboxContacts.SUCCESS]: (state, action) => ({
      ...state,
      list: action.payload.list,
    }),
    [getInboxContacts.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload,
    }),
    [getInboxContacts.FULFILL]: (state) => ({
      ...state,
      fetching: false,
      initFetched: true,
    }),

    [combineActions(
      blackUser.SUCCESS,
      blackGroup.SUCCESS,
      dismissGroup.SUCCESS,
      receiveDismissGroupInfo,
    )]: (state, action) => ({
      ...state,
      list: state.list.filter((id) => id !== action.payload.contactId),
    }),

    [receiveAcceptGroupMergeInfo]: (state, action) => ({
      ...state,
      list: state.list.filter(
        (id) => id !== action.payload.sourceGroupContactId,
      ),
    }),

    [combineActions(
      unblackUser.SUCCESS,
      unblackGroup.SUCCESS,
      restoreGroup.SUCCESS,
      createGroup.SUCCESS,
      addContact,
      addTempContact,
      moveContactToInbox,
      receiveRestoreGroupInfo,
      updateContactTime,
    )]: (state, action) => {
      if (!action.payload.contactId) {
        return state;
      }
      const  updated = uniq([
        ...state.list.slice(0, 1),
        action.payload.contactId,
        ...state.list.slice(1),
      ]);
      return {
        ...state,
        list: updated,
      };
    },

    [combineActions(replaceContact, postFriendRequest.SUCCESS)]: (
      state,
      action,
    ) => {
      const index = state.list.findIndex(
        (item) => item === action.payload.originContactId,
      );

      if (index === -1) {
        return {
          ...state,
          list: uniq([
            ...state.list.slice(0, 1),
            action.payload.contactId,
            ...state.list.slice(1),
          ]),
        };
      }

      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          action.payload.contactId,
          ...state.list.slice(index + 1),
        ],
      };
    },

    [postGroupMerge.SUCCESS]: (state, action) => {
      if (action.payload.userIsOwnerOfBoth) {
        return {
          ...state,
          list: state.list.filter(
            (id) => id !== action.payload.sourceContactId,
          ),
        };
      }
      return state;
    },
  },
  initialState,
);

export default reducer;
