import { handleActions, combineActions } from 'redux-actions';

import {
  changeMode,
  changeTab,
  changeRoom,
  showIM,
  hideIM,
  toggleIM,
  receiveDismissGroupInfo,
  dismissGroup,
  blackGroup,
  blackUser,
  initMessageReply,
  openChatRoomWithUser,
  closeChatRoomWithUser,
  contactTab,
} from '../actions';

import {
  IM_TAB_INBOX,
  IM_MODE_CHAT,
  GLOBAL_ROOM,
  CONTACT_TYPE_GROUP,
  CONTACT_TYPE_USER,
} from '../constants';

const initialState = {
  currentMode: IM_MODE_CHAT, // IM_MODE_CHAT | IM_MODE_PARTY
  currentTab: IM_TAB_INBOX, // IM_TAB_INBOX | IM_TAB_ARCHIVE
  currentRoom: GLOBAL_ROOM,
  display: false,
  beforeOpen: null,
  contactType: 0,
};

const uiReducer = handleActions(
  {
    [changeMode]: (state, action) => ({
      ...state,
      currentMode: action.payload,
    }),
    [changeTab]: (state, action) => ({
      ...state,
      currentTab: action.payload,
    }),
    [changeRoom]: (state, action) => ({
      ...state,
      currentRoom: action.payload.roomId,
    }),
    [hideIM]: (state) => ({
      ...state,
      display: false,
    }),
    [showIM]: (state) => ({
      ...state,
      display: true,
    }),
    [toggleIM]: (state) => ({
      ...state,
      display: !state.display,
    }),
    [initMessageReply]: (state, action) => ({
      ...state,
      currentTab: IM_TAB_INBOX,
      currentRoom: action.payload.roomId,
      display: true,
    }),
    [combineActions(
      dismissGroup.SUCCESS,
      blackGroup.SUCCESS,
      blackUser.SUCCESS,
      receiveDismissGroupInfo,
    )]: (state, action) => {
      const { groupId, userId } = action.payload;
      const roomId = groupId
        ? `${CONTACT_TYPE_GROUP}_${groupId}`
        : `${CONTACT_TYPE_USER}_${userId}`;

      if (state.currentRoom === roomId && state.currentTab === IM_TAB_INBOX) {
        return {
          ...state,
          currentRoom: GLOBAL_ROOM,
        };
      }
      return state;
    },
    [openChatRoomWithUser]: (state) => {
      if (state.beforeOpen) {
        return state;
      }
      return {
        ...state,
        beforeOpen: {
          currentMode: state.currentMode,
          currentRoom: state.currentRoom,
          currentTab: state.currentTab,
          display: state.display,
        },
      };
    },
    [closeChatRoomWithUser]: (state) => {
      if (!state.beforeOpen) {
        return {
          ...state,
          display: false,
        };
      }
      return {
        ...state,
        ...state.beforeOpen,
        beforeOpen: null,
      };
    },
    [contactTab]: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        contactType: payload.type,
      };
    },
  },

  initialState,
);

export default uiReducer;
