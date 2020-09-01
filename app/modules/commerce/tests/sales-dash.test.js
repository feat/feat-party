import {
  // fetchSalesBriefInfo,
  fetchSalesOrders,
  // markSalesOrderUpdateAsRead,
} from '../actions/sales';
import { orderUpdated } from '../actions/order';

import reducer, { getListKey } from '../reducers/sales-dash';
import { ORDER_STATUS_PAID, ORDER_STATUS_CANCELED } from '../constants';

describe('EXC -- Purchase Dash', () => {

  describe('fetch orders', () => {
    const query = { sortField: 'id', order: 'desc' };
    let state;
    it('trigger', () => {
      const action = fetchSalesOrders(query);
      state = reducer(state, action);
      const key = getListKey(query);

      const listState = state.lists[key];
      expect(listState.onceFetched).toBe(true);
    });
    it('request', () => {
      const action = fetchSalesOrders.request(query);
      state = reducer(state, action);
      const key = getListKey(query);

      const listState = state.lists[key];
      expect(listState.isFetching).toBe(true);
    });
    it('success', () => {
      const items = [1, 2, 3];
      const next = { page_size: 3, page: 2 };
      const action = fetchSalesOrders.success({
        params: query,
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
      const action = fetchSalesOrders.fulfill(query);
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
      fetchSalesOrders.success({
        data: {
          list: [8, 7, 6],
          next: {},
          total_count: 8,
        },
      }),
    );
    it('prepend if is new order', () => {
      const action = orderUpdated({
        orderId: 9,
        data: { status: ORDER_STATUS_PAID },
        info: { action: 'create' },
        isPurchase: false,
      });
      state = reducer(state, action);
      const listKey = getListKey();
      const listState = state.lists[listKey];
      expect(listState.items).toContain(9);
    });

    it('ignore if is not new order', () => {
      const action = orderUpdated({
        orderId: 6,
        data: { status: ORDER_STATUS_CANCELED },
        isPurchase: false,
      });
      const listKey = getListKey();
      const listState = state.lists[listKey];

      state = reducer(state, action);
      const newListState = state.lists[listKey];

      expect(newListState).toBe(listState);
    });

    it('ignore purchase order', () => {
      const action = orderUpdated({
        orderId: 10,
        data: { status: ORDER_STATUS_PAID },
        isPurchase: true,
      });
      const listKey = getListKey();
      const listState = state.lists[listKey];

      state = reducer(state, action);
      const newListState = state.lists[listKey];

      expect(newListState).toBe(listState);
    });
  });
});
