import { handleActions, combineActions } from 'redux-actions';
import update from 'immutability-helper';
import {
  getGroupMembers,
  acceptGroupMerge,
  postGroupMerge,
  receiveAcceptGroupMergeInfo,
  setRoomTargetUser,
  updateRoomEditor,
  sendMessage,
  receiveMessage,
  initRenameGroup,
  cancelRenameGroup,
  renameGroup,
  changeRoom,
  focusRoomEditor,
  initMessageReply,
  replaceContact,
  postFriendRequest,
  initRoom,
  updateFilter,
  initArchiveQuery,
  resetArchiveQuery,
} from '../actions';
import { CONTACT_TYPE_GROUP, TEMP_CONTACT_PREFIX } from '../constants';
import {
  syncMention,
  createEmpty,
  syncTarget,
  clearContent,
  forceFocus,
} from '../components/TextBox/utils';
import { getContactType, getContactEntityId } from '../utils/contact';

export const initialSubState = {
  editorState: createEmpty(),
  messageSendingCount: 0,
  shouldRefreshMember: false,
  fetchingMembers: false,
  memberFetched: false,
  isInitialized: false,
  contactType: undefined,
  contactId: undefined,
  entityId: undefined,
  search_keyword: '',
};

const markShouldRefreshMember = (state, roomId) =>
  update(state, {
    [roomId]: (subState = initialSubState) => ({
      ...subState,
      shouldRefreshMember: true,
    }),
  });

const reducer = handleActions(
  {
    [combineActions(
      changeRoom, 
      receiveMessage
    )]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => {
          if (subState.isInitialized) {
            return subState;
          }
          if (payload.contact) {
            return {
              ...subState,
              contactId: payload.contact.id,
              contactType: getContactType(payload.contact),
              entityId: getContactEntityId(payload.contact),
              isInitialized: true,
            };
          }
          return subState;
        },
      });
    },
    [getGroupMembers]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          fetchingMembers: true,
          shouldRefreshMember: false,
        }),
      });
    },
    [getGroupMembers.SUCCESS]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          memberFetched: true,
        }),
      });
    },
    [getGroupMembers.FULFILL]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          fetchingMembers: false,
        }),
      });
    },
    [acceptGroupMerge.SUCCESS]: (state, action) => {
      const roomId = `${CONTACT_TYPE_GROUP}_${action.payload.groupId}`;
      return markShouldRefreshMember(state, roomId);
    },
    [postGroupMerge.SUCCESS]: (state, action) => {
      const { payload } = action;
      if (!payload.userIsOwnerOfBoth) {
        return state;
      }
      const roomId = `${CONTACT_TYPE_GROUP}_${payload.targetGroupId}`;
      return markShouldRefreshMember(state, roomId);
    },
    [receiveAcceptGroupMergeInfo]: (state, action) => {
      const { payload } = action;
      const roomId = `${CONTACT_TYPE_GROUP}_${payload.targetGroupId}`;
      return markShouldRefreshMember(state, roomId);
    },
    // Editor
    [setRoomTargetUser]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          targetUser: payload.member
            ? {
              uid: payload.member.user,
              username: payload.member.fullname,
            }
            : null,
          editorState: syncMention(subState.editorState, payload.member),
        }),
      });
    },
    [updateRoomEditor]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          targetUser: syncTarget(subState.targetUser, payload.editorState),
          editorState: payload.editorState,
        }),
      });
    },
    // Send Message
    [sendMessage]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          messageSendingCount: subState.messageSendingCount + 1,
          editorState: clearContent(subState.editorState),
        }),
      });
    },
    [sendMessage.FULFILL]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          messageSendingCount: subState.messageSendingCount - 1,
        }),
      });
    },
    // Rename Group
    [initRenameGroup]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          isRenameActive: true,
          name: payload.name,
        }),
      });
    },
    [cancelRenameGroup]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          isRenameActive: false,
          name: undefined,
        }),
      });
    },
    [renameGroup]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          isRenaming: true,
        }),
      });
    },
    [renameGroup.SUCCESS]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          isRenameActive: false,
        }),
      });
    },
    [renameGroup.FULFILL]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          isRenaming: false,
        }),
      });
    },
    [focusRoomEditor]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          editorState: forceFocus(subState.editorState),
        }),
      });
    },
    [initRoom]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          contactId: payload.contact.id,
          contactType: getContactType(payload.contact),
          entityId: getContactEntityId(payload.contact),
          isInitialized: true,
        }),
      });
    },
    [initMessageReply]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          contactId: payload.contact.id,
          contactType: getContactType(payload.contact),
          entityId: getContactEntityId(payload.contact),
          editorState: forceFocus(subState.editorState),
        }),
      });
    },
    [combineActions(replaceContact, postFriendRequest.SUCCESS)]: (
      state,
      action,
    ) => {
      const { payload } = action;
      const roomId =
        payload.originContactId &&
        payload.originContactId.replace(`${TEMP_CONTACT_PREFIX}_`, '');
      if (roomId && roomId !== payload.originContactId) {
        return update(state, {
          [roomId]: (subState = initialSubState) => ({
            ...subState,
            contactId: payload.contactId,
          }),
        });
      }
      return state;
    },
    [updateFilter]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          filter: payload.data,
        }),
      })
    },
    [initArchiveQuery]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          activeFilter: subState.filter,
        }),
      })
    },
    [resetArchiveQuery]: (state, action) => {
      const { payload } = action;
      return update(state, {
        [payload.roomId]: (subState = initialSubState) => ({
          ...subState,
          activeFilter: undefined,
          filter: undefined,
        }),
      })
    },
  },
  {},
);

export default reducer;
