import { confirmDemandCreation } from '../actions/demand-creation';
import { fetchDemands } from '../actions/demand-dash';

import reducer, { getListKey } from '../reducers/demand-dash';

describe('Demand Dash', () => {
  describe('fetch demands', () => {
    let state;
    const params = { search: '', sortField: 'id', order: 'asc' };
    it('trigger', () => {
      const action = fetchDemands(params);
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key].onceFetched).toBe(true);
    });
    it('request', () => {
      const action = fetchDemands.request(params);
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].isFetching).toBe(true);
    });
    it('success', () => {
      const action = fetchDemands.success({
        ...params,
        data: {
          list: [1, 2, 3, 4],
          next: { page: 2, page_size: 3 },
        },
      });
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].items).toContain(1);
      expect(state.lists[key].items).toContain(2);
      expect(state.lists[key].items).toContain(3);
      expect(state.lists[key].items).toContain(4);
    });
    it('failure', () => {
      const error = new Error('fetch err');
      const action = fetchDemands.failure({
        ...params,
        data: error,
      });
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].fetchError).toBe(error);
    });
    it('fulfill', () => {
      const action = fetchDemands.fulfill(params);
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].isFetching).toBe(false);
    });
  });

  describe('handle demand created', () => {
    it('prepend id if default list is loaded', () => {
      let state;
      state = reducer(
        state,
        fetchDemands.success({
          data: {
            list: [2, 3, 4],
          },
        }),
      );
      const action = confirmDemandCreation.success({
        demandId: 1,
      });
      state = reducer(state, action);
      const key = getListKey();
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].items).toContain(1);
    });
  
    it('ignore demand creation if default list is not loaded.', () => {
      let state = reducer(undefined, { type: 'DEMO' });
      const action = confirmDemandCreation.success({
        demandId: 1,
      });
      state = reducer(state, action);
      expect(state).toEqual(state);
    });
  })
  
});
