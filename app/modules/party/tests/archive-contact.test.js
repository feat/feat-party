import {
  getArchiveContacts,
  createGroup,
  addContact,
  blackUser,
  addTempContact,
} from '../actions';

import reducer from '../reducers/archiveContact';

describe('Party - Archive Contact', () => {
  describe('fetch archive contacts', () => {
    let state;
    let failureState;
    it('request', () => {
      const action = getArchiveContacts.request();
      state = reducer(state, action);
      expect(state.fetching).toBe(true);
    });
    it('success', () => {
      const contacts = [1, 2, 3];
      const action = getArchiveContacts.success({
        list: contacts,
      });
      state = reducer(state, action);
      expect(state.list).toEqual(contacts);
    });
    it('failure', () => {
      const error = new Error('DEMO');
      const action = getArchiveContacts.failure(error);
      failureState = reducer(state, action);
      expect(failureState.error).toBe(error);
    });
    it('trigger', () => {
      const action = getArchiveContacts();
      const resetState = reducer(state, action);
      expect(resetState.error).toBe(null);
      expect(resetState.shouldRefresh).toBe(false);
    });
    it('fulfill', () => {
      const action = getArchiveContacts.fulfill();
      state = reducer(state, action);
      expect(state.fetching).toBe(false);
    });
  });

  // NOTE: may not needs to refresh...
  describe('mark list refresh required', () => {
    const initialState = {
      initFetched: true,
      shouldRefresh: false,
      list: [1, 2, 3],
    };
    it('group created', () => {
      const action = createGroup.success({
        groupId: 1,
      });
      const state = reducer(initialState, action);
      expect(state.shouldRefresh).toBe(true);
    });
    it('add temp contact', () => {
      const action = addTempContact({
        contactId: 'TMP_DEMO',
      });
      const state = reducer(initialState, action);
      expect(state.shouldRefresh).toBe(true);
    });
    it('add contact', () => {
      const action = addContact({
        contactId: 123,
      });
      const state = reducer(initialState, action);
      expect(state.shouldRefresh).toBe(true);
    });
    it('black user', () => {
      const action = blackUser.success({
        userId: '12313',
      });
      const state = reducer(initialState, action);
      expect(state.shouldRefresh).toBe(true);
    });
  });
});
