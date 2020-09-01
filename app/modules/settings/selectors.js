import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';

import { 
  profile as profileSchema, 
  language as languageSchema, 
  userInfo as userInfoSchema,
  education as educationSchema,
  career as careerSchema,
  honor as honorSchema,
  address as addressSchema,
  expertise as expertiseSchema,
} from '@/schema';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectEntities } from '@/modules/entity/selectors';

import { REDUCER_KEY } from './reducers';

export const selectProfile = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    if (!user.uid) {
      return null;
    }
    return denormalize(user.uid, profileSchema, entities);
  }
)

export const selectLanguages = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const list = get(entities, [userInfoSchema.key, user.uid, 'languages']);
    if (!list) {
      return null;
    }
    return denormalize(list, [languageSchema], entities);
  }
)

export const selectEducations = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const list = get(entities, [userInfoSchema.key, user.uid, 'educations']);
    if (!list) {
      return null;
    }
    return denormalize(list, [educationSchema], entities);
  }
)

export const selectCareers = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const list = get(entities, [userInfoSchema.key, user.uid, 'career_experiences']);
    if (!list) {
      return null;
    }
    return denormalize(list, [careerSchema], entities);
  }
)

export const selectHonors = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const list = get(entities, [userInfoSchema.key, user.uid, 'honors_awards']);
    if (!list) {
      return null;
    }
    return denormalize(list, [honorSchema], entities);
  }
)

export const selectOpenTime = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const list = get(entities, [userInfoSchema.key, user.uid, 'open_time', 'open_time']);
    return list;
  }
)

export const selectWorkplace = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const id = get(entities, [userInfoSchema.key, user.uid, 'workplace']);
    if (!id) {
      return null;
    }
    return denormalize(id, addressSchema, entities);
  }
)

export const selectExpertises = createSelector(
  selectCurrentUser,
  selectEntities,
  (user, entities) => {
    const id = get(entities, [userInfoSchema.key, user.uid, 'expertise']);
    if (!id) {
      return null;
    }
    return denormalize(id, [expertiseSchema], entities);
  }
)

export const selectSignBoardData = (state) => {
  const currentUser = selectCurrentUser(state);
  const profile = get(state, ['entities', profileSchema.key, currentUser.uid]);
  if (!profile) {
    return null;
  }
  return {
    commercial_sign: profile.commercial_sign,
    promote_words: profile.promote_words,
  }
}

export const selectIdentityBlockState = (state) => get(state, [REDUCER_KEY, 'identityBlock']);
export const selectLanguageBlockState = (state) => get(state, [REDUCER_KEY, 'languageBlock']);
export const selectEducationBlockState = (state) => get(state, [REDUCER_KEY, 'educationBlock']);
export const selectCareerBlockState = (state) => get(state, [REDUCER_KEY, 'careerBlock']);
export const selectHonorBlockState = (state) => get(state, [REDUCER_KEY, 'honorBlock']);
export const selectAccountBlockState = (state) => get(state, [REDUCER_KEY, 'accountBlock']);
export const selectSignBoardBlockState = (state) => get(state, [REDUCER_KEY, 'signBoardBlock']);
export const selectOpenTimeBlockState = (state) => get(state, [REDUCER_KEY, 'openTimeBlock']);
export const selectWorkplaceBlockState = (state) => get(state, [REDUCER_KEY, 'workplaceBlock']);
export const selectExpertiseBlockState = (state) => get(state, [REDUCER_KEY, 'expertiseBlock']);
export const selectWechatBindingBlockState = (state) => get(state, [REDUCER_KEY, 'wechatBindingBlock']);
export const selectSecurityBlockState = (state) => get(state, [REDUCER_KEY, 'securityBlock']);
export const selectPaymentConfigBlockState = (state) => get(state, [REDUCER_KEY, 'paymentConfigBlock']);
export const selectCommonState = (state) => get(state, [REDUCER_KEY, 'common']);
export const selectUserCurrency = (state) => get(state, [REDUCER_KEY, 'paymentConfigBlock', 'basic', 'currency']);