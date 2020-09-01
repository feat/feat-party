import { fork } from 'redux-saga/effects';

import creationService from './creation';
import paymentService from './payment';
import orderService from './order';
import userService from './user';
// TODO: inject in component
import common from './common';
import demandCreation from './demand-creation';

export default function* commerceService() {
  yield fork(creationService);
  yield fork(paymentService);
  yield fork(orderService);
  yield fork(userService);
  yield fork(common);
  yield fork(demandCreation);
}
