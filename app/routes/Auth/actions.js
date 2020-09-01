// import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

export const login = createRoutine('auth/LOGIN');

export const loginWithPhone = createRoutine('auth/LOGIN_WITH_PHONE');

export const registerWithPhone = createRoutine('auth/REGISTER_WITH_PHONE');
