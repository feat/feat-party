import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'

// import notification from '@feat/feat-ui/lib/notification';

import {
  setHomeDomain as setHomeDomainRequest,

} from '@/client/user'

import {
  //   userInfo as userInfoSchema,
  profile as profileSchema,
} from '@/schema'

const NS = 'SETTINGS/ACCOUNT';

export const fetchAccountInfo = createRoutine(`${NS}/FETCH_DATA`);
export const setHomeDomain = createRoutine(`${NS}/SET_HOME_DOMAIN`);
// export const addEmail = createRoutine(`${NS}/ADD_EMAIL`);
// export const deleteEmail = createRoutine(`${NS}/DELETE_EMAIL`);

// export const addPhone = createRoutine(`${NS}/ADD_PHONE`);
// export const deletePhone = createRoutine(`${NS}/DELETE_PHONE`);

export const asyncSetHomeDomain = (payload) => async (dispatch) => {
  try {
    const { data: profile } = await setHomeDomainRequest(
      payload,
    );
    const normalized = normalize(profile, profileSchema);
    dispatch(setHomeDomain.success({
      entities: normalized.entities,
    }));
  } catch (err) {
    dispatch(setHomeDomain.failure(err));
    throw err;
  }
}
