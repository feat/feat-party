import {
  // fetchPurchaseBriefInfo,
  fetchPurchaseOrders,
  // markPurchaseOrderUpdateAsRead,
} from '../actions/purchase';

import reducer, { getListKey } from '../reducers/purchase-dash';
import { ORDER_STATUS_CANCELED } from '../constants';
import { orderUpdated } from '../actions/order';

describe('EXC -- Purchase Dash', () => {
  describe('fetch orders', () => {
    const query = { sortField: 'id', order: 'desc' };
    let state;
    it('trigger', () => {
      const action = fetchPurchaseOrders(query);
      state = reducer(state, action);
      const key = getListKey(query);

      const listState = state.lists[key];
      expect(listState.onceFetched).toBe(true);
    });
    it('request', () => {
      const action = fetchPurchaseOrders.request(query);
      state = reducer(state, action);
      const key = getListKey(query);

      const listState = state.lists[key];
      expect(listState.isFetching).toBe(true);
    });
    it('success', () => {
      const items = [1, 2, 3];
      const next = { page_size: 3, page: 2 };
      const action = fetchPurchaseOrders.success({
        ...query,
        data: {
          list: items,
          next,
          total_count: 10,
        },
      });
      state = reducer(state, action);
      const key = getListKey(query);
      const listState = state.lists[key];
      expect(listState.items).toContain(1);
      expect(listState.items).toContain(2);
      expect(listState.items).toContain(3);
      expect(listState.next).toBe(next);
      expect(listState.count).toBe(10);
    });
    it('fulfill', () => {
      const action = fetchPurchaseOrders.fulfill(query);
      state = reducer(state, action);
      const key = getListKey(query);

      const listState = state.lists[key];
      expect(listState.isFetching).toBe(false);
    });
  });

  describe('handle order updated', () => {
    let state;
    state = reducer(
      state,
      fetchPurchaseOrders.success({
        data: {
          list: [8, 7, 6],
          next: {},
          total_count: 8,
        },
      }),
    );

    it('ignore sales order', () => {
      const action = orderUpdated({
        orderId: 5,
        data: { status: ORDER_STATUS_CANCELED },
        isPurchase: false,
      });
      const listKey = getListKey();
      const listState = state.lists[listKey];

      state = reducer(state, action);
      const newListState = state.lists[listKey];

      expect(newListState).toBe(listState);
    });

    it('append purchase order', () => {
      const action = orderUpdated({
        orderId: 5,
        data: { status: ORDER_STATUS_CANCELED },
        isPurchase: true,
      });

      state = reducer(state, action);
      const listKey = getListKey();
      const listState = state.lists[listKey];
      expect(listState.items).toContain(5);
    });
  });

});
