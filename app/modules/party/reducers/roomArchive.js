import { handleActions, combineActions } from 'redux-actions';
import update from 'immutability-helper';
import uniq from 'lodash/uniq';
import { stringify } from 'query-string';
import {
  fetchArchiveMessages,
  queryArchiveMessages,
  changeRoom,
  sendMessage,
  receiveMessage,
  resetArchiveReachEnd,
} from '../actions';

export const initialSubState = {
  messages: [],
  fetching: false,
  fetchError: null,
  reachEnd: false,
  initFetched: false,
  queries: {}, // cache all related query.
};

export const initialQueryState = {
  messages: [],
  fetching: false,
  fetchError: null,
  reachEnd: false,
  initFetched: false,
}

const reducer = handleActions(
  {
    [changeRoom]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => subState,
      });
    },
    [fetchArchiveMessages]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          initFetched: true,
          fetchError: null,
        }),
      });
    },
    [fetchArchiveMessages.REQUEST]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          fetching: true,
        }),
      });
    },
    [fetchArchiveMessages.SUCCESS]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          messages: uniq([...subState.messages, ...payload.list]),
          reachEnd: !payload.hasMore,
        }),
      });
    },
    [fetchArchiveMessages.FAILURE]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          fetchError: payload.error,
        }),
      });
    },
    [fetchArchiveMessages.FULFILL]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          fetching: false,
        }),
      });
    },
    [combineActions(
      sendMessage.SUCCESS,
      receiveMessage,
      resetArchiveReachEnd,
    )]: (state, action) => {
      const { payload } = action;
      if (payload.isBroadcast) {
        const newState = {};
        Object.entries(state).forEach(([key, subState]) => {
          newState[key] = subState.reachEnd
            ? {
              ...subState,
              reachEnd: false,
            }
            : subState;
        });
        return newState;
      }
      return update(state, {
        [payload.roomId]: (subState = initialSubState) =>
          subState.reachEnd
            ? {
              ...subState,
              reachEnd: false,
            }
            : subState,
      });
    },
    [queryArchiveMessages.TRIGGER]: (state, action) => {
      const { payload } = action;
      const key = stringify(payload.filter);
      return update(state, {
        [payload.roomId]: {
          queries: {
            [key]: (subState = initialQueryState) => ({
              ...subState,
              initFetched: true,
              fetchError: null,
            }),
          },
        },
      })
    },
    [queryArchiveMessages.REQUEST]: (state, action) => {
      const { payload } = action;
      const key = stringify(payload.filter);
      return update(state, {
        [payload.roomId]: {
          queries: {
            [key]: (subState = initialQueryState) => ({
              ...subState,
              fetching: true,
            }),
          },
        },
      })
    },
    [queryArchiveMessages.SUCCESS]: (state, action) => {
      const { payload } = action;
      const key = stringify(payload.filter);
      return update(state, {
        [payload.roomId]: {
          queries: {
            [key]: (subState = initialSubState) => ({
              ...subState,
              messages: uniq([...subState.messages, ...payload.list]),
              reachEnd: !payload.hasMore,
            }),
          },
        },
      });
    },
    [queryArchiveMessages.FAILURE]: (state, action) => {
      const { payload } = action;
      const key = stringify(payload.filter);
      return update(state, {
        [payload.roomId]: {
          queries: {
            [key]: (subState = initialSubState) => ({
              ...subState,
              fetchError: payload.error,
            }),
          },
        },
      });
    },
    [queryArchiveMessages.FULFILL]: (state, action) => {
      const { payload } = action;
      const key = stringify(payload.filter);
      return update(state, {
        [payload.roomId]: {
          queries: {
            [key]: (subState = initialSubState) => ({
              ...subState,
              fetching: false,
            }),
          },
        },
      });
    },
  },
  {},
);

export default reducer;
