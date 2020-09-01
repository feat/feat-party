import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'

import {
  getCareers as fetchCareersRequest,
  addCareer as addCareerRequest,
  deleteCareer as deleteCareerRequest,
} from '@/client/user'

import { selectCurrentUser } from '@/modules/auth/selectors'

import {
  userInfo as userInfoSchema,
  career as careerSchema,
} from '@/schema'

export const NS = 'SETTINGS/CAREER'

export const fetchCareers = createRoutine(`${NS}/FETCH_USER_DATA`);
export const createCareer = createRoutine(`${NS}/CREATE`);
export const deleteCareer = createRoutine(`${NS}/DELETE`);

export const asyncFetchCareers = () => async (dispatch, getState) => {
  dispatch(fetchCareers.trigger());
  try {
    dispatch(fetchCareers.request());
    const { data } = await fetchCareersRequest();
    const normalized = normalize(data, [careerSchema]);
    const currentUser = selectCurrentUser(getState())
    dispatch(fetchCareers.success({
      list: normalized.result,
      entities: normalized.entities,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: (info = {}) => ({
              ...info,
              career_experiences: normalized.result,
            }),
          },
        },
      ],
    }))
  } catch (err) {
    dispatch(fetchCareers.failure(err));
    throw err;
  } finally {
    dispatch(fetchCareers.fulfill());
  }
}

export const asyncCreateCareer = (payload) => async (dispatch, getState) => {
  try {
    dispatch(createCareer.request())
    const { data: career } = await addCareerRequest(payload);
    const normalized = normalize(career, careerSchema);
    const currentUser = selectCurrentUser(getState())
    dispatch(
      createCareer.success({
        careerId: normalized.result,
        entities: normalized.entities,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                career_experiences: (list = []) => [...list, career.id],
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    dispatch(createCareer.failure(err));
    throw err;
  }
}

export const asyncDeleteCareer = (payload) => async (dispatch, getState) => {
  try {
    await deleteCareerRequest(payload.id);
    const currentUser = selectCurrentUser(getState())
    dispatch(
      deleteCareer.success({
        careerId: payload.id,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                career_experiences: (list = []) =>
                  list.filter((item) => item !== payload.id),
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    dispatch(deleteCareer.failure(err));
    throw err;
  }
}