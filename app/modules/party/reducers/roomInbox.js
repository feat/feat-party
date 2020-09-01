import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import uniqBy from 'lodash/uniqBy';
import {
  fetchInboxMessages,
  syncBroadcastMessages,
  sendMessage,
  receiveMessage,
  changeRoom,
} from '../actions';
import { GLOBAL_ROOM } from '../constants';

export const initialSubState = {
  messages: [],
  initFetched: false,
  fetchError: null,
  reachEnd: false,
  fetching: false,
  fetchingBroadcastMessage: false,
  shouldFetchBroadcastMessage: false, // update when receive broadcasting
  messagesSent: {},
  loading: false,
};

const uniqMessages = (messages) => uniqBy(messages, (item) => item._id || item);
const appendOrReplace = (arr, origin, current) => {
  const index = arr.findIndex((item) => item === origin);
  if (index === -1) {
    return [...arr, current];
  }
  return [...arr.slice(0, index), current, ...arr.slice(index + 1)];
};
// const updateTempMessage = (arr, tempMessageId, error) => {
//   const index = arr.findIndex((item) => item._id && item._id === tempMessageId);
//   if (index === -1) {
//     logging.warn('Temp message not found');
//     return arr;
//   }
//   return [
//     ...arr.slice(0, index),
//     { ...arr[index], error },
//     ...arr.slice(index + 1),
//   ];
// };

const handleSendMessageSuccess = (subState, payload) => ({
  ...subState,
  messagesSent: {
    ...subState.messagesSent,
    [payload.tempMessageId]: payload.messageId,
  },
  messages: uniqMessages(
    appendOrReplace(
      subState.messages,
      payload.tempMessageId,
      payload.messageId,
    ),
  ),
  loading: false,
});

const reducer = handleActions(
  {
    [fetchInboxMessages]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          initFetched: true,
          fetchError: null,
        }),
      });
    },
    [fetchInboxMessages.REQUEST]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          fetching: true,
        }),
      });
    },
    [fetchInboxMessages.SUCCESS]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          messages: uniqMessages([...payload.list, ...subState.messages]),
          reachEnd: !payload.hasMore,
        }),
      });
    },
    [fetchInboxMessages.FAILURE]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          fetchError: payload.error,
        }),
      });
    },
    [fetchInboxMessages.FULFILL]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          fetching: false,
        }),
      });
    },
    [syncBroadcastMessages]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          shouldFetchBroadcastMessage: false,
        }),
      });
    },
    [syncBroadcastMessages.REQUEST]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          fetchingBroadcastMessage: true,
        }),
      });
    },
    [syncBroadcastMessages.SUCCESS]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          messages: uniqMessages([...subState.messages, ...payload.list]),
        }),
      });
    },
    [syncBroadcastMessages.FULFILL]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          fetchingBroadcastMessage: false,
        }),
      });
    },
    [sendMessage.REQUEST]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          messagesSent: {
            ...subState.messagesSent,
            [payload.tempMessageId]: true,
          },
          messages: uniqMessages([...subState.messages, payload.tempMessageId]),
          loading: true,
        }),
      });
    },
    [sendMessage.SUCCESS]: (state, action) => {
      const { payload } = action;
      if (payload.isBroadcast) {
        const newState = {};
        Object.entries(state).forEach(([key, subState]) => {
          if (key === GLOBAL_ROOM) {
            newState[key] = handleSendMessageSuccess(subState, payload);
          } else {
            newState[key] = {
              ...subState,
              shouldFetchBroadcastMessage: true,
            };
          }
        });
        return newState;
      }
      return update(state, {
        [payload.roomId]: (subState) =>
          handleSendMessageSuccess(subState, payload),
      });
    },
    [sendMessage.FAILURE]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState) => ({
          ...subState,
          messagesSent: {
            ...subState.messagesSent,
            [payload.tempMessageId]: false,
          },
          loading: false,
        }),
      });
    },
    [receiveMessage]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          messages: uniqMessages([...subState.messages, payload.messageId]),
        }),
      });
    },
    [changeRoom]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => {
          if (payload.isTempContact) {
            return {
              ...subState,
              initFetched: true,
              reachEnd: true,
            };
          }
          return subState;
        },
      });
    },
  },
  {},
);

export default reducer;
