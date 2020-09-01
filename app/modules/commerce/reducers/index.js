import { combineReducers } from 'redux';

import creation from './creation';
import ui from './ui';
import user from './user';
import payment from './payment';
import purchaseDash from './purchase-dash';
import salesDash from './sales-dash';
import demandDash from './demand-dash';
import opportunityDash from './opportunity-dash';
import demand from './demand';
import order from './order';
import dash from './dash';

export default combineReducers({
  creation,
  ui,
  user,
  order,
  payment,
  demand,
  // dashbaord related:
  // common info
  // list requests:
  purchaseDash,
  salesDash,
  demandDash,
  opportunityDash,
  dash,
});

export const REDUCER_KEY = 'commerce';
