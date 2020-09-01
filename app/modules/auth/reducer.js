import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import {
  updateUserSecurityInfo,
} from '@/modules/settings/actions/security'

import {
  setCurrentUser,
  openAuthModal,
  closeAuthModal,
  authRequired,
} from './actions';

const initialState = {
  token: undefined,
  user: undefined,
  userMeta: null,
};

export default handleActions(
  {
    [setCurrentUser]: (state, action) => ({
      ...state,
      user: action.payload.user,
      userMeta: action.payload.meta,
    }),
    [updateUserSecurityInfo.SUCCESS]: (state) => update(state, {
      userMeta: {
        security_question_initialized: {
          $set: true,
        },
      },
    }),
    [openAuthModal]: (state, action) => ({
      ...state,
      isAuthModalOpened: true,
      next: action.payload.nextAction,
    }),
    [authRequired]: (state, action) => ({
      ...state,
      next: action.payload,
    }),
    [closeAuthModal]: (state) => ({
      ...state,
      isAuthModalOpened: false,
    }),
  },
  initialState,
);

export const REDUCER_KEY = 'auth';
