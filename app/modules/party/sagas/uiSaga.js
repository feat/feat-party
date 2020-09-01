import { select, put, takeEvery } from 'redux-saga/effects';


import {
  changeRoom,
  getGroupMembers,
  roomMarkAsRead,
  initMessageReply,
} from '../actions';

import { selectRoomInfo } from '../selectors';
import { getContactEntityId, isGroupContact } from '../utils/contact';

export function* changeRoomFlow(action) {
  // select room info check if room initialized
  const { payload } = action;
  const roomInfo = yield select((state) => selectRoomInfo(state, payload));
  if (
    payload.contact &&
    isGroupContact(payload.contact) &&
    (!roomInfo || (roomInfo.shouldRefreshMember || !roomInfo.memberFetched))
  ) {
    yield put(
      getGroupMembers({
        roomId: payload.roomId,
        groupId: getContactEntityId(payload.contact),
      }),
    );
  }
  if (payload.contact && payload.contact.unread_count) {
    yield put(roomMarkAsRead(payload));
  }
}

export default function* uiSaga() {
  yield takeEvery(changeRoom, changeRoomFlow);
  yield takeEvery(initMessageReply, changeRoomFlow);
}
