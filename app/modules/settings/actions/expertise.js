import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'
import get from 'lodash/get'

import { selectCurrentUser } from '@/modules/auth/selectors';

import {
  getExpertises as fetchExpertisesRequest,
  addExpertise as createExpertiseRequest,
  updateExpertise as updateExpertiseRequest,
  deleteExpertise as deleteExpertiseRequest,
  patchExpertise as patchExpertiseRequest,
} from '@/client/user'

import {
  user as userSchema,
  userInfo as userInfoSchema,
  expertise as expertiseSchema,
} from '@/schema'


export const NS = 'SETTINGS/EXPERTISE'

export const fetchExpertises = createRoutine(`${NS}/FETCH_USER_DATA`);
export const createExpertise = createRoutine(`${NS}/CREATE`);
export const updateExpertise = createRoutine(`${NS}/UPDATE`);
export const patchExpertise = createRoutine(`${NS}/PATCH`);
export const deleteExpertise = createRoutine(`${NS}/DELETE`);

export const asyncFetchExpertises = () => async (dispatch, getState) => {
  dispatch(fetchExpertises.trigger());
  try {
    dispatch(fetchExpertises.request());
    const { data } = await fetchExpertisesRequest();
    const normalized = normalize(data, [expertiseSchema]);
    const currentUser = selectCurrentUser(getState())
    dispatch(fetchExpertises.success({
      list: normalized.result,
      entities: normalized.entities,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: (info = {}) => ({
              ...info,
              expertise: normalized.result,
            }),
          },
        },
      ],
    }))
  } catch (err) {
    dispatch(fetchExpertises.failure(err));
    throw err;
  } finally {
    dispatch(fetchExpertises.fulfill());
  }
}

export const asyncCreateExpertise = (payload) => async (dispatch, getState) => {
  try {
    const { data: expertise } = await createExpertiseRequest(
      payload,
    );
    const normalized = normalize(expertise, expertiseSchema);
    const state = getState();
    const currentUser = selectCurrentUser(state);
    const entityMutators = [
      {
        [userInfoSchema.key]: {
          [currentUser.uid]: {
            expertise: (list) => [...list, normalized.result],
          },
        },
      },
    ];
    if (expertise.is_primary) {
      const records = get(state, ['entities', userInfoSchema.key, currentUser.uid, 'expertise']);
      entityMutators.push({
        [userSchema.key]: {
          [currentUser.uid]: {
            expertise: {
              $set: expertise.name,
            },
          },
        },
      })
      if (records && records.length) {
        entityMutators.push({
          [expertiseSchema.key]: (map = {}) => {
            const newMap = {...map};
            records.forEach((id) => {
              newMap[id] = {
                ...newMap[id],
                is_primary: false,
              }
            })
            return newMap;
          },
        });
      }
    }
    dispatch(
      createExpertise.success({
        data: expertise,
        entities: normalized.entities,
        entityMutators,
      }),
    );
    return expertise;
  } catch (err) {
    dispatch(createExpertise.failure(err));
    throw err;
  }
}

export const asyncUpdateExpertise = (payload) => async (dispatch, getState) => {
  try {
    const { id, data } = payload;
    const { data: expertise } = await updateExpertiseRequest(id, data);
    const normalized = normalize(expertise, expertiseSchema);
    //  handle expertise primary.
    const state = getState();
    const currentUser = selectCurrentUser(state);
    const ids = get(state, ['entities', userInfoSchema.key, currentUser.uid, 'expertise']);
    const entityMutators = [];
    if (expertise.is_primary) {
      if (ids && ids.length > 1) {
        entityMutators.push({
          [userSchema.key]: {
            [currentUser.uid]: {
              expertise: {
                $set: expertise.name,
              },
            },
          },
        })
        entityMutators.push({
          [expertiseSchema.key]: (map = {}) => {
            const newMap = {...map};
            ids.forEach((item) => {
              if (item === expertise.id) {
                return;
              }
              newMap[item] = {
                ...newMap[item],
                is_primary: false,
              }
            });
            return newMap;
          },
        })
      }
    }

    dispatch(
      updateExpertise.success({
        entities: normalized.entities,
        entityMutators,
      }),
    );
    return expertise;
  } catch (err) {
    dispatch(updateExpertise.failure(err));
    throw err;
  }
}

export const asyncPatchExpertise = (payload) => async (dispatch) => {
  try {
    const { id, data } = payload;
    const { data: expertise } = await patchExpertiseRequest(id, data);
    const normalized = normalize(expertise, expertiseSchema);
    dispatch(patchExpertise.success({
      entities: normalized.entities,
    }));
    return expertise;
  } catch (err) {
    dispatch(patchExpertise.failure(err));
    throw err;
  }
}

export const asyncDeleteExpertise = (payload) => async (dispatch, getState) => {
  try {
    await deleteExpertiseRequest(payload.id);

    const currentUser = selectCurrentUser(getState());

    dispatch(
      deleteExpertise.success({
        expertiseId: payload.id,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                expertise: (list = []) =>
                  list.filter((item) => item !== payload.id),
              },
            },
          },
        ],
      }),
    );
    
  } catch (err) {
    dispatch(deleteExpertise.failure(err));
    throw err;
  }
}