import { fetchDemand } from '../actions/demand';
import reducer from '../reducers/demand';

describe('Demand Detail', () => {
  describe('fetch', () => {
    let state;
    const demandId = 'DEMO';
    it('trigger', () => {
      state = reducer(
        state,
        fetchDemand.trigger({
          demandId,
        }),
      );
      expect(state[demandId]).toBeTruthy();
    });
    it('request', () => {
      state = reducer(
        state,
        fetchDemand.request({
          demandId,
        }),
      );
      expect(state[demandId].fetching).toBe(true);
    });
    it('success', () => {
      state = reducer(
        state,
        fetchDemand.success({
          demandId,
          fetchedAt: '123123',
        }),
      );
      expect(state[demandId].demand).toBe(demandId);
      expect(state[demandId].fetchedAt).toBe('123123');
    });
    it('failure', () => {
      const error = new Error('demo');
      state = reducer(
        state,
        fetchDemand.failure({
          demandId,
          data: error,
        }),
      );
      expect(state[demandId].fetchError).toBe(error);
    });
    it('fulfill', () => {
      state = reducer(
        state,
        fetchDemand.fulfill({
          demandId,
        }),
      );
      expect(state[demandId].fetching).toBe(false);
    });
  });
});
