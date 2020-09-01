import { denormalize } from 'normalizr';
import get from 'lodash/get';

import { selectEntities } from '@/modules/entity/selectors';
import { userList as userListSchema } from '@/schema';

import { REDUCER_KEY } from './reducers';

export const selectUserList = (state) => {
  const entityMap = selectEntities(state);
  const tempList = get(state, [REDUCER_KEY, 'userList']);
  return denormalize(tempList, [userListSchema], entityMap);
};
