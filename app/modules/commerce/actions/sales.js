import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import { normalize } from 'normalizr';

import {
  fetchSalesOrders as fetchSalesOrdersRequest,
  markOrderUpdateAsRead as markOrderUpdateAsReadRequest,
} from '@/client/commerce';

import { serviceOrder as serviceOrderSchema } from '@/schema';

const NS = `EXC/SALES`;

export const fetchSalesBriefInfo = createRoutine(`${NS}/FETCH_BRIEF_INFO`);
export const fetchSalesOrders = createRoutine(`${NS}/FETCH_ORDERS`);
export const markSalesOrderUpdateAsRead = createRoutine(
  `${NS}/MARK_ORDER_UPDATE_AS_READ`,
);

// ui
export const setSortField = createAction(`${NS}/SET_SORT_FIELD`);
export const setOrderType = createAction(`${NS}/SET_ORDER_TYPE`);
export const updateSearchString = createAction(`${NS}/UPDATE_SEARCH_STRING`);

export const asyncFetchSalesOrders = (payload) => async (dispatch) => {
  dispatch(fetchSalesOrders.trigger(payload));
  try {
    dispatch(fetchSalesOrders.request(payload));
    const { data, pagination } = await fetchSalesOrdersRequest({
      search: payload.search,
      page_size: payload.pageSize,
      page: payload.page,
    });
    const normalized = normalize(data, [serviceOrderSchema]);
    dispatch(
      fetchSalesOrders.success({
        ...payload,
        data: {
          list: normalized.result,
          next: pagination.next
            ? {
              page: pagination.next,
              page_size: pagination.page_size,
            }
            : null,
          total_count: pagination.total_count,
        },
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchSalesOrders.failure({
        params: payload,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchSalesOrders.fulfill(payload));
  }
}

export const asyncMarkSalesOrderUpdateAsRead = (payload) => async (dispatch) => {
  try {
    dispatch(markSalesOrderUpdateAsRead.request(payload));
    const res = await markOrderUpdateAsReadRequest(payload.orderId);
    if (!res.error) {
      dispatch(
        markSalesOrderUpdateAsRead.success({
          orderId: payload.orderId,
          entityMutators: [
            {
              [serviceOrderSchema.key]: {
                [payload.orderId]: {
                  has_update: {
                    $set: false,
                  },
                },
              },
            },
          ],
        }),
      );
    }
  } catch (err) {
    dispatch(markSalesOrderUpdateAsRead.failure(payload));
    throw err;
  } finally {
    dispatch(markSalesOrderUpdateAsRead.fulfill(payload));
  }
}