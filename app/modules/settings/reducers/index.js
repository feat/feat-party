import { combineReducers } from 'redux';

import identityBlock from './identity';
import languageBlock from './language';
import educationBlock from './education';
import careerBlock from './career';
import honorBlock from './honor';
import accountBlock from './account';
import signBoardBlock from './signBoard';
import workplaceBlock from './workplace';
import expertiseBlock from './expertise';
import openTimeBlock from './openTime';
import wechatBindingBlock from './wechatBinding';
import securityBlock from './security';
import paymentConfigBlock from './payment';
import common from './common';

export const REDUCER_KEY = 'settings';

const reducer = combineReducers({
  common,
  identityBlock,
  languageBlock,
  educationBlock,
  careerBlock,
  honorBlock,
  accountBlock,
  signBoardBlock,
  workplaceBlock,
  expertiseBlock,
  openTimeBlock,
  wechatBindingBlock,
  securityBlock,
  paymentConfigBlock,
})

export default reducer;