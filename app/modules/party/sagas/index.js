import { eventChannel } from 'redux-saga';
import { select, take, put, fork } from 'redux-saga/effects';
import { normalize, denormalize } from 'normalizr';

import { contact as contactSchema } from '@/schema';

import { selectEntities } from '@/modules/entity/selectors';
import { selectCurrentUser } from '@/modules/auth/selectors';
// import { isMobile } from '@/modules/device-info';

import Modal from '@feat/feat-ui/lib/modal';

import { createContactWithUser } from '../utils/contact';

import {
  getFeatUnreadCount,
  openChatRoomWithUser,
  showIM,
  changeRoom,
  moveContactToInbox,
  addTempContact,
  changeTab,
  focusRoomEditor,
  initMessageReply,
} from '../actions';

import { selectInboxContactList, selectArchiveContactList } from '../selectors';

import {
  CONTACT_LIST_STATUS_BLACK,
  IM_TAB_INBOX,
  MESSAGE_TYPE_FRIEND_IM,
  MESSAGE_TYPE_GROUP_IM,
  MESSAGE_TYPE_GROUP_PM,
} from '../constants';

import { getRoomId } from '../utils/room';

import messageSaga from './messageSaga';
import roomSaga from './roomSaga';
import contactSaga from './contactSaga';
import groupSaga from './groupSaga';
import uiSaga from './uiSaga';
import channelSaga from './channel';

function* watchConsult() {
  while (true) {
    const action = yield take(openChatRoomWithUser);
    const targetUser = action.payload;
    const currentUser = yield select(selectCurrentUser);
    let isTempContact;
    if (targetUser.uid === currentUser.uid) {
      logging.warn('should not consult self');
      continue;
    }
    const inboxContactList = yield select(selectInboxContactList);

    const archiveContactList = yield select(selectArchiveContactList);
    const entities = yield select(selectEntities);
    const inboxContacts = denormalize(
      inboxContactList,
      [contactSchema],
      entities,
    );
    const archiveContacts = denormalize(
      archiveContactList,
      [contactSchema],
      entities,
    );
    let targetContact = inboxContacts.find(
      (contact) => contact.friend === targetUser.uid,
    );
    // check archive contact
    if (!targetContact) {
      targetContact =
        archiveContacts &&
        archiveContacts.find((contact) => contact.friend === targetUser.uid);
      if (targetContact && targetContact.status !== CONTACT_LIST_STATUS_BLACK) {
        yield put(
          moveContactToInbox({
            contactId: targetContact.id,
          }),
        );
      } else if (
        targetContact &&
        targetContact.status === CONTACT_LIST_STATUS_BLACK
      ) {
        Modal.info({
          title: 'Info',
          content:
            'Wanna send message to blacked user? Please unblack user first.',
        });
        continue;
      }
    }
    // create temp contact
    if (!targetContact) {
      isTempContact = true;
      targetContact = createContactWithUser(targetUser);
      const normalized = normalize(targetContact, contactSchema);
      yield put(
        addTempContact({
          contactId: normalized.result,
          entities: normalized.entities,
        }),
      );
    }

    yield put(changeTab(IM_TAB_INBOX));
    const roomId = getRoomId(targetContact);
    yield put(
      changeRoom({
        roomId,
        isTempContact,
        contact: targetContact,
      }),
    );
    yield put(showIM());
    yield put(focusRoomEditor({ roomId }));
  }
}

function* wacthMessageClicked() {
  const chan = eventChannel((emitter) => {
    const listner = (e) => {
      const { contact, message } = e.detail;
      if (
        message.message_type === MESSAGE_TYPE_FRIEND_IM ||
        message.message_type === MESSAGE_TYPE_GROUP_IM ||
        message.message_type === MESSAGE_TYPE_GROUP_PM
      ) {
        const roomId = getRoomId(contact);
        emitter(
          initMessageReply({
            roomId,
            contact,
            message,
          }),
        );
        // if (isMobile()) {
        //   history.push(`/party/room/${roomId}`);
        // }
      }
      // TODO: demand message clicked.
    };
    window.addEventListener('party-message-clicked', listner);
    return () => {
      window.removeEventListener('party-message-clicked', listner);
    };
  });
  try {
    while (true) {
      const action = yield take(chan);
      yield put(action);
    }
  } catch (err) {
    logging.error(err);
  } finally {
    chan.close();
  }
}

function* partySaga() {
  yield fork(channelSaga);
  yield fork(messageSaga);
  yield fork(roomSaga);
  yield fork(contactSaga);
  yield fork(groupSaga);
  yield fork(uiSaga);
  yield fork(watchConsult);
  yield fork(wacthMessageClicked);
  // TODO: update party init;
  yield put(getFeatUnreadCount());
}

export default partySaga;
