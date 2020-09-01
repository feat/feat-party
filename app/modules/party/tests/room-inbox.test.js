import {
  fetchInboxMessages,
  syncBroadcastMessages,
  sendMessage,
  receiveMessage,
  changeRoom,
} from '../actions';
import reducer from '../reducers/roomInbox';
import { GLOBAL_ROOM } from '../constants';

describe('Party - Room - Inbox', () => {
  describe('fetch messages', () => {
    describe('history message', () => {
      let state = {};
      it('trigger', () => {
        const action = fetchInboxMessages({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo).toBeTruthy();
        expect(state.demo.initFetched).toBe(true);
        expect(state.demo.fetching).toBe(false);
      });
      it('request', () => {
        const action = fetchInboxMessages.request({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.fetching).toBe(true);
      });
      it('success', () => {
        const action = fetchInboxMessages.success({
          roomId: 'demo',
          list: [4, 5, 6],
        });
        state = reducer(state, action);
        expect(state.demo.messages).toEqual([4, 5, 6]);
      });
      it('success, has duplicate messages', () => {
        const action = fetchInboxMessages.success({
          roomId: 'demo',
          list: [1, 2, 4],
          hasMore: true,
        });
        state = reducer(state, action);
        expect(state.demo.messages).toEqual([1, 2, 4, 5, 6]);
      });
      it('success, reach end', () => {
        const action = fetchInboxMessages.success({
          roomId: 'demo',
          list: [9, 10, 11],
          hasMore: false,
        });
        state = reducer(state, action);
        expect(state.demo.reachEnd).toBe(true);
      });
      it('failure', () => {
        const error = new Error('Error');
        const action = fetchInboxMessages.failure({
          roomId: 'demo',
          error,
        });
        const failureState = reducer(state, action);
        expect(failureState.demo.fetchError).toBe(error);
        const trigger = fetchInboxMessages({
          roomId: 'demo',
        });
        const resetState = reducer(failureState, trigger);
        expect(resetState.demo.fetchError).toBe(null);
      });
      it('fulfill', () => {
        const action = fetchInboxMessages.fulfill({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.fetching).toBe(false);
        expect(state.demo.initFetched).toBe(true);
      });
    });

    describe('sync broadcasting message', () => {
      let state = {
        demo: {
          shouldFetchBroadcastMessage: true,
          messages: [1, 2, 3],
        },
      };
      it('trigger', () => {
        const action = syncBroadcastMessages({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.shouldFetchBroadcastMessage).toBe(false);
      });
      it('request', () => {
        const action = syncBroadcastMessages.request({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.fetchingBroadcastMessage).toBe(true);
      });
      it('success', () => {
        const action = syncBroadcastMessages.success({
          roomId: 'demo',
          list: [7],
        });
        state = reducer(state, action);
        expect(state.demo.messages).toEqual([1, 2, 3, 7]);
      });
      // it('failure', () => {});
      it('fulfill', () => {
        const action = syncBroadcastMessages.fulfill({
          roomId: 'demo',
        });
        state = reducer(state, action);
        expect(state.demo.fetchingBroadcastMessage).toBe(false);
      });
    });
  });

  describe('send message', () => {
    let state = {
      demo: {
        initFetched: true,
        messages: [1, 2, 3],
      },
    };
    const messageData = {
      id: 'temp_id',
      content: 'Demo Message',
    };
    it('request', () => {
      const action = sendMessage.request({
        roomId: 'demo',
        tempMessageId: messageData.id,
        data: messageData,
      });
      state = reducer(state, action);
      expect(state.demo.messages).toContain(messageData.id);
      expect(state.demo.messagesSent[messageData.id]).toEqual(true);
      expect(state.demo.initFetched).toBe(true);
    });
    // it('request', () => {});
    it('success', () => {
      const action = sendMessage.success({
        roomId: 'demo',
        tempMessageId: 'temp_id',
        messageId: 10,
      });
      state = reducer(state, action);
      expect(state.demo.messages).not.toContain('temp_id');
      expect(state.demo.messages).toContain(10);
      expect(state.demo.messagesSent[messageData.id]).toEqual(10);
      expect(state.demo.initFetched).toBe(true);
    });
    it('failure', () => {
      const initialState = {
        demo: {
          initFetched: true,
          messages: [1, 2, 3, 4, 'temp_id'],
        },
      };
      const error = new Error('ERROR');
      const action = sendMessage.failure({
        roomId: 'demo',
        tempMessageId: 'temp_id',
        error,
        // should have entity mutators
      });
      const failureState = reducer(initialState, action);
      expect(failureState.demo.messages).toContain('temp_id');
    });
    // it('fulfill', () => {});

    it('send broadcast message success', () => {
      const initialState = {
        [GLOBAL_ROOM]: {
          messages: [],
        },
        demo: {
          messages: [],
        },
        demo2: {
          messages: [],
        },
      };
      const action = sendMessage.success({
        roomId: GLOBAL_ROOM,
        messageId: 10,
        isBroadcast: true,
      });
      state = reducer(initialState, action);
      expect(state[GLOBAL_ROOM].messages).toEqual([10]);
      expect(state.demo.shouldFetchBroadcastMessage).toBe(true);
      expect(state.demo2.shouldFetchBroadcastMessage).toBe(true);
    });
  });

  describe('receive message', () => {
    it('normal', () => {
      const initialState = {
        demo: {
          messages: [1, 2, 3, 4],
        },
      };
      const action = receiveMessage({
        roomId: 'demo',
        messageId: 10,
      });

      const state = reducer(initialState, action);

      expect(state.demo.messages).toEqual([1, 2, 3, 4, 10]);
    });

    it('handle message when not intialized', () => {
      const initialState = {
        demo: {
          messages: [1, 2, 3, 4],
        },
      };
      const action = receiveMessage({
        roomId: 'demo2',
        messageId: 10,
      });
      const state = reducer(initialState, action);
      expect(state.demo.messages).toEqual([1, 2, 3, 4]);
      expect(state.demo2.messages).toEqual([10]);
    });

    // it('trigger', () => {});
    // it('request', () => {});
    // it('success', () => {});
    // it('failure', () => {});
    // it('fulfill', () => {});
  });

  describe('changeRoom', () => {
    it('handle temp contact init', () => {
      const action = changeRoom({
        roomId: 'demo',
        isTempContact: true,
      });
      const state = reducer(undefined, action);
      expect(state.demo.initFetched).toBe(true);
      expect(state.demo.reachEnd).toBe(true);
    });
    it('handle normal contact init', () => {
      const action = changeRoom({
        roomId: 'demo',
        contact: {
          id: 1,
          group: {
            id: 1,
          },
        },
      });
      const state = reducer(undefined, action);
      expect(state.demo).toBeTruthy();
    });
  });
});
