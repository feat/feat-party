import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';

const NS = 'EXC';

export const initOrderCreation = createAction(`${NS}/ORDER_CREATION/INIT`);

export const setCreationStep = createAction(`${NS}/SET_CREATION_STEP`);

export const exitOrderCreation = createAction(`${NS}/ORDER_CREATION/EXIT`);

export const setOrderReservation = createRoutine(
  `${NS}/ORDER_CREATION/SET_RESERVATION`,
);
export const setOrderAddress = createRoutine(
  `${NS}/ORDER_CREATION/SET_ADDRESS`,
);

export const createOrder = createRoutine(`${NS}/CREATE_ORDER`);
export const createReviewOrder = createRoutine(`${NS}/CREATE_REVIEW_ORDER`);
export const submitAddressForm = createRoutine(`${NS}/SUBMIT_ADDRESS_FORM`);

export const fetchFreePeriods = createRoutine(`${NS}/FETCH_FREE_PERIODS`);
