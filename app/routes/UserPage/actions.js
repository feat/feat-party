import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';

import { userList as userListSchema } from '@/schema';

import { fetchUserList as fetchUserListRequest } from './requests';

export const NS = 'USERPAGE';
export const fetchuserLists = createRoutine(`${NS}/FETCH_USER_LISTS`);
export const asyncFetchUserList = () => async (dispatch) => {
  try {
    const { data } = await fetchUserListRequest();
    const normalized = normalize(data, [userListSchema]);

    dispatch(
      fetchuserLists.success({
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    console.log(err);
  }
};
