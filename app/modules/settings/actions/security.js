import { createRoutine } from 'redux-saga-routines'

// import notification from '@feat/feat-ui/lib/notification';

import {
  getUserSecurityInfo as fetchUserSecurityInfoRequest,
  updateUserSecurityInfo as updateUserSecurityInfoRequest,
  verifyUserSecurityInfo as verifyUserSecurityInfoRequest,
} from '@/client/user'

const NS = 'SETTINGS/SECURITY';

export const fetchUserSecurityInfo = createRoutine(`${NS}/FETCH_INFO`);
export const updateUserSecurityInfo = createRoutine(`${NS}/UPDATE`);

export const asyncFetchUserSecurityInfo = () => async (dispatch) => {
  dispatch(fetchUserSecurityInfo.trigger());
  try {
    dispatch(fetchUserSecurityInfo.request());
    const { data } = await fetchUserSecurityInfoRequest();
    dispatch(fetchUserSecurityInfo.success(data));
  } catch (err) {
    dispatch(fetchUserSecurityInfo.failure(err));
    throw err;
  } finally {
    dispatch(fetchUserSecurityInfo.fulfill());
  }
}

export const asyncUpdateUserSecurityInfo = (payload) => async (dispatch) => {
  //   const blockState = selectSecurityBlockState(getState());
  if (payload.new_question && payload.new_answer) {
    try {
      await verifyUserSecurityInfoRequest({
        question: payload.question,
        answer: payload.answer,
      });
    } catch (err) {
      dispatch(updateUserSecurityInfo.failure(err));
      throw err;
    }
  }

  try {
    const { data } = await updateUserSecurityInfoRequest({
      question: payload.new_question || payload.question,
      answer: payload.new_answer || payload.answer,
    });
    dispatch(updateUserSecurityInfo.success(data));
  } catch (err) {
    dispatch(updateUserSecurityInfo.failure(err));
    throw err;
  } finally {
    dispatch(updateUserSecurityInfo.fulfill());
  }

}