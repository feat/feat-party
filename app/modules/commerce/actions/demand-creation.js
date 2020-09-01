import { createRoutine, promisifyRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';

const NS = 'EXC/DEMAND_CREATION';

export const initDemandCreation = createAction(`${NS}/INIT`);
export const exitDemandCreation = createAction(`${NS}/EXIT`);
export const confirmDemandCreation = createRoutine(
  `${NS}/CONFIRM_DEMAND_CREATION`,
);
export const confirmDemandCreationPromiseCreator = promisifyRoutine(
  confirmDemandCreation,
);
