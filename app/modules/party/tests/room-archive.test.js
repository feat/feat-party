import {
  changeRoom,
  sendMessage,
  fetchArchiveMessages,
  receiveMessage,
  resetArchiveReachEnd,
} from '../actions';

import reducer from '../reducers/roomArchive';
import { GLOBAL_ROOM } from '../constants';

describe('Party - Room - Archive', () => {
  it('init room', () => {
    const action = changeRoom({
      roomId: 'demo',
    });
    const state = reducer(undefined, action);
    expect(state.demo).toBeTruthy();
  });
  describe('fetch archive messages', () => {
    let state = {};
    it('trigger', () => {
      const action = fetchArchiveMessages({
        roomId: 'demo',
      });
      state = reducer(state, action);
      expect(state.demo.initFetched).toBe(true);
    });
    it('request', () => {
      const action = fetchArchiveMessages.request({
        roomId: 'demo',
      });
      state = reducer(state, action);
      expect(state.demo.fetching).toBe(true);
    });
    it('success', () => {
      const action = fetchArchiveMessages.success({
        roomId: 'demo',
        list: [1, 2, 3],
        hasMore: true,
      });
      state = reducer(state, action);
      expect(state.demo.messages).toEqual([1, 2, 3]);
      expect(state.demo.reachEnd).toBe(false);
      const action2 = fetchArchiveMessages.success({
        roomId: 'demo',
        list: [3, 4, 5],
        hasMore: false,
      });
      state = reducer(state, action2);
      expect(state.demo.messages).toEqual([1, 2, 3, 4, 5]);
      expect(state.demo.reachEnd).toBe(true);
    });
    it('failure', () => {
      const error = new Error('ERROR');
      const action = fetchArchiveMessages.failure({
        roomId: 'demo',
        error,
      });
      const failed = reducer(state, action);
      expect(failed.demo.fetchError).toBe(error);
      const action2 = fetchArchiveMessages.trigger({
        roomId: 'demo',
      });
      const reset = reducer(failed, action2);
      expect(reset.demo.fetchError).toBe(null);
    });
    it('fulfill', () => {
      const action = fetchArchiveMessages.fulfill({
        roomId: 'demo',
      });
      state = reducer(state, action);
      expect(state.demo.fetching).toBe(false);
    });
  });

  describe('reset reach end', () => {
    const initialState = {
      [GLOBAL_ROOM]: {},
      demo: {
        reachEnd: true,
      },
      demo2: {
        reachEnd: false,
      },
    };
    it('send message success', () => {
      const action = sendMessage.success({
        roomId: 'demo',
      });
      const state = reducer(initialState, action);
      expect(state.demo.reachEnd).toBeFalsy();
    });
    it('broadcast message success', () => {
      const action = sendMessage.success({
        roomId: 'demo',
        isBroadcast: true,
      });
      const state = reducer(initialState, action);
      expect(state.demo.reachEnd).toBe(false);
    });
    it('receive message', () => {
      const action = receiveMessage({
        roomId: 'demo',
      });
      const state = reducer(initialState, action);
      expect(state.demo.reachEnd).toBe(false);
    });
    it('reset archive reach end, handle archive only message.', () => {
      const action = resetArchiveReachEnd({
        roomId: 'demo',
      });
      const state = reducer(initialState, action);
      expect(state.demo.reachEnd).toBe(false);
    });
  });
});
