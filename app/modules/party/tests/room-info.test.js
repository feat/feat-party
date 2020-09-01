import { EditorState, convertFromRaw } from '@feat/draft-js';
import {
  getGroupMembers,
  acceptGroupMerge,
  postGroupMerge,
  receiveAcceptGroupMergeInfo,
  setRoomTargetUser,
  updateRoomEditor,
  sendMessage,
  initRenameGroup,
  cancelRenameGroup,
  renameGroup,
  changeRoom,
  focusRoomEditor,
  initMessageReply,
  replaceContact,
  postFriendRequest,
  initRoom,
} from '../actions';

import reducer from '../reducers/roomInfo';
import { CONTACT_TYPE_GROUP, GLOBAL_ROOM } from '../constants';
import { createEmpty } from '../components/TextBox/utils';

describe('Room Info', () => {
  describe('change room', () => {
    it('init room if not has related state', () => {
      const initialState = {};
      const action = changeRoom({
        roomId: 'demo',
        contact: {
          id: 123,
          group: {
            id: 1223,
          },
        },
      });

      const state = reducer(initialState, action);
      expect(state.demo).toBeTruthy();
      expect(state.demo.contactId).toBe(123);
      expect(state.demo.contactType).toBe(CONTACT_TYPE_GROUP);
      expect(state.demo.entityId).toBe(1223);
    });

    it('ignore if already has state', () => {
      const initialState = {
        demo: {
          initFetched: true,
        },
      };
      const action = changeRoom({
        roomId: 'demo',
        contact: {
          id: 123,
          group: {
            id: 1223,
          },
        },
      });
      const state = reducer(initialState, action);
      expect(state.demo).toBeTruthy();
      expect(state.demo.initFetched).toBe(true);
    });
  });
  describe('get group members', () => {
    let state = {};
    it('trigger', () => {
      const action = getGroupMembers({
        roomId: 'demo',
        groupId: 10,
      });
      state = reducer(state, action);
      expect(state.demo).toBeTruthy();
      expect(state.demo.fetchingMembers).toBe(true);
      expect(state.demo.shouldRefreshMember).toBe(false);
    });
    it('success', () => {
      const action = getGroupMembers.success({
        roomId: 'demo',
        groupId: 10,
      });
      state = reducer(state, action);
      expect(state.demo).toBeTruthy();
      expect(state.demo.memberFetched).toBe(true);
    });
    it('fulfill', () => {
      const action = getGroupMembers.fulfill({
        roomId: 'demo',
        groupId: 10,
      });
      state = reducer(state, action);
      expect(state.demo).toBeTruthy();
      expect(state.demo.fetchingMembers).toBe(false);
    });
  });

  describe('mark force refresh members', () => {
    const initialState = {
      [`${CONTACT_TYPE_GROUP}_10`]: {
        memberFetched: true,
      },
    };
    it('accept group merge', () => {
      const action = acceptGroupMerge.success({
        groupId: 10,
      });
      const state = reducer(initialState, action);
      const roomId = `${CONTACT_TYPE_GROUP}_10`;
      expect(state[roomId].shouldRefreshMember).toBe(true);
    });
    it('owner group merge', () => {
      const action = postGroupMerge.success({
        targetGroupId: 10,
        userIsOwnerOfBoth: true,
      });
      const state = reducer(initialState, action);
      const roomId = `${CONTACT_TYPE_GROUP}_10`;
      expect(state[roomId].shouldRefreshMember).toBe(true);
    });
    it('receive group merged info', () => {
      const action = receiveAcceptGroupMergeInfo({
        targetGroupId: 10,
      });
      const state = reducer(initialState, action);
      const roomId = `${CONTACT_TYPE_GROUP}_10`;
      expect(state[roomId].shouldRefreshMember).toBe(true);
    });
  });

  const simpleMessage = {
    blocks: [
      {
        key: 'ag6qs',
        text: 'simple message',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };

  const mentionMessage = {
    blocks: [
      {
        key: 'ag6qs',
        text: '@ kongkx message content',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 8,
            key: 0,
          },
        ],
        data: {},
      },
    ],
    entityMap: {
      0: {
        type: 'mention',
        mutability: 'IMMUTABLE',
        data: {
          user: 9915751779367,
          fullname: 'kongkx',
        },
      },
    },
  };

  describe('handle editor', () => {
    it('set traget user', () => {
      const initialState = {
        demo: {
          editorState: createEmpty(),
          targetUser: undefined,
        },
      };
      const action = setRoomTargetUser({
        roomId: 'demo',
        member: {
          user: 9915751779367,
          fullname: 'kongkx',
        },
      });
      const state = reducer(initialState, action);
      expect(state.demo.targetUser).toEqual({
        uid: 9915751779367,
        username: 'kongkx',
      });
      expect(state.demo.editorState.getCurrentContent().getPlainText()).toEqual(
        '@ kongkx ',
      );
      // TODO check entity
    });
    it('unset target user', () => {
      const editorState = EditorState.createWithContent(
        convertFromRaw(mentionMessage),
      );
      const initialState = {
        demo: {
          editorState,
          targetUser: {
            uid: 9915751779367,
            username: 'kongkx',
          },
        },
      };
      const action = setRoomTargetUser({
        roomId: 'demo',
        member: undefined,
      });
      const state = reducer(initialState, action);
      expect(state.demo.targetUser).toBe(null);
      expect(state.demo.editorState.getCurrentContent().getPlainText()).toEqual(
        'message content',
      );
    });
    it('update editor state, without mention', () => {
      const initialState = {
        demo: {
          editorState: createEmpty(),
        },
      };
      const editorState = EditorState.createWithContent(
        convertFromRaw(simpleMessage),
      );
      const action = updateRoomEditor({
        roomId: 'demo',
        editorState,
      });
      const state = reducer(initialState, action);
      expect(state.demo.editorState).toBe(editorState);
    });
    it('update editor state, has mention', () => {
      const initialState = {
        demo: {
          editorState: createEmpty(),
        },
      };
      const editorState = EditorState.createWithContent(
        convertFromRaw(mentionMessage),
      );
      const action = updateRoomEditor({
        roomId: 'demo',
        editorState,
      });
      const state = reducer(initialState, action);
      expect(state.demo.editorState).toBe(editorState);
      expect(state.demo.targetUser).toEqual({
        uid: 9915751779367,
        username: 'kongkx',
      });
    });
  });

  describe('send message', () => {
    describe('text message', () => {
      let state = {
        demo: {
          messageSendingCount: 0,
          editorState: EditorState.createWithContent(
            convertFromRaw(mentionMessage),
          ),
        },
      };
      it('trigger', () => {
        const action = sendMessage({
          roomId: 'demo',
          data: {
            content: 'text message',
          },
        });
        state = reducer(state, action);
        expect(state.demo.messageSendingCount).toBe(1);
        expect(
          state.demo.editorState.getCurrentContent().getPlainText(),
        ).toEqual('@ kongkx ');
      });
      // it('request', () => {});
      // it('success', () => {});
      // it('failure', () => {});
      it('fulfill', () => {
        const action = sendMessage.fulfill({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.messageSendingCount).toBe(0);
      });
    });
    describe('broadcast message', () => {
      let state = {
        [GLOBAL_ROOM]: {
          messageSendingCount: 0,
          editorState: EditorState.createWithContent(
            convertFromRaw(simpleMessage),
          ),
        },
      };
      it('trigger', () => {
        const action = sendMessage({
          roomId: GLOBAL_ROOM,
          isBroadcast: true,
          data: {
            content: 'Demo Message',
          },
        });
        state = reducer(state, action);
        expect(state[GLOBAL_ROOM].messageSendingCount).toBe(1);
        expect(
          state[GLOBAL_ROOM].editorState.getCurrentContent().getPlainText(),
        ).toEqual('');
      });
      // it('request', () => {});
      // it('success', () => {});
      // it('failure', () => {});
      it('fulfill', () => {
        const action = sendMessage.fulfill({
          roomId: GLOBAL_ROOM,
          isBroadcast: true,
        });
        state = reducer(state, action);
        expect(state[GLOBAL_ROOM].messageSendingCount).toBe(0);
      });
    });
  });

  describe('rename group', () => {
    let state = {
      demo: {},
    };
    it('init rename', () => {
      const action = initRenameGroup({
        roomId: 'demo',
        name: 'origin name',
      });
      state = reducer(state, action);
      expect(state.demo.isRenameActive).toBe(true);
      expect(state.demo.name).toEqual('origin name');
    });
    it('cancel rename', () => {
      const action = cancelRenameGroup({
        roomId: 'demo',
      });
      const canceled = reducer(state, action);
      expect(canceled.demo.isRenameActive).toBe(false);
      expect(canceled.demo.name).toBeFalsy();
    });
    describe('rename request', () => {
      it('trigger', () => {
        const action = renameGroup({
          roomId: 'demo',
          groupId: 10,
          name: 'another name',
        });
        state = reducer(state, action);
        expect(state.demo.isRenaming).toBe(true);
      });
      // it('request', () => {});
      it('success', () => {
        const action = renameGroup.success({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.isRenameActive).toBe(false);
      });
      // it('failure', () => {});
      it('fulfill', () => {
        const action = renameGroup.fulfill({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.isRenaming).toBe(false);
      });
    });
  });

  describe('editor focus', () => {
    it('focusRoomEditor', () => {
      const initialState = {
        demo: {
          editorState: createEmpty(),
        },
      };
      const action = focusRoomEditor({
        roomId: 'demo',
      });
      const state = reducer(initialState, action);
      expect(state.demo.editorState.getSelection().getHasFocus()).toBe(true);
    });
    it('initMessageReply', () => {
      const initialState = {
        demo: {
          editorState: createEmpty(),
        },
      };
      const action = initMessageReply({
        roomId: 'demo',
        contact: {
          id: 1,
          friend: 123123,
        },
      });
      const state = reducer(initialState, action);
      expect(state.demo.editorState.getSelection().getHasFocus()).toBe(true);
    });
  });

  describe('reset room contact', () => {
    it('should update contactId when replace contact', () => {
      const initialState = {
        user_123: {
          contactId: 'TMP_user_123',
        },
      };
      const action = replaceContact({
        contactId: 10,
        originContactId: 'TMP_user_123',
        entities: {
          contacts: {
            10: {
              id: 10,
              group: null,
              friend: 123,
            },
          },
        },
      });

      const state = reducer(initialState, action);
      expect(state.user_123.contactId).toEqual(10);
    });
    it('should skip if originContactIs undefined', () => {
      const initialState = {};
      const action = replaceContact({
        contactId: 10,
        originContactId: undefined,
        entities: {
          contacts: {
            10: {
              id: 10,
              group: null,
              friend: 123,
            },
          },
        },
      });
      const state = reducer(initialState, action);
      expect(state.user_123).toBeFalsy();
    });
    it('should replace contact when post friend request success', () => {
      const initialState = {
        user_123: {
          contactId: 'TMP_user_123',
        },
      };
      const action = postFriendRequest.success({
        contactId: 10,
        originContactId: 'TMP_user_123',
        entities: {
          contacts: {
            10: {
              id: 10,
              group: null,
              friend: 123,
            },
          },
        },
      });

      const state = reducer(initialState, action);
      expect(state.user_123.contactId).toEqual(10);
    });
  });

  it('init room', () => {
    const action = initRoom({
      roomId: 'demo',
      contact: {
        id: 123,
        group: {
          id: 1223,
        },
      },
    });
    const state = reducer(undefined, action);
    expect(state.demo).toBeTruthy();
    expect(state.demo.contactId).toBe(123);
    expect(state.demo.contactType).toBe(CONTACT_TYPE_GROUP);
    expect(state.demo.entityId).toBe(1223);
    expect(state.demo.isInitialized).toBe(true);
  });
});
