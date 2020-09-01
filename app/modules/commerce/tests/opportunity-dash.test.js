import reducer, { getListKey } from '../reducers/opportunity-dash';
import { fetchOpportunities } from '../actions/opportunity-dash';
import { postBid } from '../actions/opportunity'

describe('Opportunity Dash', () => {  
  describe('fetch opportunities', () => {
    let state;
    const params = { type: 'new' };
    it('trigger', () => {
      const action = fetchOpportunities(params);
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key].onceFetched).toBe(true);
    });
    it('request', () => {
      const action = fetchOpportunities.request(params);
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].isFetching).toBe(true);
    });
    it('success', () => {
      const action = fetchOpportunities.success({
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
    it('failure' ,() => {
      const error = new Error('fetch err');
      const action = fetchOpportunities.failure({
        ...params,
        data: error,
      });
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].fetchError).toBe(error);
    });
    it('fulfill', () => {
      const action = fetchOpportunities.fulfill(params);
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].isFetching).toBe(false);
    });

    it('load next', () => {
      const action = fetchOpportunities.success({
        ...params,
        data: {
          list: [6, 7],
          next: null,
        },
      });
      state = reducer(state, action);
      const key = getListKey(params);
      expect(state.lists[key]).toBeTruthy();
      expect(state.lists[key].items).toContain(6);
      expect(state.lists[key].items).toContain(7);
    })
    
  });

  describe('handle post bid', () => {
    it('try to prepend post bid', () => {
      let state; 
      state = reducer(undefined, fetchOpportunities.success({
        type: 'participated',
        data: {
          list: [1, 2, 3, 4],
          next: { page: 2, page_size: 3 },
        },
      }))
      const action = postBid.success({
        demandId: 10,
      });
      state = reducer(state, action);
      const key = getListKey({ type: 'participated' });
      expect(state.lists[key].items).toContain(10);
    });
  });

  // describe('Meta Info', () => {
  //   const demandId = 10;
  //   let state;
  //   describe('ignore opp', () => {
  //     it('request', () => {
  //       const action = ignoreDemand.request({ demandId });
  //       state = reducer(state, action);
  //       expect(state.meta[demandId].isIgnoring).toBe(true);
  //     });
  //     it('success', () => {
  //       const action = ignoreDemand.success({ demandId });
  //       state = reducer(state, action);
  //       expect(state.meta[demandId].hasIgnored).toBe(true);
  //     });
  //     it('fulfill', () => {
  //       const action = ignoreDemand.fulfill({ demandId });
  //       state = reducer(state, action);
  //       expect(state.meta[demandId].isIgnoring).toBe(false);
  //     });
  //   });
  //   describe('abandon opp', () => {
  //     it('request', () => {
  //       const action = abandonDemand.request({ demandId });
  //       state = reducer(state, action);
  //       expect(state.meta[demandId].isAbandoning).toBe(true);
  //     });
  //     it('success', () => {
  //       const action = abandonDemand.success({ demandId });
  //       state = reducer(state, action);
  //       expect(state.meta[demandId].hasAbandoned).toBe(true);
  //     });
  //     it('fulfill', () => {
  //       const action = abandonDemand.fulfill({ demandId });
  //       state = reducer(state, action);
  //       expect(state.meta[demandId].isAbandoning).toBe(false);
  //     });
  //   });
  // });
});
