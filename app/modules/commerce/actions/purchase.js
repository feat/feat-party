import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import { normalize } from 'normalizr';

import { serviceOrder as serviceOrderSchema } from '@/schema';

import {
  fetchPurchaseOrders as fetchPurchaseOrdersRequest,
  markOrderUpdateAsRead as markOrderUpdateAsReadRequest,
} from '@/client/commerce';


const NS = `EXC/PURCHASE`;

export const fetchPurchaseBriefInfo = createRoutine(`${NS}/FETCH_BRIEF_INFO`);
export const fetchPurchaseOrders = createRoutine(`${NS}/FETCH_ORDERS`);
export const markPurchaseOrderUpdateAsRead = createRoutine(
  `${NS}/MARK_ORDER_UPDATE_AS_READ`,
);

// ui
export const setSortField = createAction(`${NS}/SET_SORT_FIELD`);
export const setOrderType = createAction(`${NS}/SET_ORDER_TYPE`);
export const updateSearchString = createAction(`${NS}/UPDATE_SEARCH_STRING`);

export const asyncFetchPurchaseOrders = (payload) => async (dispatch) => {
  dispatch(fetchPurchaseOrders.trigger(payload))
  try {
    dispatch(fetchPurchaseOrders.request(payload));
    const { data, pagination } = await fetchPurchaseOrdersRequest({
      search: payload.search,
      page_size: payload.pageSize,
      page: payload.page,
    });
    const normalized = normalize(data, [serviceOrderSchema]);
    dispatch(
      fetchPurchaseOrders.success({
        ...payload,
        data: {
          list: normalized.result,
          next: pagination.next
            ? {
              page_size: pagination.page_size,
              page: pagination.next,
            }
            : null,
          total_count: pagination.total_count,
        },
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchPurchaseOrders.failure({
        params: payload,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchPurchaseOrders.fulfill(payload));
  }
}

export const asyncMarkPurchaseOrderUpdateAsRead = (payload) => async (dispatch) => {
  try {
    dispatch(markPurchaseOrderUpdateAsRead.request(payload));
    const res = await markOrderUpdateAsReadRequest(payload.orderId);
    if (!res.error) {
      dispatch(
        markPurchaseOrderUpdateAsRead.success({
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
    // dispatch(markPurchaseOrderUpdateAsRead.failure(err));
    throw err;
  } finally {
    // dispatch(markPurchaseOrderUpdateAsRead.fulfill(payload));
  }
}