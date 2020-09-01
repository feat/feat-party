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
} from '../actions';

import reducer from '../reducers/ui';
import {
  GLOBAL_ROOM,
  IM_TAB_INBOX,
  CONTACT_TYPE_GROUP,
  CONTACT_TYPE_USER,
} from '../constants';

describe('Party - UI', () => {
  const initialState = {
    currentMode: 'DEMO',
    currentTab: 'inbox',
    currentContact: undefined,
    currentRoom: GLOBAL_ROOM,
    display: false,
  };
  it('change mode', () => {
    const action = changeMode('CHAT');
    const state = reducer(initialState, action);
    expect(state.currentMode).toEqual('CHAT');
  });
  it('change tab', () => {
    const action = changeTab('archive');
    const state = reducer(initialState, action);
    expect(state.currentTab).toEqual('archive');
    const nextState = reducer(state, changeTab('inbox'));
    expect(nextState.currentTab).toEqual('inbox');
  });
  it('change room', () => {
    const action = changeRoom({
      roomId: 'GROUP_123',
    });
    const state = reducer(initialState, action);
    expect(state.currentRoom).toEqual('GROUP_123');
  });
  it('show im', () => {
    const state = reducer(initialState, showIM());
    expect(state.display).toBe(true);
  });
  it('hide im', () => {
    const state = reducer({ display: true }, hideIM());
    expect(state.display).toBe(false);
  });
  it('toggle im', () => {
    const state = reducer({ display: true }, toggleIM());
    expect(state.display).toBe(false);
    const nextState = reducer(state, toggleIM());
    expect(nextState.display).toBe(true);
  });
  it('init message reply', () => {
    const state = reducer({}, initMessageReply({ roomId: 'demo' }));
    expect(state.display).toBe(true);
    expect(state.currentRoom).toBe('demo');
    expect(state.currentTab).toBe(IM_TAB_INBOX);
  });
  describe('reset current room when viewing inbox contacts', () => {
    it('if current room(group) is dismissed', () => {
      const state = reducer(
        {
          currentRoom: `${CONTACT_TYPE_GROUP}_112`,
          currentTab: 'inbox',
        },
        dismissGroup.success({ groupId: 112 }),
      );
      expect(state.currentRoom).toEqual(GLOBAL_ROOM);
    });
    it('if current room(group) is dismissed (info from message)', () => {
      let state = reducer(
        {
          currentRoom: `${CONTACT_TYPE_GROUP}_88`,
          currentTab: 'inbox',
        },
        receiveDismissGroupInfo({
          groupId: 89,
        }),
      );
      expect(state.currentRoom).toEqual(`${CONTACT_TYPE_GROUP}_88`);
      state = reducer(
        state,
        receiveDismissGroupInfo({
          groupId: 88,
        }),
      );
      expect(state.currentRoom).toEqual(GLOBAL_ROOM);
    });
    it('if current room(group) has been blacked', () => {
      const state = reducer(
        {
          currentRoom: `${CONTACT_TYPE_GROUP}_12`,
          currentTab: 'inbox',
        },
        blackGroup.success({
          groupId: 12,
        }),
      );
      expect(state.currentRoom).toEqual(GLOBAL_ROOM);
    });
    it('if current room(user) has been blacked', () => {
      const state = reducer(
        {
          currentRoom: `${CONTACT_TYPE_USER}_8`,
          currentTab: 'inbox',
        },
        blackUser.success({
          userId: 8,
        }),
      );
      expect(state.currentRoom).toEqual(GLOBAL_ROOM);
    });
  });
  describe('Consult chat', () => {
    let state = {
      currentRoom: 'demo',
      currentTab: 'archive',
      display: false,
    };
    it('open chat, should cache origin state, if is first open', () => {
      const action = openChatRoomWithUser({
        user: {
          uid: 10,
        },
      });
      state = reducer(state, action);
      expect(state.beforeOpen).toEqual({
        currentRoom: 'demo',
        currentTab: 'archive',
        display: false,
      });
    });
    it('open chat, should skip cache, if has one exists.', () => {
      const action = openChatRoomWithUser({
        user: {
          uid: 20,
        },
      });
      state = reducer(state, action);
      expect(state.beforeOpen).toEqual({
        currentRoom: 'demo',
        currentTab: 'archive',
        display: false,
      });
      state = reducer(
        state,
        changeRoom({
          roomId: 'user_20',
          isTempContact: true,
          contact: {
            id: 123,
            friend: 20,
            friend_fullname: 'Full name',
          },
        }),
      );
    });
    it('close chat, should restore and clean cache', () => {
      const action = closeChatRoomWithUser({
        user: {
          uid: 20,
        },
      });
      state = reducer(state, action);
      expect(state.beforeOpen).toBeFalsy();
      expect(state.currentTab).toEqual('archive');
      expect(state.currentRoom).toEqual('demo');
      expect(state.display).toBe(false);
    });
    it('close chat, skip if no has cache', () => {});
  });
});
