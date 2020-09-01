import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'

import {
  getEducations as fetchEducationsRequest,
  addEducation as addEducationRequest,
  deleteEducation as deleteEducationRequest,
} from '@/client/user'

import { selectCurrentUser } from '@/modules/auth/selectors'

import {
  userInfo as userInfoSchema,
  education as educationSchema,
} from '@/schema'


export const NS = 'SETTINGS/EDU'

export const fetchEducations = createRoutine(`${NS}/FETCH_USER_DATA`);
export const createEducation = createRoutine(`${NS}/CREATE`);
export const deleteEducation = createRoutine(`${NS}/DELETE`);

export const asyncFetchEducations = () => async (dispatch, getState) => {
  dispatch(fetchEducations.trigger());
  try {
    dispatch(fetchEducations.request());
    const { data } = await fetchEducationsRequest();
    const normalized = normalize(data, [educationSchema]);
    const currentUser = selectCurrentUser(getState())
    dispatch(fetchEducations.success({
      list: normalized.result,
      entities: normalized.entities,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: (info = {}) => ({
              ...info,
              educations: normalized.result,
            }),
          },
        },
      ],
    }))
  } catch (err) {
    dispatch(fetchEducations.failure(err));
    throw err;
  } finally {
    dispatch(fetchEducations.fulfill());
  }
}

export const asyncCreateEducation = (payload) => async (dispatch, getState) => {
  try {
    const { data: education } = await addEducationRequest(payload);
    const normalized = normalize(education, educationSchema);
    const currentUser = selectCurrentUser(getState())
    dispatch(
      createEducation.success({
        educationId: normalized.result,
        entities: normalized.entities,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                educations: (list = []) => [...list, education.id],
              },
            },
          },
        ],
      }),
    );
    
  } catch (err) {
    dispatch(createEducation.failure(err));
    throw err;
  }
}

export const asyncDeleteEducation = (payload) => async (dispatch, getState) => {
  try {
    await deleteEducationRequest(payload.id);
    const currentUser = selectCurrentUser(getState())
    dispatch(
      deleteEducation.success({
        educationId: payload.id,
        entityMutators: [
          {
            [userInfoSchema.key]: {
              [currentUser.uid]: {
                educations: (list = []) =>
                  list.filter((item) => item !== payload.id),
              },
            },
          },
        ],
      }),
    );
  
    return { educationId: payload.id };
  } catch (err) {
    dispatch(deleteEducation.failure(err));
    throw err;
  }
}