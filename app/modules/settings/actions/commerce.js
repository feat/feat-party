import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'

import {
  getWorkplace as fetchWorkplaceRequest,
  updateWorkplace as updateWorkplaceRequest,
  getOpenTimes as fetchOpenTimesRequest,
  updateUserOpenTime as updateOpenTimeRequest,
  updateProfile as updateProfileRequest,
} from '@/client/user'

import {
  userInfo as userInfoSchema,
  address as addressSchema,
  profile as profileSchema,
} from '@/schema'

import { selectCurrentUser } from '@/modules/auth/selectors';


export const NS = 'SETTINGS/EXC'

// promote
export const updateSignBoard = createRoutine(`${NS}/UPDATE_SIGN_BOARD`);
export const asyncUpdateSignBoard = (payload) => async (dispatch, getState) => {
  try {
    const currentUser = selectCurrentUser(getState());
    const { data: profile } = await updateProfileRequest(
      currentUser.uid,
      {
        commercial_sign: payload.commercial_sign,
        promote_words: payload.promote_words,
      },
    );
    const normalized = normalize(profile, profileSchema);
    dispatch(
      updateSignBoard.success({
        entities: normalized.entities,
      }),
    );
    return {
      commercial_sign: profile.commercial_sign,
      promote_words: profile.promote_words,
    }
  } catch (err) {
    dispatch(updateSignBoard.failure(err));
    throw err;
  }
}

// workplace 
export const fetchWorkplace = createRoutine(`${NS}/FETCH_WORKPLACE`);
export const asyncFetchWorkplace = () => async (dispatch, getState) => {
  dispatch(fetchWorkplace.trigger());
  try {
    dispatch(fetchWorkplace.request());
    const data = await fetchWorkplaceRequest();
    const currentUser = selectCurrentUser(getState())
    if (data) {
      const normalized = normalize(data, addressSchema);
      dispatch(fetchWorkplace.success({
        workplaceId: normalized.result,
        entities: normalized.entities,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: (info = {}) => ({
                ...info,
                workplace: normalized.result,
              }),
            },
          },
        ],
      }))
    } else {
      dispatch(fetchWorkplace.success({
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: (info = {}) => ({
                ...info,
                workplace: null,
              }),
            },
          },
        ],
      }));
    }
  } catch (err) {
    dispatch(fetchWorkplace.failure(err));
    throw err;
  } finally {
    dispatch(fetchWorkplace.fulfill());
  }
}

export const updateWorkplace = createRoutine(`${NS}/UPDATE_WORKPLACE`);
export const asyncUpdateWorkplace = (payload) => async (dispatch, getState) => {
  try {
    const { data: newWorkplace } = await updateWorkplaceRequest(payload);
    const currentUser = selectCurrentUser(getState());
    const normalized = normalize(newWorkplace, addressSchema);
    dispatch(
      updateWorkplace.success({
        data: newWorkplace,
        entities: normalized.entities,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                workplace: { $set: normalized.result },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    dispatch(updateWorkplace.failure(err));
    throw err;
  }
}

// open time
export const fetchOpenTimes = createRoutine(`${NS}/FETCH_OPEN_TIMES`);
export const asyncFetchOpenTimes = () => async (dispatch, getState) => {
  dispatch(fetchOpenTimes.trigger());
  try {
    dispatch(fetchOpenTimes.request());
    const { data } = await fetchOpenTimesRequest(); // missing timezone info
    const currentUser = selectCurrentUser(getState())
    dispatch(fetchOpenTimes.success({
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: (info = {}) => ({
              ...info,
              open_time: {
                open_time: data,
              },
            }),
          },
        },
      ],
    }))
  } catch (err) {
    dispatch(fetchOpenTimes.failure(err));
    throw err;
  } finally {
    dispatch(fetchOpenTimes.fulfill());
  }
}

export const updateOpenTime = createRoutine(`${NS}/UPDATE_OPEN_TIME`);
export const asyncUpdateOpenTime = (payload) => async (dispatch, getState) => {
  try {
    const currentUser = selectCurrentUser(getState());
    const { data } = await updateOpenTimeRequest(
      currentUser.uid,
      payload,
    );
    dispatch(
      updateOpenTime.success({
        data,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                open_time: {
                  open_time: {
                    $set: data,
                  },
                },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    dispatch(updateOpenTime.failure(err));
    throw err;
  }
}