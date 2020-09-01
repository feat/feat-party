import { combineReducers } from 'redux';

import ui from './ui';
import inboxContact from './inboxContact';
import archiveContact from './archiveContact';
// import rooms from './rooms';
// import requests from './requests';
import roomInfo from './roomInfo';
import roomInbox from './roomInbox';
import roomArchive from './roomArchive';

export const REDUCER_KEY = 'party';

export default combineReducers({
  ui,
  inboxContact,
  archiveContact,
  // rooms,
  // requests,
  roomInfo,
  roomInbox,
  roomArchive,
});
