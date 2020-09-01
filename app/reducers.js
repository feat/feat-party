import { combineReducers } from 'redux';

import entityReducer from '@/modules/entity/reducer';
import menuReducer, {
  REDUCER_KEY as MENU_REDUCER_KEY,
} from '@/modules/menu/reducer';

import authReducer, {
  REDUCER_KEY as AUTH_REDUCER_KEY,
} from '@/modules/auth/reducer';
import languageReducer, {
  REDUCER_KEY as LANGUAGE_REDUCER_KEY,
} from '@/modules/language/reducer';
import commentReducer, {
  REDUCER_KEY as COMMENT_REDUCER_KEY,
} from '@/modules/comment/reducers';
import likeReducer, {
  REDUCER_KEY as LIKE_REDUCER_KEY,
} from '@/modules/like/reducer';

import commerceReducer, {
  REDUCER_KEY as COMMERCE_REDUCER_KEY,
} from '@/modules/commerce/reducers';

import choicesReducer from '@/modules/choices/reducer';
import partyReducer from '@/modules/party/reducers';

import userInfoReducer, {
  REDUCER_KEY as USER_INFO_REDUCER_KEY,
} from '@/modules/user/reducer';
import termReducer, {
  REDUCER_KEY as TERM_REDUCER_KEY,
} from '@/modules/terms/reducer';

/** Pages */

import settingsReducer, {
  REDUCER_KEY as SETTING_REDUCER_KEY,
} from '@/modules/settings/reducers';

import userPageReducer, {
  REDUCER_KEY as USERPAGE_REDUCER_KEY,
} from '@/routes/UserPage/reducers';

export default function createRecuder(injectedReducers) {
  return combineReducers({
    entities: entityReducer,
    choices: choicesReducer,
    party: partyReducer,

    [MENU_REDUCER_KEY]: menuReducer,
    [COMMENT_REDUCER_KEY]: commentReducer,
    [LIKE_REDUCER_KEY]: likeReducer,
    [AUTH_REDUCER_KEY]: authReducer,
    [LANGUAGE_REDUCER_KEY]: languageReducer,
    [COMMERCE_REDUCER_KEY]: commerceReducer,
    [USER_INFO_REDUCER_KEY]: userInfoReducer,
    [TERM_REDUCER_KEY]: termReducer,

    // pages
    [SETTING_REDUCER_KEY]: settingsReducer,
    [USERPAGE_REDUCER_KEY]: userPageReducer,

    ...injectedReducers,
  });
}
