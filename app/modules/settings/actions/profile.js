import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr'

import {
  getCurrentUserInfo as getBasicInfoRequest,
  getProfile as getProfileRequest,
  updateProfile as updateProfileRequest,
  postAvatar as postAvatarRequest,
  postOriginAvatar as postOriginAvatarRequest,
} from '@/client/user'

import ApiError from '@/errors/ApiError'

import { 
  user as userSchema,
  profile as profileSchema } from '@/schema';

export const NS = 'SETTINGS/PROFILE';

export const fetchProfile = createRoutine(`${NS}/FETCH`);
export const updateProfile = createRoutine(`${NS}/UPDATE`);
export const updateAvatar = createRoutine(`${NS}/UPDATE_AVATAR`);

export const asyncFetchProfile = (payload) => async (dispatch) => {
  dispatch(fetchProfile.trigger());
  try {
    dispatch(fetchProfile.request());
    const { data } = await getProfileRequest(payload)
    const normalized = normalize(data, profileSchema);
    dispatch(fetchProfile.success({
      entities: normalized.entities,
    }));
  } catch (err) {
    dispatch(fetchProfile.failure(err))
    throw err;
  } finally {
    dispatch(fetchProfile.fulfill())
  }
}

export const asyncUpdateProfile = (payload) => async (dispatch) => {
  const { userId, data } = payload;
  try {
    const { data: newProfile } = await updateProfileRequest(userId, data);
    const normalized = normalize(newProfile, profileSchema);
    const entityMutators = [];

    if (data.name_order !== undefined || data.firstname || data.lastname) {
      entityMutators.push({
        [userSchema.key]: {
          [userId]: (user)  => ({
            ...user,
            username: newProfile.username,
          }),
        },
      })
    }
    dispatch(
      updateProfile.success({
        data: newProfile,
        entities: normalized.entities,
        entityMutators,
      }),
    );
  } catch (err) {
    dispatch(updateProfile.failure(err));
    throw err;
  }
}

export const asyncUpdateAvatar = (payload) => async (dispatch) => {
  const { userId, cropInfo, croppedFile, originFile } = payload;
  try {
    if (originFile) {
      await postOriginAvatarRequest(originFile);
    }
    await postAvatarRequest(croppedFile);
    const { data: newProfile } = await updateProfileRequest(userId, { crop_info: cropInfo });

    dispatch(updateAvatar.success({ data: newProfile }));
    dispatch(asyncFetchUserBasicInfo())
  } catch (err) {
    dispatch(updateAvatar.failure());
    throw err;
  }
}

const asyncFetchUserBasicInfo = () => async (dispatch) => {
  try {
    const { data } = await getBasicInfoRequest();
    const normalized = normalize(data, userSchema);
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: normalized,
    })
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}