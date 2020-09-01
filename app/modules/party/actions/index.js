import { createAction } from 'redux-actions';

const NS = 'PARTY';

export * from './ui';
export * from './contact';
export * from './message';
export * from './group';
export * from './room';

export const initParty = createAction(`${NS}/INIT_PARTY`);
export const openChatRoomWithUser = createAction(
  `${NS}/OPEN_CHAT_ROOM_WITH_USER`,
);
export const closeChatRoomWithUser = createAction(
  `${NS}/CLOSE_CHAT_ROOM_WITH_USER`,
);
