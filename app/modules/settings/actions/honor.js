import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'

import {
  getHonors as fetchHonorsRequest,
  addHonor as addHonorRequest,
  deleteHonor as deleteHonorRequest,
} from '@/client/user'

import { selectCurrentUser } from '@/modules/auth/selectors'

import {
  userInfo as userInfoSchema,
  honor as honorSchema,
} from '@/schema'

export const NS = 'SETTINGS/HONOR'

export const fetchHonors = createRoutine(`${NS}/FETCH_USER_DATA`);
export const createHonor = createRoutine(`${NS}/CREATE`);
export const deleteHonor = createRoutine(`${NS}/DELETE`);


const INFO_KEY = 'honors_awards';

export const asyncFetchHonors = () => async (dispatch, getState) => {
  dispatch(fetchHonors.trigger());
  try {
    dispatch(fetchHonors.request());
    const { data } = await fetchHonorsRequest();
    const normalized = normalize(data, [honorSchema]);
    const currentUser = selectCurrentUser(getState())
    dispatch(fetchHonors.success({
      list: normalized.result,
      entities: normalized.entities,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: (info = {}) => ({
              ...info,
              [INFO_KEY]: normalized.result,
            }),
          },
        },
      ],
    }))
  } catch (err) {
    dispatch(fetchHonors.failure(err));
    throw err;
  } finally {
    dispatch(fetchHonors.fulfill());
  }
}

export const asyncCreateHonor = (payload) => async (dispatch, getState) => {
  try {
    const { data: honor } = await addHonorRequest(payload);
    const normalized = normalize(honor, honorSchema);
    const currentUser = selectCurrentUser(getState())
    dispatch(
      createHonor.success({
        honorId: normalized.result,
        entities: normalized.entities,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                [INFO_KEY]: (list = []) => [...list, honor.id],
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    dispatch(createHonor.failure(err));
    throw err;
  }
}

export const asyncDeleteHonor = (payload) => async (dispatch, getState) => {
  try {
    await deleteHonorRequest(payload.id);
    const currentUser = selectCurrentUser(getState())
    dispatch(
      deleteHonor.success({
        honorId: payload.id,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                [INFO_KEY]: (list = []) =>
                  list.filter((item) => item !== payload.id),
              },
            },
          },
        ],
      }),
    );
    return { honorId: payload.id };
  } catch (err) {
    dispatch(deleteHonor.failure(err));
    throw err;
  }
}