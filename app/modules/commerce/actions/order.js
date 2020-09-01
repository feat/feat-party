import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

const NS = `COMMERCE/ORDER`;

export const applyTransition = createRoutine(`${NS}/APPLY_TRANSITION`);

export const fetchOrderInfo = createRoutine(`${NS}/FETCH_ORDER_INFO`);

export const receiveOrderInfo = createAction(`${NS}/RECEIVE_ORDER_INFO`);
export const orderUpdated = createAction(`${NS}/ORDER_UPDATED`);
export const orderSignal = createAction(`${NS}/ORDER_SIGNAL`);
