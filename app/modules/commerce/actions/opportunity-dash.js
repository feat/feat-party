import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import { normalize } from 'normalizr';

import {
  fetchOpportunities as fetchOpportunitiesRequest,
  demandOpportunities as fetchParticipatedRequest,
} from '@/client/service';

import { serviceDemand as serviceDemandSchema } from '@/schema';

const NS = `EXC/OPP_DASH`;

export const fetchOpportunities = createRoutine(`${NS}/FETCH_OPPORTUNITIES`);
export const fetchBriefInfo = createRoutine(`${NS}/FETCH_BRIEF_INFO`);
export const markOppUpdateAsRead = createRoutine(
  `${NS}/MARK_OPP_UPDATE_AS_READ`,
);

// ui
export const setSortField = createAction(`${NS}/SET_SORT_FIELD`);
export const setOrderType = createAction(`${NS}/SET_ORDER_TYPE`);
export const updateSearchString = createAction(`${NS}/UPDATE_SEARCH_STRING`);
export const setListType = createAction(`${NS}/SET_LIST_TYPE`);

export const asyncFetchOpportunities = (payload) => async (dispatch) => {
  try {
    dispatch(fetchOpportunities.request(payload));
    const apiRequest =
      payload.type === 'new'
        ? fetchOpportunitiesRequest
        : fetchParticipatedRequest;
    const { data, pagination } = await apiRequest({
      page_size: payload.pageSize,
      page: payload.page,
    });
    const normalized = normalize(data, [serviceDemandSchema]);
    dispatch(
      fetchOpportunities.success({
        ...payload,
        data: {
          list: normalized.result,
          next: pagination.next ? {
            page: pagination.next,
            page_size: pagination.page_size,
          } : null,
          total_count: pagination.total_count,
        },
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(fetchOpportunities.failure({
      ...payload,
      data: err,
    }));
    throw err;
  } finally {
    dispatch(fetchOpportunities.fulfill(payload));
  }
}