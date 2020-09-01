import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'

import {
  getLanguages as getLanguagesRequest,
  addLanguage as addLanguageRequest,
  deleteLanguage as deleteLanguageRequest,
} from '@/client/user'

import {
  userInfo as userInfoSchema,
  language as languageSchema,
} from '@/schema'

import { selectCurrentUser } from '@/modules/auth/selectors';

export const NS = 'SETTINGS/LANG'

export const fetchLanguages = createRoutine(`${NS}/FETCH_USER_DATA`);
export const createLanguage = createRoutine(`${NS}/CREATE`);
export const deleteLanguage = createRoutine(`${NS}/DELETE`);

export const asyncFetchLanguages = () => async (dispatch, getState) => {
  dispatch(fetchLanguages.trigger());
  try {
    dispatch(fetchLanguages.request());
    const { data } = await getLanguagesRequest();
    const normalized = normalize(data, [languageSchema]);
    const currentUser = selectCurrentUser(getState())
    dispatch(fetchLanguages.success({
      list: normalized.result,
      entities: normalized.entities,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: (info = {}) => ({
              ...info,
              languages: normalized.result,
            }),
          },
        },
      ],
    }))
  } catch (err) {
    dispatch(fetchLanguages.failure(err));
  } finally {
    dispatch(fetchLanguages.fulfill());
  }
}

export const asyncCreateLanguage = (payload) => async (dispatch, getState) => {
  try {
    const { data } = await addLanguageRequest(payload);
    const normalized = normalize(data, languageSchema);
    const currentUser = selectCurrentUser(getState())
    dispatch(createLanguage.success({
      languageId: normalized.result,
      entities: normalized.entities,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: {
              languages: (list = []) => [...list, normalized.result],
            },
          },
        },
      ],
    }));
  } catch (err) {
    dispatch(createLanguage.failure(err));
    throw err;
  }
}

export const asyncDeleteLanguage = (payload) => async (dispatch, getState) => {
  try {
    await deleteLanguageRequest(payload.id);
    const currentUser = selectCurrentUser(getState());
    dispatch(deleteLanguage.success({
      languageId: payload.id,
      entityMutators: [
        {
          [userInfoSchema.key]: {
            [currentUser.uid]: {
              languages: (list = []) =>
                list.filter((item) => item !== payload.id),
            },
          },
        },
      ],
    }));
    
  } catch (err) {
    dispatch(deleteLanguage.failure(err));
    throw err;
  }
}