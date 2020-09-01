import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

import { getBriefInfo as fetchBriefInfoRequest } from '@/client/commerce';

export const fetchDashBriefInfo = createRoutine(`EXC/FETCH_DASH_BRIEF`);
export const joinExcChannel = createAction('EXC/JOIN_EXC_CHANNEL');

export const asyncFetchDashBriefInfo = () => async (dispatch) => {
  try {
    dispatch(fetchDashBriefInfo.request());
    const { data } = await fetchBriefInfoRequest();
    dispatch(
      fetchDashBriefInfo.success(data),
    );
  } catch (err) {
    dispatch(fetchDashBriefInfo.failure(err));
    throw err;
  }
}