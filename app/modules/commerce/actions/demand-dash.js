import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import { normalize } from 'normalizr';

import { fetchDemands as fetchDemandsRequest } from '@/client/service';
import { serviceDemand as serviceDemandSchema } from '@/schema';

const NS = `EXC/DEMAND_DASH`;

export const fetchDemands = createRoutine(`${NS}/FETCH_DEMANDS`);
export const fetchBriefInfo = createRoutine(`${NS}/FETCH_BRIEF_INFO`);
export const markDemandUpdateAsRead = createRoutine(
  `${NS}/MARK_DEMAND_UPDATE_AS_READ`,
);

// ui
export const setSortField = createAction(`${NS}/SET_SORT_FIELD`);
export const setOrderType = createAction(`${NS}/SET_ORDER_TYPE`);
export const updateSearchString = createAction(`${NS}/UPDATE_SEARCH_STRING`);

export const asyncFetchDemands = (payload) => async (dispatch) => {
  dispatch(fetchDemands.trigger(payload));
  try {
    dispatch(fetchDemands.request(payload));
    const { data, pagination } = await fetchDemandsRequest({
      page_size: payload.pageSize,
      page: payload.page,
    });
    const normalized = normalize(data, [serviceDemandSchema]);
    dispatch(
      fetchDemands.success({
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
    dispatch(fetchDemands.failure({
      ...payload,
      data: err,
    }));
    throw err;
  } finally {
    dispatch(fetchDemands.fulfill(payload));
  }
}