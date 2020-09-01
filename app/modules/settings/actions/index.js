import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';
import { userInfo as userInfoSchema } from '@/schema';

import { getUserInfo as fetchUserInfoRequest } from '@/client/user';

export const fetchUserInfo = createRoutine(`SETTINGS/FETCH_USER_INFO`);

export const asyncFetchUserInfo = (query, meta = {}) => async (dispatch) => {
  dispatch(fetchUserInfo.trigger());
  try {
    dispatch(fetchUserInfo.request());
    const { data } = await fetchUserInfoRequest(query, meta.headers);
    const normalized = normalize(data, userInfoSchema);
    dispatch(
      fetchUserInfo.success({
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(fetchUserInfo.failure(err));
    throw err;
  } finally {
    dispatch(fetchUserInfo.fulfill());
  }
};
