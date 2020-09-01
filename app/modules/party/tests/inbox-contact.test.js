import {
  getInboxContacts,
  blackUser,
  postFriendRequest,
  replaceContact,
  // updateContactTime,
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

import reducer from '../reducers/inboxContact';

describe('Party - Inbox Contact', () => {
  describe('fetch inbox contacts', () => {
    let state;
    let failureError;

    it('request', () => {
      const action = getInboxContacts.request();
      state = reducer(state, action);
      expect(state.fetching).toBe(true);
    });
    it('success', () => {
      const contacts = [1, 2, 3];
      const action = getInboxContacts.success({
        list: contacts,
      });
      state = reducer(state, action);
      expect(state.list).toEqual(contacts);
    });
    it('failure', () => {
      const error = new Error('DEMO');
      const action = getInboxContacts.failure(error);
      failureError = reducer(state, action);
      expect(failureError.error).toEqual(error);
    });
    it('trigger(refetch)', () => {
      const action = getInboxContacts();
      const resetState = reducer(state, action);
      expect(resetState.error).toBe(null);
    });
    it('fulfill', () => {
      const action = getInboxContacts.fulfill();
      state = reducer(state, action);
      expect(state.fetching).toBe(false);
      expect(state.initFetched).toBe(true);
    });
  });

  describe('remove contact for some events', () => {
    const baseState = {
      fetching: false,
      list: [2, 3, 4, 8],
      initFetched: true,
    };
    it('black user', () => {
      const action = blackUser.success({
        userId: 1,
        contactId: 3,
      });
      const state = reducer(baseState, action);
      expect(state.list).not.toContain(3);
    });
    it('black group', () => {
      const action = blackGroup.success({
        groupId: 3,
        contactId: 4,
      });
      const state = reducer(baseState, action);
      expect(state.list).not.toContain(4);
    });
    it('dismiss group', () => {
      const action = dismissGroup.success({
        groupId: 3,
        contactId: 3,
      });
      const state = reducer(baseState, action);
      expect(state.list).not.toContain(3);
    });
    it('group is dismissed', () => {
      const action = receiveDismissGroupInfo({
        groupId: 4,
        contactId: 8,
      });
      const state = reducer(baseState, action);
      expect(state.list).not.toContain(8);
    });
    it('group auto merged', () => {
      const action = postGroupMerge.success({
        sourceContactId: 8,
        userIsOwnerOfBoth: true,
      });
      const state = reducer(baseState, action);
      expect(state.list).not.toContain(8);
    });
    it('group merged into anther group', () => {
      const action = receiveAcceptGroupMergeInfo({
        sourceGroupId: 3,
        sourceGroupContactId: 3,
      });
      const state = reducer(baseState, action);
      expect(state.list).not.toContain(3);
    });
  });

  describe('add contact for some events', () => {
    const baseState = {
      list: [2, 4, 6, 8],
      initFetched: true,
    };
    it('unblack user', () => {
      const action = unblackUser.success({
        userId: 20,
        contactId: 3,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(3);
    });
    it('unblack group', () => {
      const action = unblackGroup.success({
        groupId: 20,
        contactId: 5,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(5);
    });
    it('group created', () => {
      const action = createGroup.success({
        groupId: 22,
        contactId: 10,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(10);
    });
    it('group restored', () => {
      const action = restoreGroup.success({
        groupId: 23,
        contactId: 11,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(11);
    });
    it('group restored info received', () => {
      const action = receiveRestoreGroupInfo({
        groupId: 23,
        contactId: 11,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(11);
    });
    it('add contact, (new message)', () => {
      const action = addContact({
        contactId: 12,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(12);
    });
    it('add temp contact', () => {
      const action = addTempContact({
        contactId: 'TMP_DEMO',
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain('TMP_DEMO');
      expect(state.list).toEqual([2, 'TMP_DEMO', 4, 6, 8]);
    });
    it('add stranger, move from archive', () => {
      const action = moveContactToInbox({
        contactId: 13,
      });
      const state = reducer(baseState, action);
      expect(state.list).toContain(13);
      expect(state.list).toEqual([2, 13, 4, 6, 8]);
    });
  });

  describe('replace or insert contact', () => {
    it('replace', () => {
      const initialState = {
        list: ['TMP_DEMO', 1, 'TMP_NOMO', 12],
      };
      const action = replaceContact({
        originContactId: 'TMP_NOMO',
        contactId: 4,
      });
      const state = reducer(initialState, action);
      expect(state.list).toContain(4);
      expect(state.list).not.toContain('TMP_NOMO');
      expect(state.list).toEqual(['TMP_DEMO', 1, 4, 12]);
    });

    it('post friend-request success, temp contact exists', () => {
      const initialState = {
        list: [1, 2, 3, 'TMP_DEMO', 4],
      };
      const action = postFriendRequest.success({
        originContactId: 'TMP_DEMO',
        contactId: 8,
      });
      const state = reducer(initialState, action);
      expect(state.list).toEqual([1, 2, 3, 8, 4]);
    });
    it('post friend-request success, contact exists', () => {
      const initialState = {
        list: [1, 2, 3, 4],
      };
      const action = postFriendRequest.success({
        originContactId: 'TMP_DEMO',
        contactId: 4,
      });
      const state = reducer(initialState, action);
      expect(state.list).toEqual([1, 4, 2, 3]);
    });
  });

  it('update contact time', () => {});
});
